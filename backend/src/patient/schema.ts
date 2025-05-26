import { t } from "elysia";
import { sql } from "drizzle-orm";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-typebox';
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const patientsTable = sqliteTable("patients", {
  id: text("id").primaryKey(),
  // name
  firstName: text("first_name"),
  middleName: text("middle_name").default(''),
  lastName: text("last_name"),
  dateOfBirth: text('date_of_birth'),
  status: text({ enum: ['Inquiry', 'Onboarding', 'Active', 'Churned'] }).default('Inquiry'),
  // address
  street: text("street"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),

  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const patientSelectSchema = createSelectSchema(patientsTable);
export type PatientSelect = typeof patientSelectSchema.static;

export const patientInsertSchema = createInsertSchema(patientsTable);
export type PatientInsert = typeof patientInsertSchema.static;

export const patientUpdateSchema = createUpdateSchema(patientsTable);
export type PatientUpdate = typeof patientUpdateSchema.static;

export const orderBy = t.Union([
    t.Literal('id'),
    t.Literal('firstName'),
    t.Literal('lastName'),
    t.Literal('dateOfBirth'),
    t.Literal('status'),
    t.Literal('createdAt'),
    t.Literal('updatedAt')
])
export type OrderBy = typeof orderBy.static