// src/pages/ScannerPage.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ScanJob, ScanResult, ScanTarget } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { CalendarIcon, CheckCircle, Clock, Play, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Switch } from '../components/ui/switch';

// Mock data for scans and results
const mockScans: ScanJob[] = [
  {
    id: '1',
    targetId: 'target1',
    scanType: 'Vulnerability Scan',
    status: 'completed',
    progress: 100,
    startTime: '2023-06-10T08:00:00Z',
    endTime: '2023-06-10T08:45:23Z',
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
    progress: 67,
    startTime: '2023-06-12T14:30:00Z',
    target: {
      id: 'target2',
      name: 'Database Servers',
      targetType: 'ip_list',
      targetValue: '10.0.0.5, 10.0.0.6, 10.0.0.7'
    }
  },
  {
    id: '3',
    targetId: 'target3',
    scanType: 'Vulnerability Scan',
    scheduledTime: '2023-06-15T22:00:00Z',
    status: 'scheduled',
    progress: 0,
    target: {
      id: 'target3',
      name: 'Internal Web Applications',
      targetType: 'domain_list',
      targetValue: 'admin.internal.example.com, app.internal.example.com'
    }
  }
];

// Mock scan result
const mockScanResult: ScanResult = {
  id: 'result1',
  scanJobId: '1',
  summary: {
    totalFindings: 12,
    criticalCount: 2,
    highCount: 3,
    mediumCount: 4,
    lowCount: 3
  },
  timestamp: '2023-06-10T08:45:23Z'
};

// Mock targets
const mockTargets: ScanTarget[] = [
  {
    id: 'target1',
    name: 'Web Server Cluster',
    description: 'Primary web server infrastructure',
    targetType: 'ip_range',
    targetValue: '192.168.1.0/24'
  },
  {
    id: 'target2',
    name: 'Database Servers',
    description: 'Production database servers',
    targetType: 'ip_list',
    targetValue: '10.0.0.5, 10.0.0.6, 10.0.0.7'
  },
  {
    id: 'target3',
    name: 'Internal Web Applications',
    description: 'Internal web applications and services',
    targetType: 'domain_list',
    targetValue: 'admin.internal.example.com, app.internal.example.com'
  }
];

const ScannerPage: React.FC = () => {
  const [scans, setScans] = useState<ScanJob[]>(mockScans);
  const [targets, setTargets] = useState<ScanTarget[]>(mockTargets);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedScanType, setSelectedScanType] = useState<string>('vulnerability');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [newTargetName, setNewTargetName] = useState<string>('');
  const [newTargetType, setNewTargetType] = useState<string>('ip_range');
  const [newTargetValue, setNewTargetValue] = useState<string>('');
  const [newTargetDescription, setNewTargetDescription] = useState<string>('');

  const handleStartScan = () => {
    alert('In a real application, this would start a new scan with the selected parameters.');
  };

  const handleCreateTarget = () => {
    if (!newTargetName || !newTargetValue) {
      alert('Name and target value are required');
      return;
    }

    const newTarget: ScanTarget = {
      id: `target${Date.now()}`,
      name: newTargetName,
      description: newTargetDescription,
      targetType: newTargetType,
      targetValue: newTargetValue
    };

    setTargets([...targets, newTarget]);
    
    // Reset form
    setNewTargetName('');
    setNewTargetType('ip_range');
    setNewTargetValue('');
    setNewTargetDescription('');
    
    alert('Target created successfully!');
  };
  
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

  const getScanStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />;
      case 'completed': 
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Vulnerability Scanner</h1>
      
      <Tabs defaultValue="new-scan" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="new-scan">New Scan</TabsTrigger>
          <TabsTrigger value="history">Scan History</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Start a New Scan</CardTitle>
              <CardDescription>
                Configure and launch vulnerability or network scans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scan-type">Scan Type</Label>
                <Select
                  value={selectedScanType}
                  onValueChange={setSelectedScanType}
                >
                  <SelectTrigger id="scan-type">
                    <SelectValue placeholder="Select scan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vulnerability">Vulnerability Scan</SelectItem>
                    <SelectItem value="network">Network Scan</SelectItem>
                    <SelectItem value="compliance">Compliance Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Select
                  value={selectedTarget}
                  onValueChange={setSelectedTarget}
                >
                  <SelectTrigger id="target">
                    <SelectValue placeholder="Select target" />
                  </SelectTrigger>
                  <SelectContent>
                    {targets.map(target => (
                      <SelectItem key={target.id} value={target.id}>
                        {target.name} ({target.targetValue})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="scheduled"
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
                <Label htmlFor="scheduled">Schedule for later</Label>
              </div>
              
              {isScheduled && (
                <div className="space-y-2">
                  <Label>Schedule Date & Time</Label>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <Select defaultValue="12">
                        <SelectTrigger>
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="flex items-center justify-center">:</span>
                      <Select defaultValue="00">
                        <SelectTrigger>
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          {['00', '15', '30', '45'].map(min => (
                            <SelectItem key={min} value={min}>
                              {min}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartScan} className="w-full">
                <Play className="mr-2 h-4 w-4" />
                {isScheduled ? 'Schedule Scan' : 'Start Scan Now'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>
                View and manage previous and ongoing scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map(scan => (
                    <TableRow key={scan.id}>
                      <TableCell>{getScanStatusIcon(scan.status)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{scan.target?.name}</div>
                        <div className="text-sm text-muted-foreground">{scan.target?.targetValue}</div>
                      </TableCell>
                      <TableCell>{scan.scanType}</TableCell>
                      <TableCell>
                        {scan.status === 'scheduled' 
                          ? format(new Date(scan.scheduledTime!), 'MMM d, yyyy HH:mm')
                          : format(new Date(scan.startTime!), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        {scan.status === 'running' ? (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{scan.progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${scan.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          getScanStatusBadge(scan.status)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="targets">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Scan Targets</CardTitle>
                <CardDescription>
                  Manage your scan targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {targets.map(target => (
                      <TableRow key={target.id}>
                        <TableCell>
                          <div className="font-medium">{target.name}</div>
                          <div className="text-sm text-muted-foreground">{target.description}</div>
                        </TableCell>
                        <TableCell>{target.targetType}</TableCell>
                        <TableCell className="font-mono text-sm">{target.targetValue}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Target</CardTitle>
                <CardDescription>
                  Create a new scan target
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-name">Target Name</Label>
                  <Input 
                    id="target-name" 
                    placeholder="e.g., Web Servers" 
                    value={newTargetName}
                    onChange={(e) => setNewTargetName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-type">Target Type</Label>
                  <Select
                    value={newTargetType}
                    onValueChange={setNewTargetType}
                  >
                    <SelectTrigger id="target-type">
                      <SelectValue placeholder="Select target type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip_range">IP Range</SelectItem>
                      <SelectItem value="ip_list">IP List</SelectItem>
                      <SelectItem value="domain">Domain</SelectItem>
                      <SelectItem value="domain_list">Domain List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-value">Target Value</Label>
                  <Input 
                    id="target-value" 
                    placeholder={
                      newTargetType === 'ip_range' 
                        ? '192.168.1.0/24' 
                        : newTargetType === 'ip_list'
                        ? '192.168.1.10, 192.168.1.11'
                        : 'example.com, subdomain.example.com'
                    }
                    value={newTargetValue}
                    onChange={(e) => setNewTargetValue(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-description">Description (Optional)</Label>
                  <Textarea 
                    id="target-description" 
                    placeholder="Enter a description for this target" 
                    value={newTargetDescription}
                    onChange={(e) => setNewTargetDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateTarget} className="w-full">
                  Create Target
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScannerPage;