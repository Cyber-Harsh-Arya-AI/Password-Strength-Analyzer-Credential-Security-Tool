import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StrengthMeter from './StrengthMeter';
import SecurityToolkit from './SecurityToolkit';

const Dashboard = ({ activeTab }) => {
  return (
    <div className="relative w-full h-full pb-10">
      <AnimatePresence mode="wait">
        {activeTab === 'analyzer' && (
          <motion.div
            key="analyzer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <StrengthMeter />
          </motion.div>
        )}

        {activeTab === 'toolkit' && (
          <motion.div
            key="toolkit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <SecurityToolkit />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
