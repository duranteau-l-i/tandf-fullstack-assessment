import { Appointment } from "@/domain/entities/Appointment";
import IAppointmentRepository from "@/domain/repositories/appointmentRepository.interface";

class GetAppointmentsHandler {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  async handle(): Promise<Appointment[]> {
    return this.appointmentRepository.getAppointments();
  }
}

export default GetAppointmentsHandler;
