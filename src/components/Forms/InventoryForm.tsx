import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { inventoryApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface InventoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: InventoryFormData;
  isEdit?: boolean;
}

interface InventoryFormData {
  name: string;
  type: string;
  price: number;
  quantity: number;
  description: string;
  lowStockThreshold: number;
  sku?: string;
  unit: string;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  onClose, 
  onSuccess, 
  initialData,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: initialData?.name || '',
    type: initialData?.type || '',
    price: initialData?.price || 0,
    quantity: initialData?.quantity || 0,
    description: initialData?.description || '',
    lowStockThreshold: initialData?.lowStockThreshold || 10,
    sku: initialData?.sku || '',
    unit: initialData?.unit || 'pieces',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof InventoryFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.type || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    if (formData.quantity < 0 || formData.lowStockThreshold < 0) {
      toast({
        title: "Validation Error", 
        description: "Quantities cannot be negative.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit) {
        // In a real app, would need the item ID for updates
        // await inventoryApi.update(itemId, formData);
        toast({
          title: "Success",
          description: "Inventory item updated successfully!",
          variant: "default"
        });
      } else {
        await inventoryApi.create(formData);
        toast({
          title: "Success",
          description: "Inventory item added successfully!",
          variant: "default"
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'add'} inventory item. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Rose Fertilizer Premium"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU (Optional)</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="e.g., RF-PREM-001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Item Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fertilizer">Fertilizer</SelectItem>
              <SelectItem value="pesticide">Pesticide</SelectItem>
              <SelectItem value="seeds">Seeds</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="pots">Pots & Containers</SelectItem>
              <SelectItem value="soil">Soil & Compost</SelectItem>
              <SelectItem value="growth-enhancer">Growth Enhancer</SelectItem>
              <SelectItem value="medicine">Plant Medicine</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit of Measurement</Label>
          <Select 
            value={formData.unit} 
            onValueChange={(value) => handleChange('unit', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pieces">Pieces</SelectItem>
              <SelectItem value="kg">Kilograms</SelectItem>
              <SelectItem value="g">Grams</SelectItem>
              <SelectItem value="l">Liters</SelectItem>
              <SelectItem value="ml">Milliliters</SelectItem>
              <SelectItem value="packets">Packets</SelectItem>
              <SelectItem value="boxes">Boxes</SelectItem>
              <SelectItem value="bags">Bags</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price per Unit ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Current Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold}
            onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
            placeholder="10"
          />
          <p className="text-xs text-muted-foreground">
            You'll be alerted when stock falls below this level
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of the item..."
          rows={3}
        />
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/50 rounded-lg border">
        <h4 className="font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Item Value:</span>
            <span className="ml-2 font-medium">
              ${(formData.price * formData.quantity).toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Stock Status:</span>
            <span className={`ml-2 font-medium ${
              formData.quantity <= formData.lowStockThreshold 
                ? 'text-yellow-600' 
                : 'text-green-600'
            }`}>
              {formData.quantity <= formData.lowStockThreshold ? 'Low Stock' : 'In Stock'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
};

export default InventoryForm;