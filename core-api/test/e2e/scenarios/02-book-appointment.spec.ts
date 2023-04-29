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
  it("addDoctors: should add doctors successfully", async () => {
    const doctoToAdd = { name: "Doctor" };

    const res = await addDoctor(api, doctoToAdd);

    expect(res.status).toBe(200);

    const doctor = res.body.data.addDoctor as Doctor;

    expect(doctor?.id).toBeGreaterThan(0);
  });

  it("addAvailabilities: should add availabilities successfully", async () => {
    const doctors = await fetchDoctors(api);

    if (doctors.body.data.doctors.length) {
      const availablitiesToAdd = createAvailability(
        doctors.body.data.doctors[0],
        1
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

  it("should book appointment successfully", async () => {
    const from = new Date(1, 4, 2023, 14, 0, 0);
    const to = new Date(1, 4, 2023, 14, 15, 0);

    const slotsRes = await fetchSlots(api, from, to);

    expect(slotsRes.status).toBe(200);

    const slots = slotsRes.body.data.slots as Slot[];
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
    const from = new Date(1, 4, 2023, 14, 0, 0);
    const to = new Date(1, 4, 2023, 14, 15, 0);

    const slotsRes = await fetchSlots(api, from, to);

    expect(slotsRes.status).toBe(200);

    const slots = slotsRes.body.data.slots as Slot[];

    expect(slots).toEqual([]);
  });
});
