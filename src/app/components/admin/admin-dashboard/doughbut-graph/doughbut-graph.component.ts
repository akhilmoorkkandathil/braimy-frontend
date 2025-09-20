import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { UserServiceService } from '../../../../services/userServices/user-service.service';
import { courseBucket } from '../../../../interfaces/courseBucket';

@Component({
    selector: 'app-doughbut-graph',
    imports: [CommonModule, CanvasJSAngularChartsModule],
    standalone:true,
    templateUrl: './doughbut-graph.component.html',
    styleUrl: './doughbut-graph.component.css'
})
export class DoughbutGraphComponent implements AfterViewInit {
  dataPoints: { y: number; name: string }[] = [];
  chartOptions:any
  constructor(private userService: UserServiceService) {}
  ngAfterViewInit(): void {
    this.chartOptions = {
      animationEnabled: true,
      title:{
      text: "Project Cost Breakdown"
      },
      data: [{
      type: "doughnut",
      yValueFormatString: "#,###.##'%'",
      indexLabel: "{name}",
      dataPoints: this.dataPoints
      }]
    }	
  }

  ngOnInit(): void {
    this.fetchUserCourses();
  }

  fetchUserCourses(): void {
    this.userService.fetchAllBucketCourses().subscribe({
        next: (response) => {
            console.log("Response", response.data);
            this.calculateCoursePercentages(response.data); // Calculate percentages based on fetched courses
            this.chartOptions = this.getChartOptions(); // Set chart options after data is processed
        },
        error: (error) => {
            console.error('Error fetching user courses:', error);
        }
    });
}

  calculateCoursePercentages(courses: courseBucket[]): void {
    const courseCount = courses.length;

    // Create a map to count occurrences of each course
    const courseMap: { [key: string]: number } = {};
    courses.forEach(course => {
      courseMap[course.courseId.courseName] = (courseMap[course.courseId.courseName] || 0) + 1;
    });

    // Prepare data points for the doughnut chart
    this.dataPoints = Object.entries(courseMap).map(([name, count]) => {
      const percentage = Math.floor((count / courseCount) * 100)
      return {
        y: percentage, // Calculate percentage
        name: name
      };
    });
    console.log("DAta point",this.dataPoints);
    
  }
getChartOptions() {
  return {
      animationEnabled: true, // Enable animations for the chart
      title: {
          text: "Course purchase ratio" // Title of the chart
      },
      data: [{
          type: "doughnut", // Specify the type of chart
          yValueFormatString: "#,###.##'%'", // Format for the y-axis values
          indexLabel: "{name}", // Label for each segment
          dataPoints: this.dataPoints // Use the dataPoints array populated with course percentages
      }]
  };
}
}
