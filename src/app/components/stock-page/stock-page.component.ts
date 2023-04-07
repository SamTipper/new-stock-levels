import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { HttpService } from 'src/app/services/http.service';
import { ProductService } from 'src/app/services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit, OnDestroy{
  subscriptions:  Subscription[] = [];
  products:       Product[] = [];
  newProductForm: FormGroup;

  tableHeaders: string[] = ["Name", "Quantity"];
  dataSource:   MatTableDataSource<Product>;
  
  @ViewChild(MatTable) table: MatTable<Product>;

  constructor(
    private http: HttpService,
    private productService: ProductService){
      this.subscriptions.push(
        this.productService.productChanges.subscribe(
          (products: Product[]) => {
            this.products = products;
          }
        )
      );
    }

  ngOnInit(): void{
    this.http.getProducts();
    this.newProductForm = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productQuantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => {
        subscription.unsubscribe();
      }
    );
  }

  onAddNewProduct(){
    const productName = this.newProductForm.value.productName; const productQuantity = this.newProductForm.value.productQuantity;
    let newItemSubscription: Subscription;
    this.newProductForm.reset();

    newItemSubscription = 
      this.http.addNewItem({item: this.productService.capitalizeFirstLetter(productName), quantity: productQuantity})
        .subscribe((res) => {
          if (res.status === 201){
            this.productService.addProduct(productName, productQuantity);
            this.table.renderRows();
            newItemSubscription.unsubscribe();
          }
        },
        (error) => {
          console.log(error);
          newItemSubscription.unsubscribe();
        }
      );
  }

  deleteProduct(product: Product){
    this.productService.deleteProduct(product);
  }
}
