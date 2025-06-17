// src/pages/FirewallPage.tsx
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { FirewallRule } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  Filter, 
  Plus, 
  Shield, 
  Trash2, 
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

// Mock firewall rules
const mockFirewallRules: FirewallRule[] = [
  {
    id: '1',
    name: 'Block SSH from External',
    description: 'Block SSH access from outside networks',
    sourceIp: '!192.168.0.0/16',
    destinationIp: '192.168.1.100',
    protocol: 'TCP',
    port: '22',
    action: 'deny',
    priority: 10,
    enabled: true
  },
  {
    id: '2',
    name: 'Allow HTTP/HTTPS',
    description: 'Allow web traffic',
    protocol: 'TCP',
    port: '80,443',
    action: 'allow',
    priority: 20,
    enabled: true
  },
  {
    id: '3',
    name: 'Block Suspect IP Range',
    sourceIp: '203.0.113.0/24',
    action: 'deny',
    priority: 5,
    enabled: true
  },
  {
    id: '4',
    name: 'Internal DNS',
    destinationIp: '192.168.1.53',
    protocol: 'UDP',
    port: '53',
    action: 'allow',
    priority: 15,
    enabled: true
  },
  {
    id: '5',
    name: 'API Access',
    description: 'Allow API services',
    destinationIp: '192.168.2.0/24',
    protocol: 'TCP',
    port: '8080-8090',
    action: 'allow',
    priority: 30,
    enabled: false
  }
];

// Mock firewall stats
const mockFirewallStats = {
  totalConnections: 15243,
  blockedConnections: 537,
  recentAttacks: 12,
  topAttackerIP: '203.0.113.28',
  topTargetPort: '22',
  ruleMatchCount: {
    '1': 325,
    '2': 12456,
    '3': 212,
    '4': 1984,
    '5': 0
  }
};

const FirewallPage: React.FC = () => {
  const [firewallEnabled, setFirewallEnabled] = useState<boolean>(true);
  const [rules, setRules] = useState<FirewallRule[]>(mockFirewallRules);
  const [newRule, setNewRule] = useState<Partial<FirewallRule>>({
    name: '',
    description: '',
    sourceIp: '',
    destinationIp: '',
    protocol: 'TCP',
    port: '',
    action: 'deny',
    priority: 50,
    enabled: true
  });

  const handleCreateRule = () => {
    if (!newRule.name) {
      alert('Rule name is required');
      return;
    }

    const createdRule: FirewallRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name || '',
      description: newRule.description,
      sourceIp: newRule.sourceIp,
      destinationIp: newRule.destinationIp,
      protocol: newRule.protocol,
      port: newRule.port,
      action: newRule.action as 'allow' | 'deny',
      priority: newRule.priority || 50,
      enabled: newRule.enabled || false
    };

    setRules([...rules, createdRule]);
    
    // Reset form
    setNewRule({
      name: '',
      description: '',
      sourceIp: '',
      destinationIp: '',
      protocol: 'TCP',
      port: '',
      action: 'deny',
      priority: 50,
      enabled: true
    });
    
    alert('Rule created successfully!');
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled } 
        : rule
    ));
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      setRules(rules.filter(rule => rule.id !== ruleId));
    }
  };

  const handlePriorityChange = (ruleId: string, direction: 'up' | 'down') => {
    const ruleIndex = rules.findIndex(rule => rule.id === ruleId);
    
    if (ruleIndex === -1) return;
    
    const newRules = [...rules];
    const rule = newRules[ruleIndex];
    
    if (direction === 'up') {
      rule.priority -= 5;
    } else {
      rule.priority += 5;
    }
    
    // Sort rules by priority
    newRules.sort((a, b) => a.priority - b.priority);
    
    setRules(newRules);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Firewall Management</h1>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="firewall-status" className="font-medium">
            Firewall Status:
          </Label>
          <Switch
            id="firewall-status"
            checked={firewallEnabled}
            onCheckedChange={setFirewallEnabled}
          />
          <span className={`ml-2 text-sm font-medium ${firewallEnabled ? 'text-green-500' : 'text-red-500'}`}>
            {firewallEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 h-[180px]">
          <CardHeader className="pb-2">
            <CardTitle>Firewall Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-2xl font-bold">{mockFirewallStats.totalConnections.toLocaleString()}</span>
                </div>
                <span className="text-sm text-muted-foreground">Total Connections</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center">
                  <X className="h-5 w-5 mr-2 text-destructive" />
                  <span className="text-2xl font-bold">{mockFirewallStats.blockedConnections.toLocaleString()}</span>
                </div>
                <span className="text-sm text-muted-foreground">Blocked Connections</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="text-2xl font-bold">{mockFirewallStats.recentAttacks}</span>
                </div>
                <span className="text-sm text-muted-foreground">Recent Attacks</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="h-[180px]">
          <CardHeader className="pb-2">
            <CardTitle>Firewall Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-full justify-center items-center">
              {firewallEnabled ? (
                <div className="flex flex-col items-center text-center">
                  <ShieldCheck className="h-16 w-16 text-green-500 mb-2" />
                  <p className="font-semibold text-lg">Protected</p>
                  <p className="text-sm text-muted-foreground">
                    {rules.filter(r => r.enabled).length} active rules
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-16 w-16 text-red-500 mb-2" />
                  <p className="font-semibold text-lg">Vulnerable</p>
                  <p className="text-sm text-destructive">
                    Firewall protection is disabled
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
          <TabsTrigger value="rules">Firewall Rules</TabsTrigger>
          <TabsTrigger value="new-rule">Add Rule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Firewall Rules</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Show All Rules</DropdownMenuItem>
                    <DropdownMenuItem>Only Active Rules</DropdownMenuItem>
                    <DropdownMenuItem>Only Disabled Rules</DropdownMenuItem>
                    <DropdownMenuItem>Allow Rules</DropdownMenuItem>
                    <DropdownMenuItem>Deny Rules</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>
                Configure and manage firewall rules. Rules are processed in order of priority (lowest number first).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Priority</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Protocol/Port</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules
                    .sort((a, b) => a.priority - b.priority)
                    .map(rule => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <span className="font-mono">{rule.priority}</span>
                            <div className="flex gap-1 mt-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5" 
                                onClick={() => handlePriorityChange(rule.id, 'up')}
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5" 
                                onClick={() => handlePriorityChange(rule.id, 'down')}
                              >
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">{rule.description}</div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{rule.sourceIp || '*'}</TableCell>
                        <TableCell className="font-mono text-xs">{rule.destinationIp || '*'}</TableCell>
                        <TableCell>
                          {rule.protocol ? (
                            <div>
                              <Badge variant="outline">{rule.protocol}</Badge>
                              {rule.port && <span className="ml-1 text-xs">{rule.port}</span>}
                            </div>
                          ) : (
                            '*'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={rule.action === 'allow' ? 'bg-green-500' : 'bg-red-500'}
                          >
                            {rule.action.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.enabled ? "default" : "outline"} className="gap-1">
                            {rule.enabled ? (
                              <>
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Active
                              </>
                            ) : (
                              <>
                                <span className="h-2 w-2 rounded-full bg-muted"></span>
                                Disabled
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleRule(rule.id)}
                              title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                            >
                              {rule.enabled ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Delete rule"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {rules.length} rules • {rules.filter(r => r.enabled).length} active
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Rule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="new-rule">
          <Card>
            <CardHeader>
              <CardTitle>Create New Firewall Rule</CardTitle>
              <CardDescription>
                Define a rule to allow or deny traffic based on criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name *</Label>
                  <Input 
                    id="rule-name" 
                    placeholder="e.g., Block SSH Access" 
                    value={newRule.name} 
                    onChange={e => setNewRule({...newRule, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-action">Action</Label>
                  <Select 
                    value={newRule.action} 
                    onValueChange={value => setNewRule({...newRule, action: value as 'allow' | 'deny'})}
                  >
                    <SelectTrigger id="rule-action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allow">Allow</SelectItem>
                      <SelectItem value="deny">Deny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-description">Description (Optional)</Label>
                <Textarea 
                  id="rule-description" 
                  placeholder="What does this rule do?" 
                  value={newRule.description} 
                  onChange={e => setNewRule({...newRule, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-source">Source IP/Range (Optional)</Label>
                  <Input 
                    id="rule-source" 
                    placeholder="e.g., 192.168.1.0/24 or empty for any" 
                    value={newRule.sourceIp} 
                    onChange={e => setNewRule({...newRule, sourceIp: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Use "!" prefix to negate (e.g., !192.168.1.0/24)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-destination">Destination IP/Range (Optional)</Label>
                  <Input 
                    id="rule-destination" 
                    placeholder="e.g., 10.0.0.5 or empty for any" 
                    value={newRule.destinationIp} 
                    onChange={e => setNewRule({...newRule, destinationIp: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-protocol">Protocol (Optional)</Label>
                  <Select 
                    value={newRule.protocol}
                    onValueChange={value => setNewRule({...newRule, protocol: value})}
                  >
                    <SelectTrigger id="rule-protocol">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TCP">TCP</SelectItem>
                      <SelectItem value="UDP">UDP</SelectItem>
                      <SelectItem value="ICMP">ICMP</SelectItem>
                      <SelectItem value="ANY">Any</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-port">Port/Range (Optional)</Label>
                  <Input 
                    id="rule-port" 
                    placeholder="e.g., 80,443 or 8000-9000" 
                    value={newRule.port} 
                    onChange={e => setNewRule({...newRule, port: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-priority">Priority</Label>
                  <Input 
                    id="rule-priority" 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={newRule.priority?.toString() || '50'}
                    onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-muted-foreground">Lower numbers processed first</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="rule-enabled"
                  checked={newRule.enabled}
                  onCheckedChange={checked => setNewRule({...newRule, enabled: checked})}
                />
                <Label htmlFor="rule-enabled">Enable rule immediately</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateRule} className="w-full">
                Create Rule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FirewallPage;