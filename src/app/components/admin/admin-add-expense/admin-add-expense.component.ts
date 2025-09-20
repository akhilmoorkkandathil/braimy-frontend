import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseData } from '../../../interfaces/expenseFormData';

@Component({
    selector: 'app-admin-add-expense',
    templateUrl: './admin-add-expense.component.html',
    styleUrl: './admin-add-expense.component.css',
    standalone: false
})
export class AdminAddExpenseComponent {
  expenseForm!: FormGroup;
  selectedFile: File | null = null;
  expenceId: string | null = null;
  title:string='Enter Expence Information';
  button:string='Add Expence'

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.validateForm();
    this.route.paramMap.subscribe(params => {      
      this.expenceId = params.get('id');
      //console.log(params.get('id'));
      
      if (this.expenceId) {
        this.loadExpenseData(this.expenceId);
      }
    });
  }

  validateForm(){
    this.expenseForm = this.fb.group({
      payedTo: ['', Validators.required],
      paymentMethode: ['', Validators.required],
      amount: ['', Validators.required],
      description: [''],
      reason: ['', Validators.required],
    });
  }

  loadExpenseData(id: string): void {
    this.adminService.getExpense(id).subscribe({
      next: (response) => {
        this.title = "Edit Expence Information";
        this.button = "Update Expence";
        //console.log(response);
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      }
    });
  }
  populateForm(data: ExpenseData): void {
    this.expenseForm.patchValue({
      payedTo: data.amountPaidTo,
      paymentMethode: data.paymentMethod,
      amount: data.amount, 
      description: data.description, 
      reason:data.reason
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      if (this.expenceId) {        
        this.adminService.updateExpense(this.expenceId, this.expenseForm.value).subscribe({
          next: (response) => {
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate(['/admin/expenses']);
          },
          error: (error) => {
            this.toast.showError(error.message, 'Error');
          }
        });
      }else{      
        
      this.adminService.addExpense(this.expenseForm.value).subscribe({
        next: (response) => {
          this.toast.showSuccess(response.message, 'Success');
          this.router.navigate(['/admin/expenses']);
        },
        error: (error) => {
          this.toast.showError(error.message, 'Error');
        }
      });
    }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Handle file upload logic
  }
}
