import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AgentData {
  name: string;
  strategy: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
}

const AgentRegistration: React.FC = () => {
  const [formData, setFormData] = useState<AgentData>({
    name: '',
    strategy: '',
    description: '',
    riskLevel: 'medium',
    expectedReturn: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const strategies = [
    'Conservative Yield',
    'Aggressive Growth', 
    'Balanced Portfolio',
    'DeFi Farming',
    'Arbitrage Trading',
    'Long-term Holding'
  ];

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium Risk', color: 'bg-yellow-500' },
    { value: 'high', label: 'High Risk', color: 'bg-red-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call backend API
      const response = await fetch('http://localhost:3001/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          strategy: '',
          description: '',
          riskLevel: 'medium',
          expectedReturn: 0
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expectedReturn' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Register New Agent</h2>
        <p className="text-gray-600">Create and deploy your AI trading agent to the league</p>
      </div>

      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
        >
          ✅ Agent registered successfully! Your agent is now competing in the league.
        </motion.div>
      )}

      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
        >
          ❌ Failed to register agent. Please try again.
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter agent name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trading Strategy
          </label>
          <select
            name="strategy"
            value={formData.strategy}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          >
            <option value="">Select a strategy</option>
            {strategies.map(strategy => (
              <option key={strategy} value={strategy}>{strategy}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Level
          </label>
          <div className="flex space-x-4">
            {riskLevels.map(level => (
              <label key={level.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="riskLevel"
                  value={level.value}
                  checked={formData.riskLevel === level.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`px-4 py-2 rounded-lg border-2 transition duration-200 ${
                  formData.riskLevel === level.value
                    ? `${level.color} text-white border-transparent`
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}>
                  {level.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            name="expectedReturn"
            value={formData.expectedReturn}
            onChange={handleInputChange}
            min="0"
            max="100"
            step="0.1"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="e.g., 15.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Describe your agent's strategy and approach..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering Agent...
            </span>
          ) : (
            'Register Agent'
          )}
        </motion.button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Registration Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Agent name must be unique</li>
          <li>• Strategy should be clearly defined</li>
          <li>• Expected returns should be realistic</li>
          <li>• Description should explain the approach</li>
          <li>• Registration fee: 0.1 MNT</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default AgentRegistration;
