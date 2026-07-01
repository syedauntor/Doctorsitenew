export interface VitalEntry { date: string; value: number; value2?: number; label?: string }
export interface VisitEntry {
  id: number; date: string; doctor: string; complaint: string; fullComplaint?: string;
  history?: string; diagnosis: string; secondaryDiagnosis?: string;
  bp?: string; pulse?: number; temp?: number; weight?: number; spo2?: number; edema?: boolean;
  investigations?: string[]; investigationResults?: { name: string; value: string; unit: string }[];
  advice?: string; followUp?: string; rxCount: number;
}
export interface PatientData {
  id: number;
  patientId: string;
  name: string; age: number; dob?: string; gender: 'M' | 'F';
  phone: string; email: string; bloodGroup: string;
  regType: 'Online' | 'Walk-in';
  firstVisit: string; lastVisit: string; totalVisits: number; lastDiagnosis: string;
  primaryDoctor: string;
  knownConditions: string[]; allergies: string[]; currentMeds: string[];
  notes: string;
  vitals: {
    bp: { systolic: VitalEntry[]; diastolic: VitalEntry[] };
    sugar: VitalEntry[]; weight: VitalEntry[]; hemoglobin: VitalEntry[];
    creatinine: VitalEntry[]; hba1c: VitalEntry[]; pulse: VitalEntry[];
    height: number;
  };
  visits: VisitEntry[];
}

export const PATIENTS: PatientData[] = [
  {
    id: 1, patientId: 'PI-26-00001', name: 'Karim Hossain', age: 42, gender: 'M',
    phone: '01712****561', email: 'k***@gmail.com', bloodGroup: 'B+',
    regType: 'Walk-in', firstVisit: '15 Jan 2025', lastVisit: '30 Jun 2026',
    totalVisits: 8, lastDiagnosis: 'Hypertension', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Hypertension', 'Dyslipidemia'], allergies: ['Penicillin'],
    currentMeds: ['Amlodipine 5mg OD', 'Atorvastatin 20mg HS'],
    notes: 'Patient is compliant with medication. Monitor BP monthly.',
    vitals: {
      bp: {
        systolic: [{ date: 'Jan 25', value: 150 },{ date: 'Apr 25', value: 145 },{ date: 'Jul 25', value: 138 },{ date: 'Oct 25', value: 135 },{ date: 'Jan 26', value: 132 },{ date: 'Apr 26', value: 130 },{ date: 'Jun 26', value: 128 }],
        diastolic: [{ date: 'Jan 25', value: 95 },{ date: 'Apr 25', value: 92 },{ date: 'Jul 25', value: 88 },{ date: 'Oct 25', value: 86 },{ date: 'Jan 26', value: 84 },{ date: 'Apr 26', value: 82 },{ date: 'Jun 26', value: 80 }],
      },
      sugar: [{ date: 'Jan 25', value: 5.4 },{ date: 'Jul 25', value: 5.2 },{ date: 'Jun 26', value: 5.1 }],
      weight: [{ date: 'Jan 25', value: 78 },{ date: 'Jul 25', value: 76 },{ date: 'Jun 26', value: 74 }],
      hemoglobin: [{ date: 'Jan 25', value: 14.2 },{ date: 'Jun 26', value: 14.5 }],
      creatinine: [{ date: 'Jan 25', value: 0.9 },{ date: 'Jun 26', value: 0.95 }],
      hba1c: [{ date: 'Jan 25', value: 5.4 },{ date: 'Jun 26', value: 5.3 }],
      pulse: [{ date: 'Jan 25', value: 82 },{ date: 'Apr 25', value: 79 },{ date: 'Jun 26', value: 76 }],
      height: 172,
    },
    visits: [
      { id: 1, date: '30 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Headache & elevated BP', fullComplaint: 'Patient complains of intermittent headache for 5 days. BP found elevated at home device.', history: 'HTN for 4 years. No family history of stroke.', diagnosis: 'Hypertension — Grade 1', bp: '128/80', pulse: 76, temp: 98.2, weight: 74, spo2: 98, investigations: ['CBC', 'S. Creatinine', 'Urine RE'], investigationResults: [], advice: 'Salt restriction, regular walking.', followUp: '2026-07-28', rxCount: 2 },
      { id: 2, date: '15 Apr 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Routine follow-up', diagnosis: 'Hypertension — controlled', bp: '130/82', pulse: 78, temp: 98.6, weight: 74, spo2: 99, rxCount: 2 },
      { id: 3, date: '10 Jan 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Palpitations', diagnosis: 'Hypertension + sinus tachycardia', bp: '132/84', pulse: 98, weight: 75, rxCount: 3 },
    ],
  },
  {
    id: 2, patientId: 'PI-26-00002', name: 'Fatema Begum', age: 35, gender: 'F',
    phone: '01821****233', email: 'f***@yahoo.com', bloodGroup: 'A+',
    regType: 'Online', firstVisit: '10 Mar 2026', lastVisit: '28 Jun 2026',
    totalVisits: 5, lastDiagnosis: 'GERD', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['GERD'], allergies: [],
    currentMeds: ['Esomeprazole 20mg BD', 'Domperidone 10mg TDS'],
    notes: '',
    vitals: {
      bp: { systolic: [{ date: 'Mar 26', value: 118 },{ date: 'Jun 26', value: 116 }], diastolic: [{ date: 'Mar 26', value: 76 },{ date: 'Jun 26', value: 74 }] },
      sugar: [{ date: 'Mar 26', value: 4.8 },{ date: 'Jun 26', value: 5.0 }],
      weight: [{ date: 'Mar 26', value: 58 },{ date: 'Jun 26', value: 57 }],
      hemoglobin: [{ date: 'Mar 26', value: 11.8 }],
      creatinine: [], hba1c: [], pulse: [{ date: 'Mar 26', value: 80 },{ date: 'Jun 26', value: 78 }],
      height: 158,
    },
    visits: [
      { id: 1, date: '28 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Post-meal heartburn', diagnosis: 'GERD — symptomatic', bp: '116/74', pulse: 78, weight: 57, rxCount: 2 },
      { id: 2, date: '10 Mar 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Burning epigastric pain', diagnosis: 'GERD — new diagnosis', bp: '118/76', pulse: 80, weight: 58, rxCount: 3 },
    ],
  },
  {
    id: 3, patientId: 'PI-25-00003', name: 'Rafiq Ahmed', age: 58, gender: 'M',
    phone: '01911****567', email: 'r***@gmail.com', bloodGroup: 'O+',
    regType: 'Walk-in', firstVisit: '5 Jan 2025', lastVisit: '25 Jun 2026',
    totalVisits: 14, lastDiagnosis: 'Type 2 Diabetes', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Type 2 Diabetes', 'Hypertension', 'CKD Stage 2'], allergies: ['Sulfa drugs', 'NSAIDs'],
    currentMeds: ['Metformin 500mg BD', 'Lisinopril 10mg OD', 'Insulin Glargine 20U HS'],
    notes: 'Strict dietary advice given. Refer to endocrinology if HbA1c > 9.',
    vitals: {
      bp: { systolic: [{ date: 'Jan 25', value: 158 },{ date: 'Jun 25', value: 150 },{ date: 'Jan 26', value: 145 },{ date: 'Jun 26', value: 138 }], diastolic: [{ date: 'Jan 25', value: 98 },{ date: 'Jun 25', value: 92 },{ date: 'Jan 26', value: 88 },{ date: 'Jun 26', value: 84 }] },
      sugar: [{ date: 'Jan 25', value: 12.4 },{ date: 'Jun 25', value: 10.8 },{ date: 'Jan 26', value: 9.2 },{ date: 'Jun 26', value: 8.1 }],
      weight: [{ date: 'Jan 25', value: 84 },{ date: 'Jun 25', value: 82 },{ date: 'Jan 26', value: 80 },{ date: 'Jun 26', value: 79 }],
      hemoglobin: [{ date: 'Jan 25', value: 11.2 },{ date: 'Jun 25', value: 11.8 },{ date: 'Jun 26', value: 12.1 }],
      creatinine: [{ date: 'Jan 25', value: 1.4 },{ date: 'Jun 25', value: 1.5 },{ date: 'Jan 26', value: 1.4 },{ date: 'Jun 26', value: 1.35 }],
      hba1c: [{ date: 'Jan 25', value: 9.8 },{ date: 'Jun 25', value: 8.9 },{ date: 'Jan 26', value: 8.1 },{ date: 'Jun 26', value: 7.8 }],
      pulse: [{ date: 'Jan 25', value: 88 },{ date: 'Jun 26', value: 82 }],
      height: 168,
    },
    visits: [
      { id: 1, date: '25 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Polyuria and fatigue', fullComplaint: 'Increased urination for 2 weeks. Significant fatigue. HbA1c done last month showed 7.8.', diagnosis: 'T2DM — HbA1c 7.8 — partially controlled', secondaryDiagnosis: 'CKD Stage 2', bp: '138/84', pulse: 82, temp: 98.4, weight: 79, spo2: 97, investigations: ['HbA1c', 'S. Creatinine', 'Urine ACR', 'Lipid Profile'], investigationResults: [{ name: 'HbA1c', value: '7.8', unit: '%' },{ name: 'S. Creatinine', value: '1.35', unit: 'mg/dL' }], advice: 'Low carb diet. Daily 30min walk.', followUp: '2026-07-25', rxCount: 4 },
      { id: 2, date: '10 Mar 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Routine diabetes checkup', diagnosis: 'T2DM — improving', bp: '145/88', pulse: 84, weight: 80, rxCount: 3 },
    ],
  },
  {
    id: 4, patientId: 'PI-26-00004', name: 'Nasrin Akter', age: 29, gender: 'F',
    phone: '01551****812', email: 'n***@gmail.com', bloodGroup: 'AB+',
    regType: 'Online', firstVisit: '8 Jun 2026', lastVisit: '22 Jun 2026',
    totalVisits: 3, lastDiagnosis: 'Anxiety Disorder', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Anxiety Disorder'], allergies: [],
    currentMeds: ['Escitalopram 10mg OD', 'Clonazepam 0.5mg SOS'],
    notes: '',
    vitals: {
      bp: { systolic: [{ date: 'Jun 26', value: 122 }], diastolic: [{ date: 'Jun 26', value: 78 }] },
      sugar: [], weight: [{ date: 'Jun 26', value: 54 }], hemoglobin: [], creatinine: [], hba1c: [],
      pulse: [{ date: 'Jun 26', value: 96 }], height: 155,
    },
    visits: [
      { id: 1, date: '22 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Palpitations, dizziness', diagnosis: 'Anxiety disorder — palpitations', bp: '122/78', pulse: 96, weight: 54, rxCount: 2 },
      { id: 2, date: '8 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Panic attack', diagnosis: 'Panic attack — first presentation', bp: '126/82', pulse: 110, weight: 54, rxCount: 2 },
    ],
  },
  {
    id: 5, patientId: 'PI-24-00005', name: 'Jahangir Alam', age: 65, gender: 'M',
    phone: '01651****190', email: 'j***@gmail.com', bloodGroup: 'O-',
    regType: 'Walk-in', firstVisit: '20 Jan 2024', lastVisit: '20 Jun 2026',
    totalVisits: 22, lastDiagnosis: 'Coronary Artery Disease', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['CAD', 'Post-PTCA 2024', 'Hypertension', 'DM Type 2'], allergies: ['Aspirin allergy (mild)'],
    currentMeds: ['Clopidogrel 75mg OD', 'Atorvastatin 40mg HS', 'Metoprolol 25mg BD', 'Metformin 500mg BD'],
    notes: 'Post PTCA 2024. On dual antiplatelet. Needs 6-monthly echo.',
    vitals: {
      bp: { systolic: [{ date: 'Jan 24', value: 165 },{ date: 'Jul 24', value: 150 },{ date: 'Jan 25', value: 142 },{ date: 'Jul 25', value: 138 },{ date: 'Jan 26', value: 135 },{ date: 'Jun 26', value: 130 }], diastolic: [{ date: 'Jan 24', value: 100 },{ date: 'Jul 24', value: 94 },{ date: 'Jan 25', value: 88 },{ date: 'Jul 25', value: 85 },{ date: 'Jan 26', value: 82 },{ date: 'Jun 26', value: 80 }] },
      sugar: [{ date: 'Jan 24', value: 11.2 },{ date: 'Jul 24', value: 9.4 },{ date: 'Jun 26', value: 8.2 }],
      weight: [{ date: 'Jan 24', value: 75 },{ date: 'Jun 26', value: 72 }],
      hemoglobin: [{ date: 'Jan 24', value: 12.8 },{ date: 'Jun 26', value: 13.2 }],
      creatinine: [{ date: 'Jan 24', value: 1.1 },{ date: 'Jun 26', value: 1.15 }],
      hba1c: [{ date: 'Jan 24', value: 8.9 },{ date: 'Jul 24', value: 8.2 },{ date: 'Jun 26', value: 7.5 }],
      pulse: [{ date: 'Jan 24', value: 90 },{ date: 'Jun 26', value: 72 }],
      height: 165,
    },
    visits: [
      { id: 1, date: '20 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Stable angina, exertional chest tightness', fullComplaint: 'Occasional chest tightness on climbing stairs. No rest pain. GTN not needed.', diagnosis: 'CAD — stable angina', secondaryDiagnosis: 'T2DM', bp: '130/80', pulse: 72, temp: 98.0, weight: 72, spo2: 98, investigations: ['ECG', 'Echo (6m)', 'Lipid Profile'], advice: 'Continue medications. Avoid strenuous activity.', followUp: '2026-09-20', rxCount: 4 },
    ],
  },
  {
    id: 6, patientId: 'PI-26-00006', name: 'Roksana Islam', age: 44, gender: 'F',
    phone: '01761****341', email: 'r***@hotmail.com', bloodGroup: 'B-',
    regType: 'Walk-in', firstVisit: '5 Dec 2025', lastVisit: '18 Jun 2026',
    totalVisits: 7, lastDiagnosis: 'Dyslipidemia', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Dyslipidemia'], allergies: [], currentMeds: ['Rosuvastatin 10mg HS'],
    notes: '',
    vitals: {
      bp: { systolic: [{ date: 'Dec 25', value: 125 },{ date: 'Jun 26', value: 122 }], diastolic: [{ date: 'Dec 25', value: 80 },{ date: 'Jun 26', value: 78 }] },
      sugar: [{ date: 'Dec 25', value: 5.2 }],
      weight: [{ date: 'Dec 25', value: 68 },{ date: 'Jun 26', value: 67 }],
      hemoglobin: [{ date: 'Dec 25', value: 12.4 }], creatinine: [], hba1c: [],
      pulse: [{ date: 'Jun 26', value: 76 }], height: 160,
    },
    visits: [
      { id: 1, date: '18 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Lipid profile review', diagnosis: 'Dyslipidemia — LDL 145', bp: '122/78', pulse: 76, weight: 67, rxCount: 1 },
    ],
  },
  {
    id: 7, patientId: 'PI-26-00007', name: 'Mahbub Rahman', age: 51, gender: 'M',
    phone: '01781****723', email: 'm***@gmail.com', bloodGroup: 'A-',
    regType: 'Walk-in', firstVisit: '2 Feb 2026', lastVisit: '16 Jun 2026',
    totalVisits: 4, lastDiagnosis: 'Arrhythmia', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Atrial Fibrillation'], allergies: [],
    currentMeds: ['Bisoprolol 5mg OD', 'Warfarin 3mg OD'],
    notes: 'INR target 2-3. Monitor monthly.',
    vitals: {
      bp: { systolic: [{ date: 'Feb 26', value: 132 },{ date: 'Jun 26', value: 128 }], diastolic: [{ date: 'Feb 26', value: 84 },{ date: 'Jun 26', value: 82 }] },
      sugar: [], weight: [{ date: 'Jun 26', value: 76 }], hemoglobin: [{ date: 'Jun 26', value: 13.8 }], creatinine: [{ date: 'Jun 26', value: 1.0 }], hba1c: [],
      pulse: [{ date: 'Feb 26', value: 102 },{ date: 'Jun 26', value: 78 }], height: 170,
    },
    visits: [
      { id: 1, date: '16 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'AF rate control follow-up', diagnosis: 'AF — rate controlled', bp: '128/82', pulse: 78, weight: 76, rxCount: 2 },
    ],
  },
  {
    id: 8, patientId: 'PI-26-00008', name: 'Sadia Khan', age: 33, gender: 'F',
    phone: '01931****456', email: 's***@gmail.com', bloodGroup: 'O+',
    regType: 'Online', firstVisit: '14 Jun 2026', lastVisit: '14 Jun 2026',
    totalVisits: 2, lastDiagnosis: 'Mitral Regurgitation', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['Mild MR'], allergies: [], currentMeds: [],
    notes: 'Repeat echo in 6 months.',
    vitals: {
      bp: { systolic: [{ date: 'Jun 26', value: 115 }], diastolic: [{ date: 'Jun 26', value: 72 }] },
      sugar: [], weight: [{ date: 'Jun 26', value: 52 }], hemoglobin: [], creatinine: [], hba1c: [],
      pulse: [{ date: 'Jun 26', value: 74 }], height: 156,
    },
    visits: [
      { id: 1, date: '14 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Exertional dyspnoea', diagnosis: 'Mild MR on echo — asymptomatic', bp: '115/72', pulse: 74, weight: 52, rxCount: 0 },
    ],
  },
  {
    id: 9, patientId: 'PI-25-00009', name: 'Tariq Rahman', age: 47, gender: 'M',
    phone: '01611****918', email: 't***@gmail.com', bloodGroup: 'B+',
    regType: 'Walk-in', firstVisit: '8 Mar 2025', lastVisit: '12 Jun 2026',
    totalVisits: 9, lastDiagnosis: 'Heart Failure', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: ['HFrEF', 'Hypertension'], allergies: ['ACE inhibitors (cough)'],
    currentMeds: ['Sacubitril/Valsartan 50mg BD', 'Furosemide 40mg OD', 'Spironolactone 25mg OD'],
    notes: 'On GDMT. Arrange echo every 6m. EF last 35%.',
    vitals: {
      bp: { systolic: [{ date: 'Mar 25', value: 145 },{ date: 'Sep 25', value: 135 },{ date: 'Jun 26', value: 125 }], diastolic: [{ date: 'Mar 25', value: 90 },{ date: 'Sep 25', value: 84 },{ date: 'Jun 26', value: 78 }] },
      sugar: [{ date: 'Jun 26', value: 5.8 }],
      weight: [{ date: 'Mar 25', value: 82 },{ date: 'Sep 25', value: 79 },{ date: 'Jun 26', value: 76 }],
      hemoglobin: [{ date: 'Mar 25', value: 12.2 },{ date: 'Jun 26', value: 12.8 }],
      creatinine: [{ date: 'Mar 25', value: 1.2 },{ date: 'Jun 26', value: 1.1 }], hba1c: [],
      pulse: [{ date: 'Mar 25', value: 98 },{ date: 'Jun 26', value: 76 }], height: 172,
    },
    visits: [
      { id: 1, date: '12 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Mild ankle swelling', diagnosis: 'HFrEF — stable, mild decompensation', bp: '125/78', pulse: 76, weight: 76, spo2: 97, rxCount: 3 },
    ],
  },
  {
    id: 10, patientId: 'PI-26-00010', name: 'Laila Haque', age: 38, gender: 'F',
    phone: '01721****123', email: 'l***@gmail.com', bloodGroup: 'AB-',
    regType: 'Online', firstVisit: '10 Jun 2026', lastVisit: '10 Jun 2026',
    totalVisits: 1, lastDiagnosis: 'Palpitations', primaryDoctor: 'Dr. Rahim Uddin',
    knownConditions: [], allergies: [], currentMeds: [],
    notes: '',
    vitals: {
      bp: { systolic: [{ date: 'Jun 26', value: 118 }], diastolic: [{ date: 'Jun 26', value: 74 }] },
      sugar: [], weight: [{ date: 'Jun 26', value: 60 }], hemoglobin: [{ date: 'Jun 26', value: 13.0 }], creatinine: [], hba1c: [],
      pulse: [{ date: 'Jun 26', value: 88 }], height: 162,
    },
    visits: [
      { id: 1, date: '10 Jun 2026', doctor: 'Dr. Rahim Uddin', complaint: 'Palpitations — 3 weeks', diagnosis: 'Benign palpitations — Holter normal', bp: '118/74', pulse: 88, weight: 60, rxCount: 0 },
    ],
  },
];

let _nextSerial = 11;
export function getNextPatientId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const serial = String(_nextSerial++).padStart(5, '0');
  return `PI-${year}-${serial}`;
}
