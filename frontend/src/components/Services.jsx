import { motion } from 'framer-motion';
import { FaUserCog, FaHome, FaUsers } from 'react-icons/fa';

const services = [
  {
    icon: FaUserCog,
    title: "Personalized Care Plans",
    description: "We tailor support plans based on individual needs and preferences."
  },
  {
    icon: FaHome,
    title: "In-Home Support",
    description: "Assistance with daily living activities, medication management, and mobility."
  },
  {
    icon: FaUsers,
    title: "Community Integration",
    description: "Support in accessing community resources and building social connections."
  }
];

const Services = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-accent-50 to-secondary-50">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="section-title text-primary-800 font-display"
        >
          Our Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="section-subtitle text-base-content/80 font-body"
        >
          Empowering individuals with disabilities through comprehensive support and care.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="card bg-white shadow-lg card-hover rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.2, ease: 'easeOut' }}
            >
              <div className="card-body flex flex-col items-center text-center">
                <div className="avatar mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center">
                    <service.icon className="text-4xl text-white" />
                  </div>
                </div>
                <h3 className="card-title text-2xl text-primary-800 mb-2 font-display">{service.title}</h3>
                <p className="text-lg text-base-content/80 font-body">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;