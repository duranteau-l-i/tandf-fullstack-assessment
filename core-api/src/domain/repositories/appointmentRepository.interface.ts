import { Appointment } from "../entities/Appointment";
import { Doctor } from "../entities/Doctor";

interface IAppointmentRepository {
  getAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment>;
  getAppointment(
    startTime: Date,
    durationMinutes: number,
    doctorId: number
  ): Promise<Appointment>;
  addAppointment(
    startTime: Date,
    durationMinutes: number,
    doctor: Doctor
  ): Promise<Appointment>;
}

export default IAppointmentRepository;
