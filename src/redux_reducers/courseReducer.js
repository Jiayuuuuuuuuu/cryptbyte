import {
  GET_COURSES,
  GET_COURSE_DETAILS,
  UPDATE_COURSE_PROGRESS
} from '../redux_actions'

const initialState = {
  list: [],
  currentCourse: null,
  loading: false,
  error: null,
  // Add a new property to track completed modules for each course
  completedModules: {}
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
    // Merge existing completion data with the course details
    const courseWithProgress = {
      ...action.payload,
      modules: action.payload.modules.map(module => {
        // Check if we have saved completion status for this module
        const savedCompletion = state.completedModules[`${action.payload.id}-${module.id}`]
        // If we have stored completion status, use it; otherwise use the default
        return {
          ...module,
          completed: savedCompletion !== undefined ? savedCompletion : module.completed
        }
      })
    }

    return {
      ...state,
      currentCourse: courseWithProgress,
      loading: false
    }

  case UPDATE_COURSE_PROGRESS:
    // Update module completion status
    const { courseId, moduleId, completed } = action.payload

    // First, update the current course modules if applicable
    let updatedCurrentCourse = state.currentCourse
    if (state.currentCourse && state.currentCourse.id === courseId) {
      updatedCurrentCourse = {
        ...state.currentCourse,
        modules: state.currentCourse.modules.map(module =>
          module.id === moduleId ? { ...module, completed } : module
        )
      }
    }

    // Then, update our completion tracking object
    return {
      ...state,
      currentCourse: updatedCurrentCourse,
      completedModules: {
        ...state.completedModules,
        [`${courseId}-${moduleId}`]: completed
      }
    }

  default:
    return state
  }
}

export default coursesReducer
