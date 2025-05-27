import React, { useState, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { Button, TextInput, Select, Datepicker, Label } from 'flowbite-react';
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { Filters } from './types';
import { FilterPopout } from './components/FilterPopout';
import { FilterTags } from './components/FilterTags';
import { formatDateRange, getInitialTempFilters, resetFilter } from './utils/filterUtils';

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
  const [tempFilters, setTempFilters] = useState(getInitialTempFilters());

  const toggleFilter = (filterName: string) => {
    setActiveFilter(activeFilter === filterName ? null : filterName);
    if (filterName === 'name') setTempFilters(prev => ({ ...prev, name: filters.name }));
    if (filterName === 'city') setTempFilters(prev => ({ ...prev, city: filters.city }));
    if (filterName === 'state') setTempFilters(prev => ({ ...prev, state: filters.state }));
  };

  const handleFilterChange = useCallback((field: keyof Filters, value: any) => {
    if (field === 'dateOfBirth' || field === 'createdAt' || field === 'status') {
      onFilterChange(field, value);
      setActiveFilter(null);
    }
  }, [onFilterChange]);

  const handleTextFilterChange = (field: 'name' | 'city' | 'state', value: string) => {
    setTempFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyTextFilter = (field: 'name' | 'city' | 'state') => {
    onFilterChange(field, tempFilters[field]);
    setActiveFilter(null);
  };

  const handleTextFilterKeyDown = (e: KeyboardEvent<HTMLInputElement>, field: 'name' | 'city' | 'state') => {
    if (e.key === 'Enter') {
      applyTextFilter(field);
    }
  };

  const removeFilter = (field: keyof Filters) => {
    onFilterChange(field, resetFilter(field, filters[field]));
  };

  const renderTextFilter = (field: 'name' | 'city' | 'state', label: string) => (
    <div className="relative">
      <Button
        color={filters[field] ? "info" : "gray"}
        onClick={() => toggleFilter(field)}
        className="flex items-center gap-2"
      >
        <span>{label}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === field ? 'rotate-180' : ''}`} />
      </Button>
      <FilterPopout isOpen={activeFilter === field} onClose={() => applyTextFilter(field)}>
        <div className="w-64">
          <Label htmlFor={`${field}-filter`}>Filter by {field}</Label>
          <TextInput
            id={`${field}-filter`}
            sizing="sm"
            placeholder={`Enter ${field}...`}
            value={tempFilters[field]}
            onChange={(e) => handleTextFilterChange(field, e.target.value)}
            onKeyDown={(e) => handleTextFilterKeyDown(e, field)}
            onBlur={() => applyTextFilter(field)}
            className="mt-2"
          />
        </div>
      </FilterPopout>
    </div>
  );

  const renderDateFilter = (
    field: 'dateOfBirth' | 'createdAt',
    label: string,
    buttonLabel: string
  ) => (
    <div className="relative">
      <Button
        color={filters[field].from || filters[field].to ? "info" : "gray"}
        onClick={() => toggleFilter(field)}
        className="flex items-center gap-2"
      >
        <span>{buttonLabel}</span>
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${activeFilter === field ? 'rotate-180' : ''}`} />
      </Button>
      <FilterPopout isOpen={activeFilter === field} onClose={() => setActiveFilter(null)}>
        <div className="w-72 space-y-4">
          <div>
            <Label htmlFor={`${field}-from`}>From</Label>
            <Datepicker
              id={`${field}-from`}
              sizing="sm"
              placeholder="From date..."
              value={filters[field].from}
              onChange={(date) => handleFilterChange(field, { ...filters[field], from: date })}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor={`${field}-to`}>To</Label>
            <Datepicker
              id={`${field}-to`}
              sizing="sm"
              placeholder="To date..."
              value={filters[field].to}
              onChange={(date) => handleFilterChange(field, { ...filters[field], to: date })}
              className="mt-2"
            />
          </div>
        </div>
      </FilterPopout>
    </div>
  );

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
        <FilterTags filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          {renderTextFilter('name', 'Name')}
          {renderTextFilter('city', 'City')}
          {renderTextFilter('state', 'State')}
          {renderDateFilter('dateOfBirth', 'Birth Date Filter', 'Birth Date')}
          
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

          {renderDateFilter('createdAt', 'Created Date Filter', 'Created Date')}
        </div>
      )}
    </div>
  );
}; 