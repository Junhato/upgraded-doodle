import React from 'react';
import { observer } from 'mobx-react-lite';
import { TableRow, TableCell, Button, TextInput, Select, Label, Datepicker } from 'flowbite-react';
import { EyeIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { EditingDate } from './types';
import { getStatusColor } from './utils';
import { PatientModel } from './stores/patientStore';

interface PatientTableRowProps {
  patient: PatientModel;
  editingId: string | null;
  editingPatient: PatientModel | null;
  editingDate: EditingDate;
  onEditClick: (patient: PatientModel) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDeletePatient: (id: string) => void;
  onFieldChange: (field: keyof PatientModel, value: string) => void;
  onDateChange: (field: keyof EditingDate, value: string) => void;
}

const PatientTableRowComponent: React.FC<PatientTableRowProps> = ({
  patient,
  editingId,
  editingPatient,
  editingDate,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  onDeletePatient,
  onFieldChange,
  onDateChange,
}) => {
  const isEditing = editingId === patient.id;

  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="firstName" className="text-xs">First Name</Label>
                </div>
                <TextInput
                  id="firstName"
                  sizing="sm"
                  value={editingPatient?.firstName || ''}
                  onChange={(e) => onFieldChange('firstName', e.target.value)}
                  className="w-28"
                />
              </div>
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="middleName" className="text-xs">MI</Label>
                </div>
                <TextInput
                  id="middleName"
                  sizing="sm"
                  value={editingPatient?.middleName || ''}
                  onChange={(e) => onFieldChange('middleName', e.target.value)}
                  className="w-16"
                />
              </div>
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                </div>
                <TextInput
                  id="lastName"
                  sizing="sm"
                  value={editingPatient?.lastName || ''}
                  onChange={(e) => onFieldChange('lastName', e.target.value)}
                  className="w-28"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            {`${patient.firstName} ${patient.middleName ? patient.middleName + ' ' : ''}${patient.lastName}`}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[200px]">
        {isEditing ? (
          <div>
            <div className="mb-0.5 block">
              <Label htmlFor="dateOfBirth" className="text-xs">Date of Birth</Label>
            </div>
            <Datepicker
              value={new Date(patient.dateOfBirth)}
              onChange={(date) => {
                if (date) {
                  onDateChange('month', (date.getMonth() + 1).toString());
                  onDateChange('day', date.getDate().toString());
                  onDateChange('year', date.getFullYear().toString());
                }
              }}
              maxDate={new Date()}
              theme={{
                root: {
                  input: {
                    field: {
                      input: {
                        base: "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      }
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            {new Date(patient.dateOfBirth).toLocaleDateString()}
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[150px]">
        {isEditing ? (
          <div>
            <div className="mb-0.5 block">
              <Label htmlFor="status" className="text-xs">Status</Label>
            </div>
            <Select
              id="status"
              sizing="sm"
              value={editingPatient?.status || ''}
              onChange={(e) => onFieldChange('status', e.target.value)}
            >
              <option value="Inquiry">Inquiry</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Active">Active</option>
              <option value="Churned">Churned</option>
            </Select>
          </div>
        ) : (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <div>
              <div className="mb-0.5 block">
                <Label htmlFor="street" className="text-xs">Street</Label>
              </div>
              <TextInput
                id="street"
                sizing="sm"
                value={editingPatient?.street || ''}
                onChange={(e) => onFieldChange('street', e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-1">
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="city" className="text-xs">City</Label>
                </div>
                <TextInput
                  id="city"
                  sizing="sm"
                  value={editingPatient?.city || ''}
                  onChange={(e) => onFieldChange('city', e.target.value)}
                  className="w-28"
                />
              </div>
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="state" className="text-xs">State</Label>
                </div>
                <TextInput
                  id="state"
                  sizing="sm"
                  value={editingPatient?.state || ''}
                  onChange={(e) => onFieldChange('state', e.target.value)}
                  className="w-16"
                />
              </div>
              <div>
                <div className="mb-0.5 block">
                  <Label htmlFor="zipCode" className="text-xs">ZIP</Label>
                </div>
                <TextInput
                  id="zipCode"
                  sizing="sm"
                  value={editingPatient?.zipCode || ''}
                  onChange={(e) => onFieldChange('zipCode', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            {`${patient.street}, ${patient.city}, ${patient.state} ${patient.zipCode}`}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-500">
          {new Date(patient.createdAt).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="xs" color="gray" className="p-1">
            <EyeIcon className="h-4 w-4" />
          </Button>
          {isEditing ? (
            <>
              <Button
                size="xs"
                color="green"
                className="p-1"
                onClick={onSaveEdit}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="xs"
                color="gray"
                className="p-1"
                onClick={onCancelEdit}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              size="xs"
              color="gray"
              className="p-1"
              onClick={() => onEditClick(patient)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          <Button 
            size="xs" 
            color="gray" 
            className="p-1"
            onClick={() => onDeletePatient(patient.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// Use observer to make the component reactive to MobX changes
export const PatientTableRow = observer(PatientTableRowComponent); 