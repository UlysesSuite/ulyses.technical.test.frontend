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
  //Tiempo buildGrid: 10.2939453125 ms Tiempo buildGrid: 10.671142578125 ms Tiempo buildGrid: 9.4140625 ms pero hay algo de delay en el template, pd: si , es el template
  private buildGrid(servers: Server[], metrics: Metric[]): GridData {
    //es un acumulador , deberia de ser reduce
    console.time('Tiempo buildGrid');
    const grouped = metrics.reduce<Record<string, Metric[]>>((acc, metric) => {
      (acc[metric.serverId] ??= []).push(metric);
      return acc;
    }, {});
    let aux;
    aux = servers.reduce<GridData>((acc, server) => {
      acc[server.id] = (grouped[server.id] ?? []).sort(
        //el parseo puede ser cuello de botella
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      return acc;
    }, {});
    console.timeEnd('Tiempo buildGrid');
    return aux
  }

    //va un poco peor y es feo con ganas el metodo por que creo que hay menos delay en el template, me da la sensacion de que es mas fluido no se por que
    //Tiempo buildGrid: 10.328125 ms
    //TMC for sure

    /*
  private buildGrid(servers: Server[], metrics: Metric[]): GridData {
    console.time('Tiempo buildGrid');
    const grouped = new Map<string, Metric[]>();
  
    // Agrupamos con map (más eficiente que un objeto para inserciones frecuentes)
    for (const metric of metrics) {
      if (!grouped.has(metric.serverId)) {
        grouped.set(metric.serverId, []);
      }
      grouped.get(metric.serverId)!.push(metric);
    }
  
    const grid: GridData = {};
  
    // Procesar cada servidor
    for (const server of servers) {
      const serverMetrics = grouped.get(server.id);
  
      if (!serverMetrics) {
        grid[server.id] = [];
        continue;
      }
  
      //Cachear el timestamp numérico antes de ordenar
      // evita el newDate pero meh
      const withTime = serverMetrics.map(m => ({
        metric: m,
        time: typeof m.timestamp === 'number' ? m.timestamp : new Date(m.timestamp).getTime()
      }));
  
      withTime.sort((a, b) => a.time - b.time);

      grid[server.id] = withTime.map(item => item.metric);
    }
    console.timeEnd('Tiempo buildGrid');
    return grid;
  }*/
}