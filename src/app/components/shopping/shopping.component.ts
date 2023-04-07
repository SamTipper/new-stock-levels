import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { HttpService } from 'src/app/services/http.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  products: Product[];

  tableHeaders: string[] = ["Name", "Quantity"];

  constructor(
    private http: HttpService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.productService.productChanges.subscribe(
        (products: Product[]) => {
          this.products = products;
        }
      )
    );

    this.subscriptions.push(
      this.http.getShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            this.productService.loadProducts(res.body, "shopping");
          }
        }
      )
    );
  }

  ngOnDestroy(): void{
    this.subscriptions.forEach(
      (subscription: Subscription) => {
        subscription.unsubscribe();
      }
    );
    this.productService.shoppingList = [];
  }

  saveShoppingList(){
    this.http.saveShoppingList().subscribe(
      (res) => {
        if (res.status === 200){

        }
      }
    );
  }

}
