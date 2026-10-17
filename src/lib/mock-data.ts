import { Organization, User, Workstation, SOP, SOPVersion, SOPStep, TrainingLog, Device, SOSIncident } from '@/types';

export const mockOrganization: Organization = {
  id: 'org-trnava-01',
  name: 'Závod Trnava - Komponenty & Montáž',
  subscription_tier: 'enterprise_pilot',
  supported_languages: ['sk', 'uk', 'sr', 'en'],
  created_at: '2026-01-10T08:00:00Z',
};

export const mockWorkstations: Workstation[] = [
  {
    id: 'ws-01',
    org_id: 'org-trnava-01',
    name: 'Stanica 01: Predmontáž rámu a tesnenia',
    qr_code: 'WS-TRN-01-FRAME',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'ws-02',
    org_id: 'org-trnava-01',
    name: 'Stanica 02: Zalisovanie konektorov dverí',
    qr_code: 'WS-TRN-02-CONN',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'ws-03',
    org_id: 'org-trnava-01',
    name: 'Stanica 03: Lis hydraulický 40T',
    qr_code: 'WS-TRN-03-PRESS',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'ws-04',
    org_id: 'org-trnava-01',
    name: 'Stanica 04: Výstupná optická kontrola',
    qr_code: 'WS-TRN-04-QC',
    created_at: '2026-01-15T08:00:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: 'usr-foreman-01',
    org_id: 'org-trnava-01',
    full_name: 'Peter Horváth',
    employee_no: 'M-1024',
    role: 'foreman',
    preferred_lang: 'sk',
    badge_hash: 'hash_peter_01',
    qr_token: 'QR-PETER-H',
    active: true,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-op-01',
    org_id: 'org-trnava-01',
    full_name: 'Oleksandr Kovalenko',
    employee_no: 'OP-8821',
    role: 'operator',
    preferred_lang: 'uk',
    badge_hash: '04A1B2C3D4',
    qr_token: 'QR-OLEKSANDR-K',
    active: true,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr-op-02',
    org_id: 'org-trnava-01',
    full_name: 'Milan Varga',
    employee_no: 'OP-4412',
    role: 'operator',
    preferred_lang: 'sk',
    badge_hash: '14B2C3D4E5',
    qr_token: 'QR-MILAN-V',
    active: true,
    created_at: '2026-02-05T08:00:00Z',
  },
  {
    id: 'usr-op-03',
    org_id: 'org-trnava-01',
    full_name: 'Dragan Nikolić',
    employee_no: 'OP-9103',
    role: 'operator',
    preferred_lang: 'sr',
    badge_hash: '24C3D4E5F6',
    qr_token: 'QR-DRAGAN-N',
    active: true,
    created_at: '2026-02-10T08:00:00Z',
  },
  {
    id: 'usr-op-04',
    org_id: 'org-trnava-01',
    full_name: 'Andrea Tóthová',
    employee_no: 'OP-3319',
    role: 'operator',
    preferred_lang: 'sk',
    badge_hash: '34D4E5F6A7',
    qr_token: 'QR-ANDREA-T',
    active: true,
    created_at: '2026-02-12T08:00:00Z',
  },
];

export const mockSteps: SOPStep[] = [
  {
    id: 'step-01',
    org_id: 'org-trnava-01',
    sop_version_id: 'ver-sop-01-v2',
    step_order: 1,
    start_time: 0,
    end_time: 12.5,
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-mechanic-working-with-tools-42861-large.mp4',
    image_ok_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    image_nok_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    translations: {
      sk: {
        title: 'Kontrola gumového tesnenia a odmastenie',
        bullets: [
          'Vizuálne skontrolujte neporušenosť tesniaceho profilu po celej dĺžke.',
          'Očistite dosadaciu plochu dverového rámu izopropylalkoholom.',
          'Uistite sa, že drážka neobsahuje kovové špony ani mastnotu.'
        ],
        safety: 'Povinné použitie ochranných nitrilových rukavíc a okuliarov pri práci s odmasťovačom.'
      },
      uk: {
        title: 'Перевірка гумового ущільнювача та знежирення',
        bullets: [
          'Візуально перевірте цілісність ущільнювального профілю по всій довжині.',
          'Очистіть прилеглу поверхню рами дверей ізопропіловим спиртом.',
          'Переконайтеся, що паз не містить металевої стружки або мастила.'
        ],
        safety: 'Обов’язково використовуйте захисні рукавички та окуляри при роботі зі знежирювачем.'
      },
      sr: {
        title: 'Provera gumene zaptivke i odmašćivanje',
        bullets: [
          'Vizuelno proverite integritet profila zaptivke celom dužinom.',
          'Očistite kontaktnu površinu okvira vrata izopropil alkoholom.',
          'Uverite se da žleb nema metalnih opiljaka ili masnoće.'
        ],
        safety: 'Obavezna upotreba zaštitnih nitrilnih rukavica i naočara pri radu sa odmašćivačem.'
      },
      en: {
        title: 'Rubber Seal Inspection & Degreasing',
        bullets: [
          'Visually inspect sealing strip integrity along the entire perimeter.',
          'Wipe mating groove surface with isopropyl alcohol cleaner.',
          'Ensure groove is completely free from metal shavings and grease.'
        ],
        safety: 'Mandatory nitrile gloves and safety glasses during chemical surface preparation.'
      }
    },
    quiz_question: {
      type: 'photo_ab',
      correct_index: 0,
      i18n: {
        sk: {
          question: 'Ktoré usadenie tesnenia je správne (OK)?',
          options: ['Variant A: Plynulé zatlačenie bez vĺn', 'Variant B: Prehnuté tesnenie s medzerou']
        },
        uk: {
          question: 'Яка посадка ущільнювача є правильною (OK)?',
          options: ['Варіант A: Рівномірне прилягання без хвиль', 'Варіант B: Зім’ятий ущільнювач із зазором']
        },
        sr: {
          question: 'Koje postavljanje zaptivke je ispravno (OK)?',
          options: ['Varijanta A: Ravnomerno pritisnuto bez talasa', 'Varijanta B: Savijena zaptivka sa razmakom']
        },
        en: {
          question: 'Which seal alignment is correct (OK)?',
          options: ['Option A: Continuous flush seating', 'Option B: Buckled seal with air gap']
        }
      }
    }
  },
  {
    id: 'step-02',
    org_id: 'org-trnava-01',
    sop_version_id: 'ver-sop-01-v2',
    step_order: 2,
    start_time: 12.5,
    end_time: 26.0,
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-with-machinery-42862-large.mp4',
    image_ok_url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80',
    image_nok_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=600&q=80',
    translations: {
      sk: {
        title: 'Zasunutie modrého konektora kabeláže a poistka',
        bullets: [
          'Uchopte 12-pinový modrý konektor za telo, nikdy neťahajte za vodiče.',
          'Zasuňte konektor do protikusu až do zreteľného akustického kliknutia.',
          'Zaistite žltú mechanickú poistku (CPA lock) zatlačením dopredu.'
        ],
        safety: 'Nepoužívajte nadmernú silu. Pri poškodení pinov vymeňte celý zväzok.'
      },
      uk: {
        title: 'Підключення синього роз’єму та блокування фіксатора',
        bullets: [
          'Тримайте 12-контактний синій конектор за корпус, ніколи не тягніть за дроти.',
          'Вставте роз’єм у відповідну частину до відчутного клацання.',
          'Заблокуйте жовтий фіксатор (CPA lock), натиснувши його вперед.'
        ],
        safety: 'Не застосовуйте надмірну силу. При пошкодженні контактів замініть весь джгут.'
      },
      sr: {
        title: 'Ubacivanje plavog konektora i osigurač',
        bullets: [
          'Uhvatite 12-pinski plavi konektor za kućište, nikada ne vucite za žice.',
          'Gurnite konektor u ležište dok ne čujete jasan klik.',
          'Osigurajte žutu mehaničku bravicu (CPA lock) guranjem unapred.'
        ],
        safety: 'Ne primenjujte preteranu silu. Ako su pinovi oštećeni, zamenite ceo snop.'
      },
      en: {
        title: 'Insert Blue Harness Connector & CPA Lock',
        bullets: [
          'Grip 12-pin blue connector housing firmly, never pull directly on leads.',
          'Push into mating socket until tactile and audible click is heard.',
          'Engage yellow secondary lock (CPA) by pushing forward firmly.'
        ],
        safety: 'Do not use excessive force. If pins are bent, quarantine harness immediately.'
      }
    },
    quiz_question: {
      type: 'multiple_choice',
      correct_index: 1,
      i18n: {
        sk: {
          question: 'Ako spoznáte, že konektor je správne zablokovaný?',
          options: [
            'Keď sa vodiče napnú',
            'Zacvakne zámok a žltá poistka CPA je zatlačená dopredu',
            'Konektor sa voľne hýbe v puzdre'
          ]
        },
        uk: {
          question: 'Як переконатися, що роз’єм заблоковано правильно?',
          options: [
            'Коли дроти натягнуті',
            'Клацнув замок і жовтий фіксатор CPA засунутий вперед',
            'Роз’єм вільно рухається в гнізді'
          ]
        },
        sr: {
          question: 'Kako prepoznati da je konektor ispravno zaključan?',
          options: [
            'Kada se žice zategnu',
            'Škljocne brava i žuti osigurač CPA je pritisnut unapred',
            'Konektor se slobodno pomera u kućištu'
          ]
        },
        en: {
          question: 'How do you verify proper connector engagement?',
          options: [
            'When wiring harness is taut',
            'Audible click heard and yellow CPA lock is fully depressed forward',
            'Connector has rotational play inside housing'
          ]
        }
      }
    }
  },
  {
    id: 'step-03',
    org_id: 'org-trnava-01',
    sop_version_id: 'ver-sop-01-v2',
    step_order: 3,
    start_time: 26.0,
    end_time: 38.0,
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-operating-heavy-machinery-42863-large.mp4',
    image_ok_url: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&w=600&q=80',
    image_nok_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    translations: {
      sk: {
        title: 'Založenie dielu do lisovacieho prípravku a spustenie cyklu',
        bullets: [
          'Umiestnite dverový modul na dva strediace kolíky prípravku.',
          'Skontrolujte zelenú LED indikáciu správneho založenia dielu.',
          'Stlačte obojručné ovládanie lisu a držte do dokončenia cyklu.'
        ],
        safety: 'RUKY MIMO PRACOVNÝ PRIESTOR LISU. Obojručné ovládanie nikdy neblokujte.'
      },
      uk: {
        title: 'Встановлення деталі в прес-форму та запуск циклу',
        bullets: [
          'Встановіть дверний модуль на два центруючі штифти оснастки.',
          'Перевірте зелену світлодіодну індикацію правильної посадки деталі.',
          'Натисніть дворучне керування пресом і тримайте до завершення циклу.'
        ],
        safety: 'РУКИ ПОЗА РОБОЧОЮ ЗОНОЮ ПРЕСА. Ніколи не блокуйте дворучне керування.'
      },
      sr: {
        title: 'Postavljanje dela u presu i pokretanje ciklusa',
        bullets: [
          'Postavite modul vrata na dva igla za centriranje.',
          'Proverite zeleni LED indikator pravilnog postavljanja dela.',
          'Pritisnite dvoručno upravljanje presom i držite do završetka ciklusa.'
        ],
        safety: 'RUKE VAN RADNOG PROSTORA PRESE. Nikada ne blokirajte dvoručno upravljanje.'
      },
      en: {
        title: 'Fixture Seating & Two-Hand Cycle Initiation',
        bullets: [
          'Position door module onto dual locating pins firmly.',
          'Verify green LED fixture proximity sensor illumination.',
          'Engage two-hand safety actuator buttons until stroke completes.'
        ],
        safety: 'KEEP HANDS CLEAR OF PRESS STROKE ZONE. Never bypass two-hand safety relays.'
      }
    },
    quiz_question: {
      type: 'photo_ab',
      correct_index: 0,
      i18n: {
        sk: {
          question: 'Ktorá poloha strediacich kolíkov indikuje správne založenie?',
          options: ['Variant A: Kolík úplne zapadnutý do otvoru', 'Variant B: Diel položený na hrane kolíka']
        },
        uk: {
          question: 'Яке положення центруючих штифтів вказує на правильну посадку?',
          options: ['Варіант A: Штифт повністю увійшов в отвір', 'Варіант B: Деталь лежить на краю штифта']
        },
        sr: {
          question: 'Koji položaj igala za centriranje ukazuje na ispravno postavljanje?',
          options: ['Varijanta A: Igla je potpuno ušla u otvor', 'Varijanta B: Deo leži na ivici igle']
        },
        en: {
          question: 'Which locating pin state confirms correct positioning?',
          options: ['Option A: Locating pin fully flush through pilot hole', 'Option B: Module sitting cocked on pin chamfer']
        }
      }
    }
  }
];

export const mockSOPs: SOP[] = [
  {
    id: 'sop-01',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-02',
    title: 'Montáž tesnenia a zalisovanie konektora dverového modulu',
    status: 'published',
    current_version_id: 'ver-sop-01-v2',
    workstation: mockWorkstations[1],
    created_at: '2026-02-15T09:00:00Z',
    current_version: {
      id: 'ver-sop-01-v2',
      org_id: 'org-trnava-01',
      sop_id: 'sop-01',
      version: 2,
      estimated_time_sec: 54,
      published_at: '2026-02-20T14:30:00Z',
      published_by: 'Peter Horváth',
      steps: mockSteps,
      created_at: '2026-02-18T10:00:00Z',
    }
  },
  {
    id: 'sop-02',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-03',
    title: 'Nastavenie a kalibrácia lisovacieho tlaku 40T',
    status: 'published',
    current_version_id: 'ver-sop-02-v1',
    workstation: mockWorkstations[2],
    created_at: '2026-02-10T11:00:00Z',
    current_version: {
      id: 'ver-sop-02-v1',
      org_id: 'org-trnava-01',
      sop_id: 'sop-02',
      version: 1,
      estimated_time_sec: 90,
      published_at: '2026-02-12T08:00:00Z',
      published_by: 'Peter Horváth',
      steps: [mockSteps[2]],
      created_at: '2026-02-10T11:00:00Z',
    }
  },
  {
    id: 'sop-03',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-04',
    title: 'Výstupná vizuálna kontrola a nalepenie štítku kvality',
    status: 'review',
    current_version_id: 'ver-sop-03-v1',
    workstation: mockWorkstations[3],
    created_at: '2026-03-01T15:00:00Z',
    current_version: {
      id: 'ver-sop-03-v1',
      org_id: 'org-trnava-01',
      sop_id: 'sop-03',
      version: 1,
      estimated_time_sec: 45,
      steps: [mockSteps[0]],
      created_at: '2026-03-01T15:00:00Z',
    }
  }
];

export const mockDevices: Device[] = [
  {
    id: 'dev-01',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-02',
    label: 'Tablet Samsung Galaxy Tab A9+ #01',
    secret_hash: 'sec_hash_01',
    last_sync_at: 'Pred 2 minútami',
    revoked: false,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'dev-02',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-03',
    label: 'Tablet Samsung Galaxy Tab A9+ #02',
    secret_hash: 'sec_hash_02',
    last_sync_at: 'Pred 14 minútami',
    revoked: false,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'dev-03',
    org_id: 'org-trnava-01',
    workstation_id: 'ws-04',
    label: 'Tablet Samsung Galaxy Tab A9+ #03',
    secret_hash: 'sec_hash_03',
    last_sync_at: 'Pred 1 hodinou (Offline buffer)',
    revoked: false,
    created_at: '2026-02-01T08:00:00Z',
  }
];

export const mockTrainingLogs: TrainingLog[] = [
  {
    id: 'log-01',
    org_id: 'org-trnava-01',
    user_id: 'usr-op-01',
    user: mockUsers[1],
    sop_version_id: 'ver-sop-01-v2',
    sop_title: 'Montáž tesnenia a zalisovanie konektora dverového modulu',
    device_id: 'dev-01',
    lang: 'uk',
    started_at: '2026-10-17T06:15:00Z',
    completed_at: '2026-10-17T06:22:30Z',
    quiz_score: 100,
    passed: true,
    quiz_answers: [
      { step_id: 'step-01', selected_index: 0, correct: true },
      { step_id: 'step-02', selected_index: 1, correct: true },
      { step_id: 'step-03', selected_index: 0, correct: true }
    ],
    step_durations: {
      'step-01': 14.5,
      'step-02': 18.2,
      'step-03': 16.8
    },
    sos_events: [],
    synced_at: '2026-10-17T06:23:00Z'
  },
  {
    id: 'log-02',
    org_id: 'org-trnava-01',
    user_id: 'usr-op-02',
    user: mockUsers[2],
    sop_version_id: 'ver-sop-01-v2',
    sop_title: 'Montáž tesnenia a zalisovanie konektora dverového modulu',
    device_id: 'dev-01',
    lang: 'sk',
    started_at: '2026-10-17T07:05:00Z',
    completed_at: '2026-10-17T07:11:45Z',
    quiz_score: 100,
    passed: true,
    quiz_answers: [
      { step_id: 'step-01', selected_index: 0, correct: true },
      { step_id: 'step-02', selected_index: 1, correct: true },
      { step_id: 'step-03', selected_index: 0, correct: true }
    ],
    step_durations: {
      'step-01': 12.1,
      'step-02': 15.4,
      'step-03': 14.2
    },
    sos_events: [],
    synced_at: '2026-10-17T07:12:00Z'
  },
  {
    id: 'log-03',
    org_id: 'org-trnava-01',
    user_id: 'usr-op-03',
    user: mockUsers[3],
    sop_version_id: 'ver-sop-01-v2',
    sop_title: 'Montáž tesnenia a zalisovanie konektora dverového modulu',
    device_id: 'dev-02',
    lang: 'sr',
    started_at: '2026-10-17T08:10:00Z',
    completed_at: '2026-10-17T08:18:20Z',
    quiz_score: 66.7,
    passed: false,
    quiz_answers: [
      { step_id: 'step-01', selected_index: 0, correct: true },
      { step_id: 'step-02', selected_index: 0, correct: false },
      { step_id: 'step-03', selected_index: 0, correct: true }
    ],
    step_durations: {
      'step-01': 16.0,
      'step-02': 28.5,
      'step-03': 19.1
    },
    sos_events: [{ step_id: 'step-02', timestamp: '2026-10-17T08:14:10Z' }],
    synced_at: '2026-10-17T08:18:30Z'
  }
];

export const mockSOSIncidents: SOSIncident[] = [
  {
    id: 'INC-4029',
    workstation_id: 'ws-03',
    workstation_name: 'Stanica 03 - Lis hydraulický 40T',
    operator_id: 'usr-op-01',
    operator_name: 'Oleksandr Kovalenko',
    step_order: 3,
    step_title: 'Založenie dielu do lisovacieho prípravku a spustenie cyklu',
    status: 'resolved',
    created_at: 'Pred 12 minútami',
    resolved_at: 'Pred 10 minútami',
    duration_sec: 135
  }
];
