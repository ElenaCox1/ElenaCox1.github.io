import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 0, left: 20, right: 20, bottom: 0 }

let height = 400 - margin.top - margin.bottom

let width = 700 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoEqualEarth()
const path = d3.geoPath().projection(projection)

// Promise.all([
  d3.json(require('/data/world.topojson'))
  // ,
  // d3.csv(require('/data/world-cities.csv'))])
    .then(ready)
    .catch(err => console.log('Failed on', err))

    function ready(json) {
      console.log(json)
      const countries = topojson.feature(json, json.objects.countries)
      projection.fitSize([width, height], countries)

      svg.append('path')  
      .datum({type: 'Sphere'})
      .attr('d', path)

      svg
      .selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', 'lightgrey')
      .attr('stroke', 'black')
      .style('background', 'lightblue')



    }