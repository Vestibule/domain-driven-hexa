import { Body, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Result } from 'oxide.ts';
import { FindUsersRequestDto } from './find-users.request.dto';
import { FindUsersQuery } from './find-users.query-handler';
import { UserMapper } from '@modules/user/user.mapper';
import { Paginated } from '@src/libs/ddd';
import { UserPaginatedResponseDto } from '../../dtos/user.paginated.response.dto';
import { PaginatedQueryRequestDto } from '@src/libs/api/paginated-query.request.dto';
import { UserModel } from '../../user.mapper';
import { ResponseBase } from '@src/libs/api/response.base';

@Controller('/users')
export class FindUsersHttpController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper,
  ) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Find users' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserPaginatedResponseDto,
  })
  async findUsers(
    @Body() request: FindUsersRequestDto,
    @Query() queryParams: PaginatedQueryRequestDto,
  ): Promise<UserPaginatedResponseDto> {
    const query = new FindUsersQuery({
      ...request,
      limit: queryParams?.limit,
      page: queryParams?.page,
    });
    const result: Result<
      Paginated<UserModel>,
      Error
    > = await this.queryBus.execute(query);

    const paginated = result.unwrap();

    // Whitelisting returned properties
    return new UserPaginatedResponseDto({
      ...paginated,
      data: paginated.data.map((user) => ({
        ...new ResponseBase(user),
        email: user.email,
        country: user.country,
        street: user.street,
        postalCode: user.postalCode,
      })),
    });
  }
}
