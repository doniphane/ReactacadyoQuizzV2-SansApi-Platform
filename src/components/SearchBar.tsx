import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { SearchBarProps } from '../types';


function SearchBar({ searchTerm, onSearchChange, placeholder = "Rechercher un quiz..." }: SearchBarProps) {
    return (
        <div className="mb-6">
            <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={onSearchChange}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
            </div>
        </div>
    );
}

export default SearchBar; 