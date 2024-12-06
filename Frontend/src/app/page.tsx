"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Country {
  countryCode: string;
  name: string;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/countries')
      .then(response => response.json())
      .then(data => setCountries(data));
  }, []);

  return (
    <div>
      <ul>
        {countries.map(country => (
          <li key={country.countryCode}>
            <Link href={`/countries/${country.countryCode}`}>
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


