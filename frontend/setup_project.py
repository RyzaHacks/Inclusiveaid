import os

# Define the directory structure
directories = [
    "public/images",
    "src/app/components",
    "src/app/pages",
    "src/styles"
]

# Create each directory if it doesn't exist
for directory in directories:
    if not os.path.exists(directory):
        os.makedirs(directory)

# Create the global CSS file
globals_css_content = """@tailwind base;
@tailwind components;
@tailwind utilities;
"""

with open("src/styles/globals.css", "w") as f:
    f.write(globals_css_content)

# Create a basic _app.js file
app_js_content = """import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
"""

with open("src/app/pages/_app.js", "w") as f:
    f.write(app_js_content)

# Create placeholder files for components with initial content
components = {
    "Header.jsx": """import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">InclusiveAid</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/"><a>Home</a></Link></li>
            <li><Link href="/about"><a>About</a></Link></li>
            <li><Link href="/services"><a>Services</a></Link></li>
            <li><Link href="/blog"><a>Blog</a></Link></li>
            <li><Link href="/events"><a>Events</a></Link></li>
            <li><Link href="/contact"><a>Contact</a></Link></li>
            <li><Link href="/portal"><a>Client Portal</a></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
""",
    "Hero.jsx": """const Hero = () => {
  return (
    <div className="bg-cover bg-center h-screen text-white flex items-center justify-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Empowering Lives, One Step at a Time</h1>
        <div className="space-x-4">
          <button className="btn btn-primary">Learn More</button>
          <button className="btn btn-secondary">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
""",
    "About.jsx": """const About = () => {
  return (
    <section className="p-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p>InclusiveAid is dedicated to empowering individuals with disabilities through personalized support and services. Our mission is to help our clients lead independent and fulfilling lives.</p>
      </div>
    </section>
  );
};

export default About;
""",
    "Services.jsx": """const Services = () => {
  return (
    <section className="p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Personalized Care Plans</h3>
            <p>We tailor support plans based on individual needs and preferences.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">In-Home Support</h3>
            <p>Assistance with daily living activities, medication management, and mobility.</p>
          </div>
          {/* Add more services as needed */}
        </div>
      </div>
    </section>
  );
};

export default Services;
""",
    "Testimonials.jsx": """const Testimonials = () => {
  return (
    <section className="p-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p>"InclusiveAid has been a lifesaver for our family. Their personalized care plans and dedicated staff have made a world of difference."</p>
            <p className="mt-2 font-bold">- Client Name</p>
          </div>
          {/* Add more testimonials as needed */}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
""",
    "BlogPreview.jsx": """const BlogPreview = () => {
  return (
    <section className="p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">Article Title</h3>
            <p>Short excerpt of the blog post.</p>
            <a href="#" className="text-blue-600">Read More</a>
          </div>
          {/* Add more blog previews as needed */}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
""",
    "EventsCalendar.jsx": """import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const EventsCalendar = () => {
  const events = [
    { title: 'Event 1', date: '2024-07-01' },
    { title: 'Event 2', date: '2024-07-05' },
  ];

  return (
    <section className="p-8 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Events Calendar</h2>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
        />
      </div>
    </section>
  );
};

export default EventsCalendar;
""",
    "Contact.jsx": """const Contact = () => {
  return (
    <section className="p-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input type="text" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea className="textarea textarea-bordered w-full"></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
""",
    "Footer.jsx": """const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-4 text-center">
      © 2024 InclusiveAid. All rights reserved.
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="text-white">Facebook</a>
        <a href="#" className="text-white">Twitter</a>
        <a href="#" className="text-white">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
"""
}

for component, content in components.items():
    with open(f"src/app/components/{component}", "w") as f:
        f.write(content)

# Create placeholder files for pages with initial content
pages = {
    "index.jsx": """import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import BlogPreview from '../components/BlogPreview';
import EventsCalendar from '../components/EventsCalendar';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Testimonials />
      <BlogPreview />
      <EventsCalendar />
      <Contact />
    </>
  );
}
""",
    "about.jsx": """const About = () => {
  return <div>About Us Page</div>;
};

export default About;
""",
    "services.jsx": """const Services = () => {
  return <div>Services Page</div>;
};

export default Services;
""",
    "blog.jsx": """const Blog = () => {
  return <div>Blog Page</div>;
};

export default Blog;
""",
    "events.jsx": """const Events = () => {
  return <div>Events Page</div>;
};

export default Events;
""",
    "contact.jsx": """const Contact = () => {
  return <div>Contact Page</div>;
};

export default Contact;
""",
    "portal.jsx": """const Portal = () => {
  return <div>Client Portal Page</div>;
};

export default Portal;
"""
}

for page, content in pages.items():
    with open(f"src/app/pages/{page}", "w") as f:
        f.write(content)

# Update Tailwind configuration
tailwind_config_content = """module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Ensure you are scanning the right directories
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
"""

with open("tailwind.config.js", "w") as f:
    f.write(tailwind_config_content)

print("Project setup completed successfully!")
