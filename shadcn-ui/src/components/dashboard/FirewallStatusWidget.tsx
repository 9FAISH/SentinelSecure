// src/components/dashboard/FirewallStatusWidget.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Shield, ShieldOff, Clock, Ban } from 'lucide-react';
import { Button } from '../ui/button';
import { format } from 'date-fns';

interface FirewallStatusProps {
  enabled: boolean;
  activeRules: number;
  blockedConnections: number;
  lastUpdated: string;
}

const FirewallStatusWidget: React.FC<FirewallStatusProps> = ({
  enabled,
  activeRules,
  blockedConnections,
  lastUpdated,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Firewall Status</CardTitle>
          <Badge variant={enabled ? 'default' : 'destructive'} className="h-6">
            {enabled ? 'Active' : 'Disabled'}
          </Badge>
        </div>
        <CardDescription>
          Last updated: {format(new Date(lastUpdated), 'MMM d, yyyy HH:mm')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                <span>Active Rules</span>
              </div>
              <span className="font-bold">{activeRules}</span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center">
                <Ban className="h-5 w-5 mr-2 text-red-500" />
                <span>Blocked Connections</span>
              </div>
              <span className="font-bold">{blockedConnections}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-amber-500" />
                <span>Last Rule Change</span>
              </div>
              <span className="text-sm">{format(new Date(lastUpdated), 'HH:mm:ss')}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant={enabled ? "destructive" : "default"}
          size="sm"
          className="w-full"
        >
          {enabled ? (
            <>
              <ShieldOff className="h-4 w-4 mr-2" />
              Disable Firewall
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Enable Firewall
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirewallStatusWidget;