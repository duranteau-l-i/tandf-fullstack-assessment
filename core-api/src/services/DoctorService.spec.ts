import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { DoctorService } from "./DoctorService";

const mockRepo: Partial<Repository<Doctor>> = {};

describe('DoctorService', () => {
  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
  });

  describe('slots query', () => {
    it('should return all slots for doctor', async () => {
      
    });

    it('should not return slot if appointment exists for doctor', async () => {
      
    });
  })
})