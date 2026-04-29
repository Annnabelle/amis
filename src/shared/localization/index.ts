export const resources = {
    en:{
        translation:{
            common:{
                yes: "Yes",
                no: "No",
                error: "Something went wrong. Please try again later.",
                dataNotFound: "Data not found",
                total: "Total",
                create: "Create",
                details: "Details",
                backToList: "Back to list",
                backToRoute: "Back to route",
                backToTask: "Back to task",
                crew: "Crew",
                expandAll: "Expand all",
                collapseAll: "Collapse all"
            },
            statuses: {
                active: "Active",
                inactive: "Inactive",
                draft: "Draft",
                assigned_to_warehouse: "Assigned to warehouse",
                ready_for_loading: "Ready for loading",
                planned: "Planned",
                loading: "Loading",
                loaded: "Loaded",
                handover_in_progress: "Handover in progress",
                delivering: "Delivering",
                in_transit: "In transit",
                partially_delivered: "Partially delivered",
                delivered: "Delivered",
                issue_failed: "Issue failed",
                returning: "Returning",
                returned: "Returned",
                cancelled: "Cancelled",
                closed: "Closed",
                failed: "Failed"
            },
            export: {
                short: "Short",
                long: "Full"
            },
            groups: {
                groups: "groups",
                group: "group"
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
                order: {
                    orderCreate: "Order created",
                    orderStatusChanged: "Order status changed",
                    orderBatchStatusChanged: "Order batch status changed",
                    orderCodesRegistered: "Code registered",
                    orderCodesUtilized: "Code applied",
                    orderReportCreated: "Report created",
                    orderClosed: "Order closed",
                    orderRejected: "Order rejected"
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
                    userDelete: "User deletion",
                    orderCreate: "Order created",
                    orderStatusChanged: "Order status changed",
                    orderBatchStatusChanged: "Order batch status changed",
                    orderCodesRegistered: "Code registered",
                    orderCodesUtilized: "Code applied",
                    orderReportCreated: "Report created",
                    orderClosed: "Order closed",
                    orderRejected: "Order rejected"
                }
            },
            categories: {
                all: 'All',
                user: 'Users',
                product: 'product',
                auth: "Authentication",
                organization: "Organization",
                order: "Orders",
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
                chooseDate: "Select date"
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
                applyAll: "Apply all",
                send: "Send",
            },
            navigation: {
                products: "Products",
                management: "Management",
                organization: "Organization",
                organizations: "Organizations",
                myOrganizations: "My organizations",
                users: "Users",
                audit: "System logs",
                markingCodes: "Marking codes",
                agregations: "Aggregations",
                implementation: "Execution",
                deals: "Deals",
                routes: "Routes",
                salesOrders: "Sales Orders",
                deliveryRoutes: "Delivery Routes",
                deliveryTasks: "Delivery Tasks",
                invoices: "Invoices"
            },
            scanner: {
                accepted: "Accepted",
                rejected: "Rejected",
                scan: "Scan",
                latestScans: "Latest scans",
                empty: "No scans yet",
                placeholder: "Scan code",
                codeLabel: "Code",
                reasonLabel: "Reason",
                startScanning: "Start scanning",
                creatingSession: "Starting session...",
                completingSession: "Completing session...",
                startCamera: "Open camera",
                stopCamera: "Stop camera",
                cameraIdle: "Start scanning to open the camera",
                cameraUnsupported: "Camera scanning is not supported on this device",
                cameraError: "Could not access the camera",
                scanFailed: "Scan failed",
                status: {
                    idle: "Camera is not started",
                    starting: "Starting camera",
                    cameraActive: "Camera is running",
                    detected: "Code found: {{code}}",
                    processing: "Processing scan",
                    error: "Scanner error"
                }
            },
            salesOrders: {
                title: "Sales Orders",
                detailsTitle: "Sales Order",
                create: "Create Order",
                listEmpty: "Sales orders list will appear here",
                sections: {
                    company: "Company",
                    customer: "Customer",
                    contract: "Contract",
                    fulfillment: "Fulfillment",
                    items: "Items",
                    comment: "Comment",
                    header: "Header",
                    totals: "Totals",
                    related: "Related entities"
                },
                fields: {
                    company: "Company",
                    orderNumber: "Order number",
                    customerTin: "Customer TIN",
                    customerName: "Customer name",
                    customerAddress: "Customer address",
                    contractNumber: "Contract number",
                    contractDate: "Contract date",
                    dueDate: "Due date",
                    priority: "Priority",
                    product: "Product",
                    quantity: "Quantity",
                    unitPrice: "Unit price",
                    price: "Price/unit",
                    comment: "Comment",
                    status: "Status",
                    createdAt: "Created at",
                    updatedAt: "Updated at",
                    createdBy: "Created by",
                    updatedBy: "Updated by",
                    orderedQuantity: "Ordered quantity",
                    orderedQuantityShort: "Ordered",
                    assignedQuantity: "Assigned quantity",
                    assignedQuantityShort: "Assigned",
                    deliveredQuantity: "Delivered quantity",
                    deliveredQuantityShort: "Delivered",
                    amount: "Amount",
                    amountShort: "Amount",
                    totalAmount: "Total amount"
                },
                table: {
                    orderNumber: "Number",
                    customerName: "Customer name",
                    customerTin: "Customer TIN",
                    dueDate: "Due date",
                    priority: "Priority",
                    orderedQuantity: "Ordered quantity",
                    assignedQuantity: "Assigned quantity",
                    deliveredQuantity: "Delivered quantity",
                    status: "Status",
                    createdAt: "Created at"
                },
                placeholders: {
                    selectCompany: "Select company",
                    customerTin: "TIN",
                    customerName: "Customer name",
                    contractNumber: "Contract number",
                    contractDate: "Contract date",
                    customerAddress: "Customer address",
                    dueDate: "Due date",
                    quantity: "Quantity",
                    unitPrice: "Unit price",
                    itemComment: "Item comment",
                    comment: "Optional comment"
                },
                validation: {
                    companyRequired: "Company is required",
                    customerTinRequired: "TIN is required",
                    customerNameRequired: "Name is required",
                    dueDateRequired: "Due date is required",
                    priorityRequired: "Priority is required",
                    contractNumberRequired: "Contract number is required",
                    contractDateRequired: "Contract date is required",
                    itemProductRequired: "Product is required",
                    itemQuantityRequired: "Quantity is required",
                    itemUnitPriceRequired: "Unit price is required"
                },
                messages: {
                    success: {
                        create: "Sales order created successfully",
                        delete: "Sales order deleted successfully"
                    },
                    error: {
                        create: "Error creating sales order",
                        delete: "Error deleting sales order"
                    }
                },
                deleteQuestion: "Are you sure you want to delete the order",
                priority: {
                    low: "Low",
                    normal: "Normal",
                    high: "High",
                    urgent: "Urgent"
                },
                statuses: {
                    draft: "Draft",
                    confirmed: "Confirmed",
                    partially_assigned: "Partially assigned",
                    assigned: "Assigned",
                    partially_delivered: "Partially delivered",
                    delivered: "Delivered",
                    cancelled: "Cancelled",
                    closed: "Closed"
                },
                hints: {
                    items: "Items table with product, ordered quantity, unit price, amount preview."
                },
                actions: {
                    addItem: "Add item",
                    create: "Create Sales Order"
                },
                modalWindow: {
                    deletion: "Deletion",
                    order: "order"
                },
                details: {
                    headerEmpty: "Order header fields",
                    totalsEmpty: "Ordered / assigned / delivered / amount",
                    itemsEmpty: "Items table",
                    relatedEmpty: "Linked route, task, invoice"
                }
            },
            deliveryRoutes: {
                title: "Delivery Routes",
                detailsTitle: "Delivery Route",
                loadingTitle: "Loading",
                loadingPageTitle: "Route loading",
                loadingSubtitle: "Route",
                returnTitle: "Return",
                returnSubtitle: "Route",
                listEmpty: "Delivery routes list will appear here",
                status: {
                    draft: "Draft",
                    assigned_to_warehouse: "Assigned to warehouse",
                    ready_for_loading: "Ready for loading",
                    loading: "Loading",
                    loaded: "Loaded",
                    in_transit: "In transit",
                    partially_delivered: "Partially delivered",
                    delivered: "Delivered",
                    returning: "Returning",
                    returned: "Returned",
                    closed: "Closed",
                    cancelled: "Cancelled",
                    failed: "Failed"
                },
                sections: {
                    info: "Route info",
                    availableOrders: "Available deals",
                    preview: "Selected orders preview",
                    summary: "Summary",
                    vehicle: "Vehicle",
                    crew: "Crew",
                    totals: "Totals",
                    timestamps: "Timestamps",
                    actions: "Actions",
                    tasks: "Tasks",
                    loading: "Loading",
                    return: "Return",
                    loadingProducts: "Products for loading"
                },
                  fields: {
                      company: "Company",
                      routeNumber: "Route number",
                      status: "Status",
                      routeDate: "Route date",
                      vehicleName: "Vehicle name",
                      vehicle: "Vehicle",
                      plateNumber: "Plate Number",
                      driverName: "Driver name",
                      driver: "Driver",
                      agentName: "Agent name",
                      agent: "Agent",
                      comment: "Comment",
                      taskCount: "Tasks",
                      plannedQuantity: "Product qty",
                      loadedQuantity: "Loaded qty",
                      deliveredQuantity: "Delivered qty",
                      returnedQuantity: "Returned qty",
                      registeredAt: "Registered at",
                      loadingStartedAt: "Loading started at",
                      loadingCompletedAt: "Loading completed at",
                      departedAt: "Departed at",
                      returnStartedAt: "Return started at",
                      returnCompletedAt: "Return completed at",
                      closedAt: "Closed at",
                      remainingToAssign: "Remaining to assign"
                  },
                placeholders: {
                    selectCompany: "Select company",
                    routeDate: "Route date",
                    vehicle: "Vehicle",
                    plateNumber: "Plate Number",
                    driver: "Driver",
                    agent: "Agent"
                },
                  validation: {
                      companyRequired: "Company is required",
                      routeDateRequired: "Route date is required",
                      salesOrdersRequired: "Please select at least one sales order",
                      plateNumberInvalid: "Plate number must be in format: 00 000AAA or 00 0AAA00"
                  },
                messages: {
                    success: {
                        create: "Delivery route created successfully",
                        scanCode: "Code {{code}} scanned successfully"
                    },
                    error: {
                        create: "Error creating delivery route",
                        createScanSession: "Error starting scan session",
                        completeScanSession: "Error completing scan session",
                        scanSessionRequired: "Start a scan session first",
                        scanCode: "Error scanning code",
                        scanCodeDetailed: "Code {{code}} was rejected: {{reason}}"
                    }
                },
                  hints: {
                    availableOrders: "Table of orders with remaining quantity to assign. Add selection and preview here.",
                    preview: "Show count of orders, customers, aggregated products, volume estimate."
                },
                preview: {
                    ordersSelected: "Orders selected",
                    customersCount: "Customers",
                    totalVolume: "Items selected",
                    aggregatedProducts: "Aggregated products",
                    routeDate: "Route Date",
                    vehicleName: "Vehicle",
                    plateNumber: "Plate Number",
                    driver: "Driver",
                    agent: "Agent",
                    company: "Company",
                    selectedOrders: "Selected Orders",
                    customer: "Customer",
                    dueDate: "Due Date",
                    priority: "Priority",
                    orderedQuantity: "Ordered",
                    customersList: "Customers",
                    dueDates: "Due Dates",
                    priorities: "Priorities",
                    totalAmount: "Total Amount",
                    tin: "TIN",
                    address: "Address",
                    contractNumber: "Contract Number",
                    contractDate: "Contract Date",
                    unitPrice: "Unit Price",
                    amount: "Amount",
                    comment: "Comment"
                },
                actions: {
                    create: "Create Route",
                    openLoading: "Open loading screen",
                    openReturn: "Open return screen",
                    completeLoading: "Complete loading",
                    completeReturn: "Complete return"
                },
                details: {
                    summaryEmpty: "Total tasks, customers, ordered/loaded/delivered/returned",
                    crewEmpty: "No crew assigned",
                    tasksEmpty: "Delivery tasks table",
                    loadingEmpty: "Aggregated planned products and scan session",
                    returnEmpty: "Remaining items and return scan"
                },
                taskTable: {
                    taskNumber: "Task number",
                    customer: "Customer",
                    customerTin: "Customer TIN",
                    status: "Status",
                    plannedQuantity: "Planned qty",
                    loadedQuantity: "Loaded qty",
                    deliveredQuantity: "Delivered qty",
                    amount: "Amount",
                    invoice: "Invoice",
                    comment: "Comment"
                },
                loadingCounters: {
                    planned: "Planned quantity",
                    loaded: "Loaded quantity",
                    products: "Products"
                },
                loadingTable: {
                    planned: "Planned",
                    loaded: "Loaded"
                },
                loadingScannerTitle: "Loading scan",
                loadingScannerSubtitle: "Route {{id}} / {{vehicle}}",
                loadingHelper: "Scan codes to load items into the vehicle",
                returnScannerTitle: "Return scan",
                returnScannerSubtitle: "Route {{id}} / Remaining items",
                returnHelper: "Scan items being returned"
            },
            deliveryTasks: {
                title: "Delivery Tasks",
                subtitle: "My tasks",
                detailsTitle: "Delivery Task",
                scanTitle: "Delivery task",
                scanSubtitle: "Customer",
                listEmpty: "My delivery tasks will appear here",
                sections: {
                    header: "Header",
                    summary: "Summary",
                    items: "Planned items",
                    session: "Delivery session",
                    invoice: "Invoice"
                },
                fields: {
                    taskNumber: "Task number",
                    status: "Status",
                    customerName: "Customer",
                    customerTin: "Customer TIN",
                    salesOrderId: "Sales order",
                    deliveryRouteId: "Route",
                    plannedQuantity: "Planned qty",
                    loadedQuantity: "Loaded qty",
                    deliveredQuantity: "Delivered qty",
                    amount: "Amount",
                    comment: "Comment",
                    createdAt: "Created at",
                    updatedAt: "Updated at",
                    loadingStartedAt: "Loading started at",
                    loadingCompletedAt: "Loading completed at",
                    deliveryStartedAt: "Delivery started at",
                    deliveryCompletedAt: "Delivery completed at",
                    invoiceId: "Invoice ID",
                    invoiceStatus: "Invoice status",
                    invoiceExternalId: "External invoice ID",
                    unitPrice: "Unit price"
                },
                actions: {
                    openScan: "Open delivery scan",
                    completeDelivery: "Complete delivery"
                },
                details: {
                    headerEmpty: "Customer, route, order, status",
                    itemsEmpty: "Planned / loaded / delivered",
                    sessionEmpty: "Scan progress and counters",
                    invoiceEmpty: "Invoice status and link"
                },
                scanScannerSubtitle: "Customer / Task {{id}}",
                scanHelper: "Scan codes to deliver items"
            },
            invoices: {
                title: "Invoices",
                detailsTitle: "Invoice",
                listEmpty: "Invoices list will appear here",
                sections: {
                    header: "Header",
                    links: "Links",
                    items: "Items"
                },
                details: {
                    headerEmpty: "Customer, status, externalId",
                    linksEmpty: "Order, route, task links",
                    itemsEmpty: "Items and amounts"
                }
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
                name: "Name",
                edit: "Edit Organization",
                title: "Organizations",
                subtitle: "Total",
                testFlag: "Test",
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
                        companyName: "Company Name",
                        companyType: "Company type",
                        displayName: "Display name",
                        productGroup: "Product Groups",
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
                        deleted: "Deleted",
                        xTraceToken: "XTrace token",
                        expireDate: "Token Expiration Date",
                        businessPlaceId: "Business Place ID"
                    },
                    placeholder: {
                        businessPlaceId: "Enter business place ID",
                        companyName: "Enter company name",
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
                        enterXTraceToken: "Enter X-Trace Token",
                    },
                    validation:{
                        xTrace: {
                            invalidToken: "X-Trace token is invalid",
                            noToken: "No token provided"
                        },
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
                    contactDetails: "Contact details:",
                    legalName: "Legal name: ",
                    name: "Name: ",
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
                        expiration: "Shelf life (days)",
                        unit: "Unit of measurement",
                        amount: "Amount",
                        net: "Net weight",
                        gross: "Gross weight",
                        price: "Price",
                        companyId: "Company ID",
                        manufacturerCountry: "Country of origin",
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
                            shortName: "Product short name is required",
                            manufacturerCountry: "Select a country",
                            requiredField: "This field is required"
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
                independently: "Independently",
                byOperator: "By operator",
                markingCodes: "Marking codes",
                backToOrders: "Back to Orders",
                backToBatches: "Back to Batches",
                orderNumber: "Order",
                applyAll: {
                    confirmApplyAll: "Create utilization reports for all {{count}} batches?",
                    applyAllSuccess: "Successfully created reports: {{success}} out of {{total}}",
                    applyAllPartialError: "Failed to create {{error}} report(s)",
                    noBatchesToApply: "No batches available to apply",
                    unexpectedError: "An unexpected error occurred"
                },
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
                    active: "Active",
                    ready: "Ready",
                    exhausted: "Exhausted",
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
                        aggregated: "Agregated",
                    },
                },
                batches: {
                    title: "Batches",
                    orderNumber: "Order number",
                    orderTime: "Order time",
                    orderStatus: "Order status",
                    turonOrderID: "Turon order ID",
                    sections: {
                        product: "Product & Batch Details",
                        order: "Order Information",
                        batchStatus: "Batch Statuses",
                        orderStatus: "Order Statuses"
                    },
                    batchesOrderStatus: {
                        new: "New",
                        created: "Created",
                        vendor_pending: "Vendor pending",
                        ready_for_codes: "Ready for codes",
                        codes_received: "Codes received",
                        codes_utilization_requested: "Codes utilization_requested",
                        codes_utilized: "Marked",
                        codes_aggregated: "Agregated",
                        rejected: "Rejected",
                        closed: "Closed",
                        error: "Error"
                    },
                    orderNotExternalStatus: {
                        new: "New",
                        vendor_pending: "Vendor pending",
                        ready_for_codes: "Ready for codes",
                        codes_received: "Codes received",
                        codes_utilized: "Marked",
                        codes_utilization_requested:"Utilization requested",
                        codes_partially_utilized: "Partially utilized",
                        codes_partially_aggregated: "Partially agregated",
                        codes_aggregated: "Agregated",
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
                    orderNumber: "Order",
                    productName: "Product name",
                    totalQuantity: "Quantity",
                    externalStatus: "External Status",
                    orderedMCQuantity: "Ordered MC quantity",
                    codesHaveBeenExported: "Have been exported",
                    orderDate: "Order date",
                    packageType: "Packaging",
                    paymentType : "Payment type",
                    status: "Status",
                    paid: "Paid",
                    unPaid: "Unpaid",
                    batchNumber: "Batch",
                    gtin: "GTIN",
                    numberOfMarkingCodes: "Number of Marking Codes",
                    code: "Code",
                },
                orderCreation: {
                    title: "Order Creation",
                    product: "Product",
                    packagingType: "Packaging Type",
                    quantity: "Quantity",
                    serialNumberGenerationMethod: "Generation method",
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
                    chooseGenerationMethod: "Generation method"
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
                title: "Agregation Reports",
                btnAdd: "Add agregation code",
                addAggregation: "Create Report",
                exportGrouped: "Export grouped",
                exportUnit: "Export unit",
                messages: {
                    createSuccess: "Aggregation report has been successfully created.",
                    createError: "Failed to create aggregation report.",
                },
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
                    vendor_pending: "Pending",
                    partially_processed: "Partially",
                    success: "Success",
                    error: "Error",
                },
                addAggregationFields: {
                    parentBatch: "Parent batch",
                    childBatch: "Child batch",
                    packagingDate: "Packaging date",
                },
                agregationReportPage: {
                    productName: "Product Name",
                    codeNumber: "Code number",
                    code: "Code",
                    orders: "Orders",
                    batches: "Batches",
                    aggregation: "Aggregation",
                    aggregations: "Aggregations",
                    quantityPerPackage: "Quantity per Package",
                    aggregationQuantity: "Aggregation Quantity",
                    productionOrderNumber: "Production Order Number",
                    parentOrderNumber: "Parent Order Number",
                    childOrderNumber: "Child Order Number",
                    parentBatchNumber: "Parent Batch Number",
                    childBatchNumber: "Child Batch Number",
                    unitsTable: {
                        unitSerialNumber: "Unit Serial",
                        aggregationItemsCount: "Number of Codes",
                        aggregationUnitCapacity: "Unit Capacity",
                        codesCount: "Codes Count",
                        shouldBeUnbundled: "Should Be Unbundled",
                        state: "Status"
                    },
                    unitState: {
                        active: "Active",
                        inactive: "Inactive",
                        blocked: "Blocked"
                    }
                }
            }
        }
    },
    ru:{
        translation:{
            common:{
                yes: "Да",
                no: "Нет",
                error: "Произошла ошибка. Попробуйте позже.",
                dataNotFound: "Данные не найдены",
                total: "Всего",
                create: "Создать",
                details: "Детали",
                backToList: "Назад к списку",
                backToRoute: "Назад к рейсу",
                backToTask: "Назад к задаче",
                crew: "Экипаж",
                expandAll: "Развернуть все",
                collapseAll: "Свернуть все"
            },
            statuses: {
                active: "Активен",
                inactive: "Неактивен",
                draft: "Черновик",
                assigned_to_warehouse: "Назначен на склад",
                ready_for_loading: "Готов к погрузке",
                planned: "Запланировано",
                loading: "Загрузка",
                loaded: "Загружено",
                handover_in_progress: "Выдача начата",
                delivering: "Доставка",
                in_transit: "В пути",
                partially_delivered: "Частично доставлено",
                delivered: "Доставлено",
                issue_failed: "Ошибка выдачи",
                returning: "Возврат",
                returned: "Возвращено",
                cancelled: "Отменено",
                closed: "Закрыто",
                failed: "Ошибка"
            },
            export: {
                short: "Короткий",
                long: "Полный"
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
                    orderRejected: "Заказ отклонен"
                }
            },
            categories: {
                all: 'Все',
                user: 'Пользователи',
                product: 'Продукты',
                auth: "Аутентификация",
                organization: "Организации",
                order: "Заказы",
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
                chooseDate: "Выберите дату",
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
                applyAll: "Нанести все",
                send: "Отправить",
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
                agregations: "Агрегации",
                implementation: "Реализация",
                deals: "Сделки",
                routes: "Рейсы",
                salesOrders: "Сделки",
                deliveryRoutes: "Рейсы",
                deliveryTasks: "Задачи доставки",
                invoices: "Инвойсы",
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
                }
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
                    items: "Товары",
                    comment: "Комментарий",
                    header: "Шапка",
                    totals: "Итоги",
                    related: "Связанные сущности"
                },
                fields: {
                    company: "Компания",
                    orderNumber: "Номер заказа",
                    customerTin: "ИНН клиента",
                    customerName: "Имя клиента",
                    customerAddress: "Адрес клиента",
                    contractNumber: "Номер договора",
                    contractDate: "Дата договора",
                    dueDate: "Срок",
                    priority: "Приоритет",
                    product: "Товар",
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
                    customerNameRequired: "Имя обязательно",
                    dueDateRequired: "Срок обязателен",
                    priorityRequired: "Приоритет обязателен",
                    contractNumberRequired: "Номер договора обязателен",
                    contractDateRequired: "Дата договора обязательна",
                    itemProductRequired: "Товар обязателен",
                    itemQuantityRequired: "Количество обязательно",
                    itemUnitPriceRequired: "Цена за единицу обязательна"
                },
                messages: {
                    success: {
                        create: "Сделка успешно создана",
                        delete: "Сделка успешно удалена"
                    },
                    error: {
                        create: "Ошибка при создании сделки",
                        delete: "Ошибка при удалении сделки"
                    }
                },
                deleteQuestion: "Вы уверены, что хотите удалить сделку",
                priority: {
                    low: "Низкий",
                    normal: "Обычный",
                    high: "Высокий",
                    urgent: "Срочный"
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
                hints: {
                    items: "Таблица товаров: продукт, количество, цена, сумма для предварительного просмотра."
                },
                actions: {
                    addItem: "Добавить позицию",
                    create: "Создать сделку"
                },
                modalWindow: {
                    deletion: "Удаление",
                    order: "сделку"
                },
                details: {
                    headerEmpty: "Поля заголовка заказа",
                    totalsEmpty: "Заказано / назначено / доставлено / сумма",
                    itemsEmpty: "Таблица товаров",
                    relatedEmpty: "Связанный рейс, задача, инвойс"
                }
            },
            deliveryRoutes: {
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
                    preview: "Предпросмотр выбранных заказов",
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
                      plateNumberInvalid: "Номер машины должен быть в формате: 00 000AAA или 00 0AAA00"
                  },
                  messages: {
                      success: {
                          create: "Рейс успешно создан",
                          scanCode: "Код {{code}} успешно принят"
                      },
                      error: {
                          create: "Ошибка при создании рейса",
                          createScanSession: "Не удалось начать сессию сканирования",
                          completeScanSession: "Не удалось завершить сессию сканирования",
                          scanSessionRequired: "Сначала начните сессию сканирования",
                          scanCode: "Не удалось обработать скан",
                          scanCodeDetailed: "Код {{code}} отклонён: {{reason}}"
                      }
                  },
                  hints: {
                    availableOrders: "Таблица сделок с остатком для распределения. Добавьте выбор и предпросмотр.",
                    preview: "Показать количество сделок, клиентов, агрегированные товары и оценку объема."
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
                    completeReturn: "Завершить возврат"
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
                    loadedQuantity: "Погружено",
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
                fields: {
                    taskNumber: "Номер задачи",
                    status: "Статус",
                    customerName: "Клиент",
                    customerTin: "ИНН клиента",
                    salesOrderId: "Заказ",
                    deliveryRouteId: "Рейс",
                    plannedQuantity: "План",
                    loadedQuantity: "Погружено",
                    deliveredQuantity: "Доставлено",
                    amount: "Сумма",
                    comment: "Комментарий",
                    createdAt: "Создано",
                    updatedAt: "Обновлено",
                    loadingStartedAt: "Погрузка начата",
                    loadingCompletedAt: "Погрузка завершена",
                    deliveryStartedAt: "Доставка начата",
                    deliveryCompletedAt: "Доставка завершена",
                    invoiceId: "ID инвойса",
                    invoiceStatus: "Статус инвойса",
                    invoiceExternalId: "Внешний ID инвойса",
                    unitPrice: "Цена за ед."
                },
                actions: {
                    openScan: "Открыть экран сканирования",
                    completeDelivery: "Завершить доставку"
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
                sections: {
                    header: "Шапка",
                    links: "Связи",
                    items: "Товары"
                },
                details: {
                    headerEmpty: "Клиент, статус, externalId",
                    linksEmpty: "Заказ, рейс, задача",
                    itemsEmpty: "Товары и суммы"
                }
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
                name: "Название",
                testFlag: "Тест",
                edit: "Изменение организации",
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
                        companyName: "Название компании",
                        companyType: 'Тип компании',
                        displayName: 'Отображаемое имя',
                        productGroup: 'Товарные группы',
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
                        deleted: 'Удалено',
                        xTraceToken: "Токен X-Trace",
                        expireDate: "Дата истечения токена",
                        businessPlaceId: "Идентификатор МОД",
                    },
                    placeholder: {
                        businessPlaceId: "Введите Индентификатор МОД",
                        companyName: "Введите название компании",
                        companyType: 'Введите тип компании',
                        displayName: 'Введите отображаемое имя',
                        productGroup: 'Введите группу',
                        tin: 'Введите ИНН',
                        legalName: 'Введите юр. название',
                        director: 'Введите данные директора',
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
                        enterXTraceToken: "Введите токен X-Trace"
                    },
                    validation:{
                        xTrace: {
                            invalidToken: "Невалидный токен",
                            noToken: "Токен не предоставлен"
                        },
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
                    address: 'Адрес:',
                    bankDetails: 'Банковские реквизиты:',
                    contactDetails: 'Контактные данные:',
                    legalName: "Юр. название: ",
                    name: "Название: ",
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
                        expiration: 'Срок годности в днях',
                        unit: 'Единица измерения',
                        amount: 'Количество',
                        net: 'Вес нетто',
                        gross: 'Вес брутто',
                        price: 'Цена',
                        companyId: 'Айди компании',
                        manufacturerCountry: "Страна-производитель",
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
                ip: "IP адрес",
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
                independently: "Самостоятельно",
                byOperator: "Оператором",
                markingCodes: "Коды маркировки",
                backToOrders: "Вернуться к заказам",
                backToBatches: "Вернуться партиям",
                applyAll: {
                    confirmApplyAll: "Создать отчеты о нанесении для всех {{count}} батчей?",
                    applyAllSuccess: "Успешно создано отчетов: {{success}} из {{total}}",
                    applyAllPartialError: "Не удалось создать {{error}} отчет(ов)",
                    noBatchesToApply: "Нет батчей для нанесения",
                    unexpectedError: "Произошла непредвиденная ошибка"
                },
                markingCodesStatusProduct: {
                    received: "Получен",
                    applied: "Нанесен",
                    introduced: "В обороте",
                    withdrawn: "Выведен из оборота",
                    writtenOff: "Списан",
                },
                markingCodesOrderStatus:{
                    created: "Создано",
                    active: "Активный",
                    pending: "В ожидании",
                    ready: "Готово",
                    exhausted: "Исчерпан",
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
                    sections: {
                        product: "Продукт и партия",
                        order: "Информация о заказе",
                        batchStatus: "Статусы партии",
                        orderStatus: "Статусы заказа"
                    },
                    batchesOrderStatus: {
                        new: "Новый",
                        created: "Создан",
                        vendor_pending: "Ожидает поставщика",
                        ready_for_codes: "Готов к кодам",
                        codes_received: "Коды получены",
                        codes_utilization_requested: "Запрошено нанесение кодов",
                        codes_aggregated: "Агрегировано",
                        codes_utilized: "Нанесено",
                        rejected: "Отклонено",
                        closed: "Закрыто",
                        error: "Ошибка"
                    },
                    orderNotExternalStatus: {
                        new: "Новый",
                        vendor_pending: "Ожидает поставщика",
                        ready_for_codes: "Готов к кодам",
                        codes_received: "Коды получены",
                        codes_utilized: "Нанесено",
                        codes_utilization_requested:"Запрошено нанесение",
                        codes_partially_utilized: "Частично нанесен",
                        codes_partially_aggregated: "Частично агрегированы",
                        codes_aggregated: "Агрегировано",
                        rejected: "Отклонено",
                        closed: "Закрыто"
                    },
                    batchData:{
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
                    paymentType : "Тип оплаты",
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
                },
                label:{
                    chooseProduct: "Выберите продукцию",
                    choosePackageType: "Выберите тип упаковки",
                    enterQuantity: "Введите количество",
                    chooseGenerationMethod: "Метод генерации"
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
                title: "Отчеты об агрегации",
                btnAdd: "Создать отчет",
                addAggregation: "Агрегировать",
                exportGrouped: "Экспорт групповых",
                exportUnit: "Экспорт  потребительских",
                messages: {
                    createSuccess: "Отчёт об агрегации успешно создан.",
                    createError: "Не удалось создать отчёт об агрегации.",
                },
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
                    vendor_pending: "Ожидается",
                    partially_processed: "Частично",
                    success: "Успешно",
                    error: "Ошибка",
                },
                addAggregationFields: {
                    parentBatch: "Родительская партия",
                    childBatch: "Дочерняя партия",
                    packagingDate: "Дата упаковки",
                },
                agregationReportPage: {
                    productName: "Название продукта",
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
                    childBatchNumber: "Номер дочерней партии",
                    unitsTable: {
                        unitSerialNumber: "Серийный номер",
                        aggregationItemsCount: "Кол-во кодов",
                        aggregationUnitCapacity: "Кол-во в единице",
                        codesCount: "Кол-во",
                        shouldBeUnbundled: "Требуется разборка",
                        state: "Статус"
                    },
                    unitState: {
                        active: "Активен",
                        inactive: "Неактивен",
                        blocked: "Заблокирован"
                    }
                }
            }
        }
    },
    uz:{
        translation:{
            common:{
                yes: "Ha",
                no: "Yoʻq",
                error: "Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.",
                dataNotFound: "Ma'lumot topilmadi",
                total: "Jami",
                create: "Yaratish",
                details: "Batafsil",
                backToList: "Roʻyxatga qaytish",
                backToRoute: "Reysga qaytish",
                backToTask: "Vazifaga qaytish",
                expandAll: "Barchasini yoyish",
                collapseAll: "Barchasini buklash"
            },
            statuses: {
                active: "Faol",
                inactive: "Faol emas",
                draft: "Taslagi",
                assigned_to_warehouse: "Omborga tayinlash",
                ready_for_loading: "Yuklashga tayyor",
                planned: "Rejalashtirilgan",
                loading: "Yuklash",
                loaded: "Yuklangan",
                handover_in_progress: "Topshirish boshlandi",
                delivering: "Yetkazilmoqda",
                in_transit: "Yo'lda",
                partially_delivered: "Qisman yetkazilgan",
                delivered: "Yetkazilgan",
                issue_failed: "Topshirish xatosi",
                returning: "Qaytarish",
                returned: "Qaytarilgan",
                cancelled: "Bekor qilindi",
                closed: "Yopilgan",
                failed: "Xato"
            },
            export: {
                short: "Qisqa",
                long: "To‘liq"
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
                    orderRejected: "Buyurtma rad etildi"
                }
            },
            categories: {
                all: 'Barchasi',
                user: 'Foydalanuvchilar',
                product: 'Mahsulotlar',
                auth: "Autentifikatsiya",
                companies: "Kompaniyalar",
                organization: "Tashkilot",
                order: "Buyurtmalar",
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
                chooseDate: "Sanani tanlang"
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
                yuborish: "Yuborish",
            },
            navigation: {
                products: "Mahsulotlar",
                management: "Boshqaruv",
                organization: "Tashkilot",
                organizations: "Tashkilotlar",
                myOrganizations: "Mening tashkilotlarim",
                users: "Foydalanuvchilar",
                audit: "Tizim jurnallari",
                markingCodes: "Markirovka kodlari",
                agregations: "Agregatsiyalar",
                implementation: "Ijro",
                deals: "Bitimlar",
                routes: "Reyslar",
                salesOrders: "Sotuv buyurtmalari",
                deliveryRoutes: "Reyslar",
                deliveryTasks: "Yetkazib berish vazifalari",
                invoices: "Hisob-fakturalar",
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
                }
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
                    items: "Tovarlar",
                    comment: "Izoh",
                    header: "Sarlavha",
                    totals: "Jami",
                    related: "Bog'langan obyektlar"
                },
                fields: {
                    company: "Kompaniya",
                    orderNumber: "Buyurtma raqami",
                    customerTin: "Mijoz STIR",
                    customerName: "Mijoz nomi",
                    customerAddress: "Mijoz manzili",
                    contractNumber: "Shartnoma raqami",
                    contractDate: "Shartnoma sanasi",
                    dueDate: "Muddat",
                    priority: "Ustuvorlik",
                    product: "Mahsulot",
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
                    customerNameRequired: "Ism majburiy",
                    dueDateRequired: "Muddat majburiy",
                    priorityRequired: "Ustuvorlik majburiy",
                    contractNumberRequired: "Shartnoma raqami majburiy",
                    contractDateRequired: "Shartnoma sanasi majburiy",
                    itemProductRequired: "Mahsulot majburiy",
                    itemQuantityRequired: "Miqdor majburiy",
                    itemUnitPriceRequired: "Birlik narxi majburiy"
                },
                messages: {
                    success: {
                        create: "Sotuv buyurtmasi muvaffaqiyatli yaratildi",
                        delete: "Sotuv buyurtmasi muvaffaqiyatli o'chirildi"
                    },
                    error: {
                        create: "Sotuv buyurtmasini yaratishda xatolik",
                        delete: "Sotuv buyurtmasini o'chirishda xatolik"
                    }
                },
                deleteQuestion: "Buyurtmani o'chirmoqchimisiz",
                priority: {
                    low: "Past",
                    normal: "Oddiy",
                    high: "Yuqori",
                    urgent: "Shoshilinch"
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
                hints: {
                    items: "Mahsulot, miqdor, narx va summaning preview jadvali."
                },
                actions: {
                    addItem: "Pozitsiya qo'shish",
                    create: "Buyurtma yaratish"
                },
                modalWindow: {
                    deletion: "O'chirish",
                    order: "buyurtma"
                },
                details: {
                    headerEmpty: "Buyurtma sarlavhasi maydonlari",
                    totalsEmpty: "Buyurtma / biriktirilgan / yetkazilgan / summa",
                    itemsEmpty: "Tovarlar jadvali",
                    relatedEmpty: "Bog'langan reys, vazifa, hisob-faktura"
                }
            },
            deliveryRoutes: {
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
                    preview: "Tanlangan buyurtmalar ko'rinishi",
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
                      remainingToAssign: "Taqsimlash uchun qoldiq"
                  },
                placeholders: {
                    selectCompany: "Kompaniyani tanlang",
                    routeDate: "Reys sanasi",
                    vehicle: "Transport",
                    driver: "Haydovchi",
                    agent: "Agent"
                },
                  validation: {
                      companyRequired: "Kompaniya majburiy",
                      routeDateRequired: "Reys sanasi majburiy",
                      salesOrdersRequired: "Iltimos, kamida bitta sotuv buyurtmasini tanlang",
                      plateNumberInvalid: "Mashina raqami formatda bo'lishi kerak: 00 000AAA yoki 00 0AAA00"
                  },
                  messages: {
                      success: {
                          create: "Reys muvaffaqiyatli yaratildi",
                          scanCode: "{{code}} kodi muvaffaqiyatli qabul qilindi"
                      },
                      error: {
                          create: "Reys yaratishda xatolik",
                          createScanSession: "Skan sessiyasini boshlashda xatolik",
                          completeScanSession: "Skan sessiyasini yakunlashda xatolik",
                          scanSessionRequired: "Avval skan sessiyasini boshlang",
                          scanCode: "Skan kodini qayta ishlashda xatolik",
                          scanCodeDetailed: "{{code}} kodi rad etildi: {{reason}}"
                      }
                  },
                  hints: {
                    availableOrders: "Qolgan miqdor ko'rsatilgan buyurtmalar jadvali. Tanlash va preview shu yerda.",
                    preview: "Buyurtmalar, mijozlar, agregatsiya va hajm bahosi ko'rsatiladi."
                },
                preview: {
                    ordersSelected: "Tanlangan buyurtmalar",
                    customersCount: "Mijozlar",
                    totalVolume: "Tanlangan tovarlar",
                    aggregatedProducts: "Agregatsiya qilingan mahsulotlar"
                },
                actions: {
                    create: "Reys yaratish",
                    openLoading: "Yuklash ekranini ochish",
                    openReturn: "Qaytarish ekranini ochish",
                    completeLoading: "Yuklashni yakunlash",
                    completeReturn: "Qaytarishni yakunlash"
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
                    loadedQuantity: "Yuklangan",
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
                fields: {
                    taskNumber: "Vazifa raqami",
                    status: "Holat",
                    customerName: "Mijoz",
                    customerTin: "Mijoz STIR",
                    salesOrderId: "Buyurtma",
                    deliveryRouteId: "Reys",
                    plannedQuantity: "Reja",
                    loadedQuantity: "Yuklangan",
                    deliveredQuantity: "Yetkazilgan",
                    amount: "Summa",
                    comment: "Izoh",
                    createdAt: "Yaratilgan",
                    updatedAt: "Yangilangan",
                    loadingStartedAt: "Yuklash boshlandi",
                    loadingCompletedAt: "Yuklash tugadi",
                    deliveryStartedAt: "Yetkazish boshlandi",
                    deliveryCompletedAt: "Yetkazish tugadi",
                    invoiceId: "Hisob-faktura ID",
                    invoiceStatus: "Hisob-faktura holati",
                    invoiceExternalId: "Tashqi hisob-faktura ID",
                    unitPrice: "Birlik narxi"
                },
                actions: {
                    openScan: "Skan ekranini ochish",
                    completeDelivery: "Yetkazib berishni yakunlash"
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
                sections: {
                    header: "Sarlavha",
                    links: "Bog'lanishlar",
                    items: "Tovarlar"
                },
                details: {
                    headerEmpty: "Mijoz, holat, externalId",
                    linksEmpty: "Buyurtma, reys, vazifa",
                    itemsEmpty: "Tovarlar va summalar"
                }
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
                name: "Nomi",
                testFlag: "Sinov",
                title: "Tashkilotlar",
                edit: "Tashkilotni o'zgartirish",
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
                        companyName: "Kompaniya nomi",
                        companyType: "Kompaniya turi",
                        displayName: "Ko‘rsatiladigan nom",
                        productGroup: "Tovar guruhlari",
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
                    validation:{
                        xTrace: {
                            invalidToken: "X-Trace token noto‘g‘ri",
                            noToken: "Token taqdim etilmadi",
                        },
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
                    contactDetails: "Aloqa ma’lumotlari:",
                    legalName: "Yuridik nomi: ",
                    name: "Nomi: ",
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
                        aggregationQuantity: "Agregatsiya miqdori",
                        expiration: "Yaroqlilik muddati (kunlarda)",
                        unit: "O‘lchov birligi",
                        amount: "Miqdor",
                        net: "Sof og‘irlik",
                        gross: "Brutto og‘irlik",
                        price: "Narx",
                        companyId: "Kompaniya ID",
                        manufacturerCountry: "Ishlab chiqarilgan mamlakat",
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
                            shortName: "Mahsulotning qisqa nomi majburiy",
                            manufacturerCountry: "Mamlakatni tanlang",
                            requiredField: "Ushbu maydon toʻldirilishi shart",
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
                independently: "Mustaqil ravishda",
                byOperator: "Operator tomonidan",
                markingCodes: "Markirovka kodlari",
                backToOrders: "Buyurtmalarga qaytish",
                backToBatches: "Partiyalarga qaytish",
                orderNumber: "Buyurtma",
                applyAll: {
                    confirmApplyAll: "Barcha {{count}} ta partiya uchun qo‘llash hisobotlarini yaratishni tasdiqlaysizmi?",
                    applyAllSuccess: "Muvaffaqiyatli yaratildi: {{total}} tadan {{success}} ta hisobot",
                    applyAllPartialError: "{{error}} ta hisobotni yaratib bo‘lmadi",
                    noBatchesToApply: "Qo‘llash uchun partiyalar mavjud emas",
                    unexpectedError: "Kutilmagan xatolik yuz berdi"
                },
                markingCodesStatusProduct: {
                    received: "Qabul qilindi",
                    applied: "Qo‘llangan",
                    introduced: "Aylanishda",
                    withdrawn: "Aylanishdan chiqarilgan",
                    writtenOff: "Yaroqsizlangan",
                },
                markingCodesOrderStatus:{
                    created: "Yaratildi",
                    active: "Faol",
                    pending: "Kutilmoqda",
                    ready: "Tayyor",
                    rejected: "Rad etildi",
                    exhausted: "Holdan toygan",
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
                    sections: {
                        product: "Mahsulot va partiya maʼlumotlari",
                        order: "Buyurtma maʼlumotlari",
                        batchStatus: "Partiya holatlari",
                        orderStatus: "Buyurtma holatlari"
                    },
                    batchesOrderStatus: {
                        new: "Yangi",
                        created: "Yaratildi",
                        vendor_pending: "Yetkazib beruvchi kutmoqda",
                        ready_for_codes: "Kodlarga tayyor",
                        codes_received: "Kodlar qabul qilindi",
                        codes_utilization_requested: "Kodlardan foydalanish so‘raldi",
                        codes_utilized: "Qo‘llanilgan",
                        codes_aggregated: "Agregatsiyalangan",
                        rejected: "Rad etildi",
                        closed: "Yopildi",
                        error: "Xato"
                    },
                    orderNotExternalStatus: {
                        new: "Yangi",
                        vendor_pending: "Yetkazib beruvchi kutmoqda",
                        ready_for_codes: "Kodlarga tayyor",
                        codes_received: "Kodlar qabul qilindi",
                        codes_utilized: "Qo‘llanilgan",
                        codes_utilization_requested:"Foydalanish so‘ralgan",
                        codes_partially_utilized: "Qisman foydalanilgan",
                        codes_partially_aggregated: "Qisman agregatsiyalangan",
                        codes_aggregated: "Agregatsiyalangan",
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
                    orderNumber: "Buyurtma",
                    productName: "Mahsulot nomi",
                    totalQuantity: "Miqdor",
                    externalStatus: "Tashqi holat",
                    orderedMCQuantity: "Buyurtma qilingan KM soni",
                    codesHaveBeenExported: "Eksport qilindi",
                    orderDate: "Buyurtma sanasi",
                    packageType: "Qadoqlash",
                    paymentType : "Toʻlov turi",
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
                },
                label:{
                    chooseProduct: "Mahsulotni tanlang",
                    choosePackageType: "Qadoq turini tanlang",
                    enterQuantity: "Miqdor kiriting",
                    chooseGenerationMethod: "Generatsiya usuli"
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
                title: "Agregatsiya hisobotlari",
                btnAdd: "Agregatsiya kodini qo'shish",
                addAggregation: "Hisobot yaratish",
                exportGrouped: "Guruhlanganlarni eksport qilish",
                exportUnit: "Yakka birliklarni eksport qilish",
                messages: {
                    createSuccess: "Agregatsiya hisoboti muvaffaqiyatli yaratildi.",
                    createError: "Agregatsiya hisobotini yaratib bo‘lmadi.",
                },
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
                    vendor_pending: "Kutilmoqda",
                    partially_processed: "Qisman",
                    success: "Muvaffaqiyatli",
                    error: "Xatolik",
                },
                addAggregationFields: {
                    parentBatch: "Asosiy partiya",
                    childBatch: "Farzand partiya",
                    packagingDate: "Qadoqlash sanasi",
                },
                agregationReportPage: {
                    productName: "Mahsulot nomi",
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
                    childBatchNumber: "Qaram partiya raqami",
                    unitsTable: {
                        unitSerialNumber: "Birlik seriya",
                        aggregationItemsCount: "Kodlar soni",
                        aggregationUnitCapacity: "Birlik sig‘imi",
                        codesCount: "Kodlar soni",
                        shouldBeUnbundled: "Ajratilishi kerak",
                        state: "Holat"
                    },
                    unitState: {
                        active: "Faol",
                        inactive: "Faol emas",
                        blocked: "Bloklangan"
                    }
                }
            }
        }
    }
}
















