import React from "react";
import { motion } from "framer-motion";

interface QuestionCardItemProps {
  questionText: string;
  votePercentage: string;
  flipState: boolean;
  onVote: () => void;
  index: number;
}

const QuestionCardItem: React.FC<QuestionCardItemProps> = ({
  questionText,
  votePercentage,
  flipState,
  onVote,
  index
}) => {
  return (
    <motion.div
      className={`question__card question__card-${index}`}
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
		<div className="eyeLid">
			<div className="eyes">
				<div className="eye"></div>
			</div>
		
	</div>
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
                 variants={{
                   rotate: {
                     rotate: [null, -5, 5, 0],
                     transition: {
                       duration: 10
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
