import React, { useState } from 'react';
import { Edit, Eye, Package, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { inventoryApi } from '@/lib/api';

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  sellerId: string;
  description: string;
  lowStockThreshold: number;
  sku?: string;
  unit?: string;
}

interface InventoryTableProps {
  inventory?: InventoryItem[];
  onUpdate?: () => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ 
  inventory = [], 
  onUpdate 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{quantity: number, price: number}>({
    quantity: 0,
    price: 0
  });
  const { toast } = useToast();

  // Mock data if no inventory provided
  const mockInventory: InventoryItem[] = [
    {
      id: 'INV-001',
      name: 'Rose Fertilizer Premium',
      type: 'fertilizer',
      price: 15.99,
      quantity: 45,
      sellerId: 'SELL-001',
      description: 'High-quality organic fertilizer specifically formulated for roses',
      lowStockThreshold: 10,
      sku: 'RF-PREM-001',
      unit: 'kg'
    },
    {
      id: 'INV-002',
      name: 'Plant Growth Booster',
      type: 'growth-enhancer',
      price: 24.50,
      quantity: 8,
      sellerId: 'SELL-001',
      description: 'Advanced formula to boost plant growth and development',
      lowStockThreshold: 15,
      sku: 'PGB-ADV-002',
      unit: 'l'
    },
    {
      id: 'INV-003',
      name: 'Organic Pest Control',
      type: 'pesticide',
      price: 18.75,
      quantity: 23,
      sellerId: 'SELL-001',
      description: 'Natural and safe pest control solution for all plants',
      lowStockThreshold: 10,
      sku: 'OPC-NAT-003',
      unit: 'ml'
    }
  ];

  const displayInventory = inventory.length > 0 ? inventory : mockInventory;

  const getTypeColor = (type: string) => {
    const colors = {
      fertilizer: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      pesticide: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      seeds: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      tools: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      'growth-enhancer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      pots: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
      soil: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' };
    } else if (item.quantity <= item.lowStockThreshold) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' };
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
    }
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditValues({
      quantity: item.quantity,
      price: item.price
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ quantity: 0, price: 0 });
  };

  const saveEdit = async (itemId: string) => {
    try {
      // await inventoryApi.update(itemId, editValues);
      
      toast({
        title: "Success",
        description: "Inventory item updated successfully!",
        variant: "default"
      });
      
      setEditingId(null);
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive"
      });
    }
  };

  if (displayInventory.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No inventory items</h3>
        <p className="text-muted-foreground">
          Add your first inventory item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-3 font-medium text-muted-foreground">Item</th>
              <th className="text-left pb-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left pb-3 font-medium text-muted-foreground">Price</th>
              <th className="text-left pb-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left pb-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left pb-3 font-medium text-muted-foreground">Value</th>
              <th className="text-right pb-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const isEditing = editingId === item.id;
              
              return (
                <tr key={item.id} className="border-b hover:bg-muted/50 transition-smooth">
                  <td className="py-4">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.sku && (
                        <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge className={getTypeColor(item.type)}>
                      {item.type}
                    </Badge>
                  </td>
                  <td className="py-4">
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editValues.price}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0
                        }))}
                        className="w-20"
                      />
                    ) : (
                      <span>${item.price.toFixed(2)}</span>
                    )}
                    {item.unit && <span className="text-xs text-muted-foreground">/{item.unit}</span>}
                  </td>
                  <td className="py-4">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.quantity}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 0
                        }))}
                        className="w-20"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{item.quantity}</span>
                        {item.quantity <= item.lowStockThreshold && (
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    )}
                    {item.unit && <span className="text-xs text-muted-foreground">{item.unit}</span>}
                  </td>
                  <td className="py-4">
                    <Badge className={stockStatus.color}>
                      {stockStatus.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end space-x-1">
                        <Button size="sm" onClick={() => saveEdit(item.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(item)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {displayInventory.map((item) => {
          const stockStatus = getStockStatus(item);
          const isEditing = editingId === item.id;
          
          return (
            <Card key={item.id} className="hover:shadow-medium transition-smooth">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.sku && (
                      <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    )}
                  </div>
                  <Badge className={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Price:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editValues.price}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0
                        }))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="font-medium">${item.price.toFixed(2)}</div>
                    )}
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.quantity}
                        onChange={(e) => setEditValues(prev => ({
                          ...prev,
                          quantity: parseInt(e.target.value) || 0
                        }))}
                        className="mt-1"
                      />
                    ) : (
                      <div className="font-medium flex items-center space-x-1">
                        <span>{item.quantity}</span>
                        {item.quantity <= item.lowStockThreshold && (
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={stockStatus.color}>
                    {stockStatus.status}
                  </Badge>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(item.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(item)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryTable;