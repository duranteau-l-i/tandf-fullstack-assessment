import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

import IAppointmentRepository from "@/domain/repositories/appointmentRepository.interface";
import { Appointment } from "@/domain/entities/Appointment";
import { Appointment as AppointmentRepositoryEntity } from "../../entities/Appointment";
import { Doctor } from "@/domain/entities/Doctor";

@Service()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(AppointmentRepositoryEntity)
    private readonly appointmentRepo: Repository<AppointmentRepositoryEntity>
  ) {}

  async getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async addAppointment(
    startTime: Date,
    durationMinutes: number,
    doctor: Doctor
  ): Promise<Appointment> {
    try {
      const saved = await this.appointmentRepo.save({
        startTime,
        durationMinutes,
        doctor
      });

      return saved;
    } catch (error) {
      throw error;
    }
  }

  async getAppointment(
    startTime: Date,
    durationMinutes: number,
    doctorId: number
  ): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepo.findOne({
        where: {
          startTime: startTime,
          durationMinutes,
          doctor: doctorId
        }
      });

      return appointment;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const appointmentData = await this.appointmentRepo.findOne({
        where: {
          id
        },
        relations: ["doctor"]
      });

      return appointmentData;
    } catch (error) {
      throw error;
    }
  }
}
