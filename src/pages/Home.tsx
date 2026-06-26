import { motion } from "motion/react";
import NoticeBanner from "../components/NoticeBanner";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import ServiceDetails from "../components/ServiceDetails";
import Trust from "../components/Trust";
import ValueComparison from "../components/ValueComparison";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Partnership from "../components/Partnership";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" },
};

export default function Home() {
  return (
    <>
      <NoticeBanner />
      <Hero />
      <motion.div {...fadeInUp}>
        <Benefits />
      </motion.div>
      <motion.div {...fadeInUp}>
        <ServiceDetails />
      </motion.div>
      <motion.div {...fadeInUp}>
        <Trust />
      </motion.div>
      <motion.div {...fadeInUp}>
        <ValueComparison />
      </motion.div>
      <motion.div {...fadeInUp}>
        <Testimonials />
      </motion.div>
      <motion.div {...fadeInUp}>
        <FAQ />
      </motion.div>
      <motion.div {...fadeInUp}>
        <Partnership />
      </motion.div>
    </>
  );
}
