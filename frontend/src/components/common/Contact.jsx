import { useState } from 'react';
import { FaArrowRight, FaCheckCircle, FaQuestionCircle, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('services');

  const tabContent = {
    services: {
      title: "Our Services",
      items: [
        "Personalized care plans",
        "In-home support and assistance",
        "Community participation programs",
        "Skill development workshops"
      ]
    },
    funding: {
      title: "NDIS Funding",
      items: [
        "Funding application assistance",
        "Budget management support",
        "Regular plan reviews",
        "Maximizing your NDIS benefits"
      ]
    },
    approach: {
      title: "Our Approach",
      items: [
        "Person-centered care",
        "Collaborative goal setting",
        "Continuous progress monitoring",
        "Adaptive support strategies"
      ]
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-display text-center mb-12 text-gradient">Get in Touch</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Quick Inquiry Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl font-semibold mb-6">Quick Inquiry</h3>
              <form className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input type="text" placeholder="Your name" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input type="email" placeholder="Your email" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Message</span>
                  </label>
                  <textarea placeholder="How can we help you?" className="textarea textarea-bordered w-full h-32"></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Send Inquiry</button>
              </form>
            </div>
          </div>
          
          {/* Right side - Interactive Content */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="card-body p-0">
              <div className="bg-primary-100 p-6">
                <h3 className="text-2xl font-bold font-display mb-4 text-primary-800">Discover InclusiveAid</h3>
                <p className="text-primary-700 font-light">Explore how we can support your journey to independence and well-being.</p>
              </div>
              <div className="p-6">
                <div className="flex mb-6">
                  {Object.keys(tabContent).map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 py-2 px-4 text-sm font-semibold transition-colors duration-200 ${
                        activeTab === tab ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold mb-4">{tabContent[activeTab].title}</h4>
                    <ul className="space-y-3">
                      {tabContent[activeTab].items.map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center text-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <FaCheckCircle className="text-primary-500 mr-3" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="bg-gray-100 p-6 mt-6">
                <div className="flex justify-between items-center">
                  <button className="btn btn-secondary btn-sm gap-2">
                    <FaQuestionCircle /> Learn More
                  </button>
                  <button className="btn btn-primary btn-sm gap-2">
                    <FaCalendarAlt /> Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;