import { faker } from "@faker-js/faker";

import { createApi } from "../api";

import {
  addAvailability,
  addDoctor,
  fetchDoctors,
  fetchSlots
} from "../commands/doctors";
import { bookAppointment } from "../commands/appointments";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { Appointment } from "@/entities/Appointment";
import { Slot } from "@/models/appointments/Slot";
import { Doctor } from "@/entities/Doctor";
import { Availability } from "@/entities/Availability";
import { createAvailability } from "@/services/test/builder/createAvailability";

const api = createApi();

describe("Book appointment scenario", () => {
  describe.skip("Unskip to genaate doctor and availabilities", () => {
    it("addDoctors: should add doctors successfully", async () => {
      const doctoToAdd = { name: "Doctor 1" };
      const doctoToAdd2 = { name: "Doctor 2" };

      const res = await addDoctor(api, doctoToAdd);
      await addDoctor(api, doctoToAdd2);

      expect(res.status).toBe(200);

      const doctor = res.body.data.addDoctor as Doctor;

      expect(doctor?.id).toBeGreaterThan(0);
    });

    it("addAvailabilities: should add availabilities successfully", async () => {
      const doctors = await fetchDoctors(api);

      if (doctors.body.data.doctors.length) {
        for await (const day of Array.from(Array(29).keys())) {
          await makeAvailablityForDoctorPerDay(
            doctors.body.data.doctors[0],
            day
          );
          await makeAvailablityForDoctorPerDay(
            doctors.body.data.doctors[1],
            day
          );
        }
      }

      async function makeAvailablityForDoctorPerDay(
        doctor: Doctor,
        day: number
      ) {
        const availablitiesToAdd = createAvailability(
          doctor,
          2,
          new Date(2023, 4, day + 1, 9, 0, 0),
          new Date(2023, 4, day + 1, 15, 0, 0)
        );

        for await (const availablityToAdd of availablitiesToAdd) {
          const res = await addAvailability(api, {
            dayOfWeek: availablityToAdd.dayOfWeek,
            startTimeUtc: new Date(availablityToAdd.startTimeUtc),
            endTimeUtc: new Date(availablityToAdd.endTimeUtc),
            doctorId: availablityToAdd.doctor.id
          });

          const availability = res.body.data.addAvailability as Availability;

          expect(availability?.id).toBeGreaterThan(0);
        }
      }
    });
  });

  it("should book appointment successfully", async () => {
    const from = new Date(2023, 4, 1, 15, 0, 0);
    const to = new Date(2023, 4, 1, 15, 15, 0);

    const slotsRes = await fetchSlots(api, from, to);

    expect(slotsRes.status).toBe(200);

    const slots = slotsRes.body.data.slots as Slot[];

    expect(slots).toHaveLength(2);

    const selectedSlot = slots[0];

    const bookAppointmentInput: BookAppointmentInput = {
      slot: selectedSlot,
      patientName: faker.name.firstName(),
      description: faker.lorem.lines(5)
    };

    const appointmentRes = await bookAppointment(api, bookAppointmentInput);

    const appointment = appointmentRes.body.data.bookAppointment as Appointment;

    expect(appointment.startTime).toBe(selectedSlot.start);
    expect(appointment.doctor.id).toBe(selectedSlot.doctorId);
  });

  it("should return an empty aray of slot", async () => {
    const from = new Date(2023, 4, 1, 15, 0, 0);
    const to = new Date(2023, 4, 1, 15, 15, 0);

    const slotsRes = await fetchSlots(api, from, to);

    expect(slotsRes.status).toBe(200);

    const slots = slotsRes.body.data.slots as Slot[];

    expect(slots).toHaveLength(1);
  });
});
