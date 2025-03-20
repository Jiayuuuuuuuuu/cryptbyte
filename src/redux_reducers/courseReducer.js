import {
  GET_COURSES,
  GET_COURSE_DETAILS,
  UPDATE_COURSE_PROGRESS
} from '../redux_actions'

const initialState = {
  courseList: [],
  courseDetails: {},
  userProgress: {} // Structure: { courseId: { completed: 3, totalModules: 8 } }
}

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
  case GET_COURSES:
    return {
      ...state,
      courseList: action.payload
    }

  case GET_COURSE_DETAILS:
    return {
      ...state,
      courseDetails: {
        ...state.courseDetails,
        [action.payload.id]: action.payload
      }
    }

  case UPDATE_COURSE_PROGRESS:
    const { courseId, moduleId, completed } = action.payload

    // Get the current course's progress
    const currentCourseProgress = state.userProgress[courseId] || { completed: 0, totalModules: 0 }

    // Update the completed count
    let completedCount = currentCourseProgress.completed
    if (completed) {
      completedCount += 1
    } else {
      // If marking as incomplete, reduce the count but don't go below 0
      completedCount = Math.max(0, completedCount - 1)
    }

    return {
      ...state,
      userProgress: {
        ...state.userProgress,
        [courseId]: {
          ...currentCourseProgress,
          completed: completedCount,
          // If we don't have totalModules yet, get it from the course details
          totalModules: currentCourseProgress.totalModules ||
                           (state.courseDetails[courseId]?.modules?.length || 0)
        }
      }
    }

  default:
    return state
  }
}

export default coursesReducer
