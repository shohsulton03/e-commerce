import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('baskets')
export class Basket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'int'})
  userId: number;

  @Column({type:'int'})
  productId: number;

  @ManyToOne(() => User, (user) => user.baskets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product, (product) => product.baskets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}
