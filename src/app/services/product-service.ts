import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import type { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
   private base = environment.api_url;

  constructor(private http: HttpClient) {}

  searchProducts(q: string, limit = 10, skip = 0, category?: string): Observable<{ products: Product[]; total: number }> {
    const url = q?.trim() ? `${this.base}/products/search` : `${this.base}/products`;
    let params = new HttpParams().set('limit', `${limit}`).set('skip', `${skip}`);
    if (q?.trim()) params = params.set('q', q.trim());
    if (category) params = params.set('category', category);

    return this.http.get<{ products: Product[]; total: number }>(url, { params }).pipe(
      map(res => res),
      catchError(err => {
        console.error('Products API error', err);
        return throwError(() => err);
      })
    );
  }

  updateProduct(productId: number, patch: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.base}/products/${productId}`, patch).pipe(
      catchError(err => {
        console.error('Update product error', err);
        return throwError(() => err);
      })
    );
  }
  
  
}
