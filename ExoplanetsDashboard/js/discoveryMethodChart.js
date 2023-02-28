class DiscoveryTypeChart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data) {
    // Configuration object with defaults
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1800,
      containerHeight: _config.containerHeight || 200,
      margin: _config.margin || { top: 10, right: 5, bottom: 25, left: 30 },
      reverseOrder: _config.reverseOrder || false,
      tooltipPadding: _config.tooltipPadding || 15
    }
    this.data = _data;
    this.initVis();
  }

  /**
   * Initialize scales/axes and append static elements, such as axis titles
   */
  initVis() {
    let vis = this;

    console.log(vis.data)

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;


    // Initialize scales and axes
    // Important: we flip array elements in the y output range to position the rectangles correctly
    vis.yScale = d3.scaleLinear()
      .range([vis.height, 0])

    vis.xScale = d3.scaleBand()
      .range([0, vis.width])
      .paddingInner(0.2);

    vis.xAxis = d3.axisBottom(vis.xScale)
      .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
      .ticks(5)
      .tickSizeOuter(5)
      .tickFormat(d3.formatPrefix('.0000s', 1000));
    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
      .attr('width', vis.config.containerWidth)
      .attr('height', vis.config.containerHeight + 75);

    // SVG Group containing the actual chart; D3 margin convention
    vis.chart = vis.svg.append('g')
      .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${vis.height})`);

    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
      .attr('class', 'axis y-axis');
  }

  /**
   * Prepare data and scales before we render it
   */
  updateVis() {
    let vis = this;

    vis.xAxisG.append('text')
      .attr("transform", "translate(0,0)")
      .attr("y", vis.height - 120)
      .attr("x", vis.width - 925)
      .attr("font-size", "25px")
      .attr("stroke", "black")
      .text("Discovery Type");

    // Reverse column order depending on user selection
    if (vis.config.reverseOrder) {
      vis.data.reverse();
    }

    // Specificy x- and y-accessor functions
    vis.xValue = d => d[0];
    vis.yValue = d => d[1];

    // Set the scale input domains
    vis.xScale.domain(vis.data.map(vis.xValue));
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue) + 1200]);

    vis.renderVis();
  }

  /**
   * Bind data to visual elements
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
      .data(vis.data)
      .join('rect');

    bars.style('opacity', 0.5)
      .style('opacity', 1)
      .attr('class', 'bar')
      .attr('x', d => vis.xScale(vis.xValue(d)))
      .attr('y', d => vis.yScale(vis.yValue(d)))
      .attr('width', vis.xScale.bandwidth())
      .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))

    // Tooltip event listeners
    bars
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('opacity', 1)
          // Format number with million and thousand separator
          .html(`<div class="tooltip-label">Number of Exoplanets</div>${d3.format(',')(d[1])}`);
      })
      .on('mousemove', (event) => {
        d3.select('#tooltip')
          .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
          .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
      })
      .on('mouseleave', () => {
        d3.select('#tooltip').style('opacity', 0);
      });

    // Update axes
    vis.xAxisG
      .transition().duration(1000)
      .call(vis.xAxis);

    vis.yAxisG.call(vis.yAxis);
  }
}

