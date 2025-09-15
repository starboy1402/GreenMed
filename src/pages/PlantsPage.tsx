import React, { useState, useEffect } from 'react';
import { Search, Filter, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { plantApi } from '@/lib/api';

interface Plant {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  description: string;
  growthSeason: string;
  growthRate: string;
  waterRequirements: string;
  lightRequirements: string;
  soilType: string;
  careInstructions: string;
}

const PlantsPage = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [rateFilter, setRateFilter] = useState('all');
  const { toast } = useToast();

  // Mock data for demonstration
  const mockPlants: Plant[] = [
    {
      id: '1',
      name: 'Rose Bush',
      scientificName: 'Rosa rubiginosa',
      category: 'flower',
      description: 'Beautiful flowering shrub with fragrant blooms and thorny stems.',
      growthSeason: 'spring',
      growthRate: 'medium',
      waterRequirements: 'medium',
      lightRequirements: 'full-sun',
      soilType: 'well-draining',
      careInstructions: 'Prune in late winter, water regularly during growing season.'
    },
    {
      id: '2',
      name: 'Tomato Plant',
      scientificName: 'Solanum lycopersicum',
      category: 'vegetable',
      description: 'Productive vegetable plant producing nutritious red fruits.',
      growthSeason: 'summer',
      growthRate: 'fast',
      waterRequirements: 'high',
      lightRequirements: 'full-sun',
      soilType: 'loam',
      careInstructions: 'Support with stakes, water consistently, fertilize regularly.'
    },
    {
      id: '3',
      name: 'Lavender',
      scientificName: 'Lavandula angustifolia',
      category: 'herb',
      description: 'Aromatic herb with purple flowers, perfect for relaxation and cooking.',
      growthSeason: 'spring',
      growthRate: 'slow',
      waterRequirements: 'low',
      lightRequirements: 'full-sun',
      soilType: 'sandy',
      careInstructions: 'Drought tolerant once established, prune after flowering.'
    },
    {
      id: '4',
      name: 'Apple Tree',
      scientificName: 'Malus domestica',
      category: 'fruit',
      description: 'Deciduous fruit tree producing crisp, sweet apples.',
      growthSeason: 'spring',
      growthRate: 'medium',
      waterRequirements: 'medium',
      lightRequirements: 'full-sun',
      soilType: 'well-draining',
      careInstructions: 'Prune in dormant season, thin fruit for better quality.'
    }
  ];

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the API
      // const response = await plantApi.getAll();
      // setPlants(response.data);
      
      // Using mock data for demonstration
      setTimeout(() => {
        setPlants(mockPlants);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load plants",
        variant: "destructive"
      });
      setPlants(mockPlants); // Fallback to mock data
      setLoading(false);
    }
  };

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plant.category === categoryFilter;
    const matchesSeason = seasonFilter === 'all' || plant.growthSeason === seasonFilter;
    const matchesRate = rateFilter === 'all' || plant.growthRate === rateFilter;
    
    return matchesSearch && matchesCategory && matchesSeason && matchesRate;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      flower: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300',
      vegetable: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      fruit: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
      herb: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      tree: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300',
      shrub: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-grow-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Plant Catalog</h1>
        <p className="text-muted-foreground">
          Discover and learn about various plants, their care requirements, and growing conditions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="flower">Flowers</SelectItem>
                  <SelectItem value="vegetable">Vegetables</SelectItem>
                  <SelectItem value="fruit">Fruits</SelectItem>
                  <SelectItem value="herb">Herbs</SelectItem>
                  <SelectItem value="tree">Trees</SelectItem>
                  <SelectItem value="shrub">Shrubs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Growth Season</label>
              <Select value={seasonFilter} onValueChange={setSeasonFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All seasons" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Seasons</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="autumn">Autumn</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="year-round">Year Round</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Growth Rate</label>
              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All rates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rates</SelectItem>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPlants.length} of {plants.length} plants
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setSeasonFilter('all');
                setRateFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlants.map((plant) => (
          <Card key={plant.id} className="hover:shadow-medium transition-smooth group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="group-hover:text-primary transition-smooth">
                    {plant.name}
                  </CardTitle>
                  <CardDescription className="italic">
                    {plant.scientificName}
                  </CardDescription>
                </div>
                <Badge className={getCategoryColor(plant.category)}>
                  {plant.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {plant.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Growth Season:</span>
                  <Badge variant="outline">{plant.growthSeason}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Growth Rate:</span>
                  <Badge variant="outline">{plant.growthRate}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Water Needs:</span>
                  <Badge variant="outline">{plant.waterRequirements}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Light Needs:</span>
                  <Badge variant="outline">{plant.lightRequirements}</Badge>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No plants found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find plants.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlantsPage;