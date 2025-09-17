// File: src/pages/OrdersPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for Order data based on your backend structure
interface OrderItem {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  customerName?: string; // For sellers
  items: OrderItem[];
}

const OrdersPage = () => {
  // The correct way to get user and userType from the context
  const { user, userType } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !userType) return;

      setLoading(true);
      try {
        let response;
        if (userType === 'customer') {
          // Assuming your orderApi is set up in lib/api.ts
          response = await api.get(`/orders/customer/${user.id}`);
        } else if (userType === 'seller') {
          response = await api.get(`/orders/seller/${user.id}`);
        } else {
          // For admin or other roles, maybe fetch all orders
          // For now, we'll just leave it empty
          response = { data: [] };
        }
        setOrders(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, userType, toast]);

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'secondary';
      case 'shipped': return 'default';
      case 'processing': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 animate-grow-in">
      <h1 className="text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-6">
        View and manage your order history.
      </p>

      {orders.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <AccordionItem value={`item-${order.id}`} className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline bg-muted/50">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-left">
                      <p className="font-bold text-lg">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                      {userType === 'seller' && order.customerName && (
                         <p className="text-sm text-muted-foreground">Customer: {order.customerName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-lg">৳{order.totalAmount.toFixed(2)}</p>
                      <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 border-t">
                  <h4 className="font-semibold mb-2">Order Details:</h4>
                  <ul className="space-y-2">
                    {order.items.map(item => (
                      <li key={item.id} className="flex justify-between items-center text-sm">
                        <span>{item.itemName} (x{item.quantity})</span>
                        <span className="font-medium">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">You have no orders yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;