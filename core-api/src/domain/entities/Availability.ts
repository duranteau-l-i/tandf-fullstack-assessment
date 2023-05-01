import { Field, ObjectType } from "type-graphql";
import { Doctor } from "./Doctor";

@ObjectType()
export class Availability {
  @Field()
  id: number;

  @Field()
  dayOfWeek: number;

  @Field()
  startTimeUtc: Date;

  @Field()
  endTimeUtc: Date;

  @Field()
  doctor: Doctor;
}
