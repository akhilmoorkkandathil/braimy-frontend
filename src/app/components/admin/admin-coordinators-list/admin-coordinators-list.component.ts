import { ChangeDetectorRef, Component } from '@angular/core';
import { userColumn } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../interfaces/user';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';
import { CoordinatorData } from '../../../interfaces/table/coordinatorFromData';

@Component({
    selector: 'app-admin-coordinators-list',
    templateUrl: './admin-coordinators-list.component.html',
    styleUrl: './admin-coordinators-list.component.css',
    standalone: false
})
export class AdminCoordinatorsListComponent {
  tableColumns: Array<userColumn> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, CoordinatorData>) => `${element['index']}` },
    { columnDef: 'name', header: 'Name', cell: (element: Record<string, CoordinatorData>) => `${element['username']}` },
    { columnDef: 'phone', header: 'Phone', cell: (element: Record<string, CoordinatorData>) => `${element['phone']}` },
    { columnDef: 'email', header: 'Email', cell: (element: Record<string, CoordinatorData>) => `${element['email']}` },
    { columnDef: 'isVerified', header: 'Verification Status', cell: (element: Record<string, CoordinatorData>) => `${element['isVerified'] ? 'Verified' : 'Not Verified'}` },
    { columnDef: 'isBlocked', header: 'Block Status', cell: (element: Record<string, CoordinatorData>) => `${element['isBlocked'] ? 'Blocked' : 'Active'}` },
  ];
  dataSource = new MatTableDataSource<User>();
  tableData: Array<User> = [];

  constructor(
    private adminService: AdminServiceService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCoordinatorData();
  }

  fetchCoordinatorData(): void {
    this.adminService.getCoordinatorsList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection
        //console.log(this.tableData);
      },
      error: (error) => {
        console.error('Error fetching coordinator data:', error);
      }
    });
  }
  actions: string[] = ['verify','edit', 'block','unblock','delete']; // Define actions separately

onActionClicked(event: { action: string, element: any }): void {
  switch (event.action) {
    case 'edit':
      this.onEditClicked(event.element._id);
      break;
    case 'block':
      this.onBlockClicked(event.element._id);
      break;
    case 'delete':
      this.onDeleteClicked(event.element._id);
      break;
    case 'verify':
      this.onVerifyClicked(event.element._id);
      break;
    case 'unblock':
      this.onUnblockClicked(event.element._id);
      break;
    default:
      //console.log('Unknown action:', event.action);
  }
}

onEditClicked(id: string): void {
  //console.log("edit clicked", id);
  this.router.navigate([`/admin/editCoordinator/${id}`]);
}

onVerifyClicked(id: string): void {
  this.adminService.verifyCoordinator(id).subscribe({
    next: (response) => {
      //console.log("Coordinator verified successfully", response);
      const coordinatorIndex = this.tableData.findIndex(coordinator => coordinator._id === id);
      if (coordinatorIndex !== -1) {
        this.tableData[coordinatorIndex].isVerified = true;
      }
      this.dataSource.data = [...this.tableData];
      this.cdr.detectChanges();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error verifying coordinator:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onBlockClicked(id: string): void {
  //console.log("block clicked", id);

  this.adminService.blockCoordinator(id).subscribe({
    next: (response) => {
      //console.log("Coordinator blocked successfully", response);
      sessionStorage.removeItem('COORINATOR');
      sessionStorage.removeItem('auth_token');
        const coordinatorIndex = this.tableData.findIndex(coordinator => coordinator._id === id);
        if (coordinatorIndex !== -1) {
          this.tableData[coordinatorIndex].isBlocked = true;
        }
        this.dataSource.data = [...this.tableData];
        this.cdr.detectChanges();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error blocking coordinator:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onUnblockClicked(id: string): void {
  //console.log("unblock clicked", id);

  this.adminService.unblockCoordinator(id).subscribe({
    next: (response) => {
      const coordinatorIndex = this.tableData.findIndex(coordinator => coordinator._id === id);
      if (coordinatorIndex !== -1) {
        this.tableData[coordinatorIndex].isBlocked = false;
      }
      this.dataSource.data = [...this.tableData];
      this.cdr.detectChanges();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error unblocking coordinator:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onDeleteClicked(id: string): void {
  //console.log("delete clicked", id);

  this.adminService.deleteCoordinator(id).subscribe({
    next: (response) => {
      //console.log("Coordinator deleted successfully", response);
      this.fetchCoordinatorData();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error deleting coordinator:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}
}
