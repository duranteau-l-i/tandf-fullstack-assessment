import { Slot } from "@/domain/entities/Slot";
import IAvailabilityRepository from "@/domain/repositories/availabilityRepository.interface";

class GetAvailableSlots {
  from: Date;
  to: Date;

  constructor(from: Date, to: Date) {
    this.validateDates(from, to);
  }

  validateDates(from: Date, to: Date): void {
    try {
      const date = new Date();
      date.setHours(7);
      if (from < date) {
        throw new Error("From date invalid");
      }

      if (to < from) {
        throw new Error("To date invalid");
      }

      this.from = from;
      this.to = to;
    } catch (error) {
      throw error;
    }
  }
}

export default GetAvailableSlots;
