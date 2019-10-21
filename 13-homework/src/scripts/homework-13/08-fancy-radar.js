import * as d3 from 'd3'

const margin = { top: 20, left: 0, right: 0, bottom: 0 }
const height = 450 - margin.top - margin.bottom
const width = 400 - margin.left - margin.right

const svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 150

// If I sell 0 houses, I have a radius of 0
// If I sell 70 houses, I have a radius of... radius? 150
const radiusScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, radius])

const line = d3
  .radialLine()
  .angle(d => angleScale(d.name))
  .radius(d => radiusScale(d.value))

d3.csv(require('/data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  const player = datapoints[0]

  const customDatapoints = [
    { name: 'minutes played', value: player.MP },
    { name: 'points', value: player.PTS },
    { name: 'field goals', value: player.FG },
    { name: '3 pointers', value: player['3P'] },
    { name: 'free throws', value: player.FT },
    { name: 'rebounds', value: player.TRB },
    { name: 'assists', value: player.AST },
    { name: 'steals', value: player.STL },
    { name: 'blocks', value: player.BLK }
  ]

  const categories = customDatapoints.map(d => d.name)
  angleScale.domain(categories)

  svg
    .append('path')
    .datum(player)
    .attr('d', line)
    .attr('fill', 'pink')
    .attr('opacity', 0.5)
    .attr('stroke', 'black')

  svg
    .append('circle')
    .attr('r', 3)
    .attr('cx', 0)
    .attr('cy', 0)
}
