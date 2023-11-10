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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { KeycloakAuthorizationGuard } from '../auth/guards/keycloak-authorization.guard';
import { KeycloakAuthZ } from '../auth/decorators/keycloak-authz.decorator';

@UseGuards(JwtAuthGuard, KeycloakAuthorizationGuard)
@KeycloakAuthZ({ resource: 'product' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @KeycloakAuthZ({ scope: 'create' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @KeycloakAuthZ({ scope: 'viewAny' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @KeycloakAuthZ({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthZ({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @KeycloakAuthZ({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
