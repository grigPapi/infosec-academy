/**
 * InfoSec Academy - Отслеживание прогресса в курсе
 */

document.addEventListener('DOMContentLoaded', function() {
  initCourseProgress();
});

/**
 * Инициализация отслеживания прогресса в курсе
 */
function initCourseProgress() {
  // Обновляем прогресс-бар, если он присутствует на странице
  const progressBar = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressBar && progressText) {
    updateProgressDisplay();
  }
  
  // Отмечаем текущий урок как просмотренный
  markCurrentLessonAsViewed();
}

/**
 * Обновление отображения прогресса
 */
function updateProgressDisplay() {
  const currentCourse = document.body.dataset.course;
  const currentTopic = document.body.dataset.topic;
  
  if (!currentCourse) return;
  
  // Получаем сохраненный прогресс из localStorage
  const courseProgress = getCourseProgress(currentCourse);
  
  // Находим все уроки для текущего курса
  const lessonLinks = document.querySelectorAll('.lesson-navigation a');
  
  if (lessonLinks.length) {
    // Подсчитываем количество просмотренных уроков
    let viewedCount = 0;
    
    lessonLinks.forEach(link => {
      const lessonUrl = link.getAttribute('href');
      const lessonKey = extractLessonKeyFromUrl(lessonUrl);
      
      if (courseProgress[lessonKey]) {
        viewedCount++;
        link.classList.add('viewed');
      }
      
      // Если это текущий урок, добавляем класс
      if (link.classList.contains('active')) {
        link.classList.add('current');
      }
    });
    
    // Обновляем прогресс-бар
    const totalLessons = lessonLinks.length;
    const progressPercentage = Math.round((viewedCount / totalLessons) * 100);
    
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
      progressBar.style.width = `${progressPercentage}%`;
      progressText.textContent = `${viewedCount} из ${totalLessons} уроков (${progressPercentage}%)`;
    }
  }
}

/**
 * Отметка текущего урока как просмотренного
 */
function markCurrentLessonAsViewed() {
  const currentCourse = document.body.dataset.course;
  const currentLesson = document.body.dataset.lesson;
  
  if (currentCourse && currentLesson) {
    // Получаем текущий прогресс
    let courseProgress = getCourseProgress(currentCourse);
    
    // Обновляем информацию о просмотре урока
    courseProgress[currentLesson] = {
      viewed: true,
      lastViewed: new Date().toISOString()
    };
    
    // Сохраняем обновленный прогресс
    saveCourseProgress(currentCourse, courseProgress);
    
    // Обновляем отображение
    updateProgressDisplay();
  }
}

/**
 * Обновление прогресса после прохождения теста
 */
function updateCourseProgress(topicId, lessonId) {
  const currentCourse = document.body.dataset.course;
  
  if (!currentCourse) return;
  
  // Получаем текущий прогресс
  let courseProgress = getCourseProgress(currentCourse);
  
  // Создаем ключ для урока
  const lessonKey = `${topicId}/${lessonId}`;
  
  // Обновляем информацию о прохождении теста
  if (courseProgress[lessonKey]) {
    courseProgress[lessonKey].quizCompleted = true;
    courseProgress[lessonKey].quizCompletedAt = new Date().toISOString();
  } else {
    courseProgress[lessonKey] = {
      viewed: true,
      lastViewed: new Date().toISOString(),
      quizCompleted: true,
      quizCompletedAt: new Date().toISOString()
    };
  }
  
  // Сохраняем обновленный прогресс
  saveCourseProgress(currentCourse, courseProgress);
  
  // Обновляем отображение
  updateProgressDisplay();
}

/**
 * Получение прогресса для курса
 */
function getCourseProgress(courseId) {
  try {
    // Получаем сохраненный прогресс или создаем новый объект
    let allCourseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    
    // Возвращаем прогресс для конкретного курса или пустой объект
    return allCourseProgress[courseId] || {};
  } catch (error) {
    console.error('Ошибка при получении прогресса курса:', error);
    return {};
  }
}

/**
 * Сохранение прогресса для курса
 */
function saveCourseProgress(courseId, courseProgress) {
  try {
    // Получаем сохраненный прогресс или создаем новый объект
    let allCourseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    
    // Обновляем прогресс для конкретного курса
    allCourseProgress[courseId] = courseProgress;
    
    // Сохраняем обновленный прогресс
    localStorage.setItem('courseProgress', JSON.stringify(allCourseProgress));
  } catch (error) {
    console.error('Ошибка при сохранении прогресса курса:', error);
  }
}

/**
 * Извлечение ключа урока из URL
 */
function extractLessonKeyFromUrl(url) {
  if (!url) return '';
  
  // Удаляем базовый URL и расширение файла, если они есть
  const cleanUrl = url.replace(/^\/|\.html$|\/$/g, '');
  
  // Разбиваем URL на компоненты
  const parts = cleanUrl.split('/');
  
  // Возвращаем последние два сегмента (тема/урок)
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
  }
  
  return cleanUrl;
}