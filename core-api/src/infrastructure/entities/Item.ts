import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;
}
