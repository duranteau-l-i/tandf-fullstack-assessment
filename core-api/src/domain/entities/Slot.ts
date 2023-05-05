import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Slot {
  @Field()
  doctorId: number;

  @Field()
  start: Date;

  @Field()
  end: Date;
}
