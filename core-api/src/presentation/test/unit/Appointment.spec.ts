import Container from "typedi";

import { Appointment } from "@/infrastructure/entities/Appointment";
import { AppointmentService } from "../../../application/services/AppointmentService";
import { Doctor } from "@/infrastructure/entities/Doctor";
import { Slot } from "@/presentation/dtos/appointments/Slot";
import { createAvailability } from "../builder/createAvailability";
import AppointmentInMemoryRepository from "@/infrastructure/repositories/appointment/AppointmentInMemoryRepository";
import { AppointmentRepository } from "@/infrastructure/repositories/appointment/AppointmentRepository";
import DoctorInMemoryRepository from "@/infrastructure/repositories/doctor/DoctorInMemoryRepository";
import AvailabilityInMemoryRepository from "@/infrastructure/repositories/availability/AvailabilityInMemoryRepository";
import { DoctorRepository } from "@/infrastructure/repositories/doctor/DoctorRepository";
import { AvailabilityRepository } from "@/infrastructure/repositories/availability/AvailabilityRepository";

describe("AppointmentService", () => {
  let appointmentService: AppointmentService;
  let appointmentRepository: AppointmentInMemoryRepository;
  let doctorRepository: DoctorInMemoryRepository;
  let availabilityRepository: AvailabilityInMemoryRepository;

  beforeAll(() => {
    appointmentRepository = new AppointmentInMemoryRepository();
    doctorRepository = new DoctorInMemoryRepository();
    availabilityRepository = new AvailabilityInMemoryRepository();

    Container.set(AppointmentRepository, appointmentRepository);
    Container.set(DoctorRepository, doctorRepository);
    Container.set(AvailabilityRepository, availabilityRepository);

    appointmentService = Container.get(AppointmentService);
  });

  beforeEach(() => {
    appointmentRepository.seedAppointments([]);
    doctorRepository.seedDoctors([]);
    availabilityRepository.seedAvailabilities([]);
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
      appointment.startTime = new Date(2023, 4, 1, 10, 0, 0);
      appointment.durationMinutes = 15;

      appointmentRepository.seedAppointments([appointment]);

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
          startTime: new Date(2023, 4, 1, 10, 0, 0)
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

      availabilityRepository.seedAvailabilities(availabilitiesData);
      doctorRepository.seedDoctors([doctor]);

      const slot = new Slot();
      slot.start = new Date(2023, 4, 1, 10, 0, 0);
      slot.end = new Date(2023, 4, 1, 10, 15, 0);
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
          startTime: new Date(2023, 4, 1, 10, 0, 0)
        })
      );

      expect(appointmentRepository.appointments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            doctor: expect.objectContaining({
              id: 1,
              name: "doctor 1"
            }),
            durationMinutes: 15,
            startTime: new Date(2023, 4, 1, 10, 0, 0)
          })
        ])
      );

      const hasItem = availabilityRepository.availabilities.some(
        item =>
          item.startTimeUtc === new Date("Mon, 01 May 2023 09:00:00 GMT") &&
          doctor.id === 1
      );
      expect(hasItem).toBe(false);
    });

    it.only("should not book duplicate appointment", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      doctorRepository.seedDoctors([doctor]);

      const appointment = new Appointment();
      appointment.id = 1;
      appointment.doctor = doctor;
      appointment.startTime = new Date(2023, 4, 1, 10, 0, 0);
      appointment.durationMinutes = 15;

      appointmentRepository.seedAppointments([appointment]);

      const slot = new Slot();
      slot.start = new Date(2023, 4, 1, 10, 0, 0);
      slot.end = new Date(2023, 4, 1, 10, 15, 0);
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
      appointment.startTime = new Date(2023, 4, 1, 10, 0, 0);
      appointment.durationMinutes = 15;

      appointmentRepository.seedAppointments([appointment]);

      const slot = new Slot();
      slot.start = new Date(2023, 4, 1, 10, 0, 0);
      slot.end = new Date(2023, 4, 1, 10, 15, 0);
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
