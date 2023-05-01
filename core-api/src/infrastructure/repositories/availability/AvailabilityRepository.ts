import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Between, Repository } from "typeorm";

import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";
import { Availability as AvailabilityRepositoryEntity } from "../../entities/Availability";
import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";
import { Doctor } from "@/infrastructure/entities/Doctor";
import { Availability } from "@/domain/entities/Availability";

@Service()
export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @InjectRepository(AvailabilityRepositoryEntity)
    private readonly availabilityRepo: Repository<AvailabilityRepositoryEntity>
  ) {}

  async addAvailability(
    availability: AddAvailabilityInput,
    doctor: Doctor
  ): Promise<Availability> {
    try {
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

  async getAvailabilities(from: Date, to: Date): Promise<Availability[]> {
    try {
      const availabilities = await this.availabilityRepo.find({
        where: {
          startTimeUtc: Between(from, this.removeMinutes(to, 15))
        },
        relations: ["doctor"]
      });

      return availabilities;
    } catch (error) {
      throw error;
    }
  }

  async deleteAvailability(startTime: Date, doctor: Doctor): Promise<void> {
    try {
      await this.availabilityRepo.delete({
        startTimeUtc: startTime,
        doctor: { id: doctor.id }
      });
    } catch (error) {
      throw error;
    }
  }

  private removeMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() - minutes * 60000);
  }
}
