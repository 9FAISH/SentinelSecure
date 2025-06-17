// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  ChevronLeft, 
  Home, 
  Shield, 
  Zap, 
  Network, 
  Bell, 
  Settings, 
  Users, 
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, expanded, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        active ? 'bg-accent text-accent-foreground' : 'text-sidebar-foreground'
      )}
    >
      <span className="flex items-center justify-center w-6 h-6">
        {icon}
      </span>
      {expanded && <span className="ml-3">{label}</span>}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: <Home size={18} />, label: 'Dashboard' },
    { to: '/scanner', icon: <Shield size={18} />, label: 'Vulnerability Scanner' },
    { to: '/firewall', icon: <Zap size={18} />, label: 'Firewall' },
    { to: '/network', icon: <Network size={18} />, label: 'Network Scanner' },
    { to: '/alerts', icon: <Bell size={18} />, label: 'Alerts' },
    { to: '/settings', icon: <Settings size={18} />, label: 'Settings' },
    { to: '/users', icon: <Users size={18} />, label: 'Users' },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile sidebar
  const mobileMenu = (
    <div className="md:hidden fixed top-0 right-0 z-50">
      <Button
        variant="ghost"
        size="icon"
        className="m-2"
        onClick={toggleMobileMenu}
      >
        <Menu size={24} />
      </Button>
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40">
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-sidebar p-6 shadow-lg z-50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-sidebar-foreground">SentinelSecure</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
              >
                <X size={20} />
              </Button>
            </div>
            <nav className="space-y-2">
              {navItems.map(item => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  expanded={true}
                  active={location.pathname === item.to}
                />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileMenu}
      <div className={cn(
        'hidden md:flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        expanded ? 'w-[240px]' : 'w-[70px]'
      )}>
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-sidebar-border',
          expanded ? 'justify-between' : 'justify-center'
        )}>
          {expanded && (
            <span className="text-lg font-semibold text-sidebar-foreground">SentinelSecure</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ChevronLeft size={18} className={cn("transition-transform", !expanded && "rotate-180")} />
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-2">
          {navItems.map(item => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              expanded={expanded}
              active={location.pathname === item.to}
            />
          ))}
          <li>
            <NavLink to="/agents" className={({ isActive }) => isActive ? 'font-bold text-primary' : ''}>
              Agents
            </NavLink>
          </li>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;