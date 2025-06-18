// src/components/layout/Header.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
  };

  return (
    <header className="border-b border-border h-16 flex items-center px-4 md:px-6 justify-between bg-background">
      <div className="flex-1 md:hidden">
        {/* Empty div for flex spacing on mobile */}
      </div>
      
      <h1 className="text-xl font-semibold hidden md:block">
        SentinelSecure
      </h1>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        
        <Button variant="outline" size="icon">
          <Bell size={18} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={user?.username} />
                <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;