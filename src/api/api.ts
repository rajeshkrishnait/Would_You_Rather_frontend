import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Base API URL from environment variables

/**
 * Fetches a batch of 3 random questions from the server.
 * @returns {Promise<Array>} An array of random questions.
 */
export const fetchRandomQuestion = async () => {
  const response = await axios.get(`${API_URL}/random`, {
    withCredentials: true, // Ensures cookies are sent with the request for authentication
  });
  return response.data;
};

/**
 * Submits a vote for a given question ID.
 * @param {string} questionId - The ID of the question to vote on.
 * @param {string} vote - The vote choice ("vote_one" or "vote_two").
 * @returns {Promise<Object>} The updated question data after the vote is recorded.
 */
export const submitVote = async (questionId: string, vote: string) => {
  const response = await axios.put(`${API_URL}/vote/${questionId}`, { vote });
  return response.data.question;
};

/**
 * Adds a new question to the database.
 * @param {Object} data - The question data containing two choices.
 * @param {string} data.questionOne - The first question choice.
 * @param {string} data.questionTwo - The second question choice.
 * @returns {Promise<Object>} The response data from the server.
 * @throws {Error} If the request fails.
 */
export const addNewQuestion = async (data: { questionOne: string; questionTwo: string }) => {
  try {
    // Capitalizes the first letter of each question choice for consistency
    const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const response = await axios.post(`${API_URL}/new_question`, {
      question_one: capitalizeFirstLetter(data.questionOne),
      question_two: capitalizeFirstLetter(data.questionTwo),
    });

    return response.data;
  } catch (error) {
    console.error("Failed to add new question:", error);
    throw new Error("Failed to add new question"); // Propagate the error for better error handling
  }
};
