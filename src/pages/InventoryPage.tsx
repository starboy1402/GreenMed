import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  unit: string;
}

const InventoryPage = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadInventory();
    }
  }, [user]);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryApi.getBySeller();
      setInventory(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inventory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleSuccess = () => {
    loadInventory();
    handleFormClose();
  };

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.lowStockThreshold);
  };

  // ... (rest of the component remains the same)

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
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Stats Cards and Low Stock Alert ... */}

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            Manage your product inventory and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable inventory={inventory} onEdit={handleEdit} />
        </CardContent>
      </Card>

      {/* Add/Edit Item Form Modal */}
      {showForm && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-card shadow-strong overflow-y-auto">
          <CardHeader>
            <CardTitle>{editingItem ? 'Edit' : 'Add New'} Inventory Item</CardTitle>
            <CardDescription>
              {editingItem ? 'Update the details of your item.' : 'Add a new product to your inventory.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm
              onClose={handleFormClose}
              onSuccess={handleSuccess}
              initialData={editingItem}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryPage;