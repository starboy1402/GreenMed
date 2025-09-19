import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Loader2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { orderApi } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CartSheet = () => {
  const { cartItems, removeFromCart, updateItemQuantity, getCartTotal, clearCart, sellerId } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleCheckout = async () => {
    if (!sellerId || cartItems.length === 0) {
      toast({ title: "Cart is empty!", variant: "destructive" });
      return;
    }

    // Validate shipping address
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.country) {
      toast({ title: "Please fill in all required shipping address fields!", variant: "destructive" });
      return;
    }

    setIsCheckingOut(true);
    const orderData = {
      sellerId: sellerId,
      items: cartItems.map(item => ({
        inventoryItemId: item.id,
        quantity: item.quantity,
      })),
      shippingAddress: shippingAddress
    };
    try {
      await orderApi.create(orderData);
      toast({
        title: "Order Placed!",
        description: "Your order has been created and is pending payment.",
      });
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast({
        title: "Checkout Failed",
        description: "There was an issue placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          {cartItems.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto pr-4 mt-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ৳{item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <SheetFooter className="mt-auto border-t pt-4">
                <div className="w-full space-y-4">
                  {/* Shipping Address Form */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Shipping Address</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label htmlFor="street">Street Address *</Label>
                        <Input
                          id="street"
                          value={shippingAddress.street}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                          placeholder="123 Main St"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            placeholder="Dhaka"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            placeholder="Dhaka"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input
                            id="zipCode"
                            value={shippingAddress.zipCode}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                            placeholder="1200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Input
                            id="country"
                            value={shippingAddress.country}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                            placeholder="Bangladesh"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>৳{getCartTotal().toFixed(2)}</span>
                  </div>
                  <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut || cartItems.length === 0}>
                    {isCheckingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add items from a seller's shop to get started.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
