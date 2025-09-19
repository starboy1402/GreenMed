import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { sellerApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserCheck, UserX, Shield, ShieldOff, Mail, Phone, MapPin, Store } from 'lucide-react';

interface Seller {
  id: string;
  name: string;
  email: string;
  shopName?: string;
  phoneNumber?: string;
  address?: string;
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  isActive: boolean;
}

const ManageSellersPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    try {
      setLoading(true);
      const response = await sellerApi.getAll();
      setSellers(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sellers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (sellerId: string, isActive: boolean) => {
    try {
      await sellerApi.updateActiveStatus(sellerId, isActive);
      setSellers(prev => prev.map(seller =>
        seller.id === sellerId ? { ...seller, isActive } : seller
      ));
      toast({
        title: "Success",
        description: `Seller ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update seller status",
        variant: "destructive"
      });
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      await sellerApi.approve(sellerId);
      setSellers(prev => prev.map(seller =>
        seller.id === sellerId ? { ...seller, applicationStatus: 'APPROVED' as const } : seller
      ));
      toast({
        title: "Success",
        description: "Seller approved successfully",
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
      await sellerApi.reject(sellerId);
      setSellers(prev => prev.map(seller =>
        seller.id === sellerId ? { ...seller, applicationStatus: 'REJECTED' as const } : seller
      ));
      toast({
        title: "Success",
        description: "Seller rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject seller",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'default';
      case 'PENDING': return 'secondary';
      case 'REJECTED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <UserCheck className="h-4 w-4" />;
      case 'PENDING': return <Users className="h-4 w-4" />;
      case 'REJECTED': return <UserX className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Sellers</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Sellers</h1>
          <p className="text-muted-foreground">View and manage all seller accounts</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {sellers.length} Total Sellers
        </Badge>
      </div>

      <div className="grid gap-4">
        {sellers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Sellers Found</h3>
              <p className="text-muted-foreground">There are no seller accounts in the system yet.</p>
            </CardContent>
          </Card>
        ) : (
          sellers.map((seller) => (
            <Card key={seller.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(seller.applicationStatus)}
                      <CardTitle className="text-lg">{seller.name}</CardTitle>
                    </div>
                    <Badge variant={getStatusBadgeVariant(seller.applicationStatus)}>
                      {seller.applicationStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <Switch
                      checked={seller.isActive}
                      onCheckedChange={(checked) => handleStatusChange(seller.id, checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{seller.email}</span>
                    </div>
                    {seller.shopName && (
                      <div className="flex items-center gap-2 text-sm">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span>{seller.shopName}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {seller.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{seller.phoneNumber}</span>
                      </div>
                    )}
                    {seller.address && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{seller.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  {seller.applicationStatus === 'PENDING' && (
                    <>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="default">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Approve Seller</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to approve {seller.name}? This will allow them to start selling on the platform.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApprove(seller.id)}>
                              Approve
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Seller</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject {seller.name}'s application? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleReject(seller.id)}>
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {seller.applicationStatus === 'APPROVED' && seller.isActive && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Active Seller</span>
                    </div>
                  )}

                  {seller.applicationStatus === 'APPROVED' && !seller.isActive && (
                    <div className="flex items-center gap-2 text-red-600">
                      <ShieldOff className="h-4 w-4" />
                      <span className="text-sm font-medium">Login Restricted</span>
                    </div>
                  )}

                  {seller.applicationStatus === 'REJECTED' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <UserX className="h-4 w-4" />
                      <span className="text-sm font-medium">Application Rejected</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageSellersPage;