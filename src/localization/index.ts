import { PiPlaceholder } from "react-icons/pi";

export const resources = {
    en:{
        translation:{
            sessionEndsIn: 'Session ends in',
            search: {
                byName: 'Search by name',
                byOrganization: 'Search by organization'
            },
            btn: {
                create: 'Create',
                edit: 'Edit',
                delete: 'Delete',
                cancel: 'Cancel',
                save: 'Save',
                back: 'Back'
            },
            navigation: {
                products: "Products",
                management: "Management",
                organization: "Organization",
                users: "Users",
            },
            users: {
                userRole: {
                    superadmin: "Superadmin",
                    admin: "Admin",
                    operator: "Operator"
                },
                status: {
                    active: "Active",
                    inactive: "Inactive"
                },
                title: "Users",
                subtitle: 'Total',
                btnAdd: 'Add user',
                logOut: "Log out",
                companies: "User's companies",
                deleteUserQuestion: 'Are you sure you want to delete the user',
                messages: {
                    success: {
                        createUser: "User created successfully",
                        updateUser: "User updated successfully",
                        deleteUser: "User deleted successfully"
                    },
                    error: {
                        createUser: "Error creating user",
                        updateUser: "Error updating user",
                        deleteUser: "Error deleting user"
                    },
                },
                addUserForm: {
                    label: {
                        firstName: 'First Name',
                        lastName: 'Last Name',
                        email: 'Email',
                        role: 'Role',
                        password: 'Password',
                        phone: 'Phone',
                        lastLoggedInAt: 'Last logged in at'
                    },
                    placeholder: {
                        firstName: 'Enter first name',
                        lastName: 'Enter last name',
                        email: 'Enter email',
                        role: 'Enter role',
                        password: 'Enter password',
                        phone: 'Enter phone number',
                    }
                },
                modalWindow: {
                    deletion: 'Deletion',
                    user: 'user',
                    editing: 'Editing',
                    viewing: 'Viewing',
                    adding: 'Adding',
                }
            },
            organizations: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Inactive",
                },
                title: "Organizations",
                subtitle: "Total",
                btnAdd: "Add organization",
                status: 'Status',
                assignToCompany: 'Assign to company',
                deleteUserQuestion: "Are you sure you want to delete the organization",
                messages: {
                    success: {
                        createUser: "Organization successfully created",
                        updateUser: "Organization successfully updated",
                        deleteUser: "Organization successfully deleted",
                        assignOrganization: 'User successfully assigned to company',
                        unassignOrganization: 'User successfully unassigned from company'
                    },
                    error: {
                        createUser: "Error while creating organization",
                        updateUser: "Error while updating organization",
                        deleteUser: "Error while deleting organization",
                        unassignOrganization: 'Error while unassigning user from company'
                    },
                },
                addUserForm: {
                    label: {
                        companyType: "Company type",
                        displayName: "Display name",
                        productGroup: "Product group",
                        tin: "TIN",
                        legalName: "Legal name of the organization",
                        director: "Director",
                        region: "Region",
                        district: "District",
                        address: "Address",
                        bankName: "Servicing bank",
                        ccea: "OKED",
                        account: "Account number",
                        mfo: "MFO",
                        phone: "Phone",
                        email: "Email",
                        url: "Website",
                        person: "Contact person",
                        gcpCode: "GCP code",
                        omsId: "OMSID",
                        turonToken: "Turon token",
                    },
                    placeholder: {
                        companyType: "Enter company type",
                        displayName: "Enter display name",
                        productGroup: "Enter product group",
                        tin: "Enter TIN",
                        legalName: "Enter legal name",
                        director: "Enter director details",
                        region: "Enter region",
                        district: "Enter district",
                        address: "Enter address",
                        bankName: "Enter servicing bank",
                        ccea: "Enter OKED",
                        account: "Enter account number",
                        mfo: "Enter MFO",
                        phone: "Enter phone number",
                        email: "Enter email",
                        url: "Enter website",
                        person: "Enter contact person",
                        gcpCode: "Enter GCP code",
                        omsId: "Enter OMSID",
                        turonToken: "Enter Turon token",
                    }
                },
                subtitles: {
                    address: "Address:",
                    bankDetails: "Bank details:",
                    contactDetails: "Contact details:"
                },
                modalWindow: {
                    deletion: "Deletion",
                    organization: "organization",
                    editing: "Editing",
                    viewing: "Viewing",
                    adding: "Adding",
                }
            },
            products: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Inactive",
                },
                title: "Products",
                subtitle: "Total",
                btnAdd: "Add product",
                status: "Status",
                deleteUserQuestion: "Are you sure you want to delete the product?",
                messages: {
                    success: {
                        createUser: "Product successfully created",
                        updateUser: "Product successfully updated",
                        deleteUser: "Product successfully deleted"
                    },
                    error: {
                        createUser: "Error while creating product",
                        updateUser: "Error while updating product",
                        deleteUser: "Error while deleting product"
                    },
                },
                addProductForm: {
                    label: {
                        name: "Name",
                        shortName: "Short name",
                        description: "Description",
                        gtin: "GTIN",
                        barcode: "Barcode",
                        icps: "ICPS",
                        productType: "Product type",
                        aggregationQuantity: "Aggregation quantity",
                        expiration: "Expiration date",
                        unit: "Unit of measurement",
                        amount: "Amount",
                        net: "Net weight",
                        gross: "Gross weight",
                        price: "Price",
                        companyId: "Company ID",
                    },
                    placeholder: {
                        name: "Enter name",
                        shortName: "Enter short name",
                        description: "Enter description",
                        gtin: "Enter GTIN",
                        barcode: "Enter barcode",
                        icps: "Enter ICPS",
                        productType: "Enter product type",
                        aggregationQuantity: "Enter aggregation quantity",
                        expiration: "Enter expiration date",
                        unit: "Enter unit of measurement",
                        amount: "Enter amount",
                        net: "Enter net weight",
                        gross: "Enter gross weight",
                        price: "Enter price",
                        companyId: "Enter company ID",
                    }
                },
                modalWindow: {
                    deletion: "Deletion",
                    product: "product",
                    editing: "Editing",
                    viewing: "Viewing",
                    adding: "Adding",
                }
            },
            login: {
                messages:{
                    successLogin: 'Successful login',
                    errorLogin: 'Login error, check your username and password'
                },
                btn: {
                    login: 'Login',
                    signIn: 'Sign in',
                },
                enterUserName: 'Enter username',
                username: 'Username',
            },
            changePwd: {
                title: 'Change Password',
                confirmModal: {
                    title: 'Are you sure you want to change the password?',
                    subtitle: 'After changing the password, you will be automatically logged out',
                    btn: {
                        confirm: 'Confirm',
                        cancel: 'Cancel',
                    },
                },
                changePasswordForm: {
                    label: {
                        currentPassword: 'Current password',
                        newPassword: 'New password',
                        newPasswordConfirmation: 'New password confirmation',
                    },
                    placeholder: {
                        currentPassword: 'Enter current password',
                        newPassword: 'Enter new password',
                        newPasswordConfirmation: 'Confirm new password',
                    }
                }
            }
        }
    },
    ru:{
        translation:{
            sessionEndsIn: 'Окончание сессии через',
            search: {
                byName: 'Поиск по имени',
                byOrganization: 'Поиск по организациям'
            },
            btn: {
                create: 'Создать',
                edit: 'Редактировать',
                delete: 'Удалить',
                cancel: 'Отмена',
                save: 'Сохранить',
                back: 'Назад'
            },
            navigation: {
                products: "Продукция",
                management: "Управление",
                organization: "Организация",
                users: "Пользователи",
            },
            users: {
                userRole: {
                    superadmin: "Суперадмин",
                    admin: "Администратор",
                    operator: "Оператор"
                },
                status: {
                    active: "Активный",
                    inactive: "Неактивный"
                },
                title: "Пользователи",
                subtitle: 'Всего',
                logOut: "Выйти",
                btnAdd: 'Добавить пользователя',
                companies: 'Компании пользователя',
                deleteUserQuestion: 'Вы уверены, что хотите удалить пользователя',
                messages: {
                    success: {
                        createUser: "Пользователь успешно создан",
                        updateUser: "Пользователь успешно обновлён",
                        deleteUser: "Пользователь успешно удалён"
                    },
                    error: {
                        createUser: "Ошибка при создании пользователя",
                        updateUser: "Ошибка при обновлении пользователя",
                        deleteUser: "Ошибка при удалении пользователя"
                    },
                },
                addUserForm: {
                    label: {
                        firstName: 'Имя',
                        lastName: 'Фамилия',
                        email: 'Почта',
                        role: 'Роль',
                        password: 'Пароль',
                        phone: 'Телефон',
                        lastLoggedInAt: 'Дата последнего входа'
                    },
                    placeholder: {
                        firstName: 'Введите имя',
                        lastName: 'Введите фамилию',
                        email: 'Введите почту',
                        role: 'Введите роль',
                        password: 'Введите пароль',
                        phone: 'Введите номер телефона',
                    }
                },
                modalWindow: {
                    deletion: 'Удаление',
                    user: 'пользователя',
                    editing: 'Редактирование',
                    viewing: 'Просмотр',
                    adding: 'Добавление',
                }
            },
            organizations: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Inactive",
                },
                title: "Организации",
                subtitle: 'Всего',
                btnAdd: 'Добавить организацию',
                status: 'Статус',
                assignToCompany: 'Назначить на компанию',
                deleteUserQuestion: 'Вы уверены, что хотите удалить организацию',
                messages: {
                    success: {
                        createUser: "Организация успешно создан",
                        updateUser: "Организация успешно обновлён",
                        deleteUser: "Организация успешно удалён",
                        assignOrganization: 'Пользователь успешно назначен на компанию',
                        unassignOrganization: 'Пользователь успешно отвязан от компании'
                    },
                    error: {
                        createUser: "Ошибка при создании организации",
                        updateUser: "Ошибка при обновлении организации",
                        deleteUser: "Ошибка при удалении организации",
                        unassignOrganization: 'Ошибка при отвязывании пользователя от компании'
                    },
                    
                },
                addUserForm: {
                    label: {
                        companyType: 'Тип компании',
                        displayName: 'Отображаемое имя',
                        productGroup: 'Товарная группа',
                        tin: 'ИНН',
                        legalName: 'Юридическое название организации',
                        director: 'Директор',
                        region: 'Регион',
                        district: 'Район',
                        address: 'Адрес',
                        bankName: 'Обслуживающий банк',
                        ccea: 'ОКЭД',
                        account: 'Номер счета',
                        mfo: 'МФО',
                        phone: 'Телефон',
                        email: 'Эл. почта',
                        url: 'Веб-сайт',
                        person: 'Контактное лицо',
                        gcpCode: 'GCP код',
                        omsId: 'OMSID',
                        turonToken: 'Turon token',
                    },
                    placeholder: {
                        companyType: 'Введите тип компании',
                        displayName: 'Введите отображаемое имя',
                        productGroup: 'Введите группу',
                        tin: 'Введите ИНН',
                        legalName: 'Введите юр. название',
                        director: 'Введите даннеы директора',
                        region: 'Введите регион',
                        district: 'Введите район',
                        address: 'Введите адрес',
                        bankName: 'Введите обслуживающий банк',
                        ccea: 'Введите ОКЭД',
                        account: 'Введите номер счета',
                        mfo: 'Введите МФО',
                        phone: 'Введите рабочий телефон',
                        email: 'Введите email',
                        url: 'Введите веб-сайт',
                        person: 'Введите контактное лицо',
                        gcpCode: 'Введите GCP код',
                        omsId: 'Введите OSMID',
                        turonToken: 'Введите turon token',
                    }
                },
                subtitles: {
                    address: 'Адресс:',
                    bankDetails: 'Банковские реквизиты:',
                    contactDetails: 'Контактные данные:'
                },
                modalWindow: {
                    deletion: 'Удаление',
                    organization: 'организации',
                    editing: 'Редактирование',
                    viewing: 'Просмотр',
                    adding: 'Добавление',
                }
            },
            products: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Inactive",
                },
                title: "Продукты",
                subtitle: 'Всего',
                btnAdd: 'Добавить продукт',
                status: 'Статус',
                deleteUserQuestion: 'Вы уверены, что хотите удалить продукт',
                messages: {
                    success: {
                        createProduct: "Продукт успешно создан",
                        updateProduct: "Продукт успешно обновлён",
                        deleteProduct: "Продукт успешно удалён"
                    },
                    error: {
                        createProduct: "Ошибка при создании Продукта",
                        updateProduct: "Ошибка при обновлении Продукта",
                        deleteProduct: "Ошибка при удалении Продукта"
                    },
                },
                addProductForm: {
                    label: {
                        name: 'Название продукции',
                        shortName: 'Короткое название продукции',
                        description: 'Описание',
                        gtin: 'GTIN',
                        barcode: 'Штрихкод',
                        icps: 'ИКПУ',
                        productType: 'Тип продукции',
                        aggregationQuantity: 'Количество в агрегации',
                        expiration: 'Срок годности',
                        unit: 'Единица измерения',
                        amount: 'Количество',
                        net: 'Вес нетто',
                        gross: 'Вес брутто',
                        price: 'Цена',
                        companyId: 'Айди компании',
                    },
                    placeholder: {
                        name: 'Введите название продукции',
                        shortName: 'Введите короткое название продукции',
                        description: 'Введите описание',
                        gtin: 'Введите GTIN',
                        barcode: 'Штрихкод',
                        icps: 'Введите ИКПУ',
                        productType: 'Введите тип продукции',
                        aggregationQuantity: 'Введите количество в агрегации',
                        expiration: 'Введите срок годности',
                        unit: 'Введите единицу измерения',
                        amount: 'Введите количество',
                        net: 'Введите вес нетто',
                        gross: 'Введите вес брутто',
                        price: 'Введите цену',
                        companyId: 'Айди компании',
                    }
                },
                modalWindow: {
                    deletion: 'Удаление',
                    product: 'продукта',
                    editing: 'Редактирование',
                    viewing: 'Просмотр',
                    adding: 'Добавление',
                }
            },
            login: {
                messages:{
                    successLogin: 'Успешный вход',
                    errorLogin: 'Ошибка входа, проверьте логин и пароль'
                },
                btn: {
                    login: 'Вход',
                    signIn: 'Войти',
                },
                enterUserName: 'Введите логин',
                username: 'Логин',
            },
            changePwd: {
                title: 'Изменить пароль',
                confirmModal: {
                    title: 'Вы уверены, что хотите изменить пароль?',
                    subtitle: 'После изменения пароля вы будете автоматически разлогинены',
                    btn: {
                        confirm: 'Подтвердить',
                        cancel: 'Отмена',
                    },
                },
                  
                changePasswordForm: {
                    label: {
                        currentPassword: 'Текущий пароль',
                        newPassword: 'Новый пароль',
                        newPasswordConfirmation: 'Подтверждение нового пароля',
                    },
                    placeholder: {
                        currentPassword: 'Введите текущий пароль',
                        newPassword: 'Введите новый пароль',
                        newPasswordConfirmation: 'Подтвердите новый пароль',
                    }
                }
            }
        }
    },
    uz:{
        translation:{
            sessionEndsIn: 'Sessiya tugashiga',
            search: {
                byName: 'Ism bo‘yicha qidirish',
                byOrganization: 'Tashkilotlar bo‘yicha qidirish'
            },
            btn: {
                create: 'Yaratish',
                edit: 'Tahrirlash',
                delete: 'Oʻchirish',
                cancel: 'Bekor qilish',
                save: 'Saqlash',
                back: 'Orqaga'
            },
            navigation: {
                products: "Mahsulotlar",
                management: "Boshqaruv",
                organization: "Tashkilot",
                users: "Foydalanuvchilar",
            },
            users: {
                userRole: {
                    superadmin: "Superadmin",
                    admin: "Administrator",
                    operator: "Operator"
                },
                status: {
                    active: "Faol",
                    inactive: "Faol emas"
                },
                title: "Foydalanuvchilar",
                subtitle: 'Jami',
                logOut: "Chiqish",
                btnAdd: 'Foydalanuvchini qoʻshish',
                deleteUserQuestion: 'Foydalanuvchini o‘chirishni xohlaysizmi',
                companies: 'Foydalanuvchining kompaniyalari',
                messages: {
                    success: {
                        createUser: "Foydalanuvchi muvaffaqiyatli yaratildi",
                        updateUser: "Foydalanuvchi muvaffaqiyatli yangilandi",
                        deleteUser: "Foydalanuvchi muvaffaqiyatli o‘chirildi"
                    },
                    error: {
                        createUser: "Foydalanuvchini yaratishda xatolik",
                        updateUser: "Foydalanuvchini yangilashda xatolik",
                        deleteUser: "Foydalanuvchini o‘chirishda xatolik"
                    },
                },
                addUserForm: {
                    label: {
                        firstName: 'Ism',
                        lastName: 'Familiya',
                        email: 'Elektron pochta',
                        role: 'Roli',
                        password: 'Parol',
                        phone: 'Telefon',
                        lastLoggedInAt: 'Oxirgi tizimga kirgan vaqti'
                    },
                    placeholder: {
                        firstName: 'Ismni kiriting',
                        lastName: 'Familiyani kiriting',
                        email: 'Elektron pochtani kiriting',
                        role: 'Rolni kiriting',
                        password: 'Parolni kiriting',
                        phone: 'Telefon raqamini kiriting',
                    }
                },
                modalWindow: {
                    deletion: 'O‘chirish',
                    user: 'foydalanuvchi',
                    editing: 'Tahrirlash',
                    viewing: 'Ko‘rish',
                    adding: 'Qo‘shish',
                }
            },
            organizations: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Faol emas",
                },
                title: "Tashkilotlar",
                subtitle: "Jami",
                btnAdd: "Tashkilot qo‘shish",
                status: 'Holat',
                assignToCompany: 'Kompaniyaga biriktirish',
                deleteUserQuestion: "Tashkilotni o‘chirib tashlashni xohlaysizmi?",
                messages: {
                    success: {
                        createUser: "Tashkilot muvaffaqiyatli yaratildi",
                        updateUser: "Tashkilot muvaffaqiyatli yangilandi",
                        deleteUser: "Tashkilot muvaffaqiyatli o‘chirildi",
                        assignOrganization: 'Foydalanuvchi muvaffaqiyatli kompaniyaga biriktirildi',
                        unassignOrganization: 'Foydalanuvchi muvaffaqiyatli kompaniyadan ajratildi'
                    },
                    error: {
                        createUser: "Tashkilotni yaratishda xatolik",
                        updateUser: "Tashkilotni yangilashda xatolik",
                        deleteUser: "Tashkilotni o‘chirishda xatolik",
                        unassignOrganization: "Foydalanuvchini kompaniyadan ajratishda xatolik"
                    },
                },
                addUserForm: {
                    label: {
                        companyType: "Kompaniya turi",
                        displayName: "Ko‘rsatiladigan nom",
                        productGroup: "Mahsulot guruhi",
                        tin: "STIR",
                        legalName: "Tashkilotning yuridik nomi",
                        director: "Direktor",
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
                    },
                    placeholder: {
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
                    }
                },
                subtitles: {
                    address: "Manzil:",
                    bankDetails: "Bank rekvizitlari:",
                    contactDetails: "Aloqa ma’lumotlari:"
                },
                modalWindow: {
                    deletion: "O‘chirish",
                    organization: "tashkilot",
                    editing: "Tahrirlash",
                    viewing: "Ko‘rish",
                    adding: "Qo‘shish",
                }
            },
            products: {
                companyTypeOption: {
                    type1: "type1",
                    inactive: "Faol emas",
                },
                title: "Mahsulotlar",
                subtitle: "Jami",
                btnAdd: "Mahsulot qo‘shish",
                status: "Holat",
                deleteUserQuestion: "Mahsulotni o‘chirib tashlashni xohlaysizmi?",
                messages: {
                    success: {
                        createUser: "Mahsulot muvaffaqiyatli yaratildi",
                        updateUser: "Mahsulot muvaffaqiyatli yangilandi",
                        deleteUser: "Mahsulot muvaffaqiyatli o‘chirildi"
                    },
                    error: {
                        createUser: "Mahsulotni yaratishda xatolik",
                        updateUser: "Mahsulotni yangilashda xatolik",
                        deleteUser: "Mahsulotni o‘chirishda xatolik"
                    },
                },
                addProductForm: {
                    label: {
                        name: "Nomi",
                        shortName: "Qisqa nomi",
                        description: "Tavsif",
                        gtin: "GTIN",
                        barcode: "Shtrix-kod",
                        icps: "IKPU",
                        productType: "Mahsulot turi",
                        aggregationQuantity: "Aggregatsiya miqdori",
                        expiration: "Yaroqlilik muddati",
                        unit: "O‘lchov birligi",
                        amount: "Miqdor",
                        net: "Sof og‘irlik",
                        gross: "Brutto og‘irlik",
                        price: "Narx",
                        companyId: "Kompaniya ID",
                    },
                    placeholder: {
                        name: "Nomini kiriting",
                        shortName: "Qisqa nomini kiriting",
                        description: "Tavsif kiriting",
                        gtin: "GTIN kiriting",
                        barcode: "Shtrix-kodni kiriting",
                        icps: "IKPU kiriting",
                        productType: "Mahsulot turini kiriting",
                        aggregationQuantity: "Aggregatsiya miqdorini kiriting",
                        expiration: "Yaroqlilik muddatini kiriting",
                        unit: "O‘lchov birligini kiriting",
                        amount: "Miqdor kiriting",
                        net: "Sof og‘irlikni kiriting",
                        gross: "Brutto og‘irlikni kiriting",
                        price: "Narxni kiriting",
                        companyId: "Kompaniya ID ni kiriting",
                    }
                },
                modalWindow: {
                    deletion: "O‘chirish",
                    product: "mahsulot",
                    editing: "Tahrirlash",
                    viewing: "Ko‘rish",
                    adding: "Qo‘shish",
                }
            },
            login: {
                messages:{
                    successLogin: 'Muvaffaqiyatli kirish',
                    errorLogin: 'Kirishda xatolik, login va parolni tekshiring'
                },
                btn: {
                    login: 'Kirish',
                    signIn: 'Kirish',
                },
                enterUserName: 'Login kiriting',
                username: 'Login',
            },
            changePwd: {
                title: 'Parolni o‘zgartirish',
                confirmModal: {
                    title: 'Parolni o‘zgartirishni xohlaysizmi?',
                    subtitle: 'Parol o‘zgartirilgandan so‘ng, siz avtomatik ravishda tizimdan chiqasiz',
                    btn: {
                        confirm: 'Подтвердить',
                        cancel: 'Bekor qilish',
                    },
                },
                changePasswordForm: {
                    label: {
                        currentPassword: 'Joriy parol',
                        newPassword: 'Yangi parol',
                        newPasswordConfirmation: 'Yangi parolni tasdiqlash',
                    },
                    placeholder: {
                        currentPassword: 'Joriy parolni kiriting',
                        newPassword: 'Yangi parolni kiriting',
                        newPasswordConfirmation: 'Yangi parolni tasdiqlang',
                    }
                }
            }
        }
    }
}