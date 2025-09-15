import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { orderApi } from '@/lib/api';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  seller: string;
}

interface Order {
  id: string;
  orderDate: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  sellerId?: string;
}

const OrdersPage = () => {
  const { role, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      orderDate: '2024-01-15',
      customerId: 'CUST-001',
      customerName: 'John Doe',
      items: [
        { id: 'ITM-001', name: 'Rose Fertilizer', quantity: 2, price: 15.99, seller: 'GreenThumb Co.' },
        { id: 'ITM-002', name: 'Plant Growth Booster', quantity: 1, price: 24.50, seller: 'PlantCare Ltd.' }
      ],
      totalAmount: 56.48,
      status: 'delivered',
      sellerId: 'SELL-001'
    },
    {
      id: 'ORD-002',
      orderDate: '2024-01-10',
      customerId: 'CUST-001', 
      customerName: 'John Doe',
      items: [
        { id: 'ITM-003', name: 'Organic Pesticide', quantity: 1, price: 18.75, seller: 'EcoGarden' }
      ],
      totalAmount: 18.75,
      status: 'processing',
      sellerId: 'SELL-002'
    },
    {
      id: 'ORD-003',
      orderDate: '2024-01-05',
      customerId: 'CUST-002',
      customerName: 'Jane Smith', 
      items: [
        { id: 'ITM-004', name: 'Tomato Seeds', quantity: 5, price: 3.99, seller: 'GreenThumb Co.' },
        { id: 'ITM-005', name: 'Potting Soil', quantity: 2, price: 12.50, seller: 'GreenThumb Co.' }
      ],
      totalAmount: 44.95,
      status: 'shipped',
      sellerId: 'SELL-001'
    }
  ];

  useEffect(() => {
    loadOrders();
  }, [role, user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call the appropriate API based on role
      // if (role === 'customer') {
      //   const response = await orderApi.getByCustomer(user?.id || '');
      // } else if (role === 'seller') {
      //   const response = await orderApi.getBySeller(user?.id || '');
      // } else {
      //   // Admin can see all orders
      //   const response = await orderApi.getAll();
      // }
      
      // Using mock data for demonstration
      setTimeout(() => {
        let filteredOrders = mockOrders;
        
        if (role === 'customer') {
          // Show only customer's orders
          filteredOrders = mockOrders.filter(order => order.customerId === 'CUST-001');
        } else if (role === 'seller') {
          // Show only orders containing seller's items
          filteredOrders = mockOrders.filter(order => order.sellerId === 'SELL-001');
        }
        
        setOrders(filteredOrders);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
      setOrders(mockOrders);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', 
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const getPageTitle = () => {
    switch (role) {
      case 'admin': return 'All Orders';
      case 'seller': return 'My Sales';
      case 'customer': return 'My Orders';
      default: return 'Orders';
    }
  };

  const getPageDescription = () => {
    switch (role) {
      case 'admin': return 'View and manage all system orders';
      case 'seller': return 'Track orders containing your inventory items';
      case 'customer': return 'View your order history and track shipments';
      default: return 'Order management';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{getPageTitle()}</h1>
          <p className="text-muted-foreground">{getPageDescription()}</p>
        </div>
        
        {role === 'customer' && (
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Order
          </Button>
        )}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'processing').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                      {(role === 'admin' || role === 'seller') && (
                        <>
                          <span>•</span>
                          <User className="h-4 w-4" />
                          <span>{order.customerName}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <div className="text-lg font-bold mt-1">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Order Items:</h4>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        × {item.quantity}
                      </span>
                      {(role === 'admin' || role === 'customer') && (
                        <div className="text-xs text-muted-foreground">
                          Seller: {item.seller}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm text-muted-foreground">
                  {order.items.length} item(s) • {order.items.reduce((sum, item) => sum + item.quantity, 0)} total quantity
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {role === 'customer' 
                ? "You haven't placed any orders yet. Browse our plant catalog to get started!"
                : "No orders match your current view. Orders will appear here when customers make purchases."
              }
            </p>
            {role === 'customer' && (
              <Button className="mt-4">
                Browse Plants
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrdersPage;