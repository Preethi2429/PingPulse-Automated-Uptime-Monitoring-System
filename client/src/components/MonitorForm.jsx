import { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const MonitorForm = ({ onMonitorAdded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Define API URL here as well
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      // ✅ Use backticks to insert the variable
      await axios.post(`${API_URL}/api/monitors`, { name, url });
      
      // Clear inputs and refresh list
      setName('');
      setUrl('');
      onMonitorAdded();
      
    } catch (error) {
      alert("Error adding monitor: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Monitor</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Website Name (e.g. My Portfolio)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 justify-center disabled:opacity-50"
        >
          {loading ? 'Adding...' : <><Plus size={20} /> Add Monitor</>}
        </button>
      </form>
    </div>
  );
};

export default MonitorForm;