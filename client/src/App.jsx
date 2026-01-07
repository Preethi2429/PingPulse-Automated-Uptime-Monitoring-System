import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import MonitorForm from './components/MonitorForm';
import MonitorCard from './components/MonitorCard';

function App() {
  const [monitors, setMonitors] = useState([]);

  // ✅ Define API URL: Uses the .env variable if it exists, otherwise localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMonitors = async () => {
    try {
      // ✅ Use backticks (template literal) to insert the variable
      const response = await axios.get(`${API_URL}/api/monitors`);
      setMonitors(response.data);
    } catch (error) {
      console.error("Error fetching monitors:", error);
    }
  };

  const deleteMonitor = async (id) => {
    if (!window.confirm("Are you sure you want to stop tracking this site?")) return;
    
    try {
      // ✅ Use backticks here too for the delete request
      await axios.delete(`${API_URL}/api/monitors/${id}`);
      fetchMonitors(); // Refresh list after deleting
    } catch (error) {
      alert("Failed to delete monitor");
      console.error(error);
    }
  };

  // Poll for updates every 2 seconds
  useEffect(() => {
    fetchMonitors();
    const interval = setInterval(fetchMonitors, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        <MonitorForm onMonitorAdded={fetchMonitors} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monitors.map((monitor) => (
            <MonitorCard 
              key={monitor._id} 
              monitor={monitor} 
              onDelete={deleteMonitor} 
            />
          ))}
          
          {monitors.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No monitors active. Add one above to start tracking!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;