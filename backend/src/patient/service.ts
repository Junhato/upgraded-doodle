import { Elysia, t } from "elysia";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { desc, eq, asc } from "drizzle-orm";
import { Database } from "bun:sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { OrderBy, PatientSelect, PatientInsert, PatientUpdate } from "./schema";
import { patientsTable } from "./schema";
import { resolve } from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = resolve(currentFilePath, "..");
const sqlite = new Database(resolve(currentDir, "sqlite.db"))
export const db = drizzle(sqlite);
migrate(db, { migrationsFolder: resolve(currentDir, "drizzle") });

export const patientService = new Elysia().decorate({
    patient: {
        getPatient: async (id: string) => {
            const patient = await db.select().from(patientsTable).where(eq(patientsTable.id, id))
            if (!patient) {
                return null
            }
            return patient[0]
        },
        createPatient: async (patient: PatientInsert) => {
            return db.insert(patientsTable).values(patient).returning()
        },
        deletePatient: async (id: string) => {
            const patient = await db.select().from(patientsTable).where(eq(patientsTable.id, id))
            if (!patient) {
                return null
            }
            await db.delete(patientsTable).where(eq(patientsTable.id, id))
            return patient[0]
        },
        updatePatient: async (id: string, patient: PatientUpdate) => {
            const exsistingPatient = await db.select().from(patientsTable).where(eq(patientsTable.id, id))
            if (!exsistingPatient) {
                return null
            }
            const updatedPatient = await db.update(patientsTable).set(patient).where(eq(patientsTable.id, id)).returning()
            return updatedPatient[0]
        },
        getPatients: async (orderBy?: OrderBy, isAsc=true): Promise<PatientSelect[]> => {
            const query = db.select().from(patientsTable).$dynamic()
            let orderByField: typeof patientsTable[keyof typeof patientsTable] = patientsTable.createdAt
            if (!orderBy) {
                return query.orderBy(isAsc ? asc(orderByField) : desc(orderByField))
            }
            // TODO sort by last name? sort by multiple field?
            switch (orderBy) { 
                case 'id':
                    orderByField = patientsTable.id
                    break
                case 'firstName':
                    orderByField = patientsTable.firstName
                    break
                case 'lastName':
                    orderByField = patientsTable.lastName
                    break
                case 'dateOfBirth':
                    orderByField = patientsTable.dateOfBirth
                    break
                case 'status':
                    orderByField = patientsTable.status
                    break
                case 'createdAt':
                    orderByField = patientsTable.createdAt
                    break
                case 'updatedAt':
                    orderByField = patientsTable.updatedAt
                    break
                default:
                    orderByField = patientsTable.createdAt
            }
            return query.orderBy(isAsc ? asc(orderByField) : desc(orderByField))
        },
    }
})