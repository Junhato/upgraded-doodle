import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { patientStore, PatientModel } from './stores/patientStore';
import { NewPatientForm } from './NewPatientForm';
import { Table, TableBody, Pagination } from "flowbite-react";
import type { Filters, SortField, SortDirection, EditingDate } from './types';
import { sortPatients } from './utils';
import { PatientFilters } from './PatientFilters';
import { PatientTableHeader } from './PatientTableHeader';
import { PatientTableRow } from './PatientTableRow';

export const PatientTable: React.FC = observer(() => {
  const [isNewPatientFormOpen, setIsNewPatientFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState<Filters>({
    name: '',
    dateOfBirth: {
      from: null,
      to: null
    },
    status: '',
    createdAt: {
      from: null,
      to: null
    },
    city: '',
    state: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<PatientModel | null>(null);
  const [editingDate, setEditingDate] = useState<EditingDate>({ month: '', day: '', year: '' });
  const [sortField, setSortField] = useState<SortField>('firstName');
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  useEffect(() => {
    patientStore.fetchPatients();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(current => {
        if (current === null) return 'asc';
        if (current === 'asc') return 'desc';
        return null;
      });
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      patientStore.deletePatient(id);
    } catch (error) {
      console.error('Failed to delete patient:', error);
    }
  };

  const handleEditClick = (patient: PatientModel) => {
    setEditingId(patient.id);
    setEditingPatient(patient);
    
    const date = new Date(patient.dateOfBirth);
    setEditingDate({
      month: (date.getMonth() + 1).toString(),
      day: date.getDate().toString(),
      year: date.getFullYear().toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingPatient(null);
    setEditingDate({ month: '', day: '', year: '' });
  };

  const handleSaveEdit = async () => {
    if (!editingPatient) return;
    
    try {
      const dateOfBirth = new Date(
        parseInt(editingDate.year),
        parseInt(editingDate.month) - 1,
        parseInt(editingDate.day)
      ).toISOString();

      await patientStore.updatePatient(editingPatient.id, {
        ...editingPatient,
        dateOfBirth,
      });
      setEditingId(null);
      setEditingPatient(null);
      setEditingDate({ month: '', day: '', year: '' });
    } catch (error) {
      console.error('Failed to update patient:', error);
    }
  };

  const handleFieldChange = (field: keyof PatientModel, value: string) => {
    if (!editingPatient) return;
    setEditingPatient(new PatientModel({ ...editingPatient, [field]: value }));
  };

  const handleDateChange = (field: keyof EditingDate, value: string) => {
    setEditingDate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      dateOfBirth: {
        from: null,
        to: null
      },
      status: '',
      createdAt: {
        from: null,
        to: null
      },
      city: '',
      state: ''
    });
    setSearchTerm('');
  };

  // Filter patients based on search term and filters
  const filteredPatients = sortPatients(
    patientStore.patientList.filter((patient) => {
      const matchesSearch = searchTerm === '' || 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.status.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (filters.name && !`${patient.firstName} ${patient.lastName}`.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.city && !patient.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      if (filters.state && !patient.state.toLowerCase().includes(filters.state.toLowerCase())) {
        return false;
      }

      if (filters.dateOfBirth.from || filters.dateOfBirth.to) {
        const patientDOB = new Date(patient.dateOfBirth);
        if (filters.dateOfBirth.from && patientDOB < filters.dateOfBirth.from) {
          return false;
        }
        if (filters.dateOfBirth.to && patientDOB > filters.dateOfBirth.to) {
          return false;
        }
      }

      if (filters.status && patient.status !== filters.status) {
        return false;
      }

      if (filters.createdAt.from || filters.createdAt.to) {
        const patientCreatedAt = new Date(patient.createdAt);
        if (filters.createdAt.from && patientCreatedAt < filters.createdAt.from) {
          return false;
        }
        if (filters.createdAt.to && patientCreatedAt > filters.createdAt.to) {
          return false;
        }
      }

      return true;
    }),
    sortField,
    sortDirection
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (patientStore.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading patients...</div>
      </div>
    );
  }

  if (patientStore.error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {patientStore.error}</div>
      </div>
    );
  }

  if (patientStore.patientList.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow">
          <div className="text-gray-500 text-lg mb-4">No patients found</div>
          <p className="text-gray-400 mb-8">Get started by adding your first patient</p>
          <button
            onClick={() => setIsNewPatientFormOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            Add New Patient
          </button>
        </div>
        <NewPatientForm
          isOpen={isNewPatientFormOpen}
          onClose={() => setIsNewPatientFormOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-white tracking-tight">
            Patient Management
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-gray-400 leading-relaxed">
            Manage and view all your patient records in one place
          </p>
        </div>

        <PatientFilters
          filters={filters}
          searchTerm={searchTerm}
          showFilters={showFilters}
          onSearchChange={setSearchTerm}
          onFilterChange={handleFilterChange}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
          onAddNewPatient={() => setIsNewPatientFormOpen(true)}
        />

        <div className="overflow-x-auto">
          <Table hoverable theme={{
            root: {
              base: "w-full text-left text-sm text-gray-500 dark:text-gray-400"
            }
          }}>
            <PatientTableHeader
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableBody>
              {currentItems.map((patient) => (
                <PatientTableRow
                  key={patient.id}
                  patient={patient}
                  editingId={editingId}
                  editingPatient={editingPatient}
                  editingDate={editingDate}
                  onEditClick={handleEditClick}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDeletePatient={handleDeletePatient}
                  onFieldChange={handleFieldChange}
                  onDateChange={handleDateChange}
                />
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                showIcons
                theme={{
                  pages: {
                    base: "xs:mt-0 mt-2 inline-flex items-center -space-x-px",
                    showIcon: "inline-flex",
                    previous: {
                      base: "ml-0 rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      icon: "h-5 w-5"
                    },
                    next: {
                      base: "rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      icon: "h-5 w-5"
                    },
                    selector: {
                      base: "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white",
                      active: "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white",
                      disabled: "opacity-50 cursor-normal"
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>
      <NewPatientForm
        isOpen={isNewPatientFormOpen}
        onClose={() => setIsNewPatientFormOpen(false)}
      />
    </>
  );
}); 