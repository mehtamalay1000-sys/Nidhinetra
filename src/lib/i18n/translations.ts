// Nidhiनेत्र: Localization Dictionary (English & Marathi)
// Smart India Hackathon 2026 — UX4G 3.0 & GIGW Compliance

export type Language = 'en' | 'mr';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Identity
    appName: 'Nidhiनेत्र',
    appSubtitle: 'Public Project Monitoring & Ground Verification',
    appTagline: 'See the project. Verify the progress. Track the action.',
    govPortalNotice: 'Government Services Style Interface | Demo e-Governance Portal',
    sihNotice: 'Smart India Hackathon 2026 Prototype',
    officialDisclaimer: 'Demo platform developed for Smart India Hackathon 2026. Not an official Government of India website.',

    // Utility & Accessibility
    skipToContent: 'Skip to main content',
    accessibility: 'Accessibility',
    normalContrast: 'Normal Contrast',
    highContrast: 'High Contrast',
    textSize: 'Text Size',
    help: 'Help & FAQ',
    feedback: 'Citizen Feedback',
    searchPlaceholder: 'Search projects by name, code or location...',

    // Roles
    citizenPortal: 'Citizen Portal',
    reviewerPortal: 'Reviewer Portal',
    adminPortal: 'District Administration',

    // Navigation
    home: 'Home',
    overview: 'Overview',
    projects: 'Projects',
    projectMap: 'Project Map',
    myReports: 'My Reports',
    reportIssue: 'Report an Issue',
    notifications: 'Notifications',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout',
    signIn: 'Sign In',

    // Reviewer Navigation
    reviewQueue: 'Review Queue',
    riskFlags: 'Risk Indicators',
    citizenReportsQueue: 'Citizen Reports',
    analytics: 'Analytics & Utilisation',
    auditTrail: 'Audit Trail',

    // Citizen Dashboard
    namaste: 'Namaste',
    welcomeSubtitle: 'View public development projects in your area and report ground-level observations.',
    changeLocation: 'Change location',
    exploreProjects: 'Explore Projects',
    projectsInArea: 'PROJECTS IN YOUR AREA',
    totalProjects: 'Total Sanctioned',
    ongoingProjects: 'Ongoing',
    delayedProjects: 'Delayed',
    underReviewProjects: 'Under Review',
    completedProjects: 'Completed',

    // Section Titles
    projectsNearYou: 'Projects Near You',
    projectsNearYouSub: 'Public development projects in',
    projectsToReview: 'Projects Requiring Attention',
    projectsToReviewSub: 'Projects currently under official review or milestone delay',
    reportActionTitle: 'Have you noticed an issue with a public project?',
    reportActionPrompt: 'Submit ground observations, geo-tagged photos, and construction milestone feedback for official verification.',
    recentUpdates: 'Recent Project Updates',
    interactiveMapPreview: 'Projects in Your Area',
    openFullMap: 'Open Full Map',
    viewDetails: 'View Details',
    viewReport: 'View Report',
    viewAll: 'View all',

    // Project Statuses
    PROPOSED: 'Proposed',
    SANCTIONED: 'Sanctioned',
    IN_PROGRESS: 'Ongoing',
    DELAYED: 'Delayed',
    COMPLETED: 'Completed',
    UNDER_REVIEW: 'Under Review',

    // Financial Terms
    sanctionedAmount: 'Sanctioned',
    expenditureAmount: 'Expenditure',
    remainingAmount: 'Remaining',
    utilisation: 'Utilisation',
    sanctionedAmountFull: 'Sanctioned Amount',
    expenditureAmountFull: 'Total Expenditure',
    remainingAmountFull: 'Remaining Balance',
    utilisationPercentage: 'Fund Utilisation',

    // Issue Categories
    workNotStarted: 'Work Not Started',
    workDelayed: 'Work Delayed',
    workIncomplete: 'Work Appears Incomplete',
    statusMismatch: 'Project Status Mismatch',
    qualityConcern: 'Quality Concern',
    other: 'Other Observation',

    // Common Buttons & Actions
    submit: 'Submit',
    cancel: 'Cancel',
    filter: 'Filter',
    reset: 'Reset',
    close: 'Close',
    save: 'Save Changes',
    downloadCsv: 'Export CSV',
    verify: 'Verify Evidence',
    recordAction: 'Record Action',
    resolveCase: 'Resolve Case',
  },

  mr: {
    // Brand & Identity
    appName: 'Nidhiनेत्र',
    appSubtitle: 'सार्वजनिक प्रकल्प देखरेख आणि क्षेत्रीय पडताळणी',
    appTagline: 'प्रकल्प पहा. प्रगती पडताळा. कारवाईची नोंद ठेवा.',
    govPortalNotice: 'शासकीय सेवा शैली पोर्टल | नमुना ई-प्रशासन प्रणाली',
    sihNotice: 'स्मार्ट इंडिया हॅकेथॉन २०२६ नमुना प्रणाली',
    officialDisclaimer: 'स्मार्ट इंडिया हॅकेथॉन २०२६ साठी विकसित केलेली नमुना प्रणाली. हे भारत सरकारचे अधिकृत संकेतस्थळ नाही.',

    // Utility & Accessibility
    skipToContent: 'मुख्य मजकुरावर जा',
    accessibility: 'सुलभता (Accessibility)',
    normalContrast: 'सामान्य कॉन्ट्रास्ट',
    highContrast: 'उच्च कॉन्ट्रास्ट',
    textSize: 'फॉन्ट आकार',
    help: 'मदत व प्रश्नोत्तरे',
    feedback: 'नागरिक अभिप्राय',
    searchPlaceholder: 'प्रकल्पाचे नाव, क्रमांक किंवा ठिकाण शोधा...',

    // Roles
    citizenPortal: 'नागरिक पोर्टल',
    reviewerPortal: 'पुनरावलोकन अधिकारी पोर्टल',
    adminPortal: 'जिल्हा प्रशासन पोर्टल',

    // Navigation
    home: 'मुख्यपृष्ठ',
    overview: 'आढावा',
    projects: 'विकास प्रकल्प',
    projectMap: 'प्रकल्प नकाशा',
    myReports: 'माझे अहवाल',
    reportIssue: 'तक्रार / अहवाल नोंदवा',
    notifications: 'सूचना',
    profile: 'माझे प्रोफाईल',
    settings: 'सेटिंग्ज',
    logout: 'बाहेर पडा (Logout)',
    signIn: 'लॉगिन करा',

    // Reviewer Navigation
    reviewQueue: 'पुनरावलोकन रांग',
    riskFlags: 'जोखीम निर्देशक',
    citizenReportsQueue: 'नागरिक अहवाल',
    analytics: 'विश्लेषण व निधी वापर',
    auditTrail: 'ऑडिट ट्रेल',

    // Citizen Dashboard
    namaste: 'नमस्ते',
    welcomeSubtitle: 'तुमच्या परिसरातील सार्वजनिक विकास प्रकल्प पहा आणि थेट घटनास्थळावरील वस्तुस्थिती अहवाल नोंदवा.',
    changeLocation: 'ठिकाण बदला',
    exploreProjects: 'प्रकल्प शोधा',
    projectsInArea: 'तुमच्या परिसरातील प्रकल्प',
    totalProjects: 'एकूण मंजूर',
    ongoingProjects: 'प्रगतीपथावर',
    delayedProjects: 'विलंबित',
    underReviewProjects: 'पुनरावलोकन सुरू',
    completedProjects: 'पूर्ण झालेले',

    // Section Titles
    projectsNearYou: 'तुमच्या परिसरातील विकास प्रकल्प',
    projectsNearYouSub: 'खालील भागातील सार्वजनिक प्रकल्प:',
    projectsToReview: 'पुनरावलोकन आवश्यक असलेले प्रकल्प',
    projectsToReviewSub: 'प्रकल्प ज्यांचे काम विलंबाने सुरू आहे किंवा तपासणी सुरू आहे',
    reportActionTitle: 'आपण सार्वजनिक कामात काही अनियमितता पाहिली आहे का?',
    reportActionPrompt: 'काम सुरू नसणे, कामातील विलंब, निकृष्ट दर्जा किंवा अपूर्ण कामाबाबत छायाचित्रासह तक्रार नोंदवा.',
    recentUpdates: 'नुकत्याच झालेल्या घडामोडी',
    interactiveMapPreview: 'परिसरातील प्रकल्प नकाशा',
    openFullMap: 'संपूर्ण नकाशा उघडा',
    viewDetails: 'तपशील पहा',
    viewReport: 'अहवाल पहा',
    viewAll: 'सर्व पहा',

    // Project Statuses
    PROPOSED: 'प्रस्तावित',
    SANCTIONED: 'मंजूर',
    IN_PROGRESS: 'प्रगतीपथावर',
    DELAYED: 'विलंबित',
    COMPLETED: 'पूर्ण',
    UNDER_REVIEW: 'पुनरावलोकन सुरू',

    // Financial Terms
    sanctionedAmount: 'मंजूर निधी',
    expenditureAmount: 'झालेला खर्च',
    remainingAmount: 'शिल्लक निधी',
    utilisation: 'निधी वापर',
    sanctionedAmountFull: 'एकूण मंजूर रक्कम',
    expenditureAmountFull: 'झालेला एकूण खर्च',
    remainingAmountFull: 'शिल्लक रक्कम',
    utilisationPercentage: 'निधी वापर टक्केवारी',

    // Issue Categories
    workNotStarted: 'काम अद्याप सुरू नाही',
    workDelayed: 'कामास विलंब',
    workIncomplete: 'काम अपूर्ण दिसते',
    statusMismatch: 'स्थिती विसंगती',
    qualityConcern: 'कामाच्या दर्जाबाबत शंका',
    other: 'इतर निरीक्षण',

    // Common Buttons & Actions
    submit: 'दाखल करा',
    cancel: 'रद्द करा',
    filter: 'फिल्टर',
    reset: 'पुन्हा पूर्ववत करा',
    close: 'बंद करा',
    save: 'बदल जतन करा',
    downloadCsv: 'CSV डाऊनलोड',
    verify: 'पुरावा पडताळा',
    recordAction: 'कारवाई नोंदवा',
    resolveCase: 'प्रकरण निकाली काढा',
  },
};
