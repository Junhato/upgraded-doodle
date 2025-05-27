import React, { useState } from 'react';
import { patientStore } from './stores/patientStore';
import { Datepicker, TextInput, Label, Select, Button } from "flowbite-react";
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NewPatientFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPatientForm: React.FC<NewPatientFormProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: new Date(),
    status: 'Inquiry' as const,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date || new Date(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const patientData = {
        firstName: formData.firstName,
        middleName: formData.middleName || undefined,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth.toISOString(),
        status: formData.status,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      patientStore.createPatient(patientData);
      onClose();
    } catch (err) {
      setError('Failed to create patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white tracking-tight">Add New Patient</h2>
            <p className="mt-2 text-base text-slate-600 dark:text-gray-400 leading-relaxed">
              Enter the patient's information below
            </p>
          </div>
          <Button
            onClick={onClose}
            size="xs"
            color="gray"
            className="p-1"
          >
            <XMarkIcon className="h-6 w-6" />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Fields */}
            <div className="md:col-span-2 flex gap-4">
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label htmlFor="firstName">First Name</Label>
                </div>
                <TextInput
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  sizing="sm"
                />
              </div>
              <div className="w-1/4">
                <div className="mb-2 block">
                  <Label htmlFor="middleName">Middle Name</Label>
                </div>
                <TextInput
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  sizing="sm"
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 block">
                  <Label htmlFor="lastName">Last Name</Label>
                </div>
                <TextInput
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  sizing="sm"
                />
              </div>
            </div>

            {/* Date of Birth Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
              </div>
              <Datepicker
                value={formData.dateOfBirth}
                onChange={handleDateChange}
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

            {/* Status */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="status">Status</Label>
              </div>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                sizing="sm"
              >
                <option value="Inquiry">Inquiry</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Active">Active</option>
                <option value="Churned">Churned</option>
              </Select>
            </div>

            {/* Address Fields */}
            <div className="md:col-span-2">
              <div className="mb-2 block">
                <Label htmlFor="street">Street Address</Label>
              </div>
              <TextInput
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
                sizing="sm"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="city">City</Label>
              </div>
              <TextInput
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                sizing="sm"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="state">State</Label>
              </div>
              <TextInput
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                sizing="sm"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="zipCode">ZIP Code</Label>
              </div>
              <TextInput
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
                sizing="sm"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="country">Country</Label>
              </div>
              <TextInput
                id="country"
                name="country"
                value="United States"
                disabled
                sizing="sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              color="gray"
              onClick={onClose}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              color="green"
              size="sm"
            >
              {loading ? 'Creating...' : 'Create Patient'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 