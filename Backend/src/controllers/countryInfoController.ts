import { Request, Response } from 'express';

export const countryInfoController = async (req: Request, res: Response) => {
    try {
        const countryCode = req.params.countryCode;
        const responseCountryInfo = await fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
        const dataCountryInfo = await responseCountryInfo.json();

        const responseFlags = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
        const dataFlags = await responseFlags.json();
        const flagData = dataFlags.data.find((x: { iso2: string; }) => x.iso2 === countryCode);
        
        const countryIso3 = flagData.iso3;

        const responsePopulation = await fetch('https://countriesnow.space/api/v0.1/countries/population/');
        const dataPopulation = await responsePopulation.json();
        const populationData = dataPopulation.data.find((x: { iso3: string; }) => x.iso3 === countryIso3);

        res.json({...dataCountryInfo, flagData: flagData, population: populationData});
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};



