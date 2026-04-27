import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';
import { Metric } from '../../../data/domain/metric/models/metric.model';
import { MetricsService } from '../../../data/domain/metric/services/metrics.service';
//aliases pls
import { Server } from '../../../data/domain/server/models/server.model';

//TMC??
type GridData = Record<string, Metric[]>;

@Component({
  selector: 'app-server-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-heatmap.component.html',
  styleUrl: './server-heatmap.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerHeatmapComponent {
  private readonly metricsService = inject(MetricsService);

  readonly selectedCell = signal<Metric | null>(null);
  readonly loading = signal(true);

  //façade?
  //muy sencillo , cohesion?
  private readonly data = toSignal(
    forkJoin({
      servers: this.metricsService.getServers(),
      metrics: this.metricsService.getAllMetrics(),
    }).pipe(
      map(({ servers, metrics }) => {
        this.loading.set(false);
        return {
          servers,
          gridData: this.buildGrid(servers, metrics),
        };
      })
    ),
    { initialValue: { servers: [] as Server[], gridData: {} as GridData } }
  );

  readonly servers = computed(() => this.data().servers);
  readonly gridData = computed(() => this.data().gridData);

  onCellClick(metric: Metric): void {
    this.selectedCell.set(metric);
  }

  closeModal(): void {
    this.selectedCell.set(null);
  }

  //Def TMC - legibilidad
  //quiza sea mejor alargarlo para ver que parte es la que tiene el cuello de botella
  private buildGrid(servers: Server[], metrics: Metric[]): GridData {
    //es un acumulador , deberia de ser reduce
    const grouped = metrics.reduce<Record<string, Metric[]>>((acc, metric) => {
      (acc[metric.serverId] ??= []).push(metric);
      return acc;
    }, {});

    return servers.reduce<GridData>((acc, server) => {
      acc[server.id] = (grouped[server.id] ?? []).sort(
        //el parseo puede ser cuello de botella
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return acc;
    }, {});
  }
}