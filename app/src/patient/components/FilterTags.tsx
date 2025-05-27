import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Filters } from '../types';
import { formatDateRange } from '../utils/filterUtils';

interface FilterTagsProps {
  filters: Filters;
  onRemoveFilter: (field: keyof Filters) => void;
}

export const FilterTags: React.FC<FilterTagsProps> = ({ filters, onRemoveFilter }) => {
  const renderTag = (key: keyof Filters, displayName: string, value: string) => (
    <div key={key} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
      <span>{displayName}: {value}</span>
      <XMarkIcon 
        className="h-4 w-4 cursor-pointer" 
        onClick={() => onRemoveFilter(key)} 
      />
    </div>
  );

  const tags = [];

  if (filters.name) {
    tags.push(renderTag('name', 'Name', filters.name));
  }
  if (filters.city) {
    tags.push(renderTag('city', 'City', filters.city));
  }
  if (filters.state) {
    tags.push(renderTag('state', 'State', filters.state));
  }
  if (filters.status) {
    tags.push(renderTag('status', 'Status', filters.status));
  }

  const dateOfBirthRange = formatDateRange(filters.dateOfBirth.from, filters.dateOfBirth.to);
  if (dateOfBirthRange) {
    tags.push(renderTag('dateOfBirth', 'Birth Date', dateOfBirthRange));
  }

  const createdAtRange = formatDateRange(filters.createdAt.from, filters.createdAt.to);
  if (createdAtRange) {
    tags.push(renderTag('createdAt', 'Created', createdAtRange));
  }

  return <div className="flex flex-wrap gap-2">{tags}</div>;
}; 