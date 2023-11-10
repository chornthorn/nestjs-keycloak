export class CreateProductDto {
  readonly id?: number;
  readonly name: string;
  readonly description?: string;
  readonly price?: number;
  readonly stock?: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
