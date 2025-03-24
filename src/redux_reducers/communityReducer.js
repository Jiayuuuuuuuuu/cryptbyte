import {
  GET_COMMUNITY_POSTS,
  GET_POST_DETAILS,
  CREATE_POST,
  ADD_COMMENT,
  LIKE_POST
} from '../redux_actions'

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null
}

const communityReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_COMMUNITY_POSTS:
    return {
      ...state,
      posts: action.payload,
      loading: false
    }

  case GET_POST_DETAILS:
    return {
      ...state,
      currentPost: action.payload,
      loading: false
    }

  case CREATE_POST:
    return {
      ...state,
      posts: [action.payload, ...state.posts]
    }

  case ADD_COMMENT:
    if (state.currentPost && state.currentPost.id === action.payload.postId) {
      return {
        ...state,
        currentPost: {
          ...state.currentPost,
          comments: [...state.currentPost.comments, action.payload.comment],
          commentsCount: state.currentPost.comments.length + 1
        }
      }
    }
    return state

  case LIKE_POST:
    if (state.currentPost && state.currentPost.id === action.payload) {
      return {
        ...state,
        currentPost: {
          ...state.currentPost,
          likes: state.currentPost.likes + 1
        }
      }
    }
    return {
      ...state,
      posts: state.posts.map(post =>
        post.id === action.payload
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    }

  default:
    return state
  }
}

export default communityReducer
