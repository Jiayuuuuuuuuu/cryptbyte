import {
  GET_COURSES,
  GET_COURSE_DETAILS,
  UPDATE_COURSE_PROGRESS
} from '../redux_actions'

const initialState = {
  list: [],
  currentCourse: null,
  loading: false,
  error: null
}

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_COURSES:
    return {
      ...state,
      list: action.payload,
      loading: false
    }

  case GET_COURSE_DETAILS:
    return {
      ...state,
      currentCourse: action.payload,
      loading: false
    }

  case UPDATE_COURSE_PROGRESS:
    // Update module completion status
    const { courseId, moduleId, completed } = action.payload

    if (state.currentCourse && state.currentCourse.id === courseId) {
      const updatedModules = state.currentCourse.modules.map(module =>
        module.id === moduleId ? { ...module, completed } : module
      )

      return {
        ...state,
        currentCourse: {
          ...state.currentCourse,
          modules: updatedModules
        }
      }
    }

    return state

  default:
    return state
  }
}

export default coursesReducer
