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
      this.productService.shoppingListReset.subscribe(
        (_) => {
          this.getShoppingList();
        }
      )
    )

    this.getShoppingList();
  }

  ngOnDestroy(): void{
    this.subscriptions.forEach(
      (subscription: Subscription) => {
        subscription.unsubscribe();
      }
    );
  }

  getShoppingList(){
    this.productService.shoppingList = [];
    const subscription =
      this.http.getShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            this.productService.loadProducts(res.body, "shopping");
            subscription.unsubscribe();
          }
        }
      );
  }

}
