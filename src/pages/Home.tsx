import { motion } from 'motion/react';
import NoticeBanner from '../components/NoticeBanner';
import Hero from '../components/Hero';
import Benefits from '../components/Benefits';
import ServiceDetails from '../components/ServiceDetails';
import Trust from '../components/Trust';
import ValueComparison from '../components/ValueComparison';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Partnership from '../components/Partnership';
import MeetIntegration from '../components/MeetIntegration';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function Home() {
  return (
    <>
      <NoticeBanner />
      <Hero />
      <motion.div {...fadeInUp}><Benefits /></motion.div>
      <motion.div {...fadeInUp}><ServiceDetails /></motion.div>
      
      {/* Google Meet Integration Section */}
      <motion.div {...fadeInUp} className="py-24 px-6 md:px-12 relative overflow-hidden bg-black/50">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
              VIRTUAL MEETINGS
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Connect with our experts instantly using Google Meet integration. Start a session directly from this page.
            </p>
          </div>
          <div className="w-full max-w-md">
            <MeetIntegration />
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeInUp}><Trust /></motion.div>
      <motion.div {...fadeInUp}><ValueComparison /></motion.div>
      <motion.div {...fadeInUp}><Testimonials /></motion.div>
      <motion.div {...fadeInUp}><FAQ /></motion.div>
      <motion.div {...fadeInUp}><Partnership /></motion.div>
    </>
  );
}

