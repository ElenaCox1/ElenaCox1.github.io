import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }
const height = 600 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const xPositionScale = d3.scaleLinear().range([0, width])

const parseTime = d3.timeParse('%H:%M')

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 30

const radiusScale = d3
  .scaleLinear()
  .domain([0, 7000])
  .range([0, radius])

const line = d3
  .radialArea()
  .angle(d => angleScale(d.time))
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.total))

d3.csv(require('/data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  console.log(datapoints)

  datapoints.forEach(function(d) {
    d.datetime = parseTime(d.time)
  })

  const times = datapoints.map(d => d.time)
  angleScale.domain(times)

  const timeMax = d3.max(times)
  const timeMin = d3.min(times)

  xPositionScale.domain([timeMin, timeMax])

  datapoints.push(datapoints[0])

  svg
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'lightblue')

  const bands = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '00:00'
  ]

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
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'lightgrey')
    .attr('stroke-width', 2)
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', radiusScale(55000))
    .lower()
}
