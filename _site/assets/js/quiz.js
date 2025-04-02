/**
 * InfoSec Academy - Обработка тестов и викторин
 */

document.addEventListener('DOMContentLoaded', function() {
  initQuizzes();
});

/**
 * Инициализация тестов
 */
function initQuizzes() {
  const quizSubmitButtons = document.querySelectorAll('.quiz-submit');
  
  if (!quizSubmitButtons.length) return;
  
  quizSubmitButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Получаем идентификаторы темы и урока
      const topicId = this.dataset.topic;
      const lessonId = this.dataset.lesson;
      const quizSection = this.closest('.quiz-section');
      const quizId = quizSection.dataset.quizId;
      
      // Получаем все вопросы и ответы пользователя
      const questions = quizSection.querySelectorAll('.quiz-question');
      let userAnswers = [];
      let score = 0;
      let feedback = '<h3>Результаты:</h3>';
      
      // Собираем ответы пользователя
      questions.forEach((question, index) => {
        const questionId = question.dataset.questionId;
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        
        if (selectedOption) {
          userAnswers.push({
            questionId: questionId,
            answerId: selectedOption.value
          });
        } else {
          userAnswers.push({
            questionId: questionId,
            answerId: null
          });
        }
      });
      
      // Получаем правильные ответы из конфигурации теста
      getQuizAnswers(topicId, lessonId, quizId)
        .then(correctAnswers => {
          // Проверяем ответы и формируем результаты
          userAnswers.forEach((answer, index) => {
            const questionNumber = index + 1;
            
            if (answer.answerId === null) {
              feedback += `<p class="quiz-result-item quiz-unanswered">
                <span class="quiz-question-number">${questionNumber}.</span> 
                <span class="quiz-result-text">Вы не ответили на этот вопрос.</span>
              </p>`;
            } else if (correctAnswers[index] && answer.answerId === correctAnswers[index].correctAnswer) {
              score++;
              feedback += `<p class="quiz-result-item quiz-correct">
                <span class="quiz-question-number">${questionNumber}.</span> 
                <span class="quiz-result-text">Верно! ${correctAnswers[index].feedback || ''}</span>
              </p>`;
            } else {
              feedback += `<p class="quiz-result-item quiz-incorrect">
                <span class="quiz-question-number">${questionNumber}.</span> 
                <span class="quiz-result-text">Неверно. ${correctAnswers[index] ? correctAnswers[index].feedback || '' : ''}</span>
              </p>`;
            }
          });
          
          // Добавляем итоговый счет
          const percentage = Math.round((score / questions.length) * 100);
          feedback += `<p class="quiz-result-summary">Ваш результат: ${score} из ${questions.length} (${percentage}%)</p>`;
          
          // Отображаем результаты
          const resultsContainer = quizSection.querySelector('.quiz-results');
          resultsContainer.innerHTML = feedback;
          resultsContainer.style.display = 'block';
          
          // Прокручиваем к результатам
          resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
          
          // Сохраняем результаты в localStorage
          saveQuizResults(topicId, lessonId, quizId, score, questions.length);
          
          // Если результат отличный, анимируем
          if (percentage >= 80) {
            setTimeout(() => {
              resultsContainer.classList.add('quiz-success-animation');
            }, 300);
          }
        })
        .catch(error => {
          console.error('Ошибка при получении ответов теста:', error);
          const resultsContainer = quizSection.querySelector('.quiz-results');
          resultsContainer.innerHTML = '<p class="quiz-error">Произошла ошибка при проверке ответов. Пожалуйста, попробуйте еще раз.</p>';
          resultsContainer.style.display = 'block';
        });
    });
  });
}

/**
 * Получение правильных ответов для теста
 * В реальном приложении здесь будет запрос к API или local JSON
 */
function getQuizAnswers(topicId, lessonId, quizId) {
  // Мок-данные для демонстрации
  // В реальном приложении это можно заменить на fetch к API или загрузку JSON
  
  // Для демонстрации, предположим, что у нас есть предопределенный набор ответов
  const quizAnswers = {
    'network-security/tcpip-basics': [
      { correctAnswer: '3', feedback: 'TCP работает на транспортном уровне.' },
      { correctAnswer: '2', feedback: 'TCP SYN-флуд - это атака на транспортный уровень.' }
    ],
    // Другие тесты...
  };
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const key = `${topicId}/${lessonId}`;
      if (quizAnswers[key]) {
        resolve(quizAnswers[key]);
      } else {
        reject('Ответы для данного теста не найдены');
      }
    }, 500);
  });
}

/**
 * Сохранение результатов теста в localStorage
 */
function saveQuizResults(topicId, lessonId, quizId, score, total) {
  try {
    // Получаем текущие результаты или создаем новый объект
    let quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    
    // Создаем ключ для текущего теста
    const key = `${topicId}/${lessonId}/${quizId}`;
    
    // Сохраняем результат и время прохождения
    quizResults[key] = {
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      timestamp: new Date().toISOString()
    };
    
    // Сохраняем обновленные результаты
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // Обновляем прогресс в курсе, если функция доступна
    if (typeof updateCourseProgress === 'function') {
      updateCourseProgress(topicId, lessonId);
    }
  } catch (error) {
    console.error('Ошибка при сохранении результатов теста:', error);
  }
}