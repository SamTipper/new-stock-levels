import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { HttpService } from 'src/app/services/http.service';
import { ProductService } from 'src/app/services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.css']
})
export class StockPageComponent implements OnInit, OnDestroy{
  subscriptions:   Subscription[] = [];
  products:        Product[] = [];
  newProductForm:  FormGroup;
  outOfStockItems: boolean = true;

  @ViewChild(MatTable, { static: true }) table: MatTable<Product>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Product>();
  tableHeaders: string[] = ["Name", "Quantity"];


  constructor(
    private http: HttpService,
    private productService: ProductService,
    private toastr: ToastrService){

      this.subscriptions.push(
        this.productService.productChanges.subscribe(
          (products: Product[]) => {
            this.products = products;
            this.dataSource = new MatTableDataSource<Product>(this.sortProducts(this.products).slice(0, 10));
            console.log(this.products, this.dataSource);
          }
        )
      );
    }

  ngOnInit(): void{
    this.http.checkApiKey();

    if (!this.productService.products.length){
      this.http.getProducts();
    } else {
      this.products = this.productService.products;
      this.dataSource = new MatTableDataSource<Product>(this.sortProducts(this.products).slice(0, 10));
    }

    this.newProductForm = new FormGroup({
      productName: new FormControl(null, Validators.required),
      productQuantity: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe()
    );
  }

  onAddNewProduct(product: Product): void{
    const newItemSubscription = 
      this.http.addNewItem({item: product.name, quantity: product.quantity})
        .subscribe((res) => {
          if (res.status === 201){
            this.table.renderRows();
            newItemSubscription.unsubscribe();
            this.toastr.success("New product created!");
          }
        },
        (error) => {
          console.log(error);
          newItemSubscription.unsubscribe();
          this.toastr.error("An error has occurred, please try again later.");
        }
      );
  }

  doneEditingProduct(product: Product): void{
    if (product.name.trim() !== ""){
      product.name = this.productService.capitalizeFirstLetter(product.name);
      product.newProduct = false;
      this.onAddNewProduct(product);
    } else {
      this.toastr.warning("Products must have a name before being saved.");
    }
  }

  deleteProduct(product: Product): void{
    if (!product.newProduct){
      const deleteItemSubscription = 
        this.http.deleteItem(product).subscribe(
          (res) => {
            if (res.status === 204){
              this.productService.deleteProduct(product);
              deleteItemSubscription.unsubscribe();
              this.toastr.success("Product deleted successfully!");
            }
          },
          (error) => {
            console.log(error);
            deleteItemSubscription.unsubscribe();
            this.toastr.error("An error has occurred, please try again later.");
          }
        );
    } else {
      this.productService.deleteProduct(product);
      this.toastr.success("Product deleted successfully!");
    }
  }

  sortProducts(products: Product[]): Product[]{
    return this.productService.sortProducts(products);
  }

  pageChangeEvent(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;

    this.dataSource = new MatTableDataSource<Product>(
      this.sortProducts(this.products).slice(event.pageIndex * event.pageSize, (event.pageIndex + 1) * event.pageSize)
    );
    
  }

  toggleOutOfStockItems(): void {
    this.outOfStockItems = !this.outOfStockItems;
    this.productService.productChanges.emit(
      this.outOfStockItems ? this.productService.products : this.productService.products.filter(product => product.quantity > 0)
    );
  }
}
