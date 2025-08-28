import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async create(dto: CreateProductDto) {
    const existingProduct = await this.productModel.findOne({ name: dto.name, subcategory: dto.mappedParent });
    if (existingProduct) throw new ConflictException('Product with this name already exists in the subcategory');

    try {
      const newProduct = new this.productModel(dto);
      console.log('Creating product with data:', newProduct);
      return await newProduct.save();
    } catch (error) {
      throw new BadRequestException('Failed to create product');
    }
  }


  // async findAll() {
  //   return this.productModel.find().populate('subcategory').exec();
  // }
  async findAll(page = 1, limit = 100, search?: string, sortBy: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
  try {
    const skip = (page - 1) * limit;

    // Prepare filter for search
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};

    // Determine sort order
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

    // Fetch paginated categories with filters and sorting
    const [data, totalCount] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ [sortBy]: sortOrderValue })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
  } catch (error) {
    throw new BadRequestException('Failed to fetch categories');
  }
}

    async findAllCount() {
    return await this.productModel.countDocuments().exec();
  }


  async findOne(id: string) {
    const product = await this.productModel.findById(id).populate('mappedParent');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: CreateProductDto) {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return deleted;
  }

  async findBySubcategory(subcategoryId: string) {
    return this.productModel.find({ subcategory: subcategoryId }).exec();
  }
}
