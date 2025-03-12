import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Basket } from "../../basket/entities/basket.entity";
import { Order } from "../../order/entities/order.entity";

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  hashed_password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({ type: 'varchar', nullable: true })
  hashed_refresh_token: string;

  @OneToMany(() => Basket, (basket) => basket.user)
  baskets: Basket[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
