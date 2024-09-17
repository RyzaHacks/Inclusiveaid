import React, { useState, useEffect, useMemo } from 'react';
import {
  FaUserGraduate, FaBook, FaClipboardList, FaCheckCircle, FaSearch, 
  FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaEdit, 
  FaSave, FaTimes
} from 'react-icons/fa';
import api from '../../utils/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnhancedUserProgressManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserProgress(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/users/progress/all');
      setUsers(response.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProgress = async (userId) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/users/progress/${userId}`);
      setUserProgress(response.data || null);
      setEditedAnswers({});
    } catch (err) {
      console.error('Error fetching user progress:', err);
      setError('Failed to fetch user progress. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [filteredUsers, currentPage, usersPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getProgressChartData = (user) => {
    if (!user || !Array.isArray(user.courses) || user.courses.length === 0) return null;
    return {
      labels: user.courses.map(course => course.title || 'Unnamed Course'),
      datasets: [{
        label: 'Course Progress',
        data: user.courses.map(course => course.progress || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
  };

  const handleEditAnswer = (moduleId, unitId, questionId, answer) => {
    setEditedAnswers(prev => ({
      ...prev,
      [`${moduleId}-${unitId}-${questionId}`]: answer
    }));
  };

  const saveAnswers = async (moduleId, unitId) => {
    try {
      const answers = Object.entries(editedAnswers)
        .filter(([key]) => key.startsWith(`${moduleId}-${unitId}`))
        .map(([key, value]) => ({
          questionId: key.split('-')[2],
          answer: value
        }));

      await api.post(`/api/users/${selectedUserId}/modules/${moduleId}/units/${unitId}/progress`, {
        answers
      });

      fetchUserProgress(selectedUserId);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving answers:', error);
      setError('Failed to save answers. Please try again.');
    }
  };

  const renderUserList = () => (
    <div className="space-y-2">
      {currentUsers.map((user) => (
        <button
          key={`user-${user.id}`}
          className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
            selectedUserId === user.id 
              ? 'bg-primary text-primary-content shadow-lg transform scale-105' 
              : 'bg-base-200 hover:bg-base-300 text-base-content'
          }`}
          onClick={() => setSelectedUserId(user.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="avatar placeholder mr-2">
                <div className="bg-neutral text-neutral-content rounded-full w-8">
                  <span>{user.name?.charAt(0).toUpperCase() || '?'}</span>
                </div>
              </div>
              <span className="font-medium">{user.name || 'Unnamed User'}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">{user.overallProgress ?? 0}%</span>
              <progress 
                className="progress progress-primary w-20" 
                value={user.overallProgress ?? 0} 
                max="100"
              ></progress>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderPagination = () => (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        className="btn btn-circle btn-sm"
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </button>
      <span className="text-sm">
        Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
      </span>
      <button
        className="btn btn-circle btn-sm"
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
      >
        <FaChevronRight />
      </button>
    </div>
  );

  const renderUserProgress = () => {
    if (!userProgress) return null;

    return (
      <div className="space-y-8">
        <div className="bg-base-100 rounded-box shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{userProgress.name || 'User'}'s Progress</h2>
          <div className="mb-6 flex items-center">
            <div className="radial-progress text-primary" style={{"--value":userProgress.overallProgress ?? 0, "--size": "8rem"}}>
              {userProgress.overallProgress ?? 0}%
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold">Overall Progress</div>
              <div className="text-sm text-base-content/70">Across all courses</div>
            </div>
          </div>
          <div className="h-64">
            {getProgressChartData(userProgress) ? (
              <Bar 
                data={getProgressChartData(userProgress)} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }} 
              />
            ) : (
              <p>No data available for the chart.</p>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {Array.isArray(userProgress.courses) && userProgress.courses.map((course, courseIndex) => (
            <div key={`course-${course.id}-${courseIndex}`} className="collapse collapse-arrow bg-base-100 rounded-box">
              <input type="checkbox" /> 
              <div className="collapse-title text-xl font-medium flex justify-between items-center">
                <span>{course.title || 'Unnamed Course'}</span>
                <span className="badge badge-primary">{course.progress ?? 0}% Complete</span>
              </div>
              <div className="collapse-content"> 
                <p className="text-base-content/70 mb-4">{course.description || 'No description available'}</p>
                <div className="space-y-4">
                  {Array.isArray(course.modules) && course.modules.map((module, moduleIndex) => (
                    <div key={`module-${module.id}-${moduleIndex}`} className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title flex justify-between">
                          <span>{module.title || 'Unnamed Module'}</span>
                          <span className="badge badge-secondary">{module.progress ?? 0}%</span>
                        </h3>
                        <p className="text-base-content/70">{module.description || 'No description available'}</p>
                        <div className="space-y-2 mt-4">
                          {Array.isArray(module.units) && module.units.map((unit, unitIndex) => (
                            <div key={`unit-${unit.id}-${unitIndex}`} className="bg-base-100 p-4 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">{unit.title || 'Unnamed Unit'}</h4>
                                {unit.completed ? (
                                  <span className="badge badge-success gap-2">
                                    <FaCheckCircle /> Completed
                                  </span>
                                ) : (
                                  <span className="badge badge-warning gap-2">
                                    {unit.progress ?? 0}% Complete
                                  </span>
                                )}
                              </div>
                              {Array.isArray(unit.quiz) && unit.quiz.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-semibold mb-2">Quiz</h5>
                                  {unit.quiz.map((question, qIndex) => (
                                    <div key={`question-${question.id}-${qIndex}`} className="mb-4">
                                      <p className="font-medium">{question.question}</p>
                                      {isEditMode ? (
                                        <input
                                          type="text"
                                          className="input input-bordered w-full mt-2"
                                          value={editedAnswers[`${module.id}-${unit.id}-${question.id}`] || ''}
                                          onChange={(e) => handleEditAnswer(module.id, unit.id, question.id, e.target.value)}
                                        />
                                      ) : (
                                        <p className="text-base-content/70 mt-1">Answer: {question.answer || 'Not answered'}</p>
                                      )}
                                    </div>
                                  ))}
                                  {isEditMode ? (
                                    <div className="flex justify-end mt-4">
                                      <button 
                                        className="btn btn-primary"
                                        onClick={() => saveAnswers(module.id, unit.id)}
                                      >
                                        <FaSave className="mr-2" /> Save Answers
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end mt-4">
                                      <button 
                                        className="btn btn-outline btn-primary"
                                        onClick={() => setIsEditMode(true)}
                                      >
                                        <FaEdit className="mr-2" /> Edit Answers
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="bg-base-200 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-base-content mb-8">User Progress Manager</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-base-100 rounded-box shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Users</h2>
              <div className="form-control mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full"
                  />
                  <button className="btn btn-square">
                    <FaSearch />
                  </button>
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : error ? (
                <div className="alert alert-error">
                  <FaExclamationTriangle />
                  <span>{error}</span>
                </div>
              ) : (
                <>
                  {renderUserList()}
                  {renderPagination()}
                </>
              )}
            </div>
          </aside>
          
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : error ? (
              <div className="alert alert-error">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            ) : userProgress ? (
              renderUserProgress()
            ) : (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <FaExclamationTriangle className="text-warning text-5xl mb-4" />
                  <h3 className="card-title">Select a user to view their progress</h3>
                  <p>Choose a user from the list on the left to see detailed progress information.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">User Progress Details</h3>
          <div className="py-4">{modalContent}</div>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUserProgressManager;
