import { Value } from "@sinclair/typebox/value";
import { Type } from "@sinclair/typebox";
import { patientInsertSchema } from "./patient/schema";

Value.Assert(Type.Date(), '1900-01-01T00:00:00.000Z')

const patient = {
    id: '2e0b1123-bd39-40f2-a9a3-96255533687d',
    city: 'test',
    country: 'USA',
    dateOfBirth: new Date("1900-01-01"),
    firstName: 'test',
    lastName: 'test',
    middleName: 'test',
    state: 'test',
    status: 'Inquiry',
    street: 'test',
    zipCode: 'test',
}

const body = JSON.stringify(patient)

console.log('hi')
const headers = {
    'Content-Type': 'application/json'
}   
await fetch('http://localhost:3000/patient', {
    method: 'PUT',
    body: body,
    headers: headers
})
.then(response => console.log(response))
.then(data => console.log(data))
.catch(error => console.error('Error:', error));