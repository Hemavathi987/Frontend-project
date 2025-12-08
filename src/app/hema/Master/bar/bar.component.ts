import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { MasterLeave } from '../../Service/leave';
import { Leave } from '../../Model/Model';
import { Chart } from 'chart.js/auto';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChartModule],
  providers: [NgxSpinnerService, MessageService],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.scss'
})
export class BarComponent implements OnInit {

  dtleave: Leave[] = [];
  data: any;       // MUST be declared
  options: any;

  constructor(private leaveservice: MasterLeave) { }

  ngOnInit(): void {
    this.getLeave();
    this.loadLeaveGraph();
  }

  getLeave() {
    this.leaveservice.getallleave().subscribe((res: any) => {
      console.log(res);

      const leaves: Leave[] = res.Data;  // FIX: use res.Data

      const pending = leaves.filter(x => (x.Status ?? "").toLowerCase() === "pending").length;
      const approved = leaves.filter(x => (x.Status ?? "").toLowerCase() === "approved").length;
      const rejected = leaves.filter(x => (x.Status ?? "").toLowerCase() === "rejected").length;

      new Chart("leaveChart", {
        type: 'bar',
        data: {
          labels: ['Pending', 'Approved', 'Rejected'],
          datasets: [{
            label: 'Leave Count',
            data: [pending, approved, rejected],
            backgroundColor: ['orange', 'green', 'red']
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }


  loadLeaveGraph() {
    this.leaveservice.getallleave().subscribe((res: any) => {
      const leaves = res.Data;
      // Group leaves by date
      const grouped: any = {};

      leaves.forEach((x: any) => {
        const date = x.FromDate.split("T")[0]; // yyyy-mm-dd

        if (!grouped[date]) {
          grouped[date] = { Approved: 0, Rejected: 0, Pending: 0 };
        }

        if (x.Status === "Approved") grouped[date].Approved++;
        if (x.Status === "Rejected") grouped[date].Rejected++;
        if (x.Status === "Pending") grouped[date].Pending++;
      });

      // Sort dates
      const dates = Object.keys(grouped).sort();
      // Prepare dataset values
      const approved = dates.map(d => grouped[d].Approved);
      const rejected = dates.map(d => grouped[d].Rejected);
      const pending = dates.map(d => grouped[d].Pending);
      // Build chart
      this.data = {
        labels: dates,
        datasets: [
          {
            label: 'Approved',
            data: approved,
              borderColor: '#0D47A1', 
            fill: false,
            tension: 0.4
          },
          {
            label: 'Rejected',
            data: rejected,
           borderColor: '#B71C1C', 
            fill: false,
            tension: 0.4
          },
          {
            label: 'Pending',
            data: pending,
             borderColor: '#F9A825',
            fill: false,
            tension: 0.4
          }
        ]
      };

      this.options = {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#000' }
          }
        },
        scales: {
          x: { ticks: { color: '#000' } },
          y: { ticks: { color: '#000', beginAtZero: true } }
        }
      };

    });
  }

}
