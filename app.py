# Import flask
from flask import Flask, jsonify

# Set up sqlalchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, column

# Create engine to Database.sqlite
engine = create_engine("sqlite:///project_files/Database.sqlite")
print('connected')

# Create base and reflect tables
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()
print('created')

# Assign tables to classes
Continent = Base.classes.dae_Continent_table
Global = Base.classes.dae_Global_table
MergedData = Base.classes.dae_MergedData_table
Country = Base.classes.dae_country_table
print('assigned')

# Create the app
app = Flask(__name__)

@app.route("/")
def home():
    """List all available API routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/Continent<br/>"
        f"/api/v1.0/Global<br/>"
        f"/api/v1.0/MergedData<br/>"
        f"/api/v1.0/Country<br/>"
    )

@app.route('/api/v1.0/Continent')
def get_continent_data():
    session = Session(engine)  # Create a session
    continent_sel = [
                        Continent.index,
                        Continent.Continent,
                        Continent.Indicator,
                        Continent.Continent_Deaths,
                        Continent.Continent_Population,
                        Continent.Continent_GDP,
                        Continent.Indicator_Deaths_per_Total_Deaths,
                        Continent.Indicator_Deaths_per_Total_Population
                        ]
    continent_results = session.query(*continent_sel).all()

    continent_data_list = []

    for result in continent_results:

        continent_data = {}

        continent_data['index']= result[0]
        continent_data['Continent'] = result[1]
        continent_data['Indicator'] = result[2]
        continent_data['Continent_Deaths'] = result[3]
        continent_data['Continent_Population'] = result[4]
        continent_data['Continent_GDP'] = result[5]
        continent_data['Indicator_Deaths_per_Total_Deaths'] = result[6]
        continent_data['Indicator_Deaths_per_Total_Population'] = result[7]
        continent_data_list.append(continent_data)

    session.close()  # Close the session

    response = jsonify(continent_data_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/v1.0/Global')
def get_global_data():

    session = Session(engine)  # Create a session
    global_sel = [
                        Global.index,
                        Global.Indicator,
                        Global.Global_Deaths,
                        Global.Global_Population,
                        Global.Global_GDP,
                        Global.Indicator_Deaths_per_Total_Deaths,
                        Global.Indicator_Deaths_per_Total_Population
                        ]
    global_results = session.query(*global_sel).all()
    # print(global_results)

    global_data_list = []

    for result in global_results:

        global_data = {}
        global_data['index']= result[0]
        global_data['Indicator'] = result[1]
        global_data['Global_Deaths'] = result[2]
        global_data['Global_Population'] = result[3]
        global_data['Global_GDP'] = result[4]
        global_data['Indicator_Deaths_per_Total_Deaths'] = result[5]
        global_data['Indicator_Deaths_per_Total_Population'] = result[6]
        global_data_list.append(global_data)

    session.close()  # Close the session

    response = jsonify(global_data_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/v1.0/MergedData')
def get_merged_data():

    session = Session(engine)  # Create a session
    merged_sel = [
                        MergedData.index,
                        MergedData.Continent_Code,
                        MergedData.Continent,
                        MergedData.Country_Code,
                        MergedData.Country,
                        MergedData.Indicator,
                        MergedData.No_Deaths,
                        MergedData.Population_2016,
                        MergedData.GDP_2016,
                        ]
    merged_results = session.query(*merged_sel).all()
    # print(merged_results)

    merged_data_list = []

    for result in merged_results:

        merged_data = {}

        merged_data['index']= result[0]
        merged_data['Continent_Code'] = result[1]
        merged_data['Continent'] = result[2]
        merged_data['Country_Code'] = result[3]
        merged_data['Country'] = result[4]
        merged_data['Indicator'] = result[5]
        merged_data['No_Deaths'] = result[6]
        merged_data['Population_2016'] = result[7]
        merged_data['GDP_2016'] = result[8]
        merged_data_list.append(merged_data)

    session.close()  # Close the session

    response = jsonify(merged_data_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/api/v1.0/Country')
def get_country_data():
    session = Session(engine)  # Create a session
    country_sel = [
                        Country.index,
                        Country.Country,
                        Country.Continent,
                        Country.Indicator,
                        Country.Country_Deaths,
                        Country.Country_Population,
                        Country.Country_GDP,
                        Country.Indicator_Deaths_per_Total_Deaths,
                        Country.Indicator_Deaths_per_Total_Population
                        ]
    country_results = session.query(*country_sel).all()

    country_data_list = []

    for result in country_results:

        country_data = {}

        country_data['index']= result[0]
        country_data['Country'] = result[1]
        country_data['Continent'] = result[2]
        country_data['Indicator'] = result[3]
        country_data['Country_Deaths'] = result[4]
        country_data['Country_Population'] = result[5]
        country_data['Country_GDP'] = result[6]
        country_data['Indicator_Deaths_per_Total_Deaths'] = result[7]
        country_data['Indicator_Deaths_per_Total_Population'] = result[8]
        country_data_list.append(country_data)

    session.close()  # Close the session

    response = jsonify(country_data_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=False)