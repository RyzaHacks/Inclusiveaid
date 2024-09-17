// services.jsx
import { motion } from 'framer-motion';
import { FaWheelchair, FaClipboardCheck, FaCog, FaUsers, FaHome, FaHandsHelping } from 'react-icons/fa';
import ClientPortalDemo from '../components/ClientPortalDemo';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div 
    className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
    whileHover={{ scale: 1.05 }}
  >
    <div className="card-body">
      <Icon className="text-4xl text-indigo-600 mb-4" />
      <h3 className="card-title text-2xl mb-2 text-indigo-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const Services = () => {
  const services = [
    { icon: FaWheelchair, title: "Personal Support", description: "Tailored in-home and community assistance for daily living." },
    { icon: FaClipboardCheck, title: "NDIS Management", description: "Expert plan management and support coordination services." },
    { icon: FaCog, title: "Assistive Technology", description: "Cutting-edge solutions to enhance independence and quality of life." },
    { icon: FaHandsHelping, title: "Respite Care", description: "Flexible respite options to support both individuals and carers." },
    { icon: FaHome, title: "Supported Living", description: "Assistance in finding and maintaining suitable accommodation." },
    { icon: FaUsers, title: "Community Engagement", description: "Programs to foster social connections and community participation." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <section className="hero py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">Empowering Independence</h1>
            <p className="text-xl mb-8">Comprehensive support services enhanced by our innovative Client Portal.</p>
            <button className="btn btn-primary btn-lg bg-white text-indigo-600 hover:bg-indigo-100 border-2 border-white">Explore Services</button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-800">Client Portal Dashboard</h2>
          <ClientPortalDemo />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-indigo-800">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <FeatureCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take the first step towards enhanced independence and support. Contact us today to learn more about our services and how we can help you achieve your goals.
          </p>
          <button className="btn btn-primary btn-lg bg-white text-indigo-600 hover:bg-indigo-100 border-2 border-white">Contact Us Today</button>
        </div>
      </section>
    </div>
  );
};

export default Services;