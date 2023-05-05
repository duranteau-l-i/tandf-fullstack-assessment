import { Availability } from "@/domain/entities/Availability";
import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";
import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";
import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";

class AddAvailabilityHandler {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly availibilityRepository: IAvailabilityRepository
  ) {}

  async handle(availability: AddAvailabilityInput): Promise<Availability> {
    try {
      const doctor = await this.doctorRepository.getDoctor(
        availability.doctorId
      );

      const availabilityData =
        await this.availibilityRepository.addAvailability(availability, doctor);

      return availabilityData;
    } catch (error) {
      throw error;
    }
  }
}

export default AddAvailabilityHandler;
