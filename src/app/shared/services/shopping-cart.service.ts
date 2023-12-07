import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Product } from "src/app/pages/products/interfaces/product.interface";

@Injectable(
    { providedIn: "root" }
)

export class ShoppingCartService {
    products: Product[] = [];

    private cartSubject = new BehaviorSubject<Product[]>([]);
    private totalSubject = new BehaviorSubject<number>(0);
    private quantitySubject = new BehaviorSubject<number>(0);

    get totalAction$(): Observable<number> {
        return this.totalSubject.asObservable();
    }
    get quantityAction$(): Observable<number> {
        return this.quantitySubject.asObservable();
    }
    get cartAction$(): Observable<Product[]> {
        return this.cartSubject.asObservable();
    }
    //Actualiza el cart. Recibe un producto, llamando al método addToCart, 
    //actualiza las cantidades llamando al  método quantityProducts y por último llama al método total
    updateCart(product: Product): void {
        this.addToCart(product);
        this.quantityProducts();
        this.calcTotal();
    }
    //Este método agrega un producto al carrito y lo guarda en el array products.
    private addToCart(product:Product): void {
        const isProductInCart = this.products.find(({ id }) => id === product.id)
        if(isProductInCart){
            isProductInCart.qty += 1;
        }else{
            this.products.push({...product, qty:1})
        }
        this.cartSubject.next(this.products);
    }
    //Este método extrae la cantidad de productos que el usuario haya agregado al carrito
    private quantityProducts(): void {
        //const quantity = this.products.length;
        const quantity = this.products.reduce((acc, prod) => acc += prod.qty, 0);
        this.quantitySubject.next(quantity);
    }
    // Este método no devolverá nada, solo va sumando los precios de los productos y nos calcula el total
    private calcTotal(): void {
        const total = this.products.reduce((acc, prod) => acc += (prod.price * prod.qty), 0);
        this.totalSubject.next(total);
    }
    public resetCart(): void {
        this.cartSubject.next([]);
        this.totalSubject.next(0);
        this.quantitySubject.next(0);
        this.products = [];
    }

}