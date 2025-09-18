import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { orderApi, paymentApi } from '@/lib/api'; // Make sure to import paymentApi
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { PackageSearch, ShoppingBag, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaymentDialog from '@/components/Layout/PaymentDialog'; // Import the new dialog

// --- Type Definitions ---
interface OrderItem {
  inventoryItem: { name: string; };
  quantity: number;
  price: number;
}
interface Order {
  id: number;
  orderDate: string;
  status: 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  items: OrderItem[];
  customer: { name: string; email: string; };
  seller: { shopName: string; };
}

const OrdersPage = () => {
    const { user, userType } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
    const [payingOrder, setPayingOrder] = useState<Order | null>(null); // State to manage which order to pay for
    const { toast } = useToast();

    const fetchOrders = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const apiCall = userType === 'seller' ? orderApi.getBySeller : orderApi.getByCustomer;
            const response = await apiCall();
            setOrders(response.data.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        } catch (error) {
            toast({ title: "Error", description: "Failed to fetch your orders.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [user, userType, toast]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
        setUpdatingOrderId(orderId);
        try {
            await orderApi.updateStatus(orderId, newStatus);
            toast({
                title: "Success",
                description: `Order #${orderId} has been updated to ${newStatus}.`
            });
            fetchOrders();
        } catch (error) {
             toast({ title: "Update Failed", description: "Could not update the order status.", variant: "destructive" });
        } finally {
            setUpdatingOrderId(null);
        }
    };
    
    const getStatusBadgeVariant = (status: Order['status']) => {
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
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {userType === 'seller' ? 'Incoming Orders' : 'My Orders'}
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage your order history below.
                    </p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary" />
            </div>

            {loading && !orders.length ? (
                 <div className="text-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                 </div>
            ) : orders.length === 0 ? (
                 <Card className="text-center py-12">
                    <CardHeader>
                        <PackageSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <CardTitle>No Orders Found</CardTitle>
                        <CardDescription>
                            {userType === 'customer' 
                                ? "You haven't placed any orders yet. Start shopping!"
                                : "You have no incoming orders at the moment."
                            }
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                            {orders.map(order => (
                                <AccordionItem value={`order-${order.id}`} key={order.id} className="border-b last:border-b-0">
                                    <AccordionTrigger className="px-6 hover:bg-muted/50 text-left">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-2">
                                            <div className="flex-1">
                                                <p className="font-bold">Order #{order.id}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex-1 my-2 md:my-0 md:text-center">
                                                <p className="text-sm text-muted-foreground">Total</p>
                                                <p className="font-semibold">৳{order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div className="flex-1 md:text-right">
                                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                                    {order.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="bg-muted/20 px-6 pt-4 pb-6">
                                        <div className="space-y-4">
                                            {userType === 'seller' && (
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
                                            <div className="flex justify-end items-center mt-4">
                                                {userType === 'customer' && order.status === 'PENDING_PAYMENT' && (
                                                    <Button size="sm" onClick={() => setPayingOrder(order)} disabled={updatingOrderId === order.id}>
                                                        Pay Now
                                                    </Button>
                                                )}
                                                {userType === 'seller' && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">Update Status:</span>
                                                        <Select onValueChange={(value) => handleStatusUpdate(order.id, value as Order['status'])} disabled={updatingOrderId === order.id}>
                                                            <SelectTrigger className="w-[180px]">
                                                                <SelectValue placeholder="Change status..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PROCESSING">Processing</SelectItem>
                                                                <SelectItem value="SHIPPED">Shipped</SelectItem>
                                                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        {updatingOrderId === order.id && <Loader2 className="h-4 w-4 animate-spin" />}
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
            )}
            
            {payingOrder && (
              <PaymentDialog
                isOpen={!!payingOrder}
                orderId={payingOrder.id}
                amount={payingOrder.totalAmount}
                onClose={() => setPayingOrder(null)}
                onSuccess={() => {
                  setPayingOrder(null);
                  fetchOrders();
                }}
              />
            )}
        </div>
    );
};

export default OrdersPage;

