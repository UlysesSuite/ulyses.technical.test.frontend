import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Metric } from '../models/metric.model';
import { Server } from '../../server/models/server.model';

@Injectable({ providedIn: 'root' })
export class MetricsService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000';

  private serversCache$: Observable<Server[]> | null = null;
  private readonly metricsCache = new Map<string, Observable<Metric[]>>();
  private allMetricsCache$: Observable<Metric[]> | null = null;


  /*valida bien el shareReplay que no lo usas de hace la virgen
  ¿startsWith posible por latencia / suspense?
  */
  getServers(): Observable<Server[]> {
    if (!this.serversCache$) {
      this.serversCache$ = this.http
        .get<Server[]>(`${this.BASE_URL}/servers`)
        .pipe(shareReplay(1));
    }
    return this.serversCache$;
  }

  getMetricsByServer(serverId: string): Observable<Metric[]> {
    if (!this.metricsCache.has(serverId)) {
      const metrics$ = this.http
        .get<Metric[]>(`${this.BASE_URL}/metrics?serverId=${serverId}`)
        .pipe(shareReplay(1));
      this.metricsCache.set(serverId, metrics$);
    }
    return this.metricsCache.get(serverId)!;
  }

  getAllMetrics(): Observable<Metric[]> {
    if (!this.allMetricsCache$) {
      this.allMetricsCache$ = this.http
        .get<Metric[]>(`${this.BASE_URL}/metrics`)
        .pipe(shareReplay(1));
    }
    return this.allMetricsCache$;
  }
 
  clearCache(): void {
    this.serversCache$ = null;
    this.allMetricsCache$ = null;
    this.metricsCache.clear();
  }

}