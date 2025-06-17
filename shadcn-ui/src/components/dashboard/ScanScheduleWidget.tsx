// src/components/dashboard/ScanScheduleWidget.tsx
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScanJob } from '../../types';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface ScanScheduleWidgetProps {
  upcomingScans: ScanJob[];
}

const ScanScheduleWidget: React.FC<ScanScheduleWidgetProps> = ({ upcomingScans }) => {
  const getScanStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
      case 'running':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed': 
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatScheduledTime = (timeStr?: string) => {
    if (!timeStr) return 'Not scheduled';
    return format(new Date(timeStr), 'MMM d, HH:mm');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingScans.length > 0 ? (
            upcomingScans.map((scan) => (
              <div 
                key={scan.id}
                className="flex flex-col space-y-2 p-3 rounded-md border border-border bg-card"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{scan.target?.name || scan.targetId}</h4>
                    <p className="text-sm text-muted-foreground">{scan.scanType}</p>
                  </div>
                  {getScanStatusBadge(scan.status)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {scan.status === 'running' 
                      ? `Started: ${formatScheduledTime(scan.startTime)}` 
                      : `Scheduled: ${formatScheduledTime(scan.scheduledTime)}`}
                  </span>
                </div>
                
                {scan.status === 'running' && (
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${scan.progress}%` }}
                    ></div>
                    <p className="text-xs text-right mt-1">{scan.progress}% complete</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Calendar className="h-10 w-10 mb-2 opacity-20" />
              <p>No upcoming scans scheduled</p>
              <p className="text-sm">Schedule a scan to see it here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanScheduleWidget;