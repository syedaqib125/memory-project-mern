import {
  FETCH_ALL,
  CREATE,
  UPDATE,
  DELETE,
  LIKE_POST,
  FETCH_BY_SEARCH,
} from "../constant/actionTypes";
import * as api from "../api";

export const getPosts = (page) => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts(page);
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    const {
      data: { data },
    } = await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  // console.log("actions",post)
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};
export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE_POST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
