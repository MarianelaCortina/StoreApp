import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { delay, switchMap, tap } from 'rxjs/operators';
import { Details, DetailsOrder, Order } from 'src/app/shared/Interfaces/order.interface';
import { Store } from 'src/app/shared/Interfaces/stores.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { Product } from '../products/interfaces/product.interface';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAddress:'',
    city: ''
  };
  isDelivery= true;
  cart: Product[] = [];
  stores: Store[] = [];
  constructor(
    private dataSVC: DataService, 
    private shoppingCartSvc: ShoppingCartService,
    private productsService: ProductsService,
    private router: Router
    ){ 
      this.checkIfCartIsEmpty(); 
    }

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  onPickupOrDelivery(value:boolean): void { 
    //console.log(value);
    this.isDelivery = value;
  }
  onSubmit({value: formData}: NgForm): void {
    console.log('Guardar', formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDay(),
      isDelivery:this.isDelivery
    }
    this.dataSVC.saveOrder(data)
    .pipe(
      tap(res=> console.log('Order ->', res)),
      switchMap(({ id: orderId }) => {
        const details = this.prepareDetails();
        return this.dataSVC.saveDetailsOrder({details, orderId});
      }),
      tap(() => this.router.navigate(['/checkout/thank-you-page'])),
      delay(2000),
      tap(() => this.shoppingCartSvc.resetCart())
    )
    .subscribe();
  }
  private getStores(): void {
    this.dataSVC.getStores()
    .pipe(
      tap((stores:Store[]) => this.stores = stores)
    )
    .subscribe()
  }
  private getCurrentDay(): string {
    return new Date().toLocaleDateString();
  }
  private prepareDetails(): Details[] {
    const details: Details[] = [];
    this.cart.forEach((product: Product) => {
      //console.log(res);
      const {id:productId, name:productName, qty:quantity, stock} = product;
      const updateStock = (stock - quantity);
      this.productsService.updateStock(productId, updateStock)
      .pipe(
        tap(() => details.push({productId, productName, quantity}))
      )
      .subscribe();   
    })
    return details;
  }
  private getDataCart():void{
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap((products: Product[]) => this.cart = products),
    )
    .subscribe()
  }
  private checkIfCartIsEmpty(): void{
    this.shoppingCartSvc.cartAction$
    .pipe(
      tap(( products: Product[]) => {
        if (Array.isArray(products) && !products.length) {
          this.router.navigate(['/products']);
        }
      })
    )
    .subscribe()
  }

}
