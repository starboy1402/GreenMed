import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, role, setRole, logout } = useAuth();
  const location = useLocation();

  const roleColors = {
    admin: 'bg-destructive text-destructive-foreground',
    seller: 'bg-warning text-warning-foreground', 
    customer: 'bg-accent text-accent-foreground'
  };

  const navigationItems = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: Settings },
      { path: '/plants', label: 'Plants', icon: Leaf },
      { path: '/sellers', label: 'Sellers', icon: Users },
    ],
    seller: [
      { path: '/seller', label: 'Dashboard', icon: Package },
      { path: '/inventory', label: 'Inventory', icon: Package },
      { path: '/plants', label: 'Plants', icon: Leaf },
      { path: '/orders', label: 'Orders', icon: ShoppingCart },
    ],
    customer: [
      { path: '/customer', label: 'Dashboard', icon: User },
      { path: '/plants', label: 'Browse Plants', icon: Leaf },
      { path: '/medicines', label: 'Medicines', icon: Package },
      { path: '/orders', label: 'My Orders', icon: ShoppingCart },
    ],
  };

  const currentNavItems = navigationItems[role] || navigationItems.customer;

  const isActivePath = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <nav className="border-b bg-card shadow-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PlantMS</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {currentNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Role Switcher (for demo purposes) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Badge className={roleColors[role]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRole('admin')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('seller')}>
                  <Package className="mr-2 h-4 w-4" />
                  Seller View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRole('customer')}>
                  <User className="mr-2 h-4 w-4" />
                  Customer View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {user?.name || 'Demo User'}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {currentNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;