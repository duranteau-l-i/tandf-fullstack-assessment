import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";

class AddDoctorHandler {
  addDoctorInput: AddDoctorInput;

  constructor(addDoctorInput: AddDoctorInput) {
    this.addDoctorInput = this.checkInput(addDoctorInput);
  }

  checkInput(addDoctorInput: AddDoctorInput): AddDoctorInput {
    try {
      if (addDoctorInput.name.length < 3)
        throw new Error("The name must be at least 3 characters long");

      return addDoctorInput;
    } catch (error) {
      throw error;
    }
  }
}

export default AddDoctorHandler;
