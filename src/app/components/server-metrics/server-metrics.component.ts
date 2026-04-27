import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Server } from '../../models/server.model';
import { Metric } from '../../models/metric.model';

@Component({
  selector: 'app-server-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './server-metrics.component.html',
  styleUrl: './server-metrics.component.scss'
})
export class ServerMetricsComponent implements OnInit {

  private http = inject(HttpClient);

  servers: Server[] = [];
  selectedServerId: string = '';
  serverMetrics: Metric[] = [];
  loading = false;

  ngOnInit(): void {
    this.http.get<Server[]>('http://localhost:3000/servers').subscribe(data => {
      this.servers = data;
    });
  }

  onServerChange(): void {
    if (!this.selectedServerId) return;

    this.loading = true;
    
    this.http.get<Metric[]>(`http://localhost:3000/metrics?serverId=${this.selectedServerId}`).subscribe(data => {
      this.serverMetrics = data;
      this.loading = false;
    });
  }
}
