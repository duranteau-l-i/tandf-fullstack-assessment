import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    try {
      const duration = Math.round(
        (options.slot.end.getTime() - options.slot.start.getTime()) / 60000
      );

      const appointmentData = await this.appointmentRepo.findOne({
        where: {
          startTime: options.slot.start,
          durationMinutes: duration,
          doctor: { id: options.slot.doctorId }
        }
      });

      const doctorData = await this.doctorRepo.findOne({
        where: { id: options.slot.doctorId }
      });

      if (!doctorData) throw new Error("Doctor not found");

      if (!appointmentData && doctorData) {
        const saved = await this.appointmentRepo.save({
          startTime: options.slot.start,
          durationMinutes: duration,
          doctor: doctorData
        });

        await this.availabilityRepo.delete({
          startTimeUtc: options?.slot?.start?.toUTCString(),
          doctor: { id: options?.slot?.doctorId }
        });

        const appointmentData = await this.appointmentRepo.findOne({
          where: {
            id: saved.id
          },
          relations: ["doctor"]
        });

        return appointmentData;
      }

      throw new Error("Appointment not available");
    } catch (error) {
      throw error;
    }
  }
}
