import { Appointment } from "@/entities/Appointment";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { faker } from "@faker-js/faker";
import createMockRepo from "@test/mocks/mockRepo";
import {
  addDays,
  addMinutes,
  nextMonday,
  setHours,
  setMinutes
} from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { AppointmentService } from "../../AppointmentService";
import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { Availability } from "@/entities/Availability";
import { createAvailability } from "../builder/createAvailability";

const mockDB = {
  doctors: [] as Doctor[],
  seedDoctors: function (data: Doctor[]): void {
    this.doctors = data;
  },

  appointments: [] as Appointment[],
  seedAppointments: function (data: Appointment[]): void {
    this.appointments = data;
  },

  availabilities: [] as Availability[],
  seedAvailabilities: function (data: Availability[]): void {
    this.availabilities = data;
  }
};

// I don't know if this is what was expected but I did it this way while not liking
// The repository is part of an external library
// And there is a principle that says: "Don't Mock What You Don't Own".
const mockRepo: Partial<Repository<Appointment>> = {
  // @ts-ignore
  find: function (props?: any): Pomise<Appointment[]> {
    return Promise.resolve(mockDB.appointments);
  },
  // @ts-ignore
  findOne: function (props?: any): Pomise<Appointment> {
    if (props?.where) {
      if (props?.where?.startTime) {
        return Promise.resolve(
          mockDB.appointments.filter(
            el =>
              el.startTime.toUTCString() ===
                props?.where?.startTime.toUTCString() &&
              el.durationMinutes === props?.where?.durationMinutes &&
              el.doctor.id === props?.where?.doctor.id
          )[0] as Appointment
        );
      } else if (props?.where?.id && props?.relations) {
        return Promise.resolve(
          mockDB.appointments.filter(
            el => el.id === props?.where?.id
          )[0] as Appointment
        );
      } else if (props?.where?.id) {
        return Promise.resolve(
          mockDB.doctors.filter(el => el.id === props?.where?.id)[0] as Doctor
        );
      }
    }
  },
  // @ts-ignore
  save: jest.fn(
    (entity: {
      doctor: Doctor;
      startTime: Date;
      durationMinutes: number;
    }): Appointment => {
      const appointment = new Appointment();
      appointment.id = mockDB.doctors.length + 1;
      appointment.doctor = entity.doctor;
      appointment.startTime = entity.startTime;
      appointment.durationMinutes = entity.durationMinutes;

      mockDB.seedAppointments([...mockDB.appointments, appointment]);
      return appointment;
    }
  ),
  // @ts-ignore
  delete: (props: any) => {
    if (props) {
      const filtered = mockDB.availabilities.filter(
        availability =>
          (availability.startTimeUtc !== props.startTimeUtc &&
            availability.doctor?.id === props.doctor?.id) ||
          availability.doctor?.id !== props.doctor?.id
      );

      mockDB.seedAvailabilities(filtered);
    }
  }
};

describe("AppointmentService", () => {
  let appointmentService: AppointmentService;

  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
    appointmentService = Container.get(AppointmentService);
  });

  beforeEach(() => {
    mockDB.seedAppointments([]);
    mockDB.seedDoctors([]);
    mockDB.seedAvailabilities([]);
  });

  describe("appointments", () => {
    it("should return an empty array", async () => {
      // ACT
      const appointments = await appointmentService.getAppointments();

      // ASSERT
      expect(appointments).toEqual([]);
    });

    it("should return all appointments", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      const appointment = new Appointment();
      appointment.id = 1;
      appointment.doctor = doctor;
      appointment.startTime = new Date(1, 4, 2023, 10, 0, 0);
      appointment.durationMinutes = 15;

      mockDB.seedAppointments([appointment]);

      // ACT
      const appointments = await appointmentService.getAppointments();

      // ASSERT
      expect(appointments).toEqual([
        expect.objectContaining({
          id: 1,
          doctor: expect.objectContaining({
            id: 1,
            name: "doctor 1"
          }),
          durationMinutes: 15,
          startTime: new Date("1906-11-13T10:00:00.000Z")
        })
      ]);
    });
  });

  describe("bookAppointment", () => {
    it("should book an appointment", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      const availabilitiesData = createAvailability(
        doctor,
        2,
        new Date(2023, 4, 1, 9, 0, 0),
        new Date(2023, 4, 1, 15, 0, 0)
      );

      mockDB.seedAvailabilities(availabilitiesData);
      mockDB.seedDoctors([doctor]);

      const slot = new Slot();
      slot.start = new Date(1, 4, 2023, 10, 0, 0);
      slot.end = new Date(1, 4, 2023, 10, 15, 0);
      slot.doctorId = 1;

      // ACT
      const appointment = await appointmentService.bookAppointment({
        slot,
        patientName: "John doe",
        description: "flu"
      });

      // ASSERT
      expect(appointment).toEqual(
        expect.objectContaining({
          doctor: expect.objectContaining({
            id: 1,
            name: "doctor 1"
          }),
          durationMinutes: 15,
          startTime: new Date("1906-11-13T10:00:00.000Z")
        })
      );

      expect(mockDB.appointments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            doctor: expect.objectContaining({
              id: 1,
              name: "doctor 1"
            }),
            durationMinutes: 15,
            startTime: new Date("1906-11-13T10:00:00.000Z")
          })
        ])
      );

      const hasItem = mockDB.availabilities.some(
        item =>
          item.startTimeUtc === "Tue, 13 Nov 1906 10:00:00 GMT" &&
          doctor.id === 1
      );
      expect(hasItem).toBe(false);
    });

    it("should not book duplicate appointment", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      mockDB.seedDoctors([doctor]);

      const appointment = new Appointment();
      appointment.id = 1;
      appointment.doctor = doctor;
      appointment.startTime = new Date(1, 4, 2023, 10, 0, 0);
      appointment.durationMinutes = 15;

      mockDB.seedAppointments([appointment]);

      const slot = new Slot();
      slot.start = new Date(1, 4, 2023, 10, 0, 0);
      slot.end = new Date(1, 4, 2023, 10, 15, 0);
      slot.doctorId = 1;

      // ACT - ASSERT
      await expect(
        appointmentService.bookAppointment({
          slot,
          patientName: "John doe",
          description: "flu"
        })
      ).rejects.toThrowError("Appointment not available");
    });

    it("should retun an error if the doctor is not found", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      const appointment = new Appointment();
      appointment.id = 1;
      appointment.doctor = doctor;
      appointment.startTime = new Date(1, 4, 2023, 10, 0, 0);
      appointment.durationMinutes = 15;

      mockDB.seedAppointments([appointment]);

      const slot = new Slot();
      slot.start = new Date(1, 4, 2023, 10, 0, 0);
      slot.end = new Date(1, 4, 2023, 10, 15, 0);
      slot.doctorId = 1;

      // ACT - ASSERT
      await expect(
        appointmentService.bookAppointment({
          slot,
          patientName: "John doe",
          description: "flu"
        })
      ).rejects.toThrowError("Doctor not found");
    });
  });
});
