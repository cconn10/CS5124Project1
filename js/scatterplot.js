class Scatterplot {
    
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

        console.log(vis.data)

        vis.xValue = d => d.pl_rade
        vis.yValue = d => d.pl_bmasse

        vis.xScale.domain([0, d3.max(vis.data, d => vis.xValue(d))]).nice()
        vis.yScale.domain([0, d3.max(vis.data, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this
        
        vis.chart.selectAll('.point')
            .data(vis.data)
            .join('circle')
                .attr('class', 'point')
                .attr('fill', 'steelblue')
                .attr('cy', d => vis.yScale(vis.yValue(d)) )
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('r', 4)
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}