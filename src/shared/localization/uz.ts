/**
 * Переводы интерфейса: O‘zbekcha.
 *
 * Файл на язык: i18next подгружает только активный, и правка перевода
 * конфликтует лишь с правкой того же языка.
 */
const uz = {
  access: {
    sections: {
      references: "Ma’lumotnomalar",
      roles: "Rollar",
      uploads: "Fayllar",
      scanSessions: "Skanerlash",
      lifecycle: "Yozuvlar tarixi",
      jobs: "Fon vazifalari",
      companyImport: "Kompaniya importi"
    }
  },
  errorBoundary: {
    title: "Nimadir xato ketdi",
    description: "Sahifani chizib bo‘lmadi. Yana urinib ko‘ring — takrorlansa, sahifani qayta yuklang.",
    retry: "Yana urinib ko‘rish",
    reload: "Sahifani qayta yuklash"
  },
  orders: {
    orderNumber: "Buyurtma raqami"
  },
  statusChange: {
    refresh: "Roʻyxatni yangilash",
    open: "Ochish",
    offline: "Bildirishnomalar o‘chiq",
    offlineHint: "Bildirishnomalar aloqasi uzildi: ekrandagi holat o‘zgarishlari kechikishi mumkin. Aloqa avtomatik tiklanadi."
  },
  common: {
    yes: "Ha",
    no: "Yoʻq",
    error: "Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.",
    requiredDataUnavailable: "Sahifa uchun zarur ma’lumotlarni yuklab bo‘lmadi.",
    missingPermissions: "Yetishmayotgan ruxsatlar",
    dataNotFound: "Ma'lumot topilmadi",
    total: "Jami",
    loading: "Yuklanmoqda",
    create: "Yaratish",
    details: "Batafsil",
    backToList: "Roʻyxatga qaytish",
    backToRoute: "Reysga qaytish",
    backToTask: "Vazifaga qaytish",
    expandAll: "Barchasini yoyish",
    collapseAll: "Barchasini buklash",
    expand: "Yoyish",
    language: "Interfeys tili",
    collapse: "Buklash",
    change: "O'zgartirish",
    history: "Tarix",
    crew: "Ekipaj",
    creator: "Yaratuvchi",
    createdBy: "Yaratdi",
    updatedBy: "Yangiladi",
    user: "Foydalanuvchi",
    userId: "ID",
    email: "Email",
    phone: "Telefon",
    status: "Holat",
    moreDetails: "Batafsil",
    copied: "Nusxalandi",
    cancel: "Bekor qilish"
  },
  welcome: {
    title: "AMIS tizimiga xush kelibsiz",
    description: "Tizim bo‘limlari rahbaringizdan taklifnoma olganingizdan so‘ng paydo bo‘ladi."
  },
  statuses: {
    active: "Faol",
    inactive: "Faol emas",
    prospective: "Istiqbolli",
    draft: "Taslagi",
    assigned_to_warehouse: "Omborga tayinlash",
    ready_for_loading: "Yuklashga tayyor",
    planned: "Rejalashtirilgan",
    loading: "Yuklash",
    loaded: "Yuklangan",
    handover_in_progress: "Topshirish boshlandi",
    in_transit: "Yo'lda",
    partially_delivered: "Qisman yetkazilgan",
    delivered: "Yetkazilgan",
    issue_failed: "Topshirish xatosi",
    returning: "Qaytarish",
    returned: "Qaytarilgan",
    cancelled: "Bekor qilindi",
    closed: "Yopilgan",
    invoiced: "Hisob-faktura berilgan",
    failed: "Xato"
  },
  export: {
    short: "Qisqa",
    long: "To‘liq",
    longWithGroupSnapshot: "Guruhlar snapshoti bilan to‘liq"
  },
  groups: {
    groups: "guruh",
    group: "guruh"
  },
  logsActions: {
    user: {
      userRegistration: "Yangi foydalanuvchini ro‘yxatdan o‘tkazish",
      passwordChange: "Foydalanuvchi parolni oʻzgartirdi",
      unassignCompanyFromUser: "Foydalanuvchidan kompaniya o‘chirildi",
      assignCompanyToUser: "Kompaniya foydalanuvchiga biriktirildi",
      userUpdate: "Foydalanuvchini yangilash",
      userDelete: "Foydalanuvchini o‘chirish"
    },
    object: {
      productCreate: "Foydalanuvchi mahsulot yaratdi",
      productUpdate: "Foydalanuvchi mahsulotni yangiladi",
      productDelete: "Foydalanuvchi mahsulotni oʻchirib tashladi"
    },
    organization: {
      organizationCreate: "Foydalanuvchi tashkilot yaratdi",
      organizationUpdate: "Foydalanuvchi tashkilotni yangiladi",
      organizationDelete: "Foydalanuvchi tashkilotni o‘chirdi"
    },
    order: {
      orderCreate: "Buyurtma yaratildi",
      orderStatusChanged: "Buyurtma holati o‘zgartirildi",
      orderBatchStatusChanged: "Buyurtma partiyasi holati o‘zgartirildi",
      orderCodesRegistered: "Kod ro‘yxatdan o‘tkazildi",
      orderCodesUtilized: "Kod qo‘llandi",
      orderReportCreated: "Hisobot yaratildi",
      orderClosed: "Buyurtma yopildi",
      orderRejected: "Buyurtma rad etildi"
    },
    types: {
      login: "Foydalanuvchi tizimga kirdi",
      logout: "Foydalanuvchi tizimdan chiqdi",
      userRegistration: "Yangi foydalanuvchini ro‘yxatdan o‘tkazish",
      passwordChange: "Foydalanuvchi parolni oʻzgartirdi",
      productCreate: "Foydalanuvchi mahsulot yaratdi",
      productUpdate: "Foydalanuvchi mahsulotni yangiladi",
      productDelete: "Foydalanuvchi mahsulotni oʻchirib tashladi",
      organizationCreate: "Foydalanuvchi tashkilot yaratdi",
      organizationUpdate: "Foydalanuvchi tashkilotni yangiladi",
      organizationDelete: "Foydalanuvchi tashkilotni o‘chirdi",
      unassignCompanyFromUser: "Foydalanuvchidan kompaniya o‘chirildi",
      assignCompanyToUser: "Kompaniya foydalanuvchiga biriktirildi",
      userUpdate: "Foydalanuvchini yangilash",
      userDelete: "Foydalanuvchini o‘chirish",
      orderCreate: "Buyurtma yaratildi",
      orderStatusChanged: "Buyurtma holati o‘zgartirildi",
      orderBatchStatusChanged: "Buyurtma partiyasi holati o‘zgartirildi",
      orderCodesRegistered: "Kod ro‘yxatdan o‘tkazildi",
      orderCodesUtilized: "Kod qo‘llandi",
      orderReportCreated: "Hisobot yaratildi",
      orderClosed: "Buyurtma yopildi",
      orderRejected: "Buyurtma rad etildi",
      systemEmployeeCreate: "Tizim xodimi yaratildi",
      systemEmployeeUpdate: "Tizim xodimi yangilandi",
      systemEmployeeDelete: "Tizim xodimi o‘chirildi",
      companyMembershipCreate: "Kompaniya a'zosi qo‘shildi",
      companyMembershipUpdate: "Kompaniya a'zosi yangilandi",
      companyMembershipDelete: "Kompaniya a'zosi o‘chirildi",
      emailVerified: "Email tasdiqlandi",
      passwordReset: "Parol tiklandi",
      passwordSet: "Parol o‘rnatildi",
      userCreatedByAdmin: "Foydalanuvchi administrator tomonidan yaratildi"
    }
  },
  categories: {
    all: "Barchasi",
    user: "Foydalanuvchilar",
    product: "Mahsulotlar",
    auth: "Autentifikatsiya",
    organization: "Tashkilot",
    order: "Buyurtmalar"
  },
  search: {
    byName: "Ism bo‘yicha qidirish",
    byOrganization: "Tashkilotlar bo‘yicha qidirish",
    selectProduct: "Mahsulotni tanlang",
    packageType: "Qadoq turi",
    selectStatus: "Holatni tanlang",
    selectOrderPaymentType: "Buyurtma toʻlov turini tanlang",
    selectState: "Holatni tanlang",
    chooseDate: "Sanani tanlang"
  },
  btn: {
    create: "Yaratish",
    edit: "Tahrirlash",
    delete: "Oʻchirish",
    cancel: "Bekor qilish",
    save: "Saqlash",
    search: "Qidirish",
    skip: "O‘tkazib yuborish",
    finish: "Yakunlash",
    back: "Orqaga",
    toProducts: "Mahsulotlarga o‘tish",
    enterCompany: "Kompaniyaga kirish",
    sendToTuron: "Turonga yuborish",
    apply: "Qo‘llash",
    applyAll: "Hammasini qo‘llash",
    send: "Yuborish",
    copy: "Nusxalash",
    add: "Qo‘shish"
  },
  navigation: {
    products: "Mahsulotlar",
    management: "Boshqaruv",
    organization: "Tashkilot",
    organizations: "Tashkilotlar",
    myOrganizations: "Mening tashkilotlarim",
    exitCompany: "Kompaniyadan chiqish",
    users: "Foydalanuvchilar",
    systemEmployees: "Xodimlar",
    leads: "Arizalar",
    audit: "Tizim jurnallari",
    markingCodes: "Kod buyurtmalari",
    ownedCodes: "Markirovka kodlari",
    agregations: "Agregatsiyalar",
    implementation: "Ijro",
    deals: "Bitimlar",
    routes: "Reyslar",
    salesOrders: "Sotuv buyurtmalari",
    deliveryRoutes: "Reyslar",
    vehicles: "Transport",
    deliveryTasks: "Yetkazib berish vazifalari",
    invoices: "Hisob-fakturalar",
    waybills: "TTN",
    companyMemberships: "Xodimlar",
    integrations: "Integratsiyalar",
    mobileTabs: "Bo'limlar",
    groups: {
      marking: "Markirovka",
      shipping: "Jo'natmalar",
      company: "Kompaniya"
    },
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish"
  },
  statusCatalog: {
    lead: {
      internal: {
        new: "Yangi",
        in_progress: "Ishlanmoqda",
        completed: "Yakunlangan",
        rejected: "Rad etilgan"
      }
    },
    waybill: {
      internal: {
        draft: "Qoralama",
        ready: "Yuborishga tayyor",
        sending: "Yuborilmoqda",
        sent: "Yuborilgan",
        registered: "Ro‘yxatga olingan",
        rejected: "Rad etilgan",
        send_failed: "Yuborishda xatolik",
        cancelled: "Bekor qilingan"
      },
      external: {
        Sent: "Yuborilgan",
        AwaitCounterparty: "Kontragent kutilmoqda",
        AwaitAction: "Harakat talab qilinadi",
        AwaitAgreement: "Kelishuvda",
        AwaitSign: "Imzolashda",
        AwaitThirdSide: "Uchinchi tomon kutilmoqda",
        AwaitResponsiblePerson: "Mas’ul shaxs kutilmoqda",
        AwaitResponsiblePersonAccepted: "Mas’ul shaxs qabul qilishi kutilmoqda",
        Registered: "Ro‘yxatga olingan",
        Rejected: "Rad etilgan",
        Cancelled: "Bekor qilingan",
        Returned: "Qaytarilgan",
        Deleted: "O‘chirilgan",
        Unknown: "Holat aniqlanmagan"
      }
    },
    markingCodeOrder: {
      internal: {
        new: "Yaratilgan",
        vendor_pending: "Markirovka tizimi kutilmoqda",
        ready_for_codes: "Kodlar yuklab olishga tayyor",
        codes_partially_received: "Kodlar qisman olindi",
        codes_received: "Kodlar olindi",
        codes_utilization_requested: "Kodlarni tushirish so‘raldi",
        codes_partially_utilized: "Kodlar qisman tushirildi",
        codes_utilized: "Kodlar tushirildi",
        codes_partially_aggregated: "Kodlar qisman agregatsiya qilindi",
        codes_aggregated: "Kodlar agregatsiya qilindi",
        rejected: "Rad etilgan",
        closed: "Yopilgan",
        error: "Xatolik"
      },
      external: {
        CREATED: "Yaratilgan",
        PENDING: "Qayta ishlanmoqda",
        READY: "Tayyor",
        REJECTED: "Rad etilgan",
        CLOSED: "Yopilgan",
        OUTSOURCED: "Autsorsingga berilgan"
      }
    },
    markingCodeOrderBatch: {
      internal: {
        new: "Yaratilgan",
        created: "Rasmiylashtirilgan",
        vendor_pending: "Markirovka tizimi kutilmoqda",
        ready_for_codes: "Kodlar yuklab olishga tayyor",
        codes_partially_received: "Kodlar qisman olindi",
        codes_received: "Kodlar olindi",
        codes_utilization_requested: "Kodlarni tushirish so‘raldi",
        codes_utilized: "Kodlar tushirildi",
        codes_aggregated: "Kodlar agregatsiya qilindi",
        rejected: "Rad etilgan",
        closed: "Yopilgan",
        error: "Xatolik"
      },
      external: {
        PENDING: "Qayta ishlanmoqda",
        ACTIVE: "Faol",
        EXHAUSTED: "Kodlar tugagan",
        REJECTED: "Rad etilgan",
        CLOSED: "Yopilgan"
      }
    },
    utilizationReport: {
      internal: {
        new: "Yaratilgan",
        vendor_pending: "Markirovka tizimi kutilmoqda",
        partially_processed: "Qisman qayta ishlangan",
        success: "Qayta ishlangan",
        error: "Xatolik"
      },
      external: {
        CREATED: "Yaratilgan",
        VALIDATING: "Tekshirilmoqda",
        IN_PROCESS: "Qayta ishlanmoqda",
        PARTIALLY_PROCESSED: "Qisman qayta ishlangan",
        SUCCESS: "Qayta ishlangan",
        ERROR: "Rad etilgan"
      }
    },
    aggregationReport: {
      internal: {
        new: "Yaratilgan",
        requested: "So‘ralgan",
        vendor_pending: "Markirovka tizimi kutilmoqda",
        partially_processed: "Qisman qayta ishlangan",
        success: "Qayta ishlangan",
        error: "Xatolik"
      },
      external: {
        CREATED: "Yaratilgan",
        VALIDATING: "Tekshirilmoqda",
        IN_PROCESS: "Qayta ishlanmoqda",
        PARTIALLY_PROCESSED: "Qisman qayta ishlangan",
        SUCCESS: "Qayta ishlangan",
        ERROR: "Rad etilgan"
      }
    },
    aggregatedCustomsCodeOrder: {
      internal: {
        new: "Yangi",
        generated: "Generatsiya qilingan",
        ready_for_sign: "Imzolashga tayyor",
        signed_for_registration: "Imzolangan",
        verified_for_registration: "Tekshirilgan",
        registration_requested: "Ro‘yxatga olishga yuborilgan",
        registered: "Ro‘yxatdan o‘tgan",
        registration_failed: "Ro‘yxatga olish rad etildi",
        dissolution_initialized: "Tarqatish boshlandi",
        signed_for_dissolution: "Tarqatish imzolandi",
        verified_for_dissolution: "Tarqatish tekshirildi",
        dissolution_requested: "Tarqatishga yuborilgan",
        dissolved: "Tarqatilgan",
        dissolution_failed: "Tarqatish rad etildi"
      }
    }
  },
  lifecycle: {
    title: "Tarix",
    subtitle: "Statuslar tarixi va integratsiya xatolari",
    tabs: {
      overview: "Asosiy",
      lifecycle: "Tarix"
    },
    feedTabs: {
      all: "Barchasi",
      internal: "Ichki"
    },
    vendors: {
      x_trace: "X-Trace",
      faktura_uz: "Faktura.uz",
      tasnif: "Tasnif"
    },
    scopes: {
      internal: "Ichki",
      external: "Tashqi tizim"
    },
    externalHint: "Status {{vendor}} tizimidan keldi",
    filters: {
      all: "Barchasi",
      status: "Statuslar",
      error: "Xatolar"
    },
    groups: {
      today: "Bugun",
      yesterday: "Kecha"
    },
    actor: {
      user: "Foydalanuvchi",
      system: "Tizim",
      vendor: "Vendor"
    },
    origin: {
      ui: "Interfeys",
      api: "API",
      scheduler: "Rejalashtiruvchi",
      webhook: "Webhook",
      import: "Import",
      migration: "Migratsiya"
    },
    errorClass: {
      transient: "Vaqtinchalik nosozlik",
      permanent: "Harakat talab qilinadi",
      conflict: "Holat ziddiyati",
      unknown: "Nomaʼlum xato"
    },
    errorHint: {
      transient: "Tashqi xizmat mavjud emas, urinishlar davom etmoqda.",
      permanent: "Maʼlumotlarni yoki integratsiya sozlamalarini tekshiring.",
      conflict: "Kartani yangilang: holat allaqachon oʻzgargan.",
      unknown: ""
    },
    activeError: {
      attempts: "Urinishlar: {{count}}",
      since: "{{date}} dan beri",
      open: "Tarixni ochish"
    },
    fields: {
      code: "Kod",
      reason: "Sabab",
      comment: "Izoh",
      occurrences: "Takrorlanish",
      lastOccurredAt: "Oxirgi marta",
      requestId: "Request ID",
      causedBy: "Bogʻliq hodisa",
      technical: "Texnik tafsilotlar"
    },
    firstStatus: "Boshlangʻich status",
    total: "Jami hodisalar",
    shown: "Koʻrsatildi: {{count}}",
    loadMore: "Yana koʻrsatish",
    empty: "Hozircha hodisalar yoʻq",
    errors: {
      loadEvents: "Tarixni yuklab boʻlmadi",
      loadSummary: "Tarix xulosasini yuklab boʻlmadi"
    }
  },
  ownedCodes: {
    title: "Egalikdagi kodlar",
    subtitle: "Kompaniya egalikdagi kodlari",
    filters: {
      gtin: "GTIN-14 bo‘yicha qidirish"
    },
    tabs: {
      summary: "Xulosa",
      codes: "Kodlar"
    },
    summary: {
      product: "Tovar",
      packages: "Qadoqlash",
      total: "Kodlar",
      freshestAt: "Oxirgi tasdiq",
      oldestAt: "Eng qadimgi tasdiq",
      neverSynced: "Egalik vendor tomonidan hali tasdiqlanmagan",
      unknownGtins: "Katalogdan tashqari GTIN lar"
    },
    tableTitles: {
      code: "Kod",
      gtin: "GTIN",
      packageType: "Qadoqlash",
      status: "Vendordagi holat",
      parentCode: "Ota kod",
      lastSyncedAt: "Egalik holati sanasi"
    },
    statuses: {
      RECEIVED: "Olingan",
      APPLIED: "Tushirilgan",
      INTRODUCED: "Aylanmada",
      WITHDRAWN: "Aylanmadan chiqarilgan",
      WRITTEN_OFF: "Hisobdan chiqarilgan"
    }
  },
  companyImport: {
    title: "ASL Belgisi importi",
    subtitle: "ASL Belgisi'dan tovarlar, buyurtmalar, kodlar va hujjatlarni yuklash",
    start: "Importni boshlash",
    running: "Import bajarilmoqda",
    stageRunning: "Sinxronizatsiya bajarilmoqda",
    busyHint: "Kompaniya importi allaqachon bajarilmoqda - tugashini kuting",
    empty: "Import hali boshlanmagan",
    currentStage: "Bosqich: {{stage}}",
    startedAt: "Boshlangan",
    finishedAt: "Tugagan",
    totals: "{{queued}} dan {{done}} bajarildi",
    done: "{{done}} bajarildi",
    failed: "Xatolar: {{count}}",
    tabs: {
      import: "Import"
    },
    statuses: {
      pending: "Navbatda",
      running: "Bajarilmoqda",
      completed: "Tugagan",
      failed: "Xato"
    },
    stageStatuses: {
      pending: "Navbatda",
      running: "Bajarilmoqda",
      completed: "Tayyor",
      failed: "Xato",
      skipped: "O‘tkazib yuborilgan"
    },
    stages: {
      products: "Tovarlar",
      orders: "Kod buyurtmalari",
      "order-batches": "Buyurtma partiyalari",
      "batch-codes": "Partiya kodlari",
      "owned-codes": "MK ro‘yxati",
      documents: "Hujjatlar"
    },
    stageHints: {
      products: "Kompaniya tovarlar katalogi va uning klassifikatsiyasi",
      orders: "Markirovka kodlari buyurtmalari, partiyalari va kodlari bilan",
      "owned-codes": "Kompaniyaga tegishli kodlar, kontragentlardan olinganlari ham",
      documents: "ASL Belgisi hujjatlar jurnali"
    },
    startStage: {
      products: "Tovarlarni sinxronlash",
      orders: "Buyurtmalarni sinxronlash",
      "owned-codes": "Kodlarni sinxronlash",
      documents: "Hujjatlarni sinxronlash"
    },
    startModal: {
      title: "Importni boshlash",
      hint: "Nimani yuklashni belgilang. Buyurtmalar partiyalari va kodlari bilan yuklanadi.",
      submit: "Boshlash"
    },
    toast: {
      started: "Import boshlandi",
      startError: "Import boshlanmadi"
    },
    errors: {
      load: "Import holatini yuklab bo‘lmadi",
      start: "Importni boshlab bo‘lmadi",
      alreadyRunning: "Kompaniya importi allaqachon bajarilmoqda"
    }
  },
  leads: {
    title: "Arizalar",
    detailsTitle: "Ariza",
    subtitle: "AMIS saytidan kelgan arizalar",
    fields: {
      name: "Ism",
      phone: "Telefon",
      company: "Kompaniya",
      tariff: "Tarif",
      message: "Xabar",
      status: "Holat",
      actions: "Harakatlar",
      comment: "Izoh",
      createdAt: "Yaratildi",
      updatedAt: "Yangilandi",
      statusChangedBy: "Ijrochi",
      statusChangedAt: "Holat o'zgartirildi"
    },
    sections: {
      status: "Holat",
      processing: "Qayta ishlash"
    },
    statuses: {
      new: "Yangi",
      in_progress: "Jarayonda",
      completed: "Yakunlangan",
      rejected: "Rad etilgan"
    },
    modal: {
      detailsAction: "Ko'rish",
      lead: "Ariza",
      changeStatus: "Holatni o'zgartirish",
      commentPlaceholder: "Holat o'zgarishi uchun izoh qo'shing"
    },
    actions: {
      saveStatus: "Holatni saqlash",
      startProgress: "Ishga qabul qilish",
      complete: "Yakunlash",
      reject: "Rad etish"
    },
    messages: {
      statusUpdated: "Ariza holati yangilandi",
      statusUpdateError: "Ariza holatini yangilab bo'lmadi"
    }
  },
  scanner: {
    accepted: "Qabul qilindi",
    rejected: "Rad etildi",
    scan: "Skan qilish",
    latestScans: "So'nggi skanlar",
    empty: "Hali skanlar yo'q",
    placeholder: "Kod skan qilish",
    codeLabel: "Kod",
    reasonLabel: "Sabab",
    startScanning: "Skanlashni boshlash",
    creatingSession: "Sessiya ishga tushmoqda...",
    completingSession: "Sessiya yakunlanmoqda...",
    startCamera: "Kamerani ochish",
    stopCamera: "Kamerani to'xtatish",
    cameraIdle: "Kamerani ochish uchun skanlashni boshlang",
    cameraUnsupported: "Bu qurilmada kamera orqali skanlash qo'llab-quvvatlanmaydi",
    cameraError: "Kameraga ulanib bo'lmadi",
    scanFailed: "Skanlashda xato",
    status: {
      idle: "Kamera ishga tushmagan",
      starting: "Kamera ishga tushmoqda",
      cameraActive: "Kamera ishlayapti",
      detected: "Kod topildi: {{code}}",
      processing: "Qayta ishlanmoqda",
      error: "Skaner xatosi"
    },
    stopScanning: "Skanerlashni tugatish"
  },
  salesOrders: {
    title: "Sotuv buyurtmalari",
    detailsTitle: "Sotuv buyurtmasi",
    create: "Buyurtma yaratish",
    listEmpty: "Buyurtmalar ro'yxati shu yerda bo'ladi",
    sections: {
      company: "Kompaniya",
      customer: "Mijoz",
      contract: "Shartnoma",
      fulfillment: "Bajarish",
      paymentMethod: "To'lov usuli",
      items: "Tovarlar",
      item: "Band",
      comment: "Izoh",
      header: "Sarlavha",
      totals: "Jami",
      related: "Bog'langan obyektlar"
    },
    createSections: {
      sender: "Jo'natuvchi",
      recipient: "Qabul qiluvchi"
    },
    createFields: {
      companyTin: "STIR",
      companyName: "Kompaniya nomi",
      companyAddress: "Kompaniya manzili",
      region: "Viloyat",
      district: "Tuman",
      address: "Manzil",
      expectedDate: "Kutilayotgan sana"
    },
    createPlaceholders: {
      companyTin: "STIR",
      companyName: "Kompaniya nomi",
      companyAddress: "Kompaniya manzili",
      region: "Viloyatni tanlang",
      district: "Tumanni tanlang",
      address: "Manzil",
      location: "Xaritada nuqtani belgilang",
      expectedDate: "Kutilayotgan sana"
    },
    createValidation: {
      companyNameRequired: "Kompaniya nomi majburiy",
      companyAddressRequired: "Kompaniya manzili majburiy",
      regionRequired: "Viloyatni tanlang",
      districtRequired: "Tumanni tanlang",
      addressRequired: "Manzilni kiriting",
      locationRequired: "Xaritada nuqtani belgilang",
      contractDetailsIncomplete: "Jo'natuvchi va mijoz manzilini (viloyat, tuman, manzil va xarita nuqtasi), shartnoma va yetkazib berishni to'ldiring",
      expectedDateRequired: "Kutilayotgan sana majburiy"
    },
    fields: {
      company: "Kompaniya",
      orderNumber: "Buyurtma raqami",
      customerTin: "Mijoz STIR",
      customerName: "Mijoz nomi",
      customerAddress: "Mijoz manzili",
      customerRegion: "Mijoz viloyati",
      customerDistrict: "Mijoz tumani",
      customerLocation: "Mijoz koordinatalari",
      senderAddress: "Jo'natuvchi manzili",
      senderRegion: "Jo'natuvchi viloyati",
      senderDistrict: "Jo'natuvchi tumani",
      senderLocation: "Jo'natuvchi koordinatalari",
      location: "Koordinatalar",
      contractNumber: "Shartnoma raqami",
      contractDate: "Shartnoma sanasi",
      dueDate: "Muddat",
      priority: "Ustuvorlik",
      paymentMethod: "To'lov usuli",
      product: "Mahsulot",
      packageCode: "O'lchov birligi",
      packageCodeShort: "O'lchov",
      quantity: "Miqdor",
      unitPrice: "Birlik narxi",
      price: "Birlik narxi",
      comment: "Izoh",
      status: "Holat",
      createdAt: "Yaratilgan sana",
      updatedAt: "Yangilangan sana",
      createdBy: "Yaratgan",
      updatedBy: "Yangilagan",
      orderedQuantity: "Buyurtma miqdori",
      orderedQuantityShort: "Buyurtma",
      assignedQuantity: "Biriktirilgan miqdor",
      assignedQuantityShort: "Birikt.",
      deliveredQuantity: "Yetkazilgan miqdor",
      deliveredQuantityShort: "Yetkaz.",
      amount: "Summa",
      amountShort: "Summa",
      totalAmount: "Jami summa"
    },
    table: {
      orderNumber: "Raqam",
      customerName: "Mijoz",
      customerTin: "Mijoz STIR",
      dueDate: "Muddat",
      priority: "Ustuvorlik",
      orderedQuantity: "Buyurtma miqdori",
      assignedQuantity: "Biriktirilgan miqdor",
      deliveredQuantity: "Yetkazilgan miqdor",
      status: "Holat",
      createdAt: "Yaratilgan sana"
    },
    placeholders: {
      selectCompany: "Kompaniyani tanlang",
      customerTin: "STIR",
      customerName: "Mijoz nomi",
      contractNumber: "Shartnoma raqami",
      contractDate: "Shartnoma sanasi",
      customerAddress: "Mijoz manzili",
      dueDate: "Muddat",
      quantity: "Miqdor",
      unitPrice: "Birlik narxi",
      itemComment: "Pozitsiya izohi",
      comment: "Izoh (ixtiyoriy)"
    },
    validation: {
      companyRequired: "Kompaniya majburiy",
      customerTinRequired: "STIR majburiy",
      customerTinDigitsOnly: "STIR faqat raqamlardan iborat bo'lishi kerak",
      customerTinLength: "STIR 9 ta raqamdan iborat bo'lishi kerak",
      customerTinInvalid: "To'g'ri STIR kiriting",
      customerCompanyNotFound: "Bu STIR bilan kompaniya topilmadi",
      customerNameRequired: "Ism majburiy",
      dueDateRequired: "Muddat majburiy",
      priorityRequired: "Ustuvorlik majburiy",
      paymentMethodRequired: "To'lov usulini tanlang",
      contractNumberRequired: "Shartnoma raqami majburiy",
      contractDateRequired: "Shartnoma sanasi majburiy",
      itemProductRequired: "Mahsulot majburiy",
      itemPackageRequired: "O'lchov birligini tanlang",
      itemQuantityRequired: "Miqdor majburiy",
      itemUnitPriceRequired: "Birlik narxi majburiy",
      costPerKilometerRequired: "1 km narxi majburiy"
    },
    messages: {
      success: {
        create: "Sotuv buyurtmasi muvaffaqiyatli yaratildi",
        delete: "Sotuv buyurtmasi muvaffaqiyatli o'chirildi"
      }
    },
    deleteQuestion: "Buyurtmani o'chirmoqchimisiz",
    priority: {
      low: "Past",
      normal: "Oddiy",
      high: "Yuqori",
      urgent: "Shoshilinch"
    },
    paymentMethods: {
      cash: "Naqd",
      transfer: "Pul o'tkazish"
    },
    statuses: {
      draft: "Qoralama",
      confirmed: "Tasdiqlangan",
      partially_assigned: "Qisman biriktirilgan",
      assigned: "Biriktirilgan",
      partially_delivered: "Qisman yetkazilgan",
      delivered: "Yetkazilgan",
      cancelled: "Bekor qilingan",
      closed: "Yopilgan"
    },
    actions: {
      addItem: "Pozitsiya qo'shish",
      create: "Buyurtma yaratish"
    },
    details: {
      headerEmpty: "Buyurtma sarlavhasi maydonlari",
      totalsEmpty: "Buyurtma / biriktirilgan / yetkazilgan / summa",
      itemsEmpty: "Tovarlar jadvali",
      relatedEmpty: "Bog'langan reys, vazifa, hisob-faktura"
    }
  },
  vehicles: {
    title: "Transport",
    deleteQuestion: "Transportni o'chirishni xohlaysizmi?",
    fields: {
      name: "Transport nomi",
      plateNumber: "Mashina raqami",
      comment: "Izoh",
      type: "Turi",
      brand: "Marka",
      model: "Model",
      year: "Yil",
      loadCapacityKg: "Yuk ko'tarish, kg",
      volumeCapacityM3: "Hajm, m3",
      vin: "VIN",
      registrationCertificateNumber: "Tex pasport raqami",
      stateRegistrationModel: "Model (davlat reyestri)",
      status: "Holat",
      createdAt: "Yaratildi",
      updatedAt: "Yangilandi",
      ownershipType: "Egalik turi",
      ownerTinOrPinfl: "Egasining INN/PINFL raqami",
      ownerName: "Tashkilot nomi"
    },
    placeholders: {
      name: "Transport nomini kiriting",
      plateNumber: "00 A 000 AA",
      comment: "Izoh qo'shing",
      brand: "Markani kiriting",
      model: "Modelni kiriting",
      vin: "VIN ni kiriting",
      registrationCertificateNumber: "AA 1234567",
      stateRegistrationModel: "Reyestrdan avtomatik to'ldiriladi",
      selectVehicle: "Transportni tanlang",
      ownerTinOrPinfl: "INN (9 raqam) yoki PINFL (14 raqam) kiriting",
      ownerName: "Avtomatik to'ldiriladi"
    },
    ownership: {
      checking: "Mashina raqami davlat reyestrida tekshirilmoqda…",
      notRegistered: "Davlat reyestrida bu mashina raqami bo'yicha yozuv yo'q",
      found: "Egasi davlat reyestrida tasdiqlandi"
    },
    ownershipTypes: {
      owned: "Tashkilot transporti",
      external: "Tashqi egasi"
    },
    ownerLookup: {
      checking: "Tashkilot qidirilmoqda…",
      notFound: "Ushbu INN/PINFL bo'yicha tashkilot topilmadi"
    },
    types: {
      sedan: "Sedan",
      van: "Furgon",
      truck: "Yuk mashinasi",
      semi_truck: "Tyagach",
      pickup: "Pikap",
      other: "Boshqa"
    },
    statuses: {
      active: "Faol",
      maintenance: "Texnik xizmatda",
      out_of_service: "Ishlatilmayapti",
      archived: "Arxivda"
    },
    details: {
      main: "Asosiy ma'lumot",
      characteristics: "Xususiyatlar",
      identification: "Identifikatsiya",
      system: "Tizim ma'lumoti"
    },
    actions: {
      create: "Transport qo'shish"
    },
    modal: {
      create: "Transport qo'shish",
      vehicle: "transport"
    },
    validation: {
      nameRequired: "Transport nomini kiriting",
      typeRequired: "Transport turini tanlang",
      plateNumberRequired: "Mashina raqamini kiriting",
      plateNumberLength: "Raqam probelsiz 8 ta belgidan iborat bo'lishi kerak",
      plateNumberInvalid: "Mashina raqami formatda bo'lishi kerak: 00 A 000 AA yoki 00 000 AAA",
      registrationCertificateNumberInvalid: "Tex pasport raqami AA 1234567 formatida bo'lishi kerak",
      brandRequired: "Markani kiriting",
      modelRequired: "Modelni kiriting",
      ownerTinOrPinflRequired: "Egasining INN yoki PINFL raqamini kiriting",
      ownerTinOrPinflInvalid: "To'g'ri INN (9 raqam) yoki PINFL (14 raqam) kiriting",
      ownerRequired: "Saqlashdan oldin INN/PINFL bo'yicha tashkilotni toping"
    },
    messages: {
      success: {
        create: "Transport yaratildi",
        update: "Transport yangilandi",
        delete: "Transport o'chirildi"
      },
      error: {
        create: "Transportni yaratib bo'lmadi",
        update: "Transportni yangilab bo'lmadi",
        delete: "Transportni o'chirib bo'lmadi",
        load: "Transportni yuklab bo'lmadi",
        verifyOwnership: "Transport egasini tekshirib bo'lmadi"
      }
    }
  },
  deliveryRoutes: {
    returnTable: {
      remaining: "Qoldiq",
      returned: "Qaytarildi"
    },
    loadingWarnings: {
      title: "Ba’zi tovarlar to‘liq yuklanmagan",
      description: "Bu tovarlar uchun yuklangan miqdor rejadan kam. Tugatish uchun sababni ko‘rsating.",
      commentRequired: "Yuklashni tugatishdan oldin kamomad sababini ko‘rsating",
      commentPlaceholder: "Kamomad sababini ko‘rsating",
      forceComplete: "Majburan tugatish",
      scanErrors: "Skanerlash xatolari",
      deleteScanSubtitle: "Reys {{id}} / yukdan o‘chirish uchun kodni skanerlang"
    },
    title: "Reyslar",
    detailsTitle: "Reys",
    loadingTitle: "Yuklash",
    loadingPageTitle: "Reysni yuklash",
    loadingSubtitle: "Reys",
    returnTitle: "Qaytarish",
    returnSubtitle: "Reys",
    listEmpty: "Reyslar ro'yxati shu yerda bo'ladi",
    status: {
      draft: "Qoralama",
      assigned_to_warehouse: "Omborga yuborilgan",
      ready_for_loading: "Yuklashga tayyor",
      loading: "Yuklash",
      loaded: "Yuklangan",
      in_transit: "Yo'lda",
      partially_delivered: "Qisman yetkazilgan",
      delivered: "Yetkazilgan",
      returning: "Qaytarish",
      returned: "Qaytarilgan",
      closed: "Yopilgan",
      cancelled: "Bekor qilingan",
      failed: "Xato"
    },
    sections: {
      info: "Reys ma'lumoti",
      availableOrders: "Mavjud bitimlar",
      preview: "Tanlangan bitimlar ko'rinishi",
      summary: "Xulosa",
      vehicle: "Transport vositasi",
      crew: "Ekipaj",
      totals: "Jami",
      timestamps: "Vaqt belgilari",
      actions: "Harakatlar",
      tasks: "Vazifalar",
      loading: "Yuklash",
      return: "Qaytarish",
      loadingProducts: "Yuklash uchun mahsulotlar"
    },
    vehicleCard: {
      notFound: "Mos transport topilmadi"
    },
    fields: {
      company: "Kompaniya",
      routeNumber: "Reys raqami",
      status: "Holat",
      routeDate: "Reys sanasi",
      vehicleName: "Transport nomini",
      vehicle: "Transport",
      plateNumber: "Mashina raqami",
      driverName: "Haydovchi nomi",
      driver: "Haydovchi",
      agentName: "Agent nomi",
      agent: "Agent",
      comment: "Sharhlar",
      taskCount: "Vazifalar",
      plannedQuantity: "Tovar soni",
      loadedQuantity: "Yuklangan",
      deliveredQuantity: "Yetkazilgan",
      returnedQuantity: "Qaytarilgan",
      registeredAt: "Ro‘yxatga olingan",
      remainingToAssign: "Taqsimlash uchun qoldiq",
      loadingStartedAt: "Yuklash boshlandi",
      loadingCompletedAt: "Yuklash tugadi",
      departedAt: "Yo‘lga chiqdi",
      returnStartedAt: "Qaytarish boshlandi",
      returnCompletedAt: "Qaytarish tugadi",
      closedAt: "Yopildi"
    },
    placeholders: {
      selectCompany: "Kompaniyani tanlang",
      routeDate: "Reys sanasi",
      vehicle: "Transport",
      driver: "Haydovchi",
      agent: "Agent",
      plateNumber: "Mashina raqami"
    },
    validation: {
      companyRequired: "Kompaniya majburiy",
      routeDateRequired: "Reys sanasi majburiy",
      salesOrdersRequired: "Iltimos, kamida bitta sotuv buyurtmasini tanlang",
      plateNumberInvalid: "Mashina raqami formatda bo'lishi kerak: 00 A 000 AA yoki 00 000 AAA"
    },
    messages: {
      success: {
        create: "Reys muvaffaqiyatli yaratildi",
        close: "Reys muvaffaqiyatli yakunlandi",
        scanCode: "{{code}} kodi muvaffaqiyatli qabul qilindi",
        startTransit: "Mashina yo‘lga chiqdi",
        cancelScan: "{{code}} skani o‘chirildi"
      },
      error: {
        create: "Reys yaratishda xatolik",
        close: "Reysni yakunlab bo'lmadi",
        createScanSession: "Skan sessiyasini boshlashda xatolik",
        completeScanSession: "Skan sessiyasini yakunlashda xatolik",
        scanSessionRequired: "Avval skan sessiyasini boshlang",
        scanCode: "Skan kodini qayta ishlashda xatolik",
        scanCodeDetailed: "{{code}} kodi rad etildi: {{reason}}",
        startLoading: "Yuklashni boshlab bo‘lmadi",
        startTransit: "Mashinani yo‘lga chiqarib bo‘lmadi",
        startReturn: "Qaytarishni boshlab bo‘lmadi",
        cancelScan: "Skanni o‘chirib bo‘lmadi",
        completeReturn: "Qaytarishni tugatib bo‘lmadi"
      }
    },
    preview: {
      ordersSelected: "Tanlangan buyurtmalar",
      customersCount: "Mijozlar",
      totalVolume: "Tanlangan tovarlar",
      aggregatedProducts: "Agregatsiya qilingan mahsulotlar",
      routeDate: "Reys sanasi",
      vehicleName: "Transport",
      plateNumber: "Mashina raqami",
      driver: "Haydovchi",
      agent: "Agent",
      company: "Kompaniya",
      selectedOrders: "Tanlangan bitimlar",
      customer: "Mijoz",
      dueDate: "Muddat",
      priority: "Muhimlik",
      orderedQuantity: "Buyurtma qilindi",
      customersList: "Mijozlar",
      dueDates: "Muddatlar",
      priorities: "Muhimliklar",
      totalAmount: "Umumiy summa",
      tin: "STIR",
      address: "Manzil",
      contractNumber: "Shartnoma raqami",
      contractDate: "Shartnoma sanasi",
      unitPrice: "Birlik narxi",
      amount: "Summa",
      comment: "Izoh"
    },
    actions: {
      create: "Reys yaratish",
      openLoading: "Yuklash ekranini ochish",
      openReturn: "Qaytarish ekranini ochish",
      completeLoading: "Yuklashni yakunlash",
      completeReturn: "Qaytarishni yakunlash",
      close: "Reysni yakunlash",
      startTransit: "Yo‘lga chiqarish",
      deleteScan: "O‘chirish",
      deleteByScanning: "Skanerlab o‘chirish"
    },
    details: {
      summaryEmpty: "Jami vazifalar, mijozlar, yuklangan/etkazilgan/qaytarilgan",
      crewEmpty: "Ekipaj belgilanmagan",
      tasksEmpty: "Yetkazib berish vazifalari jadvali",
      loadingEmpty: "Rejalashtirilgan mahsulotlar va skan sessiyasi",
      returnEmpty: "Qolganlar va qaytarish skani"
    },
    taskTable: {
      taskNumber: "Vazifa raqami",
      customer: "Mijoz",
      customerTin: "Mijoz STIR",
      status: "Holat",
      plannedQuantity: "Reja",
      deliveredQuantity: "Yetkazilgan",
      amount: "Summa",
      invoice: "Hisob-faktura",
      comment: "Izoh"
    },
    loadingCounters: {
      planned: "Jami mahsulot",
      loaded: "Yuklangan",
      products: "Mahsulotlar"
    },
    loadingTable: {
      planned: "Rejalashtirilgan",
      loaded: "Yuklangan"
    },
    loadingScannerTitle: "Yuklash skani",
    loadingScannerSubtitle: "Reys {{id}} / {{vehicle}}",
    loadingHelper: "Transportga yuklash uchun kodlarni skan qiling",
    returnScannerTitle: "Qaytarish skani",
    returnScannerSubtitle: "Reys {{id}} / Qolganlar",
    returnHelper: "Qaytarilayotgan mahsulotlarni skan qiling"
  },
  deliveryTasks: {
    table: {
      planned: "Rejalashtirilgan",
      delivered: "Topshirilgan",
      products: "Tovarlar"
    },
    scanner: {
      deleteSubtitle: "Topshirishdan o‘chirish uchun kodni skanerlang"
    },
    warnings: {
      title: "Ba’zi tovarlar to‘liq topshirilmagan",
      description: "Bu tovarlar uchun topshirilgan miqdor rejadan kam. Tugatish uchun kamomad sababini ko‘rsating.",
      commentRequired: "Topshirishni tugatishdan oldin kamomad sababini ko‘rsating",
      commentPlaceholder: "Kamomad sababini ko‘rsating",
      forceComplete: "Majburan tugatish",
      scanErrors: "Skanerlash xatolari"
    },
    messages: {
      success: {
        cancelScan: "{{code}} skani o‘chirildi",
        scanCode: "{{code}} kodi skanerlandi"
      },
      error: {
        startDelivery: "Topshirishni boshlab bo‘lmadi",
        createScanSession: "Skanerlash seansini boshlab bo‘lmadi",
        completeScanSession: "Skanerlash seansini tugatib bo‘lmadi",
        cancelScan: "Skanni o‘chirib bo‘lmadi",
        scanCode: "Skanerlash xatosi",
        scanCodeDetailed: "{{code}} kodi rad etildi: {{reason}}",
        scanSessionRequired: "Avval skanerlash seansini boshlang",
        completeDelivery: "Topshirishni tugatib bo‘lmadi"
      }
    },
    title: "Yetkazib berish vazifalari",
    subtitle: "Mening vazifalarim",
    detailsTitle: "Yetkazib berish vazifasi",
    scanTitle: "Vazifa bo'yicha topshirish",
    scanSubtitle: "Mijoz",
    listEmpty: "Vazifalar ro'yxati shu yerda bo'ladi",
    sections: {
      header: "Sarlavha",
      summary: "Umumiy ma'lumot",
      items: "Rejalashtirilgan tovarlar",
      session: "Yetkazib berish sessiyasi",
      invoice: "Hisob-faktura"
    },
    actions: {
      openScan: "Skan ekranini ochish",
      completeDelivery: "Yetkazib berishni yakunlash",
      startDelivery: "Topshirishni boshlash",
      deleteScan: "O‘chirish",
      deleteByScanning: "Skanerlab o‘chirish"
    },
    details: {
      headerEmpty: "Mijoz, reys, buyurtma, status",
      itemsEmpty: "Rejalashtirilgan / yuklangan / yetkazilgan",
      sessionEmpty: "Skan progress va hisoblagichlar",
      invoiceEmpty: "Hisob-faktura holati va havola"
    },
    scanScannerSubtitle: "Mijoz / Vazifa {{id}}",
    scanHelper: "Tovarlarni yetkazish uchun kodlarni skan qiling"
  },
  invoices: {
    title: "Hisob-fakturalar",
    detailsTitle: "Hisob-faktura",
    listEmpty: "Hisob-fakturalar ro'yxati shu yerda bo'ladi",
    table: {
      invoiceNumber: "Raqam",
      invoiceDate: "Sana",
      sender: "Yuboruvchi",
      receiver: "Qabul qiluvchi",
      amountWithoutVat: "QQSsiz summa",
      itemsQuantity: "Pozitsiyalar",
      unitsQuantity: "Birliklar",
      externalStatus: "Tashqi holat",
      status: "Holat",
      createdAt: "Yaratilgan"
    },
    itemsTable: {
      productName: "Tovar",
      quantity: "Miqdor",
      measurementUnit: "Birlik",
      unitPrice: "Narx",
      amountWithoutVat: "QQSsiz summa",
      taxes: "Soliqlar",
      vatRate: "QQS",
      exciseRate: "Aksiz",
      psic: "IKPU",
      reliefId: "Imtiyoz"
    },
    codes: {
      title: "Markirovka kodlari",
      toggle: "Markirovka kodlarini ko'rsatish",
      showShort: "KMni ko'rsatish",
      hideShort: "KMni yashirish",
      empty: "Markirovka kodlari topilmadi",
      code: "Kod",
      status: "Holat",
      packageType: "Qadoq turi"
    },
    file: {
      download: "Faylni yuklab olish",
      loadError: "Hisob-faktura faylini yuklab bo'lmadi",
      openError: "Faylni yangi oynada ochib bo'lmadi"
    },
    statuses: {
      created: "Yaratilgan",
      in_review: "Tekshiruvda",
      approved: "Tasdiqlangan",
      sent: "Yuborilgan",
      pending: "Kutilmoqda",
      completed: "Yakunlangan",
      rejected: "Rad etilgan",
      canceled: "Bekor qilingan",
      returned: "Qaytarilgan",
      unknown: "Noma'lum",
      registered: "Ro'yxatdan o'tgan",
      deleted: "O'chirilgan"
    },
    externalStatuses: {
      None: "Mavjud emas",
      AwaitContractor: "Kontragent javobi kutilmoqda",
      AwaitAction: "Imzo talab qilinadi",
      Rejected: "Kontragent rad etdi",
      Archived: "E'lon qilingan",
      AwaitAgreement: "Kelishuvda",
      AwaitSign: "Imzolanishda",
      Deleted: "O'chirilgan",
      AwaitThirdSide: "Ishonchli shaxs javobi kutilmoqda",
      ArchiveCancelRequested: "Bekor qilish so'ralgan",
      AwaitCancelArchiveRequest: "Bekor qilish ko'rib chiqilmoqda",
      RejectArchiveCancelRequest: "Bekor qilish rad etildi",
      ArchiveCanceled: "Bekor qilingan",
      AgreementAgreed: "Rozilik tasdiqlandi",
      AgreementReject: "Kelishuv rad etildi",
      SigningSigned: "Imzolangan",
      SigningReject: "Imzolanmagan",
      AwaitDecline: "Rad etish kutilmoqda",
      VerifiedBySystem: "Tizim tomonidan tasdiqlangan",
      AwaitResponsiblePerson: "Mas'ul shaxs javobi kutilmoqda",
      ResponsiblePersonAccepted: "Mas'ul shaxs qabul qildi",
      AwaitResponsiblePersonAccepted: "Mas'ul shaxs qabul qilishi kutilmoqda",
      ResponsiblePersonRejected: "Mas'ul shaxs rad etdi",
      ResponsiblePersonTillReturned: "Mas'ul shaxs qaytardi",
      ResponsiblePersonReturned: "Mas'ul shaxs topshirilgandan keyin qaytardi",
      ReturnAccepted: "Qaytarildi",
      AwaitReturnAccept: "Qaytarishni tasdiqlash kutilmoqda"
    },
    sections: {
      header: "Sarlavha",
      links: "Bog'lanishlar",
      items: "Tovarlar",
      totals: "Jami",
      contract: "Shartnoma",
      file: "Fayl"
    },
    fields: {
      invoiceNumber: "Hisob-faktura raqami",
      invoiceDate: "Hisob-faktura sanasi",
      createdAt: "Yaratilgan",
      currency: "Valyuta",
      internalStatus: "Ichki holat",
      externalStatus: "Tashqi holat",
      amountWithoutVat: "QQSsiz summa",
      itemsQuantity: "Pozitsiyalar",
      unitsQuantity: "Birliklar",
      contractNumber: "Shartnoma raqami",
      contractDate: "Shartnoma sanasi",
      sender: "Yuboruvchi",
      receiver: "Qabul qiluvchi",
      name: "Nomi",
      tin: "STIR",
      companyId: "Kompaniya ID",
      address: "Manzil",
      salesOrderId: "Buyurtma",
      deliveryRouteId: "Reys",
      deliveryTaskId: "Yetkazish vazifasi",
      filename: "Fayl nomi",
      programVersion: "Dastur versiyasi",
      formatVersion: "Format versiyasi",
      comment: "Izoh"
    }
  },
  waybills: {
    units: {
      km: "km"
    },
    title: "TTN",
    detailsTitle: "TTN",
    listEmpty: "TTN ro'yxati shu yerda bo'ladi",
    table: {
      waybillNumber: "Raqam",
      date: "Sana",
      route: "Yo'nalish",
      sender: "Yuboruvchi",
      consignee: "Yuk oluvchi",
      deliveryCost: "Yetkazish narxi",
      grossWeight: "Brutto vazn",
      externalStatus: "Tashqi holat",
      status: "Holat",
      createdAt: "Yaratilgan"
    },
    file: {
      download: "Faylni yuklab olish",
      loadError: "TTN faylini yuklab bo'lmadi",
      openError: "Faylni yangi oynada ochib bo'lmadi"
    },
    send: {
      action: "Faktura.uz ga yuborish",
      success: "Yuk xati yuborishga qoʻyildi",
      error: "Yuk xatini yuborib boʻlmadi"
    },
    statuses: {
      draft: "Qoralama",
      ready: "Tayyor",
      sending: "Yuborilmoqda",
      sent: "Yuborilgan",
      registered: "Ro'yxatdan o'tgan",
      rejected: "Rad etilgan",
      send_failed: "Yuborishda xato",
      cancelled: "Bekor qilingan",
      unknown: "Noma'lum"
    },
    externalStatuses: {
      Sent: "Yuborilgan",
      AwaitCounterparty: "Kontragent kutilmoqda",
      AwaitAction: "Harakat talab qilinadi",
      AwaitAgreement: "Kelishuv kutilmoqda",
      AwaitSign: "Imzo kutilmoqda",
      AwaitThirdSide: "Uchinchi tomon kutilmoqda",
      AwaitResponsiblePerson: "Mas'ul shaxs kutilmoqda",
      AwaitResponsiblePersonAccepted: "Mas'ul shaxs qabul qilishi kutilmoqda",
      Registered: "Ro'yxatdan o'tgan",
      Rejected: "Rad etilgan",
      Cancelled: "Bekor qilingan",
      Returned: "Qaytarilgan",
      Deleted: "O'chirilgan",
      Unknown: "Noma'lum"
    },
    deliveryTypes: {
      warehouse_to_warehouse: "Ombordan omborga",
      seller_to_buyer: "Sotuvchidan xaridorga",
      processing_transfer: "Qayta ishlashga topshirish"
    },
    transportTypes: {
      road: "Avto",
      air: "Avia",
      rail: "Temir yo'l",
      water: "Suv"
    },
    sections: {
      links: "Bog'lanishlar",
      totals: "Jami",
      contract: "Shartnoma",
      file: "Fayl",
      delivery: "Yetkazish",
      transport: "Transport",
      signers: "Imzolovchilar",
      cargoGroups: "Yuk guruhlari",
      overview: "Umumiy",
      parties: "Tomonlar",
      cargo: "Yuk",
      system: "Tizim"
    },
    fields: {
      waybillNumber: "TTN raqami",
      date: "TTN sanasi",
      createdAt: "Yaratilgan",
      updatedAt: "Yangilangan",
      internalStatus: "Ichki holat",
      externalStatus: "Tashqi holat",
      deliveryCost: "Yetkazish narxi",
      grossWeight: "Brutto vazn",
      netWeight: "Netto vazn",
      contractNumber: "Shartnoma raqami",
      contractDate: "Shartnoma sanasi",
      deliveryType: "Yetkazish turi",
      costPerDistanceUnit: "Masofa birligi narxi",
      costPerKilometer: "1 km narxi",
      sum: "so'm",
      totalDistance: "Jami masofa",
      geoDistanceFallbackTooltip: "Yo'nalish mavjud emas, tanlangan nuqtalar orasidagi to'g'ri masofa ko'rsatilgan",
      deliveryTotalCost: "Yetkazishning umumiy narxi",
      totalCost: "Jami narx",
      transportType: "Transport turi",
      driver: "Haydovchi",
      driverPinfl: "Haydovchi PINFL",
      truck: "Yuk mashinasi",
      trailer: "Tirkama",
      sender: "Yuboruvchi",
      consignor: "Yuk jo'natuvchi",
      consignee: "Yuk oluvchi",
      carrier: "Tashuvchi",
      freightForwarder: "Ekspeditor",
      client: "Mijoz",
      payer: "To'lovchi",
      name: "Nomi",
      tin: "STIR",
      tinOrPinfl: "STIR/PINFL",
      vatCode: "QQS kodi",
      branch: "Filial",
      phone: "Telefon",
      address: "Manzil",
      approver: "Tasdiqlovchi",
      director: "Direktor",
      accountant: "Buxgalter",
      responsiblePerson: "Mas'ul shaxs",
      salesOrderId: "Buyurtma",
      deliveryRouteId: "Reys",
      deliveryTaskId: "Yetkazish vazifasi",
      externalId: "Tashqi ID",
      sentAt: "Yuborilgan",
      registeredAt: "Ro'yxatdan o'tgan",
      loadingPoint: "Yuklash joyi",
      unloadingPoint: "Tushirish joyi",
      cargoGroup: "Yuk guruhi",
      cargoGroups: "Yuk guruhlari",
      products: "Tovarlar",
      product: "Tovar",
      quantity: "Miqdor",
      pricePerItem: "Narx",
      productDeliveryCost: "Yetkazish",
      carriages: "Vagonlar"
    }
  },
  users: {
    status: {
      active: "Faol",
      inactive: "Faol emas"
    },
    title: "Foydalanuvchilar",
    subtitle: "Jami",
    logOut: "Chiqish",
    btnAdd: "Foydalanuvchini qoʻshish",
    deleteUserQuestion: "Foydalanuvchini o‘chirishni xohlaysizmi",
    companies: "Foydalanuvchining kompaniyalari",
    messages: {
      success: {
        createUser: "Foydalanuvchi muvaffaqiyatli yaratildi",
        activationEmailSent: "Foydalanuvchi yaratildi — faollashtirish xati yuborildi",
        updateUser: "Foydalanuvchi muvaffaqiyatli yangilandi",
        deleteUser: "Foydalanuvchi muvaffaqiyatli o‘chirildi"
      },
      error: {
        createUser: "Foydalanuvchini yaratishda xatolik",
        updateUser: "Foydalanuvchini yangilashda xatolik",
        deleteUser: "Foydalanuvchini o‘chirishda xatolik",
        loadUsers: "Foydalanuvchilarni qidirishda xatolik",
        loadAccess: "Foydalanuvchi kirishlarini yuklashda xatolik"
      }
    },
    addUserForm: {
      label: {
        firstName: "Ism",
        lastName: "Familiya",
        email: "Elektron pochta",
        role: "Roli",
        pinfl: "JSHSHIR",
        password: "Parol",
        phone: "Telefon",
        lastLoggedInAt: "Oxirgi tizimga kirgan vaqti"
      },
      placeholder: {
        firstName: "Ismni kiriting",
        lastName: "Familiyani kiriting",
        email: "Elektron pochtani kiriting",
        role: "Rolni kiriting",
        pinfl: "JSHSHIRni kiriting",
        password: "Parolni kiriting",
        phone: "Telefon raqamini kiriting"
      },
      required: {
        firstName: "Ismingizni kiriting",
        lastName: "Familiyangizni kiriting",
        phone: "Telefon raqamingizni kiriting",
        email: "Emailingizni kiriting",
        role: "Rolni tanlang",
        password: "Parolni kiriting",
        pinfl: "JSHSHIRni kiriting"
      },
      pattern: {
        phone: "To‘g‘ri telefon raqamini kiriting",
        email: "To‘g‘ri email manzilini kiriting",
        pinfl: "JSHSHIR 14 ta raqamdan iborat bo‘lishi kerak",
        passwordMinLength: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"
      },
      activationHint: "Foydalanuvchi parol o‘rnatish va hisobni faollashtirish uchun xat oladi."
    },
    modalWindow: {
      deletion: "O‘chirish",
      user: "foydalanuvchi",
      editing: "Tahrirlash",
      viewing: "Ko‘rish",
      adding: "Qo‘shish"
    },
    details: {
      title: "Foydalanuvchi",
      profile: "Profil",
      personalData: "Shaxsiy ma'lumotlar",
      accessSummary: "Kirish xulosasi",
      systemAccess: "Tizimga kirish",
      enabled: "Bor",
      notAssigned: "Belgilanmagan",
      noSystemAccess: "Tizimga kirish belgilanmagan",
      noCompanies: "Kompaniyalar belgilanmagan"
    }
  },
  systemEmployees: {
    title: "Xodimlar",
    subtitle: "Takliflar va rollar",
    fields: {
      role: "Rol",
      roles: "Rollar",
      state: "Kirish holati",
      userStatus: "Foydalanuvchi holati",
      existingUser: "Mavjud foydalanuvchi",
      createdAt: "Yaratilgan",
      updatedAt: "Yangilangan",
      invitedBy: "Taklif qilgan"
    },
    states: {
      active: "Faol",
      invited: "Taklif qilingan",
      declined: "Rad etilgan",
      disabled: "O‘chirilgan"
    },
    actions: {
      invite: "Taklif qilish",
      sendInvitation: "Taklif yuborish",
      editRoles: "Tahrirlash",
      saveRoles: "Rollarni saqlash",
      revoke: "Bekor qilish",
      accept: "Qabul qilish",
      decline: "Rad etish"
    },
    placeholders: {
      search: "Ism yoki email bo‘yicha qidirish",
      searchUsers: "Foydalanuvchilarni qidirish",
      selectRoles: "Rollarni tanlang"
    },
    validation: {
      userRequired: "Mavjud foydalanuvchini tanlang",
      rolesRequired: "Kamida bitta rolni tanlang"
    },
    messages: {
      success: {
        invite: "Taklif yuborildi",
        update: "Rollar yangilandi",
        revoke: "Kirish bekor qilindi"
      },
      error: {
        invite: "Taklif yuborilmadi",
        update: "Rollarni yangilab bo‘lmadi",
        revoke: "Kirishni bekor qilib bo‘lmadi"
      }
    },
    modal: {
      inviteTitle: "Xodimni taklif qilish",
      inviteAction: "Taklif",
      detailsAction: "Tizim",
      editAction: "Tahrirlash",
      revokeAction: "Bekor qilish",
      employee: "xodimi",
      systemAccess: "tizim kirishi"
    },
    invitations: {
      title: "Siz AMIS tizimiga taklif qilindingiz",
      rolesPrefix: "quyidagi rollar bilan:"
    },
    revokeQuestion: "Tizim kirishini bekor qilasizmi?"
  },
  companyMemberships: {
    title: "Xodimlar",
    subtitle: "Kompaniya kirishlari va rollari",
    fields: {
      role: "Rol",
      roles: "Rollar",
      state: "Kirish holati",
      userStatus: "Foydalanuvchi holati",
      existingUser: "Mavjud foydalanuvchi",
      createdAt: "Yaratilgan",
      updatedAt: "Yangilangan",
      invitedBy: "Taklif qilgan"
    },
    states: {
      active: "Faol",
      invited: "Taklif qilingan",
      declined: "Rad etilgan",
      disabled: "O‘chirilgan"
    },
    actions: {
      invite: "Taklif qilish",
      sendInvitation: "Taklif yuborish",
      editRoles: "Tahrirlash",
      saveRoles: "Rollarni saqlash",
      revoke: "Bekor qilish",
      accept: "Qabul qilish",
      decline: "Rad etish"
    },
    placeholders: {
      searchUsers: "Foydalanuvchilarni qidirish",
      searchUserByEmail: "Foydalanuvchining to'liq emailini kiriting",
      selectRoles: "Rollarni tanlang"
    },
    validation: {
      userRequired: "Mavjud foydalanuvchini tanlang",
      emailRequired: "Foydalanuvchi emailini kiriting",
      emailInvalid: "To'g'ri email kiriting",
      userNotFound: "Bu email bilan foydalanuvchi topilmadi",
      rolesRequired: "Kamida bitta rolni tanlang"
    },
    messages: {
      success: {
        invite: "Taklif yuborildi",
        update: "Rollar yangilandi",
        revoke: "Kirish bekor qilindi"
      },
      error: {
        invite: "Taklif yuborilmadi",
        update: "Rollarni yangilab bo‘lmadi",
        revoke: "Kirishni bekor qilib bo‘lmadi"
      }
    },
    modal: {
      inviteTitle: "Xodimni taklif qilish",
      detailsAction: "Kompaniya",
      editAction: "Tahrirlash",
      revokeAction: "Bekor qilish",
      member: "xodim",
      companyAccess: "kompaniya kirishi"
    },
    invitations: {
      title: "Siz kompaniyaga taklif qilindingiz",
      rolesPrefix: "quyidagi rollar bilan:"
    },
    revokeQuestion: "Kompaniya kirishini bekor qilasizmi?"
  },
  organizations: {
    name: "Nomi",
    testFlag: "Sinov",
    title: "Tashkilotlar",
    edit: "Tashkilotni o'zgartirish",
    subtitle: "Jami",
    btnAdd: "Tashkilot qo‘shish",
    status: "Holat",
    assignToCompany: "Kompaniyaga biriktirish",
    deleteUserQuestion: "Tashkilotni o‘chirib tashlashni xohlaysizmi?",
    actions: {
      activate: "Faollashtirish"
    },
    integrations: {
      receivedData: "Olingan ma'lumotlar",
      notConfigured: "Sozlanmagan",
      steps: {
        company: "Kompaniya",
        xTrace: "X-Trace",
        fakturaUz: "Faktura.uz"
      },
      xTrace: {
        title: "X-Trace integratsiyasi",
        cardTitle: "X-Trace"
      },
      fakturaUz: {
        title: "Faktura.uz integratsiyasi",
        cardTitle: "Faktura.uz",
        username: "Login",
        password: "Parol",
        clientId: "Client ID",
        clientSecret: "Client secret",
        validation: {
          username: "Loginni kiriting",
          password: "Parolni kiriting",
          clientId: "Client ID ni kiriting",
          clientSecret: "Client secret ni kiriting"
        }
      }
    },
    messages: {
      success: {
        createUser: "Tashkilot muvaffaqiyatli yaratildi",
        activateCompany: "Kompaniya faollashtirildi",
        createXTraceIntegration: "X-Trace integratsiyasi yaratildi",
        createFakturaUzIntegration: "Faktura.uz integratsiyasi yaratildi",
        updateUser: "Tashkilot muvaffaqiyatli yangilandi",
        deleteUser: "Tashkilot muvaffaqiyatli o‘chirildi",
        assignOrganization: "Foydalanuvchi muvaffaqiyatli kompaniyaga biriktirildi",
        unassignOrganization: "Foydalanuvchi muvaffaqiyatli kompaniyadan ajratildi"
      },
      error: {
        createUser: "Tashkilotni yaratishda xatolik",
        activateCompany: "Kompaniyani faollashtirishda xatolik",
        createXTraceIntegration: "X-Trace integratsiyasini yaratishda xatolik",
        createFakturaUzIntegration: "Faktura.uz integratsiyasini yaratishda xatolik",
        updateUser: "Tashkilotni yangilashda xatolik",
        deleteUser: "Tashkilotni o‘chirishda xatolik",
        unassignOrganization: "Foydalanuvchini kompaniyadan ajratishda xatolik"
      }
    },
    addUserForm: {
      label: {
        companyName: "Kompaniya nomi",
        name: "Ism",
        companyType: "Kompaniya turi",
        displayName: "Ko‘rsatiladigan nom",
        productGroup: "Tovar guruhlari",
        tin: "STIR",
        pinfl: "JSHSHIR",
        vatCode: "QQS kodi",
        createdAt: "Yaratilgan",
        legalName: "Tashkilotning yuridik nomi",
        director: "Direktor",
        accountant: "Buxgalter",
        region: "Hudud",
        district: "Tuman",
        address: "Manzil",
        bankName: "Xizmat ko‘rsatuvchi bank",
        ccea: "OKED",
        account: "Hisob raqami",
        mfo: "MFO",
        phone: "Telefon",
        email: "Elektron pochta",
        url: "Veb-sayt",
        person: "Aloqa shaxsi",
        gcpCode: "GCP kodi",
        omsId: "OMSID",
        turonToken: "Turon token",
        status: "Holat",
        deleted: "O‘chirildi",
        xTraceToken: "X-Trace tokeni",
        expireDate: "Token muddati tugash sanasi",
        businessPlaceId: "FAOJ identifikatori"
      },
      placeholder: {
        businessPlaceId: "FAOJ identifikatori kirirting",
        companyName: "Kompaniya nomi kirirting",
        companyType: "Kompaniya turini kiriting",
        displayName: "Ko‘rsatiladigan nomni kiriting",
        productGroup: "Mahsulot guruhini kiriting",
        tin: "STIR ni kiriting",
        legalName: "Yuridik nomni kiriting",
        director: "Direktor ma’lumotlarini kiriting",
        region: "Hududni kiriting",
        district: "Tumanni kiriting",
        address: "Manzilni kiriting",
        bankName: "Xizmat ko‘rsatuvchi bankni kiriting",
        ccea: "OKED ni kiriting",
        account: "Hisob raqamini kiriting",
        mfo: "MFO ni kiriting",
        phone: "Telefon raqamini kiriting",
        email: "Elektron pochtani kiriting",
        url: "Veb-saytni kiriting",
        person: "Aloqa shaxsini kiriting",
        gcpCode: "GCP kodini kiriting",
        omsId: "OMSID ni kiriting",
        turonToken: "Turon tokenni kiriting",
        enterXTraceToken: "X-Trace tokeningizni kiriting"
      },
      validation: {
        xTrace: {
          invalidToken: "X-Trace token noto‘g‘ri",
          noToken: "Token taqdim etilmadi"
        },
        required: {
          tin: "STIR 9 ta raqamdan iborat bo‘lishi kerak",
          productGroup: "Iltimos, mahsulot guruhi nomini kiriting",
          companyType: "Iltimos, kompaniya turini tanlang",
          displayName: "Iltimos, kompaniya nomini kiriting",
          legalName: "Iltimos, kompaniyaning yuridik nomini kiriting",
          director: "Iltimos, direktor ismini kiriting",
          region: "Iltimos, mintaqani kiriting",
          district: "Iltimos, tumanni kiriting",
          address: "Iltimos, manzilni kiriting",
          bankName: "Iltimos, bank nomini kiriting",
          ccea: "Iltimos, hisob raqamini kiriting",
          account: "Iltimos, hisob raqamini kiriting",
          mfo: "Iltimos, bank MFO kodini kiriting",
          phone: "Iltimos, telefon raqamini kiriting",
          email: "Iltimos, email kiriting",
          url: "Iltimos, URL kiriting",
          person: "Iltimos, kontakt shaxsini kiriting",
          gcpCode: "Iltimos, GCP kodini kiriting",
          omsId: "Iltimos, OMS ID kiriting",
          turonToken: "Iltimos, Turon Token kiriting",
          gtin: "GTIN majburiy",
          token: "Tokenni kiriting",
          businessPlaceId: "Savdo nuqtasi identifikatorini kiriting"
        },
        pattern: {
          tin: "Iltimos, STIR kiriting",
          ccea: "Hisob raqami 20 ta raqamdan iborat bo‘lishi kerak",
          account: "Hisob raqami 20 ta raqamdan iborat bo‘lishi kerak",
          mfo: "Bank MFO kodi 5 ta raqamdan iborat bo‘lishi kerak",
          phone: "Telefon raqami +998XXXXXXXXX formatida bo‘lishi kerak",
          email: "To‘g‘ri email kiriting",
          url: "To‘g‘ri URL kiriting (masalan, https://example.com)",
          gcpCode: "GCP kodi kamida 3 ta belgidan iborat bo‘lishi kerak",
          omsId: "OMS ID kamida 3 ta belgidan iborat bo‘lishi kerak",
          turonToken: "Turon Token kamida 5 ta belgidan iborat bo‘lishi kerak",
          passwordMinLength: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak",
          gtin: "To‘g‘ri GTIN kiriting (14 raqam)"
        }
      }
    },
    subtitles: {
      address: "Manzil:",
      bankDetails: "Bank rekvizitlari:",
      contactDetails: "Aloqa ma’lumotlari:",
      legalName: "Yuridik nomi: ",
      name: "Nomi: "
    },
    modalWindow: {
      deletion: "O‘chirish",
      organization: "tashkilot",
      editing: "Tahrirlash",
      viewing: "Ko‘rish",
      adding: "Qo‘shish"
    }
  },
  products: {
    title: "Mahsulotlar",
    subtitle: "Jami",
    btnAdd: "Mahsulot qo‘shish",
    status: "Holat",
    view: "Mahsulotni ko‘rish",
    edit: "Mahsulotni tahrirlash",
    deleteUserQuestion: "Mahsulotni o‘chirib tashlashni xohlaysizmi?",
    messages: {
      success: {
        createProduct: "Mahsulot muvaffaqiyatli yaratildi",
        updateProduct: "Mahsulot muvaffaqiyatli yangilandi",
        deleteProduct: "Mahsulot muvaffaqiyatli o‘chirildi"
      },
      error: {
        createProduct: "Mahsulotni yaratishda xatolik",
        updateProduct: "Mahsulotni yangilashda xatolik",
        deleteProduct: "Mahsulotni o‘chirishda xatolik",
        invalidExpiration: "Yaroqlilik muddati 2 raqamdan oshmagan butun son bo‘lishi kerak"
      }
    },
    gtin: {
      unit: "GTIN iste’molchi qadoqlanishi",
      group: "GTIN guruhli qadoqlanish",
      box_lv_1: "GTIN quti",
      box_lv_2: "GTIN palleta"
    },
    classification: {
      title: "Klassifikatsiya",
      icps: "IKPU",
      name: "Nomi",
      source: "Manba",
      resolvedAt: "Aniqlangan sana",
      empty: "Hali klassifikatsiya qilinmagan"
    },
    validation: {
      required: "Ushbu maydon to‘ldirilishi shart",
      min2: "Minimal uzunlik — 2 ta belgi",
      max10: "Eng ko‘p uzunlik — 10 ta belgi",
      max200: "Eng ko‘p uzunlik — 200 ta belgi",
      number: "To‘g‘ri raqam kiriting",
      decimal: "To‘g‘ri raqam kiriting (butun yoki o‘nlik)",
      icps: "To‘g‘ri IKPU kiriting (14 raqam)",
      price: "To‘g‘ri narx kiriting"
    },
    addProductForm: {
      label: {
        name: "Nomi",
        shortName: "Qisqa nomi",
        description: "Tavsif",
        gtin: "GTIN",
        barcode: "Shtrix-kod",
        icps: "IKPU",
        brand: "Brend",
        productType: "Mahsulot turi",
        aggregationQuantity: "Agregatsiya miqdori",
        expiration: "Yaroqlilik muddati (kunlarda)",
        unit: "O‘lchov birligi",
        amount: "Miqdor",
        net: "Sof og‘irlik",
        gross: "Brutto og‘irlik",
        price: "Narx",
        companyId: "Kompaniya ID",
        manufacturerCountry: "Ishlab chiqarilgan mamlakat"
      },
      placeholder: {
        name: "Nomini kiriting",
        shortName: "Qisqa nomini kiriting",
        description: "Tavsif kiriting",
        gtin: "GTIN kiriting",
        barcode: "Shtrix-kodni kiriting",
        icps: "IKPU kiriting",
        productType: "Mahsulot turini kiriting",
        aggregationQuantity: "Agregatsiya miqdorini kiriting",
        expiration: "Yaroqlilik muddatini kiriting",
        unit: "O‘lchov birligini kiriting",
        amount: "Miqdor kiriting",
        net: "Sof og‘irlikni kiriting",
        gross: "Brutto og‘irlikni kiriting",
        price: "Narxni kiriting",
        companyId: "Kompaniya ID ni kiriting",
        manufacturerCountry: "Mamlakatlarni qidirish"
      },
      validation: {
        required: {
          gtin: "GTIN majburiy",
          barcode: "Shtrix-kod majburiy",
          icps: "ICPS majburiy",
          productType: "Mahsulot turi majburiy",
          aggregationQuantity: "Agregatsiya miqdori majburiy",
          expiration: "Yaroqlilik muddati majburiy",
          measurementUnit: "O‘lchov birligi majburiy",
          measurementAmount: "Miqdor majburiy",
          weightNet: "Sof vazn majburiy",
          name: "Mahsulot nomi majburiy",
          shortName: "Mahsulotning qisqa nomi majburiy",
          manufacturerCountry: "Mamlakatni tanlang",
          requiredField: "Ushbu maydon toʻldirilishi shart"
        },
        pattern: {
          gtin: "To‘g‘ri GTIN kiriting (14 raqam)",
          barcode: "To‘g‘ri shtrix-kod kiriting (8 dan 14 gacha raqam)",
          icps: "To‘g‘ri ICPS kiriting (14 raqam)",
          aggregationQuantity: "To‘g‘ri raqam kiriting",
          expiration: "To‘g‘ri raqam kiriting",
          measurementUnit: "Eng ko‘p uzunlik — 10 ta belgi",
          measurementAmount: "To‘g‘ri raqam kiriting (butun yoki o‘nlik)",
          weightNet: "To‘g‘ri raqam kiriting (butun yoki o‘nlik)"
        }
      }
    },
    details: {
      main: "Asosiy maʼlumot",
      gtin: "GTIN kodlari",
      measurement: "O‘lchov va og‘irlik",
      description: "Tavsif",
      packages: "Qadoqlar"
    },
    packages: {
      empty: "Ushbu mahsulot uchun qadoqlar topilmadi",
      fields: {
        code: "Kod",
        type: "Turi",
        name: "Nomi"
      },
      messages: {
        error: "Mahsulot qadoqlarini yuklab bo‘lmadi"
      }
    },
    modalWindow: {
      deletion: "O‘chirish",
      product: "mahsulot",
      editing: "Tahrirlash",
      viewing: "Ko‘rish",
      adding: "Qo‘shish"
    }
  },
  login: {
    messages: {
      successLogin: "Muvaffaqiyatli kirish",
      errorLogin: "Kirishda xatolik, login va parolni tekshiring"
    },
    btn: {
      login: "Kirish",
      signIn: "Kirish"
    },
    enterUserName: "Login kiriting",
    username: "Login"
  },
  auth: {
    backToLogin: "Kirishga qaytish",
    goToLogin: "Kirishga o‘tish",
    errors: {
      missingToken: "Havolada token yo‘q. Xatdagi havolani qaytadan oching."
    },
    register: {
      title: "Hisob yaratish",
      submit: "Ro‘yxatdan o‘tish",
      noAccount: "Hisobingiz yo‘qmi?",
      haveAccount: "Hisobingiz bormi?",
      messages: {
        error: "Ro‘yxatdan o‘tib bo‘lmadi. Qayta urinib ko‘ring."
      },
      checkInbox: {
        title: "Pochtangizni tekshiring",
        intro: "Tasdiqlash havolasini shu manzilga yubordik:",
        hint: "Emailni tasdiqlash uchun uni oching, so‘ng tizimga kiring."
      }
    },
    verifyEmail: {
      title: "Emailni tasdiqlash",
      loading: "Emailingiz tasdiqlanmoqda…",
      error: "Emailni tasdiqlab bo‘lmadi.",
      errorTitle: "Tasdiqlash amalga oshmadi",
      successTitle: "Email tasdiqlandi",
      successDescription: "Emailingiz tasdiqlandi. Endi tizimga kirishingiz mumkin."
    },
    activate: {
      title: "Parol o‘rnating",
      subtitle: "Hisobingizni faollashtirish uchun parol yarating.",
      submit: "Hisobni faollashtirish",
      error: "Hisobni faollashtirib bo‘lmadi.",
      errorTitle: "Faollashtirish amalga oshmadi",
      successTitle: "Hisob faollashtirildi",
      successDescription: "Parol o‘rnatildi va email tasdiqlandi. Endi tizimga kirishingiz mumkin.",
      passwordsDontMatch: "Parollar mos kelmadi.",
      label: {
        password: "Parol",
        confirmPassword: "Parolni tasdiqlash"
      },
      placeholder: {
        confirmPassword: "Parolni takrorlang"
      },
      required: {
        confirmPassword: "Parolni tasdiqlang"
      }
    },
    passwordMinLength: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
    forgotPassword: {
      link: "Parolni unutdingizmi?",
      title: "Parolni tiklash",
      subtitle: "Email manzilingizni kiriting — tiklash havolasini yuboramiz.",
      submit: "Havola yuborish",
      emailLabel: "Email",
      checkInbox: {
        title: "Pochtangizni tekshiring",
        intro: "Agar bu manzil uchun hisob mavjud bo‘lsa, parolni tiklash havolasini shu manzilga yubordik:",
        hint: "Yangi parol o‘rnatish uchun havolani oching. Xat kelmasa, «Spam» jildini tekshiring."
      }
    },
    resetPassword: {
      title: "Yangi parol",
      subtitle: "Hisobingiz uchun yangi parol tanlang.",
      submit: "Parolni tiklash",
      successTitle: "Parol yangilandi",
      successDescription: "Parolingiz o‘zgartirildi. Endi tizimga kirishingiz mumkin.",
      errorTitle: "Parolni tiklab bo‘lmadi",
      error: "Parolni tiklab bo‘lmadi.",
      passwordsDontMatch: "Parollar mos kelmadi.",
      label: {
        password: "Yangi parol",
        confirmPassword: "Parolni tasdiqlash"
      },
      placeholder: {
        password: "Yangi parolni kiriting",
        confirmPassword: "Parolni takrorlang"
      },
      required: {
        confirmPassword: "Parolni tasdiqlang"
      }
    }
  },
  me: {
    title: "Mening profilim",
    loadError: "Profilni yuklab bo‘lmadi.",
    changePassword: "Parolni o‘zgartirish"
  },
  changePwd: {
    title: "Parolni o‘zgartirish",
    confirmModal: {
      title: "Parolni o‘zgartirishni xohlaysizmi?",
      subtitle: "O‘zgarishni tasdiqlash uchun joriy parolni kiriting.",
      btn: {
        confirm: "Tasdiqlash",
        cancel: "Bekor qilish"
      }
    },
    changePasswordForm: {
      message: {
        passwordsDontMatch: "Parollar mos kelmaydi.",
        error: "Parolni o‘zgartirishda xatolik",
        success: "Parol muvaffaqiyatli o‘zgartirildi"
      },
      label: {
        currentPassword: "Joriy parol",
        newPassword: "Yangi parol",
        newPasswordConfirmation: "Yangi parolni tasdiqlash"
      },
      placeholder: {
        currentPassword: "Joriy parolni kiriting",
        newPassword: "Yangi parolni kiriting",
        newPasswordConfirmation: "Yangi parolni tasdiqlang"
      },
      required: {
        currentPassword: "Joriy parolni kiriting",
        newPasswordRequired: "Yangi parolni kiriting",
        newPassword: "Parol kamida 6 ta belgidan iborat bo‘lishi kerak."
      }
    }
  },
  auditLog: {
    title: "Tizim jurnallari",
    subtitle: "Foydalanuvchi faolligini kuzatish va tahlil qilish",
    ip: "IP manzil",
    id: "So‘rov ID",
    committed: "Amalni bajargan",
    target: "Harakat maqsadi"
  },
  markingCodes: {
    title: "KM buyurtmasi",
    subtitle: "Jami",
    order: "Buyurtma berish",
    independently: "Mustaqil ravishda",
    byOperator: "Operator tomonidan",
    markingCodes: "Markirovka kodlari",
    backToOrders: "Buyurtmalarga qaytish",
    backToBatches: "Partiyalarga qaytish",
    orderNumber: "Buyurtma",
    applyAll: {
      confirmApplyAll: "Barcha {{count}} ta partiya uchun qo‘llash hisobotlarini yaratishni tasdiqlaysizmi?",
      applyAllPartialError: "{{error}} ta hisobotni yaratib bo‘lmadi",
      noBatchesToApply: "Qo‘llash uchun partiyalar mavjud emas",
      unexpectedError: "Kutilmagan xatolik yuz berdi"
    },
    utilization: {
      createdOne: "{{number}} qo‘llash hisoboti yaratildi",
      createdMany: "Yaratilgan qo‘llash hisobotlari: {{count}}"
    },
    orderProduct: {
      markingCodesStatus: {
        received: "Qabul qilingan",
        applied: "Belgilangan",
        introduced: "Muomalada",
        withdrawn: "Muomaladan chiqarilgan",
        aggregated: "Agregatsiyalangan",
        reserved_for_aggregation: "Agregatsiya uchun zahiralangan",
        written_off: "Hisobdan chiqarilgan",
        reserved_for_delivery: "Yetkazib berish uchun zahiralangan",
        loaded: "Yuklangan",
        in_transit: "Yo‘lda",
        delivered: "Yetkazib berilgan"
      }
    },
    batches: {
      title: "Partiyalar",
      orderNumber: "Buyurtma raqami",
      orderTime: "Buyurtma vaqti",
      orderStatus: "Buyurtma holati",
      turonOrderID: "Turon buyurtma ID",
      sections: {
        product: "Mahsulot va partiya maʼlumotlari",
        order: "Buyurtma maʼlumotlari",
        batchStatus: "Partiya holatlari",
        orderStatus: "Buyurtma holatlari"
      },
      batchData: {
        batchNumber: "Partiya raqami",
        packagingType: "Qadoqlash turi",
        orderNumber: "Buyurtma raqami",
        executor: "Ijrochi",
        productName: "Mahsulot nomi",
        gtin: "GTIN",
        orderTime: "Buyurtma vaqti",
        numberOfMarkingCodes: "Markirovka kodlari soni",
        turonOrderID: "Turon buyurtma ID",
        batchStatus: "Partiya holati",
        orderStatus: "Buyurtma holati",
        turonOrderStatus: "Turon buyurtma holati",
        batchStatusInTuron: "Turondagi partiya holati",
        order: {

        }
      }
    },
    tableTitles: {
      number: "№",
      products: "Mahsulotlar",
      comments: "Mahsulot nomi",
      markingCodesQuantity: "KM soni",
      turonBatchID: "Turon partiya ID",
      creationDate: "Yaratilgan sana",
      turonMessage: "Turondan xabar",
      orderNumber: "Buyurtma",
      productName: "Mahsulot nomi",
      totalQuantity: "Miqdor",
      externalStatus: "Tashqi holat",
      orderedMCQuantity: "Buyurtma qilingan KM soni",
      codesHaveBeenExported: "Eksport qilindi",
      orderDate: "Buyurtma sanasi",
      packageType: "Qadoqlash",
      paymentType: "Toʻlov turi",
      status: "Holat",
      paid: "Toʻlangan",
      unPaid: "Toʻlanmagan",
      batchNumber: "Partiya",
      gtin: "GTIN",
      numberOfMarkingCodes: "Belgilash kodlari soni",
      code: "Code"
    },
    orderCreation: {
      title: "Buyurtma yaratish",
      product: "Mahsulot",
      packagingType: "Qadoq turi",
      quantity: "Miqdor",
      serialNumberGenerationMethod: "Generatsiya usuli",
      selfGenerated: "O‘z-o‘zi yaratilgan",
      byOperator: "Operator tomonidan",
      submitOrder: "Buyurtmani yuborish",
      orderHasBeenSuccessfullyCreated: "Buyurtma muvaffaqiyatli yaratildi",
      failedToCreateOrder: "Buyurtma yaratishda xatolik",
      differentProductsWarning: "E’tibor bering, siz turli mahsulot nomlarini tanladingiz"
    },
    label: {
      chooseProduct: "Mahsulotni tanlang",
      choosePackageType: "Qadoq turini tanlang",
      enterQuantity: "Miqdor kiriting",
      chooseGenerationMethod: "Generatsiya usuli",
      duplicatePackageType: "Bu qadoq turi ushbu mahsulot uchun allaqachon tanlangan"
    },
    packageType: {
      unit: "Iste’molchi",
      group: "Guruhli",
      box_lv_1: "Quti",
      box_lv_2: "Palleta"
    }
  },
  customsCodes: {
    title: "AIK",
    subtitle: "Agregatsiyalangan import kodlarini yaratish va ro‘yxatdan o‘tkazish",
    table: {
      number: "№",
      accOrderNumber: "AIK buyurtmasi",
      product: "Mahsulot",
      customsCode: "AIK",
      quantity: "Miqdor",
      measurement: "O‘lchov birligi",
      document: "Hujjat",
      status: "Holat"
    },
    actions: {
      create: "AIK yaratish",
      creating: "Yaratilmoqda",
      dissolve: "Tarqatish",
      sign: "Imzolash",
      signing: "Imzolanmoqda",
      signAndSend: "Imzolash va yuborish",
      resume: "Qayta urinish"
    },
    messages: {
      createSuccess: "AIK buyurtmasi yaratildi.",
      createError: "AIK buyurtmasini yaratib bo‘lmadi.",
      loadError: "AIK buyurtmalarini yuklab bo‘lmadi",
      documentMissing: "Backend imzolash uchun hujjat qaytarmadi.",
      selectKey: "E-IMZO kalitini tanlang.",
      signSuccess: "Hujjat imzolandi va tekshiruvga yuborildi.",
      signError: "Hujjatni imzolab bo‘lmadi",
      dissolutionInitiated: "Tarqatish boshlandi.",
      dissolutionError: "Tarqatishni boshlab bo‘lmadi.",
      documentPending: "Imzolash uchun hujjat hali tayyor emas. Holat «Imzolashga tayyor» bo‘lganda buyurtmani oching.",
      resumeStarted: "Ishlov berish qaytadan boshlandi.",
      resumeError: "Ishlov berishni qaytadan boshlab bo‘lmadi."
    },
    eImzoErrors: {
      noDescription: "E-IMZO xato tavsifini qaytarmadi.",
      keyNotFound: "Kalit topilmadi. Kalit fayli DSKEYS papkasida ekanini tekshiring.",
      badPassword: "Kalit paroli noto‘g‘ri.",
      notResponding: "E-IMZO javob bermayapti. Qayta urinib ko‘ring.",
      unavailable: "E-IMZO ishlamayapti. e-imzo.exe ni ishga tushirib, qayta urinib ko‘ring.",
      connectionClosed: "E-IMZO bilan ulanish yopildi. e-imzo.exe ni ishga tushirib, qayta urinib ko‘ring.",
      keyIdMissing: "E-IMZO kalit identifikatorini qaytarmadi.",
      signedDocumentMissing: "E-IMZO imzolangan hujjatni qaytarmadi.",
      certificateDateMissing: "Sertifikat amal qilish muddatini tekshirib bo‘lmadi. Boshqa kalitni tanlang yoki E-IMZO ni qayta ishga tushiring.",
      certificateNotYetValid: "Tanlangan sertifikat hali faol emas.",
      certificateExpired: "Tanlangan sertifikat muddati tugagan. Faol kalitni tanlang.",
      certificateInactive: "Tanlangan sertifikat faol emas yoki bekor qilingan. Faol kalitni tanlang.",
      certificateInvalid: "Tanlangan sertifikat yaroqsiz. Boshqa kalitni tanlang."
    },
    signModal: {
      title: "AIK imzolash",
      registrationTitle: "AIK imzolash",
      dissolutionTitle: "AIK tarqatishni imzolash",
      hint: "Imzolashdan oldin e-imzo.exe ni ishga tushiring va kalitni DSKEYS papkasiga joylang.",
      openApp: "E-IMZO ni ochish",
      openAppHint: "Brauzer ruxsat so‘rasa, E-IMZO ni ochishga ruxsat bering va bir necha soniya kuting.",
      document: "Hujjat",
      selectKey: "E-IMZO kalitini tanlang",
      keysNotFound: "Kalitlar topilmadi"
    },
    createModal: {
      title: "AIK yaratish",
      hint: "Foydalanilgan partiyani tanlang. Yaratilgandan keyin backend AIK ni generatsiya qiladi va imzolash uchun hujjatni avtomatik tayyorlaydi.",
      selectBatch: "Partiyani tanlang",
      selectProduct: "Mahsulot bo‘yicha filtr",
      productsNotFound: "Mahsulotlar topilmadi",
      batchesNotFound: "Mos partiyalar topilmadi"
    },
    details: {
      title: "AIK buyurtmasi tafsilotlari",
      loadError: "AIK buyurtmasi tafsilotlarini yuklab bo'lmadi",
      sections: {
        general: "Umumiy ma'lumot",
        documents: "Hujjatlar",
        processing: "Ishlov berish"
      },
      fields: {
        orderId: "Buyurtma ID",
        batchId: "Partiya ID",
        productId: "Mahsulot ID",
        createdBy: "Yaratdi",
        registrationDocument: "Ro'yxatga olish hujjati",
        dissolutionDocument: "Tarqatish hujjati",
        processingStep: "Ishlov berish qadami",
        processingAttempts: "Urinishlar",
        notGenerated: "Shakllantirilmagan",
        processingStalled: "Ishlov berish to‘xtadi: vazifa urinishlarini tugatdi va ko‘rib chiqishni kutadi. Qadamni qaytadan ishga tushirish uchun «Qayta urinish» ni bosing."
      }
    }
  },
  aggregations: {
    title: "Agregatsiya hisobotlari",
    btnAdd: "Agregatsiya kodini qo'shish",
    addAggregation: "Hisobot yaratish",
    exportGrouped: "Guruhlanganlarni eksport qilish",
    exportUnit: "Yakka birliklarni eksport qilish",
    messages: {
      createSuccess: "Agregatsiya hisoboti muvaffaqiyatli yaratildi.",
      createError: "Agregatsiya hisobotini yaratib bo‘lmadi."
    },
    aggregationsTableTitle: {
      status: "Holati",
      orderDate: "Buyurtma sanasi",
      quantityPerPackage: "Qadoqdagi miqdor",
      numberOfPackages: "Qadoqlar soni",
      productName: "Mahsulot nomi",
      childBatch: "Quyi partiya",
      parentBatch: "Asosiy partiya",
      aggregationReportNumber: "Agregatsiya hisobot raqami"
    },
    addAggregationFields: {
      parentBatch: "Asosiy partiya",
      childBatch: "Farzand partiya",
      packagingDate: "Qadoqlash sanasi"
    },
    agregationReportPage: {
      productName: "Mahsulot nomi",
      parentCode: "Asosiy kod",
      orders: "Buyurtmalar",
      codeNumber: "Kod raqami",
      code: "Kod",
      batches: "Partiyalar",
      aggregation: "Agregatsiya",
      aggregations: "Agregatsiya",
      quantityPerPackage: "Har paketdagi miqdor",
      aggregationQuantity: "Agregatsiya miqdori",
      productionOrderNumber: "Ishlab chiqarish buyurtmasi raqami",
      parentOrderNumber: "Asosiy buyurtma raqami",
      childOrderNumber: "Qaram buyurtma raqami",
      parentBatchNumber: "Asosiy partiya raqami",
      childBatchNumber: "Qaram partiya raqami"
    }
  }
};

export default uz;


