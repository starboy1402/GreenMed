import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Package, ShoppingCart, AlertTriangle, ListOrdered, ClipboardList, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dashboardApi, reviewApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

// --- Type Definitions ---
interface Order {
  id: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhoneNumber: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface SellerStats {
  totalRevenue: number;
  activeOrders: number;
  lowStockItems: number;
  totalProducts: number;
  recentOrders: Order[];
}

interface SellerRating {
  averageRating: number;
  totalReviews: number;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    name: string;
  };
}

const SellerDashboard = () => {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [rating, setRating] = useState<SellerRating | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

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

  const fetchRating = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await reviewApi.getSellerRating(user.id.toString());
      setRating(response.data);
    } catch (error) {
      console.log('No rating data available yet');
      setRating({ averageRating: 0, totalReviews: 0 });
    }
  }, [user]);

  const fetchReviews = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await reviewApi.getReviewsBySeller(user.id.toString());
      setReviews(response.data);
    } catch (error) {
      console.log('Failed to fetch reviews');
      setReviews([]);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
    fetchRating();
    fetchReviews();
  }, [fetchStats, fetchRating, fetchReviews]);

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6 animate-grow-in">
      <h1 className="text-3xl font-bold">Seller Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shop Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold text-yellow-600">
                {rating?.averageRating.toFixed(1) || '0.0'}
                <span className="text-sm text-muted-foreground ml-1">/5</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {rating?.totalReviews || 0} customer reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your shop and explore the platform.</CardDescription>
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
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-3">Explore Catalog</p>
              <Button asChild variant="outline" className="w-full justify-start text-sm py-4 mb-2">
                <Link to="/plants">
                  🌱 Browse Plants
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-sm py-4 mb-2">
                <Link to="/medicines">
                  💊 Browse Medicines
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start text-sm py-4">
                <Link to="/diseases">
                  🦠 Browse Diseases
                </Link>
              </Button>
            </div>
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
                        {order.customerName} - {new Date(order.orderDate).toLocaleDateString()}
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

      {/* Customer Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
          <CardDescription>Recent feedback from your customers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.reviewer.name}</span>
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {reviews.length > 5 && (
                <div className="text-center pt-2">
                  <Button asChild variant="outline">
                    <Link to={`/sellers/${user?.id}/reviews`}>
                      View All Reviews ({reviews.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews yet. Reviews will appear here once customers leave feedback.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;
