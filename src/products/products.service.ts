import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  create(createProductDto: CreateProductDto) {
    const product = new Product(
      createProductDto.name,
      createProductDto.description,
      createProductDto.price,
    );

    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((product) => product.id === id);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    const updatedProduct = {
      ...product,
      ...updateProductDto,
      updatedAt: new Date(),
    };

    this.products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  remove(id: number) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    this.products.splice(productIndex, 1);
    return true;
  }
}
