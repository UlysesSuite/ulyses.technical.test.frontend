import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Metric } from '../../../data/domain/metric/models/metric.model';
import { Server } from '../../../data/domain/server/models/server.model';

@Component({
  selector: 'app-server-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-heatmap.component.html',
  styleUrl: './server-heatmap.component.scss'
})
export class ServerHeatmapComponent implements OnInit {
  private http = inject(HttpClient);
  
  servers: Server[] = [];
  metrics: Metric[] = [];
  gridData: { [serverId: string]: Metric[] } = {};
  selectedCell: Metric | null = null;

  ngOnInit(): void {
    this.http.get<Server[]>('http://localhost:3000/servers').subscribe(data => {
      this.servers = data;
      this.loadMetrics();
    });
  }

  loadMetrics(): void {
    this.http.get<Metric[]>('http://localhost:3000/metrics').subscribe(data => {
      this.metrics = data;
      this.mapMetricsToGrid();
    });
  }

  mapMetricsToGrid(): void {
    this.servers.forEach(server => {
      this.gridData[server.id] = this.metrics
        .filter(m => m.serverId === server.id)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
  }

  onCellClick(metric: Metric): void {
    this.selectedCell = metric;
  }

  closeModal(): void {
    this.selectedCell = null;
  }
}
