import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { medicineApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface MedicineFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface MedicineFormData {
  name: string;
  description: string;
  type: string;
  activeIngredient: string;
  dosage: string;
  applicationMethod: string;
  targetDiseases: string;
  safetyInstructions: string;
  manufacturer: string;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<MedicineFormData>({
    name: '',
    description: '',
    type: '',
    activeIngredient: '',
    dosage: '',
    applicationMethod: '',
    targetDiseases: '',
    safetyInstructions: '',
    manufacturer: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof MedicineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.type || !formData.activeIngredient) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await medicineApi.create(formData);
      toast({
        title: "Success",
        description: "Medicine added successfully!",
        variant: "default"
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medicine. Please try again.",
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
          <Label htmlFor="name">Medicine Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., FungiCure Pro"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Medicine Type *</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
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

        <div className="space-y-2">
          <Label htmlFor="activeIngredient">Active Ingredient *</Label>
          <Input
            id="activeIngredient"
            value={formData.activeIngredient}
            onChange={(e) => handleChange('activeIngredient', e.target.value)}
            placeholder="e.g., Copper Sulfate"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => handleChange('manufacturer', e.target.value)}
            placeholder="e.g., PlantCare Inc."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => handleChange('dosage', e.target.value)}
            placeholder="e.g., 2-3 ml per liter of water"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationMethod">Application Method</Label>
          <Select 
            value={formData.applicationMethod} 
            onValueChange={(value) => handleChange('applicationMethod', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spray">Foliar Spray</SelectItem>
              <SelectItem value="soil-drench">Soil Drench</SelectItem>
              <SelectItem value="dust">Dusting</SelectItem>
              <SelectItem value="injection">Injection</SelectItem>
              <SelectItem value="granular">Granular Application</SelectItem>
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
          placeholder="Brief description of the medicine..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetDiseases">Target Diseases</Label>
        <Textarea
          id="targetDiseases"
          value={formData.targetDiseases}
          onChange={(e) => handleChange('targetDiseases', e.target.value)}
          placeholder="List diseases this medicine treats (separated by commas)..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="safetyInstructions">Safety Instructions</Label>
        <Textarea
          id="safetyInstructions"
          value={formData.safetyInstructions}
          onChange={(e) => handleChange('safetyInstructions', e.target.value)}
          placeholder="Important safety guidelines for handling and application..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Medicine
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;