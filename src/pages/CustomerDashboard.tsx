import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Package, ShoppingCart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CustomerDashboard = () => {
  const recentOrders = [
    { id: '#ORD-001', date: '2024-01-15', items: 3, total: '$45.99', status: 'Delivered' },
    { id: '#ORD-002', date: '2024-01-10', items: 1, total: '$12.50', status: 'Processing' },
    { id: '#ORD-003', date: '2024-01-05', items: 2, total: '$28.75', status: 'Shipped' },
  ];

  const featuredPlants = [
    { name: 'Rose Bush', category: 'Flower', price: '$15.99' },
    { name: 'Tomato Plant', category: 'Vegetable', price: '$8.50' },
    { name: 'Lavender', category: 'Herb', price: '$12.00' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-success text-success-foreground';
      case 'Processing': return 'bg-warning text-warning-foreground';
      case 'Shipped': return 'bg-accent text-accent-foreground';
      default: return 'bg-secondary text-secondary-foreground';
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
          <Link to="/plants">
            <Leaf className="h-6 w-6" />
            <span>Browse Plants</span>
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
          <Link to="/plants">
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
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <div className="font-medium">{order.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.date} • {order.items} item(s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{order.total}</div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {featuredPlants.map((plant) => (
                <div key={plant.name} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div>
                    <div className="font-medium">{plant.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {plant.category}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-primary">{plant.price}</div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plant Care Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Plant Care Tips</CardTitle>
          <CardDescription>
            Essential tips for healthy plant growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium text-primary mb-2">Watering Schedule</h4>
              <p className="text-sm text-muted-foreground">
                Check soil moisture before watering. Most plants prefer slightly dry soil between waterings.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/20">
              <h4 className="font-medium text-success mb-2">Light Requirements</h4>
              <p className="text-sm text-muted-foreground">
                Place plants according to their light needs. Observe and adjust position as seasons change.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <h4 className="font-medium text-accent mb-2">Disease Prevention</h4>
              <p className="text-sm text-muted-foreground">
                Inspect plants regularly for signs of disease. Early detection prevents spread to other plants.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDashboard;