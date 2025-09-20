import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { ToastService } from '../../../services/toastService/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CoordinatorData } from '../../../interfaces/table/coordinatorFromData';

@Component({
    selector: 'app-admin-add-coordinator',
    templateUrl: './admin-add-coordinator.component.html',
    styleUrl: './admin-add-coordinator.component.css',
    standalone: false
})
export class AdminAddCoordinatorComponent {
  coordinatorForm!: FormGroup;
  selectedFile: File | null = null;
  coordinatorId: string | null = null;
  title:string='Enter Tutor Information';
  button:string='Add Coordinator'

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private route: ActivatedRoute,
    private toast: ToastService,
    private router: Router
  ) {}
  ngOnInit() {
    this.validataForm();
    this.route.paramMap.subscribe(params => {      
      this.coordinatorId = params.get('id');
      //console.log(params.get('id'));
      
      if (this.coordinatorId) {
        this.loadCoordinatorData(this.coordinatorId);
      }
    });
  }

  validataForm(){
    this.coordinatorForm = this.fb.group({
      coordinatorName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      description: [''],
      password: ['', Validators.required],
    });
  }
  loadCoordinatorData(id: string): void {
    this.adminService.getCoordinator(id).subscribe({
      next: (response) => {
        this.title = "Edit Coorinator Information";
        this.button = "Update Coorinator";
        //console.log(response);
        this.populateForm(response.data);
      },
      error: (error) => {
        console.error('Error fetching student data:', error);
      }
    });
  }
  populateForm(data: CoordinatorData): void {
    this.coordinatorForm.patchValue({
      coordinatorName: data.username,
      phone: data.phone,
      password: '***********', 
      email: data.email
    });
  }

  onSubmit() {
    if (this.coordinatorForm.valid) {
      //console.log(this.coordinatorForm.value);
      
      this.adminService.addCoordinator(this.coordinatorForm.value).subscribe({
        next: (response) => {
          //console.log('Coordinator added successfully', response);
          this.toast.showSuccess(response.message, 'Success');
          this.router.navigate(['/admin/coordinators']);
        },
        error: (error) => {
          console.error(error.response, error);
          this.toast.showError(error.response, 'Error');
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    // Handle file upload logic
  }
}


