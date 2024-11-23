import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ValidRoles } from '../interfaces';

@Entity()
export class User {
  @ApiProperty({
    example: '5e9d2ff2-c2f6-4bd1-8f7a-df6cb98deed9',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'email@email.com',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: 'password',
    uniqueItems: true,
  })
  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'Jhon Doe',
    uniqueItems: false,
  })
  @Column('text')
  fullname: string;

  @ApiProperty({
    default: true,
    description: 'User Status',
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    isArray: true,
    default: 'user',
    description: 'Roles assigned to the user',
    enum: ValidRoles,
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    type: () => [Product],
    description: 'Products associated with the user',
  })
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
