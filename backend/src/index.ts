import { Elysia } from "elysia";
import { patientHandler } from "./patient/handler";

const app = new Elysia()
.onError(({ error, code, path }) => {
    console.error(error)
    return {
        error: error,
        code: code,
        path: path
    }
})
.get('/', () => 'Hello Elysia')
.use(patientHandler).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
