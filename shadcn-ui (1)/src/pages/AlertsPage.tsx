// src/pages/AlertsPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert } from '../types';
import { AlertTriangle, CheckCircle, Clock, Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Brute Force Attack Detected',
    description: 'Multiple failed login attempts from IP 203.0.113.45 targeting SSH service',
    severity: 'critical',
    sourceIp: '203.0.113.45',
    destinationIp: '192.168.1.100',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    status: 'new'
  },
  {
    id: '2',
    title: 'SQL Injection Attempt',
    description: 'Malicious SQL query detected in web application login form',
    severity: 'high',
    sourceIp: '198.51.100.23',
    destinationIp: '192.168.1.50',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    status: 'new'
  },
  {
    id: '3',
    title: 'Suspicious File Download',
    description: 'User downloaded potentially malicious executable file',
    severity: 'medium',
    sourceIp: '192.168.1.105',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    status: 'acknowledged'
  },
  {
    id: '4',
    title: 'Port Scan Detected',
    description: 'Systematic port scanning activity detected from external IP',
    severity: 'medium',
    sourceIp: '203.0.113.67',
    destinationIp: '192.168.1.0/24',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: 'acknowledged'
  },
  {
    id: '5',
    title: 'Malware Signature Match',
    description: 'Known malware signature detected in network traffic',
    severity: 'high',
    sourceIp: '198.51.100.89',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    status: 'resolved'
  }
];

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(mockAlerts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    let results = [...alerts];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(alert => 
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query) ||
        alert.sourceIp?.toLowerCase().includes(query)
      );
    }
    
    // Apply severity filter
    if (severityFilter !== 'all') {
      results = results.filter(alert => alert.severity === severityFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(alert => alert.status === statusFilter);
    }
    
    setFilteredAlerts(results);
  }, [alerts, searchQuery, severityFilter, statusFilter]);

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

  const handleStatusChange = (alertId: string, newStatus: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: newStatus as Alert['status'] }
        : alert
    ));
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return format(date, 'MMM d, yyyy HH:mm');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            {alerts.filter(a => a.status === 'new').length} New
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500"></span>
            {alerts.filter(a => a.status === 'acknowledged').length} In Progress
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Alert Management</CardTitle>
              <CardDescription>
                Monitor and respond to security threats and incidents
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  className="max-w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Status</TableHead>
                <TableHead>Alert</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source IP</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{getStatusIcon(alert.status)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {alert.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {alert.sourceIp || 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {alert.destinationIp || 'N/A'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTimeAgo(alert.timestamp)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(alert.id, 'acknowledged')}
                              disabled={alert.status === 'acknowledged'}
                            >
                              Acknowledge
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(alert.id, 'resolved')}
                              disabled={alert.status === 'resolved'}
                            >
                              Resolve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(alert.id, 'new')}
                              disabled={alert.status === 'new'}
                            >
                              Mark as New
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No alerts found. Try adjusting your search or filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;