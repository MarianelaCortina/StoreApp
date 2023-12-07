import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = environment.apiUrl;
  
  constructor(private readonly http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }
  updateStock(productId: number, stock: number): Observable<any>{
    const body = { "stock": stock };
    return this.http.patch<any>(`${this.API_URL}/${productId}`, body);
  }
}

