import Container from "typedi";

import { Doctor } from "@/infrastructure/entities/Doctor";
import { DoctorService } from "../../../application/services/DoctorService";
import { createAvailability } from "../builder/createAvailability";
import { DoctorRepository } from "@/infrastructure/repositories/doctor/DoctorRepository";
import DoctorInMemoryRepository from "@/infrastructure/repositories/doctor/DoctorInMemoryRepository";
import AvailabilityInMemoryRepository from "@/infrastructure/repositories/availability/AvailabilityInMemoryRepository";
import { AvailabilityRepository } from "@/infrastructure/repositories/availability/AvailabilityRepository";
import { addHours, addMinutes, subDays } from "date-fns";

describe("DoctorService", () => {
  let doctorService: DoctorService;
  let doctorRepository: DoctorInMemoryRepository;
  let availabilityRepository: AvailabilityInMemoryRepository;

  let today: Date;

  beforeAll(() => {
    doctorRepository = new DoctorInMemoryRepository();
    availabilityRepository = new AvailabilityInMemoryRepository();

    Container.set(DoctorRepository, doctorRepository);
    Container.set(AvailabilityRepository, availabilityRepository);

    doctorService = Container.get(DoctorService);

    today = new Date();
    today.setHours(8);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
  });

  beforeEach(() => {
    doctorRepository.seedDoctors([]);
    availabilityRepository.seedAvailabilities([]);
  });

  describe("doctors", () => {
    it("should return an empty array", async () => {
      // ACT
      const doctors = await doctorService.getDoctors();

      // ASSERT
      expect(doctors).toEqual([]);
    });

    it("should return all doctors", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      doctorRepository.seedDoctors([doctor]);

      // ACT
      const doctors = await doctorService.getDoctors();

      // ASSERT
      expect(doctors).toEqual([
        {
          id: 1,
          name: "doctor 1"
        }
      ]);
    });

    it("should return add a new doctor", async () => {
      // ACT
      const response = await doctorService.addDoctor({ name: "doctor 1" });

      // ASSERT
      expect(response).toEqual({
        id: 1,
        name: "doctor 1"
      });

      expect(doctorRepository.doctors).toEqual([
        {
          id: 1,
          name: "doctor 1"
        }
      ]);
    });

    it("should failed to add a new doctor", async () => {
      // ACT
      await expect(
        doctorService.addDoctor({ name: "do" })
      ).rejects.toThrowError("The name must be at least 3 characters long");

      // ASSERT
      expect(doctorRepository.doctors).toEqual([]);
    });

    describe("slots query", () => {
      it("should return slot for doctors", async () => {
        // ARRANGE
        const doctor = new Doctor();
        doctor.id = 1;
        doctor.name = "doctor 1";
        doctor.availability = [];

        const doctor2 = new Doctor();
        doctor2.id = 2;
        doctor2.name = "doctor 2";
        doctor2.availability = [];

        const morning = new Date(today);
        const afternoon = new Date(today);
        afternoon.setHours(15);

        const availabilitiesData = createAvailability(
          doctor,
          2,
          morning,
          afternoon
        );

        const availabilitiesData2 = createAvailability(
          doctor2,
          2,
          morning,
          afternoon
        );

        doctorRepository.seedDoctors([doctor, doctor2]);
        availabilityRepository.seedAvailabilities([
          ...availabilitiesData,
          ...availabilitiesData2
        ]);

        const from = new Date(today);
        from.setHours(15);
        const to = addMinutes(new Date(from), 15);

        // ACT
        const availabilities = await doctorService.getAvailableSlots(from, to);

        // ASSERT
        expect(availabilities).toEqual([
          expect.objectContaining({
            doctorId: 1,
            end: new Date("2023-05-01T14:15:00.000Z"),
            start: new Date("2023-05-01T14:00:00.000Z")
          }),
          expect.objectContaining({
            doctorId: 2,
            end: new Date("2023-05-01T14:15:00.000Z"),
            start: new Date("2023-05-01T14:00:00.000Z")
          })
        ]);
      });

      it("should return slot for doctor 1", async () => {
        // ARRANGE
        const doctor = new Doctor();
        doctor.id = 1;
        doctor.name = "doctor 1";
        doctor.availability = [];

        const doctor2 = new Doctor();
        doctor2.id = 2;
        doctor2.name = "doctor 2";
        doctor2.availability = [];

        const morning = new Date(today);
        const afternoon = new Date(today);
        afternoon.setHours(15);

        const availabilitiesData = createAvailability(
          doctor,
          2,
          morning,
          afternoon
        );
        const availabilitiesData2 = createAvailability(doctor2, 2, morning);

        doctorRepository.seedDoctors([doctor, doctor2]);
        availabilityRepository.seedAvailabilities([
          ...availabilitiesData,
          ...availabilitiesData2
        ]);

        const from = new Date(today);
        from.setHours(15);
        const to = addHours(new Date(from), 1);

        // ACT
        const availabilities = await doctorService.getAvailableSlots(from, to);

        // ASSERT
        expect(availabilities).toEqual([
          expect.objectContaining({
            doctorId: 1,
            end: new Date("2023-05-01T14:15:00.000Z"),
            start: new Date("2023-05-01T14:00:00.000Z")
          }),
          expect.objectContaining({
            doctorId: 1,
            end: new Date("2023-05-01T14:30:00.000Z"),
            start: new Date("2023-05-01T14:15:00.000Z")
          }),
          expect.objectContaining({
            doctorId: 1,
            end: new Date("2023-05-01T14:45:00.000Z"),
            start: new Date("2023-05-01T14:30:00.000Z")
          }),
          expect.objectContaining({
            doctorId: 1,
            end: new Date("2023-05-01T15:00:00.000Z"),
            start: new Date("2023-05-01T14:45:00.000Z")
          })
        ]);
      });

      it("should not return slot if appointment exists for doctor", async () => {
        // ARRANGE
        const doctor = new Doctor();
        doctor.id = 1;
        doctor.name = "doctor 1";

        const doctor2 = new Doctor();
        doctor2.id = 2;
        doctor2.name = "doctor 2";

        doctorRepository.seedDoctors([doctor, doctor2]);

        const from = new Date(today);
        from.setHours(14);
        const to = addMinutes(new Date(from), 15);

        // ACT
        const availabilities = await doctorService.getAvailableSlots(from, to);

        // ASSERT
        expect(availabilities).toEqual([]);
      });

      it("should not an error from date invalid", async () => {
        // ARRANGE
        const doctor = new Doctor();
        doctor.id = 1;
        doctor.name = "doctor 1";

        const doctor2 = new Doctor();
        doctor2.id = 2;
        doctor2.name = "doctor 2";

        doctorRepository.seedDoctors([doctor, doctor2]);

        const from = subDays(new Date(today), 1);
        from.setHours(14);
        const to = addMinutes(new Date(from), 15);

        // ACT - ASSERT
        await expect(
          doctorService.getAvailableSlots(from, to)
        ).rejects.toThrowError("From date invalid");
      });

      it("should not an error to date invalid", async () => {
        // ARRANGE
        const doctor = new Doctor();
        doctor.id = 1;
        doctor.name = "doctor 1";

        const doctor2 = new Doctor();
        doctor2.id = 2;
        doctor2.name = "doctor 2";

        doctorRepository.seedDoctors([doctor, doctor2]);

        const from = new Date(today);
        from.setHours(14);
        const to = subDays(new Date(from), 1);

        // ACT - ASSERT
        await expect(
          doctorService.getAvailableSlots(from, to)
        ).rejects.toThrowError("To date invalid");
      });
    });
  });
});
