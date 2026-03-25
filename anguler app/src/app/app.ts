import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupersetComponent } from './superset-component';

interface Dashboard {
  id: string;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SupersetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'anguler-app';

  dashboards: Dashboard[] = [
    { id: '6ce53370-9d60-439f-a337-0459416a4832', title: 'Main Dashboard', icon: '📊' },
    { id: '6ce53370-9d60-439f-a337-0459416a4832', title: 'Sales Performance', icon: '📈' },
    { id: '6ce53370-9d60-439f-a337-0459416a4832', title: 'Executive Overview', icon: '💼' },
    { id: '6ce53370-9d60-439f-a337-0459416a4832', title: 'System Health', icon: '⚙️' }
  ];

  selectedDashboard: Dashboard | null = this.dashboards[0];

  selectDashboard(dashboard: Dashboard) {
    this.selectedDashboard = dashboard;
  }
}
