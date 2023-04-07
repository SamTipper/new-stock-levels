import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
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
      (_) => {
        this.stockLength = this.productService.products.length;
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
    
  }
}
