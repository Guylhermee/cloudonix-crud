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

  // Fechar modal de criação
  closeCreateProductModal(): void {
    this.isCreatingProduct = false;
  }

  // Function to handle product click
  viewDetails(product: any): void {
    this.selectedProduct = product;
    this.isEditing = false;  // Reseta a edição quando um produto é selecionado
  }

  // Function to close the modal
  closeModal(): void {
    this.selectedProduct = null;
    this.showDeleteConfirm = false; // Ensure delete modal is hidden when closing
    this.isEditing = false;  // Reset editing state
  }

  // Show confirmation for deletion
  confirmDelete(productId: number): void {
    this.showDeleteConfirm = true;
  }

  // Function to delete the product
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

  // Function to cancel deletion
  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  // Function to get the object keys (for displaying the dynamic profile)
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Function to trigger the edit state
  editProduct(): void {
    this.isEditing = true;  // Set to true to show the product edit form
  }
}
