import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductService } from './product.service';

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
          this.productService.loadProducts(res.body);
        }
      }
    );
  }
}
