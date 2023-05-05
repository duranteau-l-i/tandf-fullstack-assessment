import { Availability } from "@/infrastructure/entities/Availability";
import { Doctor } from "@/infrastructure/entities/Doctor";

export const createAvailability = (
  doctor: Doctor,
  dayOfWeek: number,
  dateMorning: Date,
  dateAfternoon?: Date
): Availability[] => {
  let availabilities = [];
  let morning = new Date(dateMorning);
  let afternoon = dateAfternoon ? new Date(dateAfternoon) : null;

  const morningAvailabilities: Availability[] = Array.from(
    Array(16).keys()
  ).map(() => {
    const { availability, date } = makeAvailabilities(
      morning,
      dayOfWeek,
      doctor
    );
    morning = date;
    return availability;
  });

  let afternoonAvailabilities: Availability[] = [];
  if (afternoon) {
    afternoonAvailabilities = Array.from(Array(16).keys()).map(() => {
      const { availability, date } = makeAvailabilities(
        afternoon,
        dayOfWeek,
        doctor
      );
      afternoon = date;
      return availability;
    });
  }

  availabilities = [...morningAvailabilities, ...afternoonAvailabilities];

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
