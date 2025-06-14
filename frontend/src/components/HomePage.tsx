import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TrendingUp, Package, Clock, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Stat Card Component with Animated Counter
interface StatCardProps {
  number: string;
  text: string;
}

// Testimonial Card Component
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const HomePage = () => {
  const navigate = useNavigate();

  
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6"
          >
            Hotel Inventory Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8"
          >
            Optimize your hotel operations with HotelStock’s AI-powered inventory solution. Track, manage, and streamline supplies effortlessly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a
              href="#get-started"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
             Get Start
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Why HotelStock Stands Out
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HotelStock</h3>
              <p className="text-gray-400">Empowering hotels with smart inventory solutions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white">Features</li>
                <li className="hover:text-white">Pricing</li>
                <li className="hover:text-white">Demo</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white">About Us</li>
                <li className="hover:text-white">Contact</li>
                <li className="hover:text-white">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white">Help Center</li>
                <li className="hover:text-white">Documentation</li>
                <li className="hover:text-white">System Status</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center text-gray-400">
            &copy; {new Date().getFullYear()} HotelStock. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};



const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
  >
    <div className="mb-4 text-indigo-600">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);


const StatCard = ({ number, text }: StatCardProps) => {
  const controls = useAnimation();
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
    let start = 0;
    const end = parseInt(number.replace(/[^0-9]/g, '')) || 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.ceil(start));
    }, 16);

    return () => clearInterval(counter);
  }, [controls, number]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
    >
      <div className="text-5xl font-bold mb-4">
        {number.includes('%') ? `${count}%` : number.includes('+') ? `${count}+` : count}
      </div>
      <div className="text-indigo-100 text-lg">{text}</div>
    </motion.div>
  );
};


const TestimonialCard = ({ quote, author, role }: TestimonialCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow-md"
  >
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-600 mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-gray-500">{role}</p>
    </div>
  </motion.div>
);

// Data for Features, Stats, and Testimonials
const features = [
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Real-time Analytics',
    description: 'Gain insights into stock levels and consumption patterns with live data dashboards.',
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Smart Inventory',
    description: 'Automate tracking and reordering to ensure you never run out of critical supplies.',
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Time Efficiency',
    description: 'Streamline operations with automation, freeing up time for what matters most.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    description: 'Protect your data with advanced encryption and secure cloud infrastructure.',
  },
];

const stats = [
  { number: '10+', text: 'Hotels Worldwide' },
  { number: '99%', text: 'System Uptime' },
  { number: '365', text: 'Expert Support' },
];

const testimonials = [
  {
    quote: 'HotelStock transformed our inventory process, saving us hours every week.',
    author: 'Emma Thompson',
    role: 'General Manager, Sunset Resorts',
  },
  {
    quote: 'The analytics dashboard gives us insights we never had before. Highly recommend!',
    author: 'James Patel',
    role: 'Operations Director, City Lodge',
  },
  {
    quote: 'Their support team is incredible—always there when we need them.',
    author: 'Maria Gonzalez',
    role: 'Procurement Lead, Oceanview Hotels',
  },
];

export default HomePage;