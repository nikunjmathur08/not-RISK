import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

function SearchBox({ onSearch }: SearchBoxProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchParams(searchTerm ? { q: searchTerm } : {});
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch, setSearchParams]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center border border-gray-400 rounded-lg p-2 hover:shadow-md transition-shadow duration-200 my-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        className="pr-2"
        aria-label="Search icon"
      >
        <path
          d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.9999 21L16.6499 16.65"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search..."
        className="flex-grow outline-none border-none"
        aria-label="Search input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}

export default SearchBox;
