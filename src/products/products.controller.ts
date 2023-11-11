import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { KeycloakAuthz, UseKeycloakAuthzGuard } from '@app/keycloak-authz';

@UseKeycloakAuthzGuard()
@KeycloakAuthz({ resource: 'products' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @KeycloakAuthz({ scope: 'create' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @KeycloakAuthz({ scope: 'viewAny' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @KeycloakAuthz({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthz({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @KeycloakAuthz({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
