-- Create table schema 
DROP TABLE "Country_Data"


CREATE TABLE "Global_Data" (
    "Indicator" VARCHAR(150)   NOT NULL,
    "Global_Deaths" NUMERIC   NOT NULL,
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
    "Continent_Deaths" NUMERIC   NOT NULL,
    "Continent_Population" NUMERIC   NOT NULL,
    "Indicator_Deaths_%_Total_Deaths" VARCHAR NOT NULL,
    "Indicator_Deaths_%_Total_Population" VARCHAR NOT NULL
);

CREATE TABLE "Country_Data" (
    "Country" VARCHAR(60) NOT NULL,
    "Continent" VARCHAR(50) NOT NULL,
    "Indicator" VARCHAR(150) NOT NULL,
    "Country_Deaths" NUMERIC NOT NULL,
    "Country_Population" NUMERIC NOT NULL,
    "Indicator_Deaths_%_Total_Deaths" VARCHAR NOT NULL,
    "Indicator_Deaths_%_Total_Population" VARCHAR NOT NULL
);

CREATE TABLE "Merged_Data" (
    "Continent_Code" VARCHAR(5)   NOT NULL,
    "Continent" VARCHAR(50)   NOT NULL,
    "Country_Code" VARCHAR(5)   NOT NULL,
    "Country" VARCHAR(60)   NOT NULL,
    "Indicator_Category" VARCHAR(150)   NOT NULL,
    "No_Deaths" NUMERIC   NOT NULL,
    "2016_Population" NUMERIC  NOT NULL
);

ALTER TABLE "Continent_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator")
REFERENCES "Global_Data" ("Indicator");

ALTER TABLE "Country_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator")
REFERENCES "Global_Data" ("Indicator");

ALTER TABLE "Merged_Data" ADD CONSTRAINT "fk_Indicator" FOREIGN KEY("Indicator_Category")
REFERENCES "Global_Data" ("Indicator");

-- Change data type of columns with % values from VARCHAR to DOUBLE and review results
ALTER TABLE "Global_Data"
ALTER COLUMN "Global_Deaths" TYPE decimal(13,0) using "Global_Deaths"::decimal,
ALTER COLUMN "Global_Population" TYPE decimal(13,0) using "Global_Population"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Deaths" TYPE decimal(5,1) using "Indicator_Deaths_%_Total_Deaths"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Population" TYPE decimal(5,4)using "Indicator_Deaths_%_Total_Population"::decimal;
SELECT * FROM "Global_Data"

ALTER TABLE "Continent_Data"
ALTER COLUMN "Continent_Deaths" TYPE decimal(13,0) using "Continent_Deaths"::decimal,
ALTER COLUMN "Continent_Population" TYPE decimal(13,0) using "Continent_Population"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Deaths" TYPE decimal(5,1) using "Indicator_Deaths_%_Total_Deaths"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Population" TYPE decimal(5,4)using "Indicator_Deaths_%_Total_Population"::decimal;
SELECT * FROM "Continent_Data"

ALTER TABLE "Country_Data"
ALTER COLUMN "Country_Deaths" TYPE decimal(13,0) using "Country_Deaths"::decimal,
ALTER COLUMN "Country_Population" TYPE decimal(13,0) using "Country_Population"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Deaths" TYPE decimal(5,1) using "Indicator_Deaths_%_Total_Deaths"::decimal,
ALTER COLUMN "Indicator_Deaths_%_Total_Population" TYPE decimal(5,4)using "Indicator_Deaths_%_Total_Population"::decimal;
SELECT * FROM "Country_Data"