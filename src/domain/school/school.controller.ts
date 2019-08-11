import {
  Controller,
  Body,
  Get,
  Post,
  Param,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UseInterceptors
} from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiImplicitParam } from '@nestjs/swagger';
import { Response } from 'express';
import { SchoolErrorInterceptor } from './schoolError.interceptor';
import { SchoolService } from './school.service';
import { School } from './school.entity';

@Controller('school')
@UseInterceptors(SchoolErrorInterceptor)
@ApiUseTags('school')
export class SchoolController {
  private readonly schoolService: SchoolService;

  public constructor(schoolService: SchoolService) {
    this.schoolService = schoolService;
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched schools data',
    type: [School]
  })
  public getAll(): Promise<School[]> {
    return this.schoolService.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successfully created school',
    type: School
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public create(@Body() school: School): Promise<School> {
    delete school.id;
    return this.schoolService.create(school);
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched schools data',
    type: [School]
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No school has been found'
  })
  public getSchool(@Param('id') id: string): Promise<School> {
    return this.schoolService.getSchool(id);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated school',
    type: School
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created school',
    type: School
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async updateOrCreate(
    @Param('id') id: string,
    @Body() school: School,
    @Res() res: Response
  ): Promise<School> {
    try {
      await this.schoolService.getSchool(id);
    } catch (e) {
      const createdSchool = await this.schoolService.create({
        ...school,
        id
      });
      res.status(HttpStatus.CREATED).send(createdSchool);
      return createdSchool;
    }
    const updatedSchool = await this.schoolService.updateSchool({
      ...school,
      id
    });
    res.status(HttpStatus.OK).send(updatedSchool);
    return updatedSchool;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 204,
    description: 'Successfully removed school',
    type: School
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No school has been found'
  })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.schoolService.getSchool(id);
    this.schoolService.removeSchool(id);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated school',
    type: School
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 404,
    description: 'No school has been found'
  })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @ApiResponse({ status: 500, description: 'Server error' })
  public async update(
    @Param('id') id: string,
    @Body() school: School
  ): Promise<School> {
    await this.schoolService.getSchool(id);
    return this.schoolService.updateSchool({ id, ...school });
  }
}
