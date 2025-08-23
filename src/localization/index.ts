import { PiPlaceholder } from "react-icons/pi";

export const resources = {
    en:{
        translation:{
            search: {
                byName: 'Search by name'
            },
            btn: {
                create: 'Create',
                edit: 'Edit',
                delete: 'Delete',
                cancel: 'Cancel',
                save: 'Save'
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
                deleteUserQuestion: "Are you sure you want to delete the organization",
                messages: {
                    success: {
                        createUser: "Organization successfully created",
                        updateUser: "Organization successfully updated",
                        deleteUser: "Organization successfully deleted"
                    },
                    error: {
                        createUser: "Error while creating organization",
                        updateUser: "Error while updating organization",
                        deleteUser: "Error while deleting organization"
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
            products: {
                title: 'Products'
            },
        }
    },
    ru:{
        translation:{
            search: {
                byName: 'Поиск по имени'
            },
            btn: {
                create: 'Создать',
                edit: 'Редактировать',
                delete: 'Удалить',
                cancel: 'Отмена',
                save: 'Сохранить'
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
                btnAdd: 'Добавить пользователя',
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
                deleteUserQuestion: 'Вы уверены, что хотите удалить организацию',
                messages: {
                    success: {
                        createUser: "Организация успешно создан",
                        updateUser: "Организация успешно обновлён",
                        deleteUser: "Организация успешно удалён"
                    },
                    error: {
                        createUser: "Ошибка при создании организации",
                        updateUser: "Ошибка при обновлении организации",
                        deleteUser: "Ошибка при удалении организации"
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
            products: {
                title: 'Продукция'
            },
        }
    },
    uz:{
        translation:{
            search: {
                byName: 'Ism bo‘yicha qidirish'
            },
            btn: {
                create: 'Yaratish',
                edit: 'Tahrirlash',
                delete: 'Oʻchirish',
                cancel: 'Bekor qilish',
                save: 'Saqlash'
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
                btnAdd: 'Foydalanuvchini qoʻshish',
                deleteUserQuestion: 'Foydalanuvchini o‘chirishni xohlaysizmi',
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
                deleteUserQuestion: "Tashkilotni o‘chirib tashlashni xohlaysizmi?",
                messages: {
                    success: {
                        createUser: "Tashkilot muvaffaqiyatli yaratildi",
                        updateUser: "Tashkilot muvaffaqiyatli yangilandi",
                        deleteUser: "Tashkilot muvaffaqiyatli o‘chirildi"
                    },
                    error: {
                        createUser: "Tashkilotni yaratishda xatolik",
                        updateUser: "Tashkilotni yangilashda xatolik",
                        deleteUser: "Tashkilotni o‘chirishda xatolik"
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
            products: {
                title: 'Mahsulotlar'
            },
        }
    }
}