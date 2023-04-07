import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
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
  @ViewChild(MatTable) table: MatTable<Product>;

  constructor(
    private http: HttpService,
    private productService: ProductService){
      this.subscriptions.push(
        this.productService.productChanges.subscribe(
          (products: Product[]) => {
            this.products = products;
            this.table.renderRows();
          }
        )
      );
    }

  ngOnInit(): void{
    if (!this.productService.products.length){
      this.http.getProducts();
    } else {
      this.products = this.productService.products;
    }

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

  onAddNewProduct(product: Product): void{
    const newItemSubscription = 
      this.http.addNewItem({item: this.productService.capitalizeFirstLetter(product.name), quantity: product.quantity})
        .subscribe((res) => {
          if (res.status === 201){
            this.table.renderRows();
            newItemSubscription.unsubscribe();
          } else {
            newItemSubscription.unsubscribe();
          }
        },
        (error) => {
          console.log(error);
          newItemSubscription.unsubscribe();
        }
      );
  }

  doneEditingProduct(product: Product): void{
    if (product.name !== ""){
      product.newProduct = false;
      this.onAddNewProduct(product);
    }
  }

  deleteProduct(product: Product): void{
    this.http.deleteItem(product).subscribe(
      (res) => {
        if (res.status === 204){
          this.productService.deleteProduct(product);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
