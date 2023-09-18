//api calls
const continent = "http://127.0.0.1:5000/api/v1.0/Continent";
const global = "http://127.0.0.1:5000/api/v1.0/Global";
const merged = "http://127.0.0.1:5000/api/v1.0/MergedData";
const country = "http://127.0.0.1:5000/api/v1.0/Country";
//const geolocation = "";

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
    let country_dropdown_menu = d3.select("#selIndicator");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Indicator;
        if(holding_list.includes(name) == false) {
            country_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name);
        }
    }

    //indicatorChanged("Infectious, parasitic, neonatal and nutritional");
}

function create_country_dropdowns(json_data) {
    let country_dropdown_menu = d3.select("#selCountry");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Country;
        if(holding_list.includes(name) == false) {
            country_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name);
        }
    }

    countryChanged("Afghanistan");
}

function continentChanged(continent_name) {
    d3.json(country).then(function(data) {
        create_country_dropdowns(data);
    })

    d3.json(merged).then(function(data) {
        let countries_list = [];
        let deaths = [];
        let marker_sizes = [];
        let GDP = [];

        for(let i = 0; i < data.length; i++) {
            let name = data[i].Country;
            if(data[i].Continent == continent_name) {
                if(countries_list.includes(name) == false) {
                    countries_list.push(name);
                    deaths.push(data[i].Total_Deaths_Attributible);
                    marker_sizes.push(data[i].Total_Deaths_Attributible/country_divisor(continent_name));
                    GDP.push(data[i].GDP_2016);
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
              colorscale: 'Earth'
            }
          }];

        Plotly.newPlot('continent-bubble', country_bubble, {responsive: true});

        let trace1 = {
            x: GDP,
            y: deaths,
            type: 'scatter'
        };

        let line_data = [trace1]

        console.log(deaths);
        console.log(GDP);

        Plotly.newPlot('continent-line', line_data, {responsive: true});

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
        return 2500
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
        return 500
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

        let country_bubble = [{
            x: indicators,
            y: deaths,
            text: indicators, 
            mode: 'markers',
            marker: {
                size: deaths,
                color: indicators,
                colorscale: 'Earth'
            }
        }];

        Plotly.newPlot('country-bubble', country_bubble, {responsive: true});
    });
};