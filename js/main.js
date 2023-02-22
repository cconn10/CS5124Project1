
d3.csv('data/exoplanets.csv')
    .then(data => {
        data.forEach(d => {
            d.sy_snum = +d.sy_snum
        })


        const barchart = new BarChart({parentElement: '#vis'}, data)
        barchart.updateVis()
    })