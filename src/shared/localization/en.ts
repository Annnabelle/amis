/**
 * Переводы интерфейса: English.
 *
 * Файл на язык: i18next подгружает только активный, и правка перевода
 * конфликтует лишь с правкой того же языка.
 */
const en = {
  access: {
    sections: {
      references: "Reference data",
      roles: "Roles",
      uploads: "Files",
      scanSessions: "Scanning",
      lifecycle: "Record history",
      jobs: "Background jobs",
      companyImport: "Company import"
    }
  },
  errorBoundary: {
    title: "Something went wrong",
    description: "The page could not be drawn. Try again - if it repeats, reload the page.",
    retry: "Try again",
    reload: "Reload page"
  },
  orders: {
    orderNumber: "Order number"
  },
  statusChange: {
    refresh: "Refresh the list",
    open: "Open",
    offline: "Notifications offline",
    offlineHint: "The notification connection is down: status changes on screen may lag behind. The connection is restored automatically."
  },
  common: {
    yes: "Yes",
    no: "No",
    error: "Something went wrong. Please try again later.",
    requiredDataUnavailable: "Required page data could not be loaded.",
    missingPermissions: "Missing permissions",
    dataNotFound: "Data not found",
    total: "Total",
    loading: "Loading",
    create: "Create",
    details: "Details",
    backToList: "Back to list",
    backToRoute: "Back to route",
    backToTask: "Back to task",
    crew: "Crew",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    expand: "Expand",
    language: "Interface language",
    collapse: "Collapse",
    change: "Change",
    creator: "Creator",
    history: "History",
    createdBy: "Created by",
    updatedBy: "Updated by",
    user: "User",
    userId: "ID",
    email: "Email",
    phone: "Phone",
    status: "Status",
    moreDetails: "More details",
    copied: "Copied",
    cancel: "Cancel"
  },
  welcome: {
    title: "Welcome to AMIS",
    description: "System sections will appear as soon as you receive an invitation from your manager."
  },
  statuses: {
    active: "Active",
    inactive: "Inactive",
    prospective: "Prospective",
    draft: "Draft",
    assigned_to_warehouse: "Assigned to warehouse",
    ready_for_loading: "Ready for loading",
    planned: "Planned",
    loading: "Loading",
    loaded: "Loaded",
    handover_in_progress: "Handover in progress",
    in_transit: "In transit",
    partially_delivered: "Partially delivered",
    delivered: "Delivered",
    issue_failed: "Issue failed",
    returning: "Returning",
    returned: "Returned",
    cancelled: "Cancelled",
    closed: "Closed",
    invoiced: "Invoiced",
    failed: "Failed"
  },
  export: {
    short: "Short",
    long: "Full",
    longWithGroupSnapshot: "Full with group snapshot"
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
      orderRejected: "Order rejected",
      systemEmployeeCreate: "System employee created",
      systemEmployeeUpdate: "System employee updated",
      systemEmployeeDelete: "System employee deleted",
      companyMembershipCreate: "Company membership created",
      companyMembershipUpdate: "Company membership updated",
      companyMembershipDelete: "Company membership deleted",
      emailVerified: "Email verified",
      passwordReset: "Password reset",
      passwordSet: "Password set",
      userCreatedByAdmin: "User created by administrator"
    }
  },
  categories: {
    all: "All",
    user: "Users",
    product: "product",
    auth: "Authentication",
    organization: "Organization",
    order: "Orders"
  },
  search: {
    byName: "Search by name",
    byOrganization: "Search by organization",
    selectProduct: "Select product",
    packageType: "Package type",
    selectStatus: "Select status",
    selectOrderPaymentType: "Select order payment type",
    selectState: "Select state",
    chooseDate: "Select date"
  },
  btn: {
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    search: "Search",
    skip: "Skip",
    finish: "Finish",
    back: "Back",
    toProducts: "Go to products",
    enterCompany: "Enter company",
    sendToTuron: "Send to Turon",
    apply: "Apply",
    applyAll: "Apply all",
    send: "Send",
    copy: "Copy",
    add: "Add"
  },
  navigation: {
    products: "Products",
    management: "Management",
    organization: "Organization",
    organizations: "Organizations",
    myOrganizations: "My organizations",
    exitCompany: "Exit company",
    users: "Users",
    systemEmployees: "Employees",
    leads: "Leads",
    audit: "System logs",
    markingCodes: "Code orders",
    ownedCodes: "Marking codes",
    agregations: "Aggregations",
    implementation: "Execution",
    deals: "Deals",
    routes: "Routes",
    salesOrders: "Sales Orders",
    deliveryRoutes: "Delivery Routes",
    vehicles: "Vehicles",
    deliveryTasks: "Delivery Tasks",
    invoices: "Invoices",
    waybills: "Waybills",
    companyMemberships: "Employees",
    integrations: "Integrations",
    mobileTabs: "Sections",
    groups: {
      marking: "Marking",
      shipping: "Shipments",
      company: "Company"
    },
    openMenu: "Open the menu",
    closeMenu: "Close the menu"
  },
  statusCatalog: {
    lead: {
      internal: {
        new: "New",
        in_progress: "In progress",
        completed: "Completed",
        rejected: "Rejected"
      }
    },
    waybill: {
      internal: {
        draft: "Draft",
        ready: "Ready to send",
        sending: "Sending",
        sent: "Sent",
        registered: "Registered",
        rejected: "Rejected",
        send_failed: "Send failed",
        cancelled: "Cancelled"
      },
      external: {
        Sent: "Sent",
        AwaitCounterparty: "Awaiting counterparty",
        AwaitAction: "Action required",
        AwaitAgreement: "Under agreement",
        AwaitSign: "Under signing",
        AwaitThirdSide: "Awaiting third party",
        AwaitResponsiblePerson: "Awaiting responsible person",
        AwaitResponsiblePersonAccepted: "Awaiting acceptance by responsible person",
        Registered: "Registered",
        Rejected: "Rejected",
        Cancelled: "Cancelled",
        Returned: "Returned",
        Deleted: "Deleted",
        Unknown: "Status unknown"
      }
    },
    markingCodeOrder: {
      internal: {
        new: "Created",
        vendor_pending: "Awaiting the marking system",
        ready_for_codes: "Codes ready to download",
        codes_partially_received: "Codes partially received",
        codes_received: "Codes received",
        codes_utilization_requested: "Code utilization requested",
        codes_partially_utilized: "Codes partially utilized",
        codes_utilized: "Codes utilized",
        codes_partially_aggregated: "Codes partially aggregated",
        codes_aggregated: "Codes aggregated",
        rejected: "Rejected",
        closed: "Closed",
        error: "Error"
      },
      external: {
        CREATED: "Created",
        PENDING: "Processing",
        READY: "Ready",
        REJECTED: "Rejected",
        CLOSED: "Closed",
        OUTSOURCED: "Outsourced"
      }
    },
    markingCodeOrderBatch: {
      internal: {
        new: "Created",
        created: "Registered",
        vendor_pending: "Awaiting the marking system",
        ready_for_codes: "Codes ready to download",
        codes_partially_received: "Codes partially received",
        codes_received: "Codes received",
        codes_utilization_requested: "Code utilization requested",
        codes_utilized: "Codes utilized",
        codes_aggregated: "Codes aggregated",
        rejected: "Rejected",
        closed: "Closed",
        error: "Error"
      },
      external: {
        PENDING: "Processing",
        ACTIVE: "Active",
        EXHAUSTED: "Codes exhausted",
        REJECTED: "Rejected",
        CLOSED: "Closed"
      }
    },
    utilizationReport: {
      internal: {
        new: "Created",
        vendor_pending: "Awaiting the marking system",
        partially_processed: "Partially processed",
        success: "Processed",
        error: "Error"
      },
      external: {
        CREATED: "Created",
        VALIDATING: "Validating",
        IN_PROCESS: "In progress",
        PARTIALLY_PROCESSED: "Partially processed",
        SUCCESS: "Processed",
        ERROR: "Rejected"
      }
    },
    aggregationReport: {
      internal: {
        new: "Created",
        requested: "Requested",
        vendor_pending: "Awaiting the marking system",
        partially_processed: "Partially processed",
        success: "Processed",
        error: "Error"
      },
      external: {
        CREATED: "Created",
        VALIDATING: "Validating",
        IN_PROCESS: "In progress",
        PARTIALLY_PROCESSED: "Partially processed",
        SUCCESS: "Processed",
        ERROR: "Rejected"
      }
    },
    aggregatedCustomsCodeOrder: {
      internal: {
        new: "New",
        generated: "Generated",
        ready_for_sign: "Ready for signing",
        signed_for_registration: "Signed",
        verified_for_registration: "Verified",
        registration_requested: "Registration requested",
        registered: "Registered",
        registration_failed: "Registration rejected",
        dissolution_initialized: "Dissolution initialized",
        signed_for_dissolution: "Dissolution signed",
        verified_for_dissolution: "Dissolution verified",
        dissolution_requested: "Dissolution requested",
        dissolved: "Dissolved",
        dissolution_failed: "Dissolution rejected"
      }
    }
  },
  lifecycle: {
    title: "History",
    subtitle: "Status timeline and integration errors",
    tabs: {
      overview: "Overview",
      lifecycle: "History"
    },
    feedTabs: {
      all: "All",
      internal: "Internal"
    },
    vendors: {
      x_trace: "X-Trace",
      faktura_uz: "Faktura.uz",
      tasnif: "Tasnif"
    },
    scopes: {
      internal: "Internal",
      external: "External system"
    },
    externalHint: "Status reported by {{vendor}}",
    filters: {
      all: "All",
      status: "Statuses",
      error: "Errors"
    },
    groups: {
      today: "Today",
      yesterday: "Yesterday"
    },
    actor: {
      user: "User",
      system: "System",
      vendor: "Vendor"
    },
    origin: {
      ui: "Interface",
      api: "API",
      scheduler: "Scheduler",
      webhook: "Webhook",
      import: "Import",
      migration: "Migration"
    },
    errorClass: {
      transient: "Temporary failure",
      permanent: "Action required",
      conflict: "State conflict",
      unknown: "Unknown error"
    },
    errorHint: {
      transient: "The external service is unavailable, retries continue.",
      permanent: "Check the data or the integration settings.",
      conflict: "Refresh the card: the state has already changed.",
      unknown: ""
    },
    activeError: {
      attempts: "Attempts: {{count}}",
      since: "Since {{date}}",
      open: "Open history"
    },
    fields: {
      code: "Code",
      reason: "Reason",
      comment: "Comment",
      occurrences: "Repeats",
      lastOccurredAt: "Last occurrence",
      requestId: "Request ID",
      causedBy: "Caused by event",
      technical: "Technical details"
    },
    firstStatus: "Initial status",
    total: "Events",
    shown: "Shown: {{count}}",
    loadMore: "Show more",
    empty: "No events yet",
    errors: {
      loadEvents: "Failed to load the timeline",
      loadSummary: "Failed to load the history summary"
    }
  },
  ownedCodes: {
    title: "Owned codes",
    subtitle: "Codes owned by the company, total",
    filters: {
      gtin: "Search by GTIN-14"
    },
    tabs: {
      summary: "Summary",
      codes: "Codes"
    },
    summary: {
      product: "Product",
      packages: "Packaging",
      total: "Codes",
      freshestAt: "Latest confirmation",
      oldestAt: "Oldest confirmation",
      neverSynced: "Ownership has never been confirmed by the vendor",
      unknownGtins: "GTINs outside the catalogue"
    },
    tableTitles: {
      code: "Code",
      gtin: "GTIN",
      packageType: "Packaging",
      status: "Vendor status",
      parentCode: "Parent code",
      lastSyncedAt: "Owned as of"
    },
    statuses: {
      RECEIVED: "Received",
      APPLIED: "Applied",
      INTRODUCED: "In circulation",
      WITHDRAWN: "Withdrawn",
      WRITTEN_OFF: "Written off"
    }
  },
  companyImport: {
    title: "ASL Belgisi import",
    subtitle: "Products, orders, codes and documents pulled from ASL Belgisi",
    start: "Run import",
    running: "Import in progress",
    stageRunning: "Sync in progress",
    busyHint: "A company import is already running - wait for it to finish",
    empty: "The import has never been run",
    currentStage: "Stage: {{stage}}",
    startedAt: "Started",
    finishedAt: "Finished",
    totals: "Done {{done}} of {{queued}}",
    done: "Done {{done}}",
    failed: "Failures: {{count}}",
    tabs: {
      import: "Import"
    },
    statuses: {
      pending: "Queued",
      running: "In progress",
      completed: "Finished",
      failed: "Failed"
    },
    stageStatuses: {
      pending: "Queued",
      running: "In progress",
      completed: "Done",
      failed: "Failed",
      skipped: "Skipped"
    },
    stages: {
      products: "Products",
      orders: "Code orders",
      "order-batches": "Order batches",
      "batch-codes": "Batch codes",
      "owned-codes": "Owned codes",
      documents: "Documents"
    },
    stageHints: {
      products: "The company catalogue and its classification",
      orders: "Marking code orders together with their batches and codes",
      "owned-codes": "Codes the company owns, including those received from partners",
      documents: "The ASL Belgisi document journal"
    },
    startStage: {
      products: "Sync products",
      orders: "Sync orders",
      "owned-codes": "Sync codes",
      documents: "Sync documents"
    },
    startModal: {
      title: "Run import",
      hint: "Pick what to pull. Orders are imported together with their batches and codes.",
      submit: "Run"
    },
    toast: {
      started: "The import has started",
      startError: "Import did not start"
    },
    errors: {
      load: "Failed to load the import state",
      start: "Failed to start the import",
      alreadyRunning: "A company import is already running"
    }
  },
  leads: {
    title: "Leads",
    detailsTitle: "Lead",
    subtitle: "Requests from the AMIS website",
    fields: {
      name: "Name",
      phone: "Phone",
      company: "Company",
      tariff: "Tariff",
      message: "Message",
      status: "Status",
      actions: "Actions",
      comment: "Comment",
      createdAt: "Created",
      updatedAt: "Updated",
      statusChangedBy: "Executor",
      statusChangedAt: "Status changed"
    },
    sections: {
      status: "Status",
      processing: "Processing"
    },
    statuses: {
      new: "New",
      in_progress: "In progress",
      completed: "Completed",
      rejected: "Rejected"
    },
    modal: {
      detailsAction: "Details",
      lead: "Lead",
      changeStatus: "Change status",
      commentPlaceholder: "Add a comment for this status change"
    },
    actions: {
      saveStatus: "Save status",
      startProgress: "Accept for work",
      complete: "Complete",
      reject: "Reject"
    },
    messages: {
      statusUpdated: "Lead status updated",
      statusUpdateError: "Could not update lead status"
    }
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
    },
    stopScanning: "Stop scanning"
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
      paymentMethod: "Payment method",
      items: "Items",
      item: "Item",
      comment: "Comment",
      header: "Header",
      totals: "Totals",
      related: "Related entities"
    },
    createSections: {
      sender: "Sender",
      recipient: "Recipient"
    },
    createFields: {
      companyTin: "TIN",
      companyName: "Company name",
      companyAddress: "Company address",
      region: "Region",
      district: "District",
      address: "Address",
      expectedDate: "Expected date"
    },
    createPlaceholders: {
      companyTin: "TIN",
      companyName: "Company name",
      companyAddress: "Company address",
      region: "Select region",
      district: "Select district",
      address: "Address",
      location: "Pick a point on the map",
      expectedDate: "Expected date"
    },
    createValidation: {
      companyNameRequired: "Company name is required",
      companyAddressRequired: "Company address is required",
      regionRequired: "Select region",
      districtRequired: "Select district",
      addressRequired: "Enter address",
      locationRequired: "Pick a point on the map",
      contractDetailsIncomplete: "Fill in the sender and customer address (region, district, address and map point), contract and delivery",
      expectedDateRequired: "Expected date is required"
    },
    fields: {
      company: "Company",
      orderNumber: "Order number",
      customerTin: "Customer TIN",
      customerName: "Customer name",
      customerAddress: "Customer address",
      customerRegion: "Customer region",
      customerDistrict: "Customer district",
      customerLocation: "Customer coordinates",
      senderAddress: "Sender address",
      senderRegion: "Sender region",
      senderDistrict: "Sender district",
      senderLocation: "Sender coordinates",
      location: "Coordinates",
      contractNumber: "Contract number",
      contractDate: "Contract date",
      dueDate: "Due date",
      priority: "Priority",
      paymentMethod: "Payment method",
      product: "Product",
      packageCode: "Unit of measure",
      packageCodeShort: "Unit",
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
      customerTinDigitsOnly: "TIN must contain digits only",
      customerTinLength: "TIN must consist of 9 digits",
      customerTinInvalid: "Enter a valid TIN",
      customerCompanyNotFound: "A company with this TIN was not found",
      customerNameRequired: "Name is required",
      dueDateRequired: "Due date is required",
      priorityRequired: "Priority is required",
      paymentMethodRequired: "Select a payment method",
      contractNumberRequired: "Contract number is required",
      contractDateRequired: "Contract date is required",
      itemProductRequired: "Product is required",
      itemPackageRequired: "Select a unit of measure",
      itemQuantityRequired: "Quantity is required",
      itemUnitPriceRequired: "Unit price is required",
      costPerKilometerRequired: "Price per 1 km is required"
    },
    messages: {
      success: {
        create: "Sales order created successfully",
        delete: "Sales order deleted successfully"
      }
    },
    deleteQuestion: "Are you sure you want to delete the order",
    priority: {
      low: "Low",
      normal: "Normal",
      high: "High",
      urgent: "Urgent"
    },
    paymentMethods: {
      cash: "Cash",
      transfer: "Bank transfer"
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
    actions: {
      addItem: "Add item",
      create: "Create Sales Order"
    },
    details: {
      headerEmpty: "Order header fields",
      totalsEmpty: "Ordered / assigned / delivered / amount",
      itemsEmpty: "Items table",
      relatedEmpty: "Linked route, task, invoice"
    }
  },
  vehicles: {
    title: "Vehicles",
    deleteQuestion: "Are you sure you want to delete this vehicle?",
    fields: {
      name: "Vehicle name",
      plateNumber: "Plate number",
      comment: "Comment",
      type: "Type",
      brand: "Brand",
      model: "Model",
      year: "Year",
      loadCapacityKg: "Load capacity, kg",
      volumeCapacityM3: "Volume capacity, m3",
      vin: "VIN",
      registrationCertificateNumber: "Registration certificate",
      stateRegistrationModel: "Model (state registry)",
      status: "Status",
      createdAt: "Created",
      updatedAt: "Updated",
      ownershipType: "Ownership",
      ownerTinOrPinfl: "Owner's TIN/PINFL",
      ownerName: "Organization name"
    },
    placeholders: {
      name: "Enter vehicle name",
      plateNumber: "00 A 000 AA",
      comment: "Add a comment",
      brand: "Enter brand",
      model: "Enter model",
      vin: "Enter VIN",
      registrationCertificateNumber: "AA 1234567",
      stateRegistrationModel: "Filled automatically from the registry",
      selectVehicle: "Select vehicle",
      ownerTinOrPinfl: "Enter TIN (9 digits) or PINFL (14 digits)",
      ownerName: "Filled in automatically"
    },
    ownership: {
      checking: "Checking the plate number in the state registry…",
      notRegistered: "No record for this plate number in the state registry",
      found: "Owner confirmed in the state registry"
    },
    ownershipTypes: {
      owned: "Company vehicle",
      external: "External owner"
    },
    ownerLookup: {
      checking: "Looking up the organization…",
      notFound: "Organization not found by this TIN/PINFL"
    },
    types: {
      sedan: "Sedan",
      van: "Van",
      truck: "Truck",
      semi_truck: "Semi truck",
      pickup: "Pickup",
      other: "Other"
    },
    statuses: {
      active: "Active",
      maintenance: "Maintenance",
      out_of_service: "Out of service",
      archived: "Archived"
    },
    details: {
      main: "Main information",
      characteristics: "Characteristics",
      identification: "Identification",
      system: "System information"
    },
    actions: {
      create: "Add vehicle"
    },
    modal: {
      create: "Add vehicle",
      vehicle: "vehicle"
    },
    validation: {
      nameRequired: "Enter vehicle name",
      typeRequired: "Select vehicle type",
      plateNumberRequired: "Enter plate number",
      plateNumberLength: "Plate number must contain 8 characters without spaces",
      plateNumberInvalid: "Plate number must be in format: 00 A 000 AA or 00 000 AAA",
      registrationCertificateNumberInvalid: "Registration certificate must be in format: AA 1234567",
      brandRequired: "Enter brand",
      modelRequired: "Enter model",
      ownerTinOrPinflRequired: "Enter the owner's TIN or PINFL",
      ownerTinOrPinflInvalid: "Enter a valid TIN (9 digits) or PINFL (14 digits)",
      ownerRequired: "Look up a valid organization by TIN/PINFL before saving"
    },
    messages: {
      success: {
        create: "Vehicle created",
        update: "Vehicle updated",
        delete: "Vehicle deleted"
      },
      error: {
        create: "Could not create vehicle",
        update: "Could not update vehicle",
        delete: "Could not delete vehicle",
        load: "Could not load vehicles",
        verifyOwnership: "Could not verify the vehicle owner"
      }
    }
  },
  deliveryRoutes: {
    returnTable: {
      remaining: "Remaining",
      returned: "Returned"
    },
    loadingWarnings: {
      title: "Some products are under-loaded",
      description: "For these products the loaded quantity is below plan. State the reason to finish.",
      commentRequired: "State the reason for the shortfall before finishing loading",
      commentPlaceholder: "State the reason for the shortfall",
      forceComplete: "Finish anyway",
      scanErrors: "Scanning errors",
      deleteScanSubtitle: "Route {{id}} / scan a code to remove it from the load"
    },
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
      preview: "Selected deals preview",
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
    vehicleCard: {
      notFound: "No matching vehicles found"
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
      plateNumberInvalid: "Plate number must be in format: 00 A 000 AA or 00 000 AAA"
    },
    messages: {
      success: {
        create: "Delivery route created successfully",
        close: "Delivery route closed successfully",
        scanCode: "Code {{code}} scanned successfully",
        startTransit: "The vehicle has departed",
        cancelScan: "Scan {{code}} removed"
      },
      error: {
        create: "Error creating delivery route",
        close: "Failed to close delivery route",
        createScanSession: "Error starting scan session",
        completeScanSession: "Error completing scan session",
        scanSessionRequired: "Start a scan session first",
        scanCode: "Error scanning code",
        scanCodeDetailed: "Code {{code}} was rejected: {{reason}}",
        startLoading: "Could not start loading",
        startTransit: "Could not dispatch the vehicle",
        startReturn: "Could not start the return",
        cancelScan: "Could not remove the scan",
        completeReturn: "Could not finish the return"
      }
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
      completeReturn: "Complete return",
      close: "Close route",
      startTransit: "Start transit",
      deleteScan: "Remove",
      deleteByScanning: "Remove by scanning"
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
    table: {
      planned: "Planned",
      delivered: "Handed over",
      products: "Products"
    },
    scanner: {
      deleteSubtitle: "Scan the code to remove it from the handover"
    },
    warnings: {
      title: "Some products are under-delivered",
      description: "For these products the handed-over quantity is below plan. State the reason for the shortfall to finish.",
      commentRequired: "State the reason for the shortfall before finishing the handover",
      commentPlaceholder: "State the reason for the shortfall",
      forceComplete: "Finish anyway",
      scanErrors: "Scanning errors"
    },
    messages: {
      success: {
        cancelScan: "Scan {{code}} removed",
        scanCode: "Code {{code}} scanned"
      },
      error: {
        startDelivery: "Could not start the handover",
        createScanSession: "Could not start the scanning session",
        completeScanSession: "Could not finish the scanning session",
        cancelScan: "Could not remove the scan",
        scanCode: "Scanning error",
        scanCodeDetailed: "Code {{code}} rejected: {{reason}}",
        scanSessionRequired: "Start a scanning session first",
        completeDelivery: "Could not finish the handover"
      }
    },
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
    actions: {
      openScan: "Open delivery scan",
      completeDelivery: "Complete delivery",
      startDelivery: "Start handover",
      deleteScan: "Remove",
      deleteByScanning: "Remove by scanning"
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
    table: {
      invoiceNumber: "Number",
      invoiceDate: "Date",
      sender: "Sender",
      receiver: "Receiver",
      amountWithoutVat: "Amount without VAT",
      itemsQuantity: "Items",
      unitsQuantity: "Units",
      externalStatus: "External status",
      status: "Status",
      createdAt: "Created at"
    },
    itemsTable: {
      productName: "Product",
      quantity: "Quantity",
      measurementUnit: "Unit",
      unitPrice: "Unit price",
      amountWithoutVat: "Amount without VAT",
      taxes: "Taxes",
      vatRate: "VAT",
      exciseRate: "Excise",
      psic: "PSIC",
      reliefId: "Relief"
    },
    codes: {
      title: "Marking codes",
      toggle: "Show marking codes",
      showShort: "Show MC",
      hideShort: "Hide MC",
      empty: "No marking codes",
      code: "Code",
      status: "Status",
      packageType: "Package type"
    },
    file: {
      download: "Download file",
      loadError: "Could not load invoice file",
      openError: "Could not open file in a new tab"
    },
    statuses: {
      created: "Created",
      in_review: "In review",
      approved: "Approved",
      sent: "Sent",
      pending: "Pending",
      completed: "Completed",
      rejected: "Rejected",
      canceled: "Canceled",
      returned: "Returned",
      unknown: "Unknown",
      registered: "Registered",
      deleted: "Deleted"
    },
    externalStatuses: {
      None: "Unavailable",
      AwaitContractor: "Awaiting contractor response",
      AwaitAction: "Signature required",
      Rejected: "Rejected by contractor",
      Archived: "Published",
      AwaitAgreement: "Awaiting agreement",
      AwaitSign: "Awaiting signature",
      Deleted: "Deleted",
      AwaitThirdSide: "Awaiting trusted party response",
      ArchiveCancelRequested: "Cancellation requested",
      AwaitCancelArchiveRequest: "Cancellation under review",
      RejectArchiveCancelRequest: "Cancellation rejected",
      ArchiveCanceled: "Canceled",
      AgreementAgreed: "Agreement confirmed",
      AgreementReject: "Agreement rejected",
      SigningSigned: "Signed",
      SigningReject: "Not signed",
      AwaitDecline: "Awaiting decline",
      VerifiedBySystem: "Verified by system",
      AwaitResponsiblePerson: "Awaiting responsible person",
      ResponsiblePersonAccepted: "Accepted by responsible person",
      AwaitResponsiblePersonAccepted: "Awaiting responsible person acceptance",
      ResponsiblePersonRejected: "Rejected by responsible person",
      ResponsiblePersonTillReturned: "Returned by responsible person",
      ResponsiblePersonReturned: "Returned by responsible person after transfer",
      ReturnAccepted: "Returned",
      AwaitReturnAccept: "Awaiting return confirmation"
    },
    sections: {
      header: "Header",
      links: "Links",
      items: "Items",
      totals: "Totals",
      contract: "Contract",
      file: "File"
    },
    fields: {
      invoiceNumber: "Invoice number",
      invoiceDate: "Invoice date",
      createdAt: "Created at",
      currency: "Currency",
      internalStatus: "Internal status",
      externalStatus: "External status",
      amountWithoutVat: "Amount without VAT",
      itemsQuantity: "Items",
      unitsQuantity: "Units",
      contractNumber: "Contract number",
      contractDate: "Contract date",
      sender: "Sender",
      receiver: "Receiver",
      name: "Name",
      tin: "TIN",
      companyId: "Company ID",
      address: "Address",
      salesOrderId: "Sales order",
      deliveryRouteId: "Delivery route",
      deliveryTaskId: "Delivery task",
      filename: "Filename",
      programVersion: "Program version",
      formatVersion: "Format version",
      comment: "Comment"
    }
  },
  waybills: {
    units: {
      km: "km"
    },
    title: "Waybills",
    detailsTitle: "Waybill",
    listEmpty: "Waybills list will appear here",
    table: {
      waybillNumber: "Number",
      date: "Date",
      route: "Route",
      sender: "Sender",
      consignee: "Consignee",
      deliveryCost: "Delivery cost",
      grossWeight: "Gross weight",
      externalStatus: "External status",
      status: "Status",
      createdAt: "Created at"
    },
    file: {
      download: "Download file",
      loadError: "Could not load waybill file",
      openError: "Could not open file in a new tab"
    },
    statuses: {
      draft: "Draft",
      ready: "Ready",
      sending: "Sending",
      sent: "Sent",
      registered: "Registered",
      rejected: "Rejected",
      send_failed: "Send failed",
      cancelled: "Cancelled",
      unknown: "Unknown"
    },
    externalStatuses: {
      Sent: "Sent",
      AwaitCounterparty: "Awaiting counterparty",
      AwaitAction: "Action required",
      AwaitAgreement: "Awaiting agreement",
      AwaitSign: "Awaiting signature",
      AwaitThirdSide: "Awaiting third side",
      AwaitResponsiblePerson: "Awaiting responsible person",
      AwaitResponsiblePersonAccepted: "Awaiting responsible person acceptance",
      Registered: "Registered",
      Rejected: "Rejected",
      Cancelled: "Cancelled",
      Returned: "Returned",
      Deleted: "Deleted",
      Unknown: "Unknown"
    },
    deliveryTypes: {
      warehouse_to_warehouse: "Warehouse to warehouse",
      seller_to_buyer: "Seller to buyer",
      processing_transfer: "Processing transfer"
    },
    transportTypes: {
      road: "Road",
      air: "Air",
      rail: "Rail",
      water: "Water"
    },
    sections: {
      links: "Links",
      totals: "Totals",
      contract: "Contract",
      file: "File",
      delivery: "Delivery",
      transport: "Transport",
      signers: "Signers",
      cargoGroups: "Cargo groups",
      overview: "Overview",
      parties: "Parties",
      cargo: "Cargo",
      system: "System"
    },
    fields: {
      waybillNumber: "Waybill number",
      date: "Waybill date",
      createdAt: "Created at",
      updatedAt: "Updated at",
      internalStatus: "Internal status",
      externalStatus: "External status",
      deliveryCost: "Delivery cost",
      grossWeight: "Gross weight",
      netWeight: "Net weight",
      contractNumber: "Contract number",
      contractDate: "Contract date",
      deliveryType: "Delivery type",
      costPerDistanceUnit: "Cost per distance unit",
      costPerKilometer: "Price per 1 km",
      sum: "UZS",
      totalDistance: "Total distance",
      geoDistanceFallbackTooltip: "Route is unavailable, direct distance between selected points is shown",
      deliveryTotalCost: "Total delivery cost",
      totalCost: "Total cost",
      transportType: "Transport type",
      driver: "Driver",
      driverPinfl: "Driver PINFL",
      truck: "Truck",
      trailer: "Trailer",
      sender: "Sender",
      consignor: "Consignor",
      consignee: "Consignee",
      carrier: "Carrier",
      freightForwarder: "Freight forwarder",
      client: "Client",
      payer: "Payer",
      name: "Name",
      tin: "TIN",
      tinOrPinfl: "TIN/PINFL",
      vatCode: "VAT code",
      branch: "Branch",
      phone: "Phone",
      address: "Address",
      approver: "Approver",
      director: "Director",
      accountant: "Accountant",
      responsiblePerson: "Responsible person",
      salesOrderId: "Sales order",
      deliveryRouteId: "Delivery route",
      deliveryTaskId: "Delivery task",
      externalId: "External ID",
      sentAt: "Sent at",
      registeredAt: "Registered at",
      loadingPoint: "Loading point",
      unloadingPoint: "Unloading point",
      cargoGroup: "Cargo group",
      cargoGroups: "Cargo groups",
      products: "Products",
      product: "Product",
      quantity: "Quantity",
      pricePerItem: "Price",
      productDeliveryCost: "Delivery",
      carriages: "Carriages"
    }
  },
  users: {
    status: {
      active: "Active",
      inactive: "Inactive"
    },
    title: "Users",
    subtitle: "Total",
    btnAdd: "Add user",
    logOut: "Log out",
    companies: "User's companies",
    deleteUserQuestion: "Are you sure you want to delete the user",
    messages: {
      success: {
        createUser: "User created successfully",
        activationEmailSent: "User created — an activation email has been sent",
        updateUser: "User updated successfully",
        deleteUser: "User deleted successfully"
      },
      error: {
        createUser: "Error creating user",
        updateUser: "Error updating user",
        deleteUser: "Error deleting user",
        loadUsers: "Error searching for users",
        loadAccess: "Error loading user access"
      }
    },
    addUserForm: {
      label: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        role: "Role",
        pinfl: "PINFL",
        password: "Password",
        phone: "Phone",
        lastLoggedInAt: "Last logged in at"
      },
      placeholder: {
        firstName: "Enter first name",
        lastName: "Enter last name",
        email: "Enter email",
        role: "Enter role",
        pinfl: "Enter PINFL",
        password: "Enter password",
        phone: "Enter phone number"
      },
      required: {
        firstName: "Please enter your first name",
        lastName: "Please enter your last name",
        phone: "Please enter your phone number",
        email: "Please enter your email",
        role: "Please select a role",
        password: "Please enter your password",
        pinfl: "Please enter PINFL"
      },
      pattern: {
        phone: "Please enter a valid phone number",
        email: "Please enter a valid email",
        pinfl: "PINFL must contain 14 digits",
        passwordMinLength: "Password must be at least 6 characters"
      },
      activationHint: "The user will receive an email to set their password and activate the account."
    },
    modalWindow: {
      deletion: "Deletion",
      user: "user",
      editing: "Editing",
      viewing: "Viewing",
      adding: "Adding"
    },
    details: {
      title: "User",
      profile: "Profile",
      personalData: "Personal data",
      accessSummary: "Access summary",
      systemAccess: "System access",
      enabled: "Enabled",
      notAssigned: "Not assigned",
      noSystemAccess: "No system access",
      noCompanies: "No companies"
    }
  },
  systemEmployees: {
    title: "Employees",
    subtitle: "Invitations and roles",
    fields: {
      role: "Role",
      roles: "Roles",
      state: "State",
      userStatus: "User status",
      existingUser: "Existing user",
      createdAt: "Created",
      updatedAt: "Updated",
      invitedBy: "Invited by"
    },
    states: {
      active: "Active",
      invited: "Invited",
      declined: "Declined",
      disabled: "Disabled"
    },
    actions: {
      invite: "Invite",
      sendInvitation: "Send invitation",
      editRoles: "Edit",
      saveRoles: "Save roles",
      revoke: "Revoke",
      accept: "Accept",
      decline: "Decline"
    },
    placeholders: {
      search: "Search by name or email",
      searchUsers: "Search users",
      selectRoles: "Select roles"
    },
    validation: {
      userRequired: "Select an existing user",
      rolesRequired: "Select at least one role"
    },
    messages: {
      success: {
        invite: "Invitation sent",
        update: "Roles updated",
        revoke: "Access revoked"
      },
      error: {
        invite: "Could not send invitation",
        update: "Could not update roles",
        revoke: "Could not revoke access"
      }
    },
    modal: {
      inviteTitle: "Invite employee",
      inviteAction: "Invite",
      detailsAction: "System",
      editAction: "Edit",
      revokeAction: "Revoke",
      employee: "employee",
      systemAccess: "system access"
    },
    invitations: {
      title: "You have been invited to AMIS",
      rolesPrefix: "with roles:"
    },
    revokeQuestion: "Revoke system access?"
  },
  companyMemberships: {
    title: "Employees",
    subtitle: "Company access and roles",
    fields: {
      role: "Role",
      roles: "Roles",
      state: "State",
      userStatus: "User status",
      existingUser: "Existing user",
      createdAt: "Created",
      updatedAt: "Updated",
      invitedBy: "Invited by"
    },
    states: {
      active: "Active",
      invited: "Invited",
      declined: "Declined",
      disabled: "Disabled"
    },
    actions: {
      invite: "Invite",
      sendInvitation: "Send invitation",
      editRoles: "Edit",
      saveRoles: "Save roles",
      revoke: "Revoke",
      accept: "Accept",
      decline: "Decline"
    },
    placeholders: {
      searchUsers: "Search users",
      searchUserByEmail: "Enter full user email",
      selectRoles: "Select roles"
    },
    validation: {
      userRequired: "Select an existing user",
      emailRequired: "Enter user email",
      emailInvalid: "Enter a valid email",
      userNotFound: "User with this email was not found",
      rolesRequired: "Select at least one role"
    },
    messages: {
      success: {
        invite: "Invitation sent",
        update: "Roles updated",
        revoke: "Access revoked"
      },
      error: {
        invite: "Could not send invitation",
        update: "Could not update roles",
        revoke: "Could not revoke access"
      }
    },
    modal: {
      inviteTitle: "Invite employee",
      detailsAction: "Company",
      editAction: "Edit",
      revokeAction: "Revoke",
      member: "employee",
      companyAccess: "company access"
    },
    invitations: {
      title: "You have been invited to a company",
      rolesPrefix: "with roles:"
    },
    revokeQuestion: "Revoke company access?"
  },
  organizations: {
    name: "Name",
    edit: "Edit Organization",
    title: "Organizations",
    subtitle: "Total",
    testFlag: "Test",
    btnAdd: "Add organization",
    status: "Status",
    assignToCompany: "Assign to company",
    deleteUserQuestion: "Are you sure you want to delete the organization",
    actions: {
      activate: "Activate"
    },
    integrations: {
      receivedData: "Received data",
      notConfigured: "Not configured",
      steps: {
        company: "Company",
        xTrace: "X-Trace",
        fakturaUz: "Faktura.uz"
      },
      xTrace: {
        title: "X-Trace integration",
        cardTitle: "X-Trace"
      },
      fakturaUz: {
        title: "Faktura.uz integration",
        cardTitle: "Faktura.uz",
        username: "Username",
        password: "Password",
        clientId: "Client ID",
        clientSecret: "Client secret",
        validation: {
          username: "Username is required",
          password: "Password is required",
          clientId: "Client ID is required",
          clientSecret: "Client secret is required"
        }
      }
    },
    messages: {
      success: {
        createUser: "Organization successfully created",
        activateCompany: "Company activated",
        createXTraceIntegration: "X-Trace integration created",
        createFakturaUzIntegration: "Faktura.uz integration created",
        updateUser: "Organization successfully updated",
        deleteUser: "Organization successfully deleted",
        assignOrganization: "User successfully assigned to company",
        unassignOrganization: "User successfully unassigned from company"
      },
      error: {
        createUser: "Error while creating organization",
        activateCompany: "Error while activating company",
        createXTraceIntegration: "Error while creating X-Trace integration",
        createFakturaUzIntegration: "Error while creating Faktura.uz integration",
        updateUser: "Error while updating organization",
        deleteUser: "Error while deleting organization",
        unassignOrganization: "Error while unassigning user from company"
      }
    },
    addUserForm: {
      label: {
        companyName: "Company Name",
        name: "Name",
        companyType: "Company type",
        displayName: "Display name",
        productGroup: "Product Groups",
        tin: "TIN",
        pinfl: "PINFL",
        vatCode: "VAT code",
        createdAt: "Created at",
        legalName: "Legal name of the organization",
        director: "Director",
        accountant: "Accountant",
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
        enterXTraceToken: "Enter X-Trace Token"
      },
      validation: {
        xTrace: {
          invalidToken: "X-Trace token is invalid",
          noToken: "No token provided"
        },
        required: {
          tin: "Please enter TIN",
          productGroup: "Please enter the product group name",
          companyType: "Please select the company type",
          displayName: "Please enter the company name",
          legalName: "Please enter the legal company name",
          director: "Please enter the director’s name",
          region: "Please enter the region",
          district: "Please enter the district",
          address: "Please enter the address",
          bankName: "Please enter the bank name",
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
          gtin: "GTIN is required",
          token: "Enter the token",
          businessPlaceId: "Enter the business place ID"
        },
        pattern: {
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
          passwordMinLength: "Password must be at least 8 characters long",
          gtin: "Enter a valid GTIN (14 digits)"
        }
      }
    },
    subtitles: {
      address: "Address:",
      bankDetails: "Bank details:",
      contactDetails: "Contact details:",
      legalName: "Legal name: ",
      name: "Name: "
    },
    modalWindow: {
      deletion: "Deletion",
      organization: "organization",
      editing: "Editing",
      viewing: "Viewing",
      adding: "Adding"
    }
  },
  products: {
    title: "Products",
    subtitle: "Total",
    btnAdd: "Add product",
    status: "Status",
    view: "View product",
    edit: "Edit product",
    deleteUserQuestion: "Are you sure you want to delete the product?",
    messages: {
      success: {
        createProduct: "Product successfully created",
        updateProduct: "Product successfully updated",
        deleteProduct: "Product successfully deleted"
      },
      error: {
        createProduct: "Error while creating product",
        updateProduct: "Error while updating product",
        deleteProduct: "Error while deleting product",
        invalidExpiration: "Expiration must be an integer with up to 2 digits"
      }
    },
    gtin: {
      unit: "GTIN consumer packaging",
      group: "GTIN group packaging",
      box_lv_1: "GTIN box",
      box_lv_2: "GTIN pallet"
    },
    classification: {
      title: "Classification",
      icps: "ICPS",
      name: "Name",
      source: "Source",
      resolvedAt: "Resolved at",
      empty: "Not classified yet"
    },
    validation: {
      required: "This field is required",
      min2: "Minimum length is 2 characters",
      max10: "Maximum length is 10 characters",
      max200: "Maximum length is 200 characters",
      number: "Enter a valid number",
      decimal: "Enter a valid number (integer or decimal)",
      icps: "Enter a valid ICPS (14 digits)",
      price: "Enter a valid price"
    },
    addProductForm: {
      label: {
        name: "Name",
        shortName: "Short name",
        description: "Description",
        gtin: "GTIN",
        barcode: "Barcode",
        icps: "ICPS",
        brand: "Brand",
        productType: "Product type",
        aggregationQuantity: "Aggregation quantity",
        expiration: "Shelf life (days)",
        unit: "Unit of measurement",
        amount: "Amount",
        net: "Net weight",
        gross: "Gross weight",
        price: "Price",
        companyId: "Company ID",
        manufacturerCountry: "Country of origin"
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
        manufacturerCountry: "Enter country"
      },
      validation: {
        required: {
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
        pattern: {
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
    details: {
      main: "Main information",
      gtin: "GTIN codes",
      measurement: "Measurement & weight",
      description: "Description",
      packages: "Packages"
    },
    packages: {
      empty: "No packages found for this product",
      fields: {
        code: "Code",
        type: "Type",
        name: "Name"
      },
      messages: {
        error: "Failed to load product packages"
      }
    },
    modalWindow: {
      deletion: "Deletion",
      product: "product",
      editing: "Editing",
      viewing: "Viewing",
      adding: "Adding"
    }
  },
  login: {
    messages: {
      successLogin: "Successful login",
      errorLogin: "Login error, check your username and password"
    },
    btn: {
      login: "Login",
      signIn: "Sign in"
    },
    enterUserName: "Enter username",
    username: "Username"
  },
  auth: {
    backToLogin: "Back to login",
    goToLogin: "Go to login",
    errors: {
      missingToken: "The link is missing its token. Please open the link from the email again."
    },
    register: {
      title: "Create account",
      submit: "Register",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      messages: {
        error: "Registration failed. Please try again."
      },
      checkInbox: {
        title: "Check your inbox",
        intro: "We sent a confirmation link to:",
        hint: "Open it to verify your email, then sign in."
      }
    },
    verifyEmail: {
      title: "Email verification",
      loading: "Verifying your email…",
      error: "We could not verify your email.",
      errorTitle: "Verification failed",
      successTitle: "Email verified",
      successDescription: "Your email has been confirmed. You can sign in now."
    },
    activate: {
      title: "Set your password",
      subtitle: "Create a password to activate your account.",
      submit: "Activate account",
      error: "We could not activate your account.",
      errorTitle: "Activation failed",
      successTitle: "Account activated",
      successDescription: "Your password is set and your email is verified. You can sign in now.",
      passwordsDontMatch: "Passwords do not match.",
      label: {
        password: "Password",
        confirmPassword: "Confirm password"
      },
      placeholder: {
        confirmPassword: "Repeat the password"
      },
      required: {
        confirmPassword: "Please confirm your password"
      }
    },
    passwordMinLength: "Password must be at least 6 characters",
    forgotPassword: {
      link: "Forgot password?",
      title: "Reset your password",
      subtitle: "Enter your email and we'll send you a reset link.",
      submit: "Send reset link",
      emailLabel: "Email",
      checkInbox: {
        title: "Check your inbox",
        intro: "If an account with this email exists, we sent a password reset link to:",
        hint: "Open the link to set a new password. Check your spam folder if you don't see it."
      }
    },
    resetPassword: {
      title: "Set a new password",
      subtitle: "Choose a new password for your account.",
      submit: "Reset password",
      successTitle: "Password updated",
      successDescription: "Your password has been changed. You can sign in now.",
      errorTitle: "Reset failed",
      error: "We could not reset your password.",
      passwordsDontMatch: "Passwords do not match.",
      label: {
        password: "New password",
        confirmPassword: "Confirm password"
      },
      placeholder: {
        password: "Enter a new password",
        confirmPassword: "Repeat the password"
      },
      required: {
        confirmPassword: "Please confirm your password"
      }
    }
  },
  me: {
    title: "My profile",
    loadError: "Could not load your profile.",
    changePassword: "Change password"
  },
  changePwd: {
    title: "Change Password",
    confirmModal: {
      title: "Are you sure you want to change the password?",
      subtitle: "Enter your current password to confirm the change.",
      btn: {
        confirm: "Confirm",
        cancel: "Cancel"
      }
    },
    changePasswordForm: {
      message: {
        passwordsDontMatch: "Passwords do not match.",
        error: "Error when changing password",
        success: "Password changed successfully"
      },
      label: {
        currentPassword: "Current password",
        newPassword: "New password",
        newPasswordConfirmation: "New password confirmation"
      },
      placeholder: {
        currentPassword: "Enter current password",
        newPassword: "Enter new password",
        newPasswordConfirmation: "Confirm new password"
      },
      required: {
        currentPassword: "Enter your current password",
        newPasswordRequired: "Enter your current password",
        newPassword: "Password must be at least 6 characters long."
      }
    }
  },
  auditLog: {
    title: "System logs",
    subtitle: "Monitoring and analysis of user activity",
    ip: "IP address",
    id: "Request ID",
    committed: "Performed by",
    target: "Action purpose"
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
      applyAllPartialError: "Failed to create {{error}} report(s)",
      noBatchesToApply: "No batches available to apply",
      unexpectedError: "An unexpected error occurred"
    },
    utilization: {
      createdOne: "Utilization report {{number}} created",
      createdMany: "Utilization reports created: {{count}}"
    },
    orderProduct: {
      markingCodesStatus: {
        received: "Received",
        applied: "Applied",
        introduced: "In circulation",
        withdrawn: "Withdrawn from circulation",
        aggregated: "Agregated",
        reserved_for_aggregation: "Reserved for aggregation",
        written_off: "Written off",
        reserved_for_delivery: "Reserved for delivery",
        loaded: "Loaded",
        in_transit: "In transit",
        delivered: "Delivered"
      }
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
      batchData: {
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
        order: {

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
      paymentType: "Payment type",
      status: "Status",
      paid: "Paid",
      unPaid: "Unpaid",
      batchNumber: "Batch",
      gtin: "GTIN",
      numberOfMarkingCodes: "Number of Marking Codes",
      code: "Code"
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
      differentProductsWarning: "Please note, you selected different product names"
    },
    label: {
      chooseProduct: "Choose product",
      choosePackageType: "Choose package type",
      enterQuantity: "Enter quantity",
      chooseGenerationMethod: "Generation method",
      duplicatePackageType: "This package type is already selected for this product"
    },
    packageType: {
      unit: "Consumer",
      group: "Group",
      box_lv_1: "Box",
      box_lv_2: "Pallet"
    }
  },
  customsCodes: {
    title: "ACC",
    subtitle: "Creation and registration of aggregated import codes",
    table: {
      number: "No.",
      accOrderNumber: "ACC order",
      product: "Product",
      customsCode: "ACC",
      quantity: "Quantity",
      measurement: "Unit",
      document: "Document",
      status: "Status"
    },
    actions: {
      create: "Create ACC",
      creating: "Creating",
      dissolve: "Dissolve",
      sign: "Sign",
      signing: "Signing",
      signAndSend: "Sign and send",
      resume: "Retry"
    },
    messages: {
      createSuccess: "ACC order has been created.",
      createError: "Failed to create ACC order.",
      loadError: "Failed to load ACC orders",
      documentMissing: "The backend did not return a document for signing.",
      selectKey: "Select an E-IMZO key.",
      signSuccess: "The document has been signed and sent for verification.",
      signError: "Failed to sign the document",
      dissolutionInitiated: "Dissolution has been initialized.",
      dissolutionError: "Failed to initialize dissolution.",
      documentPending: "The document for signing is not ready yet. Open the order once the status becomes \"Ready for signing\".",
      resumeStarted: "Processing has been restarted.",
      resumeError: "Failed to restart processing."
    },
    eImzoErrors: {
      noDescription: "E-IMZO did not return an error description.",
      keyNotFound: "Key was not found. Check that the key file is in the DSKEYS folder.",
      badPassword: "Invalid key password.",
      notResponding: "E-IMZO is not responding. Try again.",
      unavailable: "E-IMZO is unavailable. Start e-imzo.exe and try again.",
      connectionClosed: "E-IMZO connection was closed. Start e-imzo.exe and try again.",
      keyIdMissing: "E-IMZO did not return a key id.",
      signedDocumentMissing: "E-IMZO did not return a signed document.",
      certificateDateMissing: "Could not check the certificate validity period. Select another key or restart E-IMZO.",
      certificateNotYetValid: "The selected certificate is not active yet.",
      certificateExpired: "The selected certificate has expired. Select an active key.",
      certificateInactive: "The selected certificate is inactive or revoked. Select an active key.",
      certificateInvalid: "The selected certificate is invalid. Select another key."
    },
    signModal: {
      title: "ACC signing",
      registrationTitle: "ACC signing",
      dissolutionTitle: "ACC dissolution signing",
      hint: "Before signing, start e-imzo.exe and put the key into the DSKEYS folder.",
      openApp: "Open E-IMZO",
      openAppHint: "If the browser asks for permission, allow opening E-IMZO, then wait a few seconds.",
      document: "Document",
      selectKey: "Select an E-IMZO key",
      keysNotFound: "No keys found"
    },
    createModal: {
      title: "Create ACC",
      hint: "Select a utilized batch. After creation, the backend will generate the ACC and prepare the document for signing automatically.",
      selectProduct: "Filter by product",
      productsNotFound: "No products found",
      selectBatch: "Select batch",
      batchesNotFound: "No suitable batches found"
    },
    details: {
      title: "ACC order details",
      loadError: "Failed to load ACC order details",
      sections: {
        general: "General information",
        documents: "Documents",
        processing: "Processing"
      },
      fields: {
        orderId: "Order ID",
        batchId: "Batch ID",
        productId: "Product ID",
        createdBy: "Created by",
        registrationDocument: "Registration document",
        dissolutionDocument: "Dissolution document",
        processingStep: "Processing step",
        processingAttempts: "Attempts",
        notGenerated: "Not generated",
        processingStalled: "Processing has stopped: the job ran out of attempts and awaits triage. Press \"Retry\" to run the step again."
      }
    }
  },
  aggregations: {
    title: "Agregation Reports",
    btnAdd: "Add agregation code",
    addAggregation: "Create Report",
    exportGrouped: "Export grouped",
    exportUnit: "Export unit",
    messages: {
      createSuccess: "Aggregation report has been successfully created.",
      createError: "Failed to create aggregation report."
    },
    aggregationsTableTitle: {
      status: "Status",
      orderDate: "Order date",
      quantityPerPackage: "Quantity per package",
      numberOfPackages: "Number of packages",
      productName: "Product name",
      childBatch: "Child batch",
      parentBatch: "Parent batch",
      aggregationReportNumber: "Aggregation report number"
    },
    addAggregationFields: {
      parentBatch: "Parent batch",
      childBatch: "Child batch",
      packagingDate: "Packaging date"
    },
    agregationReportPage: {
      productName: "Product Name",
      parentCode: "Parent code",
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
      childBatchNumber: "Child Batch Number"
    }
  }
};

export default en;


