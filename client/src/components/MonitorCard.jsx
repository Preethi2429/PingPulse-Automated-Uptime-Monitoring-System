import { Trash2, Globe, Clock, Activity } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns'; // Helper to make dates readable

const MonitorCard = ({ monitor, onDelete }) => {
  // Helper: Choose color based on status
  const getStatusColor = (status) => {
    if (status === 'UP') return 'text-green-600 bg-green-50 border-green-200';
    if (status === 'DOWN') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200'; // Pending
  };

  // Helper: Format history data for the chart
  // We only take the last 20 checks to keep the graph clean
  const chartData = monitor.uptimeHistory.slice(-20).map(log => ({
    time: format(new Date(log.timestamp), 'HH:mm'), // Convert date to "14:30"
    latency: log.responseTime
  }));

  // Calculate average response time
  const avgLatency = monitor.uptimeHistory.length > 0
    ? Math.round(monitor.uptimeHistory.reduce((acc, curr) => acc + curr.responseTime, 0) / monitor.uptimeHistory.length)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      
      {/* 1. CARD HEADER */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`p-3 rounded-lg ${getStatusColor(monitor.status)}`}>
            <Activity size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{monitor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Globe size={14} />
              <a href={monitor.url} target="_blank" rel="noreferrer" className="hover:underline">
                {monitor.url}
              </a>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(monitor.status)}`}>
          {monitor.status}
        </div>
      </div>

      {/* 2. THE CHART (Visualizing Data) */}
      <div className="h-32 w-full bg-gray-50 relative">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              {/* Hide messy axis labels, just show the line */}
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#2563eb' }}
              />
              <Area 
                type="monotone" 
                dataKey="latency" 
                stroke="#2563eb" 
                fill="#3b82f6" 
                fillOpacity={0.1} 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Waiting for data...
          </div>
        )}
      </div>

      {/* 3. CARD FOOTER (Stats & Actions) */}
      <div className="px-6 py-4 bg-white flex justify-between items-center">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>Avg Latency: <span className="font-semibold text-gray-800">{avgLatency}ms</span></span>
          </div>
        </div>

        <button 
          onClick={() => onDelete(monitor._id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
          title="Delete Monitor"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default MonitorCard;