import { Appointment } from "@/domain/entities/Appointment";
import IAppointmentRepository from "@/domain/repositories/appointmentRepository.interface";
import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";
import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";
import { BookAppointmentInput } from "@/presentation/dtos/appointments/BookAppointmentInput";

class BookAppointmentHandler {
  constructor(
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly availibilityRepository: IAvailabilityRepository
  ) {}

  async handle(options: BookAppointmentInput): Promise<Appointment> {
    try {
      const duration = this.getDuration(options);

      const appointment = await this.appointmentRepository.getAppointment(
        options.slot.start,
        duration,
        options.slot.doctorId
      );

      const doctor = await this.doctorRepository.getDoctor(
        options.slot.doctorId
      );

      if (!appointment && doctor) {
        const appointmentSaved =
          await this.appointmentRepository.addAppointment(
            options.slot.start,
            duration,
            doctor
          );

        await this.availibilityRepository.deleteAvailability(
          options?.slot?.start,
          doctor
        );

        const appointmentData =
          await this.appointmentRepository.getAppointmentById(
            appointmentSaved.id
          );

        return appointmentData;
      }

      throw new Error("Appointment not available");
    } catch (error) {
      throw error;
    }
  }

  private getDuration(options: BookAppointmentInput) {
    return Math.round(
      (options.slot.end.getTime() - options.slot.start.getTime()) / 60000
    );
  }
}

export default BookAppointmentHandler;
