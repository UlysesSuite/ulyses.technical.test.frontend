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
import { Server } from '../../../data/domain/server/models/server.model';

//mapas para data? opciones?
type GridData = Record<string, Metric[]>;

@Component({
  selector: 'app-server-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-heatmap.component.html',
  styleUrl: './server-heatmap.component.scss'
})
export class ServerHeatmapComponent {
  //asegura el share replay , mira como interactua con el startsWith
  private readonly metricsService = inject(MetricsService);

  readonly selectedCell = signal<Metric | null>(null);
  readonly loading = signal(true);

  //no angular lifecicycle , A20+
  private readonly data = toSignal(
    forkJoin({
      servers: this.metricsService.getServers(),
      metrics: this.metricsService.getAllMetrics(),
    }).pipe(
      map(({ servers }) => {
        this.loading.set(false);
        return {
          servers
        };
      })
    ),
    //SATISFIES                                                sure?
    { initialValue: { servers: [] as Server[], gridData: {} as GridData } }
  );

  onCellClick(metric: Metric): void {
    this.selectedCell.set(metric);
  }

  closeModal(): void {
    this.selectedCell.set(null);
  }

}