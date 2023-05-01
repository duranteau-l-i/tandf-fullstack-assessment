import { Doctor } from "@/domain/entities/Doctor";
import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";
import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";
import AddDoctor from "./AddDoctor";

class AddDoctorHandler {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async handle(command: AddDoctor): Promise<Doctor> {
    try {
      if (command.addDoctorInput.name.length < 3)
        throw new Error("The name must be at least 3 characters long");

      return await this.doctorRepository.addDoctor(command.addDoctorInput);
    } catch (error) {
      throw error;
    }
  }
}

export default AddDoctorHandler;
