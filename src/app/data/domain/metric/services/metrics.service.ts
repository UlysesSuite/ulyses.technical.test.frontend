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


  /*valida bien el shareReplay que no lo usas de hace la virgen
  ¿startsWith posible por latencia / suspense?
  */
  getServers(): Observable<Server[]> {
    if (!this.serversCache$) {
      this.serversCache$ = this.http
        .get<Server[]>(`${this.BASE_URL}/servers`)
        .pipe(/*shareReplay(1)*/);
    }
    return this.serversCache$;
  }

}