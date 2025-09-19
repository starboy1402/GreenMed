import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Truck, ShieldCheck, Store, ArrowRight, HeartPulse, Sparkles, Sprout, Users, Smile, Package, Loader2 } from 'lucide-react';
import { dashboardApi } from '@/lib/api'; const Index = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Index component mounted, fetching stats...');
    const fetchStats = async () => {
      try {
        console.log('Making API call to getPublicStats...');
        const response = await dashboardApi.getPublicStats();
        console.log('API response received:', response.data);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        console.log('Using fallback data...');
        // Fallback to mock data if API fails
        setStats({
          totalCustomers: 1247,
          totalSellers: 89,
          totalOrders: 2156,
          totalProducts: 3421
        });
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return `${num}+`;
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* --- Hero Section --- */}
      <section className="text-center relative bg-cover bg-center py-20 px-4 rounded-lg overflow-hidden" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=2592&auto=format&fit=crop')"
      }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Your Natural Wellness Marketplace
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
            Welcome to GreenMed, Bangladesh's premier online marketplace for all things green and growing! We connect you with a vibrant community of trusted local sellers, making it easier than ever to discover everything from medicinal plants and traditional herbal remedies to beautiful decorative flowers and essential gardening supplies.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/sellers">
                Browse Sellers <Store className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/plants">
                Explore Plants <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="text-center">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground mt-2">A simple path to natural wellness.</p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
              <Store className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">1. Discover Sellers</h3>
            <p className="text-muted-foreground mt-2">
              Explore a curated community of trusted, local sellers offering a wide variety of plants and natural products.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
              <Leaf className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">2. Find Your Remedies</h3>
            <p className="text-muted-foreground mt-2">
              Easily find the medicinal plants, herbs, and gardening supplies you need for a healthier lifestyle.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">3. Get Nature Delivered</h3>
            <p className="text-muted-foreground mt-2">
              Enjoy the convenience of secure payments and have your chosen items delivered right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* --- Statistics Section (NEW) --- */}
      <section>
        <div className="bg-muted p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Our Community in Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-10 w-10 text-primary mb-2" />
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <p className="text-3xl font-bold">{formatNumber(stats.totalSellers)}</p>
              )}
              <p className="text-muted-foreground">Verified Sellers</p>
            </div>
            <div className="flex flex-col items-center">
              <Smile className="h-10 w-10 text-primary mb-2" />
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <p className="text-3xl font-bold">{formatNumber(stats.totalCustomers)}</p>
              )}
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div className="flex flex-col items-center">
              <Package className="h-10 w-10 text-primary mb-2" />
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <p className="text-3xl font-bold">{formatNumber(stats.totalProducts)}</p>
              )}
              <p className="text-muted-foreground">Products Listed</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-10 w-10 text-primary mb-2" />
              {loading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              ) : (
                <p className="text-3xl font-bold">{formatNumber(stats.totalOrders)}</p>
              )}
              <p className="text-muted-foreground">Successful Deliveries</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Featured Categories --- */}
      <section>
        <h2 className="text-3xl font-bold text-center">Explore Our Categories</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/medicines">
            <Card className="hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Medicinal Plants</CardTitle>
                <HeartPulse className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Discover traditional and herbal remedies.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/plants">
            <Card className="hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gardening Supplies</CardTitle>
                <Sprout className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Tools, seeds, and soil for your garden.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/plants">
            <Card className="hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Decorative Plants</CardTitle>
                <Sparkles className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Beautify your home and workspace.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/diseases">
            <Card className="hover:border-primary hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Plant Care</CardTitle>
                <ShieldCheck className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Learn to diagnose and treat plant diseases.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="text-center bg-muted py-12 rounded-lg">
        <h2 className="text-3xl font-bold">Ready to Nurture a Greener Life?</h2>
        <p className="mt-2 text-muted-foreground">
          Join our community of plant lovers and wellness seekers today.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link to="/auth/signup">
            Create Your Account
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Index;

