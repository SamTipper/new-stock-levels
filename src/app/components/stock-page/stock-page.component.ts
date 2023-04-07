import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { HttpService } from 'src/app/services/http.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit, AfterViewInit, OnDestroy{
  subscriptions: Subscription[] = [];
  products: Product[];

  tableHeaders: string[] = ["Name", "Quantity"];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatTable) productsTableRef: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpService,
    private productService: ProductService
    ) { }

  ngOnInit(): void{
    this.http.getProducts();
    this.products = this.productService.products;
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.productService.productNotifier.subscribe(
        (_: boolean) => {
          this.dataSource = new MatTableDataSource<Product>(this.products);
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource, this.paginator);
          this.productsTableRef.renderRows();
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => {
        subscription.unsubscribe();
      }
    );
  }
}
