import { Availability } from "@/domain/entities/Availability";
import { Doctor } from "@/domain/entities/Doctor";
import { Slot } from "@/domain/entities/Slot";
import { AddAvailabilityInput } from "@/presentation/dtos/doctor/AddAvailabilityInput";
import { AddDoctorInput } from "@/presentation/dtos/doctor/AddDoctorInput";
import { DoctorService } from "@/application/services/DoctorService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Query(() => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return this.doctorService.getDoctors();
  }

  @Mutation(() => Doctor)
  async addDoctor(@Arg("doctor") doctor: AddDoctorInput): Promise<Doctor> {
    return this.doctorService.addDoctor(doctor);
  }

  @Mutation(() => Availability)
  async addAvailability(
    @Arg("availability") availability: AddAvailabilityInput
  ): Promise<Availability> {
    return this.doctorService.addAvailability(availability);
  }

  @Query(() => [Slot])
  async slots(@Arg("from") from: Date, @Arg("to") to: Date): Promise<Slot[]> {
    return this.doctorService.getAvailableSlots(from, to);
  }
}
