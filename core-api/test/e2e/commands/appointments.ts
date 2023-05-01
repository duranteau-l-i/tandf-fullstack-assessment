import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import supertest from "supertest";

import { Api } from "../api";

export const bookAppointment = (
  api: Api,
  bookAppointment: BookAppointmentInput
): supertest.Test =>
  api.post("").send({
    query: `
    mutation ($bookAppointment: BookAppointmentInput!) {
      bookAppointment(bookAppointmentInput: $bookAppointment) {
        id
        startTime
        durationMinutes,
        doctor {
          id
        }
      }
    }
`,
    variables: {
      bookAppointment
    }
  });
