import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';
import { PaymentData } from '../../../interfaces/paymentFormData';
import { User } from '../../../interfaces/user';

@Component({
    selector: 'app-admin-add-payment',
    templateUrl: './admin-add-payment.component.html',
    styleUrl: './admin-add-payment.component.css',
    standalone: false
})
export class AdminAddPaymentComponent {
  paymentForm!: FormGroup;
  title:string='Enter Payment Information';
  button:string='Add Payment'

  paymentData:PaymentData
  usersList:User[];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private toast: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.validateForm();
    this.fetchUsersList();
  }

  fetchUsersList(){
    this.adminService.getUsersList().subscribe(
      (response) => {
        this.usersList = response.data; // Assign the fetched data to usersList
        console.log("Fetched users list:", this.usersList);
      },
      (error) => {
        console.error("Error fetching users list:", error);
      }
    );
  }

  validateForm(){
    this.paymentForm = this.fb.group({
      student: ['', Validators.required],
      amountPaid: ['', Validators.required],
      planSelected: ['',Validators.required],
    });
  }


  onSubmit() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
      
      this.adminService.addPayment(this.paymentForm.value).subscribe({
        next: (response) => {
          this.toast.showSuccess(response.message, 'Success');
          this.router.navigate(['/admin/payments']);
        },
        error: (error) => {
          this.toast.showError(error.message, 'Error');
        }
      });
    }
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Handle file upload logic
  }
}
