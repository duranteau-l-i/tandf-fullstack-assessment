import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";

export const createAvailability = (
  doctor: Doctor,
  dayOfWeek: number,
  afternoon = true
): Availability[] => {
  let dateMorning = new Date(1, 4, 2023, 8, 0, 0);
  let dateAfternoon = new Date(1, 4, 2023, 14, 0, 0);

  const morningAvailabilities: Availability[] = Array.from(
    Array(16).keys()
  ).map(() => {
    const { availability, date } = makeAvailabilities(
      dateMorning,
      dayOfWeek,
      doctor
    );
    dateMorning = date;
    return availability;
  });

  let afternoonAvailabilities: Availability[] = [];
  if (afternoon) {
    afternoonAvailabilities = Array.from(Array(16).keys()).map(() => {
      const { availability, date } = makeAvailabilities(
        dateAfternoon,
        dayOfWeek,
        doctor
      );
      dateAfternoon = date;
      return availability;
    });
  }

  const availabilities = [...morningAvailabilities, ...afternoonAvailabilities];

  doctor.availability = availabilities;

  return availabilities;
};

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};

const makeAvailabilities = (
  date: Date,
  dayOfWeek: number,
  doctor: Doctor
): { availability: Availability; date: Date } => {
  const startTimeUtc = date.toUTCString();

  const endTime = addMinutes(date, 15);
  const endTimeUtc = endTime.toUTCString();

  const availability = new Availability();
  availability.dayOfWeek = dayOfWeek;
  availability.startTimeUtc = startTimeUtc;
  availability.endTimeUtc = endTimeUtc;
  availability.doctor = doctor;

  return { availability, date: endTime };
};
