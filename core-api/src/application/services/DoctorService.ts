import { Inject, Service } from "typedi";

import { Availability } from "@/domain/entities/Availability";
import { DoctorRepository } from "@/infrastructure/repositories/doctor/DoctorRepository";
import { Slot } from "@/presentation/dtos/appointments/Slot";
import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";
import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";
import GetDoctorsHandler from "@/application/useCases/queries/GetDoctors/GetDoctors.handler";
import { Doctor } from "@/domain/entities/Doctor";
import AddDoctor from "../useCases/commands/AddDoctor/AddDoctor";
import AddDoctorHandler from "../useCases/commands/AddDoctor/AddDoctor.handler";
import { AvailabilityRepository } from "@/infrastructure/repositories/availability/AvailabilityRepository";
import AddAvailabilityHandler from "../useCases/commands/AddAvailability/AddAvailability.handler";
import GetAvailableSlots from "../useCases/queries/GetAvailableSlots/GetAvailableSlots";
import GetAvailableSlotsHandler from "../useCases/queries/GetAvailableSlots/GetAvailableSlots.handler";

@Service()
export class DoctorService {
  constructor(
    @Inject(() => AvailabilityRepository)
    private readonly availabilityRepository: AvailabilityRepository,
    @Inject(() => DoctorRepository)
    private readonly doctorRepository: DoctorRepository
  ) {}

  async getDoctors() {
    return await new GetDoctorsHandler(this.doctorRepository).handle();
  }

  async addDoctor(addDoctorInput: AddDoctorInput): Promise<Doctor> {
    return await new AddDoctorHandler(this.doctorRepository).handle(
      new AddDoctor(addDoctorInput)
    );
  }

  async addAvailability(
    availability: AddAvailabilityInput
  ): Promise<Availability> {
    return await new AddAvailabilityHandler(
      this.doctorRepository,
      this.availabilityRepository
    ).handle(availability);
  }

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    return await new GetAvailableSlotsHandler(
      this.availabilityRepository
    ).handle(new GetAvailableSlots(from, to));
  }
}
