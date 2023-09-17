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

//load data for dropdowns
d3.json(continent).then(function(data) {
    const continent_data = data;
    console.log(continent_data);

    //populate the continent dropdown
    create_continent_dropdowns(continent_data);
});

d3.json(global).then(function(data) {
    const global_data = data;
    console.log(global_data);

    //populate the indicator dropdown
    create_indicator_dropdowns(global_data);
})

function create_continent_dropdowns(json_data) {
    let continent_dropdown_menu = d3.select("#selContinent");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Continent
        if(holding_list.includes(name) == false) {
            continent_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name)
        }
    }

    continentChanged("Africa");
}

function create_indicator_dropdowns(json_data) {
    let country_dropdown_menu = d3.select("#selIndicator");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Indicator
        if(holding_list.includes(name) == false) {
            country_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name)
        }
    }
}

function create_country_dropdowns(json_data) {
    let country_dropdown_menu = d3.select("#selCountry");
    let holding_list = [];
    for(let i = 0; i < json_data.length; i++) {
        let name = json_data[i].Country
        if(holding_list.includes(name) == false) {
            country_dropdown_menu.append("option").text(name).property("value", name);
            holding_list.push(name)
        }
    }
}

function continentChanged(continent_name) {
    d3.json(country).then(function(data) {
        create_country_dropdowns(data);


    })
}

function select_countries(continent_name, json_data) {
    countries_list = [];
    if(countries_list.includes(name) == false) { 
        country_dropdown_menu.append("option").text(name).property("value", name);
        holding_list.push(name)
    }
}