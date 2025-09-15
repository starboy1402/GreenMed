import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { inventoryApi } from '@/lib/api';
import InventoryForm from '@/components/Forms/InventoryForm';
import InventoryTable from '@/components/Tables/InventoryTable';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  sellerId: string;
  description: string;
  lowStockThreshold: number;
}

const InventoryPage = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockInventory: InventoryItem[] = [
    {
      id: 'INV-001',
      name: 'Rose Fertilizer Premium',
      type: 'fertilizer',
      price: 15.99,
      quantity: 45,
      sellerId: 'SELL-001',
      description: 'High-quality organic fertilizer specifically formulated for roses',
      lowStockThreshold: 10
    },
    {
      id: 'INV-002',
      name: 'Plant Growth Booster',
      type: 'growth-enhancer',
      price: 24.50,
      quantity: 8,
      sellerId: 'SELL-001',
      description: 'Advanced formula to boost plant growth and development',
      lowStockThreshold: 15
    },
    {
      id: 'INV-003',
      name: 'Organic Pest Control',
      type: 'pesticide',
      price: 18.75,
      quantity: 23,
      sellerId: 'SELL-001',
      description: 'Natural and safe pest control solution for all plants',
      lowStockThreshold: 10
    },
    {
      id: 'INV-004',
      name: 'Tomato Plant Seeds',
      type: 'seeds',
      price: 3.99,
      quantity: 150,
      sellerId: 'SELL-001',
      description: 'Premium heirloom tomato seeds with high germination rate',
      lowStockThreshold: 20
    }
  ];

  useEffect(() => {
    loadInventory();
  }, [user]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API with seller ID
      // const response = await inventoryApi.getBySeller(user?.id || '');
      // setInventory(response.data);
      
      // Using mock data for demonstration
      setTimeout(() => {
        setInventory(mockInventory);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive"
      });
      setInventory(mockInventory);
      setLoading(false);
    }
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.lowStockThreshold);
  };

  const getOutOfStockItems = () => {
    return inventory.filter(item => item.quantity === 0);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      fertilizer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      pesticide: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      seeds: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      tools: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'growth-enhancer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your product inventory, track stock levels, and update pricing
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)} units in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalValue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getLowStockItems().length}
            </div>
            <p className="text-xs text-muted-foreground">
              Items below threshold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {getOutOfStockItems().length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires restocking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {getLowStockItems().length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-yellow-700 dark:text-yellow-300">
              The following items are running low and may need restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getLowStockItems().map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-yellow-100 dark:bg-yellow-800/20 rounded-md">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {item.quantity} left
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your product inventory and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable inventory={inventory} onUpdate={loadInventory} />
        </CardContent>
      </Card>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-card shadow-strong overflow-y-auto">
          <CardHeader>
            <CardTitle>Add New Inventory Item</CardTitle>
            <CardDescription>
              Add a new product to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm 
              onClose={() => setShowAddForm(false)} 
              onSuccess={() => {
                loadInventory();
                setShowAddForm(false);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryPage;