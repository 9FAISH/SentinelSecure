// src/components/dashboard/AlertsWidget.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert } from '../../types';
import { Badge } from '../ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { format, isToday, isYesterday } from 'date-fns';

interface AlertsWidgetProps {
  alerts: Alert[];
  alertSummary: {
    new: number;
    acknowledged: number;
    resolved: number;
    total: number;
  };
}

const AlertsWidget: React.FC<AlertsWidgetProps> = ({ alerts, alertSummary }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Today, ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>
          {alertSummary.new} new alerts out of {alertSummary.total} total
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.slice(0, 5).map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start space-x-3 p-3 rounded-md border border-border bg-card"
              >
                <div className="mt-0.5">{getStatusIcon(alert.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.title}</p>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatDate(alert.timestamp)}</span>
                    {alert.sourceIp && <span>{alert.sourceIp}</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No alerts found</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            New: {alertSummary.new}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            In Progress: {alertSummary.acknowledged}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Resolved: {alertSummary.resolved}
          </Badge>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </CardFooter>
    </Card>
  );
};

export default AlertsWidget;