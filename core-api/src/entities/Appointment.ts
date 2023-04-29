import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Doctor } from "./Doctor";

@ObjectType()
@Entity()
export class Appointment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Doctor)
  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;

  @Field()
  @Column()
  startTime: Date;

  @Field()
  @Column({
    default: 15
  })
  durationMinutes: number;
}
