class Scatterplot {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 275,
            margin: { top: 25, right: 10, bottom: 40, left: 90 },
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
        
        vis.xScale = d3.scaleLog()
            .range([0, vis.width])

        vis.yScale = d3.scaleLog()
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
            .attr('y', vis.height + 30)
            .attr('x', vis.config.containerWidth / 2)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text("Radius (Earth Radius)")
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', -50)
            .attr('x', -vis.height + 70)
            .attr('dy', '.71em')
            .attr('transform', `rotate(-90)`)
            .text("Mass (Earth Mass)")

        vis.chart.append('text')
            .attr('class', 'chart-title')
            .attr('y', -20)
            .attr('x', 200)
            .attr('dy', '.71em')
            .text("Exoplanet Mass Related to Radius")

    }

    updateVis() {
        let vis = this

        vis.values = vis.data.map(d => {return {
            pl_name: d.pl_name,
            pl_rade: d.pl_rade != 0 ? d.pl_rade : 0.01,
            pl_bmasse: d.pl_bmasse != 0 ? d.pl_bmasse : 0.01,
            color: d.pl_bmasse == 0 || d.pl_rade == 0 ? '#230C33' :  '#4FB062'
        }})

        let ourSolarSystem = [
            {pl_name: "Mercury", pl_rade: 0.1915, pl_bmasse: 0.0553, color: '#E86A92'},
            {pl_name: "Venus", pl_rade: 0.4745, pl_bmasse: 0.815, color: '#E86A92'},
            {pl_name: "Earth", pl_rade: 1, pl_bmasse: 1, color: '#E86A92'},
            {pl_name: "Mars", pl_rade: 0.0535, pl_bmasse: 0.107, color: '#E86A92'},
            {pl_name: "Jupiter", pl_rade: 5.605, pl_bmasse: 317.8, color: '#E86A92'},
            {pl_name: "Saturn", pl_rade: 47.6, pl_bmasse: 95.2, color: '#E86A92'},
            {pl_name: "Uranus", pl_rade: 2.005, pl_bmasse: 14.5, color: '#E86A92'},
            {pl_name: "Neptune", pl_rade: 1.94, pl_bmasse: 17.1, color: '#E86A92'}
        ]
        ourSolarSystem.forEach(planet => vis.values.push(planet))
        
        vis.xValue = d => d.pl_rade
        vis.yValue = d => d.pl_bmasse

        vis.xScale.domain([0.01, d3.max(vis.values, d => vis.xValue(d))]).nice()
        vis.yScale.domain([0.01, d3.max(vis.values, d => vis.yValue(d))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this
        
        vis.chart.selectAll('.point')
            .data(vis.values)
            .join('circle')
                .attr('class', 'point')
                .attr('fill', d => d.color)
                .attr('opacity', '0.7')
                .attr('cy', d => vis.yScale(vis.yValue(d)))
                .attr('cx', d => vis.xScale(vis.xValue(d)))
                .attr('r', 3)
                .on('mouseover', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'block')
                        .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                        .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                        .html(`
                        <p>Planet: ${d.pl_name}</p>
                        <p>Radius: ${vis.xValue(d)} </p>
                        <p>Mass: ${vis.yValue(d)}</p>
                        `)
                }).on('mouseout', (event, d) => {
                    d3.select("#tooltip")
                        .style('display', 'none')
                })
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }
}