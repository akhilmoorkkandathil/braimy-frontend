import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../../interfaces/table/table';
import { Payment } from '../../../../interfaces/paymentResponse';
import { UserServiceService } from '../../../../services/userServices/user-service.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toastService/toast.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-user-payment-history',
    templateUrl: './user-payment-history.component.html',
    styleUrl: './user-payment-history.component.css',
    standalone: false
})
export class UserPaymentHistoryComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'index', header: 'Serial No.', cell: (element: Payment) => `${element.index}` }, // Serial number
    { columnDef: 'date', header: 'Date', cell: (element: Payment) => `${new Date(element.date).toLocaleDateString()}` }, // Format date
    { columnDef: 'planSelected', header: 'Plan Selected', cell: (element: Payment) => `${element.planSelected || 'N/A'}` }, // Plan selected
    { columnDef: 'amountPaid', header: 'Amount Paid', cell: (element: Payment) => `${element.amountPaid}` }, // Amount paid
    { columnDef: 'timeRecharged', header: 'Time Recharged', cell: (element: Payment) => `${element.timeRecharged || 0} hours` }, // Time recharged
    { columnDef: 'status', header: 'Status', cell: (element: Payment) => `${element.status}` } // Payment status
];

dataSource = new MatTableDataSource<Payment>();
  tableData: Array<Payment> = [];

  constructor(
    private userService: UserServiceService, 
    private cdr: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    this.fetchPaymentHistory();
  }

  fetchPaymentHistory(): void {
    this.userService.fetchPaymentHistory().subscribe({
      next: (response) => {
        this.tableData =response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }
}


