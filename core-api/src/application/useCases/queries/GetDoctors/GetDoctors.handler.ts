import { Doctor } from "@/domain/entities/Doctor";
import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";

class GetDoctorsHandler {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async handle(): Promise<Doctor[]> {
    return this.doctorRepository.getDoctors();
  }
}

export default GetDoctorsHandler;
