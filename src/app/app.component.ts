import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './models/product';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stockLength: number;
  activeRoute: string;

  constructor(
    private productService: ProductService,
    private router: Router){
    this.productService.productChanges.subscribe(
      (products: Product[]) => {
        this.stockLength = products.length;
      }
    );

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd){
          console.log(event.url);
          this.activeRoute = event.url;
        }
      }
    );
  }

  addBlankProduct(){
    this.productService.addProduct("", 1);
  }
}
