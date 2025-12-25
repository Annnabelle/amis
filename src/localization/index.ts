export const resources = {
    en:{
        translation:{
            common:{
                yes: "Yes",
                no: "No"
            },
            statuses: {
                active: "Active",
                inactive: "Inactive",
            },
            logsActions: {
                user: {
                    userRegistration: "Registration of a new user",
                    passwordChange: "User changed the password",
                    unassignCompanyFromUser: "The company has been deleted from the user",
                    assignCompanyToUser: "Company assigned to the user",
                    userUpdate: "User update",
                    userDelete: "User deletion"
                },
                object: {
                    productCreate: "User created a product",
                    productUpdate: "User updated a product",
                    productDelete: "User deleted a product"
                },
                auth: {
                    auth: "Authentication",
                    login: "User logged in",
                    logout: "User logged out",
                },
                organization: {
                    organizationCreate: "User created an organization",
                    organizationUpdate: "User updated an organization",
                    organizationDelete: "User deleted an organization"
                },
                types: {
                    login: "User logged in",
                    logout: "User logged out",
                    userRegistration: "Registration of a new user",
                    passwordChange: "User changed the password",
                    productCreate: "User created a product",
                    productUpdate: "User updated a product",
                    productDelete: "User deleted a product",
                    organizationCreate: "User created an organization",
                    organizationUpdate: "User updated an organization",
                    organizationDelete: "User deleted an organization",
                    unassignCompanyFromUser: "The company has been deleted from the user",
                    assignCompanyToUser: "Company assigned to the user",
                    userUpdate: "User update",
                    userDelete: "User deletion"
                }
            },
            categories: {
                all: 'All',
                user: 'Users',
                product: 'product',
                auth: "Authentication",
                organization: "Organization"
            },
            sessionEndsIn: 'Session ends in',
            search: {
                byName: 'Search by name',
                byOrganization: 'Search by organization',
                selectProduct: 'Select product',
                packageType: 'Package type',
                selectStatus: 'Select status',
                selectOrderPaymentType: 'Select order payment type',
                selectState: 'Select state',
            },
            btn: {
                create: 'Create',
                edit: 'Edit',
                delete: 'Delete',
                cancel: 'Cancel',
                save: 'Save',
                back: 'Back',
                toProducts: "Go to products",
                sendToTuron: "Send to Turon",
                apply: "Apply",
                applyAll: "Apply all"
            },
            navigation: {
                products: "Products",
                management: "Management",
                organization: "Organization",
                organizations: "Organizations",
                myOrganizations: "My organizations",
                users: "Users",
                audit: "System logs",
                markingCodes: "Marking codes"
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
                    },
                    required: {
                        firstName: "Please enter your first name",
                        lastName: "Please enter your last name",
                        phone: "Please enter your phone number",
                        email: "Please enter your email",
                        role: "Please select a role",
                        password: "Please enter your password"
                    },
                    pattern: {
                        phone: "Please enter a valid phone number",
                        email: "Please enter a valid email",
                        passwordMinLength: "Password must be at least 8 characters"
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
                        status: "Status",
                        deleted: "Deleted"
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
                    },
                    validation:{
                        required:{
                            tin: "Please enter TIN",
                            productGroup: "Please enter the product group name",
                            companyType: "Please select the company type",
                            displayName: "Please enter the company name",
                            legalName: "Please enter the legal company name",
                            director: "Please enter the director’s name",
                            region: "Please enter the region",
                            district: "Please enter the district",
                            address: "Please enter the address",
                            bankName:"Please enter the bank name",
                            ccea: "Please enter the bank account number",
                            account: "Please enter the account number",
                            mfo: "Please enter the bank MFO code",
                            phone: "Please enter the phone number",
                            email: "Please enter the email",
                            url: "Please enter the URL",
                            person: "Please enter the contact person",
                            gcpCode: "Please enter GCP code",
                            omsId: "Please enter OMS ID",
                            turonToken: "Please enter Turon Token",
                            gtin: "GTIN is required"
                        },
                        pattern:{
                            tin: "TIN must consist of 9 digits",
                            ccea: "Bank account number must consist of 20 digits",
                            account: "Account number must consist of 20 digits",
                            mfo: "Bank MFO code must consist of 5 digits",
                            phone: "Phone number must be in the format +998XXXXXXXXX",
                            email: "Please enter a valid email",
                            url: "Please enter a valid URL (e.g., https://example.com)",
                            gcpCode: "GCP code must be at least 3 characters",
                            omsId: "OMS ID must be at least 3 characters",
                            turonToken: "Turon Token kamida 5 ta belgidan iborat bo‘lishi kerak",
                            passwordMinLength:  "Password must be at least 8 characters long",
                            gtin: "Enter a valid GTIN (14 digits)"
                        }
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
                view: "View product",
                edit: "Edit product",
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
                        deleteUser: "Error while deleting product",
                        invalidExpiration: "Expiration must be an integer with up to 2 digits"
                    },
                },
                gtin: {
                    unit: "GTIN consumer packaging",
                    group: "GTIN group packaging",
                    box_lv_1: "GTIN box",
                    box_lv_2: "GTIN pallet",
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
                        manufacturerCountry: "Manufacturer country",
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
                        countrySearch: "Enter country",
                    },
                    validation:{
                        required:{
                            gtin: "GTIN is required",
                            barcode: "Barcode is required",
                            icps: "ICPS is required",
                            productType: "Product type is required",
                            aggregationQuantity: "Aggregation quantity is required",
                            expiration: "Expiration is required",
                            measurementUnit: "Unit is required",
                            measurementAmount: "Amount is required",
                            weightNet: "Net weight is required",
                            name: "Product name is required",
                            shortName: "Product short name is required"
                        },
                        pattern:{
                            gtin: "Enter a valid GTIN (14 digits)",
                            barcode: "Enter a valid barcode (8 to 14 digits)",
                            icps: "Enter a valid ICPS (14 digits)",
                            aggregationQuantity: "Enter a valid number",
                            expiration: "Enter a valid number",
                            measurementUnit: "Maximum length is 10 characters",
                            measurementAmount: "Enter a valid number (integer or decimal)",
                            weightNet: "Enter a valid number (integer or decimal)"
                        }
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
                    message: {
                        passwordsDontMatch: "Passwords do not match.",
                        error: "Error when changing password"
                    },
                    label: {
                        currentPassword: 'Current password',
                        newPassword: 'New password',
                        newPasswordConfirmation: 'New password confirmation',
                    },
                    placeholder: {
                        currentPassword: 'Enter current password',
                        newPassword: 'Enter new password',
                        newPasswordConfirmation: 'Confirm new password',
                    },
                    required: {
                        currentPassword: "Enter your current password",
                        newPasswordRequired: "Enter your current password",
                        newPassword: "Password must be at least 8 characters long.",
                    }
                }
            },
            auditLog:{
                title: "System logs",
                subtitle: "Monitoring and analysis of user activity",
                ip: "IP address",
                id: "Request ID",
                session: "Session",
                committed: "Performed by",
                target: "Action purpose",

            },
            markingCodes: {
                title: "KM Orders",
                subtitle: "Total",
                order: "Order",
                markingCodes: "Marking codes",
                backToOrders: "Back to Orders",
                backToBatches: "Back to Batches",
                orderNumber: "Order",
                markingCodesStatusProduct: {
                    received: "Received",
                    applied: "Applied",
                    introduced: "Introduced",
                    withdrawn: "Withdrawn",
                    writtenOff: "Written off",
                },
                markingCodesOrderStatus:{
                    created: "Created",
                    pending: "Pending",
                    ready: "Ready",
                    rejected: "Rejected",
                    closed: "Closed",
                    outsourced: "Outsourced"
                },
                orderProduct: {
                    markingCodesStatus:{
                        received: "Received",
                        applied: "Applied",
                        introduced: "In circulation",
                        withdrawn: "Withdrawn from circulation",
                        writtenOff: "Written off",
                        uploaded: "Uploaded",
                        aggregated: "Aggregated",
                    },
                },
                batches: {
                    title: "Batches",
                    orderNumber: "Order number",
                    orderTime: "Order time",
                    orderStatus: "Order status",
                    turonOrderID: "Turon order ID",
                    batchesOrderStatus: {
                        new: "New",
                        created: 'Created',
                        vendorPending: 'Vendor pending',
                        readyForCodes: 'Ready for codes',
                        codesReceived: 'Codes received',
                        codesUtilizationRequested: 'Codes utilization_requested',
                        codesUtilized: 'Codes utilized',
                        rejected: 'Rejected',
                        closed: 'Closed',
                    },
                    orderNotExternalStatus: {
                        new: "New",
                        vendor_pending: "Vendor pending",
                        ready_for_codes: "Ready for codes",
                        codes_received: "Codes received",
                        codes_utilized: "Codes utilized",
                        rejected: "Rejected",
                        closed: "Closed"
                    },
                    batchData:{
                        batchNumber: "Batch number",
                        packagingType: "Packaging type",
                        orderNumber: "Order number",
                        executor: "Executor",
                        productName: "Product name",
                        gtin: "GTIN",
                        orderTime: "Order time",
                        numberOfMarkingCodes: "Number of marking codes",
                        turonOrderID: "Turon order ID",
                        batchStatus: "Batch status",
                        orderStatus: "Order status",
                        turonOrderStatus: "Turon order status",
                        batchStatusInTuron: "Batch status in Turon",
                        externalStatus:{
                            pending: "Pending",
                            active: "Active",
                            exhausted: "Exhausted",
                            rejected: "Rejected",
                            closed: "Closed"
                        },
                        order:{
                            batchExternalStatus:{
                                pending: "Pending",
                                active: "Active",
                                exhausted: "Exhausted",
                                rejected: "Rejected",
                                closed: "Closed"
                            }
                        }
                    }
                },
                tableTitles: {
                    number: "№",
                    products: "Products",
                    comments: "Comments",
                    markingCodesQuantity: "Marking codes quantity",
                    turonBatchID: "Turon batch ID",
                    creationDate: "Creation date",
                    turonMessage: "Turon message",
                    orderNumber: "Order number",
                    productName: "Product name",
                    totalQuantity: "Total quantity",
                    orderedMCQuantity: "Ordered MC quantity",
                    codesHaveBeenExported: "Codes have been exported",
                    orderDate: "Order date",
                    packageType: "Package type",
                    paymentType : "Payment type",
                    status: "Status",
                    paid: "Paid",
                    unPaid: "Unpaid",
                    batchNumber: "Batch number",
                    gtin: "GTIN",
                    numberOfMarkingCodes: "Number of Marking Codes",
                    code: "Code",
                },
                orderCreation: {
                    title: "Order Creation",
                    product: "Product",
                    packagingType: "Packaging Type",
                    quantity: "Quantity",
                    serialNumberGenerationMethod: "Serial Number Generation Method",
                    selfGenerated: "Self-generated",
                    byOperator: "By Operator",
                    submitOrder: "Submit Order",
                    orderHasBeenSuccessfullyCreated: "Order has been successfully created",
                    failedToCreateOrder: "Failed to create order",
                },
                label:{
                    chooseProduct: "Choose product",
                    choosePackageType: "Choose package type",
                    enterQuantity: "Enter quantity",
                    chooseGenerationMethod: "Choose generation method"
                },
                markingCode: {
                    product: "Product",
                    comment: "Comment",
                    mCQuantity: "MC Quantity",
                    partyIDTuron: "Turon Party ID",
                    creationDate: "Creation Date",
                    messageFromTuron: "Message from Turon",
                    gtin: "GTIN",
                    packageType: "Package Type",
                    status: "Status",
                },
                 orderStatus: {
                    created: "Created",
                    pending: "Pending",
                    ready: "Ready",
                    rejected: "Rejected",
                    closed: "Closed",
                    outsourced: "Outsourced"
                },
                packageType: {
                    unit: "Consumer",
                    group: "Group",
                    box_lv_1: "Box",
                    box_lv_2: "Pallet",
                },
            },
            aggregations: {
                title: "Aggregation codes",
                aggregationsTableTitle: {
                    status: "Status",
                    orderDate: "Order date",
                    quantityPerPackage: "Quantity per package",
                    numberOfPackages: "Number of packages",
                    productName: "Product name",
                    childBatch: "Child batch",
                    parentBatch: "Parent batch",
                    aggregationReportNumber: "Aggregation report number",
                },
                aggregationReportStatus: {
                    new: "New",
                    requested: "Requested",
                    created: "Created",
                    validating: "Validating",
                    in_process: "In progress",
                    success: "Success",
                    error: "Error",
                }
            }
        }
    },
    ru:{
        translation:{
            common:{
                yes: "Да",
                no: "Нет"
            },
            statuses: {
                active: "Активен",
                inactive: "Неактивен",
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
                auth: {
                    auth: "Аутентификация",
                    login: "Пользователь вошёл в систему",
                    logout: "Пользователь вышел из системы",
                },
                organization: {
                    organizationCreate: "Пользователь создал организацию", 
                    organizationUpdate: "Пользователь обновил организацию", 
                    organizationDelete: "Пользователь удалил организацию"
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
                    userDelete: "Удаление пользователя"
                }
            },
            categories: {
                all: 'Все',
                user: 'Пользователи',
                product: 'Продукты',
                auth: "Аутентификация",
                organization: "Организации"
            },
            sessionEndsIn: 'Окончание сессии через',
            search: {
                byName: 'Поиск по имени',
                byOrganization: 'Поиск по организациям',
                selectProduct: 'Выберите продукцию',
                packageType: 'Тип упаковки',
                selectStatus: 'Выберите статус',
                selectOrderPaymentType: 'Выберите тип оплаты заказа',
                selectState: 'Выберите состояние',
            },
            btn: {
                create: 'Создать',
                edit: 'Редактировать',
                delete: 'Удалить',
                cancel: 'Отмена',
                save: 'Сохранить',
                back: 'Назад',
                toProducts: "Перейти к продуктам",
                sendToTuron: "Отправить в турон",
                apply: "Нанести",
                applyAll: "Нанести все"
            },
            navigation: {
                products: "Продукция",
                management: "Управление",
                organization: "Организация",
                organizations: "Организации",
                myOrganizations: "Мои организации",
                users: "Пользователи",
                audit: "Логи системы",
                markingCodes: "Коды маркировки",
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
                        updateUser: "Пользователь успешно обновлёна",
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
                    },
                    required: {
                        firstName: "Введите имя",
                        lastName: "Введите фамилию",
                        phone: "Введите номер телефона",
                        email: "Введите email",
                        role: "Выберите роль",
                        password: "Введите пароль"
                    },
                    pattern: {
                        phone: "Введите корректный номер телефона",
                        email: "Введите корректный email",
                        passwordMinLength: "Пароль должен содержать минимум 8 символов"
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
                        turonToken: 'Turon токен',
                        status: "Статус",
                        deleted: 'Удалено'
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
                    },
                    validation:{
                        required:{
                            tin: "ИНН должен состоять из 9 цифр",
                            productGroup: "Пожалуйста, введите название группы товара",
                            companyType: "Пожалуйста, выберите тип компании",
                            displayName: "Пожалуйста, введите название компании",
                            legalName: "Пожалуйста, введите юридическое название компании",
                            director: "Пожалуйста, введите имя директора",
                            region: "Пожалуйста, введите регион",
                            district: "Пожалуйста, введите район",
                            address: "Пожалуйста, введите адрес",
                            bankName:"Пожалуйста, введите название банка",
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
                            gtin: "GTIN обязателен для заполнения"
                        },
                        pattern:{
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
                view: "Просмотр продукта",
                edit: "Изменение продукта",
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
                        deleteProduct: "Ошибка при удалении Продукта",
                        invalidExpiration: "Срок годности должен быть целым числом до 2-х цифр"
                    },
                },
                gtin: {
                    unit: "GTIN потребительской упаковки",
                    group: "GTIN групповой упаковки",
                    box_lv_1: "GTIN коробки",
                    box_lv_2: "GTIN паллеты",
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
                        manufacturerCountry: "Страна производителя",
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
                        manufacturerCountry: "Поиск стран"
                    },
                    validation:{
                        required:{
                            gtin: "GTIN обязателен для заполнения",
                            barcode: "Штрихкод обязателен для заполнения",
                            icps: "ICPS обязателен для заполнения",
                            productType: "Тип продукта обязателен для заполнения",
                            aggregationQuantity: "Количество в агрегации обязательно для заполнения",   
                            expiration: "Срок годности обязателен для заполнения",
                            measurementUnit: "Единица измерения обязательна для заполнения",
                            measurementAmount: "Количество обязательно для заполнения",
                            weightNet: "Нетто обязательно для заполнения",
                            name: "Название продукта обязательно для заполнения",
                            shortName: "Краткое название продукта обязательно для заполнения"
                        },
                        pattern:{
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
                    message: {
                        passwordsDontMatch: "Пароли не совпадают.",
                        error: "Ошибка при смене пароля"
                    },
                    label: {
                        currentPassword: 'Текущий пароль',
                        newPassword: 'Новый пароль',
                        newPasswordConfirmation: 'Подтверждение нового пароля',
                    },
                    placeholder: {
                        currentPassword: 'Введите текущий пароль',
                        newPassword: 'Введите новый пароль',
                        newPasswordConfirmation: 'Подтвердите новый пароль',
                    },
                    required: {
                        currentPassword: "Введите текущий пароль",
                        newPasswordRequired: "Введите новый пароль",
                        newPassword: "Пароль должен содержать не менее 8 символов.",
                    }
                }
            },
            auditLog:{
                title: "Логи системы",
                subtitle: "Мониторинг и анализ активности пользователей",
                ip: "IP адресс",
                id: "ID запроса",
                session: "Сессия",
                committed: "Совершил",
                target: "Цель действия",
            },
            markingCodes: {
                title: "Заказы КМ",
                orderNumber: "Заказ",
                subtitle: "Всего",
                order: "Заказать",
                markingCodes: "Коды маркировки",
                backToOrders: "Вернуться к заказам",
                backToBatches: "Вернуться партиям",
                markingCodesStatusProduct: {
                    received: "Получен",
                    applied: "Нанесен",
                    introduced: "В обороте",
                    withdrawn: "Выведен из оборота",
                    writtenOff: "Списан",
                },
                markingCodesOrderStatus:{
                    created: "Создано",
                    pending: "В ожидании",
                    ready: "Готово",
                    rejected: "Отклонено",
                    closed: "Закрыто",
                    outsourced: "Передано на аутсорсинг"
                },
                orderProduct: {
                    markingCodesStatus:{
                        received: "Получен",
                        applied: "Нанесен",
                        introduced: " В обороте",
                        withdrawn: "Выведен из оборота",
                        writtenOff: "Списан",
                        uploaded: "Загружен",
                        aggregated: "Агрегирован",
                    },
                },
                batches: {
                    title: "Партии",
                    orderNumber: "Номер заказа",
                    orderTime: "Время заказа",
                    orderStatus: "Статус заказа",
                    turonOrderID: "Turon order ID",
                    batchesOrderStatus: {
                        new: "Новый",
                        created: "Создан",
                        vendor_pending: "Ожидает поставщика",
                        ready_for_codes: "Готов к кодам",
                        codes_received: "Коды получены",
                        codes_utilization_requested: "Запрошено использование кодов",
                        codes_utilized: "Коды использованы",
                        rejected: "Отклонено",
                        closed: "Закрыто"
                    },
                    orderNotExternalStatus: {
                        new: "Новый",
                        vendor_pending: "Ожидает поставщика",
                        ready_for_codes: "Готов к кодам",
                        codes_received: "Коды получены",
                        codes_utilized: "Коды использованы",
                        rejected: "Отклонено",
                        closed: "Закрыто"
                    },
                    batchData:{
                        batchNumber: "Номер партии",
                        packagingType: "Тип упаковки",
                        orderNumber: "Номер заказа",
                        executor: "Испольнитель",
                        productName: "Название продукта",
                        gtin: "GTIN",
                        orderTime: "Время заказа",
                        numberOfMarkingCodes: "Кол-во КМ",
                        turonOrderID: "ID заказа Турон",
                        batchStatus: "Статус партии",
                        orderStatus: "Статус заказа",
                        turonOrderStatus: "Статус заказа Турон",
                        batchStatusInTuron: "Статус партии в Турон",
                        externalStatus:{
                            pending: "В ожидании",
                            active: "Активна",
                            exhausted: "Исчерпана",
                            rejected: "Отклонена",
                            closed: "Закрыта"
                        },
                        order:{
                            batchExternalStatus:{
                                pending: "В ожидании",
                                active: "Активна",
                                exhausted: "Исчерпана",
                                rejected: "Отклонена",
                                closed: "Закрыта"
                            }
                        }
                    }
                },
                tableTitles: {
                    number: "№",
                    products: "Продукция",
                    comments: "Название продукции",
                    markingCodesQuantity: "Кол-во КМ",
                    turonBatchID: "ID Партии турон",
                    creationDate: "Дата создания",
                    turonMessage: "Сообщение от турон",
                    orderNumber: "Номер заказа",
                    productName: "Название продукции",
                    totalQuantity: "Общее количество",
                    orderedMCQuantity: "Заказанное количество КМ",
                    codesHaveBeenExported: "Коды были экспортированы",
                    orderDate: "Дата заказа",
                    packageType: "Тип упаковки",
                    paymentType : "Тип оплаты",
                    status: "Статус",
                    paid: "Оплачиваемый",
                    unPaid: "Неоплачиваемый",
                    batchNumber: "Номер партии",
                    gtin: "GTIN",
                    numberOfMarkingCodes: "Колличество КМ",
                    code: "Код"
                },
                orderCreation: {
                    title: "Создание заказа",
                    product: "Продукция",
                    packagingType: "Тип упаковки",
                    quantity: "Количество",
                    serialNumberGenerationMethod: "Метод генерации серийного номера",
                    selfGenerated: "Самогенерируемый",
                    byOperator: "Оператором",
                    submitOrder: "Отправить заказ",
                    orderHasBeenSuccessfullyCreated: "Заказ успешно создан",
                    failedToCreateOrder: "Не удалось создать заказ",
                },
                label:{
                    chooseProduct: "Выберите продукцию",
                    choosePackageType: "Выберите тип упаковки",
                    enterQuantity: "Введите количество",
                    chooseGenerationMethod: "Выберите метод генерации"
                },
                markingCode: {
                    product: "Продукция",
                    comment: "Комментарий",
                    mCQuantity: "Кол-во КМ",
                    partyIDTuron: "ID Партии турон",
                    creationDate: "Дата создания",
                    messageFromTuron: "Сообщение от турон",
                    gtin: "GTIN",
                    packageType: "Тип упаковки",
                    status: "Статус",
                },
                orderStatus: {
                    created: "Создан",
                    pending: "В ожидании",
                    ready: "Готов",
                    rejected: "Отклонен",
                    closed: "Закрыт",
                    outsourced: "Аутсорсинг"
                },
                packageType: {
                    unit: "Потребительская",
                    group: "Групповая",
                    box_lv_1: "Коробка",
                    box_lv_2: "Паллета",
                }
            },
            aggregations: {
                title: "Коды аггрегации",
                btnAdd: "Добавить код аггрегации",
                aggregationsTableTitle: {
                    status: "Статус",
                    orderDate: "Дата заказа",
                    quantityPerPackage: "Кол-во в упаковке",
                    numberOfPackages: "Кол-во упаковок",
                    productName: "Название продукта",
                    childBatch: "Дочерняя партия",
                    parentBatch: "Родительская партия",
                    aggregationReportNumber: "Номер отчета об агрегации",
                },
                aggregationReportStatus: {
                    new: "Новый",
                    requested: "Запрошен",
                    created: "Создан",
                    validating: "Проверяется",
                    in_process: "В процессе",
                    success: "Успешно",
                    error: "Ошибка",
                }
            }
        }
    },
    uz:{
        translation:{
            common:{
                yes: "Ha",
                no: "Yoʻq"
            },
            statuses: {
                active: "Faol",
                inactive: "Faol emas",
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
                auth: {
                    auth: "Autentifikatsiya",
                    login: "Foydalanuvchi tizimga kirdi",
                    logout: "Foydalanuvchi tizimdan chiqdi",
                },
                organization: {
                    organizationCreate: "Foydalanuvchi tashkilot yaratdi",
                    organizationUpdate: "Foydalanuvchi tashkilotni yangiladi",
                    organizationDelete: "Foydalanuvchi tashkilotni o‘chirdi"
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
                    userDelete: "Foydalanuvchini o‘chirish"
                }
            },
            categories: {
                all: 'Barchasi',
                user: 'Foydalanuvchilar',
                product: 'Mahsulotlar',
                auth: "Autentifikatsiya",
                companies: "Kompaniyalar",
                organization: "Tashkilot"
            },
            sessionEndsIn: 'Sessiya tugashiga',
            search: {
                byName: 'Ism bo‘yicha qidirish',
                byOrganization: 'Tashkilotlar bo‘yicha qidirish',
                selectProduct: 'Mahsulotni tanlang',
                packageType: 'Qadoq turi',
                selectStatus: 'Holatni tanlang',
                selectOrderPaymentType: 'Buyurtma toʻlov turini tanlang',
                selectState: 'Holatni tanlang',
            },
            btn: {
                create: 'Yaratish',
                edit: 'Tahrirlash',
                delete: 'Oʻchirish',
                cancel: 'Bekor qilish',
                save: 'Saqlash',
                back: 'Orqaga',
                toProducts: "Mahsulotlarga o‘tish",
                sendToTuron: "Turonga yuborish",
                apply: "Qo‘llash",
                applyAll: "Hammasini qo‘llash",
            },
            navigation: {
                products: "Mahsulotlar",
                management: "Boshqaruv",
                organization: "Tashkilot",
                organizations: "Tashkilotlar",
                myOrganizations: "Mening tashkilotlarim",
                users: "Foydalanuvchilar",
                audit: "Tizim jurnallari",
                markingCodes: "Markirovka kodlari"
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
                    },
                    required: {
                        firstName: "Ismingizni kiriting",
                        lastName: "Familiyangizni kiriting",
                        phone: "Telefon raqamingizni kiriting",
                        email: "Emailingizni kiriting",
                        role: "Rolni tanlang",
                        password: "Parolni kiriting"
                    },
                    pattern: {
                        phone: "To‘g‘ri telefon raqamini kiriting",
                        email: "To‘g‘ri email manzilini kiriting",
                        passwordMinLength: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak"
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
                        status: "Holat",
                        deleted: "O‘chirildi"
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
                    },
                    validation:{
                        required:{
                            tin: "STIR 9 ta raqamdan iborat bo‘lishi kerak",
                            productGroup: "Iltimos, mahsulot guruhi nomini kiriting",
                            companyType: "Iltimos, kompaniya turini tanlang",
                            displayName: "Iltimos, kompaniya nomini kiriting",
                            legalName: "Iltimos, kompaniyaning yuridik nomini kiriting",
                            director: "Iltimos, direktor ismini kiriting",
                            region: "Iltimos, mintaqani kiriting",
                            district: "Iltimos, tumanni kiriting",
                            address: "Iltimos, manzilni kiriting",
                            bankName:"Iltimos, bank nomini kiriting",
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
                            gtin: "GTIN majburiy"
                        },
                        pattern:{
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
                view: "Mahsulotni ko‘rish",
                edit: "Mahsulotni tahrirlash",
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
                        deleteUser: "Mahsulotni o‘chirishda xatolik",
                        invalidExpiration: "Yaroqlilik muddati 2 raqamdan oshmagan butun son bo‘lishi kerak"
                    },
                },
                gtin: {
                    unit: "GTIN iste’molchi qadoqlanishi",
                    group: "GTIN guruhli qadoqlanish",
                    box_lv_1: "GTIN quti",
                    box_lv_2: "GTIN palleta",
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
                        manufacturerCountry: "Ishlab chiqaruvchi mamlakati",
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
                        countrySearch: "Mamlakatlarni qidirish"
                    },
                    validation:{
                        required:{
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
                            shortName: "Mahsulotning qisqa nomi majburiy"
                        },
                        pattern:{
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
                    message: {
                        passwordsDontMatch: "Parollar mos kelmaydi.",
                        error: "Parolni o‘zgartirishda xatolik"
                    },
                    label: {
                        currentPassword: 'Joriy parol',
                        newPassword: 'Yangi parol',
                        newPasswordConfirmation: 'Yangi parolni tasdiqlash',
                    },
                    placeholder: {
                        currentPassword: 'Joriy parolni kiriting',
                        newPassword: 'Yangi parolni kiriting',
                        newPasswordConfirmation: 'Yangi parolni tasdiqlang',
                    },
                    required: {
                        currentPassword: "Joriy parolni kiriting",
                        newPasswordRequired: "Yangi parolni kiriting",
                        newPassword: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak.",
                    }
                }
            },
            auditLog:{
                title: "Tizim jurnallari",
                subtitle: "Foydalanuvchi faolligini kuzatish va tahlil qilish",
                ip: "IP manzil",
                id: "So‘rov ID",
                session: "Sessiya",
                committed: "Amalni bajargan",
                target: "Harakat maqsadi",
            },
            markingCodes: {
                title: "KM buyurtmasi",
                subtitle: "Jami",
                order: "Buyurtma berish",
                markingCodes: "Markirovka kodlari",
                backToOrders: "Buyurtmalarga qaytish",
                backToBatches: "Partiyalarga qaytish",
                orderNumber: "Buyurtma",
                markingCodesStatusProduct: {
                    received: "Qabul qilindi",
                    applied: "Qo‘llangan",
                    introduced: "Aylanishda",
                    withdrawn: "Aylanishdan chiqarilgan",
                    writtenOff: "Yaroqsizlangan",
                },
                markingCodesOrderStatus:{
                    created: "Yaratildi",
                    pending: "Kutilmoqda",
                    ready: "Tayyor",
                    rejected: "Rad etildi",
                    closed: "Yopildi",
                    outsourced: "Tashqi manbaga berildi"
                },
                orderProduct: {
                  markingCodesStatus:{
                      received: "Qabul qilingan",
                      applied: "Belgilangan",
                      introduced: "Muomalada",
                      withdrawn: "Muomaladan chiqarilgan",
                      writtenOff: "Hisobdan chiqarilgan",
                      uploaded: "Yuklangan",
                      aggregated: "Agregatsiyalangan",
                  }
                },
                batches: {
                    title: "Partiyalar",
                    orderNumber: "Buyurtma raqami",
                    orderTime: "Buyurtma vaqti",
                    orderStatus: "Buyurtma holati",
                    turonOrderID: "Turon buyurtma ID",
                    batchesOrderStatus: {
                        new: "Yangi",
                        created: "Yaratildi",
                        vendor_pending: "Yetkazib beruvchi kutmoqda",
                        ready_for_codes: "Kodlarga tayyor",
                        codes_received: "Kodlar qabul qilindi",
                        codes_utilization_requested: "Kodlardan foydalanish so‘raldi",
                        codes_utilized: "Kodlar ishlatildi",
                        rejected: "Rad etildi",
                        closed: "Yopildi"
                    },
                    orderNotExternalStatus: {
                        new: "Yangi",
                        vendor_pending: "Yetkazib beruvchi kutmoqda",
                        ready_for_codes: "Kodlarga tayyor",
                        codes_received: "Kodlar qabul qilindi",
                        codes_utilized: "Kodlar ishlatildi",
                        rejected: "Rad etildi",
                        closed: "Yopildi"
                    },
                    batchData:{
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
                        externalStatus:{
                            pending: "Kutilmoqda",
                            active: "Faol",
                            exhausted: "Tugagan",
                            rejected: "Rad etilgan",
                            closed: "Yopilgan"
                        },
                        order:{
                            batchExternalStatus:{
                                pending: "Kutilmoqda",
                                active: "Faol",
                                exhausted: "Tugagan",
                                rejected: "Rad etilgan",
                                closed: "Yopilgan"
                            }
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
                    orderNumber: "Buyurtma raqami",
                    productName: "Mahsulot nomi",
                    totalQuantity: "Jami miqdor",
                    orderedMCQuantity: "Buyurtma qilingan KM soni",
                    codesHaveBeenExported: "Kodlar eksport qilindi",
                    orderDate: "Buyurtma sanasi",
                    packageType: "Qadoq turi",
                    paymentType : "Toʻlov turi",
                    status: "Holat",
                    paid: "Toʻlangan",
                    unPaid: "Toʻlanmagan",
                    batchNumber: "Partiya raqami",
                    gtin: "GTIN",
                    numberOfMarkingCodes: "Belgilash kodlari soni",
                    code: "Code"
                },
                orderCreation: {
                    title: "Buyurtma yaratish",
                    product: "Mahsulot",
                    packagingType: "Qadoq turi",
                    quantity: "Miqdor",
                    serialNumberGenerationMethod: "Seriya raqamini yaratish usuli",
                    selfGenerated: "O‘z-o‘zi yaratilgan",
                    byOperator: "Operator tomonidan",
                    submitOrder: "Buyurtmani yuborish",
                    orderHasBeenSuccessfullyCreated: "Buyurtma muvaffaqiyatli yaratildi",
                    failedToCreateOrder: "Buyurtma yaratishda xatolik",
                },
                label:{
                    chooseProduct: "Mahsulotni tanlang",
                    choosePackageType: "Qadoq turini tanlang",
                    enterQuantity: "Miqdor kiriting",
                    chooseGenerationMethod: "Yaratish usulini tanlang"
                },
                markingCode: {
                    product: "Mahsulot",
                    comment: "Izoh",
                    mCQuantity: "KM soni",
                    partyIDTuron: "Turon partiya ID",
                    creationDate: "Yaratilgan sana",
                    messageFromTuron: "Turondan xabar",
                    gtin: "GTIN",
                    packageType: "Qadoq turi",
                    status: "Holat",
                },
                orderStatus: {
                    created: "Yaratildi",
                    pending: "Kutilmoqda",
                    ready: "Tayyor",
                    rejected: "Rad etildi",
                    closed: "Yopildi",
                    outsourced: "Tashqi manbaga berildi"
                },
                packageType: {
                    unit: "Iste’molchi",
                    group: "Guruhli",
                    box_lv_1: "Quti",
                    box_lv_2: "Palleta",
                }
            },
            aggregations: {
                title: "Agregatsiya kodlari",
                aggregationsTableTitle: {
                    status: "Holati",
                    orderDate: "Buyurtma sanasi",
                    quantityPerPackage: "Qadoqdagi miqdor",
                    numberOfPackages: "Qadoqlar soni",
                    productName: "Mahsulot nomi",
                    childBatch: "Quyi partiya",
                    parentBatch: "Asosiy partiya",
                    aggregationReportNumber: "Agregatsiya hisobot raqami",
                },
                aggregationReportStatus: {
                    new: "Yangi",
                    requested: "So‘ralgan",
                    created: "Yaratilgan",
                    validating: "Tekshirilmoqda",
                    in_process: "Jarayonda",
                    success: "Muvaffaqiyatli",
                    error: "Xatolik",
                }
            }
        }
    }
}