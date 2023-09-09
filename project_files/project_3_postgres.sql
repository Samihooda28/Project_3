-- Create table schema 
DROP TABLE "Country_Data"


CREATE TABLE "Global_Data" (
    "Indicator" VARCHAR(150)   NOT NULL,
    "Global_Deaths" VARCHAR   NOT NULL,
    "Global_Population" NUMERIC   NOT NULL,
    "Indicator_Deaths_%_Total_Deaths" VARCHAR NOT NULL,
    "Indicator_Deaths_%_Total_Population" VARCHAR NOT NULL,
	CONSTRAINT "pk_Indicator_Category" PRIMARY KEY (
		"Indicator"
	)
);

CREATE TABLE "Continent_Data" (
    "Continent" VARCHAR(50)   NOT NULL,
    "Indicator" VARCHAR(150)   NOT NULL,
    "Continent_Deaths" VARCHAR   NOT NULL,
    "Continent_Population" NUMERIC   NOT NULL,
    "Indicator_Deaths_%_Total_Deaths" VARCHAR NOT NULL,
    "Indicator_Deaths_%_Total_Population" VARCHAR NOT NULL
);

CREATE TABLE "Country_Data" (
    "Country" VARCHAR(60) NOT NULL,
    "Continent" VARCHAR(50) NOT NULL,
    "Indicator" VARCHAR(150) NOT NULL,
    "Continent_Deaths" VARCHAR NOT NULL,
    "Continent_Population" NUMERIC NOT NULL,
    "Indicator_Deaths_%_Total_Deaths" VARCHAR NOT NULL,
    "Indicator_Deaths_%_Total_Population" VARCHAR NOT NULL
);



CREATE TABLE "Merged_Data" (
    "Continent_Code" VARCHAR(5)   NOT NULL,
    "Continent" VARCHAR(50)   NOT NULL,
    "Country_Code" VARCHAR(5)   NOT NULL,
    "Country" VARCHAR(60)   NOT NULL,
    "Indicator_Category" VARCHAR(150)   NOT NULL,
    "No_Deaths" VARCHAR   NOT NULL,
    "2016_Population" NUMERIC  NOT NULL
);

ALTER TABLE "Continent_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator")
REFERENCES "Global_Data" ("Indicator");

ALTER TABLE "Country_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator")
REFERENCES "Global_Data" ("Indicator");

ALTER TABLE "Merged_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator_Category")
REFERENCES "Global_Data" ("Indicator");

