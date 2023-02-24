class Histogram {
    
    constructor(_config, _data, _discriminator) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 200,
            containerHeight: _config.containerHeight || 200,
            margin: { top: 5, right: 10, bottom: 30, left: 50 }
        }

        this.data = _data
        this.discriminator = _discriminator

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

        
    }

    updateVis() {
        let vis = this

        console.log(d3.extent(vis.data, d => d.sy_dist))
        
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

        console.log(vis.values)

        vis.chart.selectAll('.bar')
            .data(vis.values)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('x', 0)
                .attr('transform', d => `translate(${vis.xScale(d.x0)}, ${vis.yScale(vis.yValue(d))})`)
                .attr('width', d => vis.xScale(d.x1) - vis.xScale(d.x0) - 1)
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}