import { ChangeDetectorRef, Component } from '@angular/core';
import { Column } from '../../../interfaces/table/table';
import { MatTableDataSource } from '@angular/material/table';
import { Course } from '../../../interfaces/course';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { Router, } from '@angular/router';
import { CourseData } from '../../../interfaces/table/courseTableData';

@Component({
    selector: 'app-admin-course-list',
    templateUrl: './admin-course-list.component.html',
    styleUrl: './admin-course-list.component.css',
    standalone: false
})
export class AdminCourseListComponent {
  tableColumns: Array<Column> = [
    { columnDef: 'position', header: 'Serial No.', cell: (element: Record<string, CourseData>) => `${element['index']}` },
    { columnDef: 'courseName', header: 'Course Name', cell: (element: Record<string, CourseData>) => `${element['courseName']}` },
    { columnDef: 'class', header: 'Class', cell: (element: Record<string, CourseData>) => `${element['class']}` },
    { columnDef: 'subject', header: 'Subject', cell: (element: Record<string, CourseData>) => `${element['subject']}` },
    { columnDef: 'topic', header: 'Topic', cell: (element: Record<string, CourseData>) => `${element['topic']}` }
  ];

  dataSource = new MatTableDataSource<Course>();
  tableData: Array<Course> = [];

  constructor(
    private adminService: AdminServiceService,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchCourseData();
  }

  fetchCourseData(): void {
    this.adminService.getCouresList().subscribe({
      next: (response) => {
        this.tableData = response.data.map((item, index) => ({ ...item, index: index + 1 }));
        this.dataSource.data = this.tableData;
        this.cdr.detectChanges(); 
        //console.log(this.tableData);
      },
      error: (error) => {
        console.error('Error fetching course data:', error);
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
  this.router.navigate([`/admin/addCourse/${id}`]);
}


onDeleteClicked(id:string): void {
  this.adminService.deleteCourse(id).subscribe({
    next: (response) => {
      this.fetchCourseData();
      this.toast.showSuccess(response.message, 'Success');
    },
    error: (error) => {
      console.error('Error deleting tutor:', error);
      this.toast.showError(error.message, 'Error');
    }
  });
}
}
