import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';

const Modules = ({ module, courseId, userId, onProgressUpdate, onExitModule }) => {
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [completedUnits, setCompletedUnits] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    setCurrentUnitIndex(0);
    setCompletedUnits([]);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResults(null);
  }, [module]);

  if (!module || !module.units || module.units.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{module?.title || 'Module'}</h2>
        <p className="text-gray-600">This module doesn't have any units yet.</p>
        <button
          onClick={onExitModule}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Back to Course
        </button>
      </div>
    );
  }

  const currentUnit = module.units[currentUnitIndex];

  const updateModuleProgress = () => {
    const progress = ((completedUnits.length + 1) / module.units.length) * 100;
    onProgressUpdate(courseId, module.id, progress);
  };

  const handleUnitCompletion = () => {
    if (!completedUnits.includes(currentUnitIndex)) {
      const newCompletedUnits = [...completedUnits, currentUnitIndex];
      setCompletedUnits(newCompletedUnits);
      updateModuleProgress();
    }
  };

  const handleNextUnit = () => {
    handleUnitCompletion();
    if (currentUnitIndex < module.units.length - 1) {
      setCurrentUnitIndex(prevIndex => prevIndex + 1);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResults(null);
    } else {
      onProgressUpdate(courseId, module.id, 100);
      onExitModule();
    }
  };

  const handlePreviousUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(prevIndex => prevIndex - 1);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResults(null);
    }
  };

  const handleAnswerSelection = (questionId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!currentUnit || currentUnit.type !== 'quiz') return;

    let quizData;
    try {
      quizData = JSON.parse(currentUnit.content);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      return;
    }
    
    const results = quizData.questions.map(question => ({
      questionId: question.id,
      selectedAnswer: quizAnswers[question.id],
      correctAnswer: question.correctAnswer
    }));

    setQuizSubmitted(true);
    setQuizResults(results);
    handleUnitCompletion();
  };

  const renderUnitContent = (unit) => {
    if (!unit) return <p className="text-gray-600">No content available for this unit.</p>;

    switch (unit.type) {
      case 'text':
        return <div className="prose max-w-none bg-white p-6 rounded-lg shadow-lg" dangerouslySetInnerHTML={{ __html: unit.content }} />;
      case 'video':
        return (
          <div className="aspect-w-16 aspect-h-9 bg-white p-6 rounded-lg shadow-lg">
            <iframe src={unit.content} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        );
      case 'audio':
        return <audio controls src={unit.content} className="w-full bg-white p-6 rounded-lg shadow-lg" />;
      case 'quiz':
        return quizSubmitted ? renderQuizResults() : renderQuiz(unit);
      default:
        return <p className="bg-white p-6 rounded-lg shadow-lg">Unsupported content type</p>;
    }
  };

  const renderQuiz = (unit) => {
    let quizData;
    try {
      quizData = JSON.parse(unit.content);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      return <p className="text-red-500">Error loading quiz. Please try again later.</p>;
    }
    
    return (
      <div className="space-y-6">
        {quizData.questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Question {index + 1}: {question.text}</h3>
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelection(question.id, optionIndex)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    quizAnswers[question.id] === optionIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={handleSubmitQuiz}
          className="mt-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Submit Quiz
        </motion.button>
      </div>
    );
  };

  const renderQuizResults = () => {
    if (!currentUnit || !quizResults) return null;

    let quizData;
    try {
      quizData = JSON.parse(currentUnit.content);
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      return <p className="text-red-500">Error loading quiz results. Please try again later.</p>;
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Quiz Results</h3>
        <div className="space-y-6">
          {quizResults.map((result, index) => (
            <div key={result.questionId} className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold mb-2 text-gray-800">Question {index + 1}: {quizData.questions[index].text}</p>
              {quizData.questions[index].options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`p-2 rounded-lg mt-2 ${
                    optionIndex === result.correctAnswer
                      ? 'bg-green-200 text-green-800'
                      : optionIndex === result.selectedAnswer && optionIndex !== result.correctAnswer
                      ? 'bg-red-200 text-red-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {option}
                  {optionIndex === result.correctAnswer && <FaCheck className="inline-block ml-2 text-green-600" />}
                  {optionIndex === result.selectedAnswer && optionIndex !== result.correctAnswer && <FaTimes className="inline-block ml-2 text-red-600" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleNextUnit}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {currentUnitIndex === module.units.length - 1 ? 'Finish Module' : 'Next Unit'}
        </motion.button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">{module.title}</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <p className="text-lg font-semibold text-gray-800">Module Progress: {((completedUnits.length / module.units.length) * 100).toFixed(2)}%</p>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
          <div className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${(completedUnits.length / module.units.length) * 100}%` }}></div>
        </div>
      </div>
      {currentUnit && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            Unit {currentUnitIndex + 1}: {currentUnit.title}
          </h3>
          {renderUnitContent(currentUnit)}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePreviousUnit}
          disabled={currentUnitIndex === 0}
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          <FaChevronLeft className="mr-2 inline" />
          Previous
        </motion.button>
        {(currentUnit.type !== 'quiz' || quizSubmitted) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextUnit}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {currentUnitIndex === module.units.length - 1 ? 'Finish Module' : 'Next'}
            <FaChevronRight className="ml-2 inline" />
          </motion.button>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExitModule}
        className="mt-6 text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
      >
        Exit Module
      </motion.button>
    </div>
  );
};

export default Modules;