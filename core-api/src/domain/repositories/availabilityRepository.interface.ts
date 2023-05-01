import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";
import { Availability } from "../entities/Availability";
import { Doctor } from "../entities/Doctor";

interface IAvailabilityRepository {
  addAvailability(
    availability: AddAvailabilityInput,
    doctor: Doctor
  ): Promise<Availability>;
  getAvailabilities(from: Date, to: Date): Promise<Availability[]>;
  deleteAvailability(startTime: Date, doctor: Doctor): Promise<void>;
}

export default IAvailabilityRepository;
