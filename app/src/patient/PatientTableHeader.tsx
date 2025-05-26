import React from 'react';
import { TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { SortField, SortDirection } from './types';

interface PatientTableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const PatientTableHeader: React.FC<PatientTableHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUpIcon className="h-4 w-4 text-gray-600" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDownIcon className="h-4 w-4 text-gray-600" />;
    }
    return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />;
  };

  return (
    <TableHead>
      <TableRow>
        <TableHeadCell>
          <button 
            onClick={() => onSort('firstName')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150"
          >
            Name
            {getSortIcon('firstName')}
          </button>
        </TableHeadCell>
        <TableHeadCell>
          <button 
            onClick={() => onSort('dateOfBirth')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150"
          >
            Date of Birth
            {getSortIcon('dateOfBirth')}
          </button>
        </TableHeadCell>
        <TableHeadCell>
          <button 
            onClick={() => onSort('status')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150"
          >
            Status
            {getSortIcon('status')}
          </button>
        </TableHeadCell>
        <TableHeadCell>Address</TableHeadCell>
        <TableHeadCell>
          <button 
            onClick={() => onSort('createdAt')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150"
          >
            Created At
            {getSortIcon('createdAt')}
          </button>
        </TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableRow>
    </TableHead>
  );
}; 