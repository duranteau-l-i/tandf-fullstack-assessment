import { Appointment } from "@/entities/Appointment";
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { faker } from "@faker-js/faker";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, addMinutes, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { AppointmentService } from "./AppointmentService";

const mockRepo: Partial<Repository<Appointment>> = {};

describe('AppointmentService', () => {
  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
  });

  describe('bookAppointment', () => {
    it('should not book duplicate appointment', async () => {
      
    });
  });
});