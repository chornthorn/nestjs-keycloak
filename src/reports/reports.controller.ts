import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { KeycloakAuthz, UseKeycloakAuthzGuard } from '@app/keycloak-authz';

@Controller('reports')
@UseKeycloakAuthzGuard()
@KeycloakAuthz({ resource: 'report' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @KeycloakAuthz({ scope: 'create' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @KeycloakAuthz({ scope: 'viewAny' })
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @KeycloakAuthz({ scope: 'view' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @KeycloakAuthz({ scope: 'update' })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  @KeycloakAuthz({ scope: 'delete' })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
