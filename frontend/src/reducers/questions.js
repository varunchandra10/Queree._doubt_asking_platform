export const questionsReducer = (state = { data: null, askedQuestions: [] }, action) => {
  switch(action.type){
      case "POST_QUESTION":
          return { ...state };
      case "POST_ANSWER":
          return { ...state };
      case "FETCH_ALL_QUESTIONS":
          return { ...state, data: action.payload };
      case "ASKED_QUESTIONS":
          return { ...state, askedQuestions: action.payload?.data || action.payload };
      default:
          return state;
  };
};