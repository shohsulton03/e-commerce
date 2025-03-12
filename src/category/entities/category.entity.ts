import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../../product/entities/product.entity";

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column('varchar', { array: true })
  images: string[];

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
