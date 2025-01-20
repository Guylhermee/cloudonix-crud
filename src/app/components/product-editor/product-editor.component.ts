import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Importação do HttpClient
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ProductCreateComponent implements OnInit {
  @Input() productToEdit: any; // Para receber o produto a ser editado
  name = '';
  sku = '';
  description = '';
  cost: number | null = null;
  type = 'furniture'; // Valor padrão
  available = true;   // Valor padrão
  backlog: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    if (this.productToEdit) {
      // Preenche os campos com os dados do produto
      this.name = this.productToEdit.name;
      this.sku = this.productToEdit.sku;
      this.description = this.productToEdit.description;
      this.cost = this.productToEdit.cost;
      this.type = this.productToEdit.profile?.type || 'furniture';
      this.available = this.productToEdit.profile?.available || true;
      this.backlog = this.productToEdit.profile?.backlog || null;
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Salvar o produto (criar ou editar)
  saveProduct() {
    const productData = {
      name: this.name,
      sku: this.sku,
      description: this.description,
      cost: this.cost,
      profile: {
        type: this.type,
        available: this.available,
        backlog: this.backlog,
      }
    };

    if (this.productToEdit) {
      this.editProduct(this.productToEdit.id, productData);
    } else {
      // Lógica para criar um novo produto (POST)
      this.createProduct(productData);
    }
  }

  // Função para criar um novo produto
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
      },
      (error) => {
        console.error('Error creating product:', error);
      }
    );
  }

  // Função para editar um produto
  editProduct(productId: number, productData: any) {
    const authKey = localStorage.getItem('authKey');
    if (!authKey) {
      console.error('Authorization key is missing.');
      return;
    }
  
    // Remover o SKU do objeto productData
    delete productData.sku;
  
    this.http.patch(`http://rest-items.research.cloudonix.io/items/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json'
      }
    }).subscribe(
      (response: any) => {
        console.log('Product updated:', response);
      },
      (error) => {
        console.error('Error updating product:', error);
      }
    );
  }
}
