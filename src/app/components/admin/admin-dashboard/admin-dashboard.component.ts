import { Component, Input, OnInit } from '@angular/core';
import { AdminServiceService } from '../../../services/adminService/admin-service.service';
import { DoughbutGraphComponent } from './doughbut-graph/doughbut-graph.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-admin-dashboard',
    imports: [DoughbutGraphComponent, BarGraphComponent],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css',
    animations: [
        trigger('countAnimation', [
            state('initial', style({ transform: 'scale(1)' })),
            state('animated', style({ transform: 'scale(1.2)' })),
            transition('initial <=> animated', animate('300ms ease-in-out'))
        ])
    ]
})
export class AdminDashboardComponent implements OnInit {

  studentCount:Number;
  tutorCount:Number;
  totalRevenue:Number;

  constructor(private adminService: AdminServiceService){}
  ngOnInit(): void {
    this.fetchData()
  }
  
  fetchData(){
    this.adminService.getDashBoardData().subscribe({
      next: (response) => {
        console.log(response.data);
        this.studentCount = response.data.students;
        this.tutorCount = response.data.tutors;
        this.totalRevenue = response.data.totalRevenue;
       
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });
  }


  animationStates = {
    students: 'initial',
    tutors: 'initial',
    classes: 'initial'
  };

  animateCount(box: 'students' | 'tutors' | 'classes') {
    this.animationStates[box] = 'animated';
  }

  resetCount(box: 'students' | 'tutors' | 'classes') {
    this.animationStates[box] = 'initial';
  }
}