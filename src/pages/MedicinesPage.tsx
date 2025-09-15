import React, { useState, useEffect } from 'react';
import { Search, Pill, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { medicineApi } from '@/lib/api';

interface Medicine {
  id: string;
  name: string;
  type: string;
  activeIngredient: string;
  description: string;
  dosage: string;
  applicationMethod: string;
  targetDiseases: string;
  safetyInstructions: string;
  manufacturer: string;
}

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockMedicines: Medicine[] = [
    {
      id: '1',
      name: 'FungiCure Pro',
      type: 'fungicide',
      activeIngredient: 'Copper Sulfate',
      description: 'Effective broad-spectrum fungicide for controlling various plant diseases.',
      dosage: '2-3 ml per liter of water',
      applicationMethod: 'spray',
      targetDiseases: 'Powdery Mildew, Black Spot, Rust',
      safetyInstructions: 'Wear gloves and eye protection. Apply in cool weather.',
      manufacturer: 'PlantCare Solutions'
    },
    {
      id: '2',
      name: 'GreenGuard Insecticide',
      type: 'insecticide',
      activeIngredient: 'Neem Oil',
      description: 'Organic insecticide effective against soft-bodied insects.',
      dosage: '5 ml per liter of water',
      applicationMethod: 'spray',
      targetDiseases: 'Aphids, Whiteflies, Scale Insects',
      safetyInstructions: 'Safe for beneficial insects when used as directed.',
      manufacturer: 'EcoPlant Inc.'
    },
    {
      id: '3',
      name: 'Root Boost Fertilizer',
      type: 'fertilizer',
      activeIngredient: 'NPK 10-10-10',
      description: 'Balanced fertilizer for healthy root development and overall plant growth.',
      dosage: '1 tablespoon per plant',
      applicationMethod: 'granular',
      targetDiseases: 'Nutrient Deficiency, Poor Growth',
      safetyInstructions: 'Water thoroughly after application. Keep away from children.',
      manufacturer: 'Garden Pro'
    },
    {
      id: '4',
      name: 'BioShield Bactericide',
      type: 'bactericide',
      activeIngredient: 'Streptomycin',
      description: 'Antibiotic treatment for bacterial infections in plants.',
      dosage: '1 gram per liter of water',
      applicationMethod: 'spray',
      targetDiseases: 'Fire Blight, Bacterial Wilt, Soft Rot',
      safetyInstructions: 'Use protective equipment. Follow withdrawal periods.',
      manufacturer: 'AgriScience Labs'
    }
  ];

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the API
      // const response = await medicineApi.getAll();
      // setMedicines(response.data);
      
      // Using mock data for demonstration
      setTimeout(() => {
        setMedicines(mockMedicines);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load medicines",
        variant: "destructive"
      });
      setMedicines(mockMedicines);
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.targetDiseases.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || medicine.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      fungicide: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      insecticide: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      herbicide: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      bactericide: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      fertilizer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      'growth-regulator': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      organic: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Pill className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Plant Medicines</h1>
        <p className="text-muted-foreground">
          Browse available medicines and treatments for plant diseases and health
        </p>
      </div>

      {/* Safety Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Always read and follow safety instructions before using any plant medicine. 
          Consult with agricultural experts for proper dosage and application methods.
        </AlertDescription>
      </Alert>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Medicines</CardTitle>
          <CardDescription>
            Find the right treatment for your plants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines, ingredients, or diseases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Medicine Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="fungicide">Fungicide</SelectItem>
                  <SelectItem value="insecticide">Insecticide</SelectItem>
                  <SelectItem value="herbicide">Herbicide</SelectItem>
                  <SelectItem value="bactericide">Bactericide</SelectItem>
                  <SelectItem value="fertilizer">Fertilizer</SelectItem>
                  <SelectItem value="growth-regulator">Growth Regulator</SelectItem>
                  <SelectItem value="organic">Organic Treatment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMedicines.length} of {medicines.length} medicines
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <Card key={medicine.id} className="hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {medicine.manufacturer}
                  </CardDescription>
                </div>
                <Badge className={getTypeColor(medicine.type)}>
                  {medicine.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {medicine.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Active Ingredient:</span>
                  <span className="text-right">{medicine.activeIngredient}</span>
                </div>
                
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Dosage:</span>
                  <span className="text-right">{medicine.dosage}</span>
                </div>
                
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Application:</span>
                  <span className="text-right capitalize">{medicine.applicationMethod}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Treats:</h4>
                <p className="text-xs text-muted-foreground">
                  {medicine.targetDiseases}
                </p>
              </div>

              {medicine.safetyInstructions && (
                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <h4 className="text-xs font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Safety Instructions:
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    {medicine.safetyInstructions}
                  </p>
                </div>
              )}

              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No medicines found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find medicines.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicinesPage;