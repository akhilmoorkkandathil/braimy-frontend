import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { CourseData } from '../../../interfaces/courseForm';


@Component({
    selector: 'app-admin-add-course',
    templateUrl: './admin-add-course.component.html',
    styleUrl: './admin-add-course.component.css',
    standalone: false
})
export class AdminAddCourseComponent {
  courseForm!: FormGroup;
  selectedFile: File | null = null;
  courseId: string | null = null;
  title:string='Enter Course Information';
  button:string='Add Coure';
  imagePreview!: string;
  formData: FormData = new FormData();


  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.validateForm()
    this.route.paramMap.subscribe(params => {      
      this.courseId = params.get('id');
      //console.log(params.get('id'));
      
      if (this.courseId) {
        this.loadCourseData(this.courseId);
      }
    });
  }
  
  validateForm(){
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      class: ['', Validators.required],
      subject: ['', Validators.required],
      description: [''],
      topic: ['', Validators.required],
      image: ['',Validators.required]
    });
  }

  loadCourseData(id: string): void {
    this.adminService.getCourse(id).subscribe({
      next: (response) => {
        this.title = "Edit Course Information";
        this.button = "Update Course";
        //console.log(response);
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      }
    });
  }
  populateForm(data: CourseData): void {
    this.courseForm.patchValue({
      courseName: data.courseName,
      subject: data.subject,
      class: data.class, 
      topic: data.topic, 
      description: data.description,
      imageUrl: [null, Validators.required]

    });
    this.imagePreview = data.imageUrl;
  }
  onSubmit() {
    if (this.courseForm.valid) {
      // Append form fields to FormData
      this.formData.append('courseName', this.courseForm.value.courseName);
      this.formData.append('class', this.courseForm.value.class);
      this.formData.append('subject', this.courseForm.value.subject);
      this.formData.append('description', this.courseForm.value.description);
      this.formData.append('topic', this.courseForm.value.topic);
  
      // Check if there is a file to append
      if (this.selectedFile) {
        this.formData.append('image', this.selectedFile, this.selectedFile.name);
      }
  
      if (this.courseId) {
        this.adminService.updateCourse(this.courseId, this.formData).subscribe({
          next: (response) => {
            //console.log('Course updated successfully', response);
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate(['/admin/courses']);
          },
          error: (error) => {
            console.error('Error updating course:', error);
          }
        });
      } else {
        this.adminService.addCourse(this.formData).subscribe({
          next: (response) => {
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate(['/admin/courses']);
          },
          error: (error) => {
            console.error('Error adding course:', error);
            this.toast.showError('Error adding course', 'Error');
          }
        });
      }
    }
  }
  

  onImagePick(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;

    if (file) {
      this.selectedFile = file;
      this.courseForm.patchValue({ image: file });
      this.courseForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    
  }
}
