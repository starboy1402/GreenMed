import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Package, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api, orderApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Interfaces to match backend data structure
interface OrderItem {
    inventoryItem: { name: string; };
    quantity: number;
    price: number;
}
interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

interface Plant {
    id: string;
    name: string;
    category: string;
    price: string; // Assuming price comes from somewhere
}

const CustomerDashboard = () => {
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [featuredPlants, setFeaturedPlants] = useState<Plant[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, plantsRes] = await Promise.all([
                    orderApi.getByCustomer(),
                    api.get('/plants') // Assuming a general endpoint for featured plants
                ]);
                // Take the 3 most recent orders
                setRecentOrders(ordersRes.data.slice(0, 3));
                // Take the first 3 plants as featured
                setFeaturedPlants(plantsRes.data.slice(0, 3).map((p: any) => ({...p, price: '15.99'}))); // Mocking price for now
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Could not load dashboard data.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Discover plants, medicines, and manage your orders
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Customer
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-20 flex-col space-y-2">
          <Link to="/sellers">
            <Store className="h-6 w-6" />
            <span>Browse Sellers</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex-col space-y-2">
          <Link to="/medicines">
            <Package className="h-6 w-6" />
            <span>Find Medicines</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex-col space-y-2">
          <Link to="/orders">
            <ShoppingCart className="h-6 w-6" />
            <span>My Orders</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-20 flex-col space-y-2">
          <Link to="/diseases">
            <Search className="h-6 w-6" />
            <span>Disease Lookup</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Orders</span>
              <Button asChild variant="ghost" size="sm">
                <Link to="/orders">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Your latest plant and medicine orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()} • {order.items.length} item(s)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">৳{order.totalAmount.toFixed(2)}</div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent orders found.</p>
            )}
          </CardContent>
        </Card>

        {/* Featured Plants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Featured Plants</span>
              <Button asChild variant="ghost" size="sm">
                <Link to="/plants">Browse All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Popular plants from our verified sellers
            </CardDescription>
          </CardHeader>
          <CardContent>
           {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            ) : featuredPlants.length > 0 ? (
              <div className="space-y-4">
                {featuredPlants.map((plant) => (
                  <div key={plant.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div>
                      <div className="font-medium">{plant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {plant.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary">৳{plant.price}</div>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/plants">View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No featured plants available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
import { Store } from 'lucide-react';