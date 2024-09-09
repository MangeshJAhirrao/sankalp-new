'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    try {
      const response = await fetch('/api/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container">
      <header>
        <Image
          src="/Sankalp.jpg"
          alt="Sankalp Los Angeles 2024"
          width={500}
          height={300}
          style={{ objectFit: 'cover' }}
        />
        <div className="overlay">
          <h1>Email Lookup</h1>
        </div>
      </header>
      <main>
        <div className="search-container">
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="email-input"
          />
          <button onClick={handleLookup} className="lookup-button">
            Lookup
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {result && (
          <div className="results-grid">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="result-card">
                <h3>{key}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}