import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutor } from '../../../interfaces/tutor';
import { TutorData } from '../../../interfaces/tutorFormData';

@Component({
    selector: 'app-admin-add-tutor',
    templateUrl: './admin-add-tutor.component.html',
    styleUrl: './admin-add-tutor.component.css',
    standalone: false
})
export class AdminAddTutorComponent {
  tutorForm!: FormGroup;
  selectedFile: File | null = null;
  tutorId: string | null = null;
  title:string='Enter Tutor Information';
  button:string='Add Tutor';
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
    this.validateForm();
    this.route.paramMap.subscribe(params => {      
      this.tutorId = params.get('id');
      //console.log(params.get('id'));
      
      if (this.tutorId) {
        this.loadTutorData(this.tutorId);
      }
    });
  }

  validateForm(){
    this.tutorForm = this.fb.group({
      tutorName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      education: [''],
      password: ['', Validators.required],
    });
  }

  loadTutorData(id: string): void {
    this.adminService.getTutor(id).subscribe({
      next: (response) => {
        this.title = "Edit Tutor Information";
        this.button = "Update Tutor";
        //console.log(response);
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      }
    });
  }
  populateForm(data: TutorData): void {
    this.tutorForm.patchValue({
      tutorName: data.username,
      phone: data.phone,
      password: '***********', 
      education: data.education, 
      email: data.email
    });
    this.imagePreview = data.photoUrl;
  }

  onSubmit() {
    if (this.tutorForm.valid) {
      this.formData.append('tutorName', this.tutorForm.value.tutorName);
      this.formData.append('phone', this.tutorForm.value.phone);
      this.formData.append('password', this.tutorForm.value.password);
      this.formData.append('email', this.tutorForm.value.email);
      this.formData.append('education', this.tutorForm.value.education);
      if (this.selectedFile) {
        this.formData.append('image', this.selectedFile, this.selectedFile.name);
      }
      if (this.tutorId) {        
        this.adminService.updateTutor(this.tutorId, this.formData).subscribe({
          next: (response) => {
            //console.log('Tutor updated successfully', response);
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate(['/admin/tutors']);
          },
          error: (error) => {
            console.error('Error updating tutor:', error);
          }
        });
      }else{
        this.adminService.addTutor(this.tutorForm.value).subscribe({
          next: (response) => {
            //console.log('Tutor added successfully', response);
            this.toast.showSuccess(response.message, 'Success');
            this.router.navigate(['/admin/tutors']);
          },
          error: (error) => {
            console.error(error.response, error);
            this.toast.showError(error.response, 'Error');
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
      this.tutorForm.patchValue({ image: file });
      this.tutorForm.get('image')?.updateValueAndValidity();
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    
  }
}
