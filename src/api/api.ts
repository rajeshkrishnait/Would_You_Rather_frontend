import axios from "axios";

const API_URL = "http://localhost:5000/api/questions";

export const fetchRandomQuestion = async () => {
  const response = await axios.get(`${API_URL}/random`,{
    withCredentials: true
  });
  return response.data;
};

export const submitVote = async (questionId: string, vote: string) => {
  const response = await axios.put(`${API_URL}/vote/${questionId}`, { vote });
  return response.data.question;
};

export const addNewQuestion = async (data: { questionOne: string; questionTwo: string }) => {
  try {
    const response = await axios.post(`${API_URL}/new_question`, {
      question_one: data.questionOne,
      question_two: data.questionTwo,
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Failed to add new question:", error);
    throw new Error("Failed to add new question");
  }
};