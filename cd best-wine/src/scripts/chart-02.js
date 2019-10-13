import * as d3 from 'd3'

const margin = { top: 50, left: 50, right: 50, bottom: 50 }
const height = 400 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

const svg = d3
  .select('#chart-02')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const bandScale = d3
  .scaleBand()
  .domain([
    'USA',
    'Italy',
    'France',
    'Portugal',
    'Spain',
    'Austria',
    'Argentina',
    'Chile',
    'Greece',
    'Germany',
    'Austalia',
    'South Africa',
    'New Zealand',
    'Israel'
  ])
  .range([0, 350])
  .paddingInner(0.05)

const heightScale = d3
  .scaleLinear()
  .domain([1, 31])
  .range([0, 300])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, height])

d3.csv(require('../data/wine2.csv')).then(ready)

function ready(datapoints) {
  console.log('Data read in:', datapoints)

  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('height', d => heightScale(d.country))
    .attr('fill', 'purple')
    .attr('width', bandScale.bandwidth())
    .attr('x', d => bandScale(d.name))
    .attr('y', function(d) {
      return height - heightScale(d.country)
    })

  let yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  let xAxis = d3.axisBottom(bandScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
}
