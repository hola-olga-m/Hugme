export default {
  // Common
  app: {
    name: 'HugMeNow',
    tagline: 'Ваша платформа эмоционального благополучия',
    loading: 'Загрузка...',
    error: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
    success: 'Успех!',
    goBack: 'Назад',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    confirm: 'Подтвердить',
    yes: 'Да',
    no: 'Нет',
    retry: 'Повторить',
    actions: 'Действия',
    more: 'Ещё',
    close: 'Закрыть',
    comingSoon: 'Скоро!'
  },

  // Auth
  auth: {
    login: 'Войти',
    register: 'Регистрация',
    logout: 'Выйти',
    email: 'Эл. почта',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    username: 'Имя пользователя',
    name: 'Полное имя',
    forgotPassword: 'Забыли пароль?',
    resetPassword: 'Сбросить пароль',
    noAccount: 'Нет аккаунта?',
    hasAccount: 'Уже есть аккаунт?',
    loginSuccess: 'Вход выполнен успешно!',
    registerSuccess: 'Регистрация успешна!',
    logoutSuccess: 'Выход выполнен успешно',
    anonymousLogin: 'Продолжить как гость',
    nickname: 'Ник',
    anonymousWelcome: 'Добро пожаловать, Гость!',
    createAccount: 'Создать аккаунт',
    passwordRequirements: 'Пароль должен содержать не менее 8 символов',
    orContinueWith: 'или продолжить с'
  },

  // Dashboard
  dashboard: {
    welcome: 'Привет, {{name}}!',
    yourMoods: 'История настроений',
    yourHugs: 'Ваши обнимашки',
    yourRequests: 'Ваши запросы на обнимашки',
    stats: 'Статистика и серии',
    quickActions: 'Быстрые действия',
    recentActivity: 'Недавняя активность',
    community: 'Сообщество',
    settings: 'Настройки',
    newHug: 'Отправить обнимашку',
    trackMood: 'Отметить настроение',
    viewAll: 'Посмотреть все',
    todaysMood: 'Настроение сегодня',
    moodStreak: 'Серия отметок настроения: {{count}} дней'
  },

  // Mood
  mood: {
    track: 'Отметьте своё настроение',
    how: 'Как вы себя чувствуете?',
    note: 'Добавить заметку (необязательно)',
    share: 'Поделиться с сообществом',
    private: 'Оставить приватным',
    history: 'История настроений',
    noMoods: 'Нет отмеченных настроений',
    startTracking: 'Начните отмечать своё настроение',
    todayAlready: 'Вы уже отметили своё настроение сегодня',
    update: 'Обновить настроение',
    delete: 'Удалить настроение',
    excellent: 'Отлично',
    good: 'Хорошо',
    neutral: 'Нейтрально',
    meh: 'Так себе',
    bad: 'Плохо',
    terrible: 'Ужасно',
    trackSuccess: 'Настроение успешно отмечено!',
    successStreak: 'Ваша серия: {{count}} дней!'
  },

  // Hugs
  hugs: {
    send: 'Отправить обнимашку',
    received: 'Полученные обнимашки',
    sent: 'Отправленные обнимашки',
    new: 'Новая обнимашка',
    to: 'Кому',
    from: 'От',
    type: 'Тип обнимашки',
    message: 'Сообщение (необязательно)',
    noReceived: 'Вы еще не получили обнимашек',
    noSent: 'Вы еще не отправили обнимашек',
    markRead: 'Отметить как прочитанное',
    request: 'Запросить обнимашку',
    response: 'Ответить на запрос',
    accept: 'Принять',
    decline: 'Отклонить',
    cancel: 'Отменить запрос',
    community: 'Запросы сообщества',
    allRequests: 'Все запросы',
    pendingRequests: 'Ожидающие запросы',
    myRequests: 'Мои запросы',
    noRequests: 'Нет запросов на обнимашки',
    createRequest: 'Создать новый запрос',
    requestSuccess: 'Запрос на обнимашку создан!',
    respondSuccess: 'Ответ отправлен!',
    hugSentSuccess: 'Обнимашка успешно отправлена!',
    hugTypes: {
      quick: 'Быстрая обнимашка',
      warm: 'Тёплая обнимашка',
      supportive: 'Поддерживающая обнимашка',
      comforting: 'Утешающая обнимашка',
      encouraging: 'Вдохновляющая обнимашка',
      celebratory: 'Праздничная обнимашка'
    }
  },

  // Profile
  profile: {
    myProfile: 'Мой профиль',
    editProfile: 'Редактировать профиль',
    changeAvatar: 'Изменить аватар',
    changePassword: 'Изменить пароль',
    preferences: 'Предпочтения',
    notification: 'Настройки уведомлений',
    language: 'Язык',
    theme: 'Тема',
    privacy: 'Настройки приватности',
    delete: 'Удалить аккаунт',
    deleteConfirm: 'Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.',
    saveSuccess: 'Профиль успешно обновлен!'
  },

  // Validation
  validation: {
    required: 'Это поле обязательно',
    email: 'Пожалуйста, введите действительный адрес эл. почты',
    minLength: 'Должно быть не менее {{count}} символов',
    maxLength: 'Должно быть не более {{count}} символов',
    passwordMatch: 'Пароли должны совпадать',
    usernameFormat: 'Имя пользователя может содержать только буквы, цифры и подчеркивания',
    selectOption: 'Пожалуйста, выберите опцию'
  },

  // Errors
  errors: {
    general: 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.',
    login: 'Неверный email или пароль',
    register: 'Регистрация не удалась. Возможно, email или имя пользователя уже используются.',
    network: 'Ошибка сети. Пожалуйста, проверьте подключение.',
    unauthorized: 'Вы должны войти в систему, чтобы получить доступ к этой странице',
    notFound: 'Страница не найдена',
    server: 'Ошибка сервера. Пожалуйста, попробуйте позже.'
  }
};