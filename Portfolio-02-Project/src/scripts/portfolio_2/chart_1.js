import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const pie = d3.pie().value(function(d) {
  return d.COUNTS
})

const radius = 60

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#0015BC', '#99a1e4', '#808080', '#D3D3D3', '#E91D0E', '#f48e86'])

const xPositionScale = d3.scalePoint().range([0, width])

d3.csv(require('/data/CookCounts.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {

  const years = datapoints.map(d => d.YEAR)
  console.log(years)

  xPositionScale.domain(years).padding(0.4)

  const nested = d3
    .nest()
    .key(d => d.YEAR)
    .entries(datapoints)
  console.log(nested)

  const container = svg.append('g').attr('transform', 'translate(200,200)')

  svg
    .selectAll('.graph')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      console.log(d)
      return 'translate(' + xPositionScale(d.key) + ',' + height / 2 + ')'
    })
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values

      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', function(d) {
          return arc(d)
        })
        .attr('fill', d => colorScale(d.data.CATEGORY))

        container.append('text')
        .text(d => d.key)
        .attr('x', xPositionScale(d.YEAR))
        .attr('y', height / 3)
        .attr('font-size', 15)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    })


}

// g.append('text')
// .text(d => d.key)
// .attr('x', xPositionScale(d.cities))
// .attr('y', height / 3)
// .attr('font-size', 15)
// .attr('fill', 'black')
// .attr('text-anchor', 'middle')
