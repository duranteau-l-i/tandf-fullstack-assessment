import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";
import { Doctor } from "@/domain/entities/Doctor";
import { Availability } from "@/domain/entities/Availability";
import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";

class AvailabilityInMemoryRepository implements IAvailabilityRepository {
  availabilities: Availability[] = [];

  seedAvailabilities(data: Availability[]): void {
    this.availabilities = data;
  }

  async addAvailability(
    availability: AddAvailabilityInput,
    doctor: Doctor
  ): Promise<Availability> {
    const av = new Availability();
    av.dayOfWeek = availability.dayOfWeek;
    av.startTimeUtc = availability.startTimeUtc;
    av.endTimeUtc = availability.endTimeUtc;
    av.doctor = doctor;

    this.availabilities.push(av);

    return av;
  }

  async getAvailabilities(from: Date, to: Date): Promise<Availability[]> {
    try {
      const availabilities = this.availabilities.filter(
        el =>
          el.startTimeUtc >= from &&
          el.startTimeUtc <= this.removeMinutes(to, 15)
      );

      return availabilities;
    } catch (error) {
      throw error;
    }
  }

  async deleteAvailability(startTime: Date, doctor: Doctor): Promise<void> {
    const filtered = this.availabilities.filter(
      availability =>
        (availability.startTimeUtc !== new Date(startTime) &&
          availability.doctor?.id === doctor?.id) ||
        availability.doctor?.id !== doctor?.id
    );

    this.seedAvailabilities(filtered);
  }

  private removeMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() - minutes * 60000);
  }
}

export default AvailabilityInMemoryRepository;
