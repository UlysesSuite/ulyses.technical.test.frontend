export interface Metric {
  id: string;
  serverId: string;
  timestamp: string;
  cpuUsage: number;
  ramUsage: number;
  status: 'Healthy' | 'Warning' | 'Critical';
}
