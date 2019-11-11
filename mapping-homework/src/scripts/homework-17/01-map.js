import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 0, right: 0, bottom: 0 }

let height = 500 - margin.top - margin.bottom

let width = 900 - margin.left - margin.right

const colorScale = d3.scaleSequential(d3.interpolateCool).domain([0, 1000000])

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .style('background', 'black')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoMercator()
const graticule = d3.geoGraticule()
const path = d3.geoPath().projection(projection)

Promise.all([
d3.json(require('/data/world.topojson')),
d3.csv(require('/data/world-cities.csv'))])
  .then(ready)
  .catch(err => console.log('Failed on', err))

  function ready([json, datapoints]) {
    console.log(json)
    // console.log(json.objects)
    const countries = topojson.feature(json, json.objects.countries)
    // our .attr('d' needs a PATH variable
    svg
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', 'black')
  
    svg.selectAll('circle')  
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', d =>{
      return colorScale(d.population)
    })
    .attr('r', 1)
    .attr('transform', d => {
      const coords = projection([d.lng, d.lat])
      return `translate(${coords})`
    })

    svg
      .append('path')
      .datum(graticule())
      .attr('d', path)
      .attr('stroke', 'lightgrey')
      .lower()
  }