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
  showDeleteConfirm = false;

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
    console.log("Selected product:", product); // Verifique se o produto está sendo selecionado corretamente
  }

  // Function to close the modal
  closeModal(): void {
    this.selectedProduct = null;
    this.showDeleteConfirm = false; // Ensure delete modal is hidden when closing
  }

  // Show confirmation for deletion
  confirmDelete(productId: number): void {
    console.log('Confirm delete called'); // Verifique se a função é chamada
    this.showDeleteConfirm = true;
  }

  // Function to delete the product
  deleteProduct(): void {
    console.log('Deleting product:', this.selectedProduct.id); // Verifique se o ID está correto
    const authKey = localStorage.getItem('authKey');
    if (authKey && this.selectedProduct) {
      this.http.delete(`http://rest-items.research.cloudonix.io/items/${this.selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${authKey}` }
      }).subscribe({
        next: () => {
          console.log('Product deleted');
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
    console.log('Delete cancelled');
    this.showDeleteConfirm = false;
  }

  // Function to get the object keys (for displaying the dynamic profile)
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
