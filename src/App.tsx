// Updated App.tsx with auth route
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {  Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import PlantsPage from "./pages/PlantsPage";
import MedicinesPage from "./pages/MedicinesPage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import SellersPage from "./pages/SellersPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import DiseasesPage from "./pages/DiseasesPage";
import SellersDisplayPage from "./pages/SellersDisplayPage";
import SellerShopPage from "./pages/SellerShopPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
          <div className="min-h-screen bg-gradient-subtle">
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Routes with navbar */}
              <Route path="/*" element={
                <div>
                  <Navbar />
                  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/plants" element={<PlantsPage />} />
                      <Route path="/medicines" element={<MedicinesPage />} />
                      <Route path="/diseases" element={<DiseasesPage />} />
                       <Route path="/sellers" element={<SellersDisplayPage />} />
                      <Route path="/sellers/:sellerId" element={<SellerShopPage />} /> 

                  
                      {/* Protected routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/seller" element={
                        <ProtectedRoute requiredRole="seller">
                          <SellerDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/customer" element={
                        <ProtectedRoute requiredRole="customer">
                          <CustomerDashboard />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/inventory" element={
                        <ProtectedRoute requiredRole="seller">
                          <InventoryPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/sellers" element={
                        <ProtectedRoute requiredRole="admin">
                          <SellersPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
          </div>
       
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;