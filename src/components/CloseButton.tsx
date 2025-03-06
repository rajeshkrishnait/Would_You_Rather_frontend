import { motion } from "framer-motion";

interface PathProps {
  d: string; // SVG path data string
}

/**
 * A reusable motion path component for smooth animations in SVG.
 * @param {string} d - The path definition string for the SVG.
 */
const Path: React.FC<PathProps> = ({ d }) => (
  <motion.path
    d={d} // Ensures the 'd' attribute is correctly passed to define the shape
    fill="transparent" // Keeps the path transparent
    strokeWidth="3" // Sets the stroke width for visibility
    stroke="hsl(0, 0%, 18%)" // Dark gray stroke color
    strokeLinecap="round" // Rounds off the line ends for a smoother look
  />
);

/**
 * Close button component with an animated SVG cross icon.
 * @param {Function} close - Callback function to trigger when the button is clicked.
 */
export const CloseButton = ({ close }: { close: () => void }) => (
  <button onClick={close} className="close">
    <svg width="23" height="23" viewBox="0 0 23 23">
      {/* First diagonal line of the "X" */}
      <Path d="M 3 16.5 L 17 2.5" />
      {/* Second diagonal line of the "X" */}
      <Path d="M 3 2.5 L 17 16.346" />
    </svg>
  </button>
);
