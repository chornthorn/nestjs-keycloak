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
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import {
  KeycloakAuthZ,
  KeycloakAuthZGuard,
  KeycloakJwtAuthGuard,
} from '@app/keycloak';

@Controller('reports')
@UseGuards(KeycloakJwtAuthGuard, KeycloakAuthZGuard)
@KeycloakAuthZ({ resource: 'report' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @KeycloakAuthZ({ scope: 'create' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @KeycloakAuthZ({ scope: 'viewAny' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @KeycloakAuthZ({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthZ({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  @KeycloakAuthZ({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
