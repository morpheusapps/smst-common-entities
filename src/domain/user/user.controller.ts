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
import { UserErrorInterceptor } from './userError.interceptor';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
@UseInterceptors(UserErrorInterceptor)
@ApiUseTags('user')
export class UserController {
  private readonly userService: UserService;

  public constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get()
  @ApiOkResponse({
    description: 'Successfully fetched users data',
    type: [User]
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Successfully created user',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public create(@Body() user: User): Promise<User> {
    delete user.id;
    return this.userService.create(user);
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully fetched users data',
    type: [User]
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No user has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated user',
    type: User
  })
  @ApiCreatedResponse({
    description: 'Successfully created user',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async updateOrCreate(
    @Param('id') id: string,
    @Body() user: User,
    @Res() res: Response
  ): Promise<User> {
    try {
      await this.userService.getUser(id);
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        throw e;
      }

      const createdUser = await this.userService.create({
        ...user,
        id
      });
      res.status(HttpStatus.CREATED).send(createdUser);
      return createdUser;
    }
    const updatedUser = await this.userService.updateUser({
      ...user,
      id
    });
    res.status(HttpStatus.OK).send(updatedUser);
    return updatedUser;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiNoContentResponse({
    description: 'Successfully removed user',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No user has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.userService.getUser(id);
    this.userService.removeUser(id);
  }

  @Patch(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Successfully updated user',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({
    description: 'No user has been found'
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  public async update(
    @Param('id') id: string,
    @Body() user: User
  ): Promise<User> {
    await this.userService.getUser(id);
    return this.userService.updateUser({ id, ...user });
  }
}
