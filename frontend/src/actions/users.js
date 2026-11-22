import * as api from "../api";

export const fetchAllUsers = () => async (dispatch) => {
  try {
    const { data } = await api.fetchAllUsers();
    dispatch({ type: "FETCH_USERS", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = (id, updateData) => async (dispatch) => {
  try {
    const { data } = await api.updateProfile(id, updateData);
    dispatch({ type: "UPDATE_CURRENT_USER", payload: data });
    try {
      const stored = JSON.parse(localStorage.getItem('Profile') || '{}');
      if (stored?.result) {
        localStorage.setItem('Profile', JSON.stringify({ ...stored, result: { ...stored.result, ...data } }));
      }
    } catch (e) {
      console.error('Failed to sync profile update to localStorage:', e);
    }
  } catch (error) {
    console.log(error);
  }
};

export const addFriend = (id, userId) => async (dispatch) => {
  try {
    await api.addFriend(id, userId);
    dispatch(fetchAllUsers());
  } catch (error) {
    console.log(error);
  }
};

export const removeFriend = (id, userId) => async (dispatch) => {
  try {
    await api.removeFriend(id, userId);
    dispatch(fetchAllUsers());
  } catch (error) {
    console.log(error);
  }
};
