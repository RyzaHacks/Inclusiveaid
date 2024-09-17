import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "InclusiveAid has been a lifesaver for our family. Their personalized care plans and dedicated staff have made a world of difference.",
      author: "Sarah Johnson",
      role: "Client's Daughter",
      rating: 5,
      image: "/sarah-johnson.jpg"
    },
    {
      quote: "The level of compassion and professionalism shown by the InclusiveAid team is truly remarkable. They've helped me regain my independence.",
      author: "Michael Thompson",
      role: "Client",
      rating: 5,
      image: "/michael-thompson.jpg"
    },
    {
      quote: "I'm impressed with how InclusiveAid tailors their services to each individual's needs. It's not one-size-fits-all, and that makes all the difference.",
      author: "Emma Rodriguez",
      role: "Care Coordinator",
      rating: 5,
      image: "/emma-rodriguez.jpg"
    },
  ];

  return (
    <section className="testimonials-section py-24 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="section-title text-primary-800 text-4xl font-bold mb-4 text-center"
        >
          What Our Clients Say
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
        >
          Hear from those who have experienced the positive impact of our services firsthand.
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="card-body p-8">
                <div className="flex justify-between items-center mb-4">
                  <FaQuoteLeft className="text-3xl text-primary-500" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-lg text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="avatar mr-4">
                    <div className="w-12 h-12 rounded-full ring ring-primary-500 ring-offset-2">
                      <img src={testimonial.image} alt={testimonial.author} />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-primary-800">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a
            href="#contact"
            className="btn btn-primary btn-lg rounded-full inline-flex items-center gap-2 group text-lg font-semibold px-8 py-4"
          >
            Share Your Story
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
