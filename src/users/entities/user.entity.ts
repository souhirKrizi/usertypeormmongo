import { BeforeInsert, BeforeUpdate, AfterInsert, AfterUpdate, BeforeRemove, Column, Entity, ObjectIdColumn } from 'typeorm';
import { Logger } from '@nestjs/common';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: string;

  // Alias pour la compatibilité avec le reste du code
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  active: boolean;

  private readonly logger = new Logger(User.name);

  @BeforeInsert()
  beforeInsertActions() {
    this.logger.log(`Attempting to create user with email: ${this.email}`);
  }

  @AfterInsert()
  logInsert() {
    this.logger.log(`User created with ID: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    this.logger.log(`User with ID ${this.id} has been updated`);
  }

  @BeforeUpdate()
  beforeUpdateActions() {
    this.logger.log(`Updating user with ID: ${this.id}`);
  }

  @BeforeRemove()
  beforeRemoveActions() {
    this.logger.log(`Attempting to remove user with ID: ${this.id}`);
  }
}
