import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Basket } from '../../basket/entities/basket.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar', array: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // @Column({ type: 'int' })
  // categoryId: number;

  @OneToMany(() => Basket, (basket) => basket.product)
  baskets: Basket[];

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];
}
