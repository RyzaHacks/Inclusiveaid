import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactInfo = ({ icon: Icon, title, content }) => (
  <div className="flex items-center mb-6">
    <div className="w-12 h-12 rounded-full bg-soft-mint flex items-center justify-center mr-4">
      <Icon className="text-2xl text-primary-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-primary-600">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blue to-soft-lavender">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-5xl font-bold text-center mb-12 text-primary-600 text-shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We're here to help. Reach out to us for any questions, concerns, or to learn more about our services.
          </motion.p>
          
          <div className="flex flex-wrap -mx-4">
            <motion.div 
              className="w-full md:w-1/2 px-4 mb-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white shadow-xl rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-primary-600">Get in Touch</h2>
                <ContactInfo icon={FaPhone} title="Phone" content="(123) 456-7890" />
                <ContactInfo icon={FaEnvelope} title="Email" content="contact@inclusiveaid.org" />
                <ContactInfo icon={FaMapMarkerAlt} title="Address" content="123 Care Street, Supportville, SP 12345" />
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2 px-4 mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white shadow-xl rounded-lg p-8">
                <h2 className="text-3xl font-bold mb-6 text-primary-600">Send Us a Message</h2>
                <form>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your Name" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your Email" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Your Message" rows="4"></textarea>
                  </div>
                  <motion.button 
                    className="btn btn-primary btn-lg rounded-full w-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;