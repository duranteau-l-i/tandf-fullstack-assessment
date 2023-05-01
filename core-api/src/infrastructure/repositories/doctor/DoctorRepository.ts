import { Service } from "typedi";

import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";
import { Doctor } from "@/domain/entities/Doctor";
import { Doctor as DoctorRepositoryEntity } from "../../entities/Doctor";
import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Repository } from "typeorm";

@Service()
export class DoctorRepository implements IDoctorRepository {
  constructor(
    @InjectRepository(DoctorRepositoryEntity)
    private readonly doctorRepo: Repository<DoctorRepositoryEntity>
  ) {}

  async getDoctors(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  async getDoctor(id: number): Promise<Doctor> {
    try {
      const doctor = await this.doctorRepo.findOne({
        where: { id }
      });

      if (!doctor) throw new Error("Doctor not found");

      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async addDoctor(addDoctorInput: AddDoctorInput): Promise<Doctor> {
    return this.doctorRepo.save({ name: addDoctorInput.name });
  }
}
