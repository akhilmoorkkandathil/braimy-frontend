import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../interfaces/user';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { StudentDataTable } from '../../../interfaces/table/studentManagementTable';

@Component({
    selector: 'app-coordinator-stuedents',
    templateUrl: './coordinator-stuedents.component.html',
    styleUrl: './coordinator-stuedents.component.css',
    standalone: false
})
export class CoordinatorStuedentsComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: StudentDataTable) => `${element.index}` },
    { columnDef: 'name', header: 'Name', cell: (element: StudentDataTable) => `${element.username}` },
    { columnDef: 'phone', header: 'Phone', cell: (element: StudentDataTable) => `${element.phone}` },
    { columnDef: 'email', header: 'Email', cell: (element: StudentDataTable) => `${element.email}` },
    { columnDef: 'class', header: 'Class', cell: (element: StudentDataTable) => `${element.class}` },
    { columnDef: 'status', header: 'Block Status', cell: (element: Record<string, StudentDataTable>) => `${element['isBlocked'] ? 'Blocked' : 'Active'}` }
    
  ];


dataSource = new MatTableDataSource<User>();
  tableData: Array<User> = [];

  constructor(
    private adminService: AdminServiceService, 
    private cdr: ChangeDetectorRef,
    private router:Router, 
    private toast: ToastService,
  ) {}


  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.adminService.getCoordinatorUsersList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching users data:', error);
      }
    });
  }

  actions: string[] = ['block','unblock','view'];

  onActionClicked(event: { action: string, element: any }): void {
    switch (event.action) {
      case 'block':
        this.onBlockClicked(event.element._id);
        break;
      case 'unblock':
        this.onUnblockClicked(event.element._id);
        break;
        case 'view':
          this.onViewClicked(event.element._id);
          break;
      default:
        //console.log('Unknown action:', event.action);
    }
  }
  
  onEditClicked(studentId: string): void {
    this.router.navigate([`/coordinator/manageStudent/${studentId}`]);
  }

  onViewClicked(studentId: string): void {
    this.router.navigate([`/coordinator/viewCourseBucket/${studentId}`]);
  }
  
  
  onBlockClicked(studentId: string): void {
    this.adminService.blockStudent(studentId).subscribe({
      next: (response) => {
        const student = this.tableData.find(student => student._id === studentId);
        if (student) {
          student.isBlocked = true; // Change the status to 'blocked'
        }
        this.toast.showSuccess(response.message, 'Success');
      },
      error: (error) => {
        console.error('Error blocking user:', error);
        this.toast.showSuccess(error.message, 'Error');
      }
    });
    
  }
  
  onUnblockClicked(studentId: string): void {
    //console.log("Unblock clicked", id);
    this.adminService.unblockStudent(studentId).subscribe({
      next: (response) => {
        const student = this.tableData.find(student => student._id === studentId);
        if (student) {
          student.isBlocked = false; // Change the status to 'blocked'
        }
        this.toast.showSuccess(response.message, 'Success');
      },
      error: (error) => {
        console.error('Error unblocking user:', error);
        this.toast.showError(error.message, 'Error');
      }
    });
  
  
  }
}
