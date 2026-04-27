export interface ScalingRule {
  metric: 'CPU' | 'RAM';
  operator: '>' | '<';
  threshold: number;
  adjustment: number;
}

export interface ScalingPolicy {
  policyName: string;
  baseInstanceType: 't3.medium' | 'm5.large' | 'c6g.xlarge';
  baseNodes: number;
  rules: ScalingRule[];
}

export const INSTANCE_PRICES: Record<string, number> = {
  't3.medium': 50,
  'm5.large': 120,
  'c6g.xlarge': 200
};