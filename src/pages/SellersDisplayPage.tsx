import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, User, Phone, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; // We will add a new endpoint here

interface Seller {
  id: string;
  name: string;
  shopName: string;
  phoneNumber: string;
  address: string;
}

const SellersDisplayPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/sellers');
        setSellers(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load sellers.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [toast]);

  if (loading) {
    return <div>Loading sellers...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Our Sellers</h1>
        <p className="text-muted-foreground">Browse our community of trusted plant and medicine suppliers.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <Link to={`/sellers/${seller.id}`} key={seller.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-6 w-6 text-primary" />
                  {seller.shopName}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <User className="h-4 w-4" />
                    <span>{seller.name}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{seller.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{seller.address}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/sellers/${seller.id}/reviews`}>
                    <Star className="h-4 w-4 mr-2" />
                    View Reviews
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SellersDisplayPage;