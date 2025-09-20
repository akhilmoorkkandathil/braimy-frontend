import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RazorpayOrder } from '../../../interfaces/razorpay';
import { RazorpayOptions } from '../../../interfaces/razorpayOptions';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastService } from '../../../services/toastService/toast.service';
import { WindowRefService } from '../../../services/windowRefService/window-ref.service';
import { UserServiceService } from '../../../services/userServices/user-service.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { UserDataService } from '../../../services/userDataService/user-data.service';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-user-payment',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatIconModule],
  templateUrl: './user-payment.component.html',
  styleUrl: './user-payment.component.css',
})
export class UserPaymentComponent {
  razorpayOrder!: RazorpayOrder;
  razorpayResponseSubscription!: Subscription;

  constructor(
    private windRef: WindowRefService,
    private userService: UserServiceService, // Add this service
    private toast: ToastService ,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  basic(type: string, amount: number) {
    this.proceedWithPayment(type, amount);
  }
  private proceedWithPayment(type: string, amount: number) {
    const data = {type,amount}
    this.userService.payment(data).subscribe({
      next: (response) => {
        this.razorpayOrder = response.data;
        console.log(response.data);
        this.payWithRazor();
      },
      error: (error) => {
        console.error('Error fetching payment data:', error);
        this.toast.showError('Unable to initiate payment. Please try again later.', 'Error');
      },
    });
  }

  payWithRazor() {
    const options: RazorpayOptions = {
      key: environment.RZP_KEY_ID,
      amount: 1000 * 100,
      currency: 'INR',
      name: 'Braimy',
      description: 'Braimy payment for Subscription.',
      image: 'https://res.cloudinary.com/db7wl83jl/image/upload/v1724297785/newbig-removebg_jh0fte.png',
      order_id: this.razorpayOrder.orderId,
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#007bff',
      },
    };
    console.log('okay', options);
    options.handler = (response, error) => {
      options.response = response;
      console.log(response);
      console.log(options);
      // call your backend api to verify payment signature & capture transaction
      if (response) {
        this.razorpayResponseSubscription = this.userService
          .updatePaymentStatus(this.razorpayOrder.orderId)
          .subscribe({
            next: (res) => {
              this.userDataService.userData$.subscribe(userData => {
                if (userData) {
                  const updatedUserData: User = {
                    ...userData,
                    rechargedHours: res.data.rechargedHours,

                  };
                  this.userDataService.updateUserData(updatedUserData);
                }
              });
        
              Swal.fire({
                title: "Success!",
                text: "Paymenet Successfull!!",
                icon: "success"
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error!',
                text: 'Failed to process payment.',
                icon: 'error',
              });
              console.log(err);
              //this.toastr.error('Failed to process payment.');
            },
          });
      }
      if(error){
        console.log(error);
        
      }
    };

    if (options.modal) {
      options.modal.ondismiss = () => {
        Swal.fire({
          title: 'Error!',
          text: 'Your payment cancelled.',
          icon: 'error',
        });
        console.log('Transaction cancelled.');
      };
    }

    const rzp = new this.windRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  toPaymentHistory(){
    this.router.navigate(['/user/payment-history']);
  }
}
