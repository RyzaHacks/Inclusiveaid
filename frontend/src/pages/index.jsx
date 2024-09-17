// src/pages/index.js
import Head from 'next/head';
import Hero from '../components/common/Hero';
import About from '../components/common/About';
import Testimonials from '../components/common/Testimonials';
import Contact from '../components/common/Contact';

export default function Home() {
  return (
    <>
      <Head>
        <title>InclusiveAid - Compassionate Home Care Services</title>
        <meta name="description" content="InclusiveAid provides personalized home care and support services for individuals with disabilities, empowering them to thrive independently." />
      </Head>
      <main>
        <Hero />
        <About />
        <Testimonials />
        <Contact />
      </main>
    </>
  );
}