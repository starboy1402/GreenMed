import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sellerApi } from '@/lib/api';

// This interface now matches the UserResponse DTO from the backend
interface Seller {
  id: string;
  name: string;
  email: string;
  shopName: string; // Renamed from businessName
  phoneNumber: string; // Renamed from phone
  address: string;
  applicationStatus: 'pending' | 'approved' | 'rejected'; // Renamed from status
  // appliedDate and documents are not in the UserResponse, so they are removed for now
}

interface PendingSellersTableProps {
  onUpdate?: () => void;
}

const PendingSellersTable: React.FC<PendingSellersTableProps> = ({ onUpdate }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      setLoading(true);
      // Fetching real data from the backend
      const response = await sellerApi.getPending();
      setSellers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending sellers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      await sellerApi.approve(sellerId);
      toast({
        title: "Success",
        description: "Seller approved successfully!",
      });
      onUpdate?.(); // This will re-fetch the list
      loadSellers(); // Re-fetch the list to update the UI
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve seller",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (sellerId: string) => {
    try {
      await sellerApi.reject(sellerId);
      toast({
        title: "Success",
        description: "Seller application rejected",
      });
      onUpdate?.(); // This will re-fetch the list
      loadSellers(); // Re-fetch the list to update the UI
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject seller",
        variant: "destructive"
      });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading sellers...</p>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
        <p className="text-muted-foreground">
          No pending seller applications at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sellers.map((seller) => (
        <Card key={seller.id} className="hover:shadow-medium transition-smooth">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              {/* Seller Information */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{seller.shopName}</h3>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending Review
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-muted-foreground">Owner:</span>
                    <span>{seller.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <a href={`mailto:${seller.email}`} className="text-primary hover:underline">
                      {seller.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{seller.phoneNumber}</span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-sm">Address:</span>
                    <p className="text-sm">{seller.address}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-row lg:flex-col gap-2 lg:min-w-[120px]">
                <Button
                  onClick={() => handleApprove(seller.id)}
                  size="sm"
                  className="flex-1 lg:flex-none bg-success hover:bg-success/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(seller.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 lg:flex-none border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PendingSellersTable;