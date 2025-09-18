import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Define a more detailed Order type
interface OrderItem {
    inventoryItem: {
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    orderDate: string;
    status: 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
    items: OrderItem[];
    seller: {
        shopName: string;
    };
}

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderApi.getByCustomer();
                setOrders(response.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch your orders.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user, toast]);
    
    // ... (rest of the component, including JSX to display orders)
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Orders</h1>
            {loading ? <p>Loading orders...</p> : (
                <Accordion type="single" collapsible className="w-full">
                    {orders.map(order => (
                        <AccordionItem value={`order-${order.id}`} key={order.id}>
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4">
                                    <span>Order #{order.id}</span>
                                    <span>৳{order.totalAmount.toFixed(2)}</span>
                                    <Badge>{order.status}</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b">
                                        <span>{item.inventoryItem.name} (x{item.quantity})</span>
                                        <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="text-right mt-2">
                                    <Button size="sm">Pay Now</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </div>
    );
};

export default OrdersPage;