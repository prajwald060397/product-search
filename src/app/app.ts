import { Component, signal } from '@angular/core';
import { ProductList } from './components/product-list/product-list';


@Component({
  selector: 'app-root',
  imports: [ProductList],
  template: `<main style="
      /* max-width: 1200px; */
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 92vh;
    ">
      <header style="
        text-align: center;
        /* margin-bottom: 30px; */
        /* padding: 20px; */
      ">
        <h1 style="
          color: white;
          font-size: 36px;
          font-weight: 700;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">🛍️ Product Search</h1>
        <p style="
          color: rgba(255,255,255,0.9);
          font-size: 16px;
          margin-top: 8px;
        ">Find and manage your products with ease</p>
      </header>
      <app-product-list></app-product-list>
    </main>`,
    styles: [`
    :host {
      display: block;
    }
    
    @media (max-width: 768px) {
      main {
        padding: 16px !important;
        min-height: 100vh;
      }
      
      h1 {
        font-size: 28px !important;
      }
    }
  `]
})
export class App {
  protected readonly title = signal('product-search');
}
