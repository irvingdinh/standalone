import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { AdminRoleEntity } from './admin-role.entity';

@Entity('admin_role_scopes')
@Unique(['roleId', 'scope'])
export class AdminRoleScopeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  scope: string;

  @ManyToOne(() => AdminRoleEntity, (role) => role.scopes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'role_id' })
  role: AdminRoleEntity;

  @Column({ name: 'role_id' })
  roleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
