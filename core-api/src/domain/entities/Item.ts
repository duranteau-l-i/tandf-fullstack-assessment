import { Field, ObjectType } from "type-graphql";

@ObjectType()
export default class Item {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
