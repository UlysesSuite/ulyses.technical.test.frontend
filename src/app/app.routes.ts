import { Routes } from '@angular/router';
import { ShellLayoutComponent } from './components/shell-layout/shell-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellLayoutComponent,
    children: [
      { path: '', redirectTo: 'heatmap', pathMatch: 'full' },
      { 
        path: 'heatmap', 
        loadComponent: () => import('./components/server-heatmap/server-heatmap.component').then(m => m.ServerHeatmapComponent) 
      },
      { 
        path: 'auto-scaling', 
        loadComponent: () => import('./components/auto-scaling-form/auto-scaling-form.component').then(m => m.AutoScalingFormComponent) 
      },
      { 
        path: 'server-metrics', 
        loadComponent: () => import('./components/server-metrics/server-metrics.component').then(m => m.ServerMetricsComponent) 
      }
    ]
  }
];
