import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, User, ShoppingCart, UserCheck, Leaf, Pill, Bug, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { dashboardApi } from '@/lib/api';
import PendingSellersTable from '@/components/Tables/PendingSellersTable';
import PlantForm from '@/components/Forms/PlantForm';
import DiseaseForm from '@/components/Forms/DiseaseForm';
import MedicineForm from '@/components/Forms/MedicineForm';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStats {
  totalCustomers: number;
  totalSellers: number;
  totalOrders: number;
  pendingSellers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState<'plant' | 'disease' | 'medicine' | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getAdminStats();
      setStats(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleFormSuccess = () => {
    setShowForm(null);
    toast({ title: "Success", description: "Catalog item added successfully." });
  };

  return (
    <div className="space-y-6 animate-grow-in">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">{stats?.totalCustomers}</div>
            )}
            <p className="text-xs text-muted-foreground">Total registered customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">{stats?.totalSellers}</div>
            )}
            <p className="text-xs text-muted-foreground">All seller accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">+{stats?.totalOrders}</div>
            )}
            <p className="text-xs text-muted-foreground">Count of all paid orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sellers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-1/2" /> : (
              <div className="text-2xl font-bold">{stats?.pendingSellers}</div>
            )}
            <p className="text-xs text-muted-foreground">Applications awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Add new items to the global catalog.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => setShowForm('plant')}>
            <Leaf className="mr-2 h-4 w-4" /> Add Plant
          </Button>
          <Button onClick={() => setShowForm('medicine')} variant="outline">
            <Pill className="mr-2 h-4 w-4" /> Add Medicine
          </Button>
          <Button onClick={() => setShowForm('disease')} variant="outline">
            <Bug className="mr-2 h-4 w-4" /> Add Disease
          </Button>
        </CardContent>
      </Card>
      
      {/* Pending Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Seller Applications</CardTitle>
          <CardDescription>Review and approve or reject new seller sign-ups.</CardDescription>
        </CardHeader>
        <CardContent>
          <PendingSellersTable onUpdate={fetchStats} />
        </CardContent>
      </Card>

      {/* Add Item Forms Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <Card className="w-full max-w-2xl animate-grow-in">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Add New {showForm === 'plant' ? 'Plant' : showForm === 'medicine' ? 'Medicine' : 'Disease'}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowForm(null)}><Plus className="h-4 w-4 rotate-45" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {showForm === 'plant' && <PlantForm onClose={() => setShowForm(null)} onSuccess={handleFormSuccess} />}
                {showForm === 'medicine' && <MedicineForm onClose={() => setShowForm(null)} onSuccess={handleFormSuccess} />}
                {showForm === 'disease' && <DiseaseForm onClose={() => setShowForm(null)} onSuccess={handleFormSuccess} />}
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

