import { useState } from "react";
import { useDebounce } from "../src/useDebounce";

type SearchResult = {
  id: number;
  title: string;
};

async function fetchResults(query: string): Promise<SearchResult[]> {
  const response = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(async (value: string) => {
    if (value.trim().length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const data = await fetchResults(value);
    setResults(data);
    setIsLoading(false);
  }, 400);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          debouncedSearch(value);
        }}
        placeholder="Search..."
      />
      {isLoading ? <p>Loading...</p> : null}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
