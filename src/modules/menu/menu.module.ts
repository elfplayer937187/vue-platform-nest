import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), RoleModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [TypeOrmModule, MenuService],
})
export class MenuModule {}
