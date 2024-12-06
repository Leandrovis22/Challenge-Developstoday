import { Request, Response } from 'express';

export const countryInfoController = async (req: Request, res: Response) => {
    try {
        const countryCode = req.params.countryCode.toUpperCase();

        const responseCountryInfo = await fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        const dataCountryInfo = await responseCountryInfo.json();

        const responseFlags = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const dataFlags = await responseFlags.json();
        const flagData = dataFlags.data.find((x: { iso2: string; }) => x.iso2 === countryCode) || null;

        let populationData;
        if (flagData) {
            const countryIso3 = flagData.iso3;
            const responsePopulation = await fetch('https://countriesnow.space/api/v0.1/countries/population/');
            const dataPopulation = await responsePopulation.json();
            populationData = dataPopulation.data.find((x: { iso3: string; }) => x.iso3 === countryIso3);
        } else {
            const responsePopulation = await fetch('https://countriesnow.space/api/v0.1/countries/population/');
            const dataPopulation = await responsePopulation.json();
            populationData = dataPopulation.data.find((x: { country: string; }) => x.country === dataCountryInfo.commonName) ||
                dataPopulation.data.find((x: { country: string; }) => x.country.toLowerCase().includes(dataCountryInfo.commonName.toLowerCase()));
        }

        res.json({ dataCountryInfo: dataCountryInfo, flagData: flagData, population: populationData });

    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({ error: 'Failed to fetch data', message: error });
    }
};

