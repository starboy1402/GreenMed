// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Leaf, Users, Package, ShoppingCart } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { useAuth } from '@/context/AuthContext';

// const Index = () => {
//   const { userType } = useAuth();

//   const features = [
//     {
//       icon: Leaf,
//       title: 'Plant Management',
//       description: 'Comprehensive catalog of plants with detailed information, growth requirements, and disease management.',
//       link: '/plants'
//     },
//     {
//       icon: Package,
//       title: 'Inventory Control',
//       description: 'Real-time inventory tracking for medicines, fertilizers, and plant care products.',
//       link: userType === 'seller' ? '/inventory' : '/medicines'
//     },
//     {
//       icon: Users,
//       title: 'Multi-Role System',
//       description: 'Separate workflows for administrators, sellers, and customers with role-based permissions.',
//       link: `/${userType}`
//     },
//     {
//       icon: ShoppingCart,
//       title: 'Order Management',
//       description: 'Streamlined ordering process with order tracking and seller management.',
//       link: '/orders'
//     }
//   ];

//   const getDashboardLink = () => {
//     switch (userType) {
//       case 'admin': return '/admin';
//       case 'seller': return '/seller';
//       case 'customer': return '/customer';
//       default: return '/customer';
//     }
//   }; return (
//     <div className="min-h-screen bg-gradient-subtle">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
//           <div className="text-center">
//             <div className="flex justify-center mb-6">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-medium animate-leaf-float">
//                 <Leaf className="h-8 w-8 text-primary-foreground" />
//               </div>
//             </div>

//             <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-grow-in">
//               Plant Management System

//             </h1>

//             <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-grow-in">
//               Welcome to GreenMed, Bangladesh's premier online marketplace for all things green and growing! 
//               We connect you with a vibrant community of trusted local sellers, making it easier than ever to discover 
//               everything from medicinal plants and traditional herbal remedies to beautiful decorative flowers and essential gardening supplies. 
//               Whether you're a seasoned gardener looking for rare seeds or seeking natural wellness solutions, GreenMed is your one-stop destination to nurture a healthier, greener lifestyle. Explore our sellers, find the perfect plants for your home, 
//               and embrace the power of nature, delivered right to your doorstep.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center animate-grow-in">
//               <Button asChild size="lg" className="bg-gradient-primary hover:bg-gradient-nature transition-smooth">
//                 <Link to={getDashboardLink()}>
//                   Go to Dashboard
//                   <ArrowRight className="ml-2 h-5 w-5" />
//                 </Link>
//               </Button>

//               <Button asChild variant="outline" size="lg">
//                 <Link to="/plants">
//                   Browse Plants
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>



//       {/* Stats Section */}
//       <div className="bg-card border-y">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//             <div>
//               <div className="text-3xl font-bold text-primary mb-2">500+</div>
//               <div className="text-muted-foreground">Plant Varieties</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-primary mb-2">1000+</div>
//               <div className="text-muted-foreground">Active Users</div>
//             </div>
//             <div>
//               <div className="text-3xl font-bold text-primary mb-2">50+</div>
//               <div className="text-muted-foreground">Verified Sellers</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Truck, ShieldCheck, Store, ArrowRight, HeartPulse, Sparkles, Sprout, Users, Smile, Package, Loader2 } from 'lucide-react';
import { dashboardApi } from '@/lib/api';

const Index = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSellers: 0,
    totalOrders: 0,
    totalProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getPublicStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Keep default values if API fails
      } finally {
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
      <section className="text-center relative bg-cover bg-center py-20 px-4 rounded-lg overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1491147334573-44cbb4602074?q=80&w=2592&auto=format&fit=crop')" }}>
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

