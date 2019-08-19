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
  UseInterceptors,
  NotFoundException
} from '@nestjs/common';
import {
  ApiUseTags,
  ApiImplicitParam,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';
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
  @ApiOkResponse({
    description: 'Successfully fetched schools data',
    type: [School]
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getAll(): Promise<School[]> {
    return this.schoolService.getAll();
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Successfully created school',
    type: School
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() school: School): Promise<School> {
    delete school.id;
    return this.schoolService.create(school);
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully fetched schools data',
    type: [School]
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No school has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getSchool(@Param('id') id: string): Promise<School> {
    return this.schoolService.getSchool(id);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated school',
    type: School
  })
  @ApiCreatedResponse({
    description: 'Successfully created school',
    type: School
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async updateOrCreate(
    @Param('id') id: string,
    @Body() school: School,
    @Res() res: Response
  ): Promise<School> {
    try {
      await this.schoolService.getSchool(id);
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        throw e;
      }

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
  @ApiNoContentResponse({
    description: 'Successfully removed school',
    type: School
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No school has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.schoolService.getSchool(id);
    this.schoolService.removeSchool(id);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated school',
    type: School
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No school has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async update(
    @Param('id') id: string,
    @Body() school: School
  ): Promise<School> {
    await this.schoolService.getSchool(id);
    return this.schoolService.updateSchool({ id, ...school });
  }
}
