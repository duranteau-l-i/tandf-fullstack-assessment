import { Inject, Service } from "typedi";

import { AppointmentRepository } from "@/infrastructure/repositories/appointment/AppointmentRepository";
import { DoctorRepository } from "@/infrastructure/repositories/doctor/DoctorRepository";
import { AvailabilityRepository } from "@/infrastructure/repositories/availability/AvailabilityRepository";
import { Appointment } from "@/domain/entities/Appointment";
import { BookAppointmentInput } from "@/presentation/dtos/appointments/BookAppointmentInput";
import GetAppointmentsHandler from "../useCases/queries/GetAppointments/GetAppointments.handler";
import BookAppointmentHandler from "../useCases/commands/BookAppointment/BookAppointment.handler";

@Service()
export class AppointmentService {
  constructor(
    @Inject(() => AppointmentRepository)
    private readonly appointmentRepository: AppointmentRepository,
    @Inject(() => DoctorRepository)
    private readonly doctorRepository: DoctorRepository,
    @Inject(() => AvailabilityRepository)
    private readonly availabilityRepository: AvailabilityRepository
  ) {}

  async getAppointments(): Promise<Appointment[]> {
    return new GetAppointmentsHandler(this.appointmentRepository).handle();
  }

  async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    return await new BookAppointmentHandler(
      this.appointmentRepository,
      this.doctorRepository,
      this.availabilityRepository
    ).handle(options);
  }
}
