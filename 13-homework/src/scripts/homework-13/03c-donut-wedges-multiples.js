import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 400 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 60

const colorScale = d3
  .scaleLinear()
  .domain([38, 83])
  .range(['#B6D5E3', '#FDC0CC'])

const xPositionScale = d3.scalePoint().range([0, width])

const radiusScale = d3
  .scaleLinear()
  .domain([0, 70])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)

  const cities = datapoints.map(d => d.city)
  console.log(cities)

  xPositionScale.domain(cities).padding(0.4)

  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)
  console.log(nested)

  nested.push(nested[0])

  const container = svg.append('g')

  container
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      console.log(d)
      const g = d3.select(this)
      g.selectAll('.polar-bar')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', function(d) {
          return colorScale(d.high_temp)
        })

      g.append('circle')
        .attr('r', 3)
        .attr('cx', 0)
        .attr('cy', 0)

      g.append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.cities))
        .attr('y', height / 3)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    })
}
