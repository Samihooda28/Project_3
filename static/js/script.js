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
const geolocationPromise = d3.json(geolocation);
console.log("Data Promise: ", geolocationPromise);

//load data for continent and country dropdowns
d3.json(continent).then(function(data) {
    const continent_data = data;
    console.log(continent_data);

    //populate the continent dropdown
    create_continent_dropdowns(continent_data);

    //populate the map
    global_map();
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
        let countries_pop = [];
        let marker_sizes = [];
        let GDP_data = [];

        for(let i = 0; i < data.length; i++) {
            let name = data[i].Country;
            if(data[i].Continent == continent_name) {
                if(countries_list.includes(name) == false) {
                    countries_list.push(name);
                    deaths.push(data[i].Total_Deaths_Attributible);
                    countries_pop.push(data[i].Population_2016);
                    marker_sizes.push(data[i].Total_Deaths_Attributible/country_divisor(continent_name));
                    let holding_dict = {};
                    holding_dict['GDP'] = data[i].GDP_2016;
                    holding_dict['deaths'] = (data[i].Total_Deaths_Attributible/data[i].Population_2016)*100;
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
                colorscale: 'Jet',
                line: {
                    color: 'black'
                }
            }
        }];

        let bubble_layout = {
            title: {
                text: "Total Deaths Attributable to the Environment per Country",
                automargin: true
            },
            xaxis: {
                title: {
                    text: 'Country',
                    automargin: true
                },
                automargin: true
            },
            yaxis: {
                title: {
                    text: 'Total Deaths Attributable to the Environment'
                },
                automargin: true
            }
        };

        Plotly.newPlot('continent-bubble', country_bubble, bubble_layout, {responsive: true});

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

        console.log(gdp_countries);

        let line_html = document.getElementById('continent-line').getContext('2d');
        let line_chart = new Chart(line_html, {
            type: 'scatter',
            data: {
               labels: gdp_countries,
               datasets: [{ 
                  data: gdp_deaths_data,
                  borderColor: 'black',
                  borderWidth: 1,
                  pointBackgroundColor: 'blue',
                  pointBorderColor: 'black',
                  pointRadius: 5,
                  pointHoverRadius: 5,
                  fill: false,
                  tension: 0,
                  showLine: true,
               }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label = data.labels[tooltipItem.index];
                            return label;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            min: 0,
                            max: (Math.ceil(Math.max(...GDP)/ 100000000000) * 100000000000),
                            callback: (val) => {
                                return (val/1000000000000) + 'T';
                            }
                        },
                    gridLines: {
                        color: '#888',
                        drawOnChartArea: false
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Gross Domestic Product'
                    }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: Math.ceil(Math.max(...gdp_deaths))
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Deaths Attributable to the Environment as % of Population'
                        }
                    }],
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Deaths Attributable to the Enrivonment vs GDP',
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    }
                } 
            }
        });

        let perc_pop = [];
        for(let i = 0; i < deaths.length; i++) {
            perc_pop.push((deaths[i]/countries_pop[i]) * 100);
        }

        console.log(perc_pop);

        let country_bar = [{
            type: 'bar',
            x: countries_list,
            y: perc_pop,
        }];

        let bar_layout = {
            title: {
                text: 'Deaths Attributable to the Evironmnet as a Percentage of Total Deaths, per Country'
            },
            xaxis: {
                title: {
                    text: 'Country',
                    automargin: true
                },
                automargin: true
            },
            yaxis: {
               title: {
                    text: 'Deaths Attributable as a Percentage of Total Deaths',
                    automargin: true
                },
                automargin: true
            }
        }

        Plotly.newPlot('continent-bar', country_bar, bar_layout, {responsive: true});

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
        return 1000
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

        let pie_layout = {
            title: {
                text: 'Number of Deaths Attributable to each Indicator'
            }
        }

        Plotly.newPlot('country-pie', country_pie, pie_layout, {responsive: true});
    });
};

function global_map() {
    d3.json(merged).then(function(merged_data) {

        infectious_data = [];
        injuries_data = [];
        dieseases_data = [];

        for(let i = 0; i < merged_data.length; i++) {
            if(merged_data[i].Indicator == "Infectious, parasitic, neonatal and nutritional") {
                infectious_dict = {};
                infectious_dict['country_code'] = merged_data[i].Country_Code;
                infectious_dict['country'] = merged_data[i].Country;
                infectious_dict['deaths'] = merged_data[i].No_Deaths;
                infectious_data.push(infectious_dict);
            }
            else if(merged_data[i].Indicator == "Injuries") {
                injuries_dict = {};
                injuries_dict['country_code'] = merged_data[i].Country_Code;
                injuries_dict['country'] = merged_data[i].Country;
                injuries_dict['deaths'] = merged_data[i].No_Deaths;
                injuries_data.push(injuries_dict);
            }
            else {
                dieseases_dict = {};
                dieseases_dict['country_code'] = merged_data[i].Country_Code;
                dieseases_dict['country'] = merged_data[i].Country;
                dieseases_dict['deaths'] = merged_data[i].No_Deaths;
                dieseases_data.push(dieseases_dict);
            }
        }

        d3.json(geolocation).then(function(location_data) {

            for(let i = 0; i < infectious_data.length; i++) {

                for(let j = 0; j < location_data.length; j++) {

                    if(infectious_data[i].country_code == location_data[j].Alpha_Three_Code) {
                        infectious_data[i]['Latitude'] = location_data[j].Latitude;
                        infectious_data[i]['Longitude'] = location_data[j].Longitude;
                    }

                }

            }

            for(let i = 0; i < injuries_data.length; i++) {

                for(let j = 0; j < location_data.length; j++) {

                    if(injuries_data[i].country_code == location_data[j].Alpha_Three_Code) {
                        injuries_data[i]['Latitude'] = location_data[j].Latitude;
                        injuries_data[i]['Longitude'] = location_data[j].Longitude;
                    }

                }

            }

            for(let i = 0; i < dieseases_data.length; i++) {

                for(let j = 0; j < location_data.length; j++) {

                    if(dieseases_data[i].country_code == location_data[j].Alpha_Three_Code) {
                        dieseases_data[i]['Latitude'] = location_data[j].Latitude;
                        dieseases_data[i]['Longitude'] = location_data[j].Longitude;
                    }

                }

            }

            let infectious_markers = [];
            let injury_markers = [];
            let diesease_markers = [];

            for(let i = 0; i < infectious_data.length; i++) {

                infectious_markers.push(
                    L.circle([infectious_data[i].Latitude, infectious_data[i].Longitude], {
                    stroke: true,
                    weight: 1,
                    fillOpacity: 0.75,
                    color: "green",
                    radius: infectious_data[i].deaths
                    }).bindPopup(`<p>Indicator: Infectious, parasitic, neonatal and nutritional</p>
                    <p>Country: ${infectious_data[i].country}</p>
                    <p>Deaths Attributable to this Indicator: ${infectious_data[i].deaths}</p>`)
                );

            };

            for(let i = 0; i < injuries_data.length; i++) {

                injury_markers.push(
                    L.circle([injuries_data[i].Latitude, injuries_data[i].Longitude], {
                    stroke: true,
                    weight: 1,
                    fillOpacity: 0.75,
                    color: "red",
                    radius: injuries_data[i].deaths
                    }).bindPopup(`<p>Indicator: Injuries</p>
                    <p>Country: ${injuries_data[i].country}</p>
                    <p>Deaths Attributable to this Indicator: ${injuries_data[i].deaths}</p>`)
                );

            };

            for(let i = 0; i < dieseases_data.length; i++) {

                diesease_markers.push(
                    L.circle([dieseases_data[i].Latitude, dieseases_data[i].Longitude], {
                    stroke: true,
                    weight: 1,
                    fillOpacity: 0.5,
                    color: "blue",
                    radius: dieseases_data[i].deaths
                    }).bindPopup(`<p>Indicator: Noncommunicable diseases</p>
                    <p>Country: ${dieseases_data[i].country}</p>
                    <p>Deaths Attributable to this Indicator: ${dieseases_data[i].deaths}</p>`)
                );

            };

            let base_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            let infectious = L.layerGroup(infectious_markers);
            let injuries = L.layerGroup(injury_markers);
            let dieseases = L.layerGroup(diesease_markers);

            let base_maps = {
                "Map": base_map
            };

            let overlay_maps = {
                "Infectious, parasitic, neonatal and nutritional": infectious,
                "Injuries": injuries,
                "Noncommunicable diseases": dieseases
            };

            let indicator_map = L.map("map", {
                center: [0,0],
                zoom: 2,
                layers: [base_map, dieseases, infectious, injuries]
            });

            L.control.layers(base_maps, overlay_maps, {
                collapsed: false
            }).addTo(indicator_map);

        });

    });
};