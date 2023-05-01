import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Appointment } from "./Appointment";
import { Availability } from "./Availability";

@Entity()
export class Doctor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Availability, availability => availability.doctor)
  availability: Availability[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
}
