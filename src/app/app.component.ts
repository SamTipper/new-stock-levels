import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpService } from './services/http.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  stockLength:       number;
  activeRoute:       string;
  disableButtons:    boolean;
  savedShoppingList: boolean;
  userHasAccess:     boolean = true;

  constructor(
    private http: HttpService,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService){

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

    this.http.accessEmitter.subscribe(
      (userHasAccess) => {
        this.userHasAccess = userHasAccess;
      }
    );

    this.http.checkApiKey();
  }

  addBlankProduct(): void{
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
            this.toastr.success("Products updated!");
          }
        },
        (error) => {
          console.log(error);
          subscription.unsubscribe();
          this.toastr.error("An error has occurred, please try again later.");
        }
      );
  }

  saveShoppingList(): void{
    this.disableButtons = true;
    const subscription = 
      this.http.saveShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
            this.toastr.success("Shopping list saved!");
          }
        },
        (error) => {
          console.log(error);
          subscription.unsubscribe();
          this.toastr.error("An error has occurred, please try again later.");
        }
      );
  }

  resetShoppingList(): void{
    this.disableButtons = true;
    const subscription = 
      this.http.resetShoppingList().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
            this.toastr.success("Shopping list reset!");
          }
        },
        (error) => {
          console.log(error);
          subscription.unsubscribe();
          this.toastr.error("An error has occurred, please try again later.");
        }
      );
  }

  submitShopping(): void{
    this.disableButtons = true;
    const subscription = 
      this.http.shoppingDone().subscribe(
        (res) => {
          if (res.status === 200){
            subscription.unsubscribe();
            this.productService.shoppingListReset.emit();
            this.disableButtons = false;
            this.productService.products = [];
            this.toastr.success("Shopping done, shopping list has been reset!");
          }
        },
        (error) => {
          console.log(error);
          subscription.unsubscribe();
          this.toastr.error("An error has occurred, please try again later.");
        }
      );
  }
}
