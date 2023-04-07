import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private productService: ProductService
    ) { }

  getProducts(){
    return this.http.get(
      "https://API.samtipper.repl.co/stock-list",
     {
      headers: {"Api-Key": localStorage.getItem("api-key")},
      observe: "response",
      responseType: "text"
     }).subscribe(
      (res) => {
        if (res.status === 200){
          this.productService.loadProducts(res.body, "stock");
        }
      }
    );
  }

  addNewItem(item: object){
    return this.http.post(
      "https://API.samtipper.repl.co/add-item",
      item,
      {
        headers: {"Api-Key": localStorage.getItem("api-key")},
        observe: "response", 
        responseType: "text"
      });
  }

  getShoppingList(){
    return this.http.get(
      "https://API.samtipper.repl.co/shopping-list",
     {
      headers: {"Api-Key": localStorage.getItem("api-key")},
      observe: "response",
      responseType: "text"
     });
  }

  updateStock(){
    let stock = {};

    this.productService.products.forEach(
      (product: Product) => {
        stock[product.name] = product.quantity;
      }
    );

    return this.http.post(
      "https://API.samtipper.repl.co/update-stock",
      stock,
     {
      headers: {"Api-Key": localStorage.getItem("api-key")},
      observe: "response",
      responseType: "text"
     });
  }
}
