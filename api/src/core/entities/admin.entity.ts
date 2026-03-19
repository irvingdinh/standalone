import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AdminRoleEntity } from './admin-role.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @ManyToOne(() => AdminRoleEntity, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role: AdminRoleEntity;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'display_name', length: 255 })
  displayName: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    default: null,
  })
  deletedAt: Date | null;
}
