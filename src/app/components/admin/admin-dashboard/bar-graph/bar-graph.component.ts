import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
 
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AdminServiceService } from '../../../../services/adminService/admin-service.service';
import { DataPoint } from '../../../../interfaces/dataPoint';

@Component({
    selector: 'app-bar-graph',
    imports: [CommonModule, CanvasJSAngularChartsModule],
    templateUrl: './bar-graph.component.html',
	standalone:true,
    styleUrl: './bar-graph.component.css'
})
export class BarGraphComponent implements OnInit, AfterViewInit {

	dataPoint:DataPoint;
	chartOption:any;


	constructor(private adminService:AdminServiceService){}

	ngOnInit(): void {
		this.fetchData()
	}

	fetchData(){
		this.adminService.getBarGraphData().subscribe({
		  next: (response) => {
			console.log("Bardata",response.data);
			this.dataPoint = response.data
			this.chartOption = this.getChartOptions()
			
		  },
		  error: (error) => {
			console.error('Error fetching dashboard data:', error);
		  }
		});
	  }

ngAfterViewInit(): void {
	this.chartOption={
		title: {
			text: "Completed classes in last 10 days"
		},
		animationEnabled: true,
		axisY: {
			includeZero: true
		},
		data: [{
			type: "column", //change type to bar, line, area, pie, etc
			//indexLabel: "{y}", //Shows y value on all Data Points
			indexLabelFontColor: "#5A5757",
			dataPoints: []
		}]
   }
}

getChartOptions() {
	return {
		title: {
			text: "Completed classes in last 10 days"
		},
		animationEnabled: true,
		axisY: {
			includeZero: true
		},
		data: [{
			type: "column", //change type to bar, line, area, pie, etc
			//indexLabel: "{y}", //Shows y value on all Data Points
			indexLabelFontColor: "#5A5757",
			dataPoints: this.dataPoint
		}]
	};
  }

   
}



	

