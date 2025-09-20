import { Component, OnInit,ChangeDetectorRef, inject } from '@angular/core';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { User } from '../../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { Column } from '../../../interfaces/table/table'; 
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { UserData } from '../../../interfaces/table/userTableData';


@Component({
    selector: 'app-admin-user-list',
    templateUrl: './admin-user-list.component.html',
    styleUrls: ['./admin-user-list.component.css'],
    standalone: false
})
export class AdminUserListComponent implements OnInit {
  tableColumns: Array<Column> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, UserData>) => `${element['index']}` },
    { columnDef: 'name', header: 'Name', cell: (element: Record<string, UserData>) => `${element['username']}` },
    { columnDef: 'phone', header: 'Phone', cell: (element: Record<string, UserData>) => `${element['phone']?element['phone']:'Nil'}` },
    { columnDef: 'email', header: 'Email', cell: (element: Record<string, UserData>) => `${element['email']}` },
    { columnDef: 'class', header: 'Class', cell: (element: Record<string, UserData>) => `${element['class']?element['class']:'Nil'}` },
    { columnDef: 'status', header: 'Block Status', cell: (element: Record<string, UserData>) => `${element['isBlocked'] ? 'Blocked' : 'Active'}` } 
];

  dataSource = new MatTableDataSource<User>();
  tableData: Array<User> = []; 
  constructor(
    private adminService: AdminServiceService, 
    private cdr: ChangeDetectorRef,
    private router:Router, 
    private toast: ToastService,
    
  ) { }


  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.adminService.getUsersList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

actions: string[] = ['edit', 'block','unblock'];

onActionClicked(event: { action: string, element: any }): void {
  switch (event.action) {
    case 'edit':
      this.onEditClicked(event.element._id);
      break;
    case 'block':
      this.onBlockClicked(event.element._id);
      break;
    case 'unblock':
      this.onUnblockClicked(event.element._id);
      break;
    default:
      //console.log('Unknown action:', event.action);
  }
}

onEditClicked(id: string): void {
  this.router.navigate([`/admin/addStudent/${id}`]);
}


onBlockClicked(id: string): void {
  this.adminService.blockStudent(id).subscribe({
    next: (response) => {
      console.log("Student blocked successfully", response);
      const userIndex = this.tableData.findIndex(user => user._id === id);
      console.log(this.tableData);
      
      console.log("userIndex",userIndex);
      console.log("this.tableData[userIndex]",this.tableData[userIndex]);
      if (userIndex !== -1) {
        this.tableData[userIndex].isBlocked = true; // Assuming you have an isBlocked property
        console.log(this.tableData);
        this.dataSource.data = [...this.tableData];
        this.cdr.detectChanges();
      }
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error blocking user:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onUnblockClicked(id: string): void {
  this.adminService.unblockStudent(id).subscribe({
    next: (response) => {
      const userIndex = this.tableData.findIndex(user => user._id === id);
      if (userIndex !== -1) {
        this.tableData[userIndex].isBlocked = false;
        console.log(this.tableData);
         // Assuming you have an isBlocked property
        this.dataSource.data = [...this.tableData];
        this.cdr.detectChanges();
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
