import React, { useState } from 'react';
import { Package, Plus, TrendingUp, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import InventoryForm from '@/components/Forms/InventoryForm';
import InventoryTable from '@/components/Tables/InventoryTable';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showInventoryForm, setShowInventoryForm] = useState(false);

  const stats = [
    {
      title: 'Total Inventory',
      value: '156',
      change: '+12 items',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: 'Active Orders',
      value: '23',
      change: '+5 today',
      icon: ShoppingCart,
      color: 'text-accent'
    },
    {
      title: 'Revenue',
      value: '$2,340',
      change: '+15%',
      icon: TrendingUp,
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your inventory, track orders, and grow your business
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Verified Seller
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common seller tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setShowInventoryForm(true)}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Inventory Item
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Link Plants
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates to your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New order #1234</span>
                    <Badge variant="secondary">2h ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Inventory updated</span>
                    <Badge variant="secondary">5h ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plant linked</span>
                    <Badge variant="secondary">1d ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Inventory Management</h3>
            <Button onClick={() => setShowInventoryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          <InventoryTable />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <h3 className="text-lg font-semibold">Order Management</h3>
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders containing your inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No orders found. Orders will appear here when customers purchase your items.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inventory Form */}
      {showInventoryForm && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-card shadow-strong">
          <CardHeader>
            <CardTitle>Add Inventory Item</CardTitle>
            <CardDescription>
              Add a new item to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm onClose={() => setShowInventoryForm(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerDashboard;