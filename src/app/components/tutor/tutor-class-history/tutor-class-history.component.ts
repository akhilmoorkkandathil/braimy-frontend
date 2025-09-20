import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { courseBucket } from '../../../interfaces/courseBucket';
import { User } from '../../../interfaces/user';
import { MatTableDataSource } from '@angular/material/table';
import { TutorService } from '../../../services/tutorService/tutor.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toastService/toast.service';
import { CompletedClass } from '../../../interfaces/completedCassResponse';

@Component({
    selector: 'app-tutor-class-history',
    templateUrl: './tutor-class-history.component.html',
    styleUrl: './tutor-class-history.component.css',
    standalone: false
})
export class TutorClassHistoryComponent {
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
  ) { }


  ngOnInit(): void {
    this.fetchTutorCompletedClasses();
  }

  fetchTutorCompletedClasses(): void {
    this.tutorService.getTutorCompletedClasses().subscribe({
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
