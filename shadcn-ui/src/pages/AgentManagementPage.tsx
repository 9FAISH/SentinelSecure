import React, { useState } from 'react';
import { Agent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const mockAgents: Agent[] = [
  {
    id: '1',
    hostname: 'server-01',
    ipAddress: '192.168.1.10',
    operatingSystem: 'Ubuntu 22.04',
    version: '1.0.0',
    status: 'online',
    lastCheckin: new Date().toISOString(),
  },
  {
    id: '2',
    hostname: 'server-02',
    ipAddress: '192.168.1.11',
    operatingSystem: 'Windows Server 2019',
    version: '1.0.0',
    status: 'offline',
    lastCheckin: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

const AgentManagementPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [form, setForm] = useState({
    hostname: '',
    ipAddress: '',
    operatingSystem: '',
    version: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    if (!form.hostname || !form.ipAddress || !form.version) {
      alert('Hostname, IP Address, and Version are required');
      return;
    }
    setAgents([
      ...agents,
      {
        id: `${Date.now()}`,
        ...form,
        status: 'online',
        lastCheckin: new Date().toISOString(),
      },
    ]);
    setForm({ hostname: '', ipAddress: '', operatingSystem: '', version: '' });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Register New Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input name="hostname" placeholder="Hostname" value={form.hostname} onChange={handleChange} />
            <Input name="ipAddress" placeholder="IP Address" value={form.ipAddress} onChange={handleChange} />
            <Input name="operatingSystem" placeholder="Operating System" value={form.operatingSystem} onChange={handleChange} />
            <Input name="version" placeholder="Version" value={form.version} onChange={handleChange} />
            <Button onClick={handleRegister}>Register</Button>
          </div>
        </CardContent>
      </Card>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Registered Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b">Hostname</th>
                  <th className="p-2 border-b">IP Address</th>
                  <th className="p-2 border-b">OS</th>
                  <th className="p-2 border-b">Version</th>
                  <th className="p-2 border-b">Status</th>
                  <th className="p-2 border-b">Last Check-in</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(agent => (
                  <tr key={agent.id}>
                    <td className="p-2 border-b">{agent.hostname}</td>
                    <td className="p-2 border-b">{agent.ipAddress}</td>
                    <td className="p-2 border-b">{agent.operatingSystem}</td>
                    <td className="p-2 border-b">{agent.version}</td>
                    <td className="p-2 border-b capitalize">{agent.status}</td>
                    <td className="p-2 border-b">{new Date(agent.lastCheckin).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentManagementPage; 