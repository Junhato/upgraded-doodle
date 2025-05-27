import { makeAutoObservable, runInAction } from 'mobx';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { Patient, PatientCreate, PatientUpdate, SortField, Status } from '../types';

export class PatientModel {
  id!: string;
  firstName!: string;
  middleName?: string;
  lastName!: string;
  dateOfBirth!: string;
  status!: Status;
  street!: string;
  city!: string;
  state!: string;
  zipCode!: string;
  country!: string;
  createdAt!: string;
  updatedAt!: string;

  constructor(data: Patient) {
    makeAutoObservable(this);
    Object.assign(this, data);
  }

  update(data: Partial<Patient>) {
    Object.assign(this, data);
  }
}

export class PatientStore {
  patients = new Map<string, PatientModel>();
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  *fetchPatients(orderBy?: SortField): Generator<Promise<any>, void, any> {
    this.loading = true;
    this.error = null;
    try {
      const response = yield axios.get('api/patients');
      runInAction(() => {
        this.patients.clear();
        response.data.forEach((patient: Patient) => {
          this.patients.set(patient.id, new PatientModel(patient));
        });
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch patients';
        this.loading = false;
      });
      console.error(error);
    }
  }

  *getPatient(id: string): Generator<Promise<any>, PatientModel | null, any> {
    this.loading = true;
    this.error = null;
    try {
      const response = yield axios.get(`api/patient/${id}`);
      const patient = new PatientModel(response.data);
      runInAction(() => {
        this.loading = false;
        this.patients.set(patient.id, patient);
      });
      return patient;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch patient';
        this.loading = false;
      });
      return null;
    }
  }

  *createPatient(patientData: PatientCreate): Generator<Promise<any>, PatientModel, any> {
    this.loading = true;
    this.error = null;
    try {
      const newPatient = {
        ...patientData,
        id: uuidv4()
      };
      const response = yield axios.put('api/patient', newPatient);
      const patient = new PatientModel(response.data);
      runInAction(() => {
        this.patients.set(patient.id, patient);
        this.loading = false;
      });
      return patient;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to create patient';
        this.loading = false;
      });
      throw error;
    }
  }

  *updatePatient(id: string, patientData: PatientUpdate): Generator<Promise<any>, PatientModel | undefined, any> {
    this.loading = true;
    this.error = null;
    try {
      const response = yield axios.put(`api/patient/${id}`, patientData);
      const patient = this.patients.get(id);
      if (patient) {
        runInAction(() => {
          patient.update(response.data);
          this.loading = false;
        });
        return patient;
      }
      this.loading = false;
      return undefined;
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update patient';
        this.loading = false;
      });
      throw error;
    }
  }

  *deletePatient(id: string): Generator<Promise<any>, void, any> {
    this.loading = true;
    this.error = null;
    try {
      yield axios.delete(`api/patient/${id}`);
      runInAction(() => {
        this.patients.delete(id);
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to delete patient';
        this.loading = false;
      });
      throw error;
    }
  }

  get patientList(): PatientModel[] {
    return Array.from(this.patients.values());
  }
}

export const patientStore = new PatientStore(); 