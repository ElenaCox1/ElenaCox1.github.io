import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }

const height = 450 - margin.top - margin.bottom

const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-5')
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
// I give you a month
// you give me back a number of radians
const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 70

const radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

const xPositionScale = d3.scaleBand().range([0, width])

const bands = [20, 30, 40, 50, 60, 70, 80, 90]
const labels = [30, 50, 70, 90]

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)

  const cities = datapoints.map(d => d.city)
  console.log(cities)

  const nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  xPositionScale.domain(cities).padding(0.4)

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
      const datapoints = d.values
      datapoints.push(datapoints[0])
      console.log(d)
      const g = d3.select(this)
      g.append('path')
        .datum(datapoints)
        .attr('d', d => line(d))
        .attr('fill', '#c28285')
    })

  g.selectAll('.bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', d => radiusScale(d))
    .lower()

  g.selectAll('.label')
    .data(labels)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
}
