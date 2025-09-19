// File: src/components/Layout/Navbar.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CartSheet } from './CartSheet';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userType, logout, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive"
      });
    }
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'admin': return '/admin';
      case 'seller': return '/seller';
      case 'customer': return '/customer';
      default: return '/customer';
    }
  };

  const getNavItems = () => {
    const publicItems = [
      { label: 'Plants', path: '/plants' },
      { label: 'Medicines', path: '/medicines' },
      { label: 'Diseases', path: '/diseases' },
      { label: 'Sellers', path: '/sellers' },
    ];

    if (!user) return publicItems;

    if (userType === 'customer') {
      return [...publicItems, { label: 'My Orders', path: '/orders' }];
    }

    if (userType === 'seller') {
      return [
        { label: 'Dashboard', path: '/seller' },
        { label: 'Inventory', path: '/inventory' },
        { label: 'Orders', path: '/orders' },
      ];
    }

    if (userType === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin' },
        // { label: 'Manage Sellers', path: '/sellers' },
        { label: 'All Orders', path: '/admin/orders' },
      ];
    }

    return publicItems;
  };

  const getRoleColor = (currentUserType: UserRole | null) => {
    switch (currentUserType) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'seller': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (loading) {
    return <nav className="bg-card border-b border-border h-16" />;
  }

  return (
    <nav className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">GreenMed</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <Link key={item.path} to={item.path} className="text-muted-foreground hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{user.name}</span>
                      <Badge className={getRoleColor(userType)}>{userType}</Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`${getDashboardLink()}/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost"><Link to="/auth">Login</Link></Button>
                <Button asChild><Link to="/auth">Sign Up</Link></Button>
              </div>
            )}
            {/* --- FIX IS HERE --- */}
            {userType === 'customer' && <CartSheet />}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {/* --- AND ALSO HERE FOR MOBILE --- */}
            {userType === 'customer' && <CartSheet />}
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border">
            {/* ... mobile navigation ... */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

