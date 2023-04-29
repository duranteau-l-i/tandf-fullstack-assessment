import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { DoctorService } from "../../DoctorService";
import { createAvailability } from "../builder/createAvailability";

const mockDB = {
  doctors: [] as Doctor[],
  seedDoctors: function (data: Doctor[]): void {
    this.doctors = data;
  },

  availabilities: [] as Availability[],
  seedAvailabilities: function (data: Availability[]): void {
    this.availabilities = data;
  }
};

// I don't know if this is what was expected but I did it this way while not liking
// The repository is part of an external library
// And there is a principle that says: "Don't Mock What You Don't Own".
const mockRepo: Partial<Repository<Doctor>> = {
  // @ts-ignore
  find: function (props?: any): Promise<Doctor[] | Availability[]> {
    if (props?.where) {
      return Promise.resolve(
        mockDB.availabilities.filter(
          el =>
            el.startTimeUtc === props?.where?.startTimeUtc &&
            el.endTimeUtc === props?.where?.endTimeUtc
        ) as Availability[]
      );
    }

    return Promise.resolve(mockDB.doctors);
  },
  // @ts-ignore
  save: jest.fn((entity: { name: string }): Doctor => {
    const doctor = new Doctor();
    doctor.id = mockDB.doctors.length + 1;
    doctor.name = entity.name;

    mockDB.seedDoctors([...mockDB.doctors, doctor]);
    return doctor;
  })
};

describe("DoctorService", () => {
  let doctorService: DoctorService;

  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
    doctorService = Container.get(DoctorService);
  });

  beforeEach(() => {
    mockDB.seedDoctors([]);
    mockDB.seedAvailabilities([]);
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

      mockDB.seedDoctors([doctor]);

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

      expect(mockDB.doctors).toEqual([
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
      expect(mockDB.doctors).toEqual([]);
    });
  });

  describe("slots query", () => {
    it("should return slot for doctor 1", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      const doctor2 = new Doctor();
      doctor2.id = 2;
      doctor2.name = "doctor 2";

      const availabilitiesData = createAvailability(doctor, 1);
      const availabilitiesData2 = createAvailability(doctor2, 1);

      mockDB.seedDoctors([doctor, doctor2]);
      mockDB.seedAvailabilities([
        ...availabilitiesData,
        ...availabilitiesData2
      ]);

      const from = new Date(1, 4, 2023, 14, 0, 0);
      const to = new Date(1, 4, 2023, 14, 15, 0);

      // ACT
      const availabilities = await doctorService.getAvailableSlots(from, to);

      // ASSERT
      expect(availabilities).toEqual([
        {
          doctorId: 1,
          end: new Date("1906-11-13T14:15:00.000Z"),
          start: new Date("1906-11-13T14:00:00.000Z")
        },
        {
          doctorId: 2,
          end: new Date("1906-11-13T14:15:00.000Z"),
          start: new Date("1906-11-13T14:00:00.000Z")
        }
      ]);
    });

    it("should return slot for doctor 1", async () => {
      // ARRANGE
      const doctor = new Doctor();
      doctor.id = 1;
      doctor.name = "doctor 1";

      const doctor2 = new Doctor();
      doctor2.id = 2;
      doctor2.name = "doctor 2";

      const availabilitiesData = createAvailability(doctor, 1);
      const availabilitiesData2 = createAvailability(doctor2, 1, false);

      mockDB.seedDoctors([doctor, doctor2]);
      mockDB.seedAvailabilities([
        ...availabilitiesData,
        ...availabilitiesData2
      ]);

      const from = new Date(1, 4, 2023, 14, 0, 0);
      const to = new Date(1, 4, 2023, 14, 15, 0);

      // ACT
      const availabilities = await doctorService.getAvailableSlots(from, to);

      // ASSERT
      expect(availabilities).toEqual([
        {
          doctorId: 1,
          end: new Date("1906-11-13T14:15:00.000Z"),
          start: new Date("1906-11-13T14:00:00.000Z")
        }
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

      mockDB.seedDoctors([doctor, doctor2]);

      const from = new Date(1, 4, 2023, 14, 0, 0);
      const to = new Date(1, 4, 2023, 14, 15, 0);

      // ACT
      const availabilities = await doctorService.getAvailableSlots(from, to);

      // ASSERT
      expect(availabilities).toEqual([]);
    });
  });
});