import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { Expense } from '../../../interfaces/expense';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';
import { ExpenseData } from '../../../interfaces/table/expenseData';

@Component({
    selector: 'app-admin-expense-list',
    templateUrl: './admin-expense-list.component.html',
    styleUrl: './admin-expense-list.component.css',
    standalone: false
})
export class AdminExpenseListComponent {
  // Table column definition
tableColumns: Array<Column> = [
  { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, ExpenseData>) => `${element['index']}` },
  { columnDef: 'date', header: 'Date', cell: (element: Record<string, ExpenseData>) => `${element['date']}` },
  { columnDef: 'payedTo', header: 'Payed To', cell: (element: Record<string, ExpenseData>) => `${element['payedTo']}` },
  { columnDef: 'paymentMethod', header: 'Payment Method', cell: (element: Record<string, ExpenseData>) => `${element['paymentMethod']}` },
  { columnDef: 'amount', header: 'Amount', cell: (element: Record<string, ExpenseData>) => `${element['amount']}` },
  { columnDef: 'description', header: 'Description', cell: (element: Record<string, ExpenseData>) => `${element['description']}` },
  { columnDef: 'reason', header: 'Reason', cell: (element: Record<string, ExpenseData>) => `${element['reason']}` },
];
dataSource = new MatTableDataSource<Expense>();
  tableData: Array<Expense> = [];

  constructor(
    private adminService: AdminServiceService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchExpenseData();
  }

  fetchExpenseData(): void {
    this.adminService.getExpenseList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges();
        //console.log(this.tableData);
      },
      error: (error) => {
        console.error('Error fetching expense data:', error);
      }
    });
  }

  actions: string[] = ['edit','delete'];

  onActionClicked(event: { action: string, element: any }): void {
    switch (event.action) {
      case 'edit':
        this.onEditClicked(event.element._id);
        break;
      case 'delete':
        this.onDeleteClicked(event.element._id);
        break;
      default:
        //console.log('Unknown action:', event.action);
    }
  }
  
  onEditClicked(id:string): void {
    this.router.navigate([`/admin/addExpense/${id}`]);
    
  }
  
  
  onDeleteClicked(id:string): void {
    this.adminService.deleteExpense(id).subscribe({
      next: (response) => {
        this.fetchExpenseData();
        this.toast.showSuccess(response.message, 'Success');
      },
      error: (error) => {
        console.error('Error deleting tutor:', error);
        this.toast.showError(error.message, 'Error');
      }
    });
  }

}
