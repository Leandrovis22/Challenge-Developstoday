"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CountryInfo {
  dataCountryInfo: {
    commonName: string;
    officialName: string;
    countryCode: string;
    region: string;
    borders: BorderCountry[];
  };
  flagData: {
    name: string;
    flag: string;
    iso2: string;
    iso3: string;
  } | null;
  population: {
    country: string;
    code: string;
    iso3: string;
    populationCounts: PopulationCount[];
  };
}

interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: null;
}

interface PopulationCount {
  year: number;
  value: number;
}

const CountriesPage: React.FC = () => {
  const params = useParams();
  const countryCode = params.countryCode as string;
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/country-info/${countryCode}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CountryInfo = await response.json();
        setCountryInfo(data);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchCountryInfo();
    }
  }, [countryCode]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center items-center">
        <div className="animate-spin rounded-full size-[6rem] border-b-4 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {countryInfo ? (
        <div>
          <div className="px-3 flex flex-col md:flex-row items-center justify-center my-10 gap-8">
            <h1 className="text-3xl md:text-5xl font-bold">{countryInfo.dataCountryInfo.commonName}</h1>
            {countryInfo.flagData ? (
              <Image
                src={countryInfo.flagData.flag}
                alt={`${countryInfo.dataCountryInfo.commonName} flag`}
                width={200}
                height={100}
              />
            ) : (
              <div className="text-center text-red-500">We could not find the FlagData for the country</div>
            )}
          </div>

          <div className="px-3 py-4">
            <h2 className="text-2xl pb-3 text-center">Countries that border {countryInfo.dataCountryInfo.commonName}:</h2>
            <div className='flex flex-wrap gap-3 justify-center'>
              {countryInfo.dataCountryInfo.borders.map(border => (
                <Link key={border.countryCode} href={`/countries/${border.countryCode}`}>
                  <p className="text-blue-800 underline text-lg">{border.commonName}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Population Chart Section */}
          <div className="px-3 py-6">
            <h2 className="text-2xl pb-5 text-center">Population Over Time</h2>
            {countryInfo.population?.populationCounts && countryInfo.population.populationCounts.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={countryInfo.population.populationCounts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="year" 
                      label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
                    />
                    <YAxis 
                      label={{ 
                        value: 'Population', 
                        angle: -90, 
                        position: 'insideLeft',
                        offset: 0
                      }} 
                      tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        compactDisplay: 'short'
                      }).format(value)}
                    />
                    <Tooltip 
                      formatter={(value) => [
                        new Intl.NumberFormat('en-US').format(value as number), 
                        'Population'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Population"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-gray-500">No population data available</div>
            )}
          </div>
        </div>
      ) : (
        <div>No country information available</div>
      )}
    </div>
  );
};

export default CountriesPage;