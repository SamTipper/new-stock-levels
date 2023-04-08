import { Component, EventEmitter } from '@angular/core';
import { ProductService } from './services/product.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  stockLength: number;
  activeRoute: string;
  disableButtons: boolean;
  savedShoppingList: boolean;

  constructor(
    private http: HttpService,
    private productService: ProductService,
    private router: Router){
    this.productService.productChanges.subscribe(
      (_) => {
        this.stockLength = this.productService.products.length;
        this.savedShoppingList = this.productService.savedShoppingList;
      }
    );

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd){
          this.activeRoute = event.url;
        }
      }
    );
  }

  addBlankProduct(){
    this.productService.addProduct("", 1);
  }

  saveProducts(){
    this.disableButtons = true;    
    const subscription = 
      this.http.updateStock().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.disableButtons = false;
            this.savedShoppingList = true;
          }
        }
      );
  }

  saveShoppingList(){
    this.disableButtons = true;
    const subscription = 
      this.http.saveShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
          }
        }
      );
  }

  resetShoppingList(){
    this.disableButtons = true;
    const subscription = 
      this.http.resetShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
          }
        }
      );
  }

  submitShopping(){
    this.disableButtons = true;
    const subscription = 
      this.http.shoppingDone().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
          }
        }
      );
  }
}
