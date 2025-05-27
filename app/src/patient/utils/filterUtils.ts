import type { Filters } from '../types';

export const formatDateRange = (from: Date | null, to: Date | null): string => {
  if (!from && !to) return '';
  if (from && to) return `${from.toLocaleDateString()} - ${to.toLocaleDateString()}`;
  if (from) return `From ${from.toLocaleDateString()}`;
  return `Until ${to!.toLocaleDateString()}`;
};

export const getInitialTempFilters = () => ({
  name: '',
  city: '',
  state: ''
});

export const resetFilter = (field: keyof Filters, currentValue: any) => {
  if (field === 'dateOfBirth' || field === 'createdAt') {
    return { from: null, to: null };
  }
  return '';
}; 