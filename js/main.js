let starCount, planetCount, starType, discoveryMethod,  habitableExoplanets, distFromUs, massVsRadius, discoveryPerYear

let fullData

let tableHeader = document.getElementById('table-head')
let tableBody = document.getElementById('table-body')

const STAR_TYPES = ["A", "F", "G", "K", "M"]
const BLANK_MSG = "[Blank]"

d3.csv('data/exoplanets.csv')
    .then(data => {

        let headerRow = document.createElement('tr')
        
        for(let i = 0; i < 4; i++){
            headerRow.appendChild(document.createElement('th'))
        }
        headerRow.cells[0].appendChild(document.createTextNode('Planet Name'))
        headerRow.cells[1].appendChild(document.createTextNode('Discovery Year'))
        headerRow.cells[2].appendChild(document.createTextNode('Discovery Method'))
        headerRow.cells[3].appendChild(document.createTextNode('Discovery Facility'))

        tableHeader.appendChild(headerRow)

        data.forEach(d => {
            d.sy_snum = +d.sy_snum
            d.sy_pnum = +d.sy_pnum
            d.sy_dist = +d.sy_dist
            if(d.st_spectype == "")
                d.st_spectype = "[Blank]"
            d.disc_year = d.disc_year
            d.pl_rade = +d.pl_rade
            d.pl_bmasse = +d.pl_bmasse

            let tr = document.createElement('tr')
            
            createTableRow(tr, d)

        })

        fullData = data

        starCount = new StarCount({parentElement: '#vis'}, data)
        planetCount = new PlanetCount({parentElement: '#vis2'}, data)
        starType = new StarType({parentElement: '#vis3'}, data)
        discoveryMethod = new DiscoveryMethod({parentElement: '#vis4'}, data)
        habitableExoplanets = new SplitBarChart({parentElement: '#vis5'}, data)
        distFromUs = new Histogram({parentElement: '#vis6'}, data)
        massVsRadius = new Scatterplot({parentElement: '#vis7'}, data)
        discoveryPerYear = new LineChart({parentElement: '#vis8'}, data)

        updateVis()
    })
    
    function updateVis() {
        starCount.updateVis()
        planetCount.updateVis()
        starType.updateVis()
        discoveryMethod.updateVis()
        habitableExoplanets.updateVis()
        distFromUs.updateVis()
        massVsRadius.updateVis()
        discoveryPerYear.updateVis()
    }

    function updateData(data) {
        starCount.data = data
        planetCount.data = data
        starType.data = data
        discoveryMethod.data = data
        habitableExoplanets.data = data
        distFromUs.data = data
        massVsRadius.data = data
        discoveryPerYear.data = data

        tableRowCount = tableBody.children.length

        for (let i = 0; i < tableRowCount; i++){
            tableBody.removeChild(tableBody.lastChild)
        }
        

        data.forEach(dataPoint => {
            let tr = document.createElement('tr')
            createTableRow(tr, dataPoint)

        })

        updateVis()
    }

    function filterData(filteredData) {
        updateData(filteredData)
    }

    function createTableRow(tr, d) {
        for(let i = 0; i < 4; i++){
            tr.appendChild(document.createElement('td'))
        }
        
        tr.cells[0].appendChild(document.createTextNode(d.pl_name))
        tr.cells[1].appendChild(document.createTextNode(d.disc_year))
        tr.cells[2].appendChild(document.createTextNode(d.discoverymethod))
        tr.cells[3].appendChild(document.createTextNode(d.disc_facility))
        
        tableBody.appendChild(tr)
    }