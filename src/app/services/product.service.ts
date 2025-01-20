import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://rest-items.research.cloudonix.io/items';

  constructor(private http: HttpClient) {}

  getProducts(authKey: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authKey}`);
    return this.http.get(this.apiUrl, { headers });
  }
}
