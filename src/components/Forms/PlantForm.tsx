import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { plantApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface PlantFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface PlantFormData {
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

const PlantForm: React.FC<PlantFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<PlantFormData>({
    name: '',
    scientificName: '',
    category: '',
    description: '',
    growthSeason: '',
    growthRate: '',
    waterRequirements: '',
    lightRequirements: '',
    soilType: '',
    careInstructions: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof PlantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.growthSeason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await plantApi.create(formData);
      toast({
        title: "Success",
        description: "Plant added successfully!",
        variant: "default"
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add plant. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plant Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Rose Bush"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scientificName">Scientific Name</Label>
          <Input
            id="scientificName"
            value={formData.scientificName}
            onChange={(e) => handleChange('scientificName', e.target.value)}
            placeholder="e.g., Rosa rubiginosa"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flower">Flower</SelectItem>
              <SelectItem value="vegetable">Vegetable</SelectItem>
              <SelectItem value="fruit">Fruit</SelectItem>
              <SelectItem value="herb">Herb</SelectItem>
              <SelectItem value="tree">Tree</SelectItem>
              <SelectItem value="shrub">Shrub</SelectItem>
              <SelectItem value="succulent">Succulent</SelectItem>
              <SelectItem value="grass">Grass</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthSeason">Growth Season *</Label>
          <Select 
            value={formData.growthSeason} 
            onValueChange={(value) => handleChange('growthSeason', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring">Spring</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
              <SelectItem value="autumn">Autumn</SelectItem>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="year-round">Year Round</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthRate">Growth Rate</Label>
          <Select 
            value={formData.growthRate} 
            onValueChange={(value) => handleChange('growthRate', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select growth rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="slow">Slow</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="fast">Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="waterRequirements">Water Requirements</Label>
          <Select 
            value={formData.waterRequirements} 
            onValueChange={(value) => handleChange('waterRequirements', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select water needs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lightRequirements">Light Requirements</Label>
          <Select 
            value={formData.lightRequirements} 
            onValueChange={(value) => handleChange('lightRequirements', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select light needs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-sun">Full Sun</SelectItem>
              <SelectItem value="partial-sun">Partial Sun</SelectItem>
              <SelectItem value="partial-shade">Partial Shade</SelectItem>
              <SelectItem value="full-shade">Full Shade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="soilType">Soil Type</Label>
          <Select 
            value={formData.soilType} 
            onValueChange={(value) => handleChange('soilType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select soil type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clay">Clay</SelectItem>
              <SelectItem value="sandy">Sandy</SelectItem>
              <SelectItem value="loam">Loam</SelectItem>
              <SelectItem value="silt">Silt</SelectItem>
              <SelectItem value="well-draining">Well-draining</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of the plant..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="careInstructions">Care Instructions</Label>
        <Textarea
          id="careInstructions"
          value={formData.careInstructions}
          onChange={(e) => handleChange('careInstructions', e.target.value)}
          placeholder="Detailed care instructions..."
          rows={4}
        />
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Plant
        </Button>
      </div>
    </form>
  );
};

export default PlantForm;