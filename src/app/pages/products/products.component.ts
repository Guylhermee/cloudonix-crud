import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductCreateComponent } from '../../components/product-editor/product-editor.component';

@Component({
  standalone: true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, ProductCreateComponent]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  showDeleteConfirm = false;
  isEditing = false;
  isCreatingProduct = false;

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

  openCreateProductModal(): void {
    this.isCreatingProduct = true;
  }

  closeCreateProductModal(): void {
    this.isCreatingProduct = false;
  }

  viewDetails(product: any): void {
    this.selectedProduct = product;
    this.isEditing = false; 
  }

  closeModal(): void {
    this.selectedProduct = null;
    this.showDeleteConfirm = false; 
  }

  confirmDelete(productId: number): void {
    this.showDeleteConfirm = true;
  }

  deleteProduct(): void {
    const authKey = localStorage.getItem('authKey');
    if (authKey && this.selectedProduct) {
      this.http.delete(`http://rest-items.research.cloudonix.io/items/${this.selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${authKey}` }
      }).subscribe({
        next: () => {
          this.products = this.products.filter(product => product.id !== this.selectedProduct.id);
          this.closeModal();
          this.showDeleteConfirm = false;
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          this.showDeleteConfirm = false;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  editProduct(): void {
    this.isEditing = true; 
  }
}