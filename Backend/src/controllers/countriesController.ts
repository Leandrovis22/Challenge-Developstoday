import { Request, Response } from 'express';

export const countriesController = async (req: Request, res: Response) => {
    try {
        const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};
