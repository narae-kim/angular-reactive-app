import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { ProductsService } from '../products.service';
import { Product } from '../product';
import { priceRanceValidator } from '../price-range.directive';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  @Output() added = new EventEmitter<Product>();

  productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    price: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required, priceRanceValidator()]
    })
  });

  showPriceRangeHint = false;

  products: Product[] = [];

  products$: Observable<Product[]> | undefined;

  categories = ['Hardware', 'Computers', 'Clothing', 'Software'];

  constructor(private productsService: ProductsService, private builder: FormBuilder) {}

  ngOnInit(): void {
      this.productsService.getProducts().subscribe(products => {
        this.products = products;
      });

      this.products$ = this.name.valueChanges.pipe(
        map(name => this.products.filter(product => product.name.startsWith(name)))
      );
  }

  createProduct() {
    this.productsService.addProduct(this.name.value, Number(this.price.value)).subscribe(product => {
      this.productForm.reset();
      this.added.emit(product);
    });
  }

  get name() { return this.productForm.controls.name }

  get price() { return this.productForm.controls.price }

}
