class PlanetCount {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 300,
            containerHeight: _config.containerHeight || 300,
            margin: { top: 40, right: 10, bottom: 70, left: 70 },
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

        let xAxisLabel = {x: 150, y: vis.height + 30}
        let yAxisLabel = {x: -vis.height + vis.config.margin.bottom, y: -60}
        let titleLabel = {x: vis.config.margin.right, y: -20}

        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', xAxisLabel.y)
            .attr('x', xAxisLabel.x)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text("Planets in System")
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', yAxisLabel.y)
            .attr('x', yAxisLabel.x)
            .attr('dy', '.71em')
            .attr('transform', `rotate(-90)`)
            .text("Number of Exoplanets")

        vis.chart.append('text')
            .attr('class', 'chart-title')
            .attr('y', titleLabel.y)
            .attr('x', titleLabel.x)
            .attr('dy', '.71em')
            .text("Exoplanets by Planets in its System")

    }

    updateVis() {
        let vis = this

        vis.values = Array.from(d3.rollup(vis.data, d => d.length, d => d.sy_pnum))
        
        vis.xValue = d => d[0]
        vis.yValue = d => d[1]

        vis.xScale.domain(vis.values.map(d => d[0]).sort())
        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this
        
        vis.bars = vis.chart.selectAll('.bar')
            .data(vis.values)
            .join('rect')
                .attr('class', 'bar')
                .attr('fill', '#4FB062')
                .attr('width', vis.xScale.bandwidth())
                .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                .attr('y', d => vis.yScale(vis.yValue(d)) )
                .attr('x', d => vis.xScale(vis.xValue(d)))
                .on('mouseover', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'block')
                        .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                        .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                        .html(`
                        <p>Planets in System: ${vis.xValue(d)}
                        <p>Count: ${vis.yValue(d)}
                        `)
                }).on('mouseout', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'none')
                }).on('click', (event, d) => {
                    filterData(vis.data.filter(f => f.sy_pnum == d[0]))
                })


        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}