export const currentUserReducer = (state = null, action) => {
  switch(action.type){
      case 'FETCH_CURRENT_USER':
          return action.payload;
      case 'UPDATE_CURRENT_USER':
          return state?.result
              ? { ...state, result: { ...state.result, ...action.payload } }
              : state;
      default:
          return state;
  }
}