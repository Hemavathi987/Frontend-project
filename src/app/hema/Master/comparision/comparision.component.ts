import { Component, OnInit } from '@angular/core';
import { MasterLeave } from '../../Service/leave';
import { MasterGatePass } from '../../Service/gatepass';
import { ChartModule } from "primeng/chart";
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-comparision',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './comparision.component.html',
  styleUrl: './comparision.component.scss'
})
export class ComparisionComponent implements OnInit {

  data: any;
  options: any;

  constructor(
    private leaveservice: MasterLeave,
    private MasterGatePass: MasterGatePass
  ) {}

 ngOnInit() {
  this.loadGraph();
}

loadGraph() {
  forkJoin({
    gatepass: this.MasterGatePass.allgateall(),
    leaves: this.leaveservice.getallleave()
  }).subscribe((res: any) => {
    const gateData = res.gatepass.Data;
    const leaveData = res.leaves.Data;

    // --- Count GatePass status ---
    const gateCounts = { Pending: 0, Approved: 0, Rejected: 0 };
    gateData.forEach((x: any) => {
      if (x.Status === "Pending") gateCounts.Pending++;
      if (x.Status === "Aprroved") gateCounts.Approved++;
      if (x.Status === "Reject") gateCounts.Rejected++;
    });

    // --- Count Leave status ---
    const leaveCounts = { Pending: 0, Approved: 0, Rejected: 0 };
    leaveData.forEach((x: any) => {
      if (x.Status === "Pending") leaveCounts.Pending++;
      if (x.Status === "Approved") leaveCounts.Approved++;
      if (x.Status === "Rejected") leaveCounts.Rejected++;
    });

    // --- Chart DATA ---
    this.data = {
      labels: ["Pending", "Approved", "Rejected"],
      datasets: [
        {
          label: "GatePass",
          data: [
            gateCounts.Pending,
            gateCounts.Approved,
            gateCounts.Rejected
          ],
          backgroundColor: "#1B5E20" 
        },
        {
          label: "Leave",
          data: [
            leaveCounts.Pending,
            leaveCounts.Approved,
            leaveCounts.Rejected
          ],
            backgroundColor: "#0D47A1" 
        }
      ]
    };

    // --- Chart OPTIONS ---
    this.options = {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#000" }
        }
      },
      scales: {
        x: { ticks: { color: "#000" } },
        y: { ticks: { color: "#000" }, beginAtZero: true }
      }
    };
  });
}
}
