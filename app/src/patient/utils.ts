import type { Status, SortField } from './types';

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Churned':
      return 'bg-red-100 text-red-800';
    case 'Inquiry':
      return 'bg-yellow-100 text-yellow-800';
    case 'Onboarding':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const sortPatients = (patients: any[], sortField: SortField, sortDirection: 'asc' | 'desc' | null) => {
  if (!sortDirection) return patients;

  return [...patients].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'firstName':
        aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
        bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
        break;
      case 'dateOfBirth':
        aValue = new Date(a.dateOfBirth).getTime();
        bValue = new Date(b.dateOfBirth).getTime();
        break;
      case 'status':
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
}; 