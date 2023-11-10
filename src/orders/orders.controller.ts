import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { KeycloakAuthz, UseKeycloakAuthzGuard } from '@app/keycloak-authz';

@Controller('orders')
@UseKeycloakAuthzGuard()
@KeycloakAuthz({ resource: 'order' })
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @KeycloakAuthz({ scope: 'create' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @KeycloakAuthz({ scope: 'viewAny' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @KeycloakAuthz({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthz({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @KeycloakAuthz({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
