import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';
import { PaymentResponse } from '../../../interfaces/paymentTable';

@Component({
    selector: 'app-admin-payment-list',
    templateUrl: './admin-payment-list.component.html',
    styleUrl: './admin-payment-list.component.css',
    standalone: false
})
export class AdminPaymentListComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, PaymentResponse>) => `${element['index']}` },
    { columnDef: 'date', header: 'Date', cell: (element: Record<string, PaymentResponse>) => element['date'] }, // Format date
    { columnDef: 'studentName', header: 'Student Name', cell: (element: Record<string, PaymentResponse>) => element['studentName'] }, // Accessing username from studentId
    { columnDef: 'planSelected', header: 'Plan Selected', cell: (element: Record<string, PaymentResponse>) => `${element['planSelected']}` }, // Plan selected
    { columnDef: 'amount', header: 'Amount Paid', cell: (element: Record<string, PaymentResponse>) => `${element['amountPaid']}` }, // Amount paid
    { columnDef: 'timeRecharged', header: 'Time Recharged', cell: (element: Record<string, PaymentResponse>) => `${element['timeRecharged']} hours` }, // Time recharged
    { columnDef: 'status', header: 'Status', cell: (element: Record<string, PaymentResponse>) => `${element['status']}` } // Payment status
];
  dataSource = new MatTableDataSource<PaymentResponse>();
  tableData: Array<PaymentResponse> = [];

  constructor(
    private adminService: AdminServiceService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchPaymentData();
  }

  fetchPaymentData(): void {
    this.adminService.getPaymentList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection
        console.log(this.tableData);
      },
      error: (error) => {
        console.error('Error fetching payment data:', error);
      }
    });
  }
  actions: string[] = ['delete']; // Define actions separately

onActionClicked(event: { action: string, element: any }): void {
  switch (event.action) {
    case 'delete':
      this.onDeleteClicked(event.element);
      break;
    default:
      //console.log('Unknown action:', event.action);
  }
}

onEditClicked(paymentData): void {
  
  this.router.navigate(['/admin/addPayment'], { state: { paymentData } });
}

onDeleteClicked(paymentData:PaymentResponse): void {
  console.log(paymentData);
  
  this.adminService.deletePayment(paymentData).subscribe({
    next: (response) => {
      this.tableData = this.tableData.filter(payment => payment.studentId !== paymentData.studentId);
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error deleting tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}
}
