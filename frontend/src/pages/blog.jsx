import { motion } from 'framer-motion';
import Image from 'next/image';

const BlogPost = ({ title, excerpt, image, date, author }) => (
  <motion.div 
    className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300"
    whileHover={{ scale: 1.03 }}
  >
    <figure className="relative h-48">
      <Image src={image} alt={title} layout="fill" objectFit="cover" />
    </figure>
    <div className="card-body">
      <h3 className="card-title text-xl mb-2 text-primary-600">{title}</h3>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{date}</span>
        <span>By {author}</span>
      </div>
    </div>
  </motion.div>
);

const Blog = () => {
  const blogPosts = [
    { title: "Empowering Independence: Latest Assistive Technologies", excerpt: "Discover how new technologies are revolutionizing support for individuals with disabilities.", image: "/blog-post-1.jpg", date: "June 15, 2024", author: "Emma Johnson" },
    { title: "Navigating Social Inclusion: A Guide for Caregivers", excerpt: "Learn effective strategies to promote social integration for individuals with disabilities.", image: "/blog-post-2.jpg", date: "June 10, 2024", author: "Michael Chen" },
    { title: "Mental Health Matters: Supporting Emotional Wellbeing", excerpt: "Explore the importance of mental health in disability care and support.", image: "/blog-post-3.jpg", date: "June 5, 2024", author: "Sarah Williams" },
    { title: "Accessible Home Modifications: Creating Safe Spaces", excerpt: "Tips and ideas for making homes more accessible and comfortable.", image: "/blog-post-4.jpg", date: "May 30, 2024", author: "David Thompson" },
    { title: "Nutrition and Disability: Fueling Bodies and Minds", excerpt: "Understanding the role of nutrition in supporting individuals with disabilities.", image: "/blog-post-5.jpg", date: "May 25, 2024", author: "Lisa Rodriguez" },
    { title: "Advocacy in Action: Standing Up for Disability Rights", excerpt: "How to be an effective advocate for disability rights and inclusion.", image: "/blog-post-6.jpg", date: "May 20, 2024", author: "James Wilson" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-peach to-soft-lavender">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-5xl font-bold text-center mb-12 text-primary-600 text-shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            InclusiveAid Blog
          </motion.h1>
          <motion.p 
            className="text-xl text-center mb-16 max-w-3xl mx-auto text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay informed with the latest news, insights, and tips on disability support and inclusive living.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BlogPost {...post} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;