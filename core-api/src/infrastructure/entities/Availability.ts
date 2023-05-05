import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Doctor } from "./Doctor";

@Entity()
export class Availability extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number;

  @Column()
  startTimeUtc: Date;

  @Column()
  endTimeUtc: Date;

  @ManyToOne(() => Doctor, doctor => doctor.availability)
  doctor: Doctor;
}
