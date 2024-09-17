// Footer.jsx
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
      ]
    },
    {
      title: "Services",
      links: [
        { name: "In-Home Support", href: "/services#in-home-support" },
        { name: "Adaptive Support", href: "/services#adaptive-support" },
        { name: "Social Engagement", href: "/services#social-engagement" },
        { name: "Customized Care Plans", href: "/services#care-plans" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "Client Portal", href: "/client-portal" },
      ]
    }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
  ];

  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h2 className="text-3xl font-bold font-display mb-6 text-gradient">InclusiveAid</h2>
            <p className="text-gray-600 mb-6">
              Empowering individuals with disabilities to thrive independently through compassionate care and unwavering support.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-primary-500 hover:text-primary-600 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold font-display mb-4 text-gray-800">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-primary-500 transition-colors duration-300 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} InclusiveAid. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;