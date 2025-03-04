import { motion } from "framer-motion";

interface PathProps {
  d: string;
}

const Path: React.FC<PathProps> = ({ d }) => (
  <motion.path
    d={d} // Ensure 'd' is passed correctly
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
  />
);

export const CloseButton = ({ close }: { close: () => void }) => (
  <button onClick={close} className="close">
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path d="M 3 16.5 L 17 2.5" />
      <Path d="M 3 2.5 L 17 16.346" />
    </svg>
  </button>
);
