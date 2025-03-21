import React, { useEffect, useState } from 'react'
import { FiBook, FiChevronRight, FiAward, FiTrendingUp, FiLock, FiPlay, FiClock, FiUsers } from 'react-icons/fi'
import { connect } from 'react-redux'
import { fetchCourses, getCourseDetails } from '../../redux_actions'

// CourseCard Component
const CourseCard = ({ course, userProgress, handleCourseClick }) => {
  const calculateProgress = (courseId) => {
    if (!userProgress[courseId]) return 0
    const { completed, totalModules } = userProgress[courseId]
    return Math.round((completed / totalModules) * 100)
  }

  const getBgColor = (level) => {
    switch (level.toLowerCase()) {
    case 'beginner': return 'bg-gradient-to-r from-blue-500 to-blue-600'
    case 'intermediate': return 'bg-gradient-to-r from-green-500 to-green-600'
    case 'advanced': return 'bg-gradient-to-r from-purple-500 to-purple-600'
    default: return 'bg-gradient-to-r from-blue-500 to-blue-600'
    }
  }

  const getCourseIcon = (title) => {
    if (title.includes('Technical Analysis')) return '📊'
    if (title.includes('Risk Management')) return '🛡️'
    if (title.includes('Trading')) return '📈'
    return '📚'
  }

  const progress = calculateProgress(course.id)

  return (
    <div
      onClick={() => handleCourseClick(course)}
      className={`course-card rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-xl ${
        !course.unlocked ? 'opacity-80' : 'cursor-pointer hover:transform hover:scale-102'
      }`}
    >
      <div className={`relative h-40 ${getBgColor(course.level)}`}>
        {!course.unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <div className="text-center">
              <FiLock className="text-white text-4xl mx-auto mb-2" />
              <span className="text-white text-sm font-medium">Complete previous courses to unlock</span>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4 text-3xl">
          {getCourseIcon(course.title)}
        </div>
        <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold text-blue-600">
          {course.level}
        </div>
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center">
          <FiClock className="mr-1" /> {course.duration}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-gray-500 flex items-center">
            <FiBook className="mr-1" /> {course.modules} Modules
          </span>
          <span className="text-xs text-gray-500 flex items-center">
            <FiUsers className="mr-1" /> {Math.floor(Math.random() * 1000) + 500} Enrolled
          </span>
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${progress > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {course.unlocked && (
          <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
            {progress > 0
              ? (
                <>
                  <FiPlay className="mr-2" /> Continue Learning
                </>
              )
              : (
                <>
                  <FiPlay className="mr-2" /> Start Course
                </>
              )}
          </button>
        )}
      </div>
    </div>
  )
}

// Main LearningCourses Component
const LearningCourses = ({ courseList, userProgress, fetchCourses, getCourseDetails }) => {
  const [activeCourse, setActiveCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
    setLoading(false)
  }, [fetchCourses])

  const calculateProgress = (courseId) => {
    if (!userProgress[courseId]) return 0
    const { completed, totalModules } = userProgress[courseId]
    return Math.round((completed / totalModules) * 100)
  }

  const handleCourseClick = (course) => {
    if (!course.unlocked) return
    setActiveCourse(course)
    // Fetch course details when a course is clicked
    getCourseDetails(course.id)
  }

  return (
    <div className="learning-courses-container p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Trading Courses</h2>
        <div className="flex items-center text-blue-600">
          <span className="mr-2">View All Courses</span>
          <FiChevronRight />
        </div>
      </div>

      {loading
        ? (
          <div className="text-center py-10">Loading courses...</div>
        )
        : (
          <>
            {!activeCourse
              ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseList.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      userProgress={userProgress}
                      handleCourseClick={handleCourseClick}
                    />
                  ))}
                </div>
              )
              : (
                <div className="course-detail">
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setActiveCourse(null)}
                      className="mr-4 text-blue-600 hover:text-blue-800"
                    >
                  ← Back to Courses
                    </button>
                    <h3 className="text-xl font-bold">{activeCourse.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-bold mb-4">Course Modules</h4>
                      <div className="space-y-4">
                        {Array.from({ length: activeCourse.modules }).map((_, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border flex items-center 
                          ${userProgress[activeCourse.id] && index < userProgress[activeCourse.id].completed
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4
                          ${userProgress[activeCourse.id] && index < userProgress[activeCourse.id].completed
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Module {index + 1}</div>
                              <div className="text-sm text-gray-500">
                                {index === 0
                                  ? 'Introduction and Key Concepts'
                                  : index === 1
                                    ? 'Market Structure Overview'
                                    : index === 2
                                      ? 'Basic Trade Setup'
                                      : `Advanced Topic ${index - 2}`}
                              </div>
                            </div>
                            <div className="ml-4">
                              {userProgress[activeCourse.id] && index < userProgress[activeCourse.id].completed
                                ? <FiAward className="text-blue-500" />
                                : <FiChevronRight className="text-gray-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-bold mb-4">Course Progress</h4>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completion</span>
                            <span>{calculateProgress(activeCourse.id)}%</span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${calculateProgress(activeCourse.id)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex justify-between mb-2">
                            <span>Modules Completed:</span>
                            <span>{userProgress[activeCourse.id]?.completed || 0} / {activeCourse.modules}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span>Estimated Time Left:</span>
                            <span>{Math.round(activeCourse.duration.split(' ')[0] * (1 - calculateProgress(activeCourse.id) / 100))} hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                        <h4 className="font-bold mb-4 text-blue-800">Course Benefits</h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li className="flex items-start">
                            <FiTrendingUp className="mr-2 mt-1 flex-shrink-0" />
                            <span>Gain practical trading skills applicable to real markets</span>
                          </li>
                          <li className="flex items-start">
                            <FiTrendingUp className="mr-2 mt-1 flex-shrink-0" />
                            <span>Earn platform tokens upon module completion</span>
                          </li>
                          <li className="flex items-start">
                            <FiTrendingUp className="mr-2 mt-1 flex-shrink-0" />
                            <span>Access exclusive tools after course completion</span>
                          </li>
                          <li className="flex items-start">
                            <FiTrendingUp className="mr-2 mt-1 flex-shrink-0" />
                            <span>Receive a certification displayed on your profile</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </>
        )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  courseList: state.courses.courseList || [],
  userProgress: state.courses.userProgress || {}
})

export default connect(mapStateToProps, { fetchCourses, getCourseDetails })(LearningCourses)
