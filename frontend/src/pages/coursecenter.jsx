import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { FaBook, FaPuzzlePiece, FaComments, FaSearch, FaStar, FaCheckCircle, FaPlay, FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';
import Modules from '../components/course/Modules';
import ResourcesCenter from '../components/course/ResourcesCenter';

const CourseCenter = () => {
  const [activeSection, setActiveSection] = useState('myCourses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/v3/users/profile');
        setUser(response.data);
        fetchCourses(response.data.id);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchCourses = async (userId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/users/${userId}/courses`);
      setCourses(response.data);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModule = async (userId, courseId, moduleId) => {
    try {
      const response = await api.get(`/api/users/${userId}/courses/${courseId}/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching module:', error);
      throw error;
    }
  };

  const handleModuleProgressUpdate = async (courseId, moduleId, progress) => {
    try {
      const response = await api.put(`/api/users/${user.id}/courses/${courseId}/modules/${moduleId}/progress`, {
        progress
      });
      
      // Update the courses state
      setCourses(prevCourses => prevCourses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              modules: course.modules.map(module => 
                module.id === moduleId ? { ...module, progress } : module
              ),
              progress: response.data.overallProgress 
            } 
          : course
      ));

      // Update the selected course if it's the current course
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(prevCourse => ({
          ...prevCourse,
          modules: prevCourse.modules.map(module => 
            module.id === moduleId ? { ...module, progress } : module
          ),
          progress: response.data.overallProgress
        }));
      }

    } catch (error) {
      console.error('Error updating module progress:', error);
      setError('Failed to update module progress. Please try again later.');
    }
  };

  const handleStartModule = async (module) => {
    try {
      console.log(`Starting module ${module.id} for course ${selectedCourse.id}`);
      const moduleData = await getModule(user.id, selectedCourse.id, module.id);
      console.log('Module data received:', moduleData);
      if (moduleData.units && moduleData.units.length > 0) {
        setActiveModule(moduleData);
      } else {
        setError(`The module "${moduleData.title}" doesn't have any units yet. Please try another module or contact support.`);
      }
    } catch (error) {
      console.error('Error fetching module data:', error);
      setError(`Failed to load module data: ${error.message}. Please try again later or contact support.`);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      await api.post(`/api/users/${user.id}/courses/enroll`, {
        courseId
      });
      fetchCourses(user.id);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      setError('Failed to enroll in course. Please try again later.');
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setActiveModule(null);
    fetchCourses(user.id); // Refresh courses to get updated progress
  };

  const renderCourseDetails = () => {
    if (!selectedCourse) return null;

    return (
      <motion.div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-gray-800">{selectedCourse.title}</h3>
          <button
            onClick={handleBackToCourses}
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
          >
            <FaArrowLeft className="mr-2" />
            Back to Courses
          </button>
        </div>
        <p className="text-gray-600 mb-6">{selectedCourse.description}</p>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-700 font-semibold">Course Progress</span>
            <span className="text-blue-700 font-semibold">{selectedCourse.progress?.toFixed(2) || 0}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedCourse.progress || 0}%` }}></div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedCourse.modules && selectedCourse.modules.length > 0 ? (
            selectedCourse.modules.map((module, index) => (
              <div key={module.id} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-semibold text-gray-800 flex items-center">
                    {module.progress === 100 && <FaCheckCircle className="text-green-500 mr-2" />}
                    Module {index + 1}: {module.title}
                  </h4>
                  <button
                    onClick={() => handleStartModule(module)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center"
                  >
                    <FaPlay className="mr-2" />
                    {module.progress === 100 ? 'Review' : 'Start'}
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{module.description}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-blue-700">Progress: {module.progress?.toFixed(2) || 0}%</span>
                  <div className="w-full bg-blue-200 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${module.progress || 0}%` }}></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">No modules found for this course.</div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderMyCourses = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onSelect={() => setSelectedCourse(course)}
            onEnroll={() => handleEnrollCourse(course.id)}
          />
        ))}
      </div>
    </motion.div>
  );

  const renderResources = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <ResourcesCenter />
    </motion.div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-800 mb-12 text-center">Courses Center</h2>
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-12">
          {user && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-semibold">Welcome, {user.name}!</h3>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Role: {user.role}</p>
              </div>
              <button
                onClick={() => router.push('/profile')}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                View Profile
              </button>
            </div>
          )}
          {!selectedCourse && (
            <>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { name: 'myCourses', icon: FaBook, label: 'My Courses' },
                  { name: 'resources', icon: FaPuzzlePiece, label: 'Resources' },
                  { name: 'community', icon: FaComments, label: 'Community' },
                ].map((section) => (
                  <motion.button
                    key={section.name}
                    onClick={() => setActiveSection(section.name)}
                    className={`flex items-center px-6 py-3 rounded-full text-lg font-medium ${
                      activeSection === section.name ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-all duration-300`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <section.icon className="mr-2" />
                    {section.label}
                  </motion.button>
                ))}
              </div>

              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 rounded-full shadow-lg"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {!selectedCourse && activeSection === 'myCourses' && renderMyCourses()}
            {selectedCourse && !activeModule && renderCourseDetails()}
            {activeSection === 'resources' && renderResources()}
          </AnimatePresence>
        </div>
      </div>
      {activeModule && (
        <Modules
          module={activeModule}
          courseId={selectedCourse.id}
          userId={user.id}
          onProgressUpdate={handleModuleProgressUpdate}
          onExitModule={() => {
            setActiveModule(null);
            fetchCourses(user.id); // Refresh courses to get updated progress
          }}
        />
      )}
    </div>
  );
};

const CourseCard = ({ course, onSelect, onEnroll }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-4">
        <FaBook className="text-blue-500 text-3xl mr-2" />
        <h3 className="text-xl font-semibold">{course.title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-blue-600">{course.modules?.length || 0} modules</span>
        <div className="flex items-center">
          <FaStar className="text-yellow-500 mr-1" />
          <span>4.5 (120 ratings)</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Progress</span>
          <span className="text-sm font-medium text-blue-700">{course.progress?.toFixed(2) || 0}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${course.progress || 0}%` }}
          ></div>
        </div>
      </div>
      {course.progress !== undefined ? (
        <button
          onClick={onSelect}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
        </button>
      ) : (
        <button
          onClick={onEnroll}
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Enroll in Course
        </button>
      )}
    </motion.div>
  );
};

export default CourseCenter;