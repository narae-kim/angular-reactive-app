import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { Subscription, Observable } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnDestroy, OnInit, AfterViewInit {

  selectedProduct: Product | undefined;

  // products: Product[] = [];
  products = new MatTableDataSource<Product>([]);
  columnNames = ['name', 'price'];

  products$: Observable<Product[]> | undefined;

  @ViewChild(ProductDetailComponent) productDetail: ProductDetailComponent | undefined;

  @ViewChild(MatSort) sort: MatSort | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  private productsSub: Subscription | undefined;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = new MatTableDataSource(products);
      this.products.sort = this.sort;
      this.products.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    if (this.productDetail) {
      console.log(`${this.productDetail.product} from ngAfterViewInit`);
    }
  }

  ngOnDestroy(): void { // unsubscribe from an observable manually
      this.productsSub?.unsubscribe();
  }

  onBuy() {
    window.alert(`You just bought ${this.selectedProduct?.name}!`)
  }

  onAdd(product: Product) {
    this.products.data.push(product);
  }

  onDelete() {
    this.products.data = this.products.data.filter(product => product !== this.selectedProduct);
    this.selectedProduct = undefined;
  }
  
}
