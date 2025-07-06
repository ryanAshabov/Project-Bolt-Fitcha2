import React, { useState, useEffect } from 'react';
import { Save, Trash, Search, Calendar, MapPin, Star, DollarSign, Clock, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { SearchFilters } from './AdvancedSearchFilters';

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}

interface SavedSearchesProps {
  onLoadSearch: (filters: SearchFilters) => void;
  onClose: () => void;
  currentFilters?: SearchFilters;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({
  onLoadSearch,
  onClose,
  currentFilters,
}) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [newSearchName, setNewSearchName] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Load saved searches from localStorage
  useEffect(() => {
    const savedSearchesJson = localStorage.getItem('savedSearches');
    if (savedSearchesJson) {
      try {
        const parsed = JSON.parse(savedSearchesJson);
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
        })));
      } catch (error) {
        console.error('Error parsing saved searches:', error);
      }
    }
  }, []);
  
  // Save current search
  const handleSaveSearch = () => {
    if (!newSearchName.trim()) {
      setSaveError('Please enter a name for this search');
      return;
    }
    
    if (!currentFilters) {
      setSaveError('No filters to save');
      return;
    }
    
    // Check for duplicate names
    if (savedSearches.some(search => search.name.toLowerCase() === newSearchName.toLowerCase())) {
      setSaveError('A search with this name already exists');
      return;
    }
    
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: newSearchName,
      filters: { ...currentFilters },
      createdAt: new Date(),
    };
    
    const updatedSearches = [...savedSearches, newSearch];
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    setSavedSearches(updatedSearches);
    setNewSearchName('');
    setSaveError(null);
  };
  
  // Delete a saved search
  const handleDeleteSearch = (searchId: string) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    setSavedSearches(updatedSearches);
  };
  
  // Load a saved search
  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters);
    onClose();
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  // Get summary of filters
  const getFilterSummary = (filters: SearchFilters) => {
    const summary: string[] = [];
    
    if (filters.sport && filters.sport !== 'all') {
      summary.push(filters.sport.charAt(0).toUpperCase() + filters.sport.slice(1));
    }
    
    if (filters.location) {
      summary.push(filters.location);
    }
    
    if (filters.maxDistance) {
      summary.push(`${filters.maxDistance}km radius`);
    }
    
    if (filters.rating > 0) {
      summary.push(`${filters.rating}+ stars`);
    }
    
    if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 200)) {
      summary.push(`$${filters.priceRange[0]}-$${filters.priceRange[1]}`);
    }
    
    if (filters.isIndoor !== undefined) {
      summary.push(filters.isIndoor ? 'Indoor' : 'Outdoor');
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      summary.push(`${filters.amenities.length} amenities`);
    }
    
    return summary.join(' • ');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Saved Searches</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Save Current Search */}
        {currentFilters && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Save Current Search</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter a name for this search..."
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {saveError && (
                <p className="text-sm text-red-600">{saveError}</p>
              )}
              
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSearch}
                  disabled={!newSearchName.trim()}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Current Search
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Saved Searches List */}
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Your Saved Searches</h4>
          
          {savedSearches.length > 0 ? (
            <div className="space-y-3">
              {savedSearches.map(search => (
                <div 
                  key={search.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{search.name}</h5>
                    <span className="text-xs text-gray-500">{formatDate(search.createdAt)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {getFilterSummary(search.filters)}
                  </p>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteSearch(search.id)}
                      className="flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleLoadSearch(search)}
                      className="flex items-center"
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Load Search
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Save className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No saved searches yet</p>
              <p className="text-sm text-gray-400 mt-1">Save your favorite searches for quick access</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};