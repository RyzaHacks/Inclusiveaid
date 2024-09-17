import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers } from 'react-icons/fa';

const EventCard = ({ title, date, location, time, image, description, attendees }) => (
  <motion.div 
    className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
    whileHover={{ scale: 1.03 }}
  >
    <div className="relative h-48">
      <Image src={image} alt={title} layout="fill" objectFit="cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <div className="flex items-center text-sm">
          <FaCalendarAlt className="mr-2" />
          <span>{date}</span>
        </div>
      </div>
    </div>
    <div className="card-body">
      <div className="flex items-center text-gray-600 mb-2">
        <FaMapMarkerAlt className="mr-2" />
        <span>{location}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <FaClock className="mr-2" />
        <span>{time}</span>
      </div>
      <p className="text-gray-700 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-primary-600">
          <FaUsers className="mr-2" />
          <span>{attendees} attendees</span>
        </div>
        <motion.button 
          className="btn btn-primary btn-sm rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const Events = () => {
  const events = [
    {
      title: "Inclusive Arts Workshop",
      date: "July 15, 2024",
      location: "Community Center",
      time: "2:00 PM - 4:00 PM",
      image: "/event-arts.jpg",
      description: "Join us for an interactive arts workshop designed for all abilities.",
      attendees: 25
    },
    {
      title: "Adaptive Sports Day",
      date: "July 22, 2024",
      location: "City Park",
      time: "10:00 AM - 3:00 PM",
      image: "/event-sports.jpg",
      description: "Experience a variety of adaptive sports and activities for all skill levels.",
      attendees: 50
    },
    {
      title: "Technology for Independence Seminar",
      date: "August 5, 2024",
      location: "Tech Hub",
      time: "1:00 PM - 5:00 PM",
      image: "/event-tech.jpg",
      description: "Learn about the latest assistive technologies enhancing independence.",
      attendees: 40
    },
    {
      title: "Community Garden Project",
      date: "August 12, 2024",
      location: "Sunshine Gardens",
      time: "9:00 AM - 12:00 PM",
      image: "/event-garden.jpg",
      description: "Help plant and maintain our inclusive community garden.",
      attendees: 30
    },
    {
      title: "Disability Rights Forum",
      date: "August 20, 2024",
      location: "City Hall",
      time: "6:00 PM - 8:00 PM",
      image: "/event-forum.jpg",
      description: "Join the discussion on current disability rights issues and advocacy.",
      attendees: 60
    },
    {
      title: "Inclusive Dance Party",
      date: "September 1, 2024",
      location: "Community Center",
      time: "7:00 PM - 10:00 PM",
      image: "/event-dance.jpg",
      description: "Celebrate diversity and inclusion with music, dance, and refreshments.",
      attendees: 75
    }
  ];

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
            Upcoming Events
          </motion.h1>
          <motion.p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Join us for a variety of inclusive events designed to bring our community together, foster connections, and celebrate diversity.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-soft-mint">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-600">Get Involved</h2>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div className="bg-white shadow-xl rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary-600">Volunteer Opportunities</h3>
                <p className="text-gray-700 mb-4">Make a difference in your community by volunteering at our events. We welcome individuals of all abilities to contribute their unique skills and perspectives.</p>
                <motion.button 
                  className="btn btn-primary btn-lg rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Become a Volunteer
                </motion.button>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-4 mb-8">
              <div className="bg-white shadow-xl rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4 text-primary-600">Suggest an Event</h3>
                <p className="text-gray-700 mb-4">Have an idea for an inclusive event? We'd love to hear from you! Submit your suggestions and help us create more diverse and engaging community activities.</p>
                <motion.button 
                  className="btn btn-secondary btn-lg rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit an Idea
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;