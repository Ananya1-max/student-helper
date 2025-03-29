import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useTimer } from 'react-timer-hook';

const ExamScreen = ({ examId }) => {
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const { seconds, minutes, start, pause, isRunning } = useTimer({
    expiryTimestamp: new Date(),
    onExpire: () => setIsFinished(true),
  });
  const [score, setScore] = useState(0); // Add state for score

  useEffect(() => {
    // Fetch exam details
    const fetchExam = async () => {
      // Simulate fetching exam content from a server
      setTimeout(() => {
        setExam({
          id: examId,
          title: `Exam ${examId}`,
          questions: [
            {
              id: 'q1',
              text: 'What is the capital of France?',
              options: ['London', 'Paris', 'Berlin', 'Rome'],
              correctAnswer: 'Paris',
            },
            {
              id: 'q2',
              text: 'What is the highest mountain in the world?',
              options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
              correctAnswer: 'Mount Everest',
            },
          ],
          duration: 2, // in minutes
        });
      }, 500);
    };
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (exam) {
      const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + exam.duration * 60);
      start(expiryTime);
    }
  }, [exam, start]);

  const handleAnswer = useCallback(
    (option) => {
      setSelectedAnswer(option);
      setAnswers({ ...answers, [exam.questions[currentQuestionIndex].id]: option });
    },
    [answers, currentQuestionIndex, exam?.questions]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, exam?.questions.length]);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
    }
  };

  const handleSubmitExam = () => {
    pause();
    setIsFinished(true);

    let calculatedScore = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
  };

  if (!exam) {
    return <Text>Loading Exam...</Text>;
  }

  if (isFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Exam Finished</Text>
        <Text style={styles.result}>
          Your score: {score} / {exam.questions.length}
        </Text>
      </View>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exam.title}</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>
          Time Remaining: {minutes}:{seconds}
        </Text>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.question}>{currentQuestion.text}</Text>
        {currentQuestion.options.map((option) => (
          <Button
            key={option}
            title={option}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedAnswer}
            color={selectedAnswer === option ? 'green' : undefined}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Previous"
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        />
        <Button
          title={
            currentQuestionIndex === exam.questions.length - 1
              ? 'Submit'
              : 'Next'
          }
          onPress={
            currentQuestionIndex === exam.questions.length - 1
              ? handleSubmitExam
              : handleNextQuestion
          }
          disabled={!selectedAnswer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  questionContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  question: {
    fontSize: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  timerContainer: {
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ExamScreen;