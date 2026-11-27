/**
 * Переводы интерфейса: Русский.
 *
 * Файл на язык: i18next подгружает только активный, и правка перевода
 * конфликтует лишь с правкой того же языка.
 */
const ru = {
  access: {
    sections: {
      references: "Справочники",
      roles: "Роли",
      uploads: "Файлы",
      scanSessions: "Сканирование",
      lifecycle: "История записей",
      jobs: "Фоновые задачи",
      companyImport: "Импорт компании"
    }
  },
  errorBoundary: {
    title: "Что-то пошло не так",
    description: "Страницу не удалось отрисовать. Попробуйте снова — если повторяется, перезагрузите страницу.",
    retry: "Попробовать снова",
    reload: "Перезагрузить страницу"
  },
  orders: {
    orderNumber: "Номер заказа"
  },
  statusChange: {
    refresh: "Обновить список",
    open: "Открыть",
    offline: "Уведомления отключены",
    offlineHint: "Связь с сервером уведомлений потеряна: переходы статусов на экране могут отставать. Соединение восстанавливается автоматически."
  },
  common: {
    yes: "Да",
    no: "Нет",
    error: "Произошла ошибка. Попробуйте позже.",
    requiredDataUnavailable: "Не удалось загрузить обязательные данные страницы.",
    missingPermissions: "Недостающие разрешения",
    dataNotFound: "Данные не найдены",
    total: "Всего",
    loading: "Загрузка",
    create: "Создать",
    details: "Детали",
    backToList: "Назад к списку",
    backToRoute: "Назад к рейсу",
    backToTask: "Назад к задаче",
    crew: "Экипаж",
    expandAll: "Развернуть все",
    collapseAll: "Свернуть все",
    expand: "Развернуть",
    language: "Язык интерфейса",
    collapse: "Свернуть",
    change: "Изменить",
    creator: "Создатель",
    history: "История",
    createdBy: "Создал",
    updatedBy: "Обновил",
    user: "Пользователь",
    userId: "ID",
    email: "Email",
    phone: "Телефон",
    status: "Статус",
    moreDetails: "Подробнее",
    copied: "Скопировано",
    cancel: "Отмена"
  },
  welcome: {
    title: "Добро пожаловать в AMIS",
    description: "Элементы системы появятся как только вы получите приглашение от Вашего руководителя."
  },
  statuses: {
    active: "Активен",
    inactive: "Неактивен",
    prospective: "Потенциальный",
    draft: "Черновик",
    assigned_to_warehouse: "Назначен на склад",
    ready_for_loading: "Готов к погрузке",
    planned: "Запланировано",
    loading: "Загрузка",
    loaded: "Загружено",
    handover_in_progress: "Выдача начата",
    in_transit: "В пути",
    partially_delivered: "Частично доставлено",
    delivered: "Доставлено",
    issue_failed: "Ошибка выдачи",
    returning: "Возврат",
    returned: "Возвращено",
    cancelled: "Отменено",
    closed: "Закрыто",
    invoiced: "Выставлен инвойс",
    failed: "Ошибка"
  },
  export: {
    short: "Короткий",
    long: "Полный",
    longWithGroupSnapshot: "Полный со слепком групп"
  },
  groups: {
    groups: "группы",
    group: "группа"
  },
  logsActions: {
    user: {
      userRegistration: "Регистрация нового пользователя",
      passwordChange: "Пользователь изменил пароль",
      unassignCompanyFromUser: "Компания удалена у пользователя",
      assignCompanyToUser: "Компания назначена пользователю",
      userUpdate: "Обновление пользователя",
      userDelete: "Удаление пользователя"
    },
    object: {
      productCreate: "Пользователь создал продукт",
      productUpdate: "Пользователь обновил продукт",
      productDelete: "Пользователь удалил продукт"
    },
    organization: {
      organizationCreate: "Пользователь создал организацию",
      organizationUpdate: "Пользователь обновил организацию",
      organizationDelete: "Пользователь удалил организацию"
    },
    order: {
      orderCreate: "Создание заказа",
      orderStatusChanged: "Изменение статуса заказа",
      orderBatchStatusChanged: "Изменение статуса партии заказа",
      orderCodesRegistered: "Код зарегестрирован",
      orderCodesUtilized: "Код нанесён",
      orderReportCreated: "Отчет создан",
      orderClosed: "Заказ закрыт",
      orderRejected: "Заказ отклонен"
    },
    types: {
      login: "Пользователь вошёл в систему",
      logout: "Пользователь вышел из системы",
      userRegistration: "Регистрация нового пользователя",
      passwordChange: "Пользователь изменил пароль",
      productCreate: "Пользователь создал продукт",
      productUpdate: "Пользователь обновил продукт",
      productDelete: "Пользователь удалил продукт",
      organizationCreate: "Пользователь создал организацию",
      organizationUpdate: "Пользователь обновил организацию",
      organizationDelete: "Пользователь удалил организацию",
      unassignCompanyFromUser: "Компания удалена у пользователя",
      assignCompanyToUser: "Компания назначена пользователю",
      userUpdate: "Обновление пользователя",
      userDelete: "Удаление пользователя",
      orderCreate: "Создание заказа",
      orderStatusChanged: "Изменение статуса заказа",
      orderBatchStatusChanged: "Изменение статуса партии заказа",
      orderCodesRegistered: "Код зарегестрирован",
      orderCodesUtilized: "Код нанесён",
      orderReportCreated: "Отчет создан",
      orderClosed: "Заказ закрыт",
      orderRejected: "Заказ отклонен",
      systemEmployeeCreate: "Сотрудник системы создан",
      systemEmployeeUpdate: "Сотрудник системы обновлён",
      systemEmployeeDelete: "Сотрудник системы удалён",
      companyMembershipCreate: "Участник компании добавлен",
      companyMembershipUpdate: "Участник компании обновлён",
      companyMembershipDelete: "Участник компании удалён",
      emailVerified: "Email подтверждён",
      passwordReset: "Пароль сброшен",
      passwordSet: "Пароль установлен",
      userCreatedByAdmin: "Пользователь создан администратором"
    }
  },
  categories: {
    all: "Все",
    user: "Пользователи",
    product: "Продукты",
    auth: "Аутентификация",
    organization: "Организации",
    order: "Заказы"
  },
  search: {
    byName: "Поиск по имени",
    byOrganization: "Поиск по организациям",
    selectProduct: "Выберите продукцию",
    packageType: "Тип упаковки",
    selectStatus: "Выберите статус",
    selectOrderPaymentType: "Выберите тип оплаты заказа",
    selectState: "Выберите состояние",
    chooseDate: "Выберите дату"
  },
  btn: {
    create: "Создать",
    edit: "Редактировать",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    search: "Найти",
    skip: "Пропустить",
    finish: "Завершить",
    back: "Назад",
    toProducts: "Перейти к продуктам",
    enterCompany: "Войти в компанию",
    sendToTuron: "Отправить в турон",
    apply: "Нанести",
    applyAll: "Нанести все",
    send: "Отправить",
    copy: "Копировать",
    add: "Добавить"
  },
  navigation: {
    products: "Продукция",
    management: "Управление",
    organization: "Организация",
    organizations: "Организации",
    myOrganizations: "Мои организации",
    exitCompany: "Выйти из компании",
    users: "Пользователи",
    systemEmployees: "Сотрудники",
    leads: "Заявки",
    audit: "Логи системы",
    markingCodes: "Заказы КМ",
    ownedCodes: "Коды маркировки",
    agregations: "Агрегации",
    implementation: "Реализация",
    deals: "Сделки",
    routes: "Рейсы",
    salesOrders: "Сделки",
    deliveryRoutes: "Рейсы",
    vehicles: "Транспорт",
    deliveryTasks: "Задачи доставки",
    invoices: "Инвойсы",
    waybills: "ТТН",
    companyMemberships: "Сотрудники",
    integrations: "Интеграции",
    mobileTabs: "Разделы",
    groups: {
      marking: "Маркировка",
      shipping: "Отгрузки",
      company: "Компания"
    },
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню"
  },
  statusCatalog: {
    lead: {
      internal: {
        new: "Новая",
        in_progress: "В работе",
        completed: "Завершена",
        rejected: "Отклонена"
      }
    },
    waybill: {
      internal: {
        draft: "Черновик",
        ready: "Готова к отправке",
        sending: "Отправляется",
        sent: "Отправлена",
        registered: "Зарегистрирована",
        rejected: "Отклонена",
        send_failed: "Ошибка отправки",
        cancelled: "Аннулирована"
      },
      external: {
        Sent: "Отправлена",
        AwaitCounterparty: "Ожидает контрагента",
        AwaitAction: "Требуется действие",
        AwaitAgreement: "На согласовании",
        AwaitSign: "На подписании",
        AwaitThirdSide: "Ожидает третью сторону",
        AwaitResponsiblePerson: "Ожидает ответственное лицо",
        AwaitResponsiblePersonAccepted: "Ожидает приёмки ответственным лицом",
        Registered: "Зарегистрирована",
        Rejected: "Отклонена",
        Cancelled: "Аннулирована",
        Returned: "Возвращена",
        Deleted: "Удалена",
        Unknown: "Статус не определён"
      }
    },
    markingCodeOrder: {
      internal: {
        new: "Создан",
        vendor_pending: "Ожидает систему маркировки",
        ready_for_codes: "Коды готовы к выгрузке",
        codes_partially_received: "Коды получены частично",
        codes_received: "Коды получены",
        codes_utilization_requested: "Запрошено нанесение кодов",
        codes_partially_utilized: "Коды нанесены частично",
        codes_utilized: "Коды нанесены",
        codes_partially_aggregated: "Коды агрегированы частично",
        codes_aggregated: "Коды агрегированы",
        rejected: "Отклонён",
        closed: "Закрыт",
        error: "Ошибка"
      },
      external: {
        CREATED: "Создан",
        PENDING: "В обработке",
        READY: "Готов",
        REJECTED: "Отклонён",
        CLOSED: "Закрыт",
        OUTSOURCED: "Передан на аутсорс"
      }
    },
    markingCodeOrderBatch: {
      internal: {
        new: "Создана",
        created: "Оформлена",
        vendor_pending: "Ожидает систему маркировки",
        ready_for_codes: "Коды готовы к выгрузке",
        codes_partially_received: "Коды получены частично",
        codes_received: "Коды получены",
        codes_utilization_requested: "Запрошено нанесение кодов",
        codes_utilized: "Коды нанесены",
        codes_aggregated: "Коды агрегированы",
        rejected: "Отклонена",
        closed: "Закрыта",
        error: "Ошибка"
      },
      external: {
        PENDING: "В обработке",
        ACTIVE: "Активна",
        EXHAUSTED: "Коды исчерпаны",
        REJECTED: "Отклонена",
        CLOSED: "Закрыта"
      }
    },
    utilizationReport: {
      internal: {
        new: "Создан",
        vendor_pending: "Ожидает систему маркировки",
        partially_processed: "Обработан частично",
        success: "Обработан",
        error: "Ошибка"
      },
      external: {
        CREATED: "Создан",
        VALIDATING: "Проверяется",
        IN_PROCESS: "Обрабатывается",
        PARTIALLY_PROCESSED: "Обработан частично",
        SUCCESS: "Обработан",
        ERROR: "Отклонён"
      }
    },
    aggregationReport: {
      internal: {
        new: "Создан",
        requested: "Запрошен",
        vendor_pending: "Ожидает систему маркировки",
        partially_processed: "Обработан частично",
        success: "Обработан",
        error: "Ошибка"
      },
      external: {
        CREATED: "Создан",
        VALIDATING: "Проверяется",
        IN_PROCESS: "Обрабатывается",
        PARTIALLY_PROCESSED: "Обработан частично",
        SUCCESS: "Обработан",
        ERROR: "Отклонён"
      }
    },
    aggregatedCustomsCodeOrder: {
      internal: {
        new: "Новый",
        generated: "Сгенерирован",
        ready_for_sign: "Готов к подписи",
        signed_for_registration: "Подписан",
        verified_for_registration: "Проверен",
        registration_requested: "Отправлен на регистрацию",
        registered: "Зарегистрирован",
        registration_failed: "Отказ регистрации",
        dissolution_initialized: "Расформирование начато",
        signed_for_dissolution: "Расформирование подписано",
        verified_for_dissolution: "Расформирование проверено",
        dissolution_requested: "Отправлен на расформирование",
        dissolved: "Расформирован",
        dissolution_failed: "Отказ расформирования"
      }
    }
  },
  lifecycle: {
    title: "История",
    subtitle: "Таймлайн статусов и ошибки интеграций",
    tabs: {
      overview: "Основное",
      lifecycle: "История"
    },
    feedTabs: {
      all: "Все",
      internal: "Внутренние"
    },
    vendors: {
      x_trace: "X-Trace",
      faktura_uz: "Faktura.uz",
      tasnif: "Tasnif"
    },
    scopes: {
      internal: "Внутреннее",
      external: "Внешняя система"
    },
    externalHint: "Статус пришёл от {{vendor}}",
    filters: {
      all: "Все",
      status: "Статусы",
      error: "Ошибки"
    },
    groups: {
      today: "Сегодня",
      yesterday: "Вчера"
    },
    actor: {
      user: "Пользователь",
      system: "Система",
      vendor: "Вендор"
    },
    origin: {
      ui: "Интерфейс",
      api: "API",
      scheduler: "Планировщик",
      webhook: "Вебхук",
      import: "Импорт",
      migration: "Миграция"
    },
    errorClass: {
      transient: "Временный сбой",
      permanent: "Требуется действие",
      conflict: "Конфликт состояния",
      unknown: "Неизвестная ошибка"
    },
    errorHint: {
      transient: "Внешний сервис недоступен, попытки продолжаются.",
      permanent: "Проверьте данные или настройки интеграции.",
      conflict: "Обновите карточку: состояние уже изменилось.",
      unknown: ""
    },
    activeError: {
      attempts: "Попыток: {{count}}",
      since: "С {{date}}",
      open: "Открыть историю"
    },
    fields: {
      code: "Код",
      reason: "Причина",
      comment: "Комментарий",
      occurrences: "Повторов",
      lastOccurredAt: "Последний раз",
      requestId: "Request ID",
      causedBy: "Связано с событием",
      technical: "Технические детали"
    },
    firstStatus: "Начальный статус",
    total: "Всего событий",
    shown: "Показано: {{count}}",
    loadMore: "Показать ещё",
    empty: "Событий пока нет",
    errors: {
      loadEvents: "Не удалось загрузить таймлайн",
      loadSummary: "Не удалось загрузить сводку истории"
    }
  },
  ownedCodes: {
    title: "Коды во владении",
    subtitle: "Кодов во владении компании",
    filters: {
      gtin: "Поиск по GTIN-14"
    },
    tabs: {
      summary: "Сводка",
      codes: "Коды"
    },
    summary: {
      product: "Товар",
      packages: "Упаковка",
      total: "Кодов",
      freshestAt: "Последнее подтверждение",
      oldestAt: "Самое старое подтверждение",
      neverSynced: "Владение у вендора ещё не подтверждалось",
      unknownGtins: "GTIN вне каталога"
    },
    tableTitles: {
      code: "Код",
      gtin: "GTIN",
      packageType: "Упаковка",
      status: "Статус у вендора",
      parentCode: "Родительский код",
      lastSyncedAt: "Владение на момент"
    },
    statuses: {
      RECEIVED: "Получен",
      APPLIED: "Нанесён",
      INTRODUCED: "В обороте",
      WITHDRAWN: "Выведен из оборота",
      WRITTEN_OFF: "Списан"
    }
  },
  companyImport: {
    title: "Импорт из ASL Belgisi",
    subtitle: "Загрузка товаров, заказов, кодов и документов из ASL Belgisi",
    start: "Запустить импорт",
    running: "Импорт идёт",
    stageRunning: "Синхронизация идёт",
    busyHint: "Импорт компании уже идёт — дождитесь завершения",
    empty: "Импорт ещё не запускали",
    currentStage: "Этап: {{stage}}",
    startedAt: "Запущен",
    finishedAt: "Завершён",
    totals: "Выполнено {{done}} из {{queued}}",
    done: "Выполнено {{done}}",
    failed: "Отказов: {{count}}",
    tabs: {
      import: "Импорт"
    },
    statuses: {
      pending: "Ожидает",
      running: "Идёт",
      completed: "Завершён",
      failed: "Отказ"
    },
    stageStatuses: {
      pending: "Ожидает",
      running: "Идёт",
      completed: "Готово",
      failed: "Отказ",
      skipped: "Пропущен"
    },
    stages: {
      products: "Товары",
      orders: "Заказы кодов",
      "order-batches": "Партии заказов",
      "batch-codes": "Коды партий",
      "owned-codes": "Перечень КМ",
      documents: "Документы"
    },
    stageHints: {
      products: "Каталог товаров компании и его классификация",
      orders: "Заказы кодов маркировки вместе с партиями и кодами",
      "owned-codes": "Коды, которыми владеет компания, включая полученные от контрагентов",
      documents: "Журнал документов ASL Belgisi"
    },
    startStage: {
      products: "Синхронизировать товары",
      orders: "Синхронизировать заказы",
      "owned-codes": "Синхронизировать коды",
      documents: "Синхронизировать документы"
    },
    startModal: {
      title: "Запуск импорта",
      hint: "Отметьте, что загрузить. Заказы загружаются вместе с партиями и кодами.",
      submit: "Запустить"
    },
    toast: {
      started: "Импорт запущен",
      startError: "Импорт не запустился"
    },
    errors: {
      load: "Не удалось получить состояние импорта",
      start: "Не удалось запустить импорт",
      alreadyRunning: "Импорт компании уже идёт"
    }
  },
  leads: {
    title: "Заявки",
    detailsTitle: "Заявка",
    subtitle: "Заявки с сайта AMIS",
    fields: {
      name: "Имя",
      phone: "Телефон",
      company: "Компания",
      tariff: "Тариф",
      message: "Сообщение",
      status: "Статус",
      actions: "Действия",
      comment: "Комментарий",
      createdAt: "Создано",
      updatedAt: "Обновлено",
      statusChangedBy: "Исполнитель",
      statusChangedAt: "Статус изменен"
    },
    sections: {
      status: "Статус",
      processing: "Обработка"
    },
    statuses: {
      new: "Новая",
      in_progress: "В работе",
      completed: "Завершена",
      rejected: "Отклонена"
    },
    modal: {
      detailsAction: "Просмотр",
      lead: "Заявка",
      changeStatus: "Изменить статус",
      commentPlaceholder: "Добавьте комментарий к изменению статуса"
    },
    actions: {
      saveStatus: "Сохранить статус",
      startProgress: "Принять в работу",
      complete: "Завершить",
      reject: "Отклонить"
    },
    messages: {
      statusUpdated: "Статус заявки обновлен",
      statusUpdateError: "Не удалось обновить статус заявки"
    }
  },
  scanner: {
    accepted: "Принято",
    rejected: "Отклонено",
    scan: "Сканировать",
    latestScans: "Последние сканы",
    empty: "Сканов пока нет",
    placeholder: "Скан-код",
    codeLabel: "Код",
    reasonLabel: "Причина",
    startScanning: "Начать сканирование",
    creatingSession: "Запуск сессии...",
    completingSession: "Завершение сессии...",
    startCamera: "Открыть камеру",
    stopCamera: "Остановить камеру",
    cameraIdle: "Нажмите «Начать сканирование», чтобы открыть камеру",
    cameraUnsupported: "На этом устройстве сканирование через камеру не поддерживается",
    cameraError: "Не удалось получить доступ к камере",
    scanFailed: "Ошибка сканирования",
    status: {
      idle: "Камера не запущена",
      starting: "Запускаем камеру",
      cameraActive: "Камера запущена",
      detected: "Код найден: {{code}}",
      processing: "Идет обработка",
      error: "Ошибка сканера"
    },
    stopScanning: "Завершить сканирование"
  },
  salesOrders: {
    title: "Сделки",
    detailsTitle: "Сделка",
    create: "Создать сделку",
    listEmpty: "Список сделок появится здесь",
    sections: {
      company: "Компания",
      customer: "Клиент",
      contract: "Договор",
      fulfillment: "Исполнение",
      paymentMethod: "Способ оплаты",
      items: "Товары",
      item: "Позиция",
      comment: "Комментарий",
      header: "Шапка",
      totals: "Итоги",
      related: "Связанные сущности"
    },
    createSections: {
      sender: "Отправитель",
      recipient: "Получатель"
    },
    createFields: {
      companyTin: "ИНН",
      companyName: "Название компании",
      companyAddress: "Адрес компании",
      region: "Регион",
      district: "Район",
      address: "Адрес",
      expectedDate: "Ожидаемая дата"
    },
    createPlaceholders: {
      companyTin: "ИНН",
      companyName: "Название компании",
      companyAddress: "Адрес компании",
      region: "Выберите регион",
      district: "Выберите район",
      address: "Адрес",
      location: "Отметьте точку на карте",
      expectedDate: "Ожидаемая дата"
    },
    createValidation: {
      companyNameRequired: "Название компании обязательно",
      companyAddressRequired: "Адрес компании обязателен",
      regionRequired: "Выберите регион",
      districtRequired: "Выберите район",
      addressRequired: "Введите адрес",
      locationRequired: "Отметьте точку на карте",
      contractDetailsIncomplete: "Заполните адрес отправителя и клиента (регион, район, адрес и точку на карте), договор и доставку",
      expectedDateRequired: "Ожидаемая дата обязательна"
    },
    fields: {
      company: "Компания",
      orderNumber: "Номер сделки",
      customerTin: "ИНН клиента",
      customerName: "Имя клиента",
      customerAddress: "Адрес клиента",
      customerRegion: "Регион клиента",
      customerDistrict: "Район клиента",
      customerLocation: "Координаты клиента",
      senderAddress: "Адрес отправителя",
      senderRegion: "Регион отправителя",
      senderDistrict: "Район отправителя",
      senderLocation: "Координаты отправителя",
      location: "Координаты",
      contractNumber: "Номер договора",
      contractDate: "Дата договора",
      dueDate: "Срок",
      priority: "Приоритет",
      paymentMethod: "Способ оплаты",
      product: "Товар",
      packageCode: "Единица измерения",
      packageCodeShort: "Ед.измерения",
      quantity: "Количество",
      unitPrice: "Цена за единицу",
      price: "Цена за ед.",
      comment: "Комментарий",
      status: "Статус",
      createdAt: "Создано",
      updatedAt: "Обновлено",
      createdBy: "Создал",
      updatedBy: "Обновил",
      orderedQuantity: "Заказано",
      orderedQuantityShort: "Заказано",
      assignedQuantity: "Назначено",
      assignedQuantityShort: "Назначено",
      deliveredQuantity: "Доставлено",
      deliveredQuantityShort: "Доставлено",
      amount: "Сумма",
      amountShort: "Сумма",
      totalAmount: "Итого"
    },
    table: {
      orderNumber: "Номер",
      customerName: "Клиент",
      customerTin: "ИНН клиента",
      dueDate: "Срок",
      priority: "Приоритет",
      orderedQuantity: "Заказано",
      assignedQuantity: "Назначено",
      deliveredQuantity: "Доставлено",
      status: "Статус",
      createdAt: "Создано"
    },
    placeholders: {
      selectCompany: "Выберите компанию",
      customerTin: "ИНН",
      customerName: "Имя клиента",
      contractNumber: "Номер договора",
      contractDate: "Дата договора",
      customerAddress: "Адрес клиента",
      dueDate: "Срок",
      quantity: "Количество",
      unitPrice: "Цена за единицу",
      itemComment: "Комментарий к позиции",
      comment: "Комментарий (опционально)"
    },
    validation: {
      companyRequired: "Компания обязательна",
      customerTinRequired: "ИНН обязателен",
      customerTinDigitsOnly: "ИНН должен содержать только цифры",
      customerTinLength: "ИНН должен состоять из 9 цифр",
      customerTinInvalid: "Введите корректный ИНН",
      customerCompanyNotFound: "Компания с таким ИНН не найдена",
      customerNameRequired: "Имя обязательно",
      dueDateRequired: "Срок обязателен",
      priorityRequired: "Приоритет обязателен",
      paymentMethodRequired: "Выберите метод оплаты",
      contractNumberRequired: "Номер договора обязателен",
      contractDateRequired: "Дата договора обязательна",
      itemProductRequired: "Товар обязателен",
      itemPackageRequired: "Выберите единицу измерения",
      itemQuantityRequired: "Количество обязательно",
      itemUnitPriceRequired: "Цена за единицу обязательна",
      costPerKilometerRequired: "Цена за 1 км обязательна"
    },
    messages: {
      success: {
        create: "Сделка успешно создана",
        delete: "Сделка успешно удалена"
      }
    },
    deleteQuestion: "Вы уверены, что хотите удалить сделку",
    priority: {
      low: "Низкий",
      normal: "Обычный",
      high: "Высокий",
      urgent: "Срочный"
    },
    paymentMethods: {
      cash: "Наличные",
      transfer: "Перечисление"
    },
    statuses: {
      draft: "Черновик",
      confirmed: "Подтвержден",
      partially_assigned: "Частично назначен",
      assigned: "Назначен",
      partially_delivered: "Частично доставлен",
      delivered: "Доставлен",
      cancelled: "Отменен",
      closed: "Закрыт"
    },
    actions: {
      addItem: "Добавить позицию",
      create: "Создать сделку"
    },
    details: {
      headerEmpty: "Поля заголовка заказа",
      totalsEmpty: "Заказано / назначено / доставлено / сумма",
      itemsEmpty: "Таблица товаров",
      relatedEmpty: "Связанный рейс, задача, инвойс"
    }
  },
  vehicles: {
    title: "Транспорт",
    deleteQuestion: "Вы уверены, что хотите удалить транспорт?",
    fields: {
      name: "Название транспорта",
      plateNumber: "Номер машины",
      comment: "Комментарий",
      type: "Тип",
      brand: "Марка",
      model: "Модель",
      year: "Год",
      loadCapacityKg: "Грузоподъёмность, кг",
      volumeCapacityM3: "Объём, м3",
      vin: "VIN",
      registrationCertificateNumber: "Номер техпаспорта",
      stateRegistrationModel: "Модель (государственный реестр)",
      status: "Статус",
      createdAt: "Создано",
      updatedAt: "Обновлено",
      ownershipType: "Владелец транспорта",
      ownerTinOrPinfl: "ИНН/ПИНФЛ владельца",
      ownerName: "Название организации"
    },
    placeholders: {
      name: "Введите название транспорта",
      plateNumber: "00 A 000 AA",
      comment: "Добавьте комментарий",
      brand: "Введите марку",
      model: "Введите модель",
      vin: "Введите VIN",
      registrationCertificateNumber: "AA 1234567",
      stateRegistrationModel: "Заполняется автоматически из реестра",
      selectVehicle: "Выберите транспорт",
      ownerTinOrPinfl: "Введите ИНН (9 цифр) или ПИНФЛ (14 цифр)",
      ownerName: "Заполнится автоматически"
    },
    ownership: {
      checking: "Проверяем номер машины в государственном реестре…",
      notRegistered: "В государственном реестре нет записи по этому номеру машины",
      found: "Владелец подтверждён в государственном реестре"
    },
    ownershipTypes: {
      owned: "Транспорт организации",
      external: "Внешний владелец"
    },
    ownerLookup: {
      checking: "Ищем организацию…",
      notFound: "Организация по этому ИНН/ПИНФЛ не найдена"
    },
    types: {
      sedan: "Седан",
      van: "Фургон",
      truck: "Грузовик",
      semi_truck: "Тягач",
      pickup: "Пикап",
      other: "Другое"
    },
    statuses: {
      active: "Активен",
      maintenance: "На обслуживании",
      out_of_service: "Не используется",
      archived: "В архиве"
    },
    details: {
      main: "Основная информация",
      characteristics: "Характеристики",
      identification: "Идентификация",
      system: "Системная информация"
    },
    actions: {
      create: "Добавить транспорт"
    },
    modal: {
      create: "Добавить транспорт",
      vehicle: "транспорт"
    },
    validation: {
      nameRequired: "Введите название транспорта",
      typeRequired: "Выберите тип транспорта",
      plateNumberRequired: "Введите номер машины",
      plateNumberLength: "Номер должен содержать 8 символов без пробелов",
      plateNumberInvalid: "Номер машины должен быть в формате: 00 A 000 AA или 00 000 AAA",
      registrationCertificateNumberInvalid: "Номер техпаспорта должен быть в формате: AA 1234567",
      brandRequired: "Введите марку",
      modelRequired: "Введите модель",
      ownerTinOrPinflRequired: "Введите ИНН или ПИНФЛ владельца",
      ownerTinOrPinflInvalid: "Введите корректный ИНН (9 цифр) или ПИНФЛ (14 цифр)",
      ownerRequired: "Найдите организацию по ИНН/ПИНФЛ перед сохранением"
    },
    messages: {
      success: {
        create: "Транспорт создан",
        update: "Транспорт обновлен",
        delete: "Транспорт удален"
      },
      error: {
        create: "Не удалось создать транспорт",
        update: "Не удалось обновить транспорт",
        delete: "Не удалось удалить транспорт",
        load: "Не удалось загрузить транспорт",
        verifyOwnership: "Не удалось проверить владельца транспорта"
      }
    }
  },
  deliveryRoutes: {
    returnTable: {
      remaining: "Остаток",
      returned: "Возвращено"
    },
    loadingWarnings: {
      title: "Есть недогруз по товарам",
      description: "По этим товарам погруженное количество меньше запланированного. Для завершения укажите причину.",
      commentRequired: "Укажите причину недостачи перед завершением погрузки",
      commentPlaceholder: "Укажите причину недостачи",
      forceComplete: "Завершить принудительно",
      scanErrors: "Ошибки сканирования",
      deleteScanSubtitle: "Рейс {{id}} / отсканируйте код для удаления из погрузки"
    },
    title: "Рейсы",
    detailsTitle: "Рейс",
    loadingTitle: "Погрузка",
    loadingPageTitle: "Погрузка рейса",
    loadingSubtitle: "Рейс",
    returnTitle: "Возврат",
    returnSubtitle: "Рейс",
    listEmpty: "Список рейсов появится здесь",
    status: {
      draft: "Черновик",
      assigned_to_warehouse: "Назначен на склад",
      ready_for_loading: "Готов к погрузке",
      loading: "Погрузка",
      loaded: "Загружено",
      in_transit: "В пути",
      partially_delivered: "Частично доставлено",
      delivered: "Доставлено",
      returning: "Возврат",
      returned: "Возвращено",
      closed: "Закрыто",
      cancelled: "Отменено",
      failed: "Ошибка"
    },
    sections: {
      info: "Информация о рейсе",
      availableOrders: "Доступные сделки",
      preview: "Предпросмотр выбранных сделок",
      summary: "Сводка",
      vehicle: "Транспортное средство",
      crew: "Экипаж",
      totals: "Итоги",
      timestamps: "Временные метки",
      actions: "Действия",
      tasks: "Задачи",
      loading: "Погрузка",
      return: "Возврат",
      loadingProducts: "Товары для погрузки"
    },
    vehicleCard: {
      notFound: "Подходящий транспорт не найден"
    },
    fields: {
      company: "Компания",
      routeNumber: "Номер рейса",
      status: "Статус",
      routeDate: "Дата рейса",
      vehicleName: "Название транспорта",
      vehicle: "Транспорт",
      plateNumber: "Номер машины",
      driverName: "Имя водителя",
      driver: "Водитель",
      agentName: "Имя агента",
      agent: "Агент",
      comment: "Комментарий",
      taskCount: "Задач",
      plannedQuantity: "Кол-во товара",
      loadedQuantity: "Погружено",
      deliveredQuantity: "Доставлено",
      returnedQuantity: "Возвращено",
      registeredAt: "Зарегистрирован",
      loadingStartedAt: "Погрузка начата",
      loadingCompletedAt: "Погрузка завершена",
      departedAt: "Отправлено",
      returnStartedAt: "Возврат начат",
      returnCompletedAt: "Возврат завершён",
      closedAt: "Закрыто",
      remainingToAssign: "Остаток к распределению"
    },
    placeholders: {
      selectCompany: "Выберите компанию",
      routeDate: "Дата рейса",
      vehicle: "Транспорт",
      plateNumber: "Номер машины",
      driver: "Водитель",
      agent: "Агент"
    },
    validation: {
      companyRequired: "Компания обязательна",
      routeDateRequired: "Дата рейса обязательна",
      salesOrdersRequired: "Выберите хотя бы одну сделку",
      plateNumberInvalid: "Номер машины должен быть в формате: 00 A 000 AA или 00 000 AAA"
    },
    messages: {
      success: {
        create: "Рейс успешно создан",
        close: "Рейс успешно завершён",
        scanCode: "Код {{code}} успешно принят",
        startTransit: "Машина отправлена",
        cancelScan: "Скан {{code}} удалён"
      },
      error: {
        create: "Ошибка при создании рейса",
        close: "Не удалось завершить рейс",
        createScanSession: "Не удалось начать сессию сканирования",
        completeScanSession: "Не удалось завершить сессию сканирования",
        scanSessionRequired: "Сначала начните сессию сканирования",
        scanCode: "Не удалось обработать скан",
        scanCodeDetailed: "Код {{code}} отклонён: {{reason}}",
        startLoading: "Не удалось начать погрузку",
        startTransit: "Не удалось отправить машину",
        startReturn: "Не удалось начать возврат",
        cancelScan: "Не удалось удалить скан",
        completeReturn: "Не удалось завершить возврат"
      }
    },
    preview: {
      ordersSelected: "Сделок выбрано",
      customersCount: "Клиентов",
      totalVolume: "Товаров выбрано",
      aggregatedProducts: "Агрегированные товары",
      routeDate: "Дата рейса",
      vehicleName: "Транспорт",
      plateNumber: "Номер машины",
      driver: "Водитель",
      agent: "Агент",
      company: "Компания",
      selectedOrders: "Выбранные сделки",
      customer: "Клиент",
      dueDate: "Срок",
      priority: "Приоритет",
      orderedQuantity: "Заказано",
      customersList: "Клиенты",
      dueDates: "Сроки",
      priorities: "Приоритеты",
      totalAmount: "Общая сумма",
      tin: "ИНН",
      address: "Адрес",
      contractNumber: "Номер контракта",
      contractDate: "Дата контракта",
      unitPrice: "Цена за ед.",
      amount: "Сумма",
      comment: "Комментарий"
    },
    actions: {
      create: "Создать рейс",
      openLoading: "Открыть экран погрузки",
      openReturn: "Открыть экран возврата",
      completeLoading: "Завершить погрузку",
      completeReturn: "Завершить возврат",
      close: "Завершить рейс",
      startTransit: "Начать перевозку",
      deleteScan: "Удалить",
      deleteByScanning: "Удалить сканированием"
    },
    details: {
      summaryEmpty: "Всего задач, клиентов, заказано/погружено/доставлено/возвращено",
      crewEmpty: "Экипаж не назначен",
      tasksEmpty: "Таблица задач доставки",
      loadingEmpty: "Агрегированные товары и сессия сканирования",
      returnEmpty: "Остатки и скан возврата"
    },
    taskTable: {
      taskNumber: "Номер задачи",
      customer: "Клиент",
      customerTin: "ИНН клиента",
      status: "Статус",
      plannedQuantity: "План",
      deliveredQuantity: "Доставлено",
      amount: "Сумма",
      invoice: "Инвойс",
      comment: "Комментарий"
    },
    loadingCounters: {
      planned: "Всего товара",
      loaded: "Погружено",
      products: "Товаров"
    },
    loadingTable: {
      planned: "Запланировано",
      loaded: "Погружено"
    },
    loadingScannerTitle: "Сканирование погрузки",
    loadingScannerSubtitle: "Рейс {{id}} / {{vehicle}}",
    loadingHelper: "Сканируйте коды для погрузки товаров в транспорт",
    returnScannerTitle: "Сканирование возврата",
    returnScannerSubtitle: "Рейс {{id}} / Остатки",
    returnHelper: "Сканируйте товары для возврата"
  },
  deliveryTasks: {
    table: {
      planned: "Запланировано",
      delivered: "Выдано",
      products: "Товаров"
    },
    scanner: {
      deleteSubtitle: "Отсканируйте код, который нужно удалить из выдачи"
    },
    warnings: {
      title: "Есть недовыдача по товарам",
      description: "По этим товарам выданное количество меньше запланированного. Для завершения укажите причину недостачи.",
      commentRequired: "Укажите причину недостачи перед завершением выдачи",
      commentPlaceholder: "Укажите причину недостачи",
      forceComplete: "Завершить принудительно",
      scanErrors: "Ошибки сканирования"
    },
    messages: {
      success: {
        cancelScan: "Скан {{code}} удалён",
        scanCode: "Код {{code}} отсканирован"
      },
      error: {
        startDelivery: "Не удалось начать выдачу",
        createScanSession: "Не удалось начать сессию сканирования",
        completeScanSession: "Не удалось завершить сессию сканирования",
        cancelScan: "Не удалось удалить скан",
        scanCode: "Ошибка сканирования",
        scanCodeDetailed: "Код {{code}} отклонён: {{reason}}",
        scanSessionRequired: "Сначала запустите сессию сканирования",
        completeDelivery: "Не удалось завершить выдачу"
      }
    },
    title: "Задачи доставки",
    subtitle: "Мои задачи",
    detailsTitle: "Задача доставки",
    scanTitle: "Выдача по задаче",
    scanSubtitle: "Клиент",
    listEmpty: "Список задач появится здесь",
    sections: {
      header: "Шапка",
      summary: "Сводка",
      items: "Плановые товары",
      session: "Сессия доставки",
      invoice: "Инвойс"
    },
    actions: {
      openScan: "Открыть экран сканирования",
      completeDelivery: "Завершить доставку",
      startDelivery: "Начать выдачу",
      deleteScan: "Удалить",
      deleteByScanning: "Удалить сканированием"
    },
    details: {
      headerEmpty: "Клиент, рейс, заказ, статус",
      itemsEmpty: "Запланировано / погружено / доставлено",
      sessionEmpty: "Прогресс сканирования и счетчики",
      invoiceEmpty: "Статус инвойса и ссылка"
    },
    scanScannerSubtitle: "Клиент / Задача {{id}}",
    scanHelper: "Сканируйте коды для передачи товаров"
  },
  invoices: {
    title: "Инвойсы",
    detailsTitle: "Инвойс",
    listEmpty: "Список инвойсов появится здесь",
    table: {
      invoiceNumber: "Номер",
      invoiceDate: "Дата",
      sender: "Отправитель",
      receiver: "Получатель",
      amountWithoutVat: "Сумма без НДС",
      itemsQuantity: "Позиций",
      unitsQuantity: "Единиц",
      externalStatus: "Внешний статус",
      status: "Статус",
      createdAt: "Создан"
    },
    itemsTable: {
      productName: "Товар",
      quantity: "Количество",
      measurementUnit: "Ед. изм.",
      unitPrice: "Цена",
      amountWithoutVat: "Сумма без НДС",
      taxes: "Налоги",
      vatRate: "НДС",
      exciseRate: "Акциз",
      psic: "ИКПУ",
      reliefId: "Льгота"
    },
    codes: {
      title: "Коды маркировки",
      toggle: "Показать коды маркировки",
      showShort: "Показать КМ",
      hideShort: "Скрыть КМ",
      empty: "Коды маркировки не найдены",
      code: "Код",
      status: "Статус",
      packageType: "Тип упаковки"
    },
    file: {
      download: "Скачать файл",
      loadError: "Не удалось загрузить файл инвойса",
      openError: "Не удалось открыть файл в новой вкладке"
    },
    statuses: {
      created: "Создан",
      in_review: "На проверке",
      approved: "Утвержден",
      sent: "Отправлен",
      pending: "В ожидании",
      completed: "Завершен",
      rejected: "Отклонен",
      canceled: "Отменен",
      returned: "Возвращен",
      unknown: "Неизвестен",
      registered: "Зарегистрирован",
      deleted: "Удален"
    },
    externalStatuses: {
      None: "Недоступен",
      AwaitContractor: "Ожидается ответ контрагента",
      AwaitAction: "Требуется подпись",
      Rejected: "Отклонен контрагентом",
      Archived: "Опубликован",
      AwaitAgreement: "На согласовании",
      AwaitSign: "На подписании",
      Deleted: "Удален",
      AwaitThirdSide: "Ожидается ответ доверенного лица",
      ArchiveCancelRequested: "Запрошен на аннулирование",
      AwaitCancelArchiveRequest: "На рассмотрении аннулирования",
      RejectArchiveCancelRequest: "Аннулирование отменено",
      ArchiveCanceled: "Аннулирован",
      AgreementAgreed: "Подтвердил согласие",
      AgreementReject: "Отказал в согласовании",
      SigningSigned: "Подписан",
      SigningReject: "Не подписан",
      AwaitDecline: "На отказании",
      VerifiedBySystem: "Заверен системой",
      AwaitResponsiblePerson: "Ожидается ответ отв. лица",
      ResponsiblePersonAccepted: "Принято отв. лицом",
      AwaitResponsiblePersonAccepted: "Ожидается принятие отв. лицом",
      ResponsiblePersonRejected: "Отклонен отв. лицом",
      ResponsiblePersonTillReturned: "Возвращен отв. лицом",
      ResponsiblePersonReturned: "Возвращен отв. лицом после передачи",
      ReturnAccepted: "Возвращено",
      AwaitReturnAccept: "Ожидается подтверждение возврата"
    },
    sections: {
      header: "Шапка",
      links: "Связи",
      items: "Товары",
      totals: "Итоги",
      contract: "Договор",
      file: "Файл"
    },
    fields: {
      invoiceNumber: "Номер инвойса",
      invoiceDate: "Дата инвойса",
      createdAt: "Создан",
      currency: "Валюта",
      internalStatus: "Статус",
      externalStatus: "Внешний статус",
      amountWithoutVat: "Сумма без НДС",
      itemsQuantity: "Позиций",
      unitsQuantity: "Единиц",
      contractNumber: "Номер договора",
      contractDate: "Дата договора",
      sender: "Отправитель",
      receiver: "Получатель",
      name: "Название",
      tin: "ИНН",
      companyId: "ID компании",
      address: "Адрес",
      salesOrderId: "Заказ",
      deliveryRouteId: "Рейс",
      deliveryTaskId: "Задача доставки",
      filename: "Имя файла",
      programVersion: "Версия программы",
      formatVersion: "Версия формата",
      comment: "Комментарий"
    }
  },
  waybills: {
    units: {
      km: "км"
    },
    title: "ТТН",
    detailsTitle: "ТТН",
    listEmpty: "Список ТТН появится здесь",
    table: {
      waybillNumber: "Номер",
      date: "Дата",
      route: "Маршрут",
      sender: "Отправитель",
      consignee: "Грузополучатель",
      deliveryCost: "Стоимость доставки",
      grossWeight: "Брутто",
      externalStatus: "Внешний статус",
      status: "Статус",
      createdAt: "Создана"
    },
    file: {
      download: "Скачать файл",
      loadError: "Не удалось загрузить файл ТТН",
      openError: "Не удалось открыть файл в новой вкладке"
    },
    send: {
      action: "Отправить в Faktura.uz",
      success: "ТТН поставлена на отправку",
      error: "Не удалось отправить ТТН"
    },
    statuses: {
      draft: "Черновик",
      ready: "Готова",
      sending: "Отправляется",
      sent: "Отправлена",
      registered: "Зарегистрирована",
      rejected: "Отклонена",
      send_failed: "Ошибка отправки",
      cancelled: "Отменена",
      unknown: "Неизвестно"
    },
    externalStatuses: {
      Sent: "Отправлена",
      AwaitCounterparty: "Ожидается контрагент",
      AwaitAction: "Требуется действие",
      AwaitAgreement: "На согласовании",
      AwaitSign: "На подписании",
      AwaitThirdSide: "Ожидается третья сторона",
      AwaitResponsiblePerson: "Ожидается ответственное лицо",
      AwaitResponsiblePersonAccepted: "Ожидается принятие ответственным лицом",
      Registered: "Зарегистрирована",
      Rejected: "Отклонена",
      Cancelled: "Отменена",
      Returned: "Возвращена",
      Deleted: "Удалена",
      Unknown: "Неизвестно"
    },
    deliveryTypes: {
      warehouse_to_warehouse: "Со склада на склад",
      seller_to_buyer: "От продавца к покупателю",
      processing_transfer: "Передача на переработку"
    },
    transportTypes: {
      road: "Авто",
      air: "Авиа",
      rail: "Ж/д",
      water: "Водный"
    },
    sections: {
      links: "Связи",
      totals: "Итоги",
      contract: "Договор",
      file: "Файл",
      delivery: "Доставка",
      transport: "Транспорт",
      signers: "Подписанты",
      cargoGroups: "Грузовые группы",
      overview: "Обзор",
      parties: "Участники",
      cargo: "Груз",
      system: "Система"
    },
    fields: {
      waybillNumber: "Номер ТТН",
      date: "Дата ТТН",
      createdAt: "Создана",
      updatedAt: "Обновлена",
      internalStatus: "Статус",
      externalStatus: "Внешний статус",
      deliveryCost: "Стоимость доставки",
      grossWeight: "Вес брутто",
      netWeight: "Вес нетто",
      contractNumber: "Номер договора",
      contractDate: "Дата договора",
      deliveryType: "Тип доставки",
      costPerDistanceUnit: "Стоимость за единицу расстояния",
      costPerKilometer: "Цена за 1 км",
      sum: "сум",
      totalDistance: "Общее расстояние",
      geoDistanceFallbackTooltip: "Маршрут недоступен, указано прямое расстояние между выбранными точками",
      deliveryTotalCost: "Общая стоимость доставки",
      totalCost: "Общая стоимость",
      transportType: "Тип транспорта",
      driver: "Водитель",
      driverPinfl: "ПИНФЛ водителя",
      truck: "Тягач",
      trailer: "Прицеп",
      sender: "Отправитель",
      consignor: "Грузоотправитель",
      consignee: "Грузополучатель",
      carrier: "Перевозчик",
      freightForwarder: "Экспедитор",
      client: "Клиент",
      payer: "Плательщик",
      name: "Название",
      tin: "ИНН",
      tinOrPinfl: "ИНН/ПИНФЛ",
      vatCode: "Код НДС",
      branch: "Филиал",
      phone: "Телефон",
      address: "Адрес",
      approver: "Утвердил",
      director: "Директор",
      accountant: "Бухгалтер",
      responsiblePerson: "Ответственное лицо",
      salesOrderId: "Заказ",
      deliveryRouteId: "Рейс",
      deliveryTaskId: "Задача доставки",
      externalId: "Внешний ID",
      sentAt: "Отправлена",
      registeredAt: "Зарегистрирована",
      loadingPoint: "Пункт погрузки",
      unloadingPoint: "Пункт разгрузки",
      cargoGroup: "Грузовая группа",
      cargoGroups: "Грузовые группы",
      products: "Товары",
      product: "Товар",
      quantity: "Количество",
      pricePerItem: "Цена",
      productDeliveryCost: "Доставка",
      carriages: "Вагоны"
    }
  },
  users: {
    status: {
      active: "Активный",
      inactive: "Неактивный"
    },
    title: "Пользователи",
    subtitle: "Всего",
    logOut: "Выйти",
    btnAdd: "Добавить пользователя",
    companies: "Компании пользователя",
    deleteUserQuestion: "Вы уверены, что хотите удалить пользователя",
    messages: {
      success: {
        createUser: "Пользователь успешно создан",
        activationEmailSent: "Пользователь создан — письмо для активации отправлено",
        updateUser: "Пользователь успешно обновлён",
        deleteUser: "Пользователь успешно удалён"
      },
      error: {
        createUser: "Ошибка при создании пользователя",
        updateUser: "Ошибка при обновлении пользователя",
        deleteUser: "Ошибка при удалении пользователя",
        loadUsers: "Ошибка при поиске пользователей",
        loadAccess: "Ошибка при загрузке доступов пользователя"
      }
    },
    addUserForm: {
      label: {
        firstName: "Имя",
        lastName: "Фамилия",
        email: "Почта",
        role: "Роль",
        pinfl: "ПИНФЛ",
        password: "Пароль",
        phone: "Телефон",
        lastLoggedInAt: "Дата последнего входа"
      },
      placeholder: {
        firstName: "Введите имя",
        lastName: "Введите фамилию",
        email: "Введите почту",
        role: "Введите роль",
        pinfl: "Введите ПИНФЛ",
        password: "Введите пароль",
        phone: "Введите номер телефона"
      },
      required: {
        firstName: "Введите имя",
        lastName: "Введите фамилию",
        phone: "Введите номер телефона",
        email: "Введите email",
        role: "Выберите роль",
        password: "Введите пароль",
        pinfl: "Введите ПИНФЛ"
      },
      pattern: {
        phone: "Введите корректный номер телефона",
        email: "Введите корректный email",
        pinfl: "ПИНФЛ должен содержать 14 цифр",
        passwordMinLength: "Пароль должен содержать минимум 6 символов"
      },
      activationHint: "Пользователь получит письмо, чтобы задать пароль и активировать аккаунт."
    },
    modalWindow: {
      deletion: "Удаление",
      user: "пользователя",
      editing: "Редактирование",
      viewing: "Просмотр",
      adding: "Добавление"
    },
    details: {
      title: "Пользователь",
      profile: "Профиль",
      personalData: "Личные данные",
      accessSummary: "Сводка доступа",
      systemAccess: "Системный доступ",
      enabled: "Есть",
      notAssigned: "Не назначен",
      noSystemAccess: "Системный доступ не назначен",
      noCompanies: "Компании не назначены"
    }
  },
  systemEmployees: {
    title: "Сотрудники",
    subtitle: "Приглашения и роли",
    fields: {
      role: "Роль",
      roles: "Роли",
      state: "Статус доступа",
      userStatus: "Статус пользователя",
      existingUser: "Существующий пользователь",
      createdAt: "Создано",
      updatedAt: "Обновлено",
      invitedBy: "Пригласил"
    },
    states: {
      active: "Активен",
      invited: "Приглашен",
      declined: "Отклонен",
      disabled: "Отключен"
    },
    actions: {
      invite: "Пригласить",
      sendInvitation: "Отправить приглашение",
      editRoles: "Изменить",
      saveRoles: "Сохранить роли",
      revoke: "Отозвать",
      accept: "Принять",
      decline: "Отклонить"
    },
    placeholders: {
      search: "Поиск по имени или email",
      searchUsers: "Найти пользователя",
      selectRoles: "Выберите роли"
    },
    validation: {
      userRequired: "Выберите существующего пользователя",
      rolesRequired: "Выберите хотя бы одну роль"
    },
    messages: {
      success: {
        invite: "Приглашение отправлено",
        update: "Роли обновлены",
        revoke: "Доступ отозван"
      },
      error: {
        invite: "Не удалось отправить приглашение",
        update: "Не удалось обновить роли",
        revoke: "Не удалось отозвать доступ"
      }
    },
    modal: {
      inviteTitle: "Пригласить сотрудника",
      inviteAction: "Приглашение",
      detailsAction: "Системный",
      editAction: "Редактирование",
      revokeAction: "Отзыв",
      employee: "сотрудник",
      systemAccess: "системного доступа"
    },
    invitations: {
      title: "Вас пригласили в систему AMIS",
      rolesPrefix: "с ролями:"
    },
    revokeQuestion: "Отозвать системный доступ?"
  },
  companyMemberships: {
    title: "Сотрудники",
    subtitle: "Доступы и роли в компании",
    fields: {
      role: "Роль",
      roles: "Роли",
      state: "Статус доступа",
      userStatus: "Статус пользователя",
      existingUser: "Существующий пользователь",
      createdAt: "Создано",
      updatedAt: "Обновлено",
      invitedBy: "Пригласил"
    },
    states: {
      active: "Активен",
      invited: "Приглашен",
      declined: "Отклонен",
      disabled: "Отключен"
    },
    actions: {
      invite: "Пригласить",
      sendInvitation: "Отправить приглашение",
      editRoles: "Изменить",
      saveRoles: "Сохранить роли",
      revoke: "Отозвать",
      accept: "Принять",
      decline: "Отклонить"
    },
    placeholders: {
      searchUsers: "Найти пользователя",
      searchUserByEmail: "Введите полный email пользователя",
      selectRoles: "Выберите роли"
    },
    validation: {
      userRequired: "Выберите существующего пользователя",
      emailRequired: "Введите email пользователя",
      emailInvalid: "Введите корректный email",
      userNotFound: "Пользователь с таким email не найден",
      rolesRequired: "Выберите хотя бы одну роль"
    },
    messages: {
      success: {
        invite: "Приглашение отправлено",
        update: "Роли обновлены",
        revoke: "Доступ отозван"
      },
      error: {
        invite: "Не удалось отправить приглашение",
        update: "Не удалось обновить роли",
        revoke: "Не удалось отозвать доступ"
      }
    },
    modal: {
      inviteTitle: "Пригласить сотрудника",
      detailsAction: "Сотрудник",
      editAction: "Редактирование",
      revokeAction: "Отзыв",
      member: "компании",
      companyAccess: "доступа к компании"
    },
    invitations: {
      title: "Вас пригласили в компанию",
      rolesPrefix: "с ролями:"
    },
    revokeQuestion: "Отозвать доступ к компании?"
  },
  organizations: {
    name: "Название",
    testFlag: "Тест",
    edit: "Изменение организации",
    title: "Организации",
    subtitle: "Всего",
    btnAdd: "Добавить организацию",
    status: "Статус",
    assignToCompany: "Назначить на компанию",
    deleteUserQuestion: "Вы уверены, что хотите удалить организацию",
    actions: {
      activate: "Активировать"
    },
    integrations: {
      receivedData: "Полученные данные",
      notConfigured: "Не настроена",
      steps: {
        company: "Компания",
        xTrace: "X-Trace",
        fakturaUz: "Faktura.uz"
      },
      xTrace: {
        title: "интеграции X-Trace",
        cardTitle: "X-Trace"
      },
      fakturaUz: {
        title: "интеграции Faktura.uz",
        cardTitle: "Faktura.uz",
        username: "Логин",
        password: "Пароль",
        clientId: "Client ID",
        clientSecret: "Client secret",
        validation: {
          username: "Введите логин",
          password: "Введите пароль",
          clientId: "Введите Client ID",
          clientSecret: "Введите Client secret"
        }
      }
    },
    messages: {
      success: {
        createUser: "Организация успешно создан",
        activateCompany: "Компания активирована",
        createXTraceIntegration: "Интеграция X-Trace создана",
        createFakturaUzIntegration: "Интеграция Faktura.uz создана",
        updateUser: "Организация успешно обновлён",
        deleteUser: "Организация успешно удалён",
        assignOrganization: "Пользователь успешно назначен на компанию",
        unassignOrganization: "Пользователь успешно отвязан от компании"
      },
      error: {
        createUser: "Ошибка при создании организации",
        activateCompany: "Ошибка при активации компании",
        createXTraceIntegration: "Ошибка при создании интеграции X-Trace",
        createFakturaUzIntegration: "Ошибка при создании интеграции Faktura.uz",
        updateUser: "Ошибка при обновлении организации",
        deleteUser: "Ошибка при удалении организации",
        unassignOrganization: "Ошибка при отвязывании пользователя от компании"
      }
    },
    addUserForm: {
      label: {
        companyName: "Название компании",
        name: "Имя",
        companyType: "Тип компании",
        displayName: "Отображаемое имя",
        productGroup: "Товарные группы",
        tin: "ИНН",
        pinfl: "ПИНФЛ",
        vatCode: "Код НДС",
        createdAt: "Создано",
        legalName: "Юридическое название организации",
        director: "Директор",
        accountant: "Бухгалтер",
        region: "Регион",
        district: "Район",
        address: "Адрес",
        bankName: "Обслуживающий банк",
        ccea: "ОКЭД",
        account: "Номер счета",
        mfo: "МФО",
        phone: "Телефон",
        email: "Эл. почта",
        url: "Веб-сайт",
        person: "Контактное лицо",
        gcpCode: "GCP код",
        omsId: "OMSID",
        turonToken: "Turon токен",
        status: "Статус",
        deleted: "Удалено",
        xTraceToken: "Токен X-Trace",
        expireDate: "Дата истечения токена",
        businessPlaceId: "Идентификатор МОД"
      },
      placeholder: {
        businessPlaceId: "Введите Индентификатор МОД",
        companyName: "Введите название компании",
        companyType: "Введите тип компании",
        displayName: "Введите отображаемое имя",
        productGroup: "Введите группу",
        tin: "Введите ИНН",
        legalName: "Введите юр. название",
        director: "Введите данные директора",
        region: "Введите регион",
        district: "Введите район",
        address: "Введите адрес",
        bankName: "Введите обслуживающий банк",
        ccea: "Введите ОКЭД",
        account: "Введите номер счета",
        mfo: "Введите МФО",
        phone: "Введите рабочий телефон",
        email: "Введите email",
        url: "Введите веб-сайт",
        person: "Введите контактное лицо",
        gcpCode: "Введите GCP код",
        omsId: "Введите OSMID",
        turonToken: "Введите turon token",
        enterXTraceToken: "Введите токен X-Trace"
      },
      validation: {
        xTrace: {
          invalidToken: "Невалидный токен",
          noToken: "Токен не предоставлен"
        },
        required: {
          tin: "ИНН должен состоять из 9 цифр",
          productGroup: "Пожалуйста, введите название группы товара",
          companyType: "Пожалуйста, выберите тип компании",
          displayName: "Пожалуйста, введите название компании",
          legalName: "Пожалуйста, введите юридическое название компании",
          director: "Пожалуйста, введите имя директора",
          region: "Пожалуйста, введите регион",
          district: "Пожалуйста, введите район",
          address: "Пожалуйста, введите адрес",
          bankName: "Пожалуйста, введите название банка",
          ccea: "Пожалуйста, введите номер расчётного счёта",
          account: "Пожалуйста, введите номер счёта",
          mfo: "Пожалуйста, введите МФО банка",
          phone: "Пожалуйста, введите номер телефона",
          email: "Пожалуйста, введите email",
          url: "Пожалуйста, введите URL",
          person: "Введите корректный URL (например, https://example.com)",
          gcpCode: "Пожалуйста, введите GCP код",
          omsId: "Пожалуйста, введите OMS ID",
          turonToken: "Пожалуйста, введите Turon Token",
          gtin: "GTIN обязателен для заполнения",
          token: "Укажите токен",
          businessPlaceId: "Укажите идентификатор точки"
        },
        pattern: {
          tin: "Пожалуйста, введите ИНН",
          ccea: "Номер расчётного счёта должен состоять из 20 цифр",
          account: "Номер счёта должен состоять из 20 цифр",
          mfo: "МФО банка должен состоять из 5 цифр",
          phone: "Номер телефона должен быть в формате +998XXXXXXXXX",
          email: "Введите корректный email",
          url: "Пожалуйста, введите контактное лицо",
          gcpCode: "GCP код должен содержать минимум 3 символа",
          omsId: "OMS ID должен содержать минимум 3 символа",
          turonToken: "Turon Token должен содержать минимум 5 символов",
          passwordMinLength: "Пароль должен содержать минимум 8 символов",
          gtin: "Введите корректный GTIN (14 цифр)"
        }
      }
    },
    subtitles: {
      address: "Адрес:",
      bankDetails: "Банковские реквизиты:",
      contactDetails: "Контактные данные:",
      legalName: "Юр. название: ",
      name: "Название: "
    },
    modalWindow: {
      deletion: "Удаление",
      organization: "организации",
      editing: "Редактирование",
      viewing: "Просмотр",
      adding: "Добавление"
    }
  },
  products: {
    title: "Продукты",
    subtitle: "Всего",
    btnAdd: "Добавить продукт",
    status: "Статус",
    view: "Просмотр продукта",
    edit: "Изменение продукта",
    deleteUserQuestion: "Вы уверены, что хотите удалить продукт",
    messages: {
      success: {
        createProduct: "Продукт успешно создан",
        updateProduct: "Продукт успешно обновлён",
        deleteProduct: "Продукт успешно удалён"
      },
      error: {
        createProduct: "Ошибка при создании Продукта",
        updateProduct: "Ошибка при обновлении Продукта",
        deleteProduct: "Ошибка при удалении Продукта",
        invalidExpiration: "Срок годности должен быть целым числом до 2-х цифр"
      }
    },
    gtin: {
      unit: "GTIN потребительской упаковки",
      group: "GTIN групповой упаковки",
      box_lv_1: "GTIN коробки",
      box_lv_2: "GTIN паллеты"
    },
    classification: {
      title: "Классификация",
      icps: "ИКПУ",
      name: "Название",
      source: "Источник",
      resolvedAt: "Дата определения",
      empty: "Ещё не классифицирован"
    },
    validation: {
      required: "Поле обязательно для заполнения",
      min2: "Минимальная длина — 2 символа",
      max10: "Максимальная длина — 10 символов",
      max200: "Максимальная длина — 200 символов",
      number: "Введите корректное число",
      decimal: "Введите корректное число (целое или с десятичной точкой)",
      icps: "Введите корректный ИКПУ (14 цифр)",
      price: "Введите корректную цену"
    },
    addProductForm: {
      label: {
        name: "Название продукции",
        shortName: "Короткое название продукции",
        description: "Описание",
        gtin: "GTIN",
        barcode: "Штрихкод",
        icps: "ИКПУ",
        brand: "Бренд",
        productType: "Тип продукции",
        aggregationQuantity: "Количество в агрегации",
        expiration: "Срок годности в днях",
        unit: "Единица измерения",
        amount: "Количество",
        net: "Вес нетто",
        gross: "Вес брутто",
        price: "Цена",
        companyId: "Айди компании",
        manufacturerCountry: "Страна-производитель"
      },
      placeholder: {
        name: "Введите название продукции",
        shortName: "Введите короткое название продукции",
        description: "Введите описание",
        gtin: "Введите GTIN",
        barcode: "Штрихкод",
        icps: "Введите ИКПУ",
        productType: "Введите тип продукции",
        aggregationQuantity: "Введите количество в агрегации",
        expiration: "Введите срок годности",
        unit: "Введите единицу измерения",
        amount: "Введите количество",
        net: "Введите вес нетто",
        gross: "Введите вес брутто",
        price: "Введите цену",
        companyId: "Айди компании",
        manufacturerCountry: "Поиск стран"
      },
      validation: {
        required: {
          gtin: "GTIN обязателен для заполнения",
          barcode: "Штрихкод обязателен для заполнения",
          icps: "ИКПУ обязателен для заполнения",
          productType: "Тип продукта обязателен для заполнения",
          aggregationQuantity: "Количество в агрегации обязательно для заполнения",
          expiration: "Срок годности обязателен для заполнения",
          measurementUnit: "Единица измерения обязательна для заполнения",
          measurementAmount: "Количество обязательно для заполнения",
          weightNet: "Нетто обязательно для заполнения",
          name: "Название продукта обязательно для заполнения",
          shortName: "Краткое название продукта обязательно для заполнения",
          manufacturerCountry: "Выберите страну",
          requiredField: "Поле должно быть заполненно"
        },
        pattern: {
          gtin: "Введите корректный GTIN (14 цифр)",
          barcode: "Введите корректный штрихкод (от 8 до 14 цифр)",
          icps: "Введите корректный ICPS (14 цифр)",
          aggregationQuantity: "Введите корректное число",
          expiration: "Введите корректное число",
          measurementUnit: "Максимальная длина — 10 символов",
          measurementAmount: "Введите корректное число (целое или с десятичной точкой)",
          weightNet: "Введите корректное число (целое или с десятичной точкой)"
        }
      }
    },
    details: {
      main: "Основная информация",
      gtin: "Коды GTIN",
      measurement: "Измерения и вес",
      description: "Описание",
      packages: "Упаковки"
    },
    packages: {
      empty: "Упаковки для этого продукта не найдены",
      fields: {
        code: "Код",
        type: "Тип",
        name: "Название"
      },
      messages: {
        error: "Не удалось загрузить упаковки продукта"
      }
    },
    modalWindow: {
      deletion: "Удаление",
      product: "продукта",
      editing: "Редактирование",
      viewing: "Просмотр",
      adding: "Добавление"
    }
  },
  login: {
    messages: {
      successLogin: "Успешный вход",
      errorLogin: "Ошибка входа, проверьте логин и пароль"
    },
    btn: {
      login: "Вход",
      signIn: "Войти"
    },
    enterUserName: "Введите логин",
    username: "Логин"
  },
  auth: {
    backToLogin: "Вернуться ко входу",
    goToLogin: "Перейти ко входу",
    errors: {
      missingToken: "В ссылке отсутствует токен. Откройте ссылку из письма ещё раз."
    },
    register: {
      title: "Создать аккаунт",
      submit: "Зарегистрироваться",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      messages: {
        error: "Не удалось зарегистрироваться. Попробуйте ещё раз."
      },
      checkInbox: {
        title: "Проверьте почту",
        intro: "Мы отправили ссылку для подтверждения на:",
        hint: "Откройте её, чтобы подтвердить email, затем войдите."
      }
    },
    verifyEmail: {
      title: "Подтверждение email",
      loading: "Подтверждаем ваш email…",
      error: "Не удалось подтвердить email.",
      errorTitle: "Подтверждение не выполнено",
      successTitle: "Email подтверждён",
      successDescription: "Ваш email подтверждён. Теперь вы можете войти."
    },
    activate: {
      title: "Задайте пароль",
      subtitle: "Создайте пароль, чтобы активировать аккаунт.",
      submit: "Активировать аккаунт",
      error: "Не удалось активировать аккаунт.",
      errorTitle: "Активация не выполнена",
      successTitle: "Аккаунт активирован",
      successDescription: "Пароль задан, email подтверждён. Теперь вы можете войти.",
      passwordsDontMatch: "Пароли не совпадают.",
      label: {
        password: "Пароль",
        confirmPassword: "Подтверждение пароля"
      },
      placeholder: {
        confirmPassword: "Повторите пароль"
      },
      required: {
        confirmPassword: "Подтвердите пароль"
      }
    },
    passwordMinLength: "Пароль должен содержать не менее 6 символов",
    forgotPassword: {
      link: "Забыли пароль?",
      title: "Восстановление пароля",
      subtitle: "Укажите email — мы отправим ссылку для сброса пароля.",
      submit: "Отправить ссылку",
      emailLabel: "Email",
      checkInbox: {
        title: "Проверьте почту",
        intro: "Если аккаунт с таким адресом существует, мы отправили ссылку для сброса пароля на:",
        hint: "Откройте ссылку, чтобы задать новый пароль. Если письма нет — проверьте папку «Спам»."
      }
    },
    resetPassword: {
      title: "Новый пароль",
      subtitle: "Задайте новый пароль для вашего аккаунта.",
      submit: "Сбросить пароль",
      successTitle: "Пароль обновлён",
      successDescription: "Пароль изменён. Теперь вы можете войти.",
      errorTitle: "Не удалось сбросить пароль",
      error: "Не удалось сбросить пароль.",
      passwordsDontMatch: "Пароли не совпадают.",
      label: {
        password: "Новый пароль",
        confirmPassword: "Подтверждение пароля"
      },
      placeholder: {
        password: "Введите новый пароль",
        confirmPassword: "Повторите пароль"
      },
      required: {
        confirmPassword: "Подтвердите пароль"
      }
    }
  },
  me: {
    title: "Мой профиль",
    loadError: "Не удалось загрузить профиль.",
    changePassword: "Изменить пароль"
  },
  changePwd: {
    title: "Изменить пароль",
    confirmModal: {
      title: "Вы уверены, что хотите изменить пароль?",
      subtitle: "Введите текущий пароль, чтобы подтвердить изменение.",
      btn: {
        confirm: "Подтвердить",
        cancel: "Отмена"
      }
    },
    changePasswordForm: {
      message: {
        passwordsDontMatch: "Пароли не совпадают.",
        error: "Ошибка при смене пароля",
        success: "Пароль успешно изменён"
      },
      label: {
        currentPassword: "Текущий пароль",
        newPassword: "Новый пароль",
        newPasswordConfirmation: "Подтверждение нового пароля"
      },
      placeholder: {
        currentPassword: "Введите текущий пароль",
        newPassword: "Введите новый пароль",
        newPasswordConfirmation: "Подтвердите новый пароль"
      },
      required: {
        currentPassword: "Введите текущий пароль",
        newPasswordRequired: "Введите новый пароль",
        newPassword: "Пароль должен содержать не менее 6 символов."
      }
    }
  },
  auditLog: {
    title: "Логи системы",
    subtitle: "Мониторинг и анализ активности пользователей",
    ip: "IP адрес",
    id: "ID запроса",
    committed: "Совершил",
    target: "Цель действия"
  },
  markingCodes: {
    title: "Заказы КМ",
    orderNumber: "Заказ",
    subtitle: "Всего",
    order: "Заказать",
    independently: "Самостоятельно",
    byOperator: "Оператором",
    markingCodes: "Коды маркировки",
    backToOrders: "Вернуться к заказам",
    backToBatches: "Вернуться партиям",
    applyAll: {
      confirmApplyAll: "Создать отчеты о нанесении для всех {{count}} батчей?",
      applyAllPartialError: "Не удалось создать {{error}} отчет(ов)",
      noBatchesToApply: "Нет батчей для нанесения",
      unexpectedError: "Произошла непредвиденная ошибка"
    },
    utilization: {
      createdOne: "Отчёт о нанесении {{number}} создан",
      createdMany: "Создано отчётов о нанесении: {{count}}"
    },
    orderProduct: {
      markingCodesStatus: {
        received: "Получен",
        applied: "Нанесен",
        introduced: " В обороте",
        withdrawn: "Выведен из оборота",
        aggregated: "Агрегирован",
        reserved_for_aggregation: "Зарезервирован под агрегацию",
        written_off: "Списан",
        reserved_for_delivery: "Зарезервирован под доставку",
        loaded: "Загружен",
        in_transit: "В пути",
        delivered: "Доставлен"
      }
    },
    batches: {
      title: "Партии",
      orderNumber: "Номер заказа",
      orderTime: "Время заказа",
      orderStatus: "Статус заказа",
      turonOrderID: "Turon order ID",
      sections: {
        product: "Продукт и партия",
        order: "Информация о заказе",
        batchStatus: "Статусы партии",
        orderStatus: "Статусы заказа"
      },
      batchData: {
        batchNumber: "Номер партии",
        packagingType: "Тип упаковки",
        orderNumber: "Номер заказа",
        executor: "Исполнитель",
        productName: "Название продукта",
        gtin: "GTIN",
        orderTime: "Время заказа",
        numberOfMarkingCodes: "Кол-во КМ",
        turonOrderID: "ID заказа Турон",
        batchStatus: "Статус партии",
        orderStatus: "Статус заказа",
        turonOrderStatus: "Статус заказа Турон",
        batchStatusInTuron: "Статус партии в Турон",
        order: {

        }
      }
    },
    tableTitles: {
      number: "№",
      products: "Продукция",
      comments: "Название продукта",
      markingCodesQuantity: "Количествово КМ",
      turonBatchID: "ID Партии турон",
      creationDate: "Дата создания",
      turonMessage: "Сообщение от турон",
      orderNumber: "Заказ",
      productName: "Название продукта",
      totalQuantity: "Кол-во",
      orderedMCQuantity: "Заказанное количество КМ",
      codesHaveBeenExported: "Выгружены",
      orderDate: "Дата заказа",
      packageType: "Упаковка",
      paymentType: "Тип оплаты",
      externalStatus: "Внешний статус",
      status: "Статус",
      paid: "Оплачиваемый",
      unPaid: "Неоплачиваемый",
      batchNumber: "Партия",
      gtin: "GTIN",
      numberOfMarkingCodes: "Количество",
      code: "Код"
    },
    orderCreation: {
      title: "Создание заказа",
      product: "Продукция",
      packagingType: "Тип упаковки",
      quantity: "Количество",
      serialNumberGenerationMethod: "Метод генерации",
      selfGenerated: "Самогенерируемый",
      byOperator: "Оператором",
      submitOrder: "Отправить заказ",
      orderHasBeenSuccessfullyCreated: "Заказ успешно создан",
      failedToCreateOrder: "Не удалось создать заказ",
      differentProductsWarning: "Обратите внимание, вы выбрали разные наименования товара"
    },
    label: {
      chooseProduct: "Выберите продукцию",
      choosePackageType: "Выберите тип упаковки",
      enterQuantity: "Введите количество",
      chooseGenerationMethod: "Метод генерации",
      duplicatePackageType: "Этот тип упаковки уже выбран для этого товара"
    },
    packageType: {
      unit: "Потребительская",
      group: "Групповая",
      box_lv_1: "Коробка",
      box_lv_2: "Паллета"
    }
  },
  customsCodes: {
    title: "АИК",
    subtitle: "Создание и регистрация агрегированных импортных кодов",
    table: {
      number: "№",
      accOrderNumber: "Заявка АИК",
      product: "Товар",
      customsCode: "АИК",
      quantity: "Количество",
      measurement: "Ед. изм.",
      document: "Документ",
      status: "Статус"
    },
    actions: {
      create: "Создать АИК",
      creating: "Создаем",
      dissolve: "Расформировать",
      sign: "Подписать",
      signing: "Подписываем",
      signAndSend: "Подписать и отправить",
      resume: "Повторить"
    },
    messages: {
      createSuccess: "АИК создан.",
      createError: "Не удалось создать АИК.",
      loadError: "Не удалось загрузить АИК",
      documentMissing: "Бэк не вернул документ для подписи.",
      selectKey: "Выберите ключ E-IMZO.",
      signSuccess: "Документ подписан и отправлен на проверку.",
      signError: "Не удалось подписать документ",
      dissolutionInitiated: "Расформирование запущено.",
      dissolutionError: "Не удалось запустить расформирование.",
      documentPending: "Документ для подписи ещё не готов. Откройте заявку, когда статус станет «Готов к подписи».",
      resumeStarted: "Обработка запущена заново.",
      resumeError: "Не удалось запустить обработку заново."
    },
    eImzoErrors: {
      noDescription: "E-IMZO не вернул описание ошибки.",
      keyNotFound: "Ключ не найден. Проверьте, что файл ключа находится в папке DSKEYS.",
      badPassword: "Неверный пароль ключа.",
      notResponding: "E-IMZO не отвечает. Попробуйте ещё раз.",
      unavailable: "E-IMZO недоступен. Запустите e-imzo.exe и попробуйте снова.",
      connectionClosed: "Соединение с E-IMZO закрыто. Запустите e-imzo.exe и попробуйте снова.",
      keyIdMissing: "E-IMZO не вернул идентификатор ключа.",
      signedDocumentMissing: "E-IMZO не вернул подписанный документ.",
      certificateDateMissing: "Не удалось проверить срок действия сертификата. Выберите другой ключ или перезапустите E-IMZO.",
      certificateNotYetValid: "Выбранный сертификат ещё не активен.",
      certificateExpired: "Срок действия выбранного сертификата истёк. Выберите активный ключ.",
      certificateInactive: "Выбранный сертификат неактивен или отозван. Выберите активный ключ.",
      certificateInvalid: "Выбранный сертификат недействителен. Выберите другой ключ."
    },
    signModal: {
      title: "Подписание АИК",
      registrationTitle: "Подписание АИК",
      dissolutionTitle: "Подписание расформирования АИК",
      hint: "Перед подписью запустите e-imzo.exe и положите ключ в папку DSKEYS.",
      openApp: "Открыть E-IMZO",
      openAppHint: "Если браузер спросит разрешение, разрешите открыть E-IMZO и подождите несколько секунд.",
      document: "Документ",
      selectKey: "Выберите ключ E-IMZO",
      keysNotFound: "Ключи не найдены"
    },
    createModal: {
      title: "Создать АИК",
      hint: "Выберите использованную партию. После создания бэк сам сгенерирует АИК и подготовит документ для подписи.",
      selectProduct: "Фильтр по товару",
      productsNotFound: "Товары не найдены",
      selectBatch: "Выберите партию",
      batchesNotFound: "Подходящие партии не найдены"
    },
    details: {
      title: "Детали заявки АИК",
      loadError: "Не удалось загрузить детали заявки АИК",
      sections: {
        general: "Общая информация",
        documents: "Документы",
        processing: "Обработка"
      },
      fields: {
        orderId: "ID заказа КМ",
        batchId: "ID партии",
        productId: "ID товара",
        createdBy: "Создал",
        registrationDocument: "Документ регистрации",
        dissolutionDocument: "Документ расформирования",
        processingStep: "Шаг обработки",
        processingAttempts: "Попытки",
        notGenerated: "Не сформирован",
        processingStalled: "Обработка остановлена: задача исчерпала попытки и ждёт разбора. Нажмите «Повторить», чтобы запустить шаг заново."
      }
    }
  },
  aggregations: {
    title: "Отчеты об агрегации",
    btnAdd: "Создать отчет",
    addAggregation: "Агрегировать",
    exportGrouped: "Экспорт групповых",
    exportUnit: "Экспорт  потребительских",
    messages: {
      createSuccess: "Отчёт об агрегации успешно создан.",
      createError: "Не удалось создать отчёт об агрегации."
    },
    aggregationsTableTitle: {
      status: "Статус",
      orderDate: "Дата заказа",
      quantityPerPackage: "Кол-во в упаковке",
      numberOfPackages: "Кол-во упаковок",
      productName: "Название продукта",
      childBatch: "Дочерняя партия",
      parentBatch: "Родительская партия",
      aggregationReportNumber: "Номер отчета об агрегации"
    },
    addAggregationFields: {
      parentBatch: "Родительская партия",
      childBatch: "Дочерняя партия",
      packagingDate: "Дата упаковки"
    },
    agregationReportPage: {
      productName: "Название продукта",
      parentCode: "Родительский код",
      orders: "Заказы",
      codeNumber: "Номер кода",
      code: "Код",
      batches: "Партии",
      aggregations: "Агрегации",
      aggregation: "Агрегация",
      quantityPerPackage: "Количество в упаковке",
      aggregationQuantity: "Количество агрегации",
      productionOrderNumber: "Номер производственного заказа",
      parentOrderNumber: "Номер родительского заказа",
      childOrderNumber: "Номер дочернего заказа",
      parentBatchNumber: "Номер родительской партии",
      childBatchNumber: "Номер дочерней партии"
    }
  }
};

export default ru;

