import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLabel, setHoverLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest("button, a, input, select, textarea, [data-cursor]");
      if (target) {
        setIsHovered(true);
        const label = target.getAttribute("data-cursor-label") || "";
        setHoverLabel(label);
      } else {
        setIsHovered(false);
        setHoverLabel("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer subtle following ring */}
      <div
        className="custom-cursor fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? (hoverLabel ? "64px" : "44px") : "12px",
          height: isHovered ? (hoverLabel ? "64px" : "44px") : "12px",
          borderRadius: "9999px",
          backgroundColor: isHovered ? "rgba(15, 118, 110, 0.2)" : "#0f766e",
          border: isHovered ? "1.5px solid #0f766e" : "none",
          transform: "translate(-50%, -50%)",
          backdropFilter: isHovered ? "blur(2px)" : "none"
        }}
      >
        {hoverLabel && isHovered && (
          <span className="text-[9px] font-bold uppercase tracking-wider text-teal-800 select-none">
            {hoverLabel}
          </span>
        )}
      </div>
    </>
  );
}
