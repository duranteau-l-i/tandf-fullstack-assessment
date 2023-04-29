import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Doctor } from "./Doctor";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Availability extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  dayOfWeek: number;

  @Field()
  @Column()
  startTimeUtc: Date;

  @Field()
  @Column()
  endTimeUtc: Date;

  @ManyToOne(() => Doctor, doctor => doctor.availability)
  doctor: Doctor;
}
