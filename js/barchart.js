class BarChart {
    
    constructor(_config, _data, _discriminator) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 300,
            containerHeight: _config.containerHeight || 300,
            margin: { top: 15, right: 10, bottom: 30, left: 50 }
        }

        this.data = _data
        this.discriminator = _discriminator

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        const BLANK_MSG = "[Blank]"
        const STAR_TYPES = ["A", "F", "G", "K", "M"]

        let xAxisTitle = ""
        let yAxisTitle = ""
        let chartTitle = ""

        switch (vis.discriminator) {
            case "star_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_snum)
                xAxisTitle = "Stars in System"
                yAxisTitle = "Number of Exoplanets"
                chartTitle = "Exoplanets by Stars in its System"
                break
            case "planet_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_pnum)
                xAxisTitle = "Planets in System"
                yAxisTitle = "Number of Exoplanets"
                chartTitle = "Exoplanets by Planets in its System"
                break
            case "star_type":
                vis.values = d3.rollup(vis.data, d => d.length, d => STAR_TYPES.includes(d.st_spectype[0].toUpperCase()) ? d.st_spectype[0].toUpperCase() : BLANK_MSG)
                xAxisTitle = "Star Type"
                yAxisTitle = "Number of Exoplanets"
                chartTitle = "Exoplanets by Star Type"
                break
            case "discovery_method": 
                vis.values = d3.rollup(vis.data, d => d.length, d => d.discoverymethod)
                xAxisTitle = "Discovery Method"
                yAxisTitle = "Number of Exoplanets"
                chartTitle = "Exoplanets by Discovery Method"
                break
        }

        vis.values = Array.from(vis.values)

        vis.chart = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.15)

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
            .attr('y', vis.height - 15)
            .attr('x', vis.width + 10)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(xAxisTitle)
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', 0)
            .attr('x', 0)
            .attr('dy', '.71em')
            .text(yAxisTitle)

    }

    updateVis() {
        let vis = this

        vis.xValue = d => d[0]
        vis.yValue = d => d[1]

        vis.xScale.domain(vis.values.map(d => d[0]).sort())
        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this
        
        vis.chart.selectAll('.bar')
            .data(vis.values)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', 'steelblue')
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .attr('y', d => vis.yScale(vis.yValue(d)) )
                .attr('x', d => vis.xScale(vis.xValue(d)))

        
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}