import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { orderApi } from '@/lib/api';

interface Order {
  id: number;
  customerName: string;
  sellerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  items: any[];
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Customer Orders</h1>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Total: {orders.length} orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Customer</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Seller</p>
                    <p className="font-medium">{order.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">৳{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                {order.items && order.items.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Items ({order.items.length})</p>
                    <div className="text-sm text-muted-foreground">
                      {order.items.map((item, index) => (
                        <span key={index}>
                          {item.plantName || item.medicineName} (Qty: {item.quantity})
                          {index < order.items.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;