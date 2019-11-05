import * as d3 from 'd3'

const margin = { top: 100, left: 50, right: 150, bottom: 30 }

const height = 700 - margin.top - margin.bottom

const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const parseTime = d3.timeParse('%B-%y')

const xPositionScale = d3.scaleLinear().range([0, width])
const yPositionScale = d3.scaleLinear().range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#ffffb3',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69',
    '#fccde5',
    '#d9d9d9',
    '#bc80bd'
  ])

const line = d3
  .line()
  .x(function(d) {
    return xPositionScale(d.datetime)
  })
  .y(function(d) {
    return yPositionScale(d.price)
  })

d3.csv(require('/data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  datapoints.forEach(d => {
    d.datetime = parseTime(d.month)
  })
  const dates = datapoints.map(d => d.datetime)
  const prices = datapoints.map(d => +d.price)
  xPositionScale.domain(d3.extent(dates))
  yPositionScale.domain(d3.extent(prices))
  const nested = d3
    .nest()
    .key(function(d) {
      return d.region
    })
    .entries(datapoints)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'mypath')
    .attr('d', function(d) {
      return line(d.values)
    })
    .attr('stroke', function(d) {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('fill', 'none')

  svg
    .selectAll('circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'mycircle')
    .attr('fill', function(d) {
      return colorScale(d.key)
    })
    .attr('r', 4)
    .attr('cy', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('cx', function(d) {
      return xPositionScale(d.values[0].datetime)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'mytext')
    .attr('y', function(d) {
      return yPositionScale(d.values[0].price)
    })
    .attr('x', function(d) {
      return xPositionScale(d.values[0].datetime)
    })
    .text(function(d) {
      return d.key
    })
    .attr('dx', 6)
    .attr('dy', 4)
    .attr('font-size', '12')

  svg
    .append('text')
    .attr('font-size', '24')
    .attr('text-anchor', 'middle')
    .attr('class', 'main-text')
    .text('U.S. housing prices fall in winter')
    .attr('x', width / 2)
    .attr('y', -40)
    .attr('dx', 40)
  const rectWidth =
    xPositionScale(parseTime('February-17')) -
    xPositionScale(parseTime('November-16'))

  svg
    .append('rect')
    .attr('x', xPositionScale(parseTime('December-16')))
    .attr('y', 0)
    .attr('class', 'myrect')
    .attr('width', rectWidth)
    .attr('height', height)
    .attr('fill', '#C2DFFF')
    .lower()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickFormat(d3.timeFormat('%b %y'))
    .ticks(9)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  d3.select('#blank').on('stepin', function() {
    svg.selectAll('.mypath').attr('stroke-width', 0)
    svg.selectAll('.mycircle').attr('r', 0)
    svg.selectAll('.mytext').attr('font-size', 0)
    svg.selectAll('.myrect').attr('width', 0)
  })

  d3.select('#draw-lines').on('stepin', function() {
    svg.selectAll('.mypath').attr('stroke-width', 2)
    svg.selectAll('.mycircle').attr('r', 4)
    svg.selectAll('.mytext').attr('font-size', 12)
    svg.selectAll('.myrect').attr('width', 0)
  })
  d3.select('#highlight-US').on('stepin', function() {
    svg.selectAll('.mypath').attr('stroke', function(d) {
      if (d.key === 'U.S.') {
        return 'red'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.mycircle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
      .attr('stroke', 'none')
    svg
      .selectAll('.mytext')
      .attr('font-weight', 'bold')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        } else {
          return 'lightgrey'
        }
      })
    svg.selectAll('.myrect').attr('width', 0)
  })
  d3.select('#highlight-others').on('stepin', function() {
    svg.selectAll('.mypath').attr('stroke', function(d) {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (
        d.key === 'U.S.' ||
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return 'lightblue'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.mycircle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        }
        if (
          d.key === 'U.S.' ||
          d.key === 'Mountain' ||
          d.key === 'Pacific' ||
          d.key === 'West South Central' ||
          d.key === 'South Atlantic'
        ) {
          return 'lightblue'
        } else {
          return 'lightgrey'
        }
      })
      .attr('stroke', 'none')
    svg.selectAll('.mytext').attr('fill', function(d) {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (
        d.key === 'U.S.' ||
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return 'lightblue'
      } else {
        return 'lightgrey'
      }
    })
    svg.selectAll('.myrect').attr('width', 0)
  })
  d3.select('#draw-rect').on('stepin', function() {
    svg.selectAll('.mypath').attr('stroke', function(d) {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (
        d.key === 'U.S.' ||
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return 'teal'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.mycircle')
      .attr('fill', function(d) {
        if (d.key === 'U.S.') {
          return 'red'
        }
        if (
          d.key === 'U.S.' ||
          d.key === 'Mountain' ||
          d.key === 'Pacific' ||
          d.key === 'West South Central' ||
          d.key === 'South Atlantic'
        ) {
          return 'teal'
        } else {
          return 'lightgrey'
        }
      })
      .attr('stroke', 'none')
    svg.selectAll('.mytext').attr('fill', function(d) {
      if (d.key === 'U.S.') {
        return 'red'
      }
      if (
        d.key === 'U.S.' ||
        d.key === 'Mountain' ||
        d.key === 'Pacific' ||
        d.key === 'West South Central' ||
        d.key === 'South Atlantic'
      ) {
        return 'teal'
      } else {
        return 'lightgrey'
      }
    })
    svg
      .selectAll('.myrect')
      .attr('width', rectWidth)
      .lower()
    // .style('opacity', 0.5)
  })

  d3.select('#highlight-US').on('stepout', function() {
    svg
      .selectAll('.mypath')
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
      .attr('stroke-width', 2)
      .attr('fill', 'none')
    svg
      .selectAll('.mycircle')
      .attr('fill', function(d) {
        return colorScale(d.key)
      })
      .attr('r', 4)
    svg
      .selectAll('.mytext')
      .attr('font-size', 12)
      .attr('fill', 'dark')
    svg.selectAll('.myrect').attr('width', 0)
  })

  function render() {
    console.log('Rendering')
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    // Do you want it to be full height? Pick one of the two below
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight
    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom
    // Update our scale
    xPositionScale.range([0, newWidth])
    yPositionScale.range([newHeight, 0])
    svg
      .selectAll('.mypath')
      .attr('d', function(d) {
        return line(d.values)
      })
      .attr('stroke', function(d) {
        return colorScale(d.key)
      })
    svg
      .selectAll('.mycircle')
      .attr('cy', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('cx', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
    svg
      .selectAll('.mytext')
      .attr('y', function(d) {
        return yPositionScale(d.values[0].price)
      })
      .attr('x', function(d) {
        return xPositionScale(d.values[0].datetime)
      })
    svg.selectAll('.main-text').attr('x', newWidth / 2)
    const rectWidth =
      xPositionScale(parseTime('February-17')) -
      xPositionScale(parseTime('November-16'))
    svg
      .selectAll('.myrect')
      .attr('x', xPositionScale(parseTime('December-16')))
      .attr('width', rectWidth)
      .attr('height', newHeight)
      .lower()
    const xAxis = d3
      .axisBottom(xPositionScale)
      .tickFormat(d3.timeFormat('%b %y'))
    // svg
    //   .select('.axis')
    //   .select('.x-axis')
    //   .attr('transform', 'translate(0,' + newHeight + ')')
    //   .call(xAxis)
    const yAxis = d3.axisLeft(yPositionScale)
    // svg
    //   .selectAll('.axis')
    //   .selectAll('.y-axis')
    //   .call(yAxis)
    //   .lower()
    svg.select('.x-axis').call(xAxis)
    svg.select('.y-axis').call(yAxis)
  }
  window.addEventListener('resize', render)
  // And now that the page has loaded, let's just try
  // to do it once before the page has resized
  render()
}
