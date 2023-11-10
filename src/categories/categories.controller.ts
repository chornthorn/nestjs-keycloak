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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  KeycloakAuthZ,
  KeycloakAuthZGuard,
  KeycloakJwtAuthGuard,
} from '@app/keycloak';

@Controller('categories')
@UseGuards(KeycloakJwtAuthGuard, KeycloakAuthZGuard)
@KeycloakAuthZ({ resource: 'categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @KeycloakAuthZ({ scope: 'create' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @KeycloakAuthZ({ scope: 'viewAny' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @KeycloakAuthZ({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthZ({ scope: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @KeycloakAuthZ({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
