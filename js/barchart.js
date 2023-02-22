class BarChart {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 300,
            margin: { top: 5, right: 10, bottom: 30, left: 50 }
        }

        this.data = _data

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.values = d3.rollup(vis.data, d => d.length, d => d.sy_snum)

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

        console.log()
        vis.xScale.domain(Array.from(vis.values.keys()).reverse())
        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))])

        vis.renderVis()
    }

    renderVis() {
        let vis = this

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


}