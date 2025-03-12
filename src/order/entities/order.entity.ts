import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  productId: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;
}
