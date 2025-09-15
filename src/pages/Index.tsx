import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Users, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { role } = useAuth();

  const features = [
    {
      icon: Leaf,
      title: 'Plant Management',
      description: 'Comprehensive catalog of plants with detailed information, growth requirements, and disease management.',
      link: '/plants'
    },
    {
      icon: Package,
      title: 'Inventory Control', 
      description: 'Real-time inventory tracking for medicines, fertilizers, and plant care products.',
      link: role === 'seller' ? '/inventory' : '/medicines'
    },
    {
      icon: Users,
      title: 'Multi-Role System',
      description: 'Separate workflows for administrators, sellers, and customers with role-based permissions.',
      link: `/${role}`
    },
    {
      icon: ShoppingCart,
      title: 'Order Management',
      description: 'Streamlined ordering process with order tracking and seller management.',
      link: '/orders'
    }
  ];

  const getDashboardLink = () => {
    switch(role) {
      case 'admin': return '/admin';
      case 'seller': return '/seller'; 
      case 'customer': return '/customer';
      default: return '/customer';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-medium animate-leaf-float">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-grow-in">
              Plant Management
              <span className="bg-gradient-primary bg-clip-text text-transparent block">
                System
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-grow-in">
              Complete solution for managing plants, inventory, diseases, medicines, and orders. 
              Designed for admins, sellers, and customers with intuitive role-based workflows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-grow-in">
              <Button asChild size="lg" className="bg-gradient-primary hover:bg-gradient-nature transition-smooth">
                <Link to={getDashboardLink()}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/plants">
                  Browse Plants
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to streamline plant management workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={feature.title} className="group hover:shadow-medium transition-smooth cursor-pointer">
              <Link to={feature.link}>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                      <feature.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Plant Varieties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Verified Sellers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
