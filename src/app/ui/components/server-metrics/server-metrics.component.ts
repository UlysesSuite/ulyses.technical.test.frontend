import {
  Component,
  inject,
  signal,
  computed,
  DestroyRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Subject, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { MetricsService } from '../../../data/domain/metric/services/metrics.service';
import { Server } from '../../../data/domain/server/models/server.model';
import { Metric } from '../../../data/domain/metric/models/metric.model';

@Component({
  selector: 'app-server-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './server-metrics.component.html',
  styleUrl: './server-metrics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerMetricsComponent {

  //TMC??
  private readonly metricsService = inject(MetricsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _servers = toSignal(this.metricsService.getServers());
  readonly servers = computed<Server[]>(() => this._servers() ?? []);

  readonly selectedServerId = signal<string>('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly serverMetrics = signal<Metric[]>([]);

  private readonly serverSelect$ = new Subject<string>();

  readonly avgCpu = computed(() => this.average(this.serverMetrics(), 'cpuUsage'));
  readonly avgRam = computed(() => this.average(this.serverMetrics(), 'ramUsage'));
  readonly recentMetrics = computed(() => this.serverMetrics().slice(0, 10));

  //façade?
  //.2 seh , deberia, prueba en template , borra coments
  constructor() {
    this.serverSelect$
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
          this.serverMetrics.set([]);
        }),
        switchMap((id: string) =>
          this.metricsService.getMetricsByServer(id).pipe(
            catchError((err: unknown) => {
              this.error.set('Error al cargar métricas. Intenta de nuevo.');
              this.loading.set(false);
              console.error('[ServerMetrics] fetch error:', err);
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((metrics: Metric[]) => {
        this.serverMetrics.set(metrics);
        this.loading.set(false);
      });
  }

  onServerChange(): void {
    const id = this.selectedServerId();
    if (!id) return;
    this.serverSelect$.next(id);
  }

  private average(metrics: Metric[], key: 'cpuUsage' | 'ramUsage'): number {
    if (!metrics.length) return 0;
    const sum = metrics.reduce((acc, m) => acc + m[key], 0);
    return Math.round((sum / metrics.length) * 10) / 10;
  }
}