// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import ThreatHeatmap, { ThreatData } from '../components/dashboard/ThreatHeatmap';
import AlertsWidget from '../components/dashboard/AlertsWidget';
import FirewallStatusWidget from '../components/dashboard/FirewallStatusWidget';
import ScanScheduleWidget from '../components/dashboard/ScanScheduleWidget';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, DashboardData } from '../types';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulating API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: DashboardData = {
          threatScore: 42,
          activeScanCount: 2,
          alertSummary: {
            new: 5,
            acknowledged: 3,
            resolved: 12,
            total: 20
          },
          topAlerts: [
            {
              id: '1',
              title: 'Brute Force Attack',
              description: 'Multiple failed login attempts detected from 192.168.1.100',
              severity: 'high',
              sourceIp: '192.168.1.100',
              destinationIp: '10.0.0.15',
              timestamp: new Date().toISOString(),
              status: 'new'
            },
            {
              id: '2',
              title: 'SQL Injection Attempt',
              description: 'Malicious SQL query detected on login form',
              severity: 'critical',
              sourceIp: '192.168.1.105',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: 'new'
            },
            {
              id: '3',
              title: 'Suspicious File Download',
              description: 'User downloaded potentially malicious executable',
              severity: 'medium',
              sourceIp: '192.168.1.53',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              status: 'acknowledged'
            }
          ],
          recentFindings: [],
          firewallStatus: {
            enabled: true,
            activeRules: 42,
            blockedConnections: 153,
            lastUpdated: new Date().toISOString()
          },
          upcomingScans: [
            {
              id: '1',
              targetId: 'target1',
              scanType: 'Vulnerability Scan',
              status: 'scheduled',
              progress: 0,
              scheduledTime: new Date(Date.now() + 3600000).toISOString(),
              target: {
                id: 'target1',
                name: 'Web Server Cluster',
                targetType: 'ip_range',
                targetValue: '192.168.1.0/24'
              }
            },
            {
              id: '2',
              targetId: 'target2',
              scanType: 'Network Scan',
              status: 'running',
              progress: 45,
              startTime: new Date(Date.now() - 1800000).toISOString(),
              target: {
                id: 'target2',
                name: 'Database Servers',
                targetType: 'ip_list',
                targetValue: '10.0.0.5, 10.0.0.6, 10.0.0.7'
              }
            }
          ],
          networkHealth: {
            score: 87,
            agentsOnline: 15,
            agentsTotal: 18
          },
          threatHeatmap: [
            { ipAddress: '192.168.1.105', threatLevel: 89 },
            { ipAddress: '192.168.1.100', threatLevel: 76 },
            { ipAddress: '10.0.0.15', threatLevel: 53 },
            { ipAddress: '192.168.1.53', threatLevel: 42 },
            { ipAddress: '192.168.1.200', threatLevel: 28 },
            { ipAddress: '10.0.0.8', threatLevel: 17 },
            { ipAddress: '10.0.0.9', threatLevel: 12 },
            { ipAddress: '192.168.1.35', threatLevel: 5 }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Security Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <span className="text-2xl font-bold">{dashboardData?.threatScore}</span>
                <span className="text-sm text-muted-foreground">Threat Score</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <span className="text-2xl font-bold">{dashboardData?.activeScanCount}</span>
                <span className="text-sm text-muted-foreground">Active Scans</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <span className="text-2xl font-bold">{dashboardData?.alertSummary.new}</span>
                <span className="text-sm text-muted-foreground">New Alerts</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <span className="text-2xl font-bold">{dashboardData?.networkHealth.score}%</span>
                <span className="text-sm text-muted-foreground">Network Health</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">Agents Online</span>
                <span className="text-sm font-medium">
                  {dashboardData?.networkHealth.agentsOnline}/{dashboardData?.networkHealth.agentsTotal}
                </span>
              </div>
              <div className="w-full h-2 bg-secondary mt-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ 
                    width: `${dashboardData ? 
                      (dashboardData.networkHealth.agentsOnline / dashboardData.networkHealth.agentsTotal * 100) : 
                      0}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {dashboardData && (
          <>
            <AlertsWidget 
              alerts={dashboardData.topAlerts} 
              alertSummary={dashboardData.alertSummary}
            />
            <FirewallStatusWidget {...dashboardData.firewallStatus} />
            <ThreatHeatmap data={dashboardData.threatHeatmap} />
            <ScanScheduleWidget upcomingScans={dashboardData.upcomingScans} />
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;