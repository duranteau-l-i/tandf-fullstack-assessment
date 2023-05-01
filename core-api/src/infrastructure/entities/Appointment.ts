import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Doctor } from "./Doctor";

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  doctor: Doctor;

  @Column()
  startTime: Date;

  @Column({
    default: 15
  })
  durationMinutes: number;
}
