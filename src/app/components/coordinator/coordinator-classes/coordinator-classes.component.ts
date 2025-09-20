import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../interfaces/user';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { ClassData } from '../../../interfaces/table/classTableData';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { CompletedClass } from '../../../interfaces/completedCassResponse';
import { courseBucket } from '../../../interfaces/courseBucket';

@Component({
    selector: 'app-coordinator-classes',
    templateUrl: './coordinator-classes.component.html',
    styleUrl: './coordinator-classes.component.css',
    standalone: false
})
export class CoordinatorClassesComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'index', header: 'Serial No.', cell: (element: CompletedClass) => `${element.index}` }, // Assuming index is available
    { columnDef: 'date', header: 'Date', cell: (element: CompletedClass) => `${new Date(element.date).toLocaleDateString()}` }, // Format date
    { columnDef: 'studentName', header: 'Student Name', cell: (element: CompletedClass) => `${element.studentId.username}` }, // Accessing username from studentId
    { columnDef: 'courseName', header: 'Course Name', cell: (element: CompletedClass) => `${element.courseId.courseName}` }, // Accessing courseName from courseId
    { columnDef: 'duration', header: 'Duration', cell: (element: CompletedClass) => `${element.duration}` }, // Accessing duration directly
    { columnDef: 'status', header: 'Status', cell: (element: CompletedClass) => `${element.status}` } // Accessing status directly
];



dataSource = new MatTableDataSource<courseBucket>();
  tableData: Array<courseBucket> = [];

  constructor(
    private tutorService: TutorService, 
    private cdr: ChangeDetectorRef,
    private router:Router, 
    private toast: ToastService,
    private adminService:AdminServiceService
  ) { }


  ngOnInit(): void {
    this.completedClass();
  }

  completedClass(): void {
    this.tutorService.getAllCoordinatorCompletedClass().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        console.log(this.tableData);
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });
  }

actions: string[] = ['approve','notification'];

onActionClicked(event: { action: string, element: any }): void {
  switch (event.action) {
    case 'approve':
      this.onApproveClicked(event.element._id);
      break;
      case 'notification':
        this.onNotificationClicked(event.element._id);
        break;
    default:
      //console.log('Unknown action:', event.action);
  }
}
  
  
  
onApproveClicked(id: string): void {
  this.adminService.approveClass(id).subscribe({
    next: (response) => {
      const classToUpdate = this.tableData.find(item => item._id === id);
      if (classToUpdate) {
        classToUpdate.status = 'Approved'; // Change status to 'Approved'
      }      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      this.toast.showError(error.message, 'Error');
    }
  });
}

onNotificationClicked(id: string): void {
  //console.log("Cliked to send notification");
  
  // this.adminService.sendNotification(id).subscribe({
  //   next: (response) => {
  //     //console.log("Student blocked successfully", response);
  //   },
  //   error: (error) => {
  //     this.toast.showError(error.message, 'Error');
  //   }
  // });
}
  
}
