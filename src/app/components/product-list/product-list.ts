import { Component, OnInit, inject, signal, computed, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProductsService } from '../../services/products.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { ProductItem } from '../product-item/product-item';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ReactiveFormsModule, ProductItem],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {
  private productsService = inject(ProductService);
  private injector = inject(Injector);

  products = signal<Product[]>([]);
  total = signal(0);
  loading = signal(false);
  page = signal(0);
  pageSize = 10;

  form = new FormGroup({
    q: new FormControl(''),
    category: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null)
  });

  query = computed(() => this.form.get('q')?.value ?? '');

  private q$ = toObservable(this.query, { injector: this.injector });

  ngOnInit(): void {
    this.q$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => { this.resetAndLoad(); })
    ).subscribe();

    this.resetAndLoad();

    this.form.valueChanges.pipe(debounceTime(400)).subscribe(() => this.resetAndLoad());
  }

  private resetAndLoad() {
    this.page.set(0);
    this.products.set([]);
    this.fetchPage();
  }

  fetchPage() {
    if (this.loading()) return;
    this.loading.set(true);
    const skip = this.page() * this.pageSize;
    const q = this.form.value.q || '';
    const category = this.form.value.category ?? undefined;
    this.productsService.searchProducts(q, this.pageSize, skip, category)
      .subscribe({
        next: res => {
          this.products.set([...this.products(), ...res.products]);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => { this.loading.set(false); }
      });
  }

  onScroll() {
    if (this.loading()) return;
    const loaded = this.products().length;
    if (loaded >= this.total()) return;
    this.page.update(p => p + 1);
    this.fetchPage();
  }

  onSaveEdit(ev: { id: number; patch: Partial<Product> }) {
    const list = this.products().map(p => p.id === ev.id ? { ...p, ...ev.patch } : p);
    this.products.set(list);
    this.productsService.updateProduct(ev.id, ev.patch).subscribe({
      next: updated => {
        const list2 = this.products().map(p => p.id === updated.id ? updated : p);
        this.products.set(list2);
      },
      error: () => {
       
      }
    });
  }
}
