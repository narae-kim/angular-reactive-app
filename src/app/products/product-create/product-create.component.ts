import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
    }) //,
    // info: new FormGroup({
    //   category: new FormControl(''),
    //   description: new FormControl(''),
    //   image: new FormControl('')
    // })
  });

  // productForm: FormGroup<{
  //   name: new FormControl<string>,
  //   price: new FormControl<number | undefined>
  // }> | undefined;

  showPriceRangeHint = false;

  constructor(private productsService: ProductsService, private builder: FormBuilder) {}

  ngOnInit(): void {
      this.price.valueChanges.subscribe(price => {
        if(price) {
          this.showPriceRangeHint = price > 1 && price < 10000;
        }
      })
  }

  // createProduct(name: string, price: number) {
  //   this.productsService.addProduct(name, price).subscribe(product => {
  //     this.added.emit(product);
  //   });
  // }

  createProduct() {
    this.productsService.addProduct(this.name.value, Number(this.price.value)).subscribe(product => {
      this.productForm.reset();
      this.added.emit(product);
    });
  }

  get name() { return this.productForm.controls.name }

  get price() { return this.productForm.controls.price }

  // private buildForm() {
  //   this.productForm = this.builder.nonNullable.group({
  //     name: this.builder.nonNullable.control(''),
  //     price: this.builder.nonNullable.control<number | undefined>(undefined, {})
  //   });
  // }

}
