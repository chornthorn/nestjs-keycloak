export class Product {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly price?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(name: string, description: string, price?: number) {
    this.id = Math.floor(Math.random() * 100);
    this.name = name;
    this.description = description;
    this.price = price;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
