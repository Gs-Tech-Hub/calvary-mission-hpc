"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CalloutBanner() {
  return (
    <section className="py-12 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gray-100 backdrop-blur-sm rounded-lg shadow-lg max-w-3xl w-full text-center py-10 px-6"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Get Better By Hearing Our Sermons
        </h2>
        <p className="text-gray-600 mb-6">
          Join our live sessions and experience the word that transforms lives.
        </p>
        <Button
          className="items-center gap-2 px-6 py-3 bg-[#0A1D3C] text-white font-semibold rounded-lg hover:bg-blue-900 transition-all"
        >
          Join Us
        </Button>
      </motion.div>
    </section>
  );
}
