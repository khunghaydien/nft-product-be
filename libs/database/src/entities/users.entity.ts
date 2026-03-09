import { Entity, Column, DeleteDateColumn, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true, name: 'email', nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 255, name: 'password', nullable: false })
    password: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt: Date | null;


}
