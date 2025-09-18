import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, AlertTriangle, ListOrdered, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dashboardApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// --- Type Definitions ---
interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  customer: {
    name: string;
  };
}

interface SellerStats {
  totalRevenue: number;
  activeOrders: number;
  lowStockItems: number;
  totalProducts: number;
  recentOrders: Order[];
}

const SellerDashboard = () => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getSellerStats();
      setStats(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'PENDING_PAYMENT': return 'destructive';
        case 'PROCESSING': return 'default';
        case 'SHIPPED': return 'secondary';
        case 'DELIVERED': return 'default';
        case 'CANCELLED': return 'outline';
        default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-grow-in">
      <h1 className="text-3xl font-bold">Seller Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-3/4" /> : (
              <div className="text-2xl font-bold">৳{stats?.totalRevenue.toFixed(2)}</div>
            )}
            <p className="text-xs text-muted-foreground">From all completed sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">+{stats?.activeOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">Orders to be fulfilled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold text-yellow-600">{stats?.lowStockItems}</div>
            )}
            <p className="text-xs text-muted-foreground">Items needing restock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            )}
            <p className="text-xs text-muted-foreground">Items in your inventory</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your shop's core functions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button asChild className="w-full justify-start text-base py-6">
                    <Link to="/inventory">
                        <ClipboardList className="mr-4 h-5 w-5" />
                        Manage Inventory
                    </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-base py-6">
                    <Link to="/orders">
                        <ListOrdered className="mr-4 h-5 w-5" />
                        View All Orders
                    </Link>
                </Button>
            </CardContent>
        </Card>
        
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Here are the 5 most recent orders for your shop.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : stats && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer.name} - {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">৳{order.totalAmount.toFixed(2)}</div>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent orders found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
