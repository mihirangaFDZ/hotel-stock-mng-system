import React from 'react';
import { TrendingUp, Package, Clock, Shield } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">
                Smart Hotel Inventory Management
              </h1>
              <p className="text-xl mb-8 max-w-2xl">
                Streamline your hotel's inventory management with our comprehensive solution. 
                Track supplies, manage stock levels, and optimize your operations effortlessly.
              </p>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose HotelStock?</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8 text-indigo-600" />}
            title="Real-time Analytics"
            description="Monitor stock levels and consumption patterns with advanced analytics"
          />
          <FeatureCard 
            icon={<Package className="w-8 h-8 text-indigo-600" />}
            title="Smart Inventory"
            description="Automated tracking and reordering of supplies when stocks run low"
          />
          <FeatureCard 
            icon={<Clock className="w-8 h-8 text-indigo-600" />}
            title="Time Saving"
            description="Reduce manual work and save precious time with automation"
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-indigo-600" />}
            title="Secure Data"
            description="Your inventory data is protected with enterprise-grade security"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="500+" text="Hotels Using Our System" />
            <StatCard number="99.9%" text="System Uptime" />
            <StatCard number="24/7" text="Customer Support" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StatCard = ({ number, text }: { number: string; text: string }) => (
  <div>
    <div className="text-4xl font-bold mb-2">{number}</div>
    <div className="text-indigo-100">{text}</div>
  </div>
);

export default HomePage;