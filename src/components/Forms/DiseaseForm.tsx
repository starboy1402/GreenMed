import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { diseaseApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface DiseaseFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface DiseaseFormData {
  name: string;
  description: string;
  symptoms: string;
  cause: string;
  prevention: string;
  treatment: string;
  severity: string;
  affectedPlants: string;
}

const DiseaseForm: React.FC<DiseaseFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState<DiseaseFormData>({
    name: '',
    description: '',
    symptoms: '',
    cause: '',
    prevention: '',
    treatment: '',
    severity: '',
    affectedPlants: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof DiseaseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.symptoms || !formData.severity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await diseaseApi.create(formData);
      toast({
        title: "Success",
        description: "Disease added successfully!",
        variant: "default"
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add disease. Please try again.",
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
          <Label htmlFor="name">Disease Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Powdery Mildew"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity">Severity Level *</Label>
          <Select 
            value={formData.severity} 
            onValueChange={(value) => handleChange('severity', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="affectedPlants">Affected Plants</Label>
          <Input
            id="affectedPlants"
            value={formData.affectedPlants}
            onChange={(e) => handleChange('affectedPlants', e.target.value)}
            placeholder="e.g., Roses, Tomatoes, Cucumber"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cause">Cause</Label>
          <Input
            id="cause"
            value={formData.cause}
            onChange={(e) => handleChange('cause', e.target.value)}
            placeholder="e.g., Fungal infection, Bacteria"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Brief description of the disease..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Symptoms *</Label>
        <Textarea
          id="symptoms"
          value={formData.symptoms}
          onChange={(e) => handleChange('symptoms', e.target.value)}
          placeholder="List the visible symptoms of this disease..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prevention">Prevention Methods</Label>
        <Textarea
          id="prevention"
          value={formData.prevention}
          onChange={(e) => handleChange('prevention', e.target.value)}
          placeholder="How to prevent this disease..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Treatment</Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => handleChange('treatment', e.target.value)}
          placeholder="How to treat this disease..."
          rows={3}
        />
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Add Disease
        </Button>
      </div>
    </form>
  );
};

export default DiseaseForm;