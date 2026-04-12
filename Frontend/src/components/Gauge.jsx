import { useEditor } from '@tiptap/react';
import React, { useEffect, useState } from 'react'
import GaugeComponent from "react-gauge-component";

const Gauge = ({data}) => {

  const percentage = data?.completedPercentage || 0;

  return (
    <div className="w-full max-w-80 sm:max-w-90 md:max-w-90 lg:max-w-95 xl:max-w-100 p-2">
      <h3 className="text-xl md:text-2xl font-semibold text-center mb-10">
        Today's Progress
      </h3>

      <GaugeComponent
        value={percentage}
        type="radial"
        labels={{
          valueLabel: {
            formatTextValue: (value) => value + "%",
            style: { fontSize: "20px" },
          },
          tickLabels: {
            type: "outer",
          },
        }}
        arc={{
          subArcs: [
            { limit: 20, color: "#EA4228" }, // red
            { limit: 40, color: "#F58B19" }, // orange
            { limit: 60, color: "#F5CD19" }, // yellow
            { limit: 80, color: "#9BE619" }, // light green
            { limit: 100, color: "#5BE12C" }, // green
          ],
        }}
        pointer={{
          color: "#333",
          length: 0.7,
          width: 10,
        }}
      />

      {/* Extra Info */}
      <div className="mt-10 flex flex-col gap-2 p-2">
        <div className="flex justify-between gap-5 p-2 shadow-xs">
          <p className="text-base font-semibold text-gray-600">Total</p>
          <p className="font-medium text-gray-700">{data?.total || 0}</p>
        </div>
        <div className="flex justify-between gap-5 p-2 shadow-xs">
          <p className="text-base font-semibold text-gray-600">Completed </p>
          <p className="font-medium text-gray-700">{data?.completed || 0}</p>
        </div>
        <div className="flex justify-between gap-5 p-2 shadow-xs">
          <p className="text-base font-semibold text-gray-600">Pending </p>
          <p className="font-medium text-gray-700">{data?.pending || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default Gauge