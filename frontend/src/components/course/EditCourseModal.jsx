import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaTrash, FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';

const EditCourseModal = ({ isOpen, onClose, onEditCourse, selectedCourse }) => {
  const [editableCourse, setEditableCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      setEditableCourse({
        ...selectedCourse,
        modules: (selectedCourse.modules || []).map((module) => ({
          ...module,
          units: (module.units || []).map((unit) => ({
            ...unit,
            quiz: unit.type === 'quiz' ? JSON.parse(unit.content) : null,
          })),
        })),
      });
      setSelectedModule(null);
      setSelectedUnit(null);
    }
  }, [selectedCourse]);

  if (!isOpen || !editableCourse) return null;

  const updateCourse = (updatedCourse) => {
    setEditableCourse(updatedCourse);
  };

  const updateModule = (moduleIndex, updatedModule) => {
    const updatedModules = [...editableCourse.modules];
    updatedModules[moduleIndex] = updatedModule;
    updateCourse({ ...editableCourse, modules: updatedModules });
  };

  const updateUnit = (moduleIndex, unitIndex, updatedUnit) => {
    const updatedModules = [...editableCourse.modules];
    updatedModules[moduleIndex].units[unitIndex] = updatedUnit;
    updateCourse({ ...editableCourse, modules: updatedModules });
  };

  const handleAddModule = () => {
    const newModule = {
      id: Date.now(),
      title: 'New Module',
      description: '',
      order: editableCourse.modules.length + 1,
      units: [],
    };
    updateCourse({ ...editableCourse, modules: [...editableCourse.modules, newModule] });
  };

  const handleAddUnit = (moduleIndex) => {
    const newUnit = {
      id: Date.now(),
      title: 'New Unit',
      type: 'text',
      content: '',
      order: editableCourse.modules[moduleIndex].units.length + 1,
      quiz: null,
    };
    const updatedModule = { ...editableCourse.modules[moduleIndex], units: [...editableCourse.modules[moduleIndex].units, newUnit] };
    updateModule(moduleIndex, updatedModule);
  };

  const handleAddQuestion = (moduleIndex, unitIndex) => {
    const newQuestion = {
      id: Date.now(),
      text: 'New Question',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
    };
    const updatedUnit = {
      ...editableCourse.modules[moduleIndex].units[unitIndex],
      quiz: {
        ...editableCourse.modules[moduleIndex].units[unitIndex].quiz,
        questions: [...(editableCourse.modules[moduleIndex].units[unitIndex].quiz?.questions || []), newQuestion],
      },
    };
    updateUnit(moduleIndex, unitIndex, updatedUnit);
  };

  const handleUpdateQuestion = (moduleIndex, unitIndex, questionIndex, field, value) => {
    const updatedQuestions = [...editableCourse.modules[moduleIndex].units[unitIndex].quiz.questions];
    if (field === 'options') {
      updatedQuestions[questionIndex].options[value.optionIndex] = value.option;
    } else {
      updatedQuestions[questionIndex][field] = field === 'correctAnswer' ? parseInt(value, 10) : value;
    }
    const updatedUnit = {
      ...editableCourse.modules[moduleIndex].units[unitIndex],
      quiz: {
        ...editableCourse.modules[moduleIndex].units[unitIndex].quiz,
        questions: updatedQuestions,
      },
    };
    updateUnit(moduleIndex, unitIndex, updatedUnit);
  };

  const handleSaveChanges = () => {
    const updatedCourse = {
      ...editableCourse,
      modules: editableCourse.modules.map(module => ({
        ...module,
        units: module.units.map(unit => ({
          ...unit,
          content: unit.type === 'quiz' ? JSON.stringify(unit.quiz) : unit.content,
        })),
      })),
    };
    onEditCourse(updatedCourse);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Course: {editableCourse.title}</h2>
                <button className="text-white hover:text-red-300 transition-colors" onClick={onClose}>
                  <FaTrash />
                </button>
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="flex h-full">
                  {/* Left panel: Course structure */}
                  <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">Course Structure</h3>
                    <div className="space-y-2">
                      {editableCourse.modules.map((module, moduleIndex) => (
                        <div key={module.id} className="bg-white rounded-lg shadow p-2">
                          <div className="flex items-center justify-between">
                            <button
                              className="text-left flex-grow font-medium"
                              onClick={() => setSelectedModule(moduleIndex)}
                            >
                              {module.title}
                            </button>
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() => setSelectedModule(moduleIndex)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {
                                  const updatedModules = editableCourse.modules.filter((_, i) => i !== moduleIndex);
                                  updateCourse({ ...editableCourse, modules: updatedModules });
                                }}
                              >
                                <FaMinus />
                              </button>
                            </div>
                          </div>
                          {module.units.map((unit, unitIndex) => (
                            <div key={unit.id} className="ml-4 mt-2 flex items-center justify-between">
                              <button
                                className="text-left flex-grow text-sm"
                                onClick={() => {
                                  setSelectedModule(moduleIndex);
                                  setSelectedUnit(unitIndex);
                                }}
                              >
                                {unit.title}
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  className="text-blue-500 hover:text-blue-700 text-sm"
                                  onClick={() => {
                                    setSelectedModule(moduleIndex);
                                    setSelectedUnit(unitIndex);
                                  }}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  onClick={() => {
                                    const updatedUnits = module.units.filter((_, i) => i !== unitIndex);
                                    updateModule(moduleIndex, { ...module, units: updatedUnits });
                                  }}
                                >
                                  <FaMinus />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            className="mt-2 text-green-500 hover:text-green-700 text-sm"
                            onClick={() => handleAddUnit(moduleIndex)}
                          >
                            <FaPlus /> Add Unit
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      onClick={handleAddModule}
                    >
                      <FaPlus /> Add Module
                    </button>
                  </div>
                  {/* Right panel: Edit area */}
                  <div className="w-2/3 p-6 overflow-y-auto">
                    {selectedModule !== null ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Edit Module</h3>
                        <input
                          type="text"
                          className="w-full p-2 border rounded mb-4"
                          value={editableCourse.modules[selectedModule].title}
                          onChange={(e) => updateModule(selectedModule, { ...editableCourse.modules[selectedModule], title: e.target.value })}
                        />
                        <textarea
                          className="w-full p-2 border rounded mb-4"
                          rows="3"
                          value={editableCourse.modules[selectedModule].description}
                          onChange={(e) => updateModule(selectedModule, { ...editableCourse.modules[selectedModule], description: e.target.value })}
                        />
                        <input
                          type="number"
                          className="w-full p-2 border rounded mb-4"
                          value={editableCourse.modules[selectedModule].order}
                          onChange={(e) => updateModule(selectedModule, { ...editableCourse.modules[selectedModule], order: parseInt(e.target.value) })}
                        />
                        {selectedUnit !== null && (
                          <div className="mt-8">
                            <h4 className="text-lg font-semibold mb-4">Edit Unit</h4>
                            <input
                              type="text"
                              className="w-full p-2 border rounded mb-4"
                              value={editableCourse.modules[selectedModule].units[selectedUnit].title}
                              onChange={(e) => updateUnit(selectedModule, selectedUnit, { ...editableCourse.modules[selectedModule].units[selectedUnit], title: e.target.value })}
                            />
                            <select
                              className="w-full p-2 border rounded mb-4"
                              value={editableCourse.modules[selectedModule].units[selectedUnit].type}
                              onChange={(e) => updateUnit(selectedModule, selectedUnit, { ...editableCourse.modules[selectedModule].units[selectedUnit], type: e.target.value })}
                            >
                              <option value="text">Text</option>
                              <option value="video">Video</option>
                              <option value="audio">Audio</option>
                              <option value="quiz">Quiz</option>
                            </select>
                            {editableCourse.modules[selectedModule].units[selectedUnit].type !== 'quiz' ? (
                              <textarea
                                className="w-full p-2 border rounded mb-4"
                                rows="5"
                                value={editableCourse.modules[selectedModule].units[selectedUnit].content}
                                onChange={(e) => updateUnit(selectedModule, selectedUnit, { ...editableCourse.modules[selectedModule].units[selectedUnit], content: e.target.value })}
                              />
                            ) : (
                              <div className="space-y-4">
                                {editableCourse.modules[selectedModule].units[selectedUnit].quiz?.questions?.map((question, questionIndex) => (
                                  <div key={question.id} className="bg-gray-100 p-4 rounded">
                                    <input
                                      type="text"
                                      className="w-full p-2 border rounded mb-2"
                                      value={question.text}
                                      onChange={(e) => handleUpdateQuestion(selectedModule, selectedUnit, questionIndex, 'text', e.target.value)}
                                    />
                                    {question.options.map((option, optionIndex) => (
                                      <input
                                        key={optionIndex}
                                        type="text"
                                        className="w-full p-2 border rounded mb-2"
                                        value={option}
                                        onChange={(e) => handleUpdateQuestion(selectedModule, selectedUnit, questionIndex, 'options', { optionIndex, option: e.target.value })}
                                      />
                                    ))}
                                    <select
                                      className="w-full p-2 border rounded"
                                      value={question.correctAnswer}
                                      onChange={(e) => handleUpdateQuestion(selectedModule, selectedUnit, questionIndex, 'correctAnswer', e.target.value)}
                                    >
                                      {question.options.map((_, index) => (
                                        <option key={index} value={index}>Correct Answer: Option {index + 1}</option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                  onClick={() => handleAddQuestion(selectedModule, selectedUnit)}
                                >
                                  Add Question
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Edit Course</h3>
                        <input
                          type="text"
                          className="w-full p-2 border rounded mb-4"
                          value={editableCourse.title}
                          onChange={(e) => updateCourse({ ...editableCourse, title: e.target.value })}
                        />
                        <textarea
                          className="w-full p-2 border rounded mb-4"
                          rows="3"
                          value={editableCourse.description}
                          onChange={(e) => updateCourse({ ...editableCourse, description: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-4">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCourseModal;