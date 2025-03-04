import React from "react";
import { motion, Transition, SVGMotionProps } from "framer-motion";

interface Props extends SVGMotionProps<SVGSVGElement> {
  isOpen?: boolean;
  color?: string;
  strokeWidth?: number;
  transition?: Transition;
  lineProps?: React.ComponentProps<typeof motion.line>;
  width: number;
  height: number;
}

const MenuButton: React.FC<Props> = ({
  isOpen = false,
  width = 50,
  height = 24,
  strokeWidth = 1,
  color = "#000",
  transition = { type: "spring", stiffness: 260, damping: 20 },
  lineProps = {},
  ...props
}) => {
  const variant = isOpen ? "opened" : "closed";

  const top = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: 45, translateY: 2 }
  };

  const center = {
    closed: { opacity: 1 },
    opened: { opacity: 0 }
  };

  const bottom = {
    closed: { rotate: 0, translateY: 0 },
    opened: { rotate: -45, translateY: -2 }
  };

  const mergedLineProps = {
    stroke: color,
    strokeWidth,
    vectorEffect: "non-scaling-stroke",
    initial: "closed",
    animate: variant,
    transition,
    ...lineProps
  };

  const unitHeight = 4;
  const unitWidth = (unitHeight * width) / height;

  return (
    <motion.svg
      viewBox={`0 0 ${unitWidth} ${unitHeight}`}
      overflow="visible"
      preserveAspectRatio="none"
      width={width}
      height={height}
      {...props}
    >
      <motion.line x1="0" x2={unitWidth} y1="0" y2="0" variants={top} {...mergedLineProps} />
      <motion.line x1="0" x2={unitWidth} y1="2" y2="2" variants={center} {...mergedLineProps} />
      <motion.line x1="0" x2={unitWidth} y1="4" y2="4" variants={bottom} {...mergedLineProps} />
    </motion.svg>
  );
};

export { MenuButton };
