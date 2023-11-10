import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { KeycloakAuthz, UseKeycloakAuthzGuard } from '@app/keycloak-authz';

@Controller('categories')
@UseKeycloakAuthzGuard()
@KeycloakAuthz({ resource: 'categories' })
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @KeycloakAuthz({ scope: 'create' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @KeycloakAuthz({ scope: 'viewAny' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @KeycloakAuthz({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthz({ scope: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @KeycloakAuthz({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
