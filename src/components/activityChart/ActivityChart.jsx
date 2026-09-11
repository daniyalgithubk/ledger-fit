import React from "react";

const ActivityChart = () => {
  const points = [
    [0, 50],
    [13, 50],
    [15, 18],
    [17, 68],
    [19, 50],

    [33, 50],
    [35, 21],
    [37, 65],
    [39, 50],

    [54, 50],
    [56, 15],
    [58, 70],
    [60, 50],

    [75, 50],
    [77, 25],
    [79, 63],
    [81, 50],

    [100, 50],
  ];

  const days = [
    { name: "MON", x: 4 },
    { name: "TUE", x: 19 },
    { name: "WED", x: 35 },
    { name: "THU", x: 50 },
    { name: "FRI", x: 65 },
    { name: "SAT", x: 81 },
    { name: "SUN", x: 96 },
  ];

  const path = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  return (
    <div className="w-full h-30 overflow-hidden border border-[#242529] bg-[#08090b]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        {/* Top grid line */}
        <line
          x1="0"
          y1="25"
          x2="100"
          y2="25"
          stroke="#292a2e"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Center grid line */}
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="#292a2e"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Bottom grid line */}
        <line
          x1="0"
          y1="75"
          x2="100"
          y2="75"
          stroke="#292a2e"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />

        {/* Activity line */}
        <path
          d={path}
          fill="none"
          stroke="#ff174f"
          strokeWidth="0.22"
          strokeLinecap="square"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
        />

        {/* Weekday labels */}
        {days.map((day) => (
          <text
            key={day.name}
            x={day.x}
            y="52"
            textAnchor="middle"
            fill="#64666d"
            fontSize="4"
            fontFamily="Arial, Helvetica, sans-serif"
            fontWeight="500"
            letterSpacing="0.15"
          >
            {day.name}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default ActivityChart;