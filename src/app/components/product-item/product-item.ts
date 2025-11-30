import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-item',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-item.html',
  styleUrl: './product-item.scss',
})
export class ProductItem {
  @Input() product!: Product;
  @Output() save = new EventEmitter<{ id: number; patch: Partial<Product> }>();

  editing = signal(false);

  form = new FormGroup({
    title: new FormControl(''),
    price: new FormControl(0)
  });

  ngOnChanges() {
    if (this.product) {
      this.form.patchValue({ title: this.product.title, price: this.product.price });
    }
  }

  startEdit() {
    this.form.patchValue({ title: this.product.title, price: this.product.price });
    this.editing.set(true);
  }

  cancel() {
    this.editing.set(false);
  }

  onSave() {
    const patch: Partial<Product> = {
      title: this.form.value.title ?? '',
      price: Number(this.form.value.price)
    };
    this.save.emit({ id: this.product.id, patch });
    this.editing.set(false);
  }

}
