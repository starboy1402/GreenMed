import React, { useState } from 'react';
import { Plus, Users, Leaf, Pill, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PlantForm from '@/components/Forms/PlantForm';
import DiseaseForm from '@/components/Forms/DiseaseForm';
import MedicineForm from '@/components/Forms/MedicineForm';
import PendingSellersTable from '@/components/Tables/PendingSellersTable';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [showDiseaseForm, setShowDiseaseForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const { toast } = useToast();

  const stats = [
    {
      title: 'Total Plants',
      value: '1,234',
      change: '+12%',
      icon: Leaf,
      color: 'text-success'
    },
    {
      title: 'Pending Sellers',
      value: '23',
      change: '+5',
      icon: Users,
      color: 'text-warning'
    },
    {
      title: 'Active Medicines',
      value: '456',
      change: '+8%',
      icon: Pill,
      color: 'text-accent'
    },
    {
      title: 'System Health',
      value: '98%',
      change: 'Optimal',
      icon: CheckCircle,
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage plants, diseases, medicines, and approve sellers
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Administrator
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-medium transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-success" />
                  <span>Recent Plants</span>
                </CardTitle>
                <CardDescription>
                  Latest additions to the plant catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Rose Bush', 'Tomato Plant', 'Oak Tree'].map((plant) => (
                    <div key={plant} className="flex items-center justify-between">
                      <span className="text-sm">{plant}</span>
                      <Badge variant="secondary">New</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-warning" />
                  <span>Pending Actions</span>
                </CardTitle>
                <CardDescription>
                  Items requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Seller Applications</span>
                    <Badge variant="outline">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plant Approvals</span>
                    <Badge variant="outline">5</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Updates</span>
                    <Badge variant="outline">2</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setShowPlantForm(true)}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Plant
                </Button>
                <Button 
                  onClick={() => setShowDiseaseForm(true)}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Disease
                </Button>
                <Button 
                  onClick={() => setShowMedicineForm(true)}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medicine
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plants" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Plant Management</h3>
            <Button onClick={() => setShowPlantForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Plant
            </Button>
          </div>
          {showPlantForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Plant</CardTitle>
                <CardDescription>
                  Add a new plant to the system catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlantForm onClose={() => setShowPlantForm(false)} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diseases" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Disease Management</h3>
            <Button onClick={() => setShowDiseaseForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Disease
            </Button>
          </div>
          {showDiseaseForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Disease</CardTitle>
                <CardDescription>
                  Register a new plant disease in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DiseaseForm onClose={() => setShowDiseaseForm(false)} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Seller Management</h3>
            <PendingSellersTable />
          </div>
        </TabsContent>
      </Tabs>

      {/* Medicine Form Modal */}
      {showMedicineForm && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto bg-card shadow-strong">
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
            <CardDescription>
              Add a new medicine to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicineForm onClose={() => setShowMedicineForm(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;