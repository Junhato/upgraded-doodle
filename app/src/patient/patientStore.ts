import { create } from 'zustand';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { Patient, PatientCreate, PatientUpdate, SortField } from './types';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  fetchPatients: (orderBy?: SortField) => Promise<void>;
  getPatient: (id: string) => Promise<Patient | null>;
  createPatient: (patient: PatientCreate) => Promise<Patient>;
  updatePatient: (id: string, patient: PatientUpdate) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set: any, get: any) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async (orderBy?: SortField) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`api/patients`);
      set({ patients: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch patients', loading: false });
      console.error(error);
    }
  },

  getPatient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`api/patient/${id}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: 'Failed to fetch patient', loading: false });
      return null;
    }
  },

  createPatient: async (patient: PatientCreate) => {
    set({ loading: true, error: null });
    try {
      const newPatient = {
        ...patient,
        id: uuidv4()
      }
      console.log('newPatient', newPatient)
      const response = await axios.put('api/patient', newPatient);
      set((state: PatientState) => ({
        patients: [...state.patients, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: 'Failed to create patient', loading: false });
      throw error;
    }
  },

  updatePatient: async (id: string, patient: PatientUpdate) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`api/patient/${id}`, patient);
      set((state: PatientState) => ({
        patients: state.patients.map((p: Patient) =>
          p.id === id ? response.data : p
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: 'Failed to update patient', loading: false });
      throw error;
    }
  },

  deletePatient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`api/patient/${id}`);
      set((state: PatientState) => ({
        patients: state.patients.filter((p: Patient) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete patient', loading: false });
      throw error;
    }
  },
})); 