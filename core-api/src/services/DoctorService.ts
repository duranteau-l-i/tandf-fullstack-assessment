import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { AddAvailabilityInput } from "@/models/doctor/AddAvailabilityInput";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import { Between, Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>
  ) {}

  getDoctors() {
    return this.doctorRepo.find();
  }

  async addDoctor(addDoctorInput: AddDoctorInput): Promise<Doctor> {
    try {
      if (addDoctorInput.name.length < 3)
        throw new Error("The name must be at least 3 characters long");

      return this.doctorRepo.save({ name: addDoctorInput.name });
    } catch (error) {
      throw error;
    }
  }

  async addAvailability(
    availability: AddAvailabilityInput
  ): Promise<Availability> {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { id: availability.doctorId }
      });

      if (!doctor) throw new Error("Doctor not found");

      const availabilityData = await this.availabilityRepo.save({
        dayOfWeek: availability.dayOfWeek,
        startTimeUtc: availability.startTimeUtc,
        endTimeUtc: availability.endTimeUtc,
        doctor: doctor
      });

      return availabilityData;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    try {
      const availabiliies = await this.availabilityRepo.find({
        where: {
          startTimeUtc: Between(from, this.removeMinutes(to, 15))
        },
        relations: ["doctor"]
      });
      // console.log(await this.availabilityRepo.find());
      // console.log(from, to);
      // console.log(availabiliies);

      const slots = availabiliies.map(availability => {
        const slot = new Slot();
        slot.start = new Date(availability.startTimeUtc);
        slot.end = new Date(availability.endTimeUtc);
        slot.doctorId = availability?.doctor?.id;

        return slot;
      });

      return slots;
    } catch (error) {
      throw error;
    }
  }

  private removeMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() - minutes * 60000);
  }
}
