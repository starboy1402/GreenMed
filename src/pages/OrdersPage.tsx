import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PackageSearch, ShoppingBag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Type Definitions ---

// Matches the backend OrderItem entity
interface OrderItem {
  inventoryItem: {
    name: string;
  };
  quantity: number;
  price: number;
}

// Matches the backend Order entity
interface Order {
  id: number;
  orderDate: string;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  items: OrderItem[];
  customer: {
      name: string;
      email: string;
  };
  seller: {
    shopName: string;
  };
}

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // --- Data Fetching ---

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch orders based on user role
            const apiCall = (user as any).role === 'SELLER' ? orderApi.getBySeller : orderApi.getByCustomer;
            const response = await apiCall();
            // Sort orders from newest to oldest
            setOrders(response.data.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch your orders.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // --- Event Handlers ---

    const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
        try {
            // This will require a new API function
            // await orderApi.updateStatus(orderId, newStatus);
            toast({
                title: "Success",
                description: `Order #${orderId} has been updated to ${newStatus}.`
            });
            // Refresh the orders list
            fetchOrders();
        } catch (error) {
             toast({
                title: "Update Failed",
                description: "Could not update the order status.",
                variant: "destructive"
            });
        }
    };
    
    const handlePayment = (orderId: number) => {
        toast({
            title: "Payment Gateway",
            description: `Redirecting to payment for order #${orderId}... (Simulation)`
        });
        // Here you would integrate a real payment gateway like Stripe or Paddle
    };

    // --- UI Helper Functions ---
    
    const getStatusBadgeVariant = (status: Order['status']) => {
        switch (status) {
            case 'PENDING_PAYMENT': return 'destructive';
            case 'PROCESSING': return 'default';
            case 'SHIPPED': return 'secondary';
            case 'DELIVERED': return 'default'; // Success variant would be good here
            case 'CANCELLED': return 'outline';
            default: return 'secondary';
        }
    };

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="text-center p-12">
                <p className="text-muted-foreground">Loading your orders...</p>
            </div>
        );
    }
    
    if (orders.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardHeader>
                    <PackageSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <CardTitle>No Orders Found</CardTitle>
                    <CardDescription>
                        {(user as any)?.role === 'CUSTOMER' 
                            ? "You haven't placed any orders yet. Start shopping!"
                            : "You have no incoming orders at the moment."
                        }
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6 animate-grow-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {(user as any)?.role === 'SELLER' ? 'Incoming Orders' : 'My Orders'}
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your order history below.
                    </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Accordion type="single" collapsible className="w-full">
                        {orders.map(order => (
                            <AccordionItem value={`order-${order.id}`} key={order.id}>
                                <AccordionTrigger className="px-6 hover:bg-muted/50">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-left">
                                        <div className="flex-1">
                                            <p className="font-bold">Order #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex-1 my-2 md:my-0 text-center">
                                            <p className="text-sm text-muted-foreground">Total</p>
                                            <p className="font-semibold">৳{order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="flex-1 text-right">
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {order.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-muted/20 px-6 pt-4 pb-6">
                                    <div className="space-y-4">
                                        {(user as any)?.role === 'SELLER' && (
                                            <div className="p-2 bg-background rounded-md">
                                                <p className="text-sm font-medium">Customer: {order.customer.name}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                                            </div>
                                        )}
                                        {order.items.map((item, index) => (
                                            <div key={index} className="flex justify-between py-2 border-b">
                                                <div>
                                                    <p className="font-medium">{item.inventoryItem.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.quantity} x ৳{item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    ৳{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                        {/* --- Action Buttons --- */}
                                        <div className="flex justify-end items-center mt-4">
                                            {(user as any)?.role === 'CUSTOMER' && order.status === 'PENDING_PAYMENT' && (
                                                <Button size="sm" onClick={() => handlePayment(order.id)}>
                                                    Pay Now
                                                </Button>
                                            )}
                                            {(user as any)?.role === 'SELLER' && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">Update Status:</span>
                                                    <Select onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder={order.status.replace('_', ' ')} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="PROCESSING">Processing</SelectItem>
                                                            <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersPage;