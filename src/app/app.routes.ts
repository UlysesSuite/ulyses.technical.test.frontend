import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './ui/components/shell-layout/shell-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      { path: '', redirectTo: 'heatmap', pathMatch: 'full' },
      { 
        path: 'heatmap', 
        loadComponent: () => import('./ui/components/server-heatmap/server-heatmap.component').then(m => m.ServerHeatmapComponent) 
      },
      { 
        path: 'auto-scaling', 
        loadComponent: () => import('./ui/components/auto-scaling-form/auto-scaling-form.component').then(m => m.AutoScalingFormComponent) 
      },
      { 
        path: 'server-metrics', 
        loadComponent: () => import('./ui/components/server-metrics/server-metrics.component').then(m => m.ServerMetricsComponent) 
      }
    ]
  }
];
