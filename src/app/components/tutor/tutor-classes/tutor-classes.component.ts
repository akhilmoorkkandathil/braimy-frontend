import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { User } from '../../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { courseBucket } from '../../../interfaces/courseBucket';

@Component({
    selector: 'app-tutor-classes',
    templateUrl: './tutor-classes.component.html',
    styleUrl: './tutor-classes.component.css',
    standalone: false
})
export class TutorClassesComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'index', header: 'Serial No.', cell: (element: courseBucket) => `${element.index}` },
    { columnDef: 'name', header: 'Name', cell: (element: courseBucket) => `${element.userId.username}` },
    { columnDef: 'phone', header: 'Phone', cell: (element: courseBucket) => `${element.userId.phone}` },
    { columnDef: 'course', header: 'Course', cell: (element: courseBucket) => `${element.courseId.courseName}` },
    { columnDef: 'preferredTime', header: 'Preferred Time', cell: (element: courseBucket) => `${element.preferredTime}` },
    { columnDef: 'classDuration', header: 'Class Duration', cell: (element: courseBucket) => `${element.classDuration}` },
];

dataSource = new MatTableDataSource<courseBucket>();
  tableData: Array<courseBucket> = [];

  constructor(
    private tutorService: TutorService, 
    private cdr: ChangeDetectorRef,
    private router:Router, 
    private toast: ToastService,
  ) { }


  ngOnInit(): void {
    this.fetchTutorClasses();
  }

  fetchTutorClasses(): void {
    this.tutorService.getTutorClasses().subscribe({
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

  actions: string[] = ['completed'];

  

  onActionClicked(event: any) {
    switch (event.action) {
      case 'completed':
        this.onCompleteClicked(event.element);
        break;
      default:
        //console.log('Unknown action:', event.action);
    }
  }

  onCompleteClicked(data:courseBucket): void {
    const dataToSend = {
      ...data, // Spread the existing data
      dateMarked: new Date() // Add the current date
  };
    
    this.tutorService.markCompleted(dataToSend).subscribe({
      next: (response) => {
        const classToUpdate = this.tableData.find(item => item._id === data._id);
            if (classToUpdate) {
                classToUpdate.status = 'Completed'; // Change status to Completed
            }

        this.toast.showSuccess(response.message, 'Success');
      },
      error: (error) => {
        console.error('Error deleting tutor:', error);
        this.toast.showError(error.message, 'Error');
      }
    });
  }
}
