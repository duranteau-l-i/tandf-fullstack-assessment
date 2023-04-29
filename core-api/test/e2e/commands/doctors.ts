import supertest from "supertest";

import { Api } from "../api";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import { AddAvailabilityInput } from "@/models/doctor/AddAvailabilityInput";

export const fetchSlots = (api: Api, from: Date, to: Date): supertest.Test =>
  api.post("").send({
    query: `
      query slots($from: DateTime!, $to: DateTime!) {
        slots(from: $from, to: $to) {
          doctorId
          start
          end
        }
      }
    `,
    variables: {
      from,
      to
    }
  });

export const addDoctor = (
  api: Api,
  addDoctorInput: AddDoctorInput
): supertest.Test =>
  api.post("").send({
    query: `
      mutation ($addDoctorInput: AddDoctorInput!) {
        addDoctor(doctor: $addDoctorInput) {
          id
          name
        }
      }
    `,
    variables: {
      addDoctorInput
    }
  });

export const fetchDoctors = (api: Api): supertest.Test =>
  api.post("").send({
    query: `
      query doctors {
        doctors {
          id
          name
        }
      }
    `
  });

export const addAvailability = (
  api: Api,
  addAvailabilityInput: AddAvailabilityInput
): supertest.Test =>
  api.post("").send({
    query: `
      mutation ($addAvailabilityInput: AddAvailabilityInput!) {
        addAvailability(availability: $addAvailabilityInput) {
          id
          dayOfWeek
          startTimeUtc
          endTimeUtc
        }
      }
    `,
    variables: {
      addAvailabilityInput
    }
  });
