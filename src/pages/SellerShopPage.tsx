import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Store, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

// We'll also define a basic Seller type for displaying shop info
interface Seller {
    id: string;
    shopName: string;
}

const SellerShopPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) return;
      try {
        setLoading(true);
        // We'll use Promise.all to fetch inventory and seller info concurrently in the future
        // For now, let's just fetch the inventory
        const inventoryRes = await api.get(`/inventory/seller/${sellerId}`);
        setInventory(inventoryRes.data);
        
        // In a real app, you would have an endpoint like `/users/seller/${sellerId}`
        // For now, we'll just mock the seller's name.
        setSeller({ id: sellerId, shopName: `Seller #${sellerId}'s Shop` });

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load seller's shop.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [sellerId, toast]);

  const handleAddToCart = (item: InventoryItem) => {
    if (!sellerId) return;
    addToCart({ id: item.id, name: item.name, price: item.price, quantity: 1 }, sellerId);
    setAddedItemId(item.id);
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
    setTimeout(() => setAddedItemId(null), 1500); // Reset button state after 1.5 seconds
  };
  
  if (loading) {
    return (
        <div className="text-center p-12">
            <p className="text-muted-foreground">Loading shop...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Store className="h-8 w-8 text-primary"/> 
            {seller?.shopName || 'Seller Shop'}
        </h1>
        <p className="text-muted-foreground mt-2">Browse all items available from this seller.</p>
      </div>

      {inventory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>In Stock: {item.quantity}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                    <p className="text-lg font-semibold mb-4">৳{item.price.toFixed(2)}</p>
                    <Button onClick={() => handleAddToCart(item)} disabled={addedItemId === item.id || item.quantity === 0}>
                      {item.quantity === 0 ? 'Out of Stock' : (
                          addedItemId === item.id ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Added
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                            </>
                          )
                      )}
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
      ) : (
        <Card>
            <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">This shop has no items yet.</h3>
                <p className="text-muted-foreground">
                    Check back later for new products!
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SellerShopPage;