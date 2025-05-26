export type Status = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export type Patient = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: Status;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

export type PatientCreate = Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>;
export type PatientUpdate = Partial<PatientCreate>;

export type EditingPatient = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  status: Status;
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type SortField = 'firstName' | 'dateOfBirth' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc' | null;

export type Filters = {
  name: string;
  dateOfBirth: {
    from: Date | null;
    to: Date | null;
  };
  status: Status | '';
  createdAt: {
    from: Date | null;
    to: Date | null;
  };
  city: string;
  state: string;
};

export type EditingDate = {
  month: string;
  day: string;
  year: string;
}; 