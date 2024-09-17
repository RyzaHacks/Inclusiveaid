import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import {
  FaBook, FaEdit, FaUsers, FaSearch, FaPlus, FaFolder, FaCog
} from 'react-icons/fa';
import api from '../../utils/api';
import AddCourseModal from './AddCourseModal';
import EditCourseModal from './EditCourseModal';
import AssignUsersModal from './AssignUsersModal';
import ManageResourcesModal from './ManageResourcesModal';
import UserProgressManager from './UserProgressManager';

const CourseManagementContent = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignUsersModalOpen, setIsAssignUsersModalOpen] = useState(false);
  const [isManageResourcesModalOpen, setIsManageResourcesModalOpen] = useState(false);
  const [isUserProgressOpen, setIsUserProgressOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    modules: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/users/courses');
      if (response.status === 200 && Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to fetch courses. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!newCourse.title || !newCourse.description) {
        throw new Error('Please fill in all required fields');
      }

      const response = await api.post('/api/users/courses', newCourse);

      if (response.status === 201) {
        setIsAddModalOpen(false);
        setNewCourse({ title: '', description: '', modules: [] });
        fetchCourses();
      } else {
        throw new Error('Failed to add course. Please try again.');
      }
    } catch (err) {
      console.error('Error adding course:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async (updatedCourse) => {
    try {
      const response = await api.put(`/api/users/courses/${updatedCourse.id}`, updatedCourse);
      if (response.status === 200) {
        setIsEditModalOpen(false);
        setSelectedCourse(null);
        fetchCourses();
      } else {
        throw new Error('Failed to update course. Please try again.');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course. Please try again.');
    }
  };

  const handleAssignUsers = async (courseId, userIds) => {
    try {
      const enrollmentPromises = userIds.map(userId => 
        api.post(`/api/users/${userId}/courses/enroll`, { courseId })
      );
      await Promise.all(enrollmentPromises);
      setIsAssignUsersModalOpen(false);
      fetchCourses();
    } catch (err) {
      console.error('Error assigning users:', err);
      setError('Failed to assign users. Please try again.');
    }
  };

  const handleManageResources = async (courseId, resources) => {
    try {
      const response = await api.put(`/api/users/courses/${courseId}/resources`, { resources });
      if (response.status === 200) {
        setIsManageResourcesModalOpen(false);
        fetchCourses();
      } else {
        throw new Error('Failed to manage resources. Please try again.');
      }
    } catch (err) {
      console.error('Error managing resources:', err);
      setError('Failed to manage resources. Please try again.');
    }
  };

  const openAssignUsersModal = async (course) => {
    try {
      setSelectedCourse(course);
      console.log('Fetching assigned users for course:', course.id);
      const response = await api.get(`/api/users/courses/${course.id}/users`);
      console.log('Assigned users response:', response.data);
      setSelectedUserIds(response.data.map(user => user.id));
      setIsAssignUsersModalOpen(true);
    } catch (err) {
      console.error('Error fetching assigned users:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      setError('Failed to fetch assigned users. Please try again later.');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-red-500 text-center">
        <p>{error}</p>
        <button 
          onClick={fetchCourses}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {isUserProgressOpen ? (
          <UserProgressManager
            userId={selectedUser?.id || router.query.userId}
            courseId={selectedCourse?.id || router.query.courseId}
            onClose={() => setIsUserProgressOpen(false)}
          />
        ) : (
          <>
            <h2 className="text-5xl font-bold text-indigo-800 mb-12 text-center">Course Management</h2>
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <FaPlus className="mr-1" /> Add Course
                  </button>
                  <button
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                    onClick={() => setIsManageResourcesModalOpen(true)}
                  >
                    <FaFolder className="mr-1" /> Manage Resources
                  </button>
                  <button
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedCourse(null);
                      setIsUserProgressOpen(true);
                    }}
                  >
                    <FaUsers className="mr-1" /> View User Progress
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 px-4 pl-10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FaBook className="text-indigo-500 mr-2" />
                        <h4 className="text-2xl font-semibold text-gray-800">
                          {course.title}
                        </h4>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => openAssignUsersModal(course)}
                        >
                          <FaUsers />
                        </button>
                        <button
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => {
                            setSelectedCourse(course);
                            setIsUserProgressOpen(true);
                          }}
                        >
                          <FaCog />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-600 font-semibold">{course.moduleCount || 0} modules</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <nav>
                  <ul className="flex space-x-2">
                    {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }).map((_, index) => (
                      <li key={index}>
                        <button
                          className={`px-4 py-2 rounded-full ${
                            currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                          onClick={() => paginate(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={handleAddCourse}
        newCourse={newCourse}
        setNewCourse={setNewCourse}
      />

      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditCourse={handleEditCourse}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />

      <AssignUsersModal
        isOpen={isAssignUsersModalOpen}
        onClose={() => setIsAssignUsersModalOpen(false)}
        selectedCourse={selectedCourse}
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
        onAssignUsers={handleAssignUsers}
      />

      <ManageResourcesModal
        isOpen={isManageResourcesModalOpen}
        onClose={() => setIsManageResourcesModalOpen(false)}
        onManageResources={handleManageResources}
      />
    </div>
  );
};

export default CourseManagementContent;