import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'

d3.tip = d3Tip

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleLinear()
  .domain([10, 150])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([89, 100])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .domain(['White', 'Red', 'Sparkling', 'Rosé', 'Dessert', 'Port', 'Sherry'])
  .range(['yellow', 'purple', 'green', 'pink', 'brown', 'brown', 'brown'])


const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return `${d.name}`
  })

svg.call(tip)

d3.csv(require('../data/wine2.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 5)
    .attr('cx', d => xPositionScale(d.price))
    .attr('cy', d => yPositionScale(d.rating))
    .attr('fill', d => colorScale(d.color))
    .attr('opacity', 0.5)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  const xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.format('$,d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
