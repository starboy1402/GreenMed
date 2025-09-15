import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { sellerApi } from '@/lib/api';
import PendingSellersTable from '@/components/Tables/PendingSellersTable';

interface Seller {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  documents?: string[];
}

const SellersPage = () => {
  const [pendingSellers, setPendingSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPendingSellers: Seller[] = [
    {
      id: 'SELL-001',
      name: 'Alice Johnson',
      email: 'alice@greenthumb.com',
      businessName: 'GreenThumb Gardens',
      phone: '+1-555-0123',
      address: '123 Garden St, Plant City, PC 12345',
      status: 'pending',
      appliedDate: '2024-01-10',
      documents: ['business_license.pdf', 'tax_certificate.pdf']
    },
    {
      id: 'SELL-002',
      name: 'Bob Smith',
      email: 'bob@ecogardens.com',
      businessName: 'Eco Gardens Supply',
      phone: '+1-555-0456',
      address: '456 Nature Ave, Green Valley, GV 67890',
      status: 'pending',
      appliedDate: '2024-01-12',
      documents: ['business_registration.pdf']
    },
    {
      id: 'SELL-003',
      name: 'Carol Davis',
      email: 'carol@plantparadise.com',
      businessName: 'Plant Paradise',
      phone: '+1-555-0789',
      address: '789 Flora Blvd, Bloom Town, BT 54321',
      status: 'pending',
      appliedDate: '2024-01-14',
      documents: ['license.pdf', 'insurance.pdf', 'references.pdf']
    }
  ];

  useEffect(() => {
    loadPendingSellers();
  }, []);

  const loadPendingSellers = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const response = await sellerApi.getPending();
      // setPendingSellers(response.data);
      
      // Using mock data for demonstration
      setTimeout(() => {
        setPendingSellers(mockPendingSellers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending sellers",
        variant: "destructive"
      });
      setPendingSellers(mockPendingSellers);
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      // await sellerApi.approve(sellerId);
      
      setPendingSellers(prev => prev.filter(seller => seller.id !== sellerId));
      
      toast({
        title: "Success",
        description: "Seller approved successfully!",
        variant: "default"
      });
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
      // await sellerApi.reject(sellerId);
      
      setPendingSellers(prev => prev.filter(seller => seller.id !== sellerId));
      
      toast({
        title: "Success", 
        description: "Seller application rejected",
        variant: "default"
      });
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading seller applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Seller Management</h1>
        <p className="text-muted-foreground">
          Review and approve seller applications to join the marketplace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSellers.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              New sellers approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Sellers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              Currently selling
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Sellers */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>
            Review seller applications and make approval decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSellers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No pending applications</h3>
              <p className="text-muted-foreground">
                All seller applications have been reviewed. New applications will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSellers.map((seller) => (
                <div key={seller.id} className="border rounded-lg p-6 hover:bg-muted/50 transition-smooth">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{seller.businessName}</h3>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Owner:</span>
                          <span className="ml-2 font-medium">{seller.name}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <span className="ml-2">{seller.email}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="ml-2">{seller.phone}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Applied:</span>
                          <span className="ml-2">{new Date(seller.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <span className="text-muted-foreground text-sm">Address:</span>
                        <span className="ml-2 text-sm">{seller.address}</span>
                      </div>

                      {seller.documents && seller.documents.length > 0 && (
                        <div className="mt-3">
                          <span className="text-muted-foreground text-sm">Documents:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {seller.documents.map((doc, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {doc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-6">
                      <Button
                        onClick={() => handleApprove(seller.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(seller.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellersPage;