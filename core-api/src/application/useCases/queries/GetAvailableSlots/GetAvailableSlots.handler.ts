import { Slot } from "@/domain/entities/Slot";
import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";
import GetAvailableSlots from "./GetAvailableSlots";

class GetAvailableSlotsHandler {
  constructor(
    private readonly availibilityRepository: IAvailabilityRepository
  ) {}

  async handle(query: GetAvailableSlots): Promise<Slot[]> {
    const availabilities = await this.availibilityRepository.getAvailabilities(
      query.from,
      query.to
    );

    const slots = availabilities.map(availability => {
      const slot = new Slot();
      slot.start = availability.startTimeUtc;
      slot.end = availability.endTimeUtc;
      slot.doctorId = availability?.doctor?.id;

      return slot;
    });

    return slots;
  }
}

export default GetAvailableSlotsHandler;
