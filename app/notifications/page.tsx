"use client";

import { useState } from "react";
import { Bell, Clock, ShieldCheck, FileText, Building2, CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("ALL");

  const notifications = [
    {
      id: 1,
      type: "Application",
      title: "Application status changed",
      message: "Your application for 'Unpaid Wages Complaint' is now Under Review.",
      time: "2 hours ago",
      read: false,
      icon: Clock,
      color: "amber"
    },
    {
      id: 2,
      type: "Credential",
      title: "Credential issued",
      message: "Your SANAD credential (SANAD-VC-00124) has been issued successfully on the Polygon blockchain.",
      time: "5 hours ago",
      read: true,
      icon: ShieldCheck,
      color: "emerald"
    },
    {
      id: 3,
      type: "Document",
      title: "Document analysis complete",
      message: "We've extracted information from your uploaded Employment Contract.",
      time: "1 day ago",
      read: true,
      icon: FileText,
      color: "blue"
    },
    {
      id: 4,
      type: "Update",
      title: "New service recommendation",
      message: "Based on your profile, you may be eligible for 'Financial Assistance Program'.",
      time: "2 days ago",
      read: true,
      icon: Building2,
      color: "purple"
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col pb-20 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Notifications</h1>
          <p className="text-gray-500">Stay updated on your claims and credentials.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit mb-8 overflow-x-auto">
        {['All', 'Updates', 'Applications', 'Credentials'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toUpperCase())}
            className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.toUpperCase() 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden divide-y divide-gray-100">
        {notifications.map((notif) => (
          <div key={notif.id} className={`p-6 flex items-start gap-4 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-${notif.color}-100 bg-${notif.color}-50 text-${notif.color}-600`}>
              <notif.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className={`text-sm font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs font-semibold text-gray-400 shrink-0">{notif.time}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{notif.message}</p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
