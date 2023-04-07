import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpService } from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stockLength: number;
  activeRoute: string;

  constructor(
    private http: HttpService,
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
    this.http.updateStock().subscribe(
      (res) => {
        if (res.status === 200){
          
        }
      }
    );
  }
}
