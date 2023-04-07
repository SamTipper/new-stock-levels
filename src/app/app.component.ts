import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stockLength: number;

  constructor(private productService: ProductService){
    this.productService.productChanges.subscribe(
      (products: Product[]) => {
        this.stockLength = products.length;
      }
    );
  }
}
