import React, { useState, useCallback } from 'react';
import { Button, TextInput, Select, Datepicker, Label } from 'flowbite-react';
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Filters } from './types';

interface PatientFiltersProps {
  filters: Filters;
  searchTerm: string;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (field: keyof Filters, value: any) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  onAddNewPatient: () => void;
}

export const PatientFilters: React.FC<PatientFiltersProps> = ({
  filters,
  searchTerm,
  showFilters,
  onSearchChange,
  onFilterChange,
  onToggleFilters,
  onClearFilters,
  onAddNewPatient,
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const toggleFilter = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
  };

  const handleFilterChange = useCallback((field: keyof Filters, value: any) => {
    onFilterChange(field, value);
    setActiveFilter(null); // Close the filter panel after setting a value
  }, [onFilterChange]);

  const formatDateRange = (from: Date | null, to: Date | null) => {
    if (!from && !to) return '';
    if (from && to) return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
    if (from) return `From ${from.toLocaleDateString()}`;
    return `Until ${to!.toLocaleDateString()}`;
  };

  const removeFilter = (field: keyof Filters) => {
    if (field === 'dateOfBirth') {
      handleFilterChange(field, { from: null, to: null });
    } else if (field === 'createdAt') {
      handleFilterChange(field, { from: null, to: null });
    } else {
      handleFilterChange(field, '');
    }
  };

  const FilterPopout = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    );
  };

  const renderFilterTags = () => {
    const tags = [];

    if (filters.name) {
      tags.push(
        <div key="name" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>Name: {filters.name}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('name')} />
        </div>
      );
    }

    if (filters.city) {
      tags.push(
        <div key="city" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>City: {filters.city}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('city')} />
        </div>
      );
    }

    if (filters.state) {
      tags.push(
        <div key="state" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>State: {filters.state}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('state')} />
        </div>
      );
    }

    if (filters.status) {
      tags.push(
        <div key="status" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>Status: {filters.status}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('status')} />
        </div>
      );
    }

    const dateOfBirthRange = formatDateRange(filters.dateOfBirth.from, filters.dateOfBirth.to);
    if (dateOfBirthRange) {
      tags.push(
        <div key="dateOfBirth" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>Birth Date: {dateOfBirthRange}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('dateOfBirth')} />
        </div>
      );
    }

    const createdAtRange = formatDateRange(filters.createdAt.from, filters.createdAt.to);
    if (createdAtRange) {
      tags.push(
        <div key="createdAt" className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
          <span>Created: {createdAtRange}</span>
          <XMarkIcon className="h-4 w-4 cursor-pointer" onClick={() => removeFilter('createdAt')} />
        </div>
      );
    }

    return tags;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <TextInput
              icon={MagnifyingGlassIcon}
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              color="gray"
              onClick={onToggleFilters}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            {showFilters && (
              <Button
                color="gray"
                onClick={onClearFilters}
                className="flex items-center gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear Filters</span>
              </Button>
            )}
            <Button
              onClick={onAddNewPatient}
              color="green"
              className="flex items-center gap-2 hover:bg-green-600"
            >
              <span>Add New Patient</span>
            </Button>
          </div>
        </div>
        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {renderFilterTags()}
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Name Filter */}
          <div className="relative">
            <Button
              color={filters.name ? "info" : "gray"}
              onClick={() => toggleFilter('name')}
              className="flex items-center gap-2"
            >
              <span>Name</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'name' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'name'} onClose={() => setActiveFilter(null)}>
              <div className="w-64">
                <Label htmlFor="name-filter">Filter by name</Label>
                <TextInput
                  id="name-filter"
                  sizing="sm"
                  placeholder="Enter name..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="mt-2"
                />
              </div>
            </FilterPopout>
          </div>

          {/* City Filter */}
          <div className="relative">
            <Button
              color={filters.city ? "info" : "gray"}
              onClick={() => toggleFilter('city')}
              className="flex items-center gap-2"
            >
              <span>City</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'city' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'city'} onClose={() => setActiveFilter(null)}>
              <div className="w-64">
                <Label htmlFor="city-filter">Filter by city</Label>
                <TextInput
                  id="city-filter"
                  sizing="sm"
                  placeholder="Enter city..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="mt-2"
                />
              </div>
            </FilterPopout>
          </div>

          {/* State Filter */}
          <div className="relative">
            <Button
              color={filters.state ? "info" : "gray"}
              onClick={() => toggleFilter('state')}
              className="flex items-center gap-2"
            >
              <span>State</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'state' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'state'} onClose={() => setActiveFilter(null)}>
              <div className="w-64">
                <Label htmlFor="state-filter">Filter by state</Label>
                <TextInput
                  id="state-filter"
                  sizing="sm"
                  placeholder="Enter state..."
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="mt-2"
                />
              </div>
            </FilterPopout>
          </div>

          {/* Birth Date Filter */}
          <div className="relative">
            <Button
              color={filters.dateOfBirth.from || filters.dateOfBirth.to ? "info" : "gray"}
              onClick={() => toggleFilter('birthDate')}
              className="flex items-center gap-2"
            >
              <span>Birth Date</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'birthDate' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'birthDate'} onClose={() => setActiveFilter(null)}>
              <div className="w-72 space-y-4">
                <div>
                  <Label htmlFor="birth-date-from">From</Label>
                  <Datepicker
                    id="birth-date-from"
                    sizing="sm"
                    placeholder="From date..."
                    value={filters.dateOfBirth.from}
                    onChange={(date) => handleFilterChange('dateOfBirth', { ...filters.dateOfBirth, from: date })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="birth-date-to">To</Label>
                  <Datepicker
                    id="birth-date-to"
                    sizing="sm"
                    placeholder="To date..."
                    value={filters.dateOfBirth.to}
                    onChange={(date) => handleFilterChange('dateOfBirth', { ...filters.dateOfBirth, to: date })}
                    className="mt-2"
                  />
                </div>
              </div>
            </FilterPopout>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Button
              color={filters.status ? "info" : "gray"}
              onClick={() => toggleFilter('status')}
              className="flex items-center gap-2"
            >
              <span>Status</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'status' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'status'} onClose={() => setActiveFilter(null)}>
              <div className="w-64">
                <Label htmlFor="status-filter">Filter by status</Label>
                <Select
                  id="status-filter"
                  sizing="sm"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="mt-2"
                >
                  <option value="">All Statuses</option>
                  <option value="Inquiry">Inquiry</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Active">Active</option>
                  <option value="Churned">Churned</option>
                </Select>
              </div>
            </FilterPopout>
          </div>

          {/* Created Date Filter */}
          <div className="relative">
            <Button
              color={filters.createdAt.from || filters.createdAt.to ? "info" : "gray"}
              onClick={() => toggleFilter('createdDate')}
              className="flex items-center gap-2"
            >
              <span>Created Date</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === 'createdDate' ? 'rotate-180' : ''}`} />
            </Button>
            <FilterPopout isOpen={activeFilter === 'createdDate'} onClose={() => setActiveFilter(null)}>
              <div className="w-72 space-y-4">
                <div>
                  <Label htmlFor="created-date-from">From</Label>
                  <Datepicker
                    id="created-date-from"
                    sizing="sm"
                    placeholder="From date..."
                    value={filters.createdAt.from}
                    onChange={(date) => handleFilterChange('createdAt', { ...filters.createdAt, from: date })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="created-date-to">To</Label>
                  <Datepicker
                    id="created-date-to"
                    sizing="sm"
                    placeholder="To date..."
                    value={filters.createdAt.to}
                    onChange={(date) => handleFilterChange('createdAt', { ...filters.createdAt, to: date })}
                    className="mt-2"
                  />
                </div>
              </div>
            </FilterPopout>
          </div>
        </div>
      )}
    </div>
  );
}; 