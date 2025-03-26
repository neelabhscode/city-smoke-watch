
import React, { useState, useRef, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CitySearchProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm border rounded-lg shadow-sm">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter city name..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-grow border-0 focus:ring-0 text-lg bg-transparent"
          aria-label="City name"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !inputValue.trim()} 
          className="rounded-full"
        >
          {isLoading ? 
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" /> : 
            'Search'
          }
        </Button>
      </form>
    </div>
  );
};

export default CitySearch;
