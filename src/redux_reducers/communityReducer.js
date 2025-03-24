import {
  GET_COMMUNITY_POSTS,
  GET_POST_DETAILS,
  CREATE_POST,
  ADD_COMMENT,
  LIKE_POST,
  UNLIKE_POST
} from '../redux_actions'

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  likedPosts: {} // Track which posts are liked by the current user
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
    // Only allow liking if not already liked
    if (state.likedPosts[action.payload]) {
      return state
    }

    if (state.currentPost && state.currentPost.id === action.payload) {
      return {
        ...state,
        currentPost: {
          ...state.currentPost,
          likes: state.currentPost.likes + 1
        },
        likedPosts: {
          ...state.likedPosts,
          [action.payload]: true
        }
      }
    }
    return {
      ...state,
      posts: state.posts.map(post =>
        post.id === action.payload
          ? { ...post, likes: post.likes + 1 }
          : post
      ),
      likedPosts: {
        ...state.likedPosts,
        [action.payload]: true
      }
    }

  case UNLIKE_POST:
    // Only allow unliking if already liked
    if (!state.likedPosts[action.payload]) {
      return state
    }

    // Create a new likedPosts object without this post
    const updatedLikedPosts = { ...state.likedPosts }
    delete updatedLikedPosts[action.payload]

    if (state.currentPost && state.currentPost.id === action.payload) {
      return {
        ...state,
        currentPost: {
          ...state.currentPost,
          likes: Math.max(0, state.currentPost.likes - 1) // Prevent negative likes
        },
        likedPosts: updatedLikedPosts
      }
    }
    return {
      ...state,
      posts: state.posts.map(post =>
        post.id === action.payload
          ? { ...post, likes: Math.max(0, post.likes - 1) } // Prevent negative likes
          : post
      ),
      likedPosts: updatedLikedPosts
    }

  default:
    return state
  }
}

export default communityReducer
