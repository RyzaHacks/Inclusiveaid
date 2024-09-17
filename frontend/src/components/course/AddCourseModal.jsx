import React, { useState, useEffect } from 'react';

const AddCourseModal = ({ isOpen, onClose, onAddCourse, newCourse, setNewCourse }) => {
  // Ensure `newCourse` is properly initialized with an empty modules array if it doesn't exist
  const [modules, setModules] = useState(newCourse?.modules || []);

  useEffect(() => {
    setModules(newCourse?.modules || []);
  }, [newCourse]);

  const handleAddModule = () => {
    setModules([...modules, { title: '', units: [] }]);
  };

  const handleAddUnit = (moduleIndex) => {
    const updatedModules = modules.map((mod, i) =>
      i === moduleIndex ? { ...mod, units: [...mod.units, { title: '', content: '', quiz: { questions: [] } }] } : mod
    );
    setModules(updatedModules);
  };

  const handleAddQuestion = (moduleIndex, unitIndex) => {
    const updatedModules = modules.map((mod, i) =>
      i === moduleIndex ? {
        ...mod,
        units: mod.units.map((unit, j) =>
          j === unitIndex ? { ...unit, quiz: { ...unit.quiz, questions: [...(unit.quiz?.questions || []), { question: '', options: [], correctAnswer: null }] } } : unit
        )
      } : mod
    );
    setModules(updatedModules);
  };

  const handleSaveCourse = () => {
    setNewCourse({ ...newCourse, modules });
    onAddCourse();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-4xl">
        <h3 className="font-bold text-lg mb-4">Add New Course</h3>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="form-control">
            <label className="label font-semibold">Course Title</label>
            <input
              type="text"
              placeholder="Course Title"
              className="input input-bordered"
              value={newCourse?.title || ''}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Course Description</label>
            <textarea
              placeholder="Course Description"
              className="textarea textarea-bordered"
              value={newCourse?.description || ''}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Module Title"
                  className="input input-bordered flex-grow mr-2"
                  value={module.title}
                  onChange={(e) => {
                    const updatedModules = [...modules];
                    updatedModules[moduleIndex].title = e.target.value;
                    setModules(updatedModules);
                  }}
                />
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => {
                    const updatedModules = modules.filter((_, i) => i !== moduleIndex);
                    setModules(updatedModules);
                  }}
                >
                  Remove Module
                </button>
              </div>

              {module.units.map((unit, unitIndex) => (
                <div key={unitIndex} className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      placeholder="Unit Title"
                      className="input input-bordered flex-grow mr-2"
                      value={unit.title}
                      onChange={(e) => {
                        const updatedModules = [...modules];
                        updatedModules[moduleIndex].units[unitIndex].title = e.target.value;
                        setModules(updatedModules);
                      }}
                    />
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => {
                        const updatedModules = modules.map((mod, i) =>
                          i === moduleIndex
                            ? {
                                ...mod,
                                units: mod.units.filter((_, j) => j !== unitIndex),
                              }
                            : mod
                        );
                        setModules(updatedModules);
                      }}
                    >
                      Remove Unit
                    </button>
                  </div>

                  <textarea
                    placeholder="Unit Content"
                    className="textarea textarea-bordered mb-2"
                    value={unit.content}
                    onChange={(e) => {
                      const updatedModules = [...modules];
                      updatedModules[moduleIndex].units[unitIndex].content = e.target.value;
                      setModules(updatedModules);
                    }}
                  />

                  <div className="form-control">
                    <label className="label font-semibold">Quiz Questions</label>
                    {unit.quiz?.questions?.length > 0 ? (
                      unit.quiz.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="bg-white p-3 mb-3 rounded-lg border shadow-sm">
                          <input
                            type="text"
                            placeholder="Question"
                            className="input input-bordered mb-2"
                            value={question.question}
                            onChange={(e) => {
                              const updatedModules = [...modules];
                              updatedModules[moduleIndex].units[unitIndex].quiz.questions[questionIndex].question = e.target.value;
                              setModules(updatedModules);
                            }}
                          />
                          <div className="form-control">
                            <label className="label font-semibold">Options</label>
                            {question.options.map((option, optionIndex) => (
                              <input
                                key={optionIndex}
                                type="text"
                                placeholder={`Option ${optionIndex + 1}`}
                                className="input input-bordered mb-2"
                                value={option}
                                onChange={(e) => {
                                  const updatedModules = [...modules];
                                  updatedModules[moduleIndex].units[unitIndex].quiz.questions[questionIndex].options[optionIndex] = e.target.value;
                                  setModules(updatedModules);
                                }}
                              />
                            ))}
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                const updatedModules = [...modules];
                                updatedModules[moduleIndex].units[unitIndex].quiz.questions[questionIndex].options.push('');
                                setModules(updatedModules);
                              }}
                            >
                              Add Option
                            </button>
                          </div>
                          <input
                            type="number"
                            placeholder="Correct Answer Index"
                            className="input input-bordered"
                            value={question.correctAnswer}
                            onChange={(e) => {
                              const updatedModules = [...modules];
                              updatedModules[moduleIndex].units[unitIndex].quiz.questions[questionIndex].correctAnswer = parseInt(e.target.value);
                              setModules(updatedModules);
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No questions added.</p>
                    )}
                    <button
                      className="btn btn-sm btn-secondary mt-2"
                      onClick={() => handleAddQuestion(moduleIndex, unitIndex)}
                    >
                      Add Question
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary mt-4"
                onClick={() => handleAddUnit(moduleIndex)}
              >
                Add Unit
              </button>
            </div>
          ))}
          <button className="btn btn-sm btn-primary mt-4" onClick={handleAddModule}>
            Add Module
          </button>
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleSaveCourse}>
            Save Course
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
