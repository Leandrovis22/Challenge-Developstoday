"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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
  };
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
        console.log('Fetching country info for:', countryCode);
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
          <pre>{JSON.stringify(countryInfo, null, 2)}</pre>
        </div>
      ) : (
        <div>No country information available</div>
      )}
    </div>
  );
};

export default CountriesPage;
