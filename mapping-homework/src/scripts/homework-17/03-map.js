import * as d3 from 'd3'
import * as topojson from 'topojson'

var margin = { top: 0, left: 10, right: 10, bottom: 0 }
var height = 500 - margin.top - margin.bottom
var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var colorScale = d3
  .scaleLinear()
  .domain([0, 9000])
  .range(['grey', 'purple'])  

  Promise.all([
    d3.xml(require('/data/hexagons.svg')),
    d3.csv(require('/data/wolves.csv'))
  ])
    .then(ready)
    .catch(err => console.log('Failed on', err))

function ready([hexFile, datapoints]) {
  const imported = d3.select(hexFile).select('svg')


  // Remove the stylesheets Illustrator saved
  imported.selectAll('style').remove()

  // Inject the imported svg's contents into our real svg
  svg.html(imported.html())

  datapoints.forEach(d => {
    svg
      .select('#' + d.province)
      .attr('class', 'hex-group')
      .each(function() {
        d3.select(this).datum(d)
      })
  })

  svg.selectAll('.hex-group').each(function(d) {
    console.log('d is', d)
    const group = d3.select(this)
    group.selectAll('polygon').attr('fill', colorScale(d.wolves))
  })
}
