import React from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
} from '@/components/ui/modal';

const UnitDetailsModal = ({ isOpen, onClose, unit, onMarkComplete }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{unit.title}</ModalHeader>
        <ModalCloseButton>
          <FaTimes />
        </ModalCloseButton>
        <ModalBody>
          <p className="text-base-content mb-4">{unit.content}</p>
          {unit.quiz && unit.quiz.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Quiz</h3>
              {unit.quiz.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="font-medium">{q.question}</p>
                  <ul className="ml-4">
                    {q.options.map((option, oIndex) => (
                      <li key={oIndex} className={oIndex === q.correctAnswer ? "text-success" : ""}>
                        {option}
                        {oIndex === q.correctAnswer && " (Correct)"}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <Button 
              colorScheme={unit.completed ? "green" : "gray"}
              onClick={() => {
                onMarkComplete();
                onClose();
              }}
            >
              {unit.completed ? "Completed" : "Mark Complete"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UnitDetailsModal;