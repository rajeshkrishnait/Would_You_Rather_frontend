import React from "react";
import { motion } from "framer-motion";

interface QuestionCardItemProps {
  questionText: string;
  votePercentage: string;
  flipState: boolean;
  onVote: () => void;
}

const QuestionCardItem: React.FC<QuestionCardItemProps> = ({
  questionText,
  votePercentage,
  flipState,
  onVote,
}) => {
  console.log(flipState)
  return (
    <motion.div
      className="question__card"
      onClick={onVote}
      animate={{ rotateY: flipState ? 0 : 180 }}
      transition={{ duration: 0.6 }}
      whileHover={["grow"]}
      variants={{
        grow: {
          scale: .96
        }}}
    >
      {flipState ? (
        <div className="question_card-center" >
            <motion.span
                  style={{
                    margin: 10,
                    height:'fit-content',
                    cursor: "pointer",
                    color: 'white',
                    fontWeight:600,
                    fontSize: '43px',
                  }}
                 animate={["initial"]}
                //  whileHover={["grow"]}
                 variants={{
                //    grow: {
                //      scale: .5
                //    },
                   rotate: {
                     rotate: [null, -5, 5, 0],
                     transition: {
                       // delay,
                       duration: 10
                       // repeat: Infinity,
                       // repeatDelay: 0.2,
                       // repeatType: "reverse"
                     }
                   },
                   initial: {
                     y: [-20, 20],
                     rotate: 0,
                     transition: {
                       delay:.2,
                       duration: 2,
                       repeat: Infinity,
                       // repeatDelay: 0.2,
                       repeatType: "reverse"
                     }
                   }
                 }}
                >{questionText}
            </motion.span></div>
      ) : (
        <motion.span
                  style={{
                    margin: 10,
                    height:'fit-content',
                    cursor: "pointer",
                    color: 'white',
                    fontWeight:600,
                    fontSize: '43px',
                    transform: "scaleX(-1)"
                  }}
                 animate={["initial"]}
                 initial={{scaleX:-1}}
                //  whileHover={["grow"]}
                 variants={{
                //    grow: {
                //      scale: .5
                //    },
                   rotate: {
                     rotate: [null, -5, 5, 0],
                     transition: {
                       // delay,
                       duration: 10
                       // repeat: Infinity,
                       // repeatDelay: 0.2,
                       // repeatType: "reverse"
                     }
                   },
                   initial: {
                     y: [-20, 20],
                     rotate: 0,
                     transition: {
                       delay:.2,
                       duration: 2,
                       repeat: Infinity,
                       // repeatDelay: 0.2,
                       repeatType: "reverse"
                     }
                   }
                 }}
                >{votePercentage}%
            </motion.span>
      )}
    </motion.div>
  );
};

export default QuestionCardItem;
