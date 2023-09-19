//api calls
const continent = "http://127.0.0.1:5000/api/v1.0/Continent";
const global = "http://127.0.0.1:5000/api/v1.0/Global";
const merged = "http://127.0.0.1:5000/api/v1.0/MergedData";
const country = "http://127.0.0.1:5000/api/v1.0/Country";
const geolocation = "http://127.0.0.1:5000/api/v1.0/Geolocations";

//data promises 
const continentPromise = d3.json(continent);
console.log("Continent Promise: ", continentPromise);
const globalPromise = d3.json(global);
console.log("Global Promise: ", globalPromise);
const mergedPromise = d3.json(merged);
console.log("Data Promise: ", mergedPromise);
const countryPromise = d3.json(country);
console.log("Data Promise: ", countryPromise);
// const geolocationPromise = d3.json(geolocation);
// console.log("Data Promise: ", geoPromise);

//load data for continent and country dropdowns
d3.json(continent).then(function(data) {
    const continent_data = data;
    console.log(continent_data);

    //populate the continent dropdown
    create_continent_dropdowns(continent_data);
});

//load data for indicator dropdowns
d3.json(global).then(function(data) {
    const global_data = data;
    console.log(global_data);

    //populate the indicator dropdown
    create_indicator_dropdowns(global_data);
});

function create_continent_dropdowns(json_data) {
    let continent_dropdown_menu = d3.select("#selContinent");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Continent;
        if(holding_list.includes(name) == false) {
            continent_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name);
        }
    }

    continentChanged("Africa");
};

function create_indicator_dropdowns(json_data) {
    let indicator_dropdown_menu = d3.select("#selIndicator");

    let options = indicator_dropdown_menu.selectAll("option");
    options.remove();

    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Indicator;
        if(holding_list.includes(name) == false) {
            indicator_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name);
        }
    }

    indicatorChanged("Infectious, parasitic, neonatal and nutritional");
}

function create_country_dropdowns(continent_name, json_data) {
    let country_dropdown_menu = d3.select("#selCountry");

    let options = country_dropdown_menu.selectAll("option");
    options.remove();

    let holding_list = [];
    let name = ""
    for(let i = 0; i < json_data.length; i++) {
        name = json_data[i].Country;
        if(json_data[i].Continent == continent_name) {
            if(holding_list.includes(name) == false) {
                country_dropdown_menu.append("option").text(name).property("value", name);
                holding_list.push(name);
            }
        }
    }

    countryChanged(name);
}

function continentChanged(continent_name) {
    d3.json(country).then(function(data) {
        create_country_dropdowns(continent_name, data);
    })

    d3.json(merged).then(function(data) {
        let countries_list = [];
        let deaths = [];
        let marker_sizes = [];
        let GDP_data = [];

        for(let i = 0; i < data.length; i++) {
            let name = data[i].Country;
            if(data[i].Continent == continent_name) {
                if(countries_list.includes(name) == false) {
                    countries_list.push(name);
                    deaths.push(data[i].Total_Deaths_Attributible);
                    marker_sizes.push(data[i].Total_Deaths_Attributible/country_divisor(continent_name));
                    let holding_dict = {};
                    holding_dict['GDP'] = data[i].GDP_2016;
                    holding_dict['deaths'] = data[i].Total_Deaths_Attributible;
                    holding_dict['country'] = data[i].Country;
                    GDP_data.push(holding_dict);
                }
            }
        }

        

        let country_bubble = [{
            x: countries_list,
            y: deaths,
            text: countries_list,
            mode: 'markers',
            marker: {
              size: marker_sizes,
              color: deaths,
              colorscale: 'Earth',
              line: {
                color: 'black'
              }
            }
          }];

        Plotly.newPlot('continent-bubble', country_bubble, {responsive: true});

        let sorted_gdp = GDP_data.sort((a,b) => a.GDP - b.GDP);
        let GDP = [];
        let gdp_deaths = [];
        let gdp_deaths_data = [];
        let gdp_countries = [];

        for(i = 0; i < sorted_gdp.length; i++) {
            let holding_dict = {}
            GDP.push(sorted_gdp[i].GDP);
            gdp_deaths.push(sorted_gdp[i].deaths);
            gdp_countries.push(sorted_gdp[i].country);
            holding_dict['x'] = sorted_gdp[i].GDP;
            holding_dict['y'] = sorted_gdp[i].deaths;
            gdp_deaths_data.push(holding_dict);
        }

        console.log(gdp_deaths_data);

        let line_chart = new Chart('continent-line', {
            type: 'scatter',
            data: {
               datasets: [{ 
                  data: gdp_deaths_data,
                  borderColor: 'black',
                  borderWidth: 1,
                  pointBackgroundColor: 'black',
                  pointBorderColor: 'black',
                  pointRadius: 5,
                  pointHoverRadius: 5,
                  fill: false,
                  tension: 0,
                  showLine: true
               }]
            },
            options: {
               legend: false,
               tooltips: false,
               scales: {
                  xAxes: [{
                     ticks: {
                        min: 0,
                        max: Math.ceil(Math.max(...GDP))
                     },
                     gridLines: {
                        color: '#888',
                        drawOnChartArea: false
                     }
                  }],
                  yAxes: [{
                     ticks: {
                        min: 0,
                        max: Math.ceil(Math.max(...gdp_deaths))
                     },
                  }]
               }
            }
         });


        d3.json(country).then(function(country_data) {
            let holding_country_list = [];
            let population = [];
            for(let i = 0; i < country_data.length; i++) {
                let name = country_data[i].Country;
                if(country_data[i].Continent == continent_name) {
                    if(holding_country_list.includes(name) == false) {
                        holding_country_list.push(name);
                        population.push(country_data[i].Country_Population);
                    }
                }
            }

            let perc_pop = [];
            for(let i = 0; i < population.length; i++) {
                perc_pop.push((deaths[i] / population[i]) * 100);
            }

            console.log(perc_pop);

            let country_bar = [{
                type: 'bar',
                x: countries_list,
                y: perc_pop,
            }];

            Plotly.newPlot('continent-bar', country_bar, {responsive: true});
        });

    });
};

function country_divisor(continent_name) {
    if(continent_name == "Africa") {
        return 1500
    }
    else if(continent_name == "Americas") {
        return 1000
    }
    else if(continent_name == "Eastern Mediterranean") {
        return 1000
    }
    else if(continent_name == "Europe") {
        return 1000
    }
    else if(continent_name == "South-East Asia") {
        return 1000
    }
    else {
        return 100
    }
}

function countryChanged(country_name) {
    d3.json(country).then(function(data) {
        let indicators = [];
        let deaths = [];

        for(let i = 0; i < data.length; i++) {
            if(data[i].Country == country_name) {
                indicators.push(data[i].Indicator);
                deaths.push(data[i].Indicator_Deaths_per_Total_Deaths);
            }
        }

        let country_pie = [{
            type: 'pie',
            values: deaths,
            labels: indicators
        }];

        Plotly.newPlot('country-bubble', country_pie, {responsive: true});

        // let country_bubble = [{
        //     x: indicators,
        //     y: deaths,
        //     text: indicators, 
        //     mode: 'markers',
        //     marker: {
        //         size: deaths,
        //         color: indicators,
        //         colorscale: 'Earth'
        //     }
        // }];

        // Plotly.newPlot('country-bubble', country_bubble, {responsive: true});
    });
};

let indicator_map = L.map("map", {
    center: [0,0],
    zoom: 2
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(indicator_map);

function indicatorChanged(indicator_name) {

    if(typeof markers !== 'undefined') {
        indicator_map.removeLayer(markers);
    }
    
    let indicator_data_list = [];

    d3.json(merged).then(function(merged_data) {
            
            for(let i = 0; i < merged_data.length; i++) {
                holding_dict = {};
                if(merged_data[i].Indicator == indicator_name) {
                    holding_dict['country_code'] = merged_data[i].Country_Code;
                    holding_dict['country'] = merged_data[i].Country;
                    holding_dict['deaths'] = merged_data[i].No_Deaths;
                    indicator_data_list.push(holding_dict);
                }
            }
        

        d3.json(geolocation).then(function(location_data) {

                for(let i = 0; i < indicator_data_list.length; i++) {

                    for(let j = 0; j < location_data.length; j++) {

                        if(indicator_data_list[i].country_code == location_data[j].Alpha_Three_Code) {
                            indicator_data_list[i]['Latitude'] = location_data[j].Latitude;
                            indicator_data_list[i]['Longitude'] = location_data[j].Longitude;
                        }

                    }

                }

            

            let indicator_markers = [];
            console.log(indicator_data_list);

            for(let i = 0; i < indicator_data_list.length; i++) {

                indicator_markers.push(
                    L.circle([indicator_data_list[i].Latitude, indicator_data_list[i].Longitude], {
                    stroke: true,
                    weight: 1,
                    fillOpacity: 1,
                    color: "black",
                    radius: indicator_data_list[i].deaths
                    }).bindPopup(`<p>Country: ${indicator_data_list[i].country}</p>
                    <p>Deaths Attributable to this Indicator: ${indicator_data_list[i].deaths}</p>`)
                );

            };

            let markers = L.layerGroup(indicator_markers);

            let overlayMaps = {
                "Markers" : markers
            };

            markers.addTo(indicator_map);
        });

    });
}