// src/pages/NetworkScanPage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, Laptop, Server, Wifi, Search, Loader2, RefreshCw, Eye, Download, Network } from 'lucide-react';

// Mock data for network devices
const mockDevices = [
  {
    id: '1',
    hostname: 'web-server-01',
    ipAddress: '192.168.1.100',
    macAddress: '00:1A:2B:3C:4D:5E',
    deviceType: 'server',
    osInfo: 'Ubuntu 22.04 LTS',
    openPorts: [22, 80, 443],
    lastSeen: '2023-06-12T14:30:00Z',
    vulnerabilities: 3,
    status: 'online'
  },
  {
    id: '2',
    hostname: 'db-server-01',
    ipAddress: '192.168.1.101',
    macAddress: '00:2B:3C:4D:5E:6F',
    deviceType: 'server',
    osInfo: 'PostgreSQL on CentOS 8',
    openPorts: [22, 5432],
    lastSeen: '2023-06-12T14:32:00Z',
    vulnerabilities: 1,
    status: 'online'
  },
  {
    id: '3',
    hostname: 'admin-laptop',
    ipAddress: '192.168.1.105',
    macAddress: '00:3C:4D:5E:6F:7G',
    deviceType: 'workstation',
    osInfo: 'Windows 11 Pro',
    openPorts: [445, 139],
    lastSeen: '2023-06-12T13:45:00Z',
    vulnerabilities: 4,
    status: 'online'
  },
  {
    id: '4',
    hostname: 'wifi-ap-01',
    ipAddress: '192.168.1.1',
    macAddress: '00:4D:5E:6F:7G:8H',
    deviceType: 'network',
    osInfo: 'OpenWrt 21.02',
    openPorts: [22, 80, 443, 53],
    lastSeen: '2023-06-12T14:30:00Z',
    vulnerabilities: 0,
    status: 'online'
  },
  {
    id: '5',
    hostname: 'unknown-device',
    ipAddress: '192.168.1.155',
    macAddress: '00:5E:6F:7G:8H:9I',
    deviceType: 'unknown',
    osInfo: 'Unknown',
    openPorts: [8080],
    lastSeen: '2023-06-12T10:15:00Z',
    vulnerabilities: 2,
    status: 'offline'
  }
];

// Mock topology data - this would be more complex in a real app
const mockTopology = {
  nodes: [
    { id: '1', label: 'Router (192.168.1.1)', type: 'router' },
    { id: '2', label: 'Switch-01 (192.168.1.2)', type: 'switch' },
    { id: '3', label: 'web-server-01 (192.168.1.100)', type: 'server' },
    { id: '4', label: 'db-server-01 (192.168.1.101)', type: 'server' },
    { id: '5', label: 'admin-laptop (192.168.1.105)', type: 'workstation' },
    { id: '6', label: 'unknown-device (192.168.1.155)', type: 'unknown' },
  ],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '2', to: '4' },
    { from: '2', to: '5' },
    { from: '1', to: '6' },
  ]
};

const NetworkScanPage: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [devices, setDevices] = useState<typeof mockDevices>([]);
  const [filteredDevices, setFilteredDevices] = useState<typeof mockDevices>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scanTarget, setScanTarget] = useState<string>('192.168.1.0/24');

  useEffect(() => {
    // Simulating loading data
    const timer = setTimeout(() => {
      setDevices(mockDevices);
      setFilteredDevices(mockDevices);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters when devices, searchQuery, or filters change
    let results = [...devices];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(device => 
        device.hostname.toLowerCase().includes(query) ||
        device.ipAddress.toLowerCase().includes(query) ||
        device.macAddress.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(device => device.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(device => device.deviceType === typeFilter);
    }
    
    setFilteredDevices(results);
  }, [devices, searchQuery, statusFilter, typeFilter]);

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
    
    // Mock adding new device after scan completes
    setTimeout(() => {
      const newDevice = {
        id: '6',
        hostname: 'new-device-' + Math.floor(Math.random() * 100),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
        macAddress: '00:FF:AA:BB:CC:DD',
        deviceType: 'workstation',
        osInfo: 'Linux Mint 21',
        openPorts: [22, 80],
        lastSeen: new Date().toISOString(),
        vulnerabilities: 0,
        status: 'online'
      };
      
      setDevices(prev => [...prev, newDevice]);
    }, 15000); // After scan completes
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'server':
        return <Server className="h-4 w-4 text-blue-500" />;
      case 'workstation':
        return <Laptop className="h-4 w-4 text-green-500" />;
      case 'network':
        return <Wifi className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getVulnerabilityBadge = (count: number) => {
    if (count === 0) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Secure</Badge>;
    if (count <= 2) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{count} Issues</Badge>;
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{count} Issues</Badge>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Network Scanner</h1>
      
      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="scan">Network Scan</TabsTrigger>
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle>Network Devices</CardTitle>
                  <CardDescription>
                    All devices discovered on your network
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <Input
                      placeholder="Search devices..."
                      className="max-w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="server">Servers</SelectItem>
                      <SelectItem value="workstation">Workstations</SelectItem>
                      <SelectItem value="network">Network Devices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">Type</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>OS Info</TableHead>
                    <TableHead>Open Ports</TableHead>
                    <TableHead>Vulnerabilities</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>{getDeviceTypeIcon(device.deviceType)}</TableCell>
                        <TableCell className="font-medium">{device.hostname}</TableCell>
                        <TableCell>{device.ipAddress}</TableCell>
                        <TableCell className="font-mono text-xs">{device.macAddress}</TableCell>
                        <TableCell>{device.osInfo}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {device.openPorts.map((port) => (
                              <Badge key={port} variant="outline" className="text-xs">
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getVulnerabilityBadge(device.vulnerabilities)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={device.status === 'online' ? 'default' : 'secondary'}
                            className="gap-1"
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                            ></span>
                            {device.status === 'online' ? 'Online' : 'Offline'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No devices found. Try adjusting your search or filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredDevices.length} of {devices.length} devices
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scan">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Network Scanner</CardTitle>
                <CardDescription>
                  Scan your network to discover devices and detect security issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="scan-target">Scan Target</Label>
                  <Input
                    id="scan-target"
                    placeholder="IP address, range or CIDR notation"
                    value={scanTarget}
                    onChange={(e) => setScanTarget(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    E.g., 192.168.1.1, 192.168.1.1-50, or 192.168.1.0/24
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scan-type">Scan Type</Label>
                  <Select defaultValue="discovery">
                    <SelectTrigger id="scan-type">
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discovery">Discovery Scan (Fast)</SelectItem>
                      <SelectItem value="standard">Standard Scan</SelectItem>
                      <SelectItem value="deep">Deep Scan (Thorough)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scan-options">Advanced Options</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="option-ports" className="rounded border-gray-300" />
                      <Label htmlFor="option-ports" className="font-normal">Port Scanning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="option-os" className="rounded border-gray-300" />
                      <Label htmlFor="option-os" className="font-normal">OS Detection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="option-services" className="rounded border-gray-300" />
                      <Label htmlFor="option-services" className="font-normal">Service Detection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="option-vulns" className="rounded border-gray-300" />
                      <Label htmlFor="option-vulns" className="font-normal">Vulnerability Check</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={startScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning... ({scanProgress}%)
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Network Scan
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scan History</CardTitle>
                <CardDescription>
                  Recent network scans and their results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Devices Found</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>June 12, 2023 14:30</TableCell>
                      <TableCell>192.168.1.0/24</TableCell>
                      <TableCell>5 devices</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>June 10, 2023 09:15</TableCell>
                      <TableCell>192.168.1.0/24</TableCell>
                      <TableCell>4 devices</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>June 7, 2023 22:00</TableCell>
                      <TableCell>10.0.0.0/24</TableCell>
                      <TableCell>8 devices</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="topology">
          <Card>
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
              <CardDescription>
                Visual representation of your network structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 border rounded-md min-h-[500px] flex items-center justify-center">
                <div className="text-center p-6">
                  <Network className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Network Topology Visualization</h3>
                  <p className="text-muted-foreground mb-4">
                    In a real implementation, this would display an interactive network graph showing
                    connections between devices, routers, and other network components.
                  </p>
                  <div className="bg-card border rounded-md p-4 mx-auto max-w-lg text-left text-sm">
                    <p className="font-mono">
                      <span className="text-blue-500">Nodes:</span> Router, Switch, {mockTopology.nodes.length - 2} Devices<br />
                      <span className="text-amber-500">Connections:</span> {mockTopology.edges.length} Links<br />
                      <span className="text-green-500">Discovered:</span> June 12, 2023 14:30
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                Refresh Topology
              </Button>
              <Button variant="outline">
                Export Diagram
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkScanPage;