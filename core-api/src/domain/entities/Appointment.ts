import { Field, ObjectType } from "type-graphql";
import { Doctor } from "./Doctor";

@ObjectType()
export class Appointment {
  @Field()
  id: number;

  @Field(() => Doctor)
  doctor: Doctor;

  @Field()
  startTime: Date;

  @Field()
  durationMinutes: number;
}
