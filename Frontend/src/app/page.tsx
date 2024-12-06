"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Country {
  countryCode: string;
  name: string;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:3000/countries')
      .then(response => response.json())
      .then(data => {
        setCountries(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center items-center">
        <div className="animate-spin rounded-full size-[6rem] border-b-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <div className="my-[5rem] text-center rounded-lg p-4 shadow-xl">
        <h1 className="text-xl font-bold mb-4">Countries</h1>
        <ul className="list-none space-y-2">
          {countries.map(country => (
            <li key={country.countryCode}>
              <Link href={`/countries/${country.countryCode}`}>
                <p className="text-blue-800 underline">{country.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

