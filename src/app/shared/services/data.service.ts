import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "../Interfaces/stores.interface";
import { DetailsOrder, Order } from "../Interfaces/order.interface";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root'
})

export class DataService {
    private readonly API_URL = environment.apiUrl;

    constructor(private readonly http: HttpClient){}

    getStores(): Observable<Store[]>{
        return this.http.get<Store[]>(`${this.API_URL}/stores`);
    }
    saveOrder(order: Order): Observable<Order>{
        return this.http.post<Order>(`${this.API_URL}/orders`, order);
    }
    saveDetailsOrder(details: DetailsOrder): Observable<DetailsOrder>{
        return this.http.post<DetailsOrder>(`${this.API_URL}/detailsOrders`, details);
    }
}