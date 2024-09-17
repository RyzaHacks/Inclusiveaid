// About.jsx
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHeart, FaLeaf, FaUsers, FaHome, FaCalendarAlt } from 'react-icons/fa';

const About = () => {
  const [services] = useState([
    { icon: <FaHome className="text-4xl text-primary-400" />, title: "In-Home Support", description: "Comprehensive care tailored to your home environment" },
    { icon: <FaUsers className="text-4xl text-secondary-400" />, title: "Expert Caregivers", description: "Compassionate professionals dedicated to your well-being" },
    { icon: <FaCalendarAlt className="text-4xl text-accent-400" />, title: "Customized Care Plans", description: "Personalized strategies to enhance your quality of life" },
  ]);

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/image.png"
                alt="About InclusiveAid"
                layout="responsive"
                width={600}
                height={400}
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <motion.div
              className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-secondary-400 to-accent-400 flex items-center justify-center shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <FaHeart className="text-white text-5xl" />
            </motion.div>
            <motion.div
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <FaLeaf className="text-white text-6xl" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-5xl font-bold mb-8 text-primary-800 font-display">
              Empowering Lives, Fostering Independence
            </h2>
            <p className="text-2xl leading-relaxed mb-12 text-gray-700">
              At InclusiveAid, we are dedicated to transforming lives through exceptional care and unwavering support. Our passionate team of professionals crafts bespoke care plans, nurturing independence and elevating the quality of life for individuals with disabilities.
            </p>
            <div className="card bg-white/80 backdrop-blur-sm p-10">
              <h3 className="card-title text-3xl mb-4 text-primary-800">Our Mission</h3>
              <p className="text-xl leading-relaxed mb-6 text-gray-700">
                Empowering individuals with disabilities to lead independent, fulfilling lives through compassionate care and unwavering support.
              </p>
              <motion.button 
                className="btn btn-primary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary-800 font-display">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="card bg-white/80 backdrop-blur-sm p-10 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="mb-8 w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  {service.icon}
                </div>
                <h3 className="card-title text-3xl mb-4">{service.title}</h3>
                <p className="text-xl text-gray-700">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-br from-primary-300/20 to-secondary-300/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-gradient-to-br from-secondary-300/20 to-accent-300/20 rounded-full filter blur-3xl" />
    </section>
  );
};

export default About;