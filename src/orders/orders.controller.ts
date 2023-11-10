import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  KeycloakAuthZ,
  KeycloakAuthZGuard,
  KeycloakJwtAuthGuard,
} from '@app/keycloak';

@Controller('orders')
@UseGuards(KeycloakJwtAuthGuard, KeycloakAuthZGuard)
@KeycloakAuthZ({ resource: 'order' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @KeycloakAuthZ({ scope: 'create' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @KeycloakAuthZ({ scope: 'viewAny' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @KeycloakAuthZ({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthZ({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @KeycloakAuthZ({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
