import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 建立一个实体映射到数据库表
@Entity('Talk')
export class Talk {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10 })
  name: string;

  @Column({ length: 500 })
  message: string;

}