
import { PatientInsert, patientsTable } from "./patient/schema";
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { db } from "./patient/service";

const statuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'] as const;
type Status = typeof statuses[number];

async function clearDatabase() {
   await db.delete(patientsTable);
}

function generatePatient(num: number): PatientInsert[]   {
    const patients = [];
    for (let i = 0; i < num; i++) {
        patients.push({
            id: uuidv4(),
            city: faker.location.city(),
            country: 'United States',
            dateOfBirth: faker.date.birthdate().toISOString(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            middleName: faker.person.middleName(),
            state: faker.location.state(),
            status: faker.helpers.arrayElement(statuses) as Status,
            street: faker.location.streetAddress(),
            zipCode: faker.location.zipCode(),
        });
    }
    return patients;
}

async function seedDatabase() {
    await clearDatabase();
    const patients: PatientInsert[] = generatePatient(500);

    await db.insert(patientsTable).values(patients);

    console.log('Seeding complete.');
}

await seedDatabase();