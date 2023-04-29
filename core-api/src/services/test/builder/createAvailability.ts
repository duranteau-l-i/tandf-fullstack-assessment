import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";

export const createAvailability = (
  doctor: Doctor,
  dayOfWeek: number,
  dateMorning: Date,
  dateAfternoon?: Date
): Availability[] => {
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
  if (dateAfternoon) {
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
  const startTimeUtc = date;

  const endTime = addMinutes(date, 15);
  const endTimeUtc = endTime;

  const availability = new Availability();
  availability.dayOfWeek = dayOfWeek;
  availability.startTimeUtc = startTimeUtc;
  availability.endTimeUtc = endTimeUtc;
  availability.doctor = doctor;

  return { availability, date: endTime };
};
