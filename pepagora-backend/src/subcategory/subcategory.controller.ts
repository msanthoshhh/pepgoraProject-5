import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createSubcategorySchema,
  CreateSubcategoryDto,
} from './validation/subcategory.zod';

import { HttpStatus, HttpCode, Query } from '@nestjs/common';

@Controller('subcategories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  @Roles('admin', 'category_manager')
  // @UsePipes(new ZodValidationPipe(createSubcategorySchema))
  create(@Body() dto: CreateSubcategoryDto) {
    return this.subcategoryService.create(dto);
  }
  
  // @Get()
  // findAll() {
  //   return this.subcategoryService.findAll();
  // }

  
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
     @Query('search') search?: string,
      @Query('sortBy') sortBy = 'createdAt',
      @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
     page = Math.max(Number(page), 1);
    limit = Math.min(Math.max(Number(limit), 1), 1000); // max limit = 100
    const { data, totalCount, totalPages } = await this.subcategoryService.findAll(page, limit, search, sortBy, sortOrder);
  
    return {
      statusCode: HttpStatus.OK,
      message: 'Subcategories fetched successfully',
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(' subcategory with ID:', id)
    return this.subcategoryService.findOne(id);
  }
  
  @Put(':id')
  @Roles('admin', 'category_manager')
  // @UsePipes(new ZodValidationPipe(createSubcategorySchema))     
  update(@Param('id') id: string, @Body() dto: CreateSubcategoryDto) {
    console.log('Updating subcategory with ID:', id, 'and data:', dto)
    return this.subcategoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(id);
  }

  @Get('by-category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.subcategoryService.findByCategory(categoryId);
  }
}
