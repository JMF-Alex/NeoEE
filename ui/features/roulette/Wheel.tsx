import { memo } from "react";

const COLORS = ["#8b5cf6", "#6366f1", "#0ea5e9", "#14b8a6", "#f59e0b", "#f43f5e"];

// angle in degrees clockwise from 12 o'clock -> point on a circle of radius r
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
};

interface Props {
  slots: string[];
  rot: number;
  ms: number;
  title: string;
}

// memoised so typing in the options box only redraws the wheel when the slots actually change
export const Wheel = memo(function Wheel({ slots, rot, ms, title }: Props) {
  const step = 360 / Math.max(slots.length, 1);
  return (
    <svg viewBox="-110 -110 220 220" className="w-full" role="img" aria-label={title}>
      <g style={{ transform: `rotate(${rot}deg)`, transition: ms ? `transform ${ms}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none" }}>
        {slots.length === 1 ? (
          <circle r="100" fill={COLORS[0]} />
        ) : (
          slots.map((_, i) => (
            <path
              key={i}
              d={`M0 0 L${pt(i * step, 100)} A100 100 0 0 1 ${pt((i + 1) * step, 100)} Z`}
              fill={COLORS[i % COLORS.length]}
              stroke="#000000"
              strokeWidth="1.5"
            />
          ))
        )}
        {slots.map((s, i) => (
          <text
            key={i}
            transform={`rotate(${(i + 0.5) * step - 90}) translate(26 0)`}
            dominantBaseline="middle"
            fill="white"
            fontSize={slots.length > 12 ? 5 : 7}
            fontWeight="600"
          >
            {s}
          </text>
        ))}
      </g>
      <circle r="16" fill="#000000" stroke="white" strokeOpacity=".2" />
      <path d="M-7 -108 L7 -108 L0 -92 Z" fill="white" />
    </svg>
  );
});
