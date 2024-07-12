import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 32, unique: true })
    name: string;

    @Column({ length: 255 })
    password: string;
}
