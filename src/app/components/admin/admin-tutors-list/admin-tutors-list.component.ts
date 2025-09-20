import { ChangeDetectorRef, Component } from '@angular/core';
import { userColumn } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../interfaces/user';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router } from '@angular/router';
import { TutorData } from '../../../interfaces/table/tutorsTableData';


@Component({
    selector: 'app-admin-tutors-list',
    templateUrl: './admin-tutors-list.component.html',
    styleUrl: './admin-tutors-list.component.css',
    standalone: false
})
export class AdminTutorsListComponent {
  tableColumns: Array<userColumn> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, TutorData>) => `${element['index']}` },
    { columnDef: 'name', header: 'Name', cell: (element: Record<string, TutorData>) => `${element['username']}` },
    { columnDef: 'phone', header: 'Phone', cell: (element: Record<string, TutorData>) => `${element['phone']}` },
    { columnDef: 'email', header: 'Email', cell: (element: Record<string, TutorData>) => `${element['email']}` },
    { columnDef: 'education', header: 'Education', cell: (element: Record<string, TutorData>) => `${element['education']}` },
    { columnDef: 'isVerified', header: 'Verification Status', cell: (element: Record<string, TutorData>) => `${element['isVerified'] ? 'Verified' : 'Not Verified'}` },
    { columnDef: 'isBlocked', header: 'Block Status', cell: (element: Record<string, TutorData>) => `${element['isBlocked'] ? 'Blocked' : 'Active'}` },
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
    this.fetchUserData();
  }
  fetchUserData(): void {
    this.adminService.getTutorsList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); // Trigger change detection
        //console.log(this.tableData);
      },
      error: (error) => {
        console.error('Error fetching users data:', error);
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


onEditClicked(id:string): void {
  this.router.navigate([`/admin/addTutor/${id}`]);
}

onVerifyClicked(id: string): void {
  //console.log("verify clicked", id);

  this.adminService.verifyTutor(id).subscribe({
    next: (response) => {
      //console.log("Tutor verified successfully", response);
      const tutorIndex = this.tableData.findIndex(tutor => tutor._id === id);
      if (tutorIndex !== -1) {
        this.tableData[tutorIndex].isVerified = true; 
      }
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error verifying tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onBlockClicked(id: string): void {
  //console.log("block clicked", id);

  this.adminService.blockTutor(id).subscribe({
    next: (response) => {
      //console.log("Tutor blocked successfully", response);
      const tutorIndex = this.tableData.findIndex(tutor => tutor._id === id);
      if (tutorIndex !== -1) {
        this.tableData[tutorIndex].isBlocked = true; 
      }
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error blocking tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}
onUnblockClicked(id: string): void {
  //console.log("block clicked", id);

  this.adminService.unblockTutor(id).subscribe({
    next: (response) => {
      //console.log("Tutor blocked successfully", response);
      const tutorIndex = this.tableData.findIndex(tutor => tutor._id === id);
      if (tutorIndex !== -1) {
        this.tableData[tutorIndex].isBlocked = false; // Assuming you have an isBlocked property
      }
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error blocking tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}

onDeleteClicked(id: string): void {
  this.adminService.deleteTutor(id).subscribe({
    next: (response) => {
      this.fetchUserData();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error deleting tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}
  
}
