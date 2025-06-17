// src/types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  sourceIp?: string;
  destinationIp?: string;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface ScanTarget {
  id: string;
  name: string;
  description?: string;
  targetType: string;
  targetValue: string;
}

export interface ScanJob {
  id: string;
  targetId: string;
  scanType: string;
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  progress: number;
  target?: ScanTarget;
}

export interface ScanResult {
  id: string;
  scanJobId: string;
  summary: {
    totalFindings: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  };
  timestamp: string;
}

export interface Finding {
  id: string;
  scanResultId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description?: string;
  affectedSystem?: string;
  remediation?: string;
  cveIds?: string[];
  timestamp: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}

export interface FirewallRule {
  id: string;
  name: string;
  description?: string;
  sourceIp?: string;
  destinationIp?: string;
  protocol?: string;
  port?: string;
  action: 'allow' | 'deny';
  priority: number;
  enabled: boolean;
}

export interface Agent {
  id: string;
  hostname: string;
  ipAddress: string;
  operatingSystem?: string;
  version: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastCheckin: string;
}

export interface DashboardData {
  threatScore: number;
  activeScanCount: number;
  alertSummary: {
    new: number;
    acknowledged: number;
    resolved: number;
    total: number;
  };
  topAlerts: Alert[];
  recentFindings: Finding[];
  firewallStatus: {
    enabled: boolean;
    activeRules: number;
    blockedConnections: number;
    lastUpdated: string;
  };
  upcomingScans: ScanJob[];
  networkHealth: {
    score: number;
    agentsOnline: number;
    agentsTotal: number;
  };
  threatHeatmap: Array<{
    ipAddress: string;
    threatLevel: number;
    location?: {
      lat: number;
      lng: number;
    };
  }>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TwoFactorAuthCredentials {
  code: string;
}