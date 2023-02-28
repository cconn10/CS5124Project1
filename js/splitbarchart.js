class SplitBarChart {
    
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 325,
            containerHeight: _config.containerHeight || 275,
            margin: { top: 25, right: 10, bottom: 35, left: 60 },
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


            vis.mainGroupData = Array.from(d3.group(vis.data, d => STAR_TYPES.includes(d.st_spectype[0].toUpperCase()) 
                ? d.st_spectype[0].toUpperCase() 
                : BLANK_MSG)).sort()
    
            vis.values = []
    
            vis.groups = vis.mainGroupData.map(d => d[0])
            vis.subgroups = ["Too Hot", "Habitable", "Too Cold", "Unknown"]
    
            vis.mainGroupData.forEach(d => {
                vis.values.push({group: d[0], subgroups: Array.from(d3.rollup(d[1], v => v.length, v => vis.habitableZone(d[0], v)))})
            })
        vis.xScale = d3.scaleBand()
            .domain(vis.groups)
            .range([0, vis.width])
            .paddingInner(0.15)

        vis.xSubScale = d3.scaleBand()
            .range([0, vis.xScale.bandwidth()])
            .domain(vis.subgroups)
            .padding(0.25)

        vis.yScale = d3.scaleLog()
            .range([vis.height, 0])

        vis.colorScale = d3.scaleOrdinal()
            .range(["#748CAB", "#4FB062", "#E86A92", "#230C33"])
            .domain(vis.subgroups)

        vis.xAxis = d3.axisBottom(vis.xScale).tickSize(0)
        vis.yAxis = d3.axisLeft(vis.yScale)

        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
        
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'axis y-axis')
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', vis.height + 20)
            .attr('x', vis.config.containerWidth / 2)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text("Star Type")
        
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr('y', -50)
            .attr('x', -vis.height + 70)
            .attr('dy', '.71em')
            .attr('transform', `rotate(-90)`)
            .text("Count of Exoplanets")

        vis.chart.append('text')
            .attr('class', 'chart-title')
            .attr('y', -20)
            .attr('x', 40)
            .attr('dy', '.71em')
            .text("Habitable vs Non-habitable")

    }

    updateVis() {
        let vis = this

        vis.xValue = d => d.subgroup
        vis.yValue = d => d.count   

        vis.yScale.domain([0.1, d3.max(vis.values.map(d => d3.max(d.subgroups, v => v[1])))]).nice()

        vis.renderVis()
    }

    renderVis() {
        let vis = this
        
        vis.chart.append('g')
        .selectAll('g')
        .data(vis.values)
        .join("g")
            .attr("transform", d => `translate(${vis.xScale(d.group)}, 0)`)
            .selectAll(".bar")
                .data(d => vis.subgroups.map(function(key) { 
                    return {subgroup: key, count: d.subgroups.some(v => v[0] == key) ? d.subgroups.filter(v => v[0] == key)[0][1] : 0.1, group: d.group}
                }))
                .join('rect')
                    .attr('class', 'bar')
                    .attr('class', d => d.subgroup)
                    .attr('fill', d => vis.colorScale(vis.xValue(d)))
                    .attr('width', vis.xSubScale.bandwidth())
                    .attr('height', d => vis.height - vis.yScale(vis.yValue(d)))
                    .attr('y', d => vis.yScale(vis.yValue(d)))
                    .attr('x', d => vis.xSubScale(vis.xValue(d)))
                    .on('mouseover', (event, d) => {
                        d3.select("#tooltip")
                            .style('display', 'block')
                            .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                            .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                            .html(`
                            <p>Star Type: ${d.group}</p>
                            <p>Is it Habitable?: ${d.subgroup}</p>
                            <p>Count: ${vis.yValue(d)}</p>
                            `)
                    }).on('mouseout', (event, d) => {
                        d3.select("#tooltip")
                            .style('display', 'none')
                    })
    
                
        vis.xAxisGroup.call(vis.xAxis)
        vis.yAxisGroup.call(vis.yAxis)
    }

    habitableZone(group, dataPoint) {
        let value = dataPoint.pl_orbsmax
        if(value == 0)
            return "Unknown"
        switch(group.toUpperCase()) {
            case "A":
                if(value < 8.5)
                    return "Too Hot"
                else if(value > 12.5)
                    return "Too Cold"
                return "Habitable"
            case "F":
                if(value < 1.5)
                    return "Too Hot"
                else if(value > 2.2)
                    return "Too Cold"
                return "Habitable"
            case "G":
                if(value < 0.95)
                    return "Too Hot"
                else if(value > 1.4)
                    return "Too Cold"
                return "Habitable"
            case "K":
                if(value < 0.38)
                    return "Too Hot"
                else if(value > 0.56)
                    return "Too Cold"
                return "Habitable"
            case "M":
                if(value < 0.08)
                    return "Too Hot"
                else if(value > 0.12)
                    return "Too Cold"
                return "Habitable"
            default:
                return "Unknown"
        }
    }
}