export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface VisitingHour {
  day: string;
  time: string;
  closed?: boolean;
}

export interface Review {
  id: number;
  patient: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface Chamber {
  name: string;
  address: string;
  phone: string;
  newPatientFee: number;
  followUpFee: number;
  visitingHours: VisitingHour[];
}

export interface DoctorProfile {
  slug: string;
  bio: string;
  onlineFee: number;
  offlineFee: number;
  totalPatients: number;
  /** @deprecated use chambers[0] instead */
  chamberName: string;
  /** @deprecated use chambers[0] instead */
  chamberAddress: string;
  /** @deprecated use chambers[0] instead */
  chamberPhone: string;
  chambers?: Chamber[];
  education: Education[];
  experienceList: string[];
  specializations: string[];
  visitingHours: VisitingHour[];
  reviews: Review[];
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  degrees: string;
  chamber: string;
  fee: number;
  rating: number;
  reviews: number;
  experience: number;
  availableToday: boolean;
  bookingEnabled: boolean;
  queueActive: boolean;
  verified: boolean;
  image: string;
  queue: number;
  bmdcVerified?: boolean;
  identityVerified?: boolean;
  chamberVerified?: boolean;
  availableTomorrow?: boolean;
  lastActive?: string;
  profile?: DoctorProfile;
}

export const SPECIALTIES = [
  'All',
  'General Physician',
  'Cardiologist',
  'Pediatrician',
  'Dermatologist',
  'Neurologist',
  'Orthopedic',
  'Gynecologist',
  'Eye Specialist',
] as const;

export const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Fahmida Rahman',
    specialty: 'Cardiologist',
    degrees: 'MBBS, MD (Cardiology), FRCP',
    chamber: 'Apollo Hospital, Bashundhara, Dhaka',
    fee: 1200,
    rating: 4.9,
    reviews: 312,
    experience: 15,
    availableToday: true,
    bookingEnabled: true,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 4,
    bmdcVerified: true,
    identityVerified: true,
    chamberVerified: true,
    lastActive: 'Today',
    profile: {
      slug: 'dr-fahmida-rahman',
      bio: 'Dr. Fahmida Rahman is a highly experienced Cardiologist with 15 years of dedicated practice in interventional cardiology. She has performed over 2,000 cardiac procedures and is known for her patient-first approach and use of the latest diagnostic technologies.',
      onlineFee: 800,
      offlineFee: 1200,
      totalPatients: 8400,
      chamberName: 'Apollo Hospitals Dhaka',
      chamberAddress: 'Plot: 81, Block: E, Bashundhara R/A, Dhaka-1229',
      chamberPhone: '+880 2-8401661',
      education: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: '2004' },
        { degree: 'MD (Cardiology)', institution: 'BSMMU, Dhaka', year: '2010' },
        { degree: 'FRCP', institution: 'Royal College of Physicians, UK', year: '2014' },
      ],
      experienceList: [
        'Senior Consultant, Apollo Hospitals Dhaka (2016 – Present)',
        'Associate Professor, BSMMU Department of Cardiology (2013 – 2016)',
        'Registrar, National Heart Foundation Hospital (2010 – 2013)',
      ],
      specializations: ['Interventional Cardiology', 'Echocardiography', 'Heart Failure', 'Hypertension', 'Coronary Artery Disease'],
      visitingHours: [
        { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', time: '3:00 PM – 7:00 PM' },
        { day: 'Monday', time: '9:00 AM – 1:00 PM' },
        { day: 'Tuesday', time: '3:00 PM – 7:00 PM' },
        { day: 'Wednesday', time: '9:00 AM – 1:00 PM' },
        { day: 'Thursday', time: '3:00 PM – 6:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Rahim Uddin', rating: 5, comment: 'Excellent doctor! Very thorough in her examination and explained everything clearly. Highly recommend.', date: '2024-05-10', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Sumaiya Khatun', rating: 5, comment: 'Dr. Fahmida is very caring and professional. She took the time to answer all my questions.', date: '2024-04-22', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Kamal Hossain', rating: 4, comment: 'Good experience overall. The wait time was a bit long but the consultation was worth it.', date: '2024-03-15', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Nasreen Akter', rating: 5, comment: 'Best cardiologist in Dhaka. She diagnosed my condition accurately when others had missed it.', date: '2024-02-28', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Farhan Islam', rating: 5, comment: 'Very knowledgeable and empathetic. She makes you feel at ease immediately.', date: '2024-01-19', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 2,
    name: 'Dr. Mahbubur Hossain',
    specialty: 'Neurologist',
    degrees: 'MBBS, MD (Neurology), FCPS',
    chamber: 'Square Hospital, Panthapath, Dhaka',
    fee: 1500,
    rating: 4.8,
    reviews: 245,
    experience: 18,
    availableToday: true,
    bookingEnabled: false,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 7,
    bmdcVerified: true,
    identityVerified: true,
    chamberVerified: false,
    lastActive: 'Today',
    profile: {
      slug: 'dr-mahbubur-hossain',
      bio: 'Dr. Mahbubur Hossain is a leading Neurologist with 18 years of expertise in treating complex neurological disorders. He is renowned for his skill in managing stroke, epilepsy, and movement disorders, combining cutting-edge research with compassionate patient care.',
      onlineFee: 1000,
      offlineFee: 1500,
      totalPatients: 11200,
      chamberName: 'Square Hospitals Ltd.',
      chamberAddress: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
      chamberPhone: '+880 2-8159457',
      chambers: [
        {
          name: 'Square Hospitals Ltd.',
          address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
          phone: '+880 2-8159457',
          newPatientFee: 1500,
          followUpFee: 1000,
          visitingHours: [
            { day: 'Saturday', time: '10:00 AM – 2:00 PM' },
            { day: 'Sunday', time: '4:00 PM – 8:00 PM' },
            { day: 'Monday', time: '', closed: true },
            { day: 'Tuesday', time: '10:00 AM – 2:00 PM' },
            { day: 'Wednesday', time: '4:00 PM – 8:00 PM' },
            { day: 'Thursday', time: '10:00 AM – 2:00 PM' },
            { day: 'Friday', time: '', closed: true },
          ],
        },
        {
          name: 'Ibn Sina Hospital',
          address: 'House 48, Road 9/A, Dhanmondi, Dhaka-1209',
          phone: '+880 2-9671000',
          newPatientFee: 1200,
          followUpFee: 800,
          visitingHours: [
            { day: 'Saturday', time: '', closed: true },
            { day: 'Sunday', time: '6:00 PM – 9:00 PM' },
            { day: 'Monday', time: '6:00 PM – 9:00 PM' },
            { day: 'Tuesday', time: '', closed: true },
            { day: 'Wednesday', time: '6:00 PM – 9:00 PM' },
            { day: 'Thursday', time: '', closed: true },
            { day: 'Friday', time: '', closed: true },
          ],
        },
      ],
      education: [
        { degree: 'MBBS', institution: 'Sir Salimullah Medical College', year: '2001' },
        { degree: 'MD (Neurology)', institution: 'BSMMU', year: '2008' },
        { degree: 'FCPS (Medicine)', institution: 'BCPS, Bangladesh', year: '2010' },
      ],
      experienceList: [
        'Consultant Neurologist, Square Hospital (2014 – Present)',
        'Visiting Fellow, National Hospital for Neurology, London (2012 – 2013)',
        'Assistant Professor, Dhaka Medical College (2008 – 2014)',
      ],
      specializations: ['Stroke Management', 'Epilepsy', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Headache Disorders'],
      visitingHours: [
        { day: 'Saturday', time: '10:00 AM – 2:00 PM' },
        { day: 'Sunday', time: '4:00 PM – 8:00 PM' },
        { day: 'Monday', time: '', closed: true },
        { day: 'Tuesday', time: '10:00 AM – 2:00 PM' },
        { day: 'Wednesday', time: '4:00 PM – 8:00 PM' },
        { day: 'Thursday', time: '10:00 AM – 2:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Jahangir Alam', rating: 5, comment: 'Dr. Hossain correctly diagnosed my rare neurological condition after years of misdiagnosis. Life-changing.', date: '2024-05-05', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Tahmina Begum', rating: 5, comment: 'Extremely patient and thorough. Explained my epilepsy treatment plan in full detail.', date: '2024-04-17', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Mostofa Kamal', rating: 4, comment: 'Great expertise. Appointment scheduling could be improved but the doctor himself is excellent.', date: '2024-03-02', avatar: 'https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Dilruba Yasmin', rating: 5, comment: 'Cured my chronic migraine after years of suffering. Cannot recommend him enough.', date: '2024-02-14', avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Shahriar Kabir', rating: 5, comment: 'Incredibly knowledgeable. He listens carefully before prescribing anything.', date: '2024-01-30', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 3,
    name: 'Dr. Nasrin Sultana',
    specialty: 'Pediatrician',
    degrees: 'MBBS, DCH, MD (Pediatrics)',
    chamber: 'Dhaka Medical College Hospital',
    fee: 800,
    rating: 4.9,
    reviews: 503,
    experience: 12,
    availableToday: false,
    bookingEnabled: true,
    queueActive: false,
    verified: true,
    image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 0,
    profile: {
      slug: 'dr-nasrin-sultana',
      bio: 'Dr. Nasrin Sultana is a compassionate Pediatrician with 12 years of experience caring for children from newborns to adolescents. She is dedicated to preventive care, early diagnosis, and working closely with families to ensure the healthiest outcomes for every child.',
      onlineFee: 500,
      offlineFee: 800,
      totalPatients: 14700,
      chamberName: 'Dhaka Medical College Hospital',
      chamberAddress: 'Secretariat Rd, Dhaka Medical College, Dhaka 1000',
      chamberPhone: '+880 2-55165088',
      education: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: '2007' },
        { degree: 'DCH', institution: 'Institute of Child Health, Dhaka', year: '2011' },
        { degree: 'MD (Pediatrics)', institution: 'BSMMU', year: '2014' },
      ],
      experienceList: [
        'Associate Professor of Pediatrics, DMCH (2018 – Present)',
        'Consultant Pediatrician, Shishu Hospital, Dhaka (2014 – 2018)',
        'Medical Officer, Pediatric Ward, DMCH (2011 – 2014)',
      ],
      specializations: ['Neonatology', 'Child Nutrition', 'Childhood Asthma', 'Developmental Disorders', 'Vaccination'],
      visitingHours: [
        { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
        { day: 'Sunday', time: '', closed: true },
        { day: 'Monday', time: '8:00 AM – 12:00 PM' },
        { day: 'Tuesday', time: '', closed: true },
        { day: 'Wednesday', time: '8:00 AM – 12:00 PM' },
        { day: 'Thursday', time: '2:00 PM – 5:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Fatema Khatun', rating: 5, comment: 'Dr. Nasrin is wonderful with children. My son was terrified of doctors but she put him at ease immediately.', date: '2024-05-12', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Rafiqul Islam', rating: 5, comment: 'Very thorough examination. She catches things other doctors miss. Our family\'s trusted pediatrician.', date: '2024-04-08', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Shirin Akter', rating: 5, comment: 'Excellent at explaining a child\'s condition to worried parents. Very reassuring.', date: '2024-03-25', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Mizanur Rahman', rating: 4, comment: 'Good doctor. Chamber can get crowded but she gives proper attention to each patient.', date: '2024-02-19', avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Salma Begum', rating: 5, comment: 'My go-to pediatrician for 5 years. Trustworthy, knowledgeable, and genuinely cares about kids.', date: '2024-01-11', avatar: 'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 4,
    name: 'Dr. Rezaul Karim',
    specialty: 'Orthopedic',
    degrees: 'MBBS, MS (Ortho), FCPS',
    chamber: 'BIRDEM General Hospital, Shahbag',
    fee: 1000,
    rating: 4.7,
    reviews: 188,
    experience: 20,
    availableToday: true,
    bookingEnabled: true,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/4253089/pexels-photo-4253089.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 3,
    profile: {
      slug: 'dr-rezaul-karim',
      bio: 'Dr. Rezaul Karim is a senior Orthopedic Surgeon with 20 years of clinical expertise in joint replacement, spine surgery, and sports injuries. He has pioneered minimally invasive surgical techniques in Bangladesh and trained over 50 orthopedic surgeons.',
      onlineFee: 700,
      offlineFee: 1000,
      totalPatients: 9800,
      chamberName: 'BIRDEM General Hospital',
      chamberAddress: '122 Kazi Nazrul Islam Ave, Shahbag, Dhaka 1000',
      chamberPhone: '+880 2-8616641',
      education: [
        { degree: 'MBBS', institution: 'Mymensingh Medical College', year: '1999' },
        { degree: 'MS (Orthopedics)', institution: 'BSMMU', year: '2006' },
        { degree: 'FCPS (Surgery)', institution: 'BCPS', year: '2008' },
      ],
      experienceList: [
        'Professor & Head, Orthopedic Surgery, BIRDEM (2015 – Present)',
        'Fellowship in Arthroplasty, Wrightington Hospital, UK (2009 – 2010)',
        'Associate Professor, National Orthopedic Hospital (2008 – 2015)',
      ],
      specializations: ['Knee Replacement', 'Hip Replacement', 'Spine Surgery', 'Sports Injuries', 'Fracture Management'],
      visitingHours: [
        { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', time: '9:00 AM – 1:00 PM' },
        { day: 'Monday', time: '', closed: true },
        { day: 'Tuesday', time: '3:00 PM – 7:00 PM' },
        { day: 'Wednesday', time: '3:00 PM – 7:00 PM' },
        { day: 'Thursday', time: '9:00 AM – 1:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Abdul Mannan', rating: 5, comment: 'Dr. Karim\'s knee replacement surgery changed my life. I can walk without pain for the first time in years.', date: '2024-05-20', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Hasina Begum', rating: 4, comment: 'Very skilled surgeon. Explained all risks and benefits before the procedure. Trusted him completely.', date: '2024-04-11', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Zahir Uddin', rating: 5, comment: 'Recovered from my spinal surgery in record time. Dr. Karim is truly a master of his craft.', date: '2024-03-07', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Lovely Akter', rating: 5, comment: 'My ACL tear was treated perfectly. Back on the field within 6 months as promised.', date: '2024-02-01', avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Shakil Ahmed', rating: 4, comment: 'Professional and experienced. Conservative treatment worked before considering surgery.', date: '2024-01-22', avatar: 'https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 5,
    name: 'Dr. Tasneem Akter',
    specialty: 'Dermatologist',
    degrees: 'MBBS, DDV, MD (Dermatology)',
    chamber: 'United Hospital, Gulshan, Dhaka',
    fee: 900,
    rating: 4.8,
    reviews: 274,
    experience: 10,
    availableToday: true,
    bookingEnabled: true,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 2,
    profile: {
      slug: 'dr-tasneem-akter',
      bio: 'Dr. Tasneem Akter is a specialist Dermatologist focused on medical and cosmetic dermatology. With 10 years of experience, she treats a wide spectrum of skin, hair, and nail conditions, using evidence-based therapies combined with the latest aesthetic treatments.',
      onlineFee: 600,
      offlineFee: 900,
      totalPatients: 6300,
      chamberName: 'United Hospital Ltd.',
      chamberAddress: 'Plot 15, Road 71, Gulshan, Dhaka 1212',
      chamberPhone: '+880 2-8836000',
      education: [
        { degree: 'MBBS', institution: 'Chittagong Medical College', year: '2009' },
        { degree: 'DDV', institution: 'BSMMU', year: '2013' },
        { degree: 'MD (Dermatology)', institution: 'BSMMU', year: '2016' },
      ],
      experienceList: [
        'Consultant Dermatologist, United Hospital (2017 – Present)',
        'Research Associate, Skin Disease Research Centre, BSMMU (2015 – 2017)',
        'Medical Officer, Dermatology OPD, Chittagong Medical College Hospital (2012 – 2015)',
      ],
      specializations: ['Acne & Scar Treatment', 'Eczema', 'Psoriasis', 'Laser Therapy', 'Hair Loss Treatment'],
      visitingHours: [
        { day: 'Saturday', time: '10:00 AM – 2:00 PM' },
        { day: 'Sunday', time: '4:00 PM – 8:00 PM' },
        { day: 'Monday', time: '10:00 AM – 2:00 PM' },
        { day: 'Tuesday', time: '', closed: true },
        { day: 'Wednesday', time: '10:00 AM – 2:00 PM' },
        { day: 'Thursday', time: '4:00 PM – 8:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Rumana Islam', rating: 5, comment: 'My stubborn acne cleared up within 3 months of following her treatment plan. Amazing results!', date: '2024-05-18', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Imran Hossain', rating: 5, comment: 'Very professional. She properly diagnosed my psoriasis and the medication is working great.', date: '2024-04-29', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Nadia Alam', rating: 4, comment: 'Good consultation. She takes time to explain the treatment options without pushing expensive procedures.', date: '2024-03-20', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Shakib Khan', rating: 5, comment: 'Laser treatment for my scar worked fantastically. Very happy with the results.', date: '2024-02-10', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Parveen Akter', rating: 5, comment: 'Finally found a doctor who understood my sensitive skin. Highly recommend!', date: '2024-01-05', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 6,
    name: 'Dr. Imtiaz Ahmed',
    specialty: 'General Physician',
    degrees: 'MBBS, FCPS (Medicine)',
    chamber: 'Labaid Hospital, Dhanmondi, Dhaka',
    fee: 700,
    rating: 4.6,
    reviews: 142,
    experience: 14,
    availableToday: true,
    bookingEnabled: false,
    queueActive: true,
    verified: false,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 5,
    profile: {
      slug: 'dr-imtiaz-ahmed',
      bio: 'Dr. Imtiaz Ahmed is an experienced General Physician and Internal Medicine specialist. His 14-year practice covers a broad range of acute and chronic conditions, with a particular focus on diabetes, hypertension, and preventive health management for patients of all ages.',
      onlineFee: 400,
      offlineFee: 700,
      totalPatients: 7200,
      chamberName: 'Labaid Specialized Hospital',
      chamberAddress: 'House 1, Road 4, Dhanmondi, Dhaka 1205',
      chamberPhone: '+880 2-9671001',
      education: [
        { degree: 'MBBS', institution: 'Rajshahi Medical College', year: '2005' },
        { degree: 'FCPS (Medicine)', institution: 'BCPS', year: '2012' },
      ],
      experienceList: [
        'Consultant Physician, Labaid Hospital (2013 – Present)',
        'Medical Officer, Internal Medicine, Rajshahi Medical College Hospital (2008 – 2013)',
      ],
      specializations: ['Diabetes Management', 'Hypertension', 'Respiratory Diseases', 'Fever & Infection', 'Preventive Health'],
      visitingHours: [
        { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', time: '9:00 AM – 1:00 PM' },
        { day: 'Monday', time: '5:00 PM – 8:00 PM' },
        { day: 'Tuesday', time: '5:00 PM – 8:00 PM' },
        { day: 'Wednesday', time: '9:00 AM – 1:00 PM' },
        { day: 'Thursday', time: '9:00 AM – 1:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Abul Kashem', rating: 5, comment: 'Dr. Imtiaz has been managing my diabetes for 3 years. My A1C is now in the normal range thanks to him.', date: '2024-05-08', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Kohinoor Begum', rating: 4, comment: 'Very approachable and explains things in simple language. My family trusts him completely.', date: '2024-04-15', avatar: 'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Nazrul Islam', rating: 5, comment: 'Correct diagnosis on first visit. Saved me from months of further investigation.', date: '2024-03-30', avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Amina Khatun', rating: 4, comment: 'Good doctor. Prescribes minimal medication and focuses on lifestyle changes first.', date: '2024-02-24', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Joynul Abedin', rating: 5, comment: 'Great follow-up care. He always remembers your history and builds on previous visits.', date: '2024-01-14', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 7,
    name: 'Dr. Sumaiya Islam',
    specialty: 'Gynecologist',
    degrees: 'MBBS, FCPS (Obs & Gynae), DGO',
    chamber: 'Evercare Hospital, Bashundhara',
    fee: 1300,
    rating: 4.9,
    reviews: 421,
    experience: 16,
    availableToday: false,
    bookingEnabled: false,
    queueActive: false,
    verified: true,
    image: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 0,
    profile: {
      slug: 'dr-sumaiya-islam',
      bio: 'Dr. Sumaiya Islam is a highly respected Gynecologist and Obstetrician with 16 years of expertise in women\'s health. She specializes in high-risk pregnancies, minimally invasive gynecological surgery, and comprehensive reproductive health care.',
      onlineFee: 900,
      offlineFee: 1300,
      totalPatients: 10500,
      chamberName: 'Evercare Hospital Dhaka',
      chamberAddress: 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229',
      chamberPhone: '+880 2-8401661',
      education: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: '2003' },
        { degree: 'DGO', institution: 'Bangladesh College of Physicians', year: '2008' },
        { degree: 'FCPS (Obs & Gynae)', institution: 'BCPS', year: '2011' },
      ],
      experienceList: [
        'Senior Consultant, OB-GYN, Evercare Hospital (2016 – Present)',
        'Associate Professor, OB-GYN, BSMMU (2011 – 2016)',
        'Registrar, Dhaka Medical College Hospital (2007 – 2011)',
      ],
      specializations: ['High-Risk Pregnancy', 'Laparoscopic Surgery', 'Infertility Treatment', 'PCOS', 'Menstrual Disorders'],
      visitingHours: [
        { day: 'Saturday', time: '9:00 AM – 1:00 PM' },
        { day: 'Sunday', time: '', closed: true },
        { day: 'Monday', time: '3:00 PM – 7:00 PM' },
        { day: 'Tuesday', time: '9:00 AM – 1:00 PM' },
        { day: 'Wednesday', time: '', closed: true },
        { day: 'Thursday', time: '3:00 PM – 7:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Sadia Rahman', rating: 5, comment: 'Dr. Sumaiya guided me through a high-risk pregnancy beautifully. Both me and my baby are healthy!', date: '2024-05-14', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Mitu Akter', rating: 5, comment: 'She is thorough, compassionate, and always available for concerns. Best gynecologist in Dhaka.', date: '2024-04-03', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Rahela Khatun', rating: 5, comment: 'My PCOS treatment under her care has shown remarkable improvement in just 4 months.', date: '2024-03-18', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Sharifa Begum', rating: 4, comment: 'Very professional and knowledgeable. She helped us conceive after 2 years of trying.', date: '2024-02-07', avatar: 'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Rina Islam', rating: 5, comment: 'Truly exceptional. She takes women\'s health concerns seriously and never dismisses symptoms.', date: '2024-01-28', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 8,
    name: 'Dr. Kamal Uddin',
    specialty: 'Eye Specialist',
    degrees: 'MBBS, DO, FCPS (Ophthalmology)',
    chamber: 'National Eye Care, Motijheel',
    fee: 600,
    rating: 4.7,
    reviews: 330,
    experience: 22,
    availableToday: true,
    bookingEnabled: true,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 8,
    profile: {
      slug: 'dr-kamal-uddin',
      bio: 'Dr. Kamal Uddin is a veteran Ophthalmologist with 22 years of experience in managing all forms of eye disease. He has performed over 5,000 cataract surgeries and is a pioneer in phacoemulsification technique in Bangladesh, restoring vision for thousands of patients.',
      onlineFee: 400,
      offlineFee: 600,
      totalPatients: 16800,
      chamberName: 'National Eye Care Centre',
      chamberAddress: 'Dilkusha C/A, Motijheel, Dhaka 1000',
      chamberPhone: '+880 2-9566633',
      education: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: '1997' },
        { degree: 'DO (Ophthalmology)', institution: 'National Institute of Ophthalmology', year: '2002' },
        { degree: 'FCPS (Ophthalmology)', institution: 'BCPS', year: '2005' },
      ],
      experienceList: [
        'Chief Consultant, National Eye Care Centre (2010 – Present)',
        'Visiting Consultant, Ispahani Islamia Eye Institute (2006 – 2010)',
        'Resident Surgeon, National Institute of Ophthalmology (2002 – 2006)',
      ],
      specializations: ['Cataract Surgery', 'Glaucoma', 'Diabetic Retinopathy', 'LASIK Evaluation', 'Corneal Disease'],
      visitingHours: [
        { day: 'Saturday', time: '8:00 AM – 12:00 PM' },
        { day: 'Sunday', time: '8:00 AM – 12:00 PM' },
        { day: 'Monday', time: '3:00 PM – 6:00 PM' },
        { day: 'Tuesday', time: '3:00 PM – 6:00 PM' },
        { day: 'Wednesday', time: '8:00 AM – 12:00 PM' },
        { day: 'Thursday', time: '8:00 AM – 12:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Habib Ullah', rating: 5, comment: 'My cataract surgery was flawless. I can see clearly for the first time in years. Truly gifted surgeon.', date: '2024-05-22', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Morsheda Khatun', rating: 5, comment: 'Very gentle and skilled. No pain during or after the procedure. Exceptional care.', date: '2024-04-30', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Salam Sarkar', rating: 4, comment: 'Good experience. My glaucoma is now well-controlled under his guidance.', date: '2024-03-12', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Ranu Begum', rating: 5, comment: 'Diagnosed my diabetic retinopathy early. Saved my sight. Forever grateful.', date: '2024-02-18', avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Monir Hossain', rating: 5, comment: 'World-class ophthalmologist. His clinic is well-equipped and the staff are professional.', date: '2024-01-09', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 9,
    name: 'Dr. Roksana Begum',
    specialty: 'Cardiologist',
    degrees: 'MBBS, MD (Cardiology), PhD',
    chamber: 'Ibn Sina Hospital, Dhanmondi',
    fee: 1800,
    rating: 4.8,
    reviews: 196,
    experience: 24,
    availableToday: false,
    bookingEnabled: true,
    queueActive: false,
    verified: true,
    image: 'https://images.pexels.com/photos/5407215/pexels-photo-5407215.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 0,
    profile: {
      slug: 'dr-roksana-begum',
      bio: 'Dr. Roksana Begum is a senior Cardiologist and academic researcher with a PhD in Cardiac Physiology. Her 24-year career spans clinical practice, research, and teaching. She has published over 40 research papers and contributes to international cardiology guidelines.',
      onlineFee: 1200,
      offlineFee: 1800,
      totalPatients: 12400,
      chamberName: 'Ibn Sina Hospital Ltd.',
      chamberAddress: 'House 48, Road 9/A, Dhanmondi R/A, Dhaka 1209',
      chamberPhone: '+880 2-9118206',
      education: [
        { degree: 'MBBS', institution: 'Dhaka Medical College', year: '1995' },
        { degree: 'MD (Cardiology)', institution: 'BSMMU', year: '2002' },
        { degree: 'PhD (Cardiac Physiology)', institution: 'University of Edinburgh, UK', year: '2007' },
      ],
      experienceList: [
        'Professor of Cardiology & Consultant, Ibn Sina Hospital (2012 – Present)',
        'Postdoctoral Fellow, University of Edinburgh (2005 – 2007)',
        'Associate Professor, BSMMU (2002 – 2012)',
      ],
      specializations: ['Advanced Heart Failure', 'Cardiac Imaging', 'Preventive Cardiology', 'Arrhythmia', 'Valve Disorders'],
      visitingHours: [
        { day: 'Saturday', time: '', closed: true },
        { day: 'Sunday', time: '10:00 AM – 2:00 PM' },
        { day: 'Monday', time: '10:00 AM – 2:00 PM' },
        { day: 'Tuesday', time: '4:00 PM – 7:00 PM' },
        { day: 'Wednesday', time: '10:00 AM – 2:00 PM' },
        { day: 'Thursday', time: '4:00 PM – 7:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Mosharraf Hossain', rating: 5, comment: 'Dr. Roksana identified my valve problem before it became critical. Exceptional diagnostic skill.', date: '2024-05-02', avatar: 'https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Rokeya Sultana', rating: 5, comment: 'She is both a brilliant doctor and a compassionate human being. Truly rare combination.', date: '2024-04-19', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Alamgir Khan', rating: 4, comment: 'Very experienced. Her consultation fee is higher but absolutely worth every taka.', date: '2024-03-28', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Salina Parvin', rating: 5, comment: 'She explained my arrhythmia in terms I could understand. Changed my life through proper management.', date: '2024-02-09', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Mamunur Rashid', rating: 5, comment: 'World-class cardiologist in Dhaka. My whole family sees her for cardiac checkups.', date: '2024-01-16', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 10,
    name: 'Dr. Ariful Islam',
    specialty: 'General Physician',
    degrees: 'MBBS, BCS (Health), MPH',
    chamber: 'Popular Medical Centre, Mirpur',
    fee: 500,
    rating: 4.5,
    reviews: 89,
    experience: 8,
    availableToday: true,
    bookingEnabled: false,
    queueActive: false,
    verified: false,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 1,
    profile: {
      slug: 'dr-ariful-islam',
      bio: 'Dr. Ariful Islam is a dedicated General Physician who combines clinical practice with a strong public health background. His 8 years of experience in community and hospital settings make him particularly effective at managing common illnesses and guiding patients toward healthier lifestyles.',
      onlineFee: 300,
      offlineFee: 500,
      totalPatients: 3800,
      chamberName: 'Popular Medical Centre',
      chamberAddress: 'Mirpur 10, Pallabi, Dhaka 1216',
      chamberPhone: '+880 2-8053226',
      education: [
        { degree: 'MBBS', institution: 'MAG Osmani Medical College', year: '2012' },
        { degree: 'BCS (Health)', institution: 'Bangladesh Civil Service', year: '2015' },
        { degree: 'MPH', institution: 'BRAC James P. Grant School of Public Health', year: '2019' },
      ],
      experienceList: [
        'Consultant Physician, Popular Medical Centre (2020 – Present)',
        'Upazila Health & Family Planning Officer, Sylhet (2015 – 2020)',
      ],
      specializations: ['General Medicine', 'Preventive Healthcare', 'Infectious Diseases', 'Nutrition Counseling', 'Travel Medicine'],
      visitingHours: [
        { day: 'Saturday', time: '9:00 AM – 12:00 PM' },
        { day: 'Sunday', time: '9:00 AM – 12:00 PM' },
        { day: 'Monday', time: '5:00 PM – 8:00 PM' },
        { day: 'Tuesday', time: '5:00 PM – 8:00 PM' },
        { day: 'Wednesday', time: '9:00 AM – 12:00 PM' },
        { day: 'Thursday', time: '5:00 PM – 8:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Karim Uddin', rating: 5, comment: 'Very approachable doctor who takes his time with each patient. Rare in Dhaka.', date: '2024-05-01', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Begum Akter', rating: 4, comment: 'Good value for the fee. Correct diagnosis and reasonable prescription.', date: '2024-04-10', avatar: 'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Saiful Islam', rating: 5, comment: 'He always asks about my lifestyle and gives practical advice beyond just medication.', date: '2024-03-05', avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Nargis Akter', rating: 4, comment: 'Patient and understanding. Good at explaining complex things in simple terms.', date: '2024-02-20', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Robiul Islam', rating: 5, comment: 'Very honest and doesn\'t over-prescribe. Respects patients\' decisions.', date: '2024-01-17', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 11,
    name: 'Dr. Sharmin Nahar',
    specialty: 'Dermatologist',
    degrees: 'MBBS, MD (Dermatology), FCPS',
    chamber: 'Green Life Hospital, Green Road',
    fee: 1100,
    rating: 4.7,
    reviews: 212,
    experience: 13,
    availableToday: true,
    bookingEnabled: true,
    queueActive: true,
    verified: true,
    image: 'https://images.pexels.com/photos/5215013/pexels-photo-5215013.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 6,
    profile: {
      slug: 'dr-sharmin-nahar',
      bio: 'Dr. Sharmin Nahar is a clinical and cosmetic Dermatologist with 13 years of experience. She has a special interest in dermatological surgery, skin cancer screening, and advanced anti-aging treatments, combining medical expertise with aesthetic sensibility.',
      onlineFee: 700,
      offlineFee: 1100,
      totalPatients: 7700,
      chamberName: 'Green Life Hospital Ltd.',
      chamberAddress: '32, Bir Uttam Qazi Nuruzzaman Sarak, Green Road, Dhaka 1205',
      chamberPhone: '+880 2-9665271',
      education: [
        { degree: 'MBBS', institution: 'Sir Salimullah Medical College', year: '2006' },
        { degree: 'MD (Dermatology)', institution: 'BSMMU', year: '2012' },
        { degree: 'FCPS (Dermatology)', institution: 'BCPS', year: '2014' },
      ],
      experienceList: [
        'Senior Consultant Dermatologist, Green Life Hospital (2015 – Present)',
        'Training in Cosmetic Dermatology, AIIMS New Delhi (2013)',
        'Registrar, BSMMU Dermatology Department (2010 – 2015)',
      ],
      specializations: ['Skin Cancer Screening', 'Vitiligo', 'Anti-aging Treatments', 'Botox & Fillers', 'Chemical Peels'],
      visitingHours: [
        { day: 'Saturday', time: '11:00 AM – 3:00 PM' },
        { day: 'Sunday', time: '11:00 AM – 3:00 PM' },
        { day: 'Monday', time: '', closed: true },
        { day: 'Tuesday', time: '4:00 PM – 8:00 PM' },
        { day: 'Wednesday', time: '4:00 PM – 8:00 PM' },
        { day: 'Thursday', time: '11:00 AM – 3:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Anika Islam', rating: 5, comment: 'My vitiligo patches have significantly reduced under her care. Very skilled and dedicated doctor.', date: '2024-05-19', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Hasan Mahmud', rating: 4, comment: 'Got skin cancer screening done. Very thorough and explains each step of the examination.', date: '2024-04-26', avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Sharmeen Akter', rating: 5, comment: 'The chemical peel treatment gave me incredible results. My skin looks years younger.', date: '2024-03-10', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Saad Ahmed', rating: 5, comment: 'Very hygienic clinic and highly professional staff. Dr. Sharmin is excellent.', date: '2024-02-15', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Luna Parvin', rating: 4, comment: 'Knowledgeable and honest about what treatments will and won\'t work for your skin type.', date: '2024-01-21', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
  {
    id: 12,
    name: 'Dr. Tanvir Hasan',
    specialty: 'Neurologist',
    degrees: 'MBBS, MRCP, MD (Neurology)',
    chamber: 'CMH Dhaka, Cantonment',
    fee: 2000,
    rating: 4.9,
    reviews: 167,
    experience: 19,
    availableToday: false,
    bookingEnabled: false,
    queueActive: false,
    verified: true,
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=800',
    queue: 0,
    profile: {
      slug: 'dr-tanvir-hasan',
      bio: 'Dr. Tanvir Hasan is one of Bangladesh\'s foremost Neurologists, with 19 years of experience in advanced neuroscience and clinical practice. An MRCP holder from the UK, he specializes in complex movement disorders, neuromuscular diseases, and cutting-edge neuromodulation therapies.',
      onlineFee: 1500,
      offlineFee: 2000,
      totalPatients: 8900,
      chamberName: 'Combined Military Hospital (CMH) Dhaka',
      chamberAddress: 'CMH Road, Dhaka Cantonment, Dhaka 1206',
      chamberPhone: '+880 2-8870011',
      education: [
        { degree: 'MBBS', institution: 'Armed Forces Medical College', year: '2000' },
        { degree: 'MRCP', institution: 'Royal College of Physicians, London', year: '2007' },
        { degree: 'MD (Neurology)', institution: 'BSMMU', year: '2010' },
      ],
      experienceList: [
        'Brigadier General & Chief Neurologist, CMH Dhaka (2018 – Present)',
        'Research Fellow, UCL Institute of Neurology, London (2006 – 2008)',
        'Colonel, Combined Military Hospital Comilla (2012 – 2018)',
      ],
      specializations: ['Movement Disorders', 'Neuromuscular Disease', 'Deep Brain Stimulation', 'Dementia', 'Neuropathic Pain'],
      visitingHours: [
        { day: 'Saturday', time: '', closed: true },
        { day: 'Sunday', time: '10:00 AM – 1:00 PM' },
        { day: 'Monday', time: '10:00 AM – 1:00 PM' },
        { day: 'Tuesday', time: '', closed: true },
        { day: 'Wednesday', time: '10:00 AM – 1:00 PM' },
        { day: 'Thursday', time: '10:00 AM – 1:00 PM' },
        { day: 'Friday', time: '', closed: true },
      ],
      reviews: [
        { id: 1, patient: 'Brig. (Retd.) Zakir', rating: 5, comment: 'Exceptional expertise in movement disorders. He is the only doctor who correctly managed my Parkinson\'s.', date: '2024-05-16', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 2, patient: 'Shirin Islam', rating: 5, comment: 'My dementia diagnosis and care plan from Dr. Tanvir has helped my father maintain quality of life.', date: '2024-04-23', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 3, patient: 'Mainul Haque', rating: 5, comment: 'Top-tier neurologist. His neuropathic pain treatment program has reduced my pain by 80%.', date: '2024-03-31', avatar: 'https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 4, patient: 'Feroza Khatun', rating: 4, comment: 'Appointments are hard to get but once you\'re with him the consultation is thorough and worth it.', date: '2024-02-27', avatar: 'https://images.pexels.com/photos/1587014/pexels-photo-1587014.jpeg?auto=compress&cs=tinysrgb&w=80' },
        { id: 5, patient: 'Nasim Ahmed', rating: 5, comment: 'The deep brain stimulation assessment was done with incredible precision. Highly recommend.', date: '2024-01-13', avatar: 'https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=80' },
      ],
    },
  },
];
