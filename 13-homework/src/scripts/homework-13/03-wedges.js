import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 400 - margin.top - margin.bottom

const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 150

const colorScale = d3
  .scaleLinear()
  .domain([38, 83])
  .range(['#B6D5E3', '#FDC0CC'])

const radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])
  console.log(datapoints)

  svg
    .selectAll('.polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => colorScale(d.high_temp))

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)

  console.log('everything in the angle scale', angleScale.domain())
}
