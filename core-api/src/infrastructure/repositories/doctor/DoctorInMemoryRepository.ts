import IDoctorRepository from "@/domain/repositories/doctorRepository.interface";
import { Doctor } from "@/domain/entities/Doctor";
import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";

class DoctorInMemoryRepository implements IDoctorRepository {
  doctors: Doctor[] = [];

  seedDoctors(data: Doctor[]): void {
    this.doctors = data;
  }

  async getDoctors(): Promise<Doctor[]> {
    return this.doctors;
  }

  async getDoctor(id: number): Promise<Doctor> {
    try {
      const doctor = this.doctors.find(doc => doc.id === id);

      if (!doctor) throw new Error("Doctor not found");

      return doctor;
    } catch (error) {
      throw error;
    }
  }

  async addDoctor(addDoctorInput: AddDoctorInput): Promise<Doctor> {
    const doctor = new Doctor();
    doctor.id = this.doctors.length + 1;
    doctor.name = addDoctorInput.name;

    this.doctors.push(doctor);

    return doctor;
  }
}

export default DoctorInMemoryRepository;
