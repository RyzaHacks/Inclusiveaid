// Hero.jsx
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaWheelchair, FaHeart, FaHome, FaUsers } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-100 to-secondary-100">
      {/* Background Image */}
      <div className="absolute inset-0 mix-blend-overlay opacity-30">
        <Image
          src="/bg.webp"
          alt="Hero background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:w-1/2"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight text-gradient">
              Empowering Independence
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display mb-8 leading-tight text-secondary-700">
              Through Personalized Support
            </h2>
            <p className="text-lg sm:text-xl mb-8 font-light leading-relaxed max-w-2xl text-gray-700">
              <span className="font-semibold text-primary-700">InclusiveAid</span> offers comprehensive disability support services, empowering individuals to{' '}
              <span className="font-semibold text-accent-600">live independently</span> and achieve their full potential.
            </p>
            <motion.button
              className="btn btn-primary btn-lg gap-2 text-lg font-semibold shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Services
              <FaArrowRight className="text-xl" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 transform rotate-3 hover:rotate-0 transition-all duration-300">
              <Image
                src="/inclusive-community.webp"
                alt="Inclusive community"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          className="mt-24"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FaWheelchair, text: "Mobility Assistance", color: "primary", description: "Personalized support for enhanced mobility and independence." },
              { icon: FaHeart, text: "Personal Care", color: "secondary", description: "Compassionate assistance with daily living activities." },
              { icon: FaHome, text: "Home Modifications", color: "accent", description: "Adapting living spaces for improved accessibility and safety." },
              { icon: FaUsers, text: "Community Inclusion", color: "info", description: "Programs to promote social engagement and community participation." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ y: -10 }}
              >
                <div className="card-body items-center text-center">
                  <div className={`w-16 h-16 flex items-center justify-center rounded-full bg-${item.color}-100 text-${item.color}-600 mb-4`}>
                    <item.icon className="text-3xl" />
                  </div>
                  <h3 className="card-title text-xl font-semibold text-gray-800">{item.text}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                  <div className="card-actions justify-end mt-4">
                    <button className={`btn btn-outline btn-${item.color} btn-sm`}>Learn More</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modern wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;