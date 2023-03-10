class Histogram {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 325,
            containerHeight: _config.containerHeight || 300,
            margin: { top: 25, right: 20, bottom: 65, left: 70 },
            tooltipPadding: _config.tooltipName || 15
        }

        this.data = _data

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.chart = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
        vis.yAxis = d3.axisLeft(vis.yScale)

        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
        
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height + 50)
            .attr('x', vis.config.containerWidth / 2)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text("Distance (parsecs)")
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', -50)
            .attr('x', -vis.height + 70)
            .attr('dy', '.71em')
            .attr('transform', `rotate(-90)`)
            .text("Number of Exoplanets")

        vis.chart.append('text')
            .attr('class', 'chart-title')
            .attr('y', -20)
            .attr('x', 60)
            .attr('dy', '.71em')
            .text("Distance from Earth")
    }

    updateVis() {
        let vis = this

        vis.xValue = d => d.sy_dist
        vis.yValue = d => d.length
        
        vis.bins = d3.bin()
        .thresholds(10)
        .value(d => d.sy_dist)
        
        vis.values = vis.bins(vis.data)

        vis.xScale.domain([0, d3.max(vis.values, d => d.x1)])
        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        vis.chart.selectAll('.hist')
            .data(vis.values)
            .join('rect')
                .attr('class', 'hist')
                .attr('fill', '#4FB062')
                .attr('x', 0)
                .attr('transform', d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(vis.yValue(d))})`)
                .attr('width', d => vis.xScale(d.x1) - vis.xScale(d.x0) - 1)
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .on('mouseover', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'block')
                        .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                        .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                        .html(`
                        <p>Bin: ${d.x0} - ${d.x1} Parsecs </p>
                        <p>Count: ${vis.yValue(d)}</p>
                        `)
                }).on('mouseout', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'none')
                })
                
                
        vis.xAxisGroup.call(vis.xAxis)
            .selectAll("text")
            .attr("dx", "-2.5em")
            .attr("dy", ".75em")
            .attr("transform", "rotate(-25)")
        vis.yAxisGroup.call(vis.yAxis)
    }
}