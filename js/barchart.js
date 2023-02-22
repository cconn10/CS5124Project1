class BarChart {
    
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

        const BLANK_MSG = "[Blank]"
        const STAR_TYPES = ["A", "F", "G", "K", "M"]

        switch (vis.discriminator) {
            case "star_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_snum)
                break
            case "planet_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_pnum)
                break
            case "star_type":
                vis.values = d3.rollup(vis.data, d => d.length, d => STAR_TYPES.includes(d.st_spectype[0].toUpperCase()) ? d.st_spectype[0].toUpperCase() : BLANK_MSG)
                break
            case "discovery_method": 
                vis.values = d3.rollup(vis.data, d => d.length, d => d.discoverymethod)
                break
        }

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

        
    }

    updateVis() {
        let vis = this

        vis.xValue = d => d[0]
        vis.yValue = d => d[1]

        console.log(vis.values)
        vis.xScale.domain(Array.from(vis.values.keys()).reverse())
        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        console.log(vis.values)

        vis.values.forEach(d => {
            console.log(vis.xScale(vis.xValue(d)))
        });
        
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

    handleData() {
        const BLANK_MSG =  "[Blank]"

        switch (vis.discriminator) {
            case "star_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_snum)
                break
            case "planet_count":
                vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_pnum)
                break
            case "star_type":
                console.log(d3.rollup(vis.data, d => d.length, d => d.st_specType == BLANK_MSG ? BLANK_MSG : d.st_specType[0]))
                vis.values = d3.rollup(vis.data, d => d.length, d => d.st_specType == BLANK_MSG ? BLANK_MSG : d.st_specType[0])
                break
        }
    }

}