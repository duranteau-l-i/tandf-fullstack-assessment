import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";
import { Doctor } from "../entities/Doctor";

interface IDoctorRepository {
  getDoctors(): Promise<Doctor[]>;
  getDoctor(id: number): Promise<Doctor>;
  addDoctor(addDoctorInput: AddDoctorInput): Promise<Doctor>;
}

export default IDoctorRepository;
