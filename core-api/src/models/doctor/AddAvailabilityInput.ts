import { Field, InputType } from "type-graphql";

@InputType()
export class AddAvailabilityInput {
  @Field()
  dayOfWeek: number;

  @Field()
  startTimeUtc: Date;

  @Field()
  endTimeUtc: Date;

  @Field()
  doctorId: number;
}
