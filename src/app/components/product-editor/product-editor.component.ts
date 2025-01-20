import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ProductCreateComponent implements OnInit {
  @Input() productToEdit: any;
  name = '';
  sku = '';
  description = '';
  cost: number | null = null;
  type = 'furniture';
  available = true;
  backlog: number | null = null;
  
  customProperties: { key: string, value: string }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.productToEdit) {
      this.name = this.productToEdit.name;
      this.sku = this.productToEdit.sku;
      this.description = this.productToEdit.description;
      this.cost = this.productToEdit.cost;
      this.type = this.productToEdit.profile?.type || 'furniture';
      this.available = this.productToEdit.profile?.available || true;
      this.backlog = this.productToEdit.profile?.backlog || null;

      if (this.productToEdit.profile?.customProperties) {
        this.customProperties = this.productToEdit.profile.customProperties;
      }
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  addCustomProperty() {
    this.customProperties.push({ key: '', value: '' });
  }

  removeCustomProperty(index: number) {
    this.customProperties.splice(index, 1);
  }

  validateForm(): boolean {
    if (!this.name.trim() || !this.sku.trim() || !this.description.trim() || this.cost === null) {
      alert('Please fill in all required fields.');
      return false;
    }

    for (const property of this.customProperties) {
      if (!property.key.trim() || !property.value.trim()) {
        alert('Please fill in all custom properties fields.');
        return false;
      }
    }
    return true;
  }

  saveProduct() {
    if (!this.validateForm()) {
      return;
    }

    const productData = {
      name: this.name,
      sku: this.sku,
      description: this.description,
      cost: this.cost,
      profile: {
        type: this.type,
        available: this.available,
        backlog: this.backlog,
        customProperties: this.customProperties
      }
    };

    if (this.productToEdit) {
      this.editProduct(this.productToEdit.id, productData);
    } else {
      this.createProduct(productData);
    }
  }

  createProduct(productData: any) {
    const authKey = localStorage.getItem('authKey');
    if (!authKey) {
      console.error('Authorization key is missing.');
      return;
    }

    this.http.post('http://rest-items.research.cloudonix.io/items', productData, {
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {
        console.log('Product created:', response);
        alert('Product created successfully.');
        window.location.reload();
      },
      (error) => {
        console.error('Error creating product:', error);
        alert('Error creating product.');
      }
    );
  }

  editProduct(productId: number, productData: any) {
    const authKey = localStorage.getItem('authKey');
    if (!authKey) {
      console.error('Authorization key is missing.');
      return;
    }

    delete productData.sku;

    this.http.patch(`http://rest-items.research.cloudonix.io/items/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {
        console.log('Product updated:', response);
        alert('Product updated successfully.');
        window.location.reload(); 
      },
      (error) => {
        console.error('Error updating product:', error);
        alert('Error updating product.');
      }
    );
  }
}
