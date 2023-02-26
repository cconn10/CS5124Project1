class LineChart {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 900,
            containerHeight: _config.containerHeight || 200,
            margin: { top: 15, right: 10, bottom: 30, left: 50 }
        }

        this.data = _data

        this.initVis()
    }

    initVis() {
        let vis = this

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom

        vis.values = Array.from(d3.rollup(vis.data, d => d.length, d=>d.disc_year)).sort((x, y) => x[0] - y[0])

        vis.chart = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)
            .append('g')
                .attr('transform', `translate(${vis.config.margin.left}, ${vis.config.margin.top})`)

        vis.xScale = d3.scaleTime()
            .range([0, vis.width])

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])

        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickFormat(d3.timeFormat("%Y"))
        vis.yAxis = d3.axisLeft(vis.yScale).ticks(5)

        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
        
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
    }

    updateVis() {
        let vis = this

        vis.xValue = d => new Date(`${d[0]}-01-01T00:00:00`)
        vis.yValue = d => d[1]

        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)))

        vis.xScale.domain(d3.extent(vis.values.map(d => vis.xValue(d))))

        vis.yScale.domain([0, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this

        vis.chart.append('path')
            .data([vis.values])
            .attr('class', 'chart-line')
            .attr('stroke', 'black')
            .attr('fill', 'none')
            .attr('d', d => vis.line(d))
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}