import { Appointment } from "@/domain/entities/Appointment";
import { Doctor } from "@/domain/entities/Doctor";
import IAppointmentRepository from "@/domain/repositories/appointmentRepository.interface";

class AppointmentInMemoryRepository implements IAppointmentRepository {
  appointments: Appointment[] = [];

  seedAppointments(data: Appointment[]): void {
    this.appointments = data;
  }

  async getAppointments(): Promise<Appointment[]> {
    return this.appointments;
  }

  async addAppointment(
    startTime: Date,
    durationMinutes: number,
    doctor: Doctor
  ): Promise<Appointment> {
    try {
      const appointment = new Appointment();
      appointment.id = this.appointments.length + 1;
      appointment.doctor = doctor;
      appointment.startTime = startTime;
      appointment.durationMinutes = durationMinutes;

      this.appointments.push(appointment);

      return appointment;
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
      const appointment = this.appointments.find(
        el =>
          el.startTime.toISOString() === startTime.toISOString() &&
          el.durationMinutes === durationMinutes &&
          el.doctor.id === doctorId
      );

      return appointment;
    } catch (error) {
      throw error;
    }
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const doctor = this.appointments.find(ap => ap.id === id);

      if (!doctor) throw new Error("Appointment not found");

      return doctor;
    } catch (error) {
      throw error;
    }
  }
}

export default AppointmentInMemoryRepository;
