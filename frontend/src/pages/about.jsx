import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWheelchair, FaClipboardCheck, FaCog, FaHandsHelping, FaHome, FaUsers } from 'react-icons/fa';

const About = () => {
  const [services] = useState([
    { icon: FaWheelchair, title: 'Personal Support', description: 'Tailored in-home and community assistance for daily living.' },
    { icon: FaClipboardCheck, title: 'NDIS Management', description: 'Expert plan management and support coordination services.' },
    { icon: FaCog, title: 'Assistive Technology', description: 'Cutting-edge solutions to enhance independence and quality of life.' },
    { icon: FaHandsHelping, title: 'Respite Care', description: 'Flexible respite options to support both individuals and carers.' },
    { icon: FaHome, title: 'Supported Living', description: 'Assistance in finding and maintaining suitable accommodation.' },
    { icon: FaUsers, title: 'Community Engagement', description: 'Programs to foster social connections and community participation.' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      {/* Hero Section */}
      <div className="hero min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-80"></div>
        <div className="hero-content text-center text-white relative z-10">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-8 text-7xl font-bold font-heading text-shadow-lg">Empowering Lives with InclusiveAid</h1>
            <p className="mb-12 text-2xl font-light">Revolutionizing disability support with comprehensive services and innovative technology.</p>
            <motion.button 
              className="btn btn-primary btn-lg rounded-full px-8 py-4 text-xl font-semibold"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Services
            </motion.button>
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-20 animate-blob"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-300 to-yellow-300 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </div>

      {/* Mission and Vision */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-8 text-indigo-600 font-heading">Our Mission</h2>
            <p className="text-2xl text-gray-600 mb-12">To revolutionize disability support by providing innovative, person-centered services that empower individuals to live independently and achieve their full potential.</p>
            <h2 className="text-5xl font-bold mb-8 text-indigo-600 font-heading">Our Vision</h2>
            <p className="text-2xl text-gray-600">A world where every individual, regardless of ability, has equal opportunities to thrive, supported by cutting-edge care and technology.</p>
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-32 bg-gradient-to-br from-indigo-100 to-purple-200 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 text-indigo-600 font-heading">Comprehensive Support Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <motion.div 
                key={index}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden transform perspective-1000"
                initial={{ opacity: 0, rotateY: -15, translateZ: -100 }}
                whileInView={{ opacity: 1, rotateY: 0, translateZ: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateY: 5, translateZ: 20 }}
                viewport={{ once: true }}
              >
                <div className="card-body p-8">
                  <service.icon className="text-6xl text-indigo-600 mb-6" />
                  <h3 className="card-title text-3xl text-indigo-600 font-heading mb-4">{service.title}</h3>
                  <p className="text-xl text-gray-600 font-light">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-pink-200 to-yellow-200 rounded-full opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Why Choose InclusiveAid */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-bold text-center mb-20 text-indigo-600 font-heading">Why Choose InclusiveAid</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-body p-12">
                <h3 className="card-title text-3xl mb-6 font-heading">Innovative Approach</h3>
                <p className="text-xl font-light">We leverage cutting-edge technology and personalized care strategies to provide unparalleled support tailored to each individual's unique needs and aspirations.</p>
              </div>
            </motion.div>
            <motion.div 
              className="card bg-gradient-to-br from-pink-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="card-body p-12">
                <h3 className="card-title text-3xl mb-6 font-heading">Holistic Support</h3>
                <p className="text-xl font-light">Our comprehensive range of services ensures that every aspect of an individual's life is supported, from daily living to community engagement and personal growth.</p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 font-heading">Ready to Transform Your Support Experience?</h2>
            <p className="text-xl mb-12">Join InclusiveAid today and discover a world of possibilities. Let us empower you to live your best life.</p>
            <motion.button 
              className="btn btn-primary btn-lg rounded-full px-8 py-4 text-xl font-semibold bg-white text-indigo-600"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-br from-opacity-30 to-opacity-0 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div>
      </section>
    </div>
  );
};

export default About;