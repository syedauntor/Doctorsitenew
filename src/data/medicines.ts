export type MedicineCategory =
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Cream'
  | 'Eye Drop'
  | 'Inhaler';

export interface Medicine {
  id: number;
  name: string;
  generic: string;
  manufacturer: string;
  manufacturerCountry: string;
  countryFlag: string;
  category: MedicineCategory;
  pricePerUnit: number;
  packSize: string;
  uses: string[];
  adultDose: string;
  childDose: string;
  maxDose: string;
  sideEffects: string[];
  contraindications: string[];
  storage: string;
  availableBrands: string[];
}

export const MEDICINE_CATEGORIES: string[] = [
  'All', 'Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Eye Drop', 'Inhaler',
];

export const CATEGORY_COUNTS: Record<string, number> = {
  Antibiotic: 245,
  Antacid: 123,
  Painkiller: 89,
  Vitamin: 234,
  Antidiabetic: 156,
};

export const MANUFACTURERS = ['Square', 'Beximco', 'Incepta', 'Renata', 'ACI'];

export const POPULAR_TAGS = [
  'Napa', 'Azithro', 'Metformin', 'Omeprazole', 'Amoxicillin',
  'Ciprofloxacin', 'Paracetamol', 'Atorvastatin', 'Losartan',
  'Vitamin D3', 'Cetirizine', 'Pantoprazole', 'Salbutamol',
  'Clonazepam', 'Metronidazole',
];

export const medicines: Medicine[] = [
  {
    id: 1,
    name: 'Napa 500mg',
    generic: 'Paracetamol',
    manufacturer: 'Beximco Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 0.82,
    packSize: '10 tablets per strip',
    uses: [
      'Relief of mild to moderate pain',
      'Fever reduction',
      'Headache and migraine relief',
      'Toothache and post-operative pain',
    ],
    adultDose: '500mg–1000mg every 4–6 hours as needed',
    childDose: '10–15 mg/kg every 4–6 hours (max 5 doses/24h)',
    maxDose: '4000mg per day in adults',
    sideEffects: [
      'Nausea (rare)',
      'Skin rash (rare)',
      'Liver damage with overdose',
    ],
    contraindications: [
      'Severe hepatic impairment',
      'Known hypersensitivity to paracetamol',
    ],
    storage: 'Store below 25°C, away from direct sunlight and moisture.',
    availableBrands: ['Napa', 'Ace', 'Renova', 'Fast', 'Emol'],
  },
  {
    id: 2,
    name: 'Azithro 500mg',
    generic: 'Azithromycin',
    manufacturer: 'Square Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 45,
    packSize: '3 tablets per pack',
    uses: [
      'Community-acquired pneumonia',
      'Upper and lower respiratory tract infections',
      'Skin and soft tissue infections',
      'Typhoid fever',
    ],
    adultDose: '500mg once daily for 3–5 days',
    childDose: '10 mg/kg once daily for 3 days',
    maxDose: '500mg per day',
    sideEffects: [
      'Nausea, vomiting, diarrhea',
      'Abdominal pain',
      'QT interval prolongation (rare)',
    ],
    contraindications: [
      'Known hypersensitivity to macrolide antibiotics',
      'History of cholestatic jaundice',
    ],
    storage: 'Store at 15–30°C in a dry place.',
    availableBrands: ['Azithro', 'Zithromax', 'Atm', 'Zimax', 'Azifast'],
  },
  {
    id: 3,
    name: 'Seclo 20mg',
    generic: 'Omeprazole',
    manufacturer: 'Incepta Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Capsule',
    pricePerUnit: 8,
    packSize: '10 capsules per strip',
    uses: [
      'Peptic ulcer disease',
      'Gastroesophageal reflux disease (GERD)',
      'Helicobacter pylori eradication',
      'Zollinger–Ellison syndrome',
    ],
    adultDose: '20mg once daily before breakfast',
    childDose: '0.7–3.3 mg/kg/day',
    maxDose: '40mg per day',
    sideEffects: [
      'Headache',
      'Diarrhea or constipation',
      'Hypomagnesemia with long-term use',
    ],
    contraindications: [
      'Hypersensitivity to proton pump inhibitors',
    ],
    storage: 'Store below 30°C, protect from moisture.',
    availableBrands: ['Seclo', 'Losectil', 'Omep', 'Prazol', 'Omidon'],
  },
  {
    id: 4,
    name: 'Metformin 500mg',
    generic: 'Metformin Hydrochloride',
    manufacturer: 'Renata Limited',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 3.5,
    packSize: '30 tablets per pack',
    uses: [
      'Type 2 diabetes mellitus',
      'Polycystic ovary syndrome (PCOS)',
      'Prevention of type 2 diabetes in high-risk patients',
    ],
    adultDose: '500mg twice daily with meals, titrated up',
    childDose: 'Not recommended under 10 years',
    maxDose: '2550mg per day',
    sideEffects: [
      'Nausea, vomiting, diarrhea (common initially)',
      'Lactic acidosis (rare but serious)',
      'Vitamin B12 deficiency with long-term use',
    ],
    contraindications: [
      'eGFR < 30 mL/min',
      'Acute or chronic metabolic acidosis',
      'Iodinated contrast media procedures',
    ],
    storage: 'Store at room temperature (20–25°C), keep in original container.',
    availableBrands: ['Glucophage', 'Biometa', 'Siofor', 'Ormin', 'Diaphage'],
  },
  {
    id: 5,
    name: 'Finix 250mg',
    generic: 'Ciprofloxacin',
    manufacturer: 'ACI Limited',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 12,
    packSize: '10 tablets per strip',
    uses: [
      'Urinary tract infections',
      'Respiratory tract infections',
      'Bone and joint infections',
      'Typhoid and paratyphoid fever',
    ],
    adultDose: '250–750mg twice daily for 7–14 days',
    childDose: 'Not recommended routinely; 10–20 mg/kg/day if necessary',
    maxDose: '1500mg per day',
    sideEffects: [
      'Nausea, diarrhea',
      'Tendinitis and tendon rupture (risk with corticosteroids)',
      'Photosensitivity',
      'QT prolongation',
    ],
    contraindications: [
      'Hypersensitivity to fluoroquinolones',
      'Concomitant tizanidine',
      'Children under 18 (general)',
    ],
    storage: 'Store below 30°C, away from light.',
    availableBrands: ['Cipro', 'Ciproflox', 'Finix', 'Quintor', 'Ciplox'],
  },
  {
    id: 6,
    name: 'Cetrizin 10mg',
    generic: 'Cetirizine Hydrochloride',
    manufacturer: 'Beximco Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 4,
    packSize: '10 tablets per strip',
    uses: [
      'Allergic rhinitis (seasonal and perennial)',
      'Chronic urticaria',
      'Pruritus due to allergy',
    ],
    adultDose: '10mg once daily',
    childDose: '5mg once daily (6–12 years); 2.5mg daily (2–6 years)',
    maxDose: '10mg per day',
    sideEffects: [
      'Drowsiness (mild)',
      'Dry mouth',
      'Headache',
    ],
    contraindications: [
      'Hypersensitivity to cetirizine or hydroxyzine',
      'End-stage renal disease',
    ],
    storage: 'Store at 20–25°C, protect from moisture.',
    availableBrands: ['Zyrtec', 'Cetrizin', 'Acerin', 'Histazin', 'Riteze'],
  },
  {
    id: 7,
    name: 'Panto 40mg',
    generic: 'Pantoprazole',
    manufacturer: 'Square Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 9,
    packSize: '10 tablets per strip',
    uses: [
      'Erosive esophagitis',
      'Gastroesophageal reflux disease',
      'Peptic ulcer',
      'Hypersecretory conditions',
    ],
    adultDose: '40mg once daily before breakfast',
    childDose: 'Limited data; 20–40mg based on weight',
    maxDose: '80–240mg/day for hypersecretory conditions',
    sideEffects: [
      'Headache',
      'Flatulence',
      'Nausea',
      'Hypomagnesemia (long term)',
    ],
    contraindications: [
      'Hypersensitivity to benzimidazoles',
    ],
    storage: 'Store below 30°C. Do not crush enteric-coated tablets.',
    availableBrands: ['Pantop', 'Panto', 'Protonix', 'Pantecta', 'Pantodac'],
  },
  {
    id: 8,
    name: 'Salbutol Inhaler',
    generic: 'Salbutamol (Albuterol)',
    manufacturer: 'Incepta Pharmaceuticals',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Inhaler',
    pricePerUnit: 120,
    packSize: '200 doses per inhaler',
    uses: [
      'Relief of bronchospasm in asthma',
      'Chronic obstructive pulmonary disease (COPD)',
      'Prevention of exercise-induced bronchospasm',
    ],
    adultDose: '100–200 mcg (1–2 puffs) every 4–6 hours as needed',
    childDose: '100 mcg (1 puff) per dose',
    maxDose: '800 mcg per day (8 puffs)',
    sideEffects: [
      'Tremor',
      'Palpitations',
      'Tachycardia',
      'Hypokalemia with high doses',
    ],
    contraindications: [
      'Hypersensitivity to salbutamol',
      'Threatened abortion during first or second trimester',
    ],
    storage: 'Store below 30°C. Do not puncture or incinerate.',
    availableBrands: ['Ventolin', 'Salbutol', 'Proventil', 'ProAir', 'Asthalin'],
  },
  {
    id: 9,
    name: 'Atova 10mg',
    generic: 'Atorvastatin Calcium',
    manufacturer: 'Renata Limited',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Tablet',
    pricePerUnit: 7,
    packSize: '30 tablets per pack',
    uses: [
      'Hypercholesterolemia',
      'Prevention of cardiovascular events',
      'Dyslipidemia',
    ],
    adultDose: '10–80mg once daily at any time of day',
    childDose: '10–20mg/day (10–17 years)',
    maxDose: '80mg per day',
    sideEffects: [
      'Muscle pain and weakness (myalgia)',
      'Elevated liver enzymes',
      'Rhabdomyolysis (rare)',
    ],
    contraindications: [
      'Active liver disease',
      'Pregnancy and breastfeeding',
      'Concomitant strong CYP3A4 inhibitors',
    ],
    storage: 'Store at 20–25°C in a dry place.',
    availableBrands: ['Lipitor', 'Atova', 'Atorin', 'Torvast', 'Sortis'],
  },
  {
    id: 10,
    name: 'D-Cal 400 IU',
    generic: 'Cholecalciferol (Vitamin D3)',
    manufacturer: 'ACI Limited',
    manufacturerCountry: 'Bangladesh',
    countryFlag: '🇧🇩',
    category: 'Capsule',
    pricePerUnit: 6,
    packSize: '30 capsules per pack',
    uses: [
      'Prevention and treatment of Vitamin D deficiency',
      'Osteomalacia and rickets',
      'Hypoparathyroidism',
      'Supplementation in elderly patients',
    ],
    adultDose: '400–2000 IU once daily with food',
    childDose: '400 IU daily for infants and children',
    maxDose: '4000 IU/day (tolerable upper limit)',
    sideEffects: [
      'Hypercalcemia with excessive doses',
      'Nausea, constipation',
      'Weakness',
    ],
    contraindications: [
      'Hypercalcemia or hypercalciuria',
      'Vitamin D toxicity',
      'Granulomatous diseases (sarcoidosis)',
    ],
    storage: 'Store at room temperature, away from light and moisture.',
    availableBrands: ['D-Cal', 'Calcirol', 'D-Vit', 'Ossopan', 'Adcal'],
  },
];
