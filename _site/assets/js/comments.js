/**
 * InfoSec Academy - Система комментариев
 * 
 * Этот модуль обрабатывает отображение и отправку комментариев.
 * Для простоты, комментарии хранятся в localStorage.
 * В реальном проекте здесь должны быть запросы к серверному API.
 */

document.addEventListener('DOMContentLoaded', function() {
  initComments();
});

/**
 * Инициализация системы комментариев
 */
function initComments() {
  const commentForm = document.getElementById('comment-form');
  const commentsContainer = document.getElementById('comments-container');
  
  if (commentForm && commentsContainer) {
    // Получаем идентификатор текущего урока
    const lessonId = commentsContainer.dataset.lessonId;
    
    if (!lessonId) return;
    
    // Загружаем существующие комментарии
    loadComments(lessonId, commentsContainer);
    
    // Обработчик отправки формы комментария
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const textarea = this.querySelector('textarea');
      const commentText = textarea.value.trim();
      
      if (commentText) {
        // Добавляем новый комментарий
        addComment(lessonId, commentText, commentsContainer);
        
        // Очищаем поле ввода
        textarea.value = '';
        
        // Прокручиваем к новому комментарию
        commentsContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

/**
 * Загрузка комментариев для урока
 */
function loadComments(lessonId, container) {
  try {
    // Получаем все комментарии из localStorage
    const allComments = JSON.parse(localStorage.getItem('lessonComments') || '{}');
    
    // Получаем комментарии для конкретного урока
    const lessonComments = allComments[lessonId] || [];
    
    if (lessonComments.length > 0) {
      // Отображаем комментарии
      lessonComments.forEach(comment => {
        appendCommentToDOM(comment, container);
      });
    } else {
      // Если комментариев нет, показываем сообщение
      container.innerHTML = '<li class="no-comments">Пока нет комментариев. Будьте первым!</li>';
    }
  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
    container.innerHTML = '<li class="comments-error">Ошибка при загрузке комментариев</li>';
  }
}

/**
 * Добавление нового комментария
 */
function addComment(lessonId, text, container) {
  try {
    // Получаем имя пользователя или используем гостевое имя
    const userName = localStorage.getItem('userName') || 'Гость ' + Math.floor(Math.random() * 1000);
    
    // Создаем объект комментария
    const comment = {
      id: generateId(),
      author: userName,
      text: text,
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };
    
    // Получаем текущие комментарии
    let allComments = JSON.parse(localStorage.getItem('lessonComments') || '{}');
    
    // Если для этого урока еще нет комментариев, создаем массив
    if (!allComments[lessonId]) {
      allComments[lessonId] = [];
    }
    
    // Добавляем новый комментарий
    allComments[lessonId].push(comment);
    
    // Сохраняем обновленные комментарии
    localStorage.setItem('lessonComments', JSON.stringify(allComments));
    
    // Удаляем сообщение "нет комментариев", если оно есть
    const noCommentsMessage = container.querySelector('.no-comments');
    if (noCommentsMessage) {
      container.removeChild(noCommentsMessage);
    }
    
    // Добавляем комментарий в DOM
    appendCommentToDOM(comment, container);
  } catch (error) {
    console.error('Ошибка при добавлении комментария:', error);
    alert('Не удалось добавить комментарий. Пожалуйста, попробуйте еще раз.');
  }
}

/**
 * Добавление комментария в DOM
 */
function appendCommentToDOM(comment, container) {
  // Форматируем дату
  const commentDate = new Date(comment.date);
  const formattedDate = `${commentDate.toLocaleDateString('ru-RU')}, ${commentDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  
  // Получаем инициалы для аватара
  const initials = getInitials(comment.author);
  
  // Создаем элемент комментария
  const commentElement = document.createElement('li');
  commentElement.className = 'comment-item';
  commentElement.dataset.commentId = comment.id;
  
  commentElement.innerHTML = `
    <div class="comment-header">
      <div class="comment-avatar">${initials}</div>
      <div class="comment-info">
        <span class="comment-author">${escapeHTML(comment.author)}</span>
        <span class="comment-date">${formattedDate}</span>
      </div>
    </div>
    <div class="comment-body">
      <p>${escapeHTML(comment.text)}</p>
    </div>
    <div class="comment-actions">
      <button class="comment-like" data-comment-id="${comment.id}">
        <i class="icon-heart"></i> <span class="like-count">${comment.likes}</span>
      </button>
      <button class="comment-reply" data-comment-id="${comment.id}">
        <i class="icon-reply"></i> Ответить
      </button>
    </div>
  `;
  
  // Добавляем обработчики событий
  setTimeout(() => {
    const likeButton = commentElement.querySelector('.comment-like');
    const replyButton = commentElement.querySelector('.comment-reply');
    
    if (likeButton) {
      likeButton.addEventListener('click', function() {
        likeComment(comment.id, lessonId, this);
      });
    }
    
    if (replyButton) {
      replyButton.addEventListener('click', function() {
        showReplyForm(comment.id, lessonId, commentElement);
      });
    }
  }, 0);
  
  // Добавляем ответы, если они есть
  if (comment.replies && comment.replies.length > 0) {
    const repliesContainer = document.createElement('ul');
    repliesContainer.className = 'comment-replies';
    
    comment.replies.forEach(reply => {
      // Рекурсивно добавляем ответы
      appendCommentToDOM(reply, repliesContainer);
    });
    
    commentElement.appendChild(repliesContainer);
  }
  
  // Добавляем комментарий в контейнер
  container.appendChild(commentElement);
}

/**
 * Обработка лайка комментария
 */
function likeComment(commentId, lessonId, likeButton) {
  try {
    // Получаем все комментарии
    let allComments = JSON.parse(localStorage.getItem('lessonComments') || '{}');
    
    // Находим комментарий
    const lessonComments = allComments[lessonId] || [];
    const comment = findCommentById(lessonComments, commentId);
    
    if (comment) {
      // Увеличиваем счетчик лайков
      comment.likes += 1;
      
      // Обновляем отображение
      const likeCountElement = likeButton.querySelector('.like-count');
      if (likeCountElement) {
        likeCountElement.textContent = comment.likes;
      }
      
      // Сохраняем обновленные комментарии
      localStorage.setItem('lessonComments', JSON.stringify(allComments));
      
      // Добавляем анимацию
      likeButton.classList.add('liked');
      setTimeout(() => {
        likeButton.classList.remove('liked');
      }, 1000);
    }
  } catch (error) {
    console.error('Ошибка при лайке комментария:', error);
  }
}

/**
 * Показать форму для ответа на комментарий
 */
function showReplyForm(commentId, lessonId, commentElement) {
  // Проверяем, существует ли уже форма ответа
  const existingForm = commentElement.querySelector('.reply-form');
  
  if (existingForm) {
    // Если форма уже существует, удаляем ее
    commentElement.removeChild(existingForm);
    return;
  }
  
  // Создаем форму ответа
  const replyForm = document.createElement('div');
  replyForm.className = 'reply-form';
  
  replyForm.innerHTML = `
    <textarea placeholder="Напишите ваш ответ..." required></textarea>
    <div class="reply-form-actions">
      <button type="button" class="cancel-reply">Отмена</button>
      <button type="button" class="submit-reply">Ответить</button>
    </div>
  `;
  
  // Добавляем обработчики событий
  setTimeout(() => {
    const cancelButton = replyForm.querySelector('.cancel-reply');
    const submitButton = replyForm.querySelector('.submit-reply');
    const textarea = replyForm.querySelector('textarea');
    
    if (cancelButton) {
      cancelButton.addEventListener('click', function() {
        commentElement.removeChild(replyForm);
      });
    }
    
    if (submitButton) {
      submitButton.addEventListener('click', function() {
        const replyText = textarea.value.trim();
        
        if (replyText) {
          addReply(commentId, lessonId, replyText, commentElement);
          commentElement.removeChild(replyForm);
        }
      });
    }
    
    // Фокус на поле ввода
    textarea.focus();
  }, 0);
  
  // Добавляем форму после блока действий
  const commentActions = commentElement.querySelector('.comment-actions');
  commentActions.after(replyForm);
}

/**
 * Добавление ответа на комментарий
 */
function addReply(parentCommentId, lessonId, text, commentElement) {
  try {
    // Получаем имя пользователя или используем гостевое имя
    const userName = localStorage.getItem('userName') || 'Гость ' + Math.floor(Math.random() * 1000);
    
    // Создаем объект ответа
    const reply = {
      id: generateId(),
      author: userName,
      text: text,
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
      isReply: true
    };
    
    // Получаем все комментарии
    let allComments = JSON.parse(localStorage.getItem('lessonComments') || '{}');
    
    // Находим родительский комментарий
    const lessonComments = allComments[lessonId] || [];
    const parentComment = findCommentById(lessonComments, parentCommentId);
    
    if (parentComment) {
      // Добавляем ответ к родительскому комментарию
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      
      parentComment.replies.push(reply);
      
      // Сохраняем обновленные комментарии
      localStorage.setItem('lessonComments', JSON.stringify(allComments));
      
      // Создаем или получаем контейнер для ответов
      let repliesContainer = commentElement.querySelector('.comment-replies');
      
      if (!repliesContainer) {
        repliesContainer = document.createElement('ul');
        repliesContainer.className = 'comment-replies';
        commentElement.appendChild(repliesContainer);
      }
      
      // Добавляем ответ в DOM
      appendCommentToDOM(reply, repliesContainer);
    }
  } catch (error) {
    console.error('Ошибка при добавлении ответа:', error);
    alert('Не удалось добавить ответ. Пожалуйста, попробуйте еще раз.');
  }
}

/**
 * Поиск комментария по ID (рекурсивно)
 */
function findCommentById(comments, commentId) {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }
    
    if (comment.replies && comment.replies.length > 0) {
      const foundInReplies = findCommentById(comment.replies, commentId);
      if (foundInReplies) {
        return foundInReplies;
      }
    }
  }
  
  return null;
}

/**
 * Генерация уникального ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Получение инициалов из имени пользователя
 */
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.split(' ');
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

/**
 * Экранирование HTML
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}