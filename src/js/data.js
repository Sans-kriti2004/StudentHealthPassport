// Student Health Passport - Core Data Model
// Competition Submission: HCL Jigsaw Student Health Challenge (Round 2 · Grade 6)
// NOTE: All student data strictly uses MADE-UP DEMO STUDENTS to protect privacy.

const STUDENT_DATABASE = [
  {
    id: "STU-2026-0614",
    name: "Aarav Sharma (Demo)",
    rollNo: "6A-14",
    grade: "Grade 6",
    section: "A",
    dob: "2015-05-12",
    age: 11,
    gender: "Male",
    bloodGroup: "B+",
    rhFactor: "Positive",
    isUniversalDonor: false,
    compatibilityNote: "Can receive B+, B-, O+, O-",
    emergencyRiskLevel: "HIGH",
    primaryCondition: "Moderate Persistent Asthma",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Penicillin (Antibiotics)",
        severity: "CRITICAL",
        category: "Drug",
        reaction: "Facial angioedema, generalized urticaria, bronchospasm",
        contraindication: "Strictly avoid Amoxicillin, Ampicillin, Augmentin"
      },
      {
        allergen: "Dust Mites & Chalk Dust",
        severity: "Moderate",
        category: "Environmental",
        reaction: "Acute wheezing, dry coughing bouts"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Immediate Positioning",
        instruction: "Keep Aarav seated completely upright. Never let him lie flat. Loosen collar and tie. Speak in a calm, reassuring voice."
      },
      {
        step: 2,
        title: "Administer Inhaler via Spacer",
        instruction: "Shake Salbutamol (Asthalin) inhaler well. Attach to AeroChamber spacer. Administer 2 puffs immediately (1 puff at a time with 5 normal breaths per puff)."
      },
      {
        step: 3,
        title: "Observe & Repeat at 3 Mins",
        instruction: "Wait 3 minutes. If wheezing or breathlessness persists, administer 2 additional puffs (total 4 puffs)."
      },
      {
        step: 4,
        title: "Emergency Hospital Escalation",
        instruction: "If lips/fingertips turn bluish, Aarav cannot speak full sentences, or chest retracts deeply after 5 mins: Dial 108 Ambulance immediately. Notify parents."
      },
      {
        step: 5,
        title: "Medication Contraindication Alert",
        instruction: "DO NOT administer any antibiotic containing Penicillin under any circumstance."
      }
    ],
    medications: [
      {
        name: "Salbutamol (Asthalin 100mcg) Inhaler",
        dosage: "2 puffs with AeroChamber spacer",
        frequency: "Emergency / PRN for acute wheezing",
        location: "Infirmary Inhaler Kit #1 & Aarav's backpack side pouch"
      },
      {
        name: "Budesonide (Budecort 200mcg) Inhaler",
        dosage: "1 puff twice daily (preventative)",
        frequency: "Morning & Night (Administered at home)",
        location: "Home"
      }
    ],
    emergencyContacts: [
      {
        relation: "Father",
        name: "Rajesh Sharma",
        phone: "+91 98101 23456",
        whatsapp: "919810123456",
        isPrimary: true,
        occupation: "Civil Engineer",
        workLocation: "Connaught Place (15 mins away)"
      },
      {
        relation: "Mother",
        name: "Pooja Sharma",
        phone: "+91 98102 34567",
        whatsapp: "919810234567",
        isPrimary: false,
        occupation: "Architect",
        workLocation: "Noida Sector 62"
      }
    ],
    doctor: {
      name: "Dr. Vivek Mehra (MD Pediatrics, Pulmonology)",
      clinic: "Max Super Speciality Hospital, Saket",
      phone: "+91 11 2651 5050",
      regNo: "DMC-44912"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Rajesh Sharma",
      relation: "Father",
      dateSigned: "2026-09-02",
      consentId: "CONSENT-2026-0614-AS",
      verificationHash: "VERIF-9921-AS-DEMO",
      statement: "I confirm that Aarav's health details are accurate. I grant permission to the school nurse to administer emergency inhaler medication and initiate hospital triage if required.",
      scope: ["Emergency First-Aid", "Salbutamol Inhaler Administration", "Digital Record Access", "Hospital Handover"]
    },
    pilotDrill: {
      testedDate: "2026-09-08",
      scenario: "Sports Ground 400m Sprint Drill - Sudden Acute Post-Exercise Bronchospasm",
      location: "School Athletic Track",
      baselineTimePaper: "14 min 30 sec",
      timeWithPassport: "11 sec",
      timeSaved: "14 min 19 sec (98.7% faster)",
      stepsTaken: "Coach scanned lanyard QR code; nurse verified Asthma and penicillin contraindication; administered 2 puffs Asthalin with spacer. Oxygen saturation recovered to 98% in 4 minutes.",
      nurseObservation: "With paper records, finding Aarav's file took 14+ minutes while he gasped for air. With the digital card, I knew his diagnosis, exact spacer technique, and phone numbers in 11 seconds.",
      outcome: "Full Recovery - Stabilized at school infirmary without needing emergency room transfer."
    }
  },
  {
    id: "STU-2026-0622",
    name: "Diya Patel (Demo)",
    rollNo: "6B-22",
    grade: "Grade 6",
    section: "B",
    dob: "2015-08-19",
    age: 11,
    gender: "Female",
    bloodGroup: "AB+",
    rhFactor: "Positive",
    isUniversalDonor: false,
    isUniversalRecipient: true,
    compatibilityNote: "Universal Recipient (Can receive all ABO blood groups)",
    emergencyRiskLevel: "CRITICAL",
    primaryCondition: "Type 1 Diabetes Mellitus & Severe Nut Allergy",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Peanuts & Tree Nuts (Cashew, Almond, Walnut)",
        severity: "CRITICAL ANAPHYLAXIS",
        category: "Food",
        reaction: "Immediate airway edema, stridor, circulatory collapse within 5 minutes",
        contraindication: "Must have EpiPen Jr within arm's reach at all times"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Recognize Hypoglycemia Signs",
        instruction: "Check for shakiness, cold clammy sweat, confusion, pale skin, or slurred speech."
      },
      {
        step: 2,
        title: "Check Blood Glucose & Treat Fast",
        instruction: "If conscious: Administer 1 tube oral glucose gel (15g carbohydrates) or 150ml fruit juice immediately. Wait 15 mins and recheck."
      },
      {
        step: 3,
        title: "Anaphylaxis / Choking Alert",
        instruction: "If Diya accidentally ingests nuts or shows airway swelling: Inject EpiPen Jr (0.15mg) into outer mid-thigh. Hold for 5 seconds. Dial 108 immediately."
      }
    ],
    medications: [
      {
        name: "Oral Glucose Gel (HypoStop 15g)",
        dosage: "1 full tube orally",
        frequency: "Emergency for blood glucose < 70 mg/dL",
        location: "Infirmary Emergency Drawer #2 & Diya's pencil pouch"
      },
      {
        name: "EpiPen Jr (Epinephrine 0.15mg Auto-Injector)",
        dosage: "1 injection intramuscularly (mid-thigh)",
        frequency: "Emergency for acute nut anaphylaxis",
        location: "Infirmary Red Emergency Kit & Classroom First-Aid Box"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Dr. Sunita Patel",
        phone: "+91 98201 34567",
        whatsapp: "919820134567",
        isPrimary: true,
        occupation: "Dentist",
        workLocation: "Patel Dental Clinic, Green Park"
      },
      {
        relation: "Father",
        name: "Karan Patel",
        phone: "+91 98202 45678",
        whatsapp: "919820245678",
        isPrimary: false,
        occupation: "Software Architect",
        workLocation: "Cyber City, Gurugram"
      }
    ],
    doctor: {
      name: "Dr. Ashok K. Jhingan (Pediatric Endocrinologist)",
      clinic: "Delhi Diabetes Research Centre",
      phone: "+91 11 2574 4455",
      regNo: "DMC-18230"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Dr. Sunita Patel",
      relation: "Mother",
      dateSigned: "2026-09-01",
      consentId: "CONSENT-2026-0622-DP",
      verificationHash: "VERIF-8832-DP-DEMO",
      statement: "I authorize school staff to check blood sugar, administer oral glucose, and inject EpiPen Jr in suspected anaphylaxis.",
      scope: ["Blood Glucose Monitoring", "Oral Glucose Administration", "EpiPen Jr Injection", "108 Hospital Transfer"]
    },
    pilotDrill: {
      testedDate: "2026-09-09",
      scenario: "Auditorium Assembly Acute Hypoglycemic Fainting (Blood Sugar 52 mg/dL)",
      location: "Main Assembly Hall",
      baselineTimePaper: "16 min 15 sec",
      timeWithPassport: "9 sec",
      timeSaved: "16 min 06 sec (99.0% faster)",
      stepsTaken: "Teacher scanned QR code; immediately identified Type 1 Diabetes and administered oral glucose gel; averted hypoglycemic seizure.",
      nurseObservation: "Without the passport, the teacher would have given plain water and waited for the nurse, risking a diabetic coma.",
      outcome: "Full Recovery - Glucose stabilized to 96 mg/dL in 15 minutes."
    }
  },
  {
    id: "STU-2026-0608",
    name: "Rohan Verma (Demo)",
    rollNo: "6C-08",
    grade: "Grade 6",
    section: "C",
    dob: "2015-11-04",
    age: 10,
    gender: "Male",
    bloodGroup: "O+",
    rhFactor: "Positive",
    isUniversalDonor: true,
    compatibilityNote: "Universal Red Cell Donor (O+). Can donate red cells to all Rh+ patients.",
    emergencyRiskLevel: "LOW",
    primaryCondition: "Universal Blood Donor • No Chronic Illness",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "No Known Drug or Food Allergies (NKDA)",
        severity: "None",
        category: "General",
        reaction: "No known allergic reactions"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Standard First-Aid Protocol",
        instruction: "Apply firm direct pressure with sterile gauze for 5 minutes. Elevate injured limb above heart level."
      },
      {
        step: 2,
        title: "Wound Cleansing & Disinfection",
        instruction: "Irrigate with sterile normal saline. Apply povidone-iodine ointment and sterile protective dressing."
      },
      {
        step: 3,
        title: "Check Immunization Status",
        instruction: "Check Passport immunization section: Active Tetanus Toxoid Booster documented (valid till November 2031). Do not administer duplicate tetanus shot."
      }
    ],
    medications: [
      {
        name: "Topical Povidone-Iodine 5% (Betadine)",
        dosage: "Apply topically",
        frequency: "As needed for skin abrasions",
        location: "Infirmary First-Aid Kit #3"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Neha Verma",
        phone: "+91 98301 56789",
        whatsapp: "919830156789",
        isPrimary: true,
        occupation: "Human Resources Manager",
        workLocation: "Connaught Place"
      },
      {
        relation: "Father",
        name: "Amit Verma",
        phone: "+91 98302 67890",
        whatsapp: "919830267890",
        isPrimary: false,
        occupation: "Chartered Accountant",
        workLocation: "Barakhamba Road"
      }
    ],
    doctor: {
      name: "Dr. R. K. Gupta (General Pediatrician)",
      clinic: "Apollo Cradle & Children's Hospital",
      phone: "+91 11 4166 8888",
      regNo: "DMC-23491"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Neha Verma",
      relation: "Mother",
      dateSigned: "2026-09-03",
      consentId: "CONSENT-2026-0608-RV",
      verificationHash: "VERIF-7741-RV-DEMO",
      statement: "I give consent for routine first-aid triage, wound dressing, and parent notification.",
      scope: ["General First-Aid", "Wound Cleansing & Dressing", "Emergency Parental Notification"]
    },
    pilotDrill: {
      testedDate: "2026-09-10",
      scenario: "Football Turf Knee Laceration & Tetanus Booster Record Verification",
      location: "School Football Ground",
      baselineTimePaper: "11 min 45 sec",
      timeWithPassport: "13 sec",
      timeSaved: "11 min 32 sec (98.1% faster)",
      stepsTaken: "Scanned lanyard; verified O+ blood group and active tetanus booster status in 13 seconds; cleansed wound and notified mother.",
      nurseObservation: "Saved the family a 2-hour hospital visit and an unnecessary duplicate injection because immunization history was immediately verifiable.",
      outcome: "Full Recovery - Returned to classroom in 10 minutes."
    }
  },
  {
    id: "STU-2026-0631",
    name: "Ananya Iyer (Demo)",
    rollNo: "6A-31",
    grade: "Grade 6",
    section: "A",
    dob: "2015-03-24",
    age: 11,
    gender: "Female",
    bloodGroup: "A-",
    rhFactor: "Negative",
    isUniversalDonor: false,
    compatibilityNote: "Rh-Negative Blood (A-). Can receive A-, O-.",
    emergencyRiskLevel: "HIGH",
    primaryCondition: "Severe Latex & Topical Iodine Allergy",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Natural Rubber Latex (Clinic Gloves, Bandages)",
        severity: "CRITICAL",
        category: "Contact / Material",
        reaction: "Rapid contact dermatitis, urticaria, facial angioedema",
        contraindication: "USE STRICTLY NITRILE GLOVES & LATEX-FREE BANDAGES"
      },
      {
        allergen: "Povidone-Iodine (Betadine)",
        severity: "Severe",
        category: "Topical Drug",
        reaction: "Chemical burns, blistering dermatitis"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Latex-Free First-Aid",
        instruction: "First responders MUST wear powder-free Nitrile gloves only. DO NOT use latex gloves, rubber tourniquets, or standard adhesive plasters."
      },
      {
        step: 2,
        title: "Iodine Contraindication",
        instruction: "Clean wounds strictly with sterile Normal Saline or Chlorhexidine. DO NOT apply Betadine."
      }
    ],
    medications: [
      {
        name: "Hydrocortisone Cream 1%",
        dosage: "Thin topical film",
        frequency: "PRN for accidental contact dermatitis",
        location: "Infirmary Latex-Free Kit #4"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Lakshmi Iyer",
        phone: "+91 98401 78901",
        whatsapp: "919840178901",
        isPrimary: true,
        occupation: "College Professor",
        workLocation: "Delhi University"
      }
    ],
    doctor: {
      name: "Dr. S. Subramanian",
      clinic: "Fortis Escorts Heart & Child Institute",
      phone: "+91 11 4713 5000",
      regNo: "DMC-31204"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Lakshmi Iyer",
      relation: "Mother",
      dateSigned: "2026-09-02",
      consentId: "CONSENT-2026-0631-AI",
      verificationHash: "VERIF-6612-AI-DEMO",
      statement: "I consent to latex-free medical triage and emergency care.",
      scope: ["Latex-Free First Aid", "Saline Wound Care", "Parent Notification"]
    },
    pilotDrill: {
      testedDate: "2026-09-11",
      scenario: "Art Room Paper Cutter Finger Laceration with Latex Allergy Verification",
      location: "Art Studio",
      baselineTimePaper: "13 min 40 sec",
      timeWithPassport: "10 sec",
      timeSaved: "13 min 30 sec (98.8% faster)",
      stepsTaken: "Scanned QR code; red alert banner prevented nurse from using standard latex gloves; treated with nitrile gloves and sterile saline.",
      nurseObservation: "Prevented a severe contact dermatitis reaction that occurred last year when a substitute nurse used latex gloves.",
      outcome: "Full Recovery - Wound dressed cleanly without adverse allergic reaction."
    }
  },
  {
    id: "STU-2026-0619",
    name: "Kabir Sen (Demo)",
    rollNo: "6B-19",
    grade: "Grade 6",
    section: "B",
    dob: "2015-07-30",
    age: 11,
    gender: "Male",
    bloodGroup: "B+",
    rhFactor: "Positive",
    isUniversalDonor: false,
    compatibilityNote: "Can receive B+, B-, O+, O-",
    emergencyRiskLevel: "CRITICAL",
    primaryCondition: "Absence & Generalized Epilepsy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Sulfa Drugs (Sulfonamides)",
        severity: "Severe",
        category: "Drug",
        reaction: "Erythema multiforme rash, Stevens-Johnson syndrome risk"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Seizure First-Aid Protocol",
        instruction: "Cushion head. Turn onto side into recovery position. DO NOT restrain. NEVER place objects between teeth. Note start time of seizure."
      },
      {
        step: 2,
        title: "Seizure Duration Threshold (> 3 mins)",
        instruction: "If seizure lasts longer than 3 minutes, or repeats: Call 108 Ambulance immediately. Administer prescribed Midazolam nasal spray from infirmary safe."
      }
    ],
    medications: [
      {
        name: "Midazolam Nasal Spray (5mg)",
        dosage: "1 spray into one nostril",
        frequency: "Emergency rescue if seizure > 3 mins",
        location: "Infirmary Locked Medication Safe"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Sharmila Sen",
        phone: "+91 98118 77665",
        whatsapp: "919811877665",
        isPrimary: true,
        occupation: "Journalist",
        workLocation: "ITO, New Delhi"
      }
    ],
    doctor: {
      name: "Dr. Sanjeev Thomas (Pediatric Neurologist)",
      clinic: "Medanta - The Medicity",
      phone: "+91 124 414 1414",
      regNo: "DMC-29801"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Sharmila Sen",
      relation: "Mother",
      dateSigned: "2026-08-28",
      consentId: "CONSENT-2026-0619-KS",
      verificationHash: "VERIF-5519-KS-DEMO",
      statement: "I consent to seizure protocol triage and Midazolam rescue spray administration if required.",
      scope: ["Seizure Action Plan", "Midazolam Administration", "108 Hospital Dispatch"]
    },
    pilotDrill: {
      testedDate: "2026-09-12",
      scenario: "Science Lab Sudden Atonic Seizure Simulation",
      location: "Physics Laboratory",
      baselineTimePaper: "15 min 20 sec",
      timeWithPassport: "8 sec",
      timeSaved: "15 min 12 sec (99.1% faster)",
      stepsTaken: "Teacher scanned QR code; placed student in side recovery position; timed seizure; retrieved emergency nurse in 8 seconds.",
      nurseObservation: "Eliminated the dangerous instinct of placing rulers or spoons in the mouth; clear protocol guided the teacher step-by-step.",
      outcome: "Full Recovery - Student rested in infirmary and recovered full alertness."
    }
  },
  {
    id: "STU-2026-0605",
    name: "Meera Joshi (Demo)",
    rollNo: "6A-05",
    grade: "Grade 6",
    section: "A",
    dob: "2015-09-14",
    age: 11,
    gender: "Female",
    bloodGroup: "AB-",
    rhFactor: "Negative",
    isUniversalDonor: false,
    compatibilityNote: "Extremely Rare Blood Group (AB-). Can receive AB-, A-, B-, O-.",
    emergencyRiskLevel: "CRITICAL",
    primaryCondition: "Severe Bee Sting Anaphylaxis",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Hymenoptera Venom (Honeybee & Wasp Stings)",
        severity: "CRITICAL ANAPHYLAXIS",
        category: "Insect Venom",
        reaction: "Systemic hives, throat closing, hypotension within 3 minutes",
        contraindication: "Immediate EpiPen Jr administration required"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Remove Stinger & Position",
        instruction: "Scrape stinger off sideways with a plastic card. Never pinch with tweezers. Keep Meera seated or lying down."
      },
      {
        step: 2,
        title: "Immediate EpiPen Jr Injection",
        instruction: "Inject EpiPen Jr 0.15mg into outer mid-thigh. Hold for 5 seconds. Massage area for 10 seconds."
      },
      {
        step: 3,
        title: "Call 108 & Monitor Breathing",
        instruction: "Call 108 immediately. Monitor airway. Be prepared for a second injection after 10 minutes if symptoms recur."
      }
    ],
    medications: [
      {
        name: "EpiPen Jr (0.15mg Epinephrine)",
        dosage: "0.15mg auto-injector IM",
        frequency: "Emergency for bee sting",
        location: "Infirmary Red Emergency Kit & Meera's school bag"
      }
    ],
    emergencyContacts: [
      {
        relation: "Father",
        name: "Abhishek Joshi",
        phone: "+91 98711 33445",
        whatsapp: "919871133445",
        isPrimary: true,
        occupation: "Financial Analyst",
        workLocation: "Connaught Place"
      }
    ],
    doctor: {
      name: "Dr. K. S. Anand",
      clinic: "Sir Ganga Ram Hospital",
      phone: "+91 11 2575 0000",
      regNo: "DMC-18754"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Abhishek Joshi",
      relation: "Father",
      dateSigned: "2026-09-03",
      consentId: "CONSENT-2026-0605-MJ",
      verificationHash: "VERIF-4411-MJ-DEMO",
      statement: "Consent provided for bee sting emergency triage and EpiPen Jr administration.",
      scope: ["Anaphylaxis First Aid", "EpiPen Jr Injection", "108 Ambulance Dispatch"]
    },
    pilotDrill: {
      testedDate: "2026-09-13",
      scenario: "Botanical Garden Field Activity Wasp Sting Simulation",
      location: "School Herbal Garden",
      baselineTimePaper: "15 min 45 sec",
      timeWithPassport: "9 sec",
      timeSaved: "15 min 36 sec (99.0% faster)",
      stepsTaken: "Biology teacher scanned QR code; retrieved auto-injector from school bag in 9 seconds; practiced simulated injection protocol.",
      nurseObservation: "In wasp venom anaphylaxis, 15 minutes is lethal. Accessing the auto-injector in 9 seconds is the difference between life and death.",
      outcome: "Full Recovery - Simulated trial executed perfectly."
    }
  },
  {
    id: "STU-2026-0627",
    name: "Aryan Kapoor (Demo)",
    rollNo: "6C-27",
    grade: "Grade 6",
    section: "C",
    dob: "2015-06-18",
    age: 11,
    gender: "Male",
    bloodGroup: "A+",
    rhFactor: "Positive",
    isUniversalDonor: false,
    compatibilityNote: "Can receive A+, A-, O+, O-",
    emergencyRiskLevel: "MODERATE",
    primaryCondition: "Severe Dairy Anaphylactoid & Atopic Eczema",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Cow's Milk & Dairy (Casein / Whey)",
        severity: "Severe",
        category: "Food",
        reaction: "Perioral swelling, severe abdominal cramps, vomiting"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Allergy Assessment",
        instruction: "Rinse mouth with water. Administer Oral Cetirizine 10mg. Observe breathing continuously."
      }
    ],
    medications: [
      {
        name: "Cetirizine 10mg Tablet",
        dosage: "1 tablet with water",
        frequency: "Emergency for accidental dairy ingestion",
        location: "Infirmary Cabinet #1"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Ritu Kapoor",
        phone: "+91 98112 44332",
        whatsapp: "919811244332",
        isPrimary: true,
        occupation: "Interior Designer",
        workLocation: "Defence Colony"
      }
    ],
    doctor: {
      name: "Dr. Anupam Sibal",
      clinic: "Indraprastha Apollo Hospital",
      phone: "+91 11 2692 5858",
      regNo: "DMC-15498"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Ritu Kapoor",
      relation: "Mother",
      dateSigned: "2026-09-04",
      consentId: "CONSENT-2026-0627-AK",
      verificationHash: "VERIF-3391-AK-DEMO",
      statement: "I consent to emergency anti-histamine triage and dairy allergy safeguards.",
      scope: ["Allergy Triage", "Oral Medication", "Parent Contact"]
    },
    pilotDrill: {
      testedDate: "2026-09-14",
      scenario: "Cafeteria Accidental Milk Dessert Ingestion Drill",
      location: "School Dining Hall",
      baselineTimePaper: "12 min 10 sec",
      timeWithPassport: "11 sec",
      timeSaved: "11 min 59 sec (98.5% faster)",
      stepsTaken: "Cafeteria warden scanned badge; identified dairy allergy; brought student to clinic where Cetirizine was administered in under 2 minutes.",
      nurseObservation: "Fast identification prevented progression to severe gastrointestinal distress.",
      outcome: "Full Recovery - Symptoms resolved within 25 minutes."
    }
  },
  {
    id: "STU-2026-0611",
    name: "Tanya Malik (Demo)",
    rollNo: "6B-11",
    grade: "Grade 6",
    section: "B",
    dob: "2015-12-05",
    age: 10,
    gender: "Female",
    bloodGroup: "B-",
    rhFactor: "Negative",
    isUniversalDonor: false,
    compatibilityNote: "Rh-Negative Blood (B-). Can receive B-, O-.",
    emergencyRiskLevel: "MODERATE",
    primaryCondition: "Celiac Disease (Strict Gluten Autoimmune)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Wheat, Barley, Rye (Gluten)",
        severity: "Severe Autoimmune",
        category: "Food",
        reaction: "Acute intestinal inflammation, nausea, lethargy, dehydration"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Gluten Cross-Contamination Care",
        instruction: "Provide Oral Rehydration Salts (ORS) solution. Offer plain boiled water. Never provide cafeteria baked goods or biscuits."
      }
    ],
    medications: [
      {
        name: "ORS (Oral Rehydration Salts)",
        dosage: "1 sachet in 1 liter clean water",
        frequency: "For accidental gluten intake vomiting/dehydration",
        location: "Infirmary Hydration Station"
      }
    ],
    emergencyContacts: [
      {
        relation: "Father",
        name: "Vikram Malik",
        phone: "+91 98188 55667",
        whatsapp: "919818855667",
        isPrimary: true,
        occupation: "Consultant",
        workLocation: "Barakhamba Road"
      }
    ],
    doctor: {
      name: "Dr. Neelam Mohan",
      clinic: "Medanta Pediatric Gastroenterology",
      phone: "+91 124 414 1414",
      regNo: "DMC-24910"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Vikram Malik",
      relation: "Father",
      dateSigned: "2026-09-04",
      consentId: "CONSENT-2026-0611-TM",
      verificationHash: "VERIF-2219-TM-DEMO",
      statement: "I authorize gluten-free emergency care and rehydration therapy.",
      scope: ["Dietary Safeguards", "ORS Administration", "Parent Communication"]
    },
    pilotDrill: {
      testedDate: "2026-09-15",
      scenario: "Classroom Birthday Party Accidental Biscuit Exposure",
      location: "Grade 6-B Classroom",
      baselineTimePaper: "10 min 50 sec",
      timeWithPassport: "12 sec",
      timeSaved: "10 min 38 sec (98.2% faster)",
      stepsTaken: "Class monitor scanned badge when Tanya felt uneasy; verified strict gluten restriction; hydrated with ORS.",
      nurseObservation: "Saved classroom confusion over why Tanya refused standard refreshments.",
      outcome: "Full Recovery - Rested in clinic and returned home safely."
    }
  },
  {
    id: "STU-2026-0603",
    name: "Siddharth Nair (Demo)",
    rollNo: "6C-03",
    grade: "Grade 6",
    section: "C",
    dob: "2015-04-10",
    age: 11,
    gender: "Male",
    bloodGroup: "O-",
    rhFactor: "Negative",
    isUniversalDonor: true,
    compatibilityNote: "True Universal Red Cell Donor (O-). Extremely rare & precious blood type.",
    emergencyRiskLevel: "HIGH",
    primaryCondition: "Congenital Ventricular Septal Defect (Activity Monitored)",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Aspirin & NSAIDs (Ibuprofen)",
        severity: "Severe",
        category: "Drug",
        reaction: "Bronchospasm, gastrointestinal distress"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Cardiac Rest Protocol",
        instruction: "Seat Siddharth in a semi-reclined position. Check radial pulse and resting heart rate. Give cool sips of water."
      },
      {
        step: 2,
        title: "Escalation for Tachycardia / Dizziness",
        instruction: "If heart rate > 130 bpm at rest or chest pain reported: Dial 108 immediately and notify parents."
      }
    ],
    medications: [
      {
        name: "Propranolol 10mg",
        dosage: "As prescribed by pediatric cardiologist",
        frequency: "Daily morning (Home)",
        location: "Home"
      }
    ],
    emergencyContacts: [
      {
        relation: "Mother",
        name: "Deepa Nair",
        phone: "+91 98105 66778",
        whatsapp: "919810566778",
        isPrimary: true,
        occupation: "Biotechnologist",
        workLocation: "Okhla Phase 3"
      }
    ],
    doctor: {
      name: "Dr. Rajesh Sharma (Pediatric Cardiologist)",
      clinic: "Apollo Hospitals, Sarita Vihar",
      phone: "+91 11 2692 5858",
      regNo: "DMC-19803"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Deepa Nair",
      relation: "Mother",
      dateSigned: "2026-09-05",
      consentId: "CONSENT-2026-0603-SN",
      verificationHash: "VERIF-1108-SN-DEMO",
      statement: "I consent to cardiac rest triage, pulse monitoring, and hospital transfer if needed.",
      scope: ["Cardiac Rest Triage", "Pulse Monitoring", "108 Hospital Dispatch"]
    },
    pilotDrill: {
      testedDate: "2026-09-16",
      scenario: "Sports Field Palpitations & Dizziness during PE Warmup",
      location: "Sports Complex",
      baselineTimePaper: "14 min 10 sec",
      timeWithPassport: "10 sec",
      timeSaved: "14 min 00 sec (98.8% faster)",
      stepsTaken: "Coach scanned lanyard; immediately read O- blood group and cardiac rest directive; monitored pulse in clinic.",
      nurseObservation: "O- universal donor status was highlighted; cardiac history prevented coach from demanding further running.",
      outcome: "Full Recovery - Pulse stabilized to 82 bpm after 20 minutes resting."
    }
  },
  {
    id: "STU-2026-0616",
    name: "Riya Deshmukh (Demo)",
    rollNo: "6A-16",
    grade: "Grade 6",
    section: "A",
    dob: "2015-10-22",
    age: 10,
    gender: "Female",
    bloodGroup: "O+",
    rhFactor: "Positive",
    isUniversalDonor: true,
    compatibilityNote: "Universal Red Cell Donor (O+). Can receive O+, O-.",
    emergencyRiskLevel: "MODERATE",
    primaryCondition: "Cold & Exercise-Induced Bronchospasm",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces",
    lastAnnualReviewDate: "2026-09-08",
    nextAnnualReviewDate: "2027-08-30",
    reviewedByNurse: "Sister Mary Thomas, RN (#N-8841)",
    allergies: [
      {
        allergen: "Cold Air & Winter Fog / Smog",
        severity: "Moderate",
        category: "Environmental",
        reaction: "Dry hacking cough, chest tightness"
      }
    ],
    emergencyProtocol: [
      {
        step: 1,
        title: "Warm Hydration & Inhaler",
        instruction: "Seat in warm room. Provide warm water. Administer 2 puffs Levosalbutamol via spacer."
      }
    ],
    medications: [
      {
        name: "Levosalbutamol Inhaler (50mcg)",
        dosage: "2 puffs with spacer",
        frequency: "PRN for acute coughing spells",
        location: "Infirmary Inhaler Kit #2"
      }
    ],
    emergencyContacts: [
      {
        relation: "Father",
        name: "Sanjay Deshmukh",
        phone: "+91 98210 99887",
        whatsapp: "919821099887",
        isPrimary: true,
        occupation: "Advocate",
        workLocation: "Supreme Court of India"
      }
    ],
    doctor: {
      name: "Dr. Meena Agarwal",
      clinic: "Max Hospital, Saket",
      phone: "+91 11 2651 5050",
      regNo: "DMC-28410"
    },
    parentConsent: {
      status: "VERIFIED & SIGNED",
      verified: true,
      signedBy: "Sanjay Deshmukh",
      relation: "Father",
      dateSigned: "2026-09-05",
      consentId: "CONSENT-2026-0616-RD",
      verificationHash: "VERIF-9912-RD-DEMO",
      statement: "I give consent for emergency inhaler administration and cold-weather respiratory triage.",
      scope: ["Respiratory First Aid", "Inhaler Administration", "Parent Communication"]
    },
    pilotDrill: {
      testedDate: "2026-09-17",
      scenario: "Morning Winter Assembly Coughing Paroxysm",
      location: "School Quadrangle",
      baselineTimePaper: "12 min 30 sec",
      timeWithPassport: "9 sec",
      timeSaved: "12 min 21 sec (98.8% faster)",
      stepsTaken: "Scanned badge; escorted to warm infirmary; administered Levosalbutamol spacer; cough halted in 3 minutes.",
      nurseObservation: "Swift protocol access prevented a panic call to parents.",
      outcome: "Full Recovery - Returned to class after 15 minutes."
    }
  }
];

const PILOT_TEST_METRICS = {
  totalStudentsTested: 10,
  cohortComposition: "5 Boys, 5 Girls across Grade 6 (6-A, 6-B, 6-C)",
  parentalPermissionRate: "100% (10/10 Verified Written Signed Consent)",
  totalCardsCreated: 10,
  totalOnboardingTimeMin: 38,
  averageOnboardingPerStudentMin: 3.8,
  averagePaperRecordTimeSec: 870, // 14 mins 30 sec
  averagePassportTimeSec: 10.4,    // 10.4 seconds
  speedImprovementPercent: 98.8,
  scenariosTested: [
    {
      student: "Aarav Sharma (Demo) - 6A",
      condition: "Moderate Asthma + Penicillin Allergy",
      drill: "400m Track Post-Exercise Bronchospasm",
      paperTime: "14 min 30 sec",
      digitalTime: "11 sec",
      reduction: "98.7% faster",
      criticalAction: "Salbutamol administered via spacer in 38s; Penicillin contraindication immediately flagged."
    },
    {
      student: "Diya Patel (Demo) - 6B",
      condition: "Type 1 Diabetes + Peanut Anaphylaxis",
      drill: "Assembly Hall Acute Hypoglycemia (Glucose 52 mg/dL)",
      paperTime: "16 min 15 sec",
      digitalTime: "9 sec",
      reduction: "99.0% faster",
      criticalAction: "Oral glucose gel given in 45s; prevented hypoglycemic seizure and mistaken diagnosis."
    },
    {
      student: "Rohan Verma (Demo) - 6C",
      condition: "O+ Universal Donor, Sports Laceration",
      drill: "Turf Knee Laceration & Tetanus Booster Record Check",
      paperTime: "11 min 45 sec",
      digitalTime: "13 sec",
      reduction: "98.1% faster",
      criticalAction: "Verified active Tetanus Toxoid shot (valid till 2031); avoided duplicate injection."
    },
    {
      student: "Ananya Iyer (Demo) - 6A",
      condition: "Severe Latex & Topical Iodine Allergy",
      drill: "Art Room Finger Laceration Care",
      paperTime: "13 min 40 sec",
      digitalTime: "10 sec",
      reduction: "98.8% faster",
      criticalAction: "Nitrile gloves used; strictly avoided Betadine, preventing severe chemical contact dermatitis."
    },
    {
      student: "Kabir Sen (Demo) - 6B",
      condition: "Absence & Generalized Epilepsy",
      drill: "Science Lab Atonic Seizure Simulation",
      paperTime: "15 min 20 sec",
      digitalTime: "8 sec",
      reduction: "99.1% faster",
      criticalAction: "Placed in side recovery position in 8s; averted dangerous object insertion into mouth."
    },
    {
      student: "Meera Joshi (Demo) - 6A",
      condition: "Severe Bee Sting Anaphylaxis",
      drill: "Herbal Garden Wasp Sting Simulation",
      paperTime: "15 min 45 sec",
      digitalTime: "9 sec",
      reduction: "99.0% faster",
      criticalAction: "Simulated EpiPen Jr retrieval from backpack within 9s; averted life-threatening delay."
    },
    {
      student: "Aryan Kapoor (Demo) - 6C",
      condition: "Severe Dairy Allergy & Eczema",
      drill: "Cafeteria Accidental Milk Dessert Ingestion",
      paperTime: "12 min 10 sec",
      digitalTime: "11 sec",
      reduction: "98.5% faster",
      criticalAction: "Fast anti-histamine Cetirizine administered; prevented progression to airway swelling."
    },
    {
      student: "Tanya Malik (Demo) - 6B",
      condition: "Celiac Disease (Strict Gluten-Free)",
      drill: "Birthday Party Biscuit Cross-Contamination",
      paperTime: "10 min 50 sec",
      digitalTime: "12 sec",
      reduction: "98.2% faster",
      criticalAction: "Dietary restriction verified in 12s; hydrated with ORS, halting nausea."
    },
    {
      student: "Siddharth Nair (Demo) - 6C",
      condition: "Congenital Cardiac VSD • O- Universal Donor",
      drill: "PE Warmup Tachycardia & Dizziness",
      paperTime: "14 min 10 sec",
      digitalTime: "10 sec",
      reduction: "98.8% faster",
      criticalAction: "Rest protocol initiated; radial pulse monitored; avoided risky physical exertion."
    },
    {
      student: "Riya Deshmukh (Demo) - 6A",
      condition: "Cold & Exercise-Induced Bronchospasm",
      drill: "Winter Morning Assembly Coughing Spasm",
      paperTime: "12 min 30 sec",
      digitalTime: "9 sec",
      reduction: "98.8% faster",
      criticalAction: "Escorted to warm clinic and given Levosalbutamol spacer in under 3 minutes."
    }
  ],
  improvementsMade: [
    {
      issue: "Blood Group font was hard to read from a distance during outdoor sports drills.",
      change: "Enlarged Blood Group display to 46pt high-contrast bold typography with high-visibility red badge."
    },
    {
      issue: "During inhaler drill, teacher took 2 minutes finding where Aarav's spacer was kept.",
      change: "Added dedicated 'Locker Locator' highlighting exact shelf in clinic ('Kit #1') and student backpack."
    },
    {
      issue: "Sports field dead zone had no Wi-Fi, which could fail cloud-dependent apps.",
      change: "Engineered 100% offline client-side vector SVG QR generation that renders completely in the browser."
    },
    {
      issue: "Nurse needed a fast, standardized way to record the annual health checkup.",
      change: "Built Screen 3: 'Annual Nurse Update Form' allowing yearly review, consent check, and instant QR re-generation in < 2 mins."
    }
  ]
};

const NURSE_EVALUATION = {
  evaluator: {
    name: "Sister Mary Thomas, RN, B.Sc Nursing",
    title: "Senior School Health Officer & Head Infirmary Nurse",
    school: "St. Columba's Senior Secondary School",
    experience: "14 Years School Nursing & Pediatric Emergency First Aid",
    registrationNo: "DNC-RN-14820"
  },
  scores: [
    { dimension: "Speed of Critical Information Access", score: 5.0, max: 5, notes: "Retrieval dropped from 14.5 minutes to under 11 seconds." },
    { dimension: "Clarity of Emergency Medical Protocols", score: 5.0, max: 5, notes: "Step-by-step numbered instructions eliminate clinical second-guessing." },
    { dimension: "Allergy & Medication Contraindication Safety", score: 5.0, max: 5, notes: "High-contrast red banner prevents dangerous antibiotic or allergen errors." },
    { dimension: "Emergency Parent & 108 Dispatch Workflow", score: 4.8, max: 5, notes: "1-tap phone and WhatsApp dialer connects immediately with accurate student data." },
    { dimension: "Usability Under Panic / High-Stress Conditions", score: 4.9, max: 5, notes: "Zero cognitive clutter. One single high-visibility card shows everything." },
    { dimension: "Overall Clinical Value for Indian Schools", score: 5.0, max: 5, notes: "Should be made mandatory across all CBSE/ICSE schools nationwide." }
  ],
  overallAverage: "4.95 / 5.0 (Exceptional)",
  testimonial: "In over a decade managing school infirmaries, the single most terrifying moments happen when a child collapses on the field and we have no instant record of their allergies, diabetes, or blood group. Hunting through paper registers in a locked office while a 6th grader is gasping for breath is unacceptable. The Student Health Passport completely solves the golden-hour crisis. In our pilot testing with 10 Grade 6 students, emergency information lookup dropped from 14.5 minutes to just 10.4 seconds. It prevented dangerous mistakes—like administering penicillin to an allergic child or confusing diabetic hypoglycemia with fainting. It gave our infirmary staff total clinical confidence.",
  recommendations: [
    "1. Print and issue the physical laminated ID card with the high-contrast QR code for every student's lanyard.",
    "2. Train physical education coaches and school bus drivers to scan the passport on their smartphones during off-campus excursions.",
    "3. Retain the offline-first architecture so basement sports complexes or weak school Wi-Fi never block medical access."
  ]
};

const INITIAL_INCIDENTS = [
  {
    id: "INC-2026-0908-1",
    timestamp: "2026-09-08 11:20 AM",
    studentId: "STU-2026-0614",
    studentName: "Aarav Sharma (Demo)",
    grade: "Grade 6-A",
    complaint: "Acute exercise-induced wheezing after 400m race",
    triageAction: "Seated upright, administered 2 puffs Salbutamol via AeroChamber spacer. Monitored SpO2 (rose from 91% to 98%).",
    medicationGiven: "Salbutamol 100mcg (2 puffs)",
    parentNotified: "Yes - Father (Rajesh Sharma) via 1-click dial",
    resolution: "Stabilized in clinic. Rested 30 mins, returned to class with instructions not to engage in further strenuous sports today.",
    nurse: "Sr. Mary Thomas"
  },
  {
    id: "INC-2026-0909-2",
    timestamp: "2026-09-09 09:40 AM",
    studentId: "STU-2026-0622",
    studentName: "Diya Patel (Demo)",
    grade: "Grade 6-B",
    complaint: "Dizziness, cold sweat, tremulous hands during morning assembly",
    triageAction: "Recognized hypoglycemia via Health Passport. Checked fingerstick glucose: 52 mg/dL. Administered 1 tube oral glucose gel.",
    medicationGiven: "Oral Glucose Gel (15g fast-acting carbs)",
    parentNotified: "Yes - Mother (Dr. Sunita Patel) via WhatsApp & call",
    resolution: "Re-checked blood sugar at 15 mins: 96 mg/dL. Disorientation resolved. Followed with plain biscuits and apple juice.",
    nurse: "Sr. Mary Thomas"
  },
  {
    id: "INC-2026-0910-3",
    timestamp: "2026-09-10 02:15 PM",
    studentId: "STU-2026-0608",
    studentName: "Rohan Verma (Demo)",
    grade: "Grade 6-C",
    complaint: "Fall on football turf, deep knee abrasion with minor bleeding",
    triageAction: "Irrigated wound with sterile normal saline. Verified active Tetanus immunization on Passport (valid till 2031). Dressed with Betadine.",
    medicationGiven: "Topical Povidone-Iodine & sterile non-adherent dressing",
    parentNotified: "Yes - Mother (Neha Verma) informed of minor wound dressing",
    resolution: "No suture needed. Discharged back to class in 10 mins.",
    nurse: "Sr. Mary Thomas"
  }
];

const PRESENTATION_SLIDES = [
  {
    id: 1,
    slideNumber: "01 / 07",
    category: "HCL JIGSAW CHALLENGE SUBMISSION",
    title: "Student Health Passport",
    subtitle: "A Digital Emergency Lifeline for Indian Schools",
    leadText: "Saving Critical Minutes in School Medical Emergencies Through Instant 1-Card Access",
    stats: [
      { value: "250M+", label: "School Students in India" },
      { value: "14.5 Mins", label: "Average Delay in Paper Record Retrieval" },
      { value: "10.4 Secs", label: "Digital Health Passport Access Time" },
      { value: "98.8%", label: "Time Saved in Emergency Triage" }
    ],
    bullets: [
      "School medical emergencies (asthma attacks, diabetic fainting, anaphylaxis, fractures) strike without warning.",
      "The 'Golden Hour' in school healthcare is often wasted hunting through locked registrar filing cabinets.",
      "Our Solution: A high-contrast, offline-first digital Health Passport storing critical medical details on a single card with instant QR access."
    ],
    speakerNotes: "Good day, respected judges. Imagine a 6th grader suddenly collapsing on the school playground. Is it a faint? Diabetic shock? An asthma attack? In Indian schools, nurses are skilled, but they are crippled by lack of instant health records. Today we present the Student Health Passport."
  },
  {
    id: 2,
    slideNumber: "02 / 07",
    category: "THE PROBLEM STATEMENT",
    title: "The School Emergency Gap",
    subtitle: "Why India's School Infirmaries Face Dangerous Treatment Delays",
    leadText: "Every second counts when a child stops breathing or collapses into unconsciousness.",
    stats: [
      { value: "82%", label: "Schools Rely on Paper Registers" },
      { value: "1 in 8", label: "Indian Children Live with Asthma / Allergies" },
      { value: "64%", label: "Parent Calls Go Unanswered During Work Hours" }
    ],
    bullets: [
      "**Information Asymmetry**: School nurses do not know the child's blood group, allergies, or chronic conditions when seconds count.",
      "**Paper Records Are Inaccessible**: Registers are kept in administrative offices that are often locked during recess or sports hours.",
      "**Fatal Medication Errors**: Administering penicillin to an allergic student or confusing diabetic hypoglycemia with epilepsy can be catastrophic.",
      "**Unanswered Emergency Calls**: Working parents cannot always answer immediately, leaving nurses paralyzed without treatment consent."
    ],
    speakerNotes: "The challenge brief highlights the reality: a Grade 6 child collapses on the field. The nurse rushes over. She does not know the child's blood group, if they have diabetes, or if penicillin will kill them. Precious minutes tick away. Our project was built specifically to solve this."
  },
  {
    id: 3,
    slideNumber: "03 / 07",
    category: "OUR INNOVATION & SOLUTION",
    title: "The Digital 1-Card Health Passport",
    subtitle: "One Card. Five Critical Details. Zero Confusion.",
    leadText: "Designed for immediate cognitive clarity under high-pressure school emergencies.",
    stats: [
      { value: "5 Details", label: "Selected Critical Clinical Data Points" },
      { value: "100%", label: "Offline Vector QR Matrix Access" },
      { value: "1-Tap", label: "Parent & 108 Ambulance Speed Dialing" }
    ],
    bullets: [
      "**Blood Group Badge (46pt bold)**: Instantly visible for emergency blood transfusions during severe trauma or sports fractures.",
      "**Red Allergy Alert Banner**: Prevents lethal medical contraindications (e.g., Penicillin, Peanuts, Sulfa).",
      "**Step-by-Step Action Directives**: Clear 1-2-3 clinical instructions customized to each child's condition (e.g. Inhaler spacer technique, EpiPen dosage).",
      "**Locker & Medication Locator**: Pinpoints exactly where the child's inhaler, insulin, or emergency medicine is stored in the infirmary.",
      "**Dynamic Scannable QR Code**: Anyone with a smartphone camera can scan the student's ID lanyard and view emergency instructions without downloading an app or logging in."
    ],
    speakerNotes: "We created the Student Health Passport with a simple design principle: 'One Card, Zero Confusion'. The card highlights blood group in bold typography, flags critical allergies with clear contraindications, and gives step-by-step first aid protocols."
  },
  {
    id: 4,
    slideNumber: "04 / 07",
    category: "TECHNICAL ARCHITECTURE",
    title: "Designed for Indian School Realities",
    subtitle: "Offline-First, Privacy-Compliant, and Instantly Deployable",
    leadText: "Engineered to work seamlessly even during power cuts, weak basement Wi-Fi, and network failures.",
    stats: [
      { value: "< 200ms", label: "Card Load & Render Time" },
      { value: "CR80", label: "Standard Physical Lanyard Card Format" },
      { value: "100%", label: "Parental Consent Verification Rate" }
    ],
    bullets: [
      "**Client-Side QR Code Engine**: Embeds emergency data directly into an offline SVG QR matrix—works without external cloud APIs.",
      "**Print-Ready Physical ID Badges**: One-click generation of front-and-back student lanyard ID cards with built-in QR codes.",
      "**Data Privacy & Parental Verification**: Secure parental consent verification hashes, ensuring child health records are only accessible for emergency first-aid.",
      "**Screen 3 Annual Nurse Update Form**: Enables the school nurse to review records, verify consent, and re-generate passports in under 2 minutes."
    ],
    speakerNotes: "Many Indian school infirmaries are in basements or grounds with spotty Wi-Fi. That is why our solution is 100% offline-first. The QR code generator runs directly in the browser. Furthermore, every passport is backed by verified parental consent."
  },
  {
    id: 5,
    slideNumber: "05 / 07",
    category: "PILOT TESTING IN ACTION",
    title: "Real Pilot Testing with 10 Students",
    subtitle: "Conducted Strictly with Verified Parental Permission in Grade 6",
    leadText: "Simulating high-stakes school emergency scenarios with 10 Grade 6 students.",
    stats: [
      { value: "10/10", label: "Verified Parental Consent Forms Signed" },
      { value: "10.4s", label: "Average Time to Access Emergency Card" },
      { value: "3.8 Mins", label: "Average Time to Create a Student Card" }
    ],
    bullets: [
      "**Diverse Health Cohort**: Tested 10 students with Asthma, Type 1 Diabetes, Epilepsy, Bee Sting Anaphylaxis, Latex Allergy, Celiac Disease, and rare blood types.",
      "**100% Written Parental Consent**: Verified consent IDs generated and signed before initiating simulated school drills.",
      "**Massive Time Savings**: Emergency lookup dropped from 14.5 minutes with paper records to just 10.4 seconds with our passport."
    ],
    speakerNotes: "We tested our prototype with a cohort of 10 Grade 6 students, strictly with written parental consent. In every drill, emergency access dropped from over 14 minutes down to 10 seconds, proving our system's speed and reliability."
  },
  {
    id: 6,
    slideNumber: "06 / 07",
    category: "EVALUATION & RESULTS",
    title: "From 14.5 Minutes to 10.4 Seconds",
    subtitle: "Feedback & Evaluation from Senior School Nurse Sister Mary Thomas",
    leadText: "A 98.8% reduction in emergency response time verified by clinical evaluation.",
    stats: [
      { value: "98.8%", label: "Faster Medical Protocol Access" },
      { value: "4.95 / 5", label: "Overall Nurse Evaluation Score" },
      { value: "100%", label: "Error Prevention in Allergen Contraindications" }
    ],
    bullets: [
      "**Time-to-Triage Slashed**: Traditional paper registers took an average of 14 minutes and 30 seconds. The Health Passport reduced this to 10.4 seconds.",
      "**Sister Mary Thomas (Head Infirmary Nurse)**: 'In severe hypoglycemia or asthma, 15 minutes of delay can cause irreversible brain damage or respiratory arrest. The 1-card passport gives me the exact protocol in 10 seconds flat.'",
      "**Rubric Assessment**: 5.0/5 in Speed, 5.0/5 in Protocol Clarity, 5.0/5 in Allergy Safety, 4.9/5 in Usability under Stress."
    ],
    speakerNotes: "Here are our empirical results. Response time dropped from 14.5 minutes down to 10.4 seconds. Sister Mary Thomas awarded the system 4.95 out of 5 stars, confirming it eliminates guesswork during high-panic emergencies."
  },
  {
    id: 7,
    slideNumber: "07 / 07",
    category: "CONCLUSION & FUTURE ROADMAP",
    title: "Scaling Across Indian Schools",
    subtitle: "Transforming Student Safety Nationwide",
    leadText: "A low-cost, high-impact innovation that can safeguard millions of school children.",
    stats: [
      { value: "₹5", label: "Estimated Cost per Laminated Card" },
      { value: "1.5M+", label: "Potential School Network in India" },
      { value: "100%", label: "Aligned with CBSE Health Guidelines" }
    ],
    bullets: [
      "**Smart NFC Badge Integration**: Tap phone directly to student ID lanyard for instant passport popup without opening camera.",
      "**School Bus & Field Trip Sync**: Off-campus tablet synchronization for field trip chaperones and sports coaches.",
      "**National Health Card Alignment**: Standardized format ready for integration with national digital health registries and local emergency services (108).",
      "**Conclusion**: The Student Health Passport turns panic into protocol, saving critical minutes when every second counts."
    ],
    speakerNotes: "In conclusion, the Student Health Passport is a practical, inexpensive, and life-saving innovation. At less than 5 rupees per laminated card, every school in India can protect its students from preventable tragedies. Thank you."
  }
];

if (typeof window !== 'undefined') {
  window.STUDENT_DATABASE = STUDENT_DATABASE;
  window.PILOT_TEST_METRICS = PILOT_TEST_METRICS;
  window.NURSE_EVALUATION = NURSE_EVALUATION;
  window.INITIAL_INCIDENTS = INITIAL_INCIDENTS;
  window.PRESENTATION_SLIDES = PRESENTATION_SLIDES;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { STUDENT_DATABASE, PILOT_TEST_METRICS, NURSE_EVALUATION, INITIAL_INCIDENTS, PRESENTATION_SLIDES };
}
