
d3.csv('data/exoplanets.csv')
    .then(data => {
        data.forEach(d => {
            d.sy_snum = +d.sy_snum
            d.sy_pnum = +d.sy_pnum
            if(d.st_spectype == "")
                d.st_spectype = "[Blank]"
            d.disc_year = d.disc_year
        })


        const starCount = new BarChart({parentElement: '#vis'}, data, "star_count")
        const planetCount = new BarChart({parentElement: '#vis2'}, data, "planet_count")
        const starType = new BarChart({parentElement: '#vis3'}, data, "star_type")
        const discoveryMethod = new BarChart({parentElement: '#vis4'}, data, "discovery_method")
        const discoveryPerYear = new LineChart({parentElement: '#vis5'}, data)

        starCount.updateVis()
        planetCount.updateVis()
        starType.updateVis()
        discoveryMethod.updateVis()
        discoveryPerYear.updateVis()
    })