type Props = {
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Signature motif: a single circuit trace with a node, used as the
 * connective thread between sections — echoing how the company links
 * schools, colleges, and students into one training network.
 */
export default function CircuitDivider({
  tone = "light",
  className = "",
}: Props) {
  const line = tone === "dark" ? "#17B8A6" : "#145DA0";
  return (
    <div className={`container-page ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        className="h-8 w-full"
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 H520 L560 4 H640 L680 20 H1200"
          fill="none"
          stroke={line}
          strokeWidth="2"
          pathLength={1}
          strokeDasharray={1}
          className="[stroke-dashoffset:1] animate-[trace-draw_1.4s_ease-out_forwards]"
          opacity={0.5}
        />
        <circle
          cx="600"
          cy="12"
          r="4"
          fill={line}
          className="animate-pulse-node"
        />
      </svg>
    </div>
  );
}
