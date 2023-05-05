import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Doctor {
  @Field()
  id: number;

  @Field()
  name: string;
}
