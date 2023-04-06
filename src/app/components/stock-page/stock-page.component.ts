import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { HttpService } from 'src/app/services/http.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit{
  subscriptions: Subscription[];
  products: Product[];

  tableHeaders: string[] = ["Name", "Quantity"];
  @ViewChild(MatTable) productsTableRef: MatTable<any>;

  constructor(
    private http: HttpService,
    private productService: ProductService
    ) { }

  ngOnInit(): void {
    this.http.getProducts();
    this.products = this.productService.products;
    this.productsTableRef.renderRows();
  }

}
