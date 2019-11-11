import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 150, right: 0, bottom: 0 }

let height = 600 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

let svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)

const colorScale = d3.scaleOrdinal(['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5'])
const radiusScale = d3.scaleSqrt().domain([0,7000]).range([0,15])

Promise.all([
d3.json(require('/data/us_states.topojson')),
d3.csv(require('/data/powerplants.csv'))])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log(json.objects)
  const states = topojson.feature(json, json.objects.us_states)

  // Not sure how to do scale/center/etc?
  // Just use .fitSize to center your map
  // and set everything up nice
  projection.fitSize([width, height], states)

  svg
  .selectAll('.state')
  .data(states.features)
  .enter()
  .append('path')
  .attr('class', 'state')
  .attr('d', path)
  .attr('stroke', 'white')
  .attr('fill', 'lightgrey')

  svg
    .selectAll('.state-label')
    .data(states.features)
    .enter()
    .append('text')
    .attr('class', 'state-label')
    .text(d => d.properties.abbrev)
    .attr('transform', d => {
      // hey d3, find the middle of this shape
      // d3.geoCentroid(d)
      const coords = projection(d3.geoCentroid(d))
      return `translate(${coords})`
    })
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', 10)

    svg.selectAll('circle')  
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', d =>{
      return colorScale(d.PrimSource)
    })
    .attr('r', d =>{
      return radiusScale(d.Total_MW)

    })
    .attr('opacity', 0.5)
    .attr('transform', d => {
      const coords = projection([d.Longitude, d.Latitude])
      return `translate(${coords})`
    })

}