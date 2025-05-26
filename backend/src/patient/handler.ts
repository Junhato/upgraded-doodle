import { Elysia, t } from "elysia";
import { v4 as uuidv4 } from 'uuid';
import { patientService } from "./service";
import { patientInsertSchema, patientSelectSchema, PatientInsert, PatientUpdate, patientUpdateSchema, orderBy } from "./schema";
import { Value } from "@sinclair/typebox/value";

// TODO secure this
export const patientHandler = new Elysia()
.use(patientService)
.get('/patient/:id', async ({ params: { id }, status, patient: { getPatient }}) => {
    const patient = await getPatient(id)
    if (!patient) {
        return status(404, 'Not Found')
    }
    return patient
},
    {
        params: t.Object({
            id: t.String()
        })
    }
)
.put('/patient', async ({ body, status, patient: { createPatient } }) => {
    const newPatient = body as PatientInsert
    const createdPatient = await createPatient(newPatient)
    if (!createdPatient || createdPatient.length === 0) {
        return status(404, 'Not Found')
    }
    return createdPatient[0]
},
    {
        body: patientInsertSchema
    }
)
.delete('/patient/:id', async ({ params: { id }, status, patient: { deletePatient } }) => {
    const deletedPatient = await deletePatient(id)
    if (!deletedPatient) {
        return status(200)
    }
    return deletedPatient
},
    {
        params: t.Object({
            id: t.String()
        })
    }
)
.put('/patient/:id', async ({ params: { id }, body, status, patient: { updatePatient } }) => {
    const patient = body as PatientUpdate
    const updatedPatient = await updatePatient(id, patient)
    if (!updatedPatient) {
        return status(404, 'Not Found')
    }

    return updatedPatient
},
    {
        body: patientUpdateSchema
    }
)
.get('/patients', async ({ patient: { getPatients } }) => {
    return await getPatients()
})
.post('/patients', async ({ body, patient: { getPatients } }) => {
    const { orderBy, asc } = body
    return await getPatients(orderBy, asc)
},  
    {
        body: t.Object({
            orderBy: t.Optional(orderBy),
            asc: t.Optional(t.Boolean())
        })
    }
)
