export type Language = 'en' | 'si' | 'ta';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰' }
];

export interface TranslationSchema {
  nav: {
    dashboard: string;
    ongoing: string;
    ended: string;
    publicLive: string;
    startTournament: string;
    signIn: string;
    signOut: string;
    notifications: string;
    unreadAlerts: string;
    organizerDesk: string;
  };
  landing: {
    liveOpsBadge: string;
    activeMatchday: string;
    publicLink: string;
    heroSubtitle: string;
    heroTitle: string;
    heroDesc: string;
    startTournamentBtn: string;
    viewLiveBtn: string;
    venuesCount: string;
    venuesSubtitle: string;
    courtClashesCount: string;
    courtClashesSubtitle: string;
    pitchsideEngineTitle: string;
    engineeredSubtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  wizard: {
    step1Tag: string;
    step1Title: string;
    step1Desc: string;
    collisionShield: string;
    tournamentTitleLabel: string;
    sportSelection: string;
    selectSportDropdown: string;
    searchSportPlaceholder: string;
    competitionArchitecture: string;
    autoTiebreakers: string;
    styleGroupKnockout: string;
    styleGroupKnockoutDesc: string;
    styleRoundRobin: string;
    styleRoundRobinDesc: string;
    styleSingleElimination: string;
    styleSingleEliminationDesc: string;
    venueAllocation: string;
    venuesAvailable: string;
    selectVenueDropdown: string;
    searchVenuePlaceholder: string;
    pricingModel: string;
    pricingModelDesc: string;
    dayPackage: string;
    hourlyRate: string;
    selectCourts: string;
    toggleCourtsHint: string;
    atLeastOneCourtError: string;
    startDate: string;
    endDate: string;
    totalDays: string;
    dailySchedule: string;
    ledgerTitle: string;
    ledgerSport: string;
    ledgerArchitecture: string;
    ledgerVenue: string;
    ledgerCourts: string;
    ledgerDuration: string;
    ledgerWindow: string;
    ledgerOperatingHours: string;
    totalQuota: string;
    advanceDeposit: string;
    balanceMatchDay: string;
    advanceNote: string;
    saveContinueStep2: string;
  };
  sports: {
    futsal: string;
    futsalDesc: string;
    football7: string;
    football7Desc: string;
    cricket: string;
    cricketDesc: string;
    badminton: string;
    badmintonDesc: string;
  };
  ongoing: {
    badge: string;
    activeEvents: string;
    title: string;
    desc: string;
    startTournament: string;
    periodsDeskTitle: string;
    periodsDeskDesc: string;
    eventLabel: string;
    thMatchNum: string;
    thRoundCourt: string;
    thTeams: string;
    thScore: string;
    thPeriod: string;
    thActions: string;
    set1stHalf: string;
    setHalfTime: string;
    set2ndHalf: string;
    setExtraTime: string;
    endMatchFT: string;
    reinstatePrompt: string;
    reinstateConfirmTitle: string;
    reinstateConfirmDesc: string;
    reinstateConfirmBtn: string;
    cancelBtn: string;
    lockFinal: string;
    openConsole: string;
    cardsTitle: string;
    competitionsManaged: string;
    teamsCount: string;
    liveOngoing: string;
    nextFixture: string;
    activeMatchPlay: string;
    viewSchedule: string;
    launchConsole: string;
    publicLinkArrow: string;
  };
  periods: {
    firstHalf: string;
    halfTime: string;
    secondHalf: string;
    extraTime: string;
    endedFT: string;
    upcoming: string;
  };
  publicLive: {
    masthead: string;
    liveSynced: string;
    shareStream: string;
    linkCopied: string;
    tabFixtures: string;
    tabStandings: string;
    tabKnockout: string;
    tabScorers: string;
    goldenBootTitle: string;
    goals: string;
    reassignmentNotice: string;
    court: string;
  };
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    emailLabel: string;
    passwordLabel: string;
    signInBtn: string;
    needAccount: string;
    signUpLink: string;
    signUpTitle: string;
    fullNameLabel: string;
    createAccountBtn: string;
    alreadyHaveAccount: string;
  };
  footer: {
    tagline: string;
    certified: string;
    rights: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  // =========================================================================
  // ENGLISH
  // =========================================================================
  en: {
    nav: {
      dashboard: 'Dashboard',
      ongoing: 'Ongoing Tournaments',
      ended: 'Ended Tournaments',
      publicLive: 'Public Live Center',
      startTournament: '+ Start Tournament',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      notifications: 'Operational Notifications',
      unreadAlerts: 'unread',
      organizerDesk: 'Organizer Desk'
    },
    landing: {
      liveOpsBadge: 'LIVE MATCHDAY OPS',
      activeMatchday: 'COLOMBO PREMIER FUTSAL CUP • MATCHDAY 1 ACTIVE',
      publicLink: 'Official Public Broadcast Link',
      heroSubtitle: 'TACTICAL TOURNAMENT MANAGEMENT & MULTI-COURT BOOKING',
      heroTitle: 'Book the Turf. Run the Bracket. Broadcast Every Goal Live.',
      heroDesc: 'The authoritative tournament operating system engineered for multi-pitch arenas. Zero court scheduling clashes, automated FIFA-spec tiebreakers, and instant public broadcast desks that update spectators without a single refresh.',
      startTournamentBtn: 'Start a Tournament',
      viewLiveBtn: 'View Live Match Center',
      venuesCount: '45+ Premier Venues',
      venuesSubtitle: 'Live across Colombo & Western Province',
      courtClashesCount: '0 Court Clashes',
      courtClashesSubtitle: 'Multi-court two-tier mutex locking',
      pitchsideEngineTitle: 'THE PITCHSIDE ENGINE',
      engineeredSubtitle: 'Engineered for Multi-Pitch Sports Complexes',
      feature1Title: 'Integrated Venue & Court Booking',
      feature1Desc: 'Reserve Court 1 through Court 5 seamlessly with hourly or day packages. Check real-time availability and lock schedule blocks instantly with advance deposits.',
      feature2Title: 'Two-Tier Court Conflict Mutex',
      feature2Desc: 'Never double-book a pitch again. Intra-tournament overlap detection and venue-wide lock guards prevent timetable collisions and suggest free alternate courts.',
      feature3Title: 'Live Scoring & Instant Public Links',
      feature3Desc: 'Log goals, assists, and disciplinary walkovers directly from the sideline. Standings recalculate automatically and synchronize to public view links with zero delay.'
    },
    wizard: {
      step1Tag: 'Step 01 • Active',
      step1Title: 'Step 1: Event Specification & Venue Allocation',
      step1Desc: 'Reserve tournament courts, choose competition style, and configure match day parameters with venue collision checks.',
      collisionShield: 'Venue Collision Shield Active',
      tournamentTitleLabel: 'Tournament Title / Public Name',
      sportSelection: '01 / Sport Selection',
      selectSportDropdown: 'Select Sport (Searchable Dropdown)',
      searchSportPlaceholder: 'Search sport (e.g. Futsal, Cricket, Badminton)...',
      competitionArchitecture: '02 / Competition Architecture',
      autoTiebreakers: 'Auto-Tiebreakers & Standings',
      styleGroupKnockout: 'Group Stage + Knockout',
      styleGroupKnockoutDesc: 'Round-robin groups (A, B) followed by Semi-Finals and Final.',
      styleRoundRobin: 'Full League Table',
      styleRoundRobinDesc: 'Every squad plays every other squad once. Crowned by points table.',
      styleSingleElimination: 'Single Elimination',
      styleSingleEliminationDesc: 'High-stakes knockout cup. Losers exit directly each round.',
      venueAllocation: '03 / Participating Venue & Courts Allocation',
      venuesAvailable: 'Venues Available for',
      selectVenueDropdown: 'Select Venue (Searchable Dropdown for',
      searchVenuePlaceholder: 'Search venues by name, location, or city...',
      pricingModel: 'Venue Pricing Package Model',
      pricingModelDesc: 'Choose between fixed full-day access or standard hourly reservation rates.',
      dayPackage: 'Day Package',
      hourlyRate: 'Hourly Rate',
      selectCourts: 'Select Specific Courts to Reserve',
      toggleCourtsHint: 'Click court badges to toggle reservation',
      atLeastOneCourtError: 'At least one court must be selected for the tournament.',
      startDate: 'Start Date',
      endDate: 'End Date',
      totalDays: 'Total Days',
      dailySchedule: 'Daily Schedule',
      ledgerTitle: 'Provisional Schedule Ledger',
      ledgerSport: 'Sport:',
      ledgerArchitecture: 'Architecture:',
      ledgerVenue: 'Allocated Venue:',
      ledgerCourts: 'Reserved Courts:',
      ledgerDuration: 'Duration & Model:',
      ledgerWindow: 'Timetable Window:',
      ledgerOperatingHours: 'Operating Hours:',
      totalQuota: 'Total Venue Quota:',
      advanceDeposit: '30% Advance Deposit:',
      balanceMatchDay: '70% Balance on Match Day:',
      advanceNote: 'Secures court lock for selected dates. Advance deposit payable at Step 4.',
      saveContinueStep2: 'Save & Continue to Teams (Step 2)'
    },
    sports: {
      futsal: 'Futsal',
      futsalDesc: 'High-tempo 5v5 indoor court',
      football7: '7-a-side Football',
      football7Desc: 'Extended 7v7 turf arena',
      cricket: 'Indoor Cricket',
      cricketDesc: 'Tension net cricket stadium',
      badminton: 'Badminton',
      badmintonDesc: 'BWF synthetic taraflex courts'
    },
    ongoing: {
      badge: 'ACTIVE MATCHDAY CONTROL',
      activeEvents: 'Active Events',
      title: 'Current Ongoing Tournaments',
      desc: 'State match periods (1st Half, 2nd Half, Extra Time, Match Ended), log score events, advance qualified teams through automated knockout progression, and finalize tournaments.',
      startTournament: '+ Start Tournament',
      periodsDeskTitle: 'Match Periods & Progression Desk',
      periodsDeskDesc: 'State active halfs, extra time, or end matches to progress standings and knockout brackets forward.',
      eventLabel: 'Event:',
      thMatchNum: '#',
      thRoundCourt: 'ROUND / COURT',
      thTeams: 'COMPETING TEAMS',
      thScore: 'SCORE',
      thPeriod: 'CURRENT PERIOD',
      thActions: 'STATE PERIOD / END MATCH',
      set1stHalf: '1st H',
      setHalfTime: 'HT',
      set2ndHalf: '2nd H',
      setExtraTime: 'ET',
      endMatchFT: 'End Match (FT)',
      reinstatePrompt: 'Ended by accident? Reinstate Match',
      reinstateConfirmTitle: 'Accidental Ending Confirmation',
      reinstateConfirmDesc: 'Are you sure this match was ended by accident? Reinstating will resume active play in the 2nd Half and reverse official match conclusion.',
      reinstateConfirmBtn: 'Yes, Reinstate Match',
      cancelBtn: 'Cancel',
      lockFinal: 'Lock Final',
      openConsole: 'Open in Management Console',
      cardsTitle: 'Active Tournament Cards',
      competitionsManaged: 'Competitions Managed',
      teamsCount: 'Teams',
      liveOngoing: 'LIVE ONGOING',
      nextFixture: 'NEXT FIXTURE',
      activeMatchPlay: 'ACTIVE MATCH IN PLAY',
      viewSchedule: 'View Schedule',
      launchConsole: 'Launch Live Console',
      publicLinkArrow: 'Public Link →'
    },
    periods: {
      firstHalf: '1ST HALF',
      halfTime: 'HALF TIME',
      secondHalf: '2ND HALF',
      extraTime: 'EXTRA TIME',
      endedFT: 'MATCH ENDED (FT)',
      upcoming: 'UPCOMING'
    },
    publicLive: {
      masthead: 'PUBLIC LIVE MATCH CENTER',
      liveSynced: 'Live Synced',
      shareStream: 'Share Stream',
      linkCopied: 'Link Copied!',
      tabFixtures: 'Live & Upcoming Fixtures',
      tabStandings: 'Live Group Standings',
      tabKnockout: 'Knockout Tree',
      tabScorers: 'Golden Boot Leaderboard',
      goldenBootTitle: 'Tournament Golden Boot Leaderboard',
      goals: 'Goals',
      reassignmentNotice: 'OFFICIAL VENUE REASSIGNMENT NOTICE',
      court: 'Court'
    },
    auth: {
      signInTitle: 'Sign In to Play Field',
      signInSubtitle: 'Tournament Management & Broadcast Control Desk',
      emailLabel: 'Organizer Email Address',
      passwordLabel: 'Access Password',
      signInBtn: 'Sign In to Operations Desk',
      needAccount: 'Need a new tournament director account? ',
      signUpLink: 'Sign Up Here',
      signUpTitle: 'Create an Organizer Account',
      fullNameLabel: 'Full Name / Authority Title',
      createAccountBtn: 'Register Director Account',
      alreadyHaveAccount: 'Already registered with Play Field? '
    },
    footer: {
      tagline: 'Smart Sports Tournament Scheduling & Live Match Management System',
      certified: 'SLFA Certified',
      rights: '© 2026 Play Field Operations. All Rights Reserved.'
    }
  },

  // =========================================================================
  // SINHALA (සිංහල)
  // =========================================================================
  si: {
    nav: {
      dashboard: 'පාලක පුවරුව',
      ongoing: 'ක්‍රියාත්මක තරගාවලි',
      ended: 'අවසන් වූ තරගාවලි',
      publicLive: 'ප්‍රසිද්ධ සජීවී මධ්‍යස්ථානය',
      startTournament: '+ තරගාවලියක් අරඹන්න',
      signIn: 'ඇතුල් වන්න',
      signOut: 'ඉවත් වන්න',
      notifications: 'මෙහෙයුම් දැනුම්දීම්',
      unreadAlerts: 'නොකියවූ',
      organizerDesk: 'සංවිධායක පුවරුව'
    },
    landing: {
      liveOpsBadge: 'සජීවී තරග මෙහෙයුම්',
      activeMatchday: 'කොළඹ ප්‍රමුඛ ෆුට්සල් කුසලානය • 1 වන තරග දිනය සක්‍රීයයි',
      publicLink: 'නිල ප්‍රසිද්ධ විකාශන සබැඳිය',
      heroSubtitle: 'උපායමාර්ගික තරගාවලි කළමනාකරණය සහ බහු-පිටි වෙන්කිරීම',
      heroTitle: 'ක්‍රීඩාංගනය වෙන්කරන්න. තරගාවලිය පවත්වන්න. සෑම ගෝලයක්ම සජීවීව විකාශනය කරන්න.',
      heroDesc: 'බහු-පිටි ක්‍රීඩා සංකීර්ණ සඳහා නිර්මාණය කරන ලද බලගතු තරගාවලි පද්ධතිය. පිටි කාලසටහන් ගැටුම් ශූන්‍යයි, ස්වයංක්‍රීය FIFA සමතා-බිඳීමේ නීති, සහ ප්‍රේක්ෂකයන් සඳහා සජීවී ක්ෂණික විකාශනය.',
      startTournamentBtn: 'තරගාවලියක් අරඹන්න',
      viewLiveBtn: 'සජීවී තරග මධ්‍යස්ථානය බලන්න',
      venuesCount: 'ප්‍රමුඛ ක්‍රීඩාංගන 45+',
      venuesSubtitle: 'කොළඹ සහ බස්නාහිර පළාත පුරා සක්‍රීයයි',
      courtClashesCount: 'පිටි ගැටුම් 0',
      courtClashesSubtitle: 'ද්විත්ව ස්ථර බහු-පිටි අගුළු දැමීම',
      pitchsideEngineTitle: 'ක්‍රීඩාංගන එන්ජිම',
      engineeredSubtitle: 'බහු-පිටි ක්‍රීඩා සංකීර්ණ සඳහා විශේෂිතව නිර්මාණය කර ඇත',
      feature1Title: 'සම්බන්ධිත ක්‍රීඩාංගන සහ පිටි වෙන්කිරීම',
      feature1Desc: 'පැයකට හෝ දින පැකේජ මඟින් 1 වන පිටියේ සිට 5 වන පිටිය දක්වා පහසුවෙන් වෙන්කරන්න. සජීවී ලබාගත හැකි බව පරීක්ෂා කර අත්තිකාරම් ගෙවීම් මඟින් කාලසටහන තහවුරු කරන්න.',
      feature2Title: 'ද්විත්ව ස්ථර පිටි ගැටුම් වැළැක්වීම',
      feature2Desc: 'කිසිවිටෙකත් එකම පිටිය දෙවරක් වෙන් නොවෙයි. තරග අතර ගැටුම් හඳුනාගැනීම සහ ක්‍රීඩාංගන අලුත්වැඩියා අගුළු මඟින් කාලසටහන් ගැටුම් සම්පූර්ණයෙන්ම වළක්වයි.',
      feature3Title: 'සජීවී ලකුණු සහ ක්ෂණික ප්‍රසිද්ධ සබැඳි',
      feature3Desc: 'ක්‍රීඩා පිටියේ සිටම ගෝල, සහයවීම් සහ තරග තීරණ සටහන් කරන්න. ලකුණු සටහන් ස්වයංක්‍රීයව යාවත්කාලීන වී ප්‍රේක්ෂක සබැඳි වෙත ක්ෂණිකව එකතු වේ.'
    },
    wizard: {
      step1Tag: 'පියවර 01 • සක්‍රීයයි',
      step1Title: 'පියවර 1: ඉසව් පිරිවිතර සහ ක්‍රීඩාංගන වෙන්කිරීම',
      step1Desc: 'තරගාවලි පිටි වෙන්කරන්න, තරග රටාව තෝරන්න, සහ ක්‍රීඩාංගන ගැටුම් පරීක්ෂා කරමින් තරග දින පරාමිතීන් සකසන්න.',
      collisionShield: 'ක්‍රීඩාංගන ගැටුම් ආරක්ෂකය සක්‍රීයයි',
      tournamentTitleLabel: 'තරගාවලි නාමය / ප්‍රසිද්ධ නම',
      sportSelection: '01 / ක්‍රීඩාව තෝරාගැනීම',
      selectSportDropdown: 'ක්‍රීඩාව තෝරන්න (සෙවුම් කළ හැකි පතන මෙනුව)',
      searchSportPlaceholder: 'ක්‍රීඩාව සොයන්න (උදා: Futsal, Cricket, Badminton)...',
      competitionArchitecture: '02 / තරගාවලි ව්‍යුහය',
      autoTiebreakers: 'ස්වයංක්‍රීය සමතා-බිඳීම් සහ ලකුණු සටහන',
      styleGroupKnockout: 'කාණ්ඩ වටය + පිළිමළුන් පිටුදැකීම',
      styleGroupKnockoutDesc: 'වට-රවුම් කාණ්ඩ (A, B) සහ ඉන්පසු අර්ධ අවසන් සහ අවසන් මහා තරගය.',
      styleRoundRobin: 'පූර්ණ ලීග් සටහන',
      styleRoundRobinDesc: 'සෑම කණ්ඩායමක්ම අනෙක් සෑම කණ්ඩායමක් සමඟම එක් වරක් තරග කරයි. ලකුණු පුවරුවෙන් ජයග්‍රාහකයා තේරේ.',
      styleSingleElimination: 'තනි වටයෙන් ඉවත් කිරීම',
      styleSingleEliminationDesc: 'කෙළින්ම ඉවත් වන පිළිමළුන් පිටුදැකීමේ තරගාවලිය. පරාජිතයන් වහාම ඉවත් වේ.',
      venueAllocation: '03 / සහභාගී වන ක්‍රීඩාංගනය සහ පිටි වෙන්කිරීම',
      venuesAvailable: 'සඳහා පවතින ක්‍රීඩාංගන',
      selectVenueDropdown: 'ක්‍රීඩාංගනය තෝරන්න (සෙවුම් කළ හැකි පතන මෙනුව -',
      searchVenuePlaceholder: 'නම, ස්ථානය හෝ නගරය අනුව ක්‍රීඩාංගන සොයන්න...',
      pricingModel: 'ක්‍රීඩාංගන මිලකරණ පැකේජ ආකෘතිය',
      pricingModelDesc: 'ස්ථාවර පූර්ණ දින පැකේජය හෝ සම්මත පැයක වෙන්කිරීමේ ගාස්තු අතරින් තෝරන්න.',
      dayPackage: 'දින පැකේජය',
      hourlyRate: 'පැයක ගාස්තුව',
      selectCourts: 'වෙන්කිරීම සඳහා විශේෂිත පිටි තෝරන්න',
      toggleCourtsHint: 'වෙන්කිරීම සක්‍රීය/අක්‍රීය කිරීමට පිටි ලාංඡන මත ක්ලික් කරන්න',
      atLeastOneCourtError: 'තරගාවලිය සඳහා අවම වශයෙන් එක් පිටියක්වත් තෝරාගත යුතුය.',
      startDate: 'ආරම්භක දිනය',
      endDate: 'අවසන් දිනය',
      totalDays: 'මුළු දින ගණන',
      dailySchedule: 'දෛනික කාලසටහන',
      ledgerTitle: 'තාවකාලික කාලසටහන් ලෙජරය',
      ledgerSport: 'ක්‍රීඩාව:',
      ledgerArchitecture: 'තරග රටාව:',
      ledgerVenue: 'වෙන්කළ ක්‍රීඩාංගනය:',
      ledgerCourts: 'වෙන්කළ පිටි:',
      ledgerDuration: 'කාලසීමාව සහ ආකෘතිය:',
      ledgerWindow: 'කාලසටහන් කවුළුව:',
      ledgerOperatingHours: 'ක්‍රියාකාරී වේලාවන්:',
      totalQuota: 'මුළු ක්‍රීඩාංගන ගාස්තුව:',
      advanceDeposit: '30% අත්තිකාරම් තැන්පතුව:',
      balanceMatchDay: 'තරග දිනයේ 70% ශේෂය:',
      advanceNote: 'තෝරාගත් දින සඳහා පිටි අගුළු දමයි. අත්තිකාරම් තැන්පතුව පියවර 4 දී ගෙවිය යුතුය.',
      saveContinueStep2: 'සුරකින්න සහ කණ්ඩායම් වෙත ඉදිරියට යන්න (පියවර 2)'
    },
    sports: {
      futsal: 'ෆුට්සල් (Futsal)',
      futsalDesc: 'වේගවත් 5v5 ගෘහස්ථ ක්‍රීඩාංගනය',
      football7: '7-සාමාජික පාපන්දු',
      football7Desc: 'පුළුල් 7v7 තණතිලි පිටිය',
      cricket: 'ගෘහස්ථ ක්‍රිකට්',
      cricketDesc: 'දැලෙන් ආවරණය වූ ක්‍රිකට් ක්‍රීඩාංගනය',
      badminton: 'බැඩ්මින්ටන්',
      badmintonDesc: 'BWF සහතිකලත් කෘත්‍රිම ටැරෆ්ලෙක්ස් පිටි'
    },
    ongoing: {
      badge: 'සක්‍රීය තරග දින පාලනය',
      activeEvents: 'සක්‍රීය ඉසව්',
      title: 'දැනට ක්‍රියාත්මක තරගාවලි',
      desc: 'තරග කාල සීමාවන් (1 වන අර්ධය, 2 වන අර්ධය, අමතර කාලය, තරගය අවසන්) සටහන් කරන්න, ලකුණු යාවත්කාලීන කරන්න, සහ පිළිමළුන් පිටුදැකීමේ වටයට සුදුසුකම් ලත් කණ්ඩායම් යොමු කරන්න.',
      startTournament: '+ තරගාවලියක් අරඹන්න',
      periodsDeskTitle: 'තරග කාල සීමාවන් සහ ප්‍රගති පාලක පුවරුව',
      periodsDeskDesc: 'සක්‍රීය අර්ධයන්, අමතර කාලය සකසන්න හෝ ලකුණු සටහන් ඉදිරියට ගෙන යාමට තරග අවසන් කරන්න.',
      eventLabel: 'ඉසව්ව:',
      thMatchNum: '#',
      thRoundCourt: 'වටය / පිටිය',
      thTeams: 'තරග වදින කණ්ඩායම්',
      thScore: 'ලකුණු',
      thPeriod: 'වත්මන් කාල සීමාව',
      thActions: 'කාල සීමාව සකසන්න / තරගය අවසන් කරන්න',
      set1stHalf: '1 වන අර්ධය',
      setHalfTime: 'අර්ධ කාලය',
      set2ndHalf: '2 වන අර්ධය',
      setExtraTime: 'අමතර කාලය',
      endMatchFT: 'තරගය අවසන් (FT)',
      reinstatePrompt: 'වැරදීමකින් අවසන් කළාද? නැවත පිහිටුවන්න',
      reinstateConfirmTitle: 'වැරදීමකින් අවසන් කිරීම තහවුරු කිරීම',
      reinstateConfirmDesc: 'මෙම තරගය වැරදීමකින් අවසන් කළ බව තහවුරු කරනවාද? නැවත පිහිටුවීම මඟින් 2 වන අර්ධයේ සක්‍රීය ක්‍රීඩාව නැවත අරඹනු ඇත.',
      reinstateConfirmBtn: 'ඔව්, තරගය නැවත පිහිටුවන්න',
      cancelBtn: 'අවලංගු කරන්න',
      lockFinal: 'ස්ථිරව අගුළුලන්න',
      openConsole: 'කළමනාකරණ කොන්සෝලයේ විවෘත කරන්න',
      cardsTitle: 'ක්‍රියාකාරී තරගාවලි කාඩ්පත්',
      competitionsManaged: 'කළමනාකරණය වන තරග',
      teamsCount: 'කණ්ඩායම්',
      liveOngoing: 'සජීවීව ක්‍රියාත්මකයි',
      nextFixture: 'මීළඟ තරගය',
      activeMatchPlay: 'සක්‍රීය තරගය ක්‍රියාත්මකයි',
      viewSchedule: 'කාලසටහන බලන්න',
      launchConsole: 'සජීවී කොන්සෝලය අරඹන්න',
      publicLinkArrow: 'ප්‍රසිද්ධ සබැඳිය →'
    },
    periods: {
      firstHalf: '1 වන අර්ධය',
      halfTime: 'අර්ධ කාලය',
      secondHalf: '2 වන අර්ධය',
      extraTime: 'අමතර කාලය',
      endedFT: 'තරගය අවසන් (FT)',
      upcoming: 'ඉදිරියට පැවැත්වෙන'
    },
    publicLive: {
      masthead: 'ප්‍රසිද්ධ සජීවී තරග මධ්‍යස්ථානය',
      liveSynced: 'සජීවීව සමමුහුර්තයි',
      shareStream: 'විකාශනය බෙදාගන්න',
      linkCopied: 'සබැඳිය පිටපත් විය!',
      tabFixtures: 'සජීවී සහ ඉදිරි තරග',
      tabStandings: 'සජීවී කාණ්ඩ ලකුණු පුවරුව',
      tabKnockout: 'පිළිමළුන් පිටුදැකීමේ වටය',
      tabScorers: 'වැඩිම ගෝලලාභීන් (රන් පාවහන)',
      goldenBootTitle: 'තරගාවලියේ වැඩිම ගෝලලාභීන්ගේ ලැයිස්තුව',
      goals: 'ගෝල',
      reassignmentNotice: 'නිල ක්‍රීඩාංගන මාරුකිරීමේ නිවේදනය',
      court: 'පිටිය'
    },
    auth: {
      signInTitle: 'Play Field වෙත ඇතුල් වන්න',
      signInSubtitle: 'තරගාවලි කළමනාකරණ සහ විකාශන පාලක පුවරුව',
      emailLabel: 'සංවිධායක විද්‍යුත් තැපෑල',
      passwordLabel: 'මුරපදය',
      signInBtn: 'මෙහෙයුම් පුවරුව වෙත ඇතුල් වන්න',
      needAccount: 'නව තරගාවලි අධ්‍යක්ෂක ගිණුමක් අවශ්‍යද? ',
      signUpLink: 'මෙහි ලියාපදිංචි වන්න',
      signUpTitle: 'සංවිධායක ගිණුමක් සාදන්න',
      fullNameLabel: 'සම්පූර්ණ නම / නිල තනතුර',
      createAccountBtn: 'අධ්‍යක්ෂක ගිණුම ලියාපදිංචි කරන්න',
      alreadyHaveAccount: 'දැනටමත් Play Field සමඟ ලියාපදිංචි වී තිබේද? '
    },
    footer: {
      tagline: 'ස්මාර්ට් ක්‍රීඩා තරගාවලි කාලසටහන්කරණය සහ සජීවී තරග කළමනාකරණ පද්ධතිය',
      certified: 'SLFA සහතිකලත්',
      rights: '© 2026 Play Field Operations. සියලුම හිමිකම් ඇවිරිණි.'
    }
  },

  // =========================================================================
  // TAMIL (தமிழ்)
  // =========================================================================
  ta: {
    nav: {
      dashboard: 'கட்டுப்பாட்டு பலகை',
      ongoing: 'நடப்பு போட்டிகள்',
      ended: 'முடிந்த போட்டிகள்',
      publicLive: 'பொது நேரலை மையம்',
      startTournament: '+ போட்டியைத் தொடங்குங்கள்',
      signIn: 'உள்நுழைக',
      signOut: 'வெளியேறுக',
      notifications: 'செயல்பாட்டு அறிவிப்புகள்',
      unreadAlerts: 'படிக்காதவை',
      organizerDesk: 'ஒருங்கிணைப்பாளர் தளம்'
    },
    landing: {
      liveOpsBadge: 'நேரலை போட்டி செயல்பாடுகள்',
      activeMatchday: 'கொழும்பு பிரீமியர் புட்சால் கோப்பை • போட்டி நாள் 1 நேரலையில்',
      publicLink: 'அதிகாரப்பூர்வ பொது ஒளிபரப்பு இணைப்பு',
      heroSubtitle: 'போட்டி மேலாண்மை மற்றும் பல ஆடுகள முன்பதிவு',
      heroTitle: 'மைதானத்தை முன்பதிவு செய்யுங்கள். போட்டியை நடத்துங்கள். ஒவ்வொரு கோலையும் நேரலையில் ஒளிபரப்புங்கள்.',
      heroDesc: 'பல ஆடுகள விளையாட்டு வளாகங்களுக்கான பிரத்யேக போட்டி மேலாண்மை தளம். ஆடுகள மோதல்கள் இல்லாத அட்டவணை, தானியங்கி FIFA தரநிலை புள்ளிகள் மற்றும் நேரலை ஒளிபரப்பு மேடை.',
      startTournamentBtn: 'போட்டியைத் தொடங்குங்கள்',
      viewLiveBtn: 'நேரலை போட்டி மையத்தைப் பார்வையிடுங்கள்',
      venuesCount: '45+ முன்னணி அரங்கங்கள்',
      venuesSubtitle: 'கொழும்பு மற்றும் மேல் மாகாணம் முழுவதும் நேரலையில்',
      courtClashesCount: '0 ஆடுகள மோதல்கள்',
      courtClashesSubtitle: 'இரட்டை அடுக்கு பல-ஆடுகள பூட்டு பாதுகாப்பு',
      pitchsideEngineTitle: 'ஆடுகள இயந்திரம்',
      engineeredSubtitle: 'விளையாட்டு வளாகங்களுக்காக பிரத்யேகமாக உருவாக்கப்பட்டது',
      feature1Title: 'ஒருங்கிணைந்த அரங்கம் மற்றும் ஆடுகள முன்பதிவு',
      feature1Desc: 'மணிநேர அல்லது தினசரி தொகுப்புகள் மூலம் ஆடுகளம் 1 முதல் 5 வரை தடையின்றி முன்பதிவு செய்யுங்கள். நிகழ்நேர இருப்பை சரிபார்த்து முன்பணத்துடன் உறுதி செய்யுங்கள்.',
      feature2Title: 'இரட்டை அடுக்கு ஆடுகள மோதல் தவிர்ப்பு',
      feature2Desc: 'ஒரே ஆடுகளத்தை மீண்டும் ஒருபோதும் தவறாக பதிவு செய்ய முடியாது. போட்டி அட்டவணை மோதல்களை முழுமையாக தடுத்து மாற்று ஆடுகளங்களை பரிந்துரைக்கிறது.',
      feature3Title: 'நேரலை புள்ளிகள் மற்றும் உடனடி பொது இணைப்புகள்',
      feature3Desc: 'மைதானத்திலிருந்தே கோல்கள், உதவிகள் மற்றும் போட்டி முடிவுகளை பதிவு செய்யுங்கள். புள்ளிகள் தானாக புதுப்பிக்கப்பட்டு பார்வையாளர் இணைப்புகளுக்கு உடனடியாக மாற்றப்படும்.'
    },
    wizard: {
      step1Tag: 'படி 01 • செயலில்',
      step1Title: 'படி 1: போட்டி விவரக்குறிப்பு மற்றும் அரங்கம் ஒதுக்கீடு',
      step1Desc: 'போட்டி ஆடுகளங்களை ஒதுக்குங்கள், போட்டி பாணியைத் தேர்ந்தெடுங்கள், மற்றும் மோதல் சோதனைகளுடன் போட்டி நாள் அட்டவணையை கட்டமைக்கவும்.',
      collisionShield: 'அரங்க மோதல் கவசம் செயலில் உள்ளது',
      tournamentTitleLabel: 'போட்டி தலைப்பு / பொதுப் பெயர்',
      sportSelection: '01 / விளையாட்டு தேர்வு',
      selectSportDropdown: 'விளையாட்டைத் தேர்ந்தெடுக்கவும் (தேடக்கூடிய கீழ்தோன்றல் பட்டியல்)',
      searchSportPlaceholder: 'விளையாட்டைத் தேடுங்கள் (எ.கா. Futsal, Cricket, Badminton)...',
      competitionArchitecture: '02 / போட்டி கட்டமைப்பு',
      autoTiebreakers: 'தானியங்கி சமநிலை முறிவு மற்றும் புள்ளிகள் பட்டியல்',
      styleGroupKnockout: 'குழு நிலை + நாக் அவுட்',
      styleGroupKnockoutDesc: 'குழு நிலைகள் (A, B) மற்றும் அதைத் தொடர்ந்து அரையிறுதி மற்றும் இறுதிப் போட்டி.',
      styleRoundRobin: 'முழு லீக் அட்டவணை',
      styleRoundRobinDesc: 'ஒவ்வொரு அணியும் மற்ற ஒவ்வொரு அணியுடனும் ஒரு முறை விளையாடுகிறது. புள்ளிகள் பட்டியல் மூலம் வெற்றியாளர் தீர்மானிக்கப்படுவார்.',
      styleSingleElimination: 'ஒற்றை வெளியேற்றம்',
      styleSingleEliminationDesc: 'நேரடி நாக் அவுட் கோப்பை. தோல்வியுற்றவர்கள் உடனடியாக வெளியேறுவார்கள்.',
      venueAllocation: '03 / பங்கேற்கும் அரங்கம் மற்றும் ஆடுகளங்கள் ஒதுக்கீடு',
      venuesAvailable: 'கிடைக்கக்கூடிய அரங்கங்கள்:',
      selectVenueDropdown: 'அரங்கத்தைத் தேர்ந்தெடுக்கவும் (தேடக்கூடிய கீழ்தோன்றல் பட்டியல் -',
      searchVenuePlaceholder: 'பெயர், இடம் அல்லது நகரம் மூலம் அரங்கங்களைத் தேடுங்கள்...',
      pricingModel: 'அரங்க விலை தொகுப்பு மாதிரி',
      pricingModelDesc: 'முழு நாள் தொகுப்பு அல்லது வழக்கமான மணிநேர முன்பதிவு கட்டணங்களுக்கு இடையே தேர்வு செய்யவும்.',
      dayPackage: 'நாள் தொகுப்பு',
      hourlyRate: 'மணித்தியால கட்டணம்',
      selectCourts: 'முன்பதிவு செய்ய குறிப்பிட்ட ஆடுகளங்களை தேர்ந்தெடுக்கவும்',
      toggleCourtsHint: 'முன்பதிவு செய்ய ஆடுகள பட்டன்களை கிளிக் செய்யவும்',
      atLeastOneCourtError: 'போட்டிக்கு குறைந்தது ஒரு ஆடுகளமாவது தேர்ந்தெடுக்கப்பட வேண்டும்.',
      startDate: 'தொடக்க தேதி',
      endDate: 'முடிவு தேதி',
      totalDays: 'மொத்த நாட்கள்',
      dailySchedule: 'தினசரி அட்டவணை',
      ledgerTitle: 'தற்காலிக அட்டவணை கணக்கேடு',
      ledgerSport: 'விளையாட்டு:',
      ledgerArchitecture: 'போட்டி வடிவம்:',
      ledgerVenue: 'ஒதுக்கப்பட்ட அரங்கம்:',
      ledgerCourts: 'முன்பதிவு செய்த ஆடுகளங்கள்:',
      ledgerDuration: 'கால அளவு மற்றும் வடிவம்:',
      ledgerWindow: 'அட்டவணை சாளரம்:',
      ledgerOperatingHours: 'செயல்படும் நேரம்:',
      totalQuota: 'மொத்த அரங்க ஒதுக்கீடு:',
      advanceDeposit: '30% முன்பணம்:',
      balanceMatchDay: 'போட்டி நாளில் 70% மீதி:',
      advanceNote: 'தேர்ந்தெடுக்கப்பட்ட தேதிகளுக்கான ஆடுகள பூட்டை பாதுகாக்கிறது. முன்பணம் படி 4 இல் செலுத்தப்படும்.',
      saveContinueStep2: 'சேமித்து அணிகளுக்கு தொடரவும் (படி 2)'
    },
    sports: {
      futsal: 'புட்சால் (Futsal)',
      futsalDesc: 'வேகமான 5v5 உள்அரங்க ஆடுகளம்',
      football7: '7 பேர் கால்பந்து',
      football7Desc: 'விரிவான 7v7 புல்வெளி மைதானம்',
      cricket: 'உள்அரங்க கிரிக்கெட்',
      cricketDesc: 'வலை மூடப்பட்ட கிரிக்கெட் அரங்கம்',
      badminton: 'பேட்மிண்டன்',
      badmintonDesc: 'BWF தரப்படுத்தப்பட்ட சிந்தடிக் டாரஃப்ளெக்ஸ் ஆடுகளங்கள்'
    },
    ongoing: {
      badge: 'நேரலை போட்டி நாள் கட்டுப்பாடு',
      activeEvents: 'செயலில் உள்ள போட்டிகள்',
      title: 'தற்போது நடக்கும் போட்டிகள்',
      desc: 'போட்டி காலங்களை (1வது பாதி, 2வது பாதி, கூடுதல் நேரம், போட்டி முடிந்தது) பதிவு செய்யவும், புள்ளிகளை பதிவு செய்யவும் மற்றும் தகுதி பெற்ற அணிகளை நாக் அவுட் நிலைக்கு முன்னேற்றவும்.',
      startTournament: '+ போட்டியைத் தொடங்குங்கள்',
      periodsDeskTitle: 'போட்டி காலங்கள் மற்றும் முன்னேற்ற தளம்',
      periodsDeskDesc: 'பாதி நேரம், கூடுதல் நேரம் அமைக்கவும் அல்லது போட்டி நிலைகளை முன்னெடுக்க போட்டிகளை முடிக்கவும்.',
      eventLabel: 'நிகழ்வு:',
      thMatchNum: '#',
      thRoundCourt: 'சுற்று / ஆடுகளம்',
      thTeams: 'மோதும் அணிகள்',
      thScore: 'புள்ளிகள்',
      thPeriod: 'தற்போதைய காலம்',
      thActions: 'காலத்தை அமை / போட்டியை முடி',
      set1stHalf: '1வது பாதி',
      setHalfTime: 'இடைவேளை',
      set2ndHalf: '2வது பாதி',
      setExtraTime: 'கூடுதல் நேரம்',
      endMatchFT: 'போட்டி முடிந்தது (FT)',
      reinstatePrompt: 'தவறுதலாக முடிக்கப்பட்டதா? மீட்டமைக்கவும்',
      reinstateConfirmTitle: 'தவறுதலான முடிவு உறுதிப்படுத்தல்',
      reinstateConfirmDesc: 'இந்தப் போட்டி தவறுதலாக முடிக்கப்பட்டதா என்பதை உறுதிப்படுத்துகிறீர்களா? மீட்டமைப்பது 2வது பாதியில் செயலில் உள்ள ஆட்டத்தை மீண்டும் தொடங்கி அதிகாரப்பூர்வ முடிவை மாற்றும்.',
      reinstateConfirmBtn: 'ஆம், போட்டியை மீட்டமைக்கவும்',
      cancelBtn: 'ரத்து செய்',
      lockFinal: 'இறுதியாக பூட்டவும்',
      openConsole: 'மேலாண்மை கன்சோலில் திறக்கவும்',
      cardsTitle: 'செயலில் உள்ள போட்டி அட்டைகள்',
      competitionsManaged: 'நிர்வகிக்கப்படும் போட்டிகள்',
      teamsCount: 'அணிகள்',
      liveOngoing: 'நேரலையில் நடக்கிறது',
      nextFixture: 'அடுத்த போட்டி',
      activeMatchPlay: 'நேரலை ஆட்டத்தில் உள்ளது',
      viewSchedule: 'அட்டவணையைப் பார்க்கவும்',
      launchConsole: 'நேரலை கன்சோலைத் தொடங்கவும்',
      publicLinkArrow: 'பொது இணைப்பு →'
    },
    periods: {
      firstHalf: '1வது பாதி',
      halfTime: 'இடைவேளை',
      secondHalf: '2வது பாதி',
      extraTime: 'கூடுதல் நேரம்',
      endedFT: 'போட்டி முடிந்தது (FT)',
      upcoming: 'வரவிருக்கும்'
    },
    publicLive: {
      masthead: 'பொது நேரலை போட்டி மையம்',
      liveSynced: 'நேரலையில் இணைக்கப்பட்டுள்ளது',
      shareStream: 'ஒளிபரப்பைப் பகிரவும்',
      linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
      tabFixtures: 'நேரலை மற்றும் வரவிருக்கும் போட்டிகள்',
      tabStandings: 'நேரலை குழு நிலைகள்',
      tabKnockout: 'நாக் அவுட் மரம்',
      tabScorers: 'அதிக கோல் அடித்தவர்கள் பட்டியல்',
      goldenBootTitle: 'போட்டியின் தங்க காலணி பட்டியல்',
      goals: 'கோல்கள்',
      reassignmentNotice: 'அதிகாரப்பூர்வ அரங்கம் மறுஒதுக்கீட்டு அறிவிப்பு',
      court: 'ஆடுகளம்'
    },
    auth: {
      signInTitle: 'Play Field இல் உள்நுழைக',
      signInSubtitle: 'போட்டி மேலாண்மை மற்றும் ஒளிபரப்பு கட்டுப்பாட்டு தளம்',
      emailLabel: 'ஒருங்கிணைப்பாளர் மின்னஞ்சல் முகவரி',
      passwordLabel: 'கடவுச்சொல்',
      signInBtn: 'செயல்பாட்டு தளத்தில் உள்நுழைக',
      needAccount: 'புதிய போட்டி இயக்குனர் கணக்கு தேவையா? ',
      signUpLink: 'இங்கே பதிவு செய்யுங்கள்',
      signUpTitle: 'ஒருங்கிணைப்பாளர் கணக்கை உருவாக்கவும்',
      fullNameLabel: 'முழு பெயர் / பதவி பெயர்',
      createAccountBtn: 'இயக்குனர் கணக்கை பதிவு செய்யவும்',
      alreadyHaveAccount: 'ஏற்கனவே Play Field இல் பதிவு செய்துள்ளீர்களா? '
    },
    footer: {
      tagline: 'ஸ்மார்ட் விளையாட்டு போட்டி அட்டவணை மற்றும் நேரலை மேலாண்மை அமைப்பு',
      certified: 'SLFA சான்றளிக்கப்பட்டது',
      rights: '© 2026 Play Field Operations. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
    }
  }
};
