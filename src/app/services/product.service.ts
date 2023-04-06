import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Product[] = [];

  constructor() { }

  loadProducts(products: string): void {
    const productsObj: object = JSON.parse(products);
    for (const [name, quantity] of Object.entries(productsObj)){
      this.products.push(new Product(name, quantity));
    }
  }
}
