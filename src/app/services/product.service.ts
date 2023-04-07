import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];

  productChanges: EventEmitter<Product[]> = new EventEmitter<Product[]>();

  constructor() { }

  loadProducts(products: string): void {
    const productsObj: object = JSON.parse(products);
    for (const [name, quantity] of Object.entries(productsObj)){
      this.products.push(new Product(name, quantity));
    }
    this.productChanges.emit(this.products);
  }

  addProduct(productName: string, productQuantity: number): void{
    this.products.push(new Product(productName, productQuantity));
    this.productChanges.emit(this.products);
  }

  deleteProduct(product: Product): void{
    this.products = this.products.filter(
      arrProduct => arrProduct.name !== product.name
    );
    this.productChanges.emit(this.products);
  }
}
