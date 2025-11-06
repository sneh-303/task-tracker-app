import React from "react";

export default function SummaryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-gray-50 hover:bg-gray-100 transition p-4 rounded-lg flex flex-col items-center">
      <Icon className={`${color} mb-2`} size={24} />
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className={`text-2xl font-bold text-gray-800`}>{value}</h3>
    </div>
  );
}
