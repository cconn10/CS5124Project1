
d3.csv('data/exoplanets.csv')
    .then(data => {
        data.forEach(d => {
            d.sy_snum = +d.sy_snum
            d.sy_pnum = +d.sy_pnum
            if(d.st_spectype == "")
                d.st_spectype = "[Blank]"
        })


        const starChart = new BarChart({parentElement: '#vis'}, data, "star_count")
        const planetChart = new BarChart({parentElement: '#vis2'}, data, "planet_count")
        const starTypeChart = new BarChart({parentElement: '#vis3'}, data, "star_type")
        const discoverymethodChart = new BarChart({parentElement: '#vis4'}, data, "discovery_method")

        starChart.updateVis()
        planetChart.updateVis()
        starTypeChart.updateVis()
        discoverymethodChart.updateVis()
    })