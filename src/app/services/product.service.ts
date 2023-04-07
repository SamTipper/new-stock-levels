import { EventEmitter, Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products: Product[] = [];
  shoppingList: Product[] = [];

  productChanges: EventEmitter<Product[]> = new EventEmitter<Product[]>();

  constructor() { }

  loadProducts(products: string, mode: string): void {
    const productsObj: object = JSON.parse(products);
    for (const [name, quantity] of Object.entries(productsObj)){
      if (name !== 'version'){
        if (mode === "stock"){
          this.products.push(new Product(name, quantity, false));
        } 
        else if (mode === "shoppping"){
          this.shoppingList.push(new Product(name, quantity, false));
        }
      }
    }
    this.productChanges.emit(mode === "stock" ? this.products : this.shoppingList);
  }

  addProduct(productName: string, productQuantity: number): void{
    this.products.unshift(new Product(productName, productQuantity, true));
    console.log(this.products);
    this.productChanges.emit(this.products);
  }

  deleteProduct(product: Product): void{
    this.products = this.products.filter(
      arrProduct => arrProduct.name !== product.name
    );
    this.productChanges.emit(this.products);
  }

  capitalizeFirstLetter(string: string): string{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  

}
