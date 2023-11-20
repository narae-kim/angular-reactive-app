import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent implements OnInit, OnChanges {
  @Input() id = -1;
  product$: Observable<Product> | undefined;

  @Input() product: Product | undefined;
  @Output() bought = new EventEmitter();
  @Output() deleted = new EventEmitter();

  price: number | undefined;

  constructor(
      private productService: ProductsService,
      public authService: AuthService,
      private route: ActivatedRoute,
      private cartService: CartService
    ) {
    console.log(`Name is ${this.product} in the constructor`);
  }

  ngOnChanges(): void {
    this.product$ = this.productService.getProduct(this.id);
  }

  ngOnInit(): void {
    this.product$ = this.route.data.pipe(
      switchMap(data => of(data['product']))
    );

    // // if component will not be reused
    // const id = this.route.snapshot.params['id'];
    // this.product$ = this.productService.getProduct(id);
  }

  buy(product: Product) {
    this.cartService.addProduct(product);
  }

  changePrice(product: Product, price: number) {
    this.productService.updateProduct(product.id, price).subscribe(() => {
      alert(`The price of ${product.name} was changed!`)
    });
  }

  remove(product: Product) {
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.deleted.emit();
    });
  }

}
