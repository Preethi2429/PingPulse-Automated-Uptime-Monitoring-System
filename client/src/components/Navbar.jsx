import React from 'react'
import { Activity } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        {/* Lucide Icon: Adds a professional logo touch */}
        <Activity className="text-blue-600 h-8 w-8" />
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          PingPulse
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">System Status: </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Operational
        </span>
      </div>
    </nav>
  );
};

export default Navbar