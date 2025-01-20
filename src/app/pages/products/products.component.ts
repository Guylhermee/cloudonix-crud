import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const authKey = localStorage.getItem('authKey');
    if (authKey) {
      this.http.get('http://rest-items.research.cloudonix.io/items', {
        headers: { Authorization: `Bearer ${authKey}` }
      }).subscribe({
        next: (data: any) => (this.products = data),
        error: (err) => console.error('Error fetching products:', err)
      });
    } else {
      console.error('No authorization key found');
    }
  }

  // Function to handle product click
  viewDetails(product: any): void {
    this.selectedProduct = product;
  }

  // Function to close the modal
  closeModal(): void {
    this.selectedProduct = null;
  }

  // Function to get the object keys (for displaying the dynamic profile)
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
