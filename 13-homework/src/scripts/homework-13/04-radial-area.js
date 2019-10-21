import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
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
// I give you a month
// you give me back a number of radians
const angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

const radius = 150
// If I sell 0 houses, I have a radius of 0
// If I sell 70 houses, I have a radius of... radius? 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 75])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.month_name))
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)
  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')

  const bands = [20, 30, 40, 50, 60, 70, 80, 90]
  const labels = [30, 50, 70, 90]

  svg
    .selectAll('.bands')
    .data(bands)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('r', d => radiusScale(d))
    .lower()

  svg
    .selectAll('.label')
    .data(labels)
    .enter()
    .append('text')
    .text(d => d)
    .attr('y', d => -radiusScale(d))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  svg
    .append('text')
    .text('NYC')
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-weight', 'bold')
    .style('font-size', '24px')
}
