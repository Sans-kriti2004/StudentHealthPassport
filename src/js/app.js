// Student Health Passport - Application Logic & Controllers
// HCL Jigsaw Student Health Challenge

(function () {
  'use strict';

  // State
  const db = (typeof window !== 'undefined' && window.STUDENT_DATABASE) || (typeof STUDENT_DATABASE !== 'undefined' ? STUDENT_DATABASE : []);
  const initialInc = (typeof window !== 'undefined' && window.INITIAL_INCIDENTS) || (typeof INITIAL_INCIDENTS !== 'undefined' ? INITIAL_INCIDENTS : []);
  const nurseEval = (typeof window !== 'undefined' && window.NURSE_EVALUATION) || (typeof NURSE_EVALUATION !== 'undefined' ? NURSE_EVALUATION : {});

  let storedIncidents = [];
  try {
    storedIncidents = JSON.parse(localStorage.getItem('shp_incidents')) || [...initialInc];
  } catch (e) {
    storedIncidents = [...initialInc];
  }

  let storedFeedbacks = [];
  try {
    storedFeedbacks = JSON.parse(localStorage.getItem('shp_feedbacks')) || [
      {
        id: "FB-001",
        name: nurseEval.evaluator ? nurseEval.evaluator.name : "Sister Mary Thomas, RN",
        role: nurseEval.evaluator ? nurseEval.evaluator.title : "Senior School Health Officer",
        school: nurseEval.evaluator ? nurseEval.evaluator.school : "St. Columba's Senior Secondary School",
        rating: 5.0,
        comment: nurseEval.testimonial || "The Student Health Passport completely solves the golden-hour crisis.",
        date: "2026-09-11"
      }
    ];
  } catch (e) {
    storedFeedbacks = [
      {
        id: "FB-001",
        name: "Sister Mary Thomas, RN",
        role: "Senior School Health Officer",
        school: "St. Columba's Senior Secondary School",
        rating: 5.0,
        comment: "The Student Health Passport completely solves the golden-hour crisis.",
        date: "2026-09-11"
      }
    ];
  }

  const state = {
    students: [...db],
    selectedStudentId: "STU-2026-0614", // Aarav Sharma (Pilot Student 1)
    activeTab: "one-card",
    searchQuery: "",
    gradeFilter: "all",
    riskFilter: "all",
    currentSlideIndex: 0,
    showSpeakerNotes: false,
    isFullscreenPresentation: false,
    emergencyMode: false,
    incidents: storedIncidents,
    feedbacks: storedFeedbacks
  };

  // Helper: Get currently selected student
  function getSelectedStudent() {
    return state.students.find(s => s.id === state.selectedStudentId) || state.students[0];
  }

  // Audio Beep for Emergency Mode / Drills (Using Web Audio API)
  function playAlertSound(type = 'beep') {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'emergency') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  // Initialize App
  function initApp() {
    setupNavigation();
    setupStudentSelector();
    setupModals();
    setupKeyboardShortcuts();
    renderCurrentTab();
  }

  // Navigation tab switcher
  function setupNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        switchTab(target);
      });
    });

    // Emergency Mode toggle button
    const emergencyBtn = document.getElementById('toggle-emergency-mode-btn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        state.emergencyMode = !state.emergencyMode;
        if (state.emergencyMode) {
          playAlertSound('emergency');
          document.body.classList.add('bg-red-50');
        } else {
          document.body.classList.remove('bg-red-50');
        }
        renderCurrentTab();
      });
    }

    // Call 108 Emergency
    const call108Btn = document.getElementById('call-108-header-btn');
    if (call108Btn) {
      call108Btn.addEventListener('click', () => {
        const confirmed = confirm("🚨 EMERGENCY DISPATCH: Would you like to place an immediate call to 108 Ambulance Emergency Services?");
        if (confirmed) {
          window.location.href = "tel:108";
        }
      });
    }
  }

  function switchTab(tabName) {
    state.activeTab = tabName;
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(btn => {
      const target = btn.getAttribute('data-tab-target');
      if (target === tabName) {
        btn.className = "px-4 py-3 text-sm font-semibold border-b-2 border-sky-600 text-sky-600 bg-sky-50/50 flex items-center gap-2 transition-all";
      } else {
        btn.className = "px-4 py-3 text-sm font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 transition-all";
      }
    });
    renderCurrentTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Setup student picker dropdown in header
  function setupStudentSelector() {
    const selectEl = document.getElementById('global-student-select');
    if (!selectEl) return;
    selectEl.innerHTML = state.students.map(s => `
      <option value="${s.id}" ${s.id === state.selectedStudentId ? 'selected' : ''}>
        ${s.name} (${s.grade}-${s.section}) - ${s.bloodGroup} [${s.emergencyRiskLevel}]
      </option>
    `).join('');

    selectEl.addEventListener('change', (e) => {
      state.selectedStudentId = e.target.value;
      renderCurrentTab();
    });
  }

  function selectStudent(studentId, jumpToTab = 'one-card') {
    state.selectedStudentId = studentId;
    const selectEl = document.getElementById('global-student-select');
    if (selectEl) selectEl.value = studentId;
    if (jumpToTab) {
      switchTab(jumpToTab);
    } else {
      renderCurrentTab();
    }
  }

  // Main Tab Renderer
  function renderCurrentTab() {
    const container = document.getElementById('main-tab-content');
    if (!container) return;

    switch (state.activeTab) {
      case 'one-card':
        container.innerHTML = getOneCardHTML(getSelectedStudent());
        attachOneCardEvents();
        break;
      case 'nurse-station':
        container.innerHTML = getNurseStationHTML();
        attachNurseStationEvents();
        break;
      case 'annual-update':
        container.innerHTML = getAnnualUpdateHTML(getSelectedStudent());
        attachAnnualUpdateEvents();
        break;
      case 'pilot-testing':
        container.innerHTML = getPilotTestingHTML();
        attachPilotTestingEvents();
        break;
      case 'nurse-feedback':
        container.innerHTML = getNurseFeedbackHTML();
        attachNurseFeedbackEvents();
        break;
      case 'presentation':
        container.innerHTML = getPresentationHTML();
        attachPresentationEvents();
        break;
      case 'incident-log':
        container.innerHTML = getIncidentLogHTML();
        attachIncidentLogEvents();
        break;
      default:
        container.innerHTML = getOneCardHTML(getSelectedStudent());
        attachOneCardEvents();
    }
  }

  // ==========================================
  // TAB 1: ONE-CARD HEALTH PASSPORT VIEW
  // ==========================================
  function getOneCardHTML(student) {
    // Generate scannable text payload for emergency camera QR reading
    const qrPayload = `STUDENT HEALTH PASSPORT\nName: ${student.name}\nGrade: ${student.grade}-${student.section} (Roll: ${student.rollNo})\nBlood: ${student.bloodGroup}\nRisk: ${student.emergencyRiskLevel}\nCondition: ${student.primaryCondition}\nPrimary Contact: ${student.emergencyContacts[0].name} (${student.emergencyContacts[0].phone})\nDoctor: ${student.doctor.name} (${student.doctor.phone})\nVerification: ${student.parentConsent.consentId}`;
    const qrSvg = QRCodeGenerator.generateSVG(qrPayload, 160);

    const isHighRisk = student.emergencyRiskLevel === 'HIGH' || student.emergencyRiskLevel === 'CRITICAL';

    return `
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Quick Student Switcher Bar -->
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Viewing Passport:</span>
            <div class="flex gap-1.5 flex-wrap">
              ${state.students.slice(0, 3).map(s => `
                <button onclick="window.appSelectStudent('${s.id}')" class="px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${s.id === student.id ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}">
                  ${s.name.split(' ')[0]} (Pilot Gr 6)
                </button>
              `).join('')}
              <button onclick="window.appSwitchTab('nurse-station')" class="px-2.5 py-1 text-xs font-medium rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200">
                + View All Students (${state.students.length})
              </button>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.appSwitchTab('annual-update')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Annual Nurse Update
            </button>
            <button onclick="window.appOpenPrintBadge('${student.id}')" class="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900 transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Print ID Lanyard Badge
            </button>
            <button onclick="window.appOpenDrillModal('${student.id}')" class="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-1.5 shadow-sm animate-pulse">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Simulate Emergency Drill
            </button>
          </div>
        </div>

        <!-- THE DIGITAL ONE-CARD HEALTH PASSPORT -->
        <div class="passport-card overflow-hidden border-2 ${isHighRisk ? 'border-red-400' : 'border-slate-200'}">
          <!-- EMERGENCY HEADER BANNER -->
          <div class="bg-gradient-to-r ${student.emergencyRiskLevel === 'CRITICAL' ? 'from-red-700 via-red-600 to-rose-700' : student.emergencyRiskLevel === 'HIGH' ? 'from-amber-600 via-red-600 to-red-700' : 'from-slate-800 to-slate-900'} text-white px-6 py-4">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <svg class="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">Emergency Health Card</span>
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ${student.emergencyRiskLevel === 'CRITICAL' ? 'bg-red-200 text-red-900' : student.emergencyRiskLevel === 'HIGH' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}">
                      RISK LEVEL: ${student.emergencyRiskLevel}
                    </span>
                  </div>
                  <h2 class="text-xl sm:text-2xl font-black tracking-tight mt-0.5">${student.primaryCondition}</h2>
                </div>
              </div>

              <!-- Parental Consent Badge -->
              <div class="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-lg border border-white/20">
                <svg class="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <div>
                  <div class="text-[10px] uppercase font-bold text-white/80">Parental Consent</div>
                  <button onclick="window.appOpenConsentModal('${student.id}')" class="text-xs font-semibold text-emerald-200 underline hover:text-white transition">
                    Verified: ${student.parentConsent.signedBy}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD BODY -->
          <div class="p-6 bg-white space-y-6">
            <!-- TOP ROW: STUDENT IDENTITY & BLOOD GROUP & QR CODE -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-slate-200">
              <!-- Avatar & Details (md:col-span-5) -->
              <div class="md:col-span-5 flex gap-4 items-start">
                <div class="relative flex-shrink-0">
                  <img src="${student.avatar}" alt="${student.name}" class="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 shadow-md">
                  <div class="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    ${student.gender}
                  </div>
                </div>
                <div class="space-y-1">
                  <div class="text-xs font-bold text-sky-600 tracking-wider uppercase">${student.grade} • Section ${student.section}</div>
                  <h1 class="text-2xl font-black text-slate-900 leading-tight">${student.name}</h1>
                  <div class="text-xs text-slate-500 font-medium">Roll No: <span class="font-bold text-slate-800">${student.rollNo}</span> • Age: <span class="font-bold text-slate-800">${student.age} yrs</span></div>
                  <div class="text-xs text-slate-500 font-medium">DOB: <span class="text-slate-800">${student.dob}</span></div>
                  <div class="text-[11px] font-mono text-slate-400">ID: ${student.id}</div>
                </div>
              </div>

              <!-- BIG BLOOD GROUP BADGE (md:col-span-4) -->
              <div class="md:col-span-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
                <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-red-500/10 rounded-full pointer-events-none"></div>
                <div class="text-[11px] uppercase font-extrabold tracking-wider text-red-700 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6c0 3.6 4.3 9.4 5.4 10.8.3.4.9.4 1.2 0C11.7 17.4 16 11.6 16 8a6 6 0 00-6-6z"/></svg>
                  Blood Group
                </div>
                <div class="text-5xl font-black text-red-600 tracking-tight my-1 blood-badge-glow">
                  ${student.bloodGroup}
                </div>
                <div class="text-xs font-bold text-red-800">
                  Rh ${student.rhFactor} ${student.isUniversalDonor ? '• Universal RBC Donor' : student.isUniversalRecipient ? '• Universal Recipient' : ''}
                </div>
                <div class="text-[10px] text-red-600/80 mt-1 max-w-xs font-medium">
                  ${student.compatibilityNote}
                </div>
              </div>

              <!-- OFFLINE SCANNABLE QR CODE (md:col-span-3) -->
              <div class="md:col-span-3 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <div class="bg-white p-1 rounded-xl shadow-sm border border-slate-100 mb-2">
                  ${qrSvg}
                </div>
                <div class="text-[11px] font-bold text-slate-800">Instant Camera Scan</div>
                <div class="text-[10px] text-slate-500">No app or login needed in emergencies</div>
              </div>
            </div>

            <!-- ROW 2: CRITICAL ALLERGIES & CONTRAINDICATIONS -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  Known Allergies & Medical Warnings (${student.allergies.length})
                </h3>
                <span class="text-xs text-red-600 font-bold">STRICT MEDICAL ALERT</span>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${student.allergies.map(alg => `
                  <div class="p-4 rounded-xl border-2 ${alg.severity.includes('CRITICAL') || alg.severity === 'Severe' ? 'border-red-300 bg-red-50/70' : 'border-amber-200 bg-amber-50/60'}">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${alg.severity.includes('CRITICAL') ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}">
                          ${alg.severity}
                        </span>
                        <h4 class="text-base font-black text-slate-900 mt-1.5">${alg.allergen}</h4>
                      </div>
                      <span class="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">${alg.category}</span>
                    </div>
                    <div class="mt-2 text-xs text-slate-700">
                      <span class="font-bold">Reaction:</span> ${alg.reaction}
                    </div>
                    ${alg.contraindication ? `
                      <div class="mt-2 text-xs font-bold text-red-700 bg-red-100 p-2 rounded-lg border border-red-200 flex items-center gap-1.5">
                        <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
                        <span>${alg.contraindication}</span>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- ROW 3: STEP-BY-STEP EMERGENCY ACTION PROTOCOL -->
            <div class="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-lg space-y-4">
              <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-red-500/20 border border-red-400 flex items-center justify-center text-red-400 font-bold text-lg">
                    !
                  </div>
                  <div>
                    <h3 class="text-base font-black text-white">Emergency Response Protocol</h3>
                    <p class="text-xs text-slate-300">Exact step-by-step action plan for school nurse, physical education teacher, and first responders</p>
                  </div>
                </div>
                <span class="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  ACT IMMEDIATELY
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${student.emergencyProtocol.map(step => `
                  <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 flex gap-3 items-start">
                    <div class="w-7 h-7 rounded-full bg-sky-500 text-white flex-shrink-0 flex items-center justify-center font-black text-xs shadow-sm">
                      ${step.step}
                    </div>
                    <div class="space-y-0.5">
                      <h5 class="text-xs font-bold text-sky-300 uppercase tracking-wide">${step.title}</h5>
                      <p class="text-xs text-white/90 leading-relaxed font-normal">${step.instruction}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- ROW 4: MEDICATIONS & STORAGE LOCKERS -->
            <div class="space-y-3">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <svg class="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
                Current In-School Medications & Locker Location
              </h3>
              <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table class="w-full text-left text-xs border-collapse">
                  <thead class="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th class="p-3">Medication Name</th>
                      <th class="p-3">Prescribed Dosage</th>
                      <th class="p-3">Frequency / Timing</th>
                      <th class="p-3">Storage Location in School</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200 bg-white">
                    ${student.medications.map(m => `
                      <tr class="hover:bg-slate-50 transition">
                        <td class="p-3 font-bold text-slate-900">${m.name}</td>
                        <td class="p-3 font-medium text-slate-700">${m.dosage}</td>
                        <td class="p-3 text-slate-600">${m.frequency}</td>
                        <td class="p-3">
                          <span class="inline-flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                            ${m.location}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ROW 5: EMERGENCY CONTACTS & DOCTOR DIRECTORY -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <!-- Contact 1: Primary Parent -->
              <div class="p-4 rounded-xl border-2 border-sky-300 bg-sky-50/50 space-y-3 relative shadow-sm">
                <span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase bg-sky-600 text-white px-2 py-0.5 rounded">
                  Primary Contact
                </span>
                <div>
                  <span class="text-[10px] font-bold text-sky-800 uppercase tracking-wide">${student.emergencyContacts[0].relation}</span>
                  <h4 class="text-base font-black text-slate-900">${student.emergencyContacts[0].name}</h4>
                  <div class="text-xs text-slate-600">${student.emergencyContacts[0].occupation}</div>
                  <div class="text-xs text-slate-500 font-mono mt-1">${student.emergencyContacts[0].phone}</div>
                </div>
                <div class="flex gap-2 pt-1">
                  <a href="tel:${student.emergencyContacts[0].phone.replace(/\\s+/g, '')}" class="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg text-center transition flex items-center justify-center gap-1 shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                    Call Parent
                  </a>
                  <a href="https://wa.me/${student.emergencyContacts[0].whatsapp}?text=URGENT:%20Medical%20update%20regarding%20${encodeURIComponent(student.name)}%20at%20school%20infirmary." target="_blank" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 shadow-sm">
                    WhatsApp
                  </a>
                </div>
              </div>

              <!-- Contact 2: Secondary Parent -->
              ${student.emergencyContacts[1] ? `
                <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative">
                  <span class="absolute top-3 right-3 text-[10px] font-bold uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    Secondary
                  </span>
                  <div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide">${student.emergencyContacts[1].relation}</span>
                    <h4 class="text-base font-black text-slate-900">${student.emergencyContacts[1].name}</h4>
                    <div class="text-xs text-slate-600">${student.emergencyContacts[1].occupation}</div>
                    <div class="text-xs text-slate-500 font-mono mt-1">${student.emergencyContacts[1].phone}</div>
                  </div>
                  <div class="pt-1">
                    <a href="tel:${student.emergencyContacts[1].phone.replace(/\\s+/g, '')}" class="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg text-center transition flex items-center justify-center gap-1 shadow-sm">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                      Call Secondary Contact
                    </a>
                  </div>
                </div>
              ` : ''}

              <!-- Contact 3: Doctor & Hospital -->
              <div class="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div>
                  <span class="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Attending Pediatrician</span>
                  <h4 class="text-base font-black text-slate-900">${student.doctor.name}</h4>
                  <div class="text-xs font-semibold text-emerald-900">${student.doctor.clinic}</div>
                  <div class="text-xs text-slate-500 font-mono mt-1">${student.doctor.phone}</div>
                </div>
                <div class="pt-1">
                  <a href="tel:${student.doctor.phone.replace(/\\s+/g, '')}" class="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg text-center transition flex items-center justify-center gap-1 shadow-sm">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    Contact Doctor / Hospital
                  </a>
                </div>
              </div>
            </div>

            <!-- FOOTER ACTION BAR -->
            <div class="bg-slate-50 -mx-6 -mb-6 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Verified by School Nurse <strong>Sr. Mary Thomas</strong> (Last updated: Sept 2026)</span>
              </div>
              <div class="flex items-center gap-3">
                <button onclick="window.appLogIncidentForStudent('${student.id}')" class="text-sky-700 font-bold hover:underline">
                  + Log Clinic Incident
                </button>
                <span>•</span>
                <button onclick="window.appOpenConsentModal('${student.id}')" class="text-slate-700 font-bold hover:underline">
                  Parent Consent ID: ${student.parentConsent.consentId}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  function attachOneCardEvents() {
    // Events bound via global window helpers
  }

  // ==========================================
  // TAB 2: SCHOOL NURSE EMERGENCY STATION
  // ==========================================
  function getNurseStationHTML() {
    let filtered = state.students.filter(s => {
      const q = state.searchQuery.toLowerCase();
      const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.bloodGroup.toLowerCase().includes(q) || s.primaryCondition.toLowerCase().includes(q);
      const matchesGrade = state.gradeFilter === 'all' || s.grade === state.gradeFilter;
      const matchesRisk = state.riskFilter === 'all' || s.emergencyRiskLevel === state.riskFilter;
      return matchesQuery && matchesGrade && matchesRisk;
    });

    return `
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- Emergency Dispatch Hub -->
        <div class="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-1 max-w-xl">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Infirmary Rapid Command
              </span>
              <span class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
              </span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">School Nurse Emergency Station</h2>
            <p class="text-sm text-red-100">Instantly lookup critical health passports by scanning student lanyard QR codes or filtering by class roster.</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a href="tel:108" class="px-5 py-3 bg-white text-red-700 hover:bg-red-50 text-sm font-black rounded-xl shadow-lg transition flex items-center gap-2">
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              DIAL 108 AMBULANCE
            </a>
            <button onclick="window.appOpenNewIncidentModal()" class="px-4 py-3 bg-red-900/50 hover:bg-red-900/80 text-white text-sm font-bold rounded-xl border border-white/30 transition flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Log Emergency Incident
            </button>
          </div>
        </div>

        <!-- Filter & Search Controls -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div class="sm:col-span-6 relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input type="text" id="nurse-search-input" value="${state.searchQuery}" placeholder="Search student by name, roll no, blood group (e.g. B+), or allergy..." class="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium">
            </div>

            <div class="sm:col-span-3">
              <select id="nurse-grade-filter" class="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium bg-white">
                <option value="all" ${state.gradeFilter === 'all' ? 'selected' : ''}>All Grades</option>
                <option value="Grade 5" ${state.gradeFilter === 'Grade 5' ? 'selected' : ''}>Grade 5</option>
                <option value="Grade 6" ${state.gradeFilter === 'Grade 6' ? 'selected' : ''}>Grade 6 (Pilot Cohort)</option>
                <option value="Grade 7" ${state.gradeFilter === 'Grade 7' ? 'selected' : ''}>Grade 7</option>
              </select>
            </div>

            <div class="sm:col-span-3">
              <select id="nurse-risk-filter" class="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium bg-white">
                <option value="all" ${state.riskFilter === 'all' ? 'selected' : ''}>All Medical Risk Levels</option>
                <option value="CRITICAL" ${state.riskFilter === 'CRITICAL' ? 'selected' : ''}>Critical Risk (Diabetic/Seizure)</option>
                <option value="HIGH" ${state.riskFilter === 'HIGH' ? 'selected' : ''}>High Risk (Asthma/Severe Allergies)</option>
                <option value="MODERATE" ${state.riskFilter === 'MODERATE' ? 'selected' : ''}>Moderate Risk</option>
                <option value="LOW" ${state.riskFilter === 'LOW' ? 'selected' : ''}>Low Risk (Standard First Aid)</option>
              </select>
            </div>
          </div>

          <!-- Quick tags -->
          <div class="flex items-center gap-2 pt-1 overflow-x-auto text-xs">
            <span class="text-slate-400 font-bold uppercase text-[10px]">Quick Triage Filters:</span>
            <button onclick="window.appSetSearch('Asthma')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">Asthma (Inhaler)</button>
            <button onclick="window.appSetSearch('Diabetes')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">Diabetes (Glucose)</button>
            <button onclick="window.appSetSearch('Penicillin')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">Penicillin Allergy</button>
            <button onclick="window.appSetSearch('Peanut')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">Peanut Anaphylaxis</button>
            <button onclick="window.appSetSearch('O+')" class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition">Blood O+ (Universal Donor)</button>
            <button onclick="window.appSetSearch('')" class="text-sky-600 font-bold hover:underline ml-auto">Clear Filters</button>
          </div>
        </div>

        <!-- Student Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${filtered.map(st => `
            <div class="bg-white rounded-xl border-2 ${st.emergencyRiskLevel === 'CRITICAL' ? 'border-red-300 shadow-red-100' : st.emergencyRiskLevel === 'HIGH' ? 'border-amber-200' : 'border-slate-200'} shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between">
              <div>
                <!-- Card Header -->
                <div class="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <img src="${st.avatar}" alt="${st.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-200">
                    <div>
                      <h4 class="text-base font-black text-slate-900 leading-snug">${st.name}</h4>
                      <div class="text-xs text-slate-500 font-medium">${st.grade} • Sec ${st.section} (Roll: ${st.rollNo})</div>
                    </div>
                  </div>
                  <div class="text-center">
                    <span class="inline-block px-2.5 py-1 rounded-lg font-black text-sm ${st.bloodGroup.includes('+') ? 'bg-red-100 text-red-700' : 'bg-rose-100 text-rose-700'}">
                      ${st.bloodGroup}
                    </span>
                    <div class="text-[9px] font-bold uppercase text-slate-400 mt-0.5">Blood</div>
                  </div>
                </div>

                <!-- Condition & Alert Pills -->
                <div class="p-4 space-y-2.5">
                  <div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Condition:</div>
                    <div class="text-xs font-bold text-slate-900">${st.primaryCondition}</div>
                  </div>

                  <div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Critical Allergies:</div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      ${st.allergies.map(a => `
                        <span class="text-[11px] font-bold px-2 py-0.5 rounded ${a.severity.includes('CRITICAL') || a.severity === 'Severe' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800'}">
                          ${a.allergen}
                        </span>
                      `).join('')}
                    </div>
                  </div>

                  <div class="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-700">
                    <div class="flex justify-between items-center text-[11px]">
                      <span class="font-bold text-slate-600">Parent:</span>
                      <span class="font-semibold">${st.emergencyContacts[0].name}</span>
                    </div>
                    <div class="flex justify-between items-center text-[11px]">
                      <span class="font-bold text-slate-600">Phone:</span>
                      <a href="tel:${st.emergencyContacts[0].phone}" class="font-mono text-sky-700 font-bold hover:underline">${st.emergencyContacts[0].phone}</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer Buttons -->
              <div class="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
                <button onclick="window.appSelectStudent('${st.id}', 'one-card')" class="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition text-center shadow-sm">
                  View 1-Card Passport
                </button>
                <button onclick="window.appOpenDrillModal('${st.id}')" class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold rounded-lg transition" title="Run Emergency Drill">
                  🚨 Drill
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        ${filtered.length === 0 ? `
          <div class="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500">
            <p class="text-base font-semibold">No students found matching "${state.searchQuery}".</p>
            <button onclick="window.appSetSearch('')" class="mt-2 text-sm text-sky-600 font-bold underline">Reset search filters</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function attachNurseStationEvents() {
    const searchInput = document.getElementById('nurse-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderCurrentTab();
      });
    }

    const gradeFilter = document.getElementById('nurse-grade-filter');
    if (gradeFilter) {
      gradeFilter.addEventListener('change', (e) => {
        state.gradeFilter = e.target.value;
        renderCurrentTab();
      });
    }

    const riskFilter = document.getElementById('nurse-risk-filter');
    if (riskFilter) {
      riskFilter.addEventListener('change', (e) => {
        state.riskFilter = e.target.value;
        renderCurrentTab();
      });
    }
  }

  // ==========================================
  // TAB 3: PILOT TESTING WITH 3 STUDENTS
  // ==========================================
  
  // ==========================================
  // TAB: ANNUAL NURSE UPDATE FORM (SCREEN 3)
  // ==========================================
  function getAnnualUpdateHTML(student) {
    return `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Screen 3 • Mandatory Annual Checkup
            </span>
            <h2 class="text-2xl sm:text-3xl font-black">Annual Nurse Update Form</h2>
            <p class="text-xs sm:text-sm text-amber-100">
              Update critical health details, review emergency medication stocks, and verify parental consent for the 2026-2027 academic year.
            </p>
          </div>
          <div class="text-right bg-white/10 px-4 py-3 rounded-xl border border-white/20">
            <div class="text-xs uppercase font-bold text-amber-200">Authorized Reviewer</div>
            <div class="text-sm font-black text-white">Sister Mary Thomas, RN</div>
            <div class="text-[10px] text-slate-300">Infirmary Officer #N-8841</div>
          </div>
        </div>

        <!-- Student Selector for Update Form -->
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <label for="update-student-select" class="text-xs font-bold text-slate-600 uppercase">Select Student to Update:</label>
            <select id="update-student-select" class="text-xs font-bold py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:ring-2 focus:ring-amber-500">
              ${state.students.map(s => `
                <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                  ${s.name} (${s.grade}-${s.section}, Roll: ${s.rollNo}) - ${s.bloodGroup}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="text-xs text-slate-500 font-medium">
            Last Reviewed: <strong class="text-slate-800">${student.lastAnnualReviewDate || '2026-09-08'}</strong>
          </div>
        </div>

        <!-- The Medical Update Form -->
        <form id="annual-update-form" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          <!-- Section 1: Student Demographics & Blood Group -->
          <div class="space-y-4 pb-6 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">1</span>
              <h3 class="text-base font-black text-slate-900">Student Identity & Blood Group Verification</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Full Student Name (Demo)</label>
                <input type="text" id="up-name" value="${student.name}" required class="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg bg-slate-50" readonly>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">Grade & Section</label>
                <input type="text" id="up-grade" value="${student.grade} - Section ${student.section}" class="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded-lg bg-slate-50" readonly>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Blood Group (ABO & Rh Factor) *</label>
                <select id="up-blood" class="w-full text-xs font-bold p-2.5 border-2 border-red-300 rounded-lg bg-white text-red-700 focus:ring-2 focus:ring-red-500">
                  ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => `
                    <option value="${bg}" ${bg === student.bloodGroup ? 'selected' : ''}>${bg} ${bg === 'O+' || bg === 'O-' ? '(Universal Donor Type)' : bg === 'AB+' ? '(Universal Recipient)' : ''}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Severe Allergies & Critical Contraindications -->
          <div class="space-y-4 pb-6 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-xs">2</span>
              <h3 class="text-base font-black text-slate-900">Severe Allergies & Medication Contraindications</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Primary Allergen(s) *</label>
                <input type="text" id="up-allergen" value="${student.allergies.map(a => a.allergen).join(', ')}" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500" placeholder="e.g. Penicillin, Peanuts, Latex, Bee Stings">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Strict Medical Contraindication(s) *</label>
                <input type="text" id="up-contraindication" value="${student.allergies[0].contraindication || 'Avoid contraindicated substances'}" required class="w-full text-xs font-medium p-2.5 border border-red-300 rounded-lg bg-red-50/50 text-red-800 focus:ring-2 focus:ring-red-500" placeholder="e.g. Strictly avoid Amoxicillin, Nitrile gloves only">
              </div>
            </div>
          </div>

          <!-- Section 3: Primary Condition & 1-2-3 Action Protocol -->
          <div class="space-y-4 pb-6 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">3</span>
              <h3 class="text-base font-black text-slate-900">Primary Chronic Condition & 1-2-3 Action Protocol</h3>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Primary Condition / Diagnosis *</label>
              <input type="text" id="up-condition" value="${student.primaryCondition}" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-slate-700">Step-by-Step Emergency Directives:</label>
              ${student.emergencyProtocol.slice(0, 3).map((st, i) => `
                <div class="flex gap-2 items-center">
                  <span class="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">${i + 1}</span>
                  <input type="text" id="up-protocol-${i + 1}" value="${st.instruction}" class="w-full text-xs font-medium p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Section 4: Medications & In-School Locker Storage -->
          <div class="space-y-4 pb-6 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs">4</span>
              <h3 class="text-base font-black text-slate-900">In-School Emergency Medications & Locker Locator</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Prescribed Medication & Dosage *</label>
                <input type="text" id="up-med-name" value="${student.medications[0].name} (${student.medications[0].dosage})" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Exact Locker / Infirmary Storage Location *</label>
                <input type="text" id="up-med-loc" value="${student.medications[0].location}" required class="w-full text-xs font-medium p-2.5 border border-teal-300 rounded-lg bg-teal-50/50 text-teal-900 focus:ring-2 focus:ring-teal-500">
              </div>
            </div>
          </div>

          <!-- Section 5: Emergency Contacts & Pediatrician -->
          <div class="space-y-4 pb-6 border-b border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">5</span>
              <h3 class="text-base font-black text-slate-900">Emergency Contacts & Attending Pediatrician</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Primary Contact Name *</label>
                <input type="text" id="up-contact-name" value="${student.emergencyContacts[0].name}" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Primary Phone Number *</label>
                <input type="tel" id="up-contact-phone" value="${student.emergencyContacts[0].phone}" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Pediatrician & Clinic Phone</label>
                <input type="text" id="up-doctor-phone" value="${student.doctor.name} (${student.doctor.phone})" required class="w-full text-xs font-medium p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>
          </div>

          <!-- Section 6: Annual Nurse Verification & Parental Consent Check -->
          <div class="bg-amber-50 rounded-xl p-5 border border-amber-200 space-y-3">
            <h4 class="text-xs font-black text-amber-900 uppercase tracking-wider">Mandatory Annual Clinical Sign-Off</h4>
            <div class="space-y-2">
              <label class="flex items-start gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                <input type="checkbox" id="up-consent-check" checked required class="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500">
                <span>Verified: Signed written parental consent form is on file for the 2026-2027 academic year (${student.parentConsent.consentId}).</span>
              </label>
              <label class="flex items-start gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                <input type="checkbox" id="up-med-check" checked required class="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500">
                <span>Verified: Inspected emergency medication in the infirmary locker; confirmed active expiration date and dosage adequacy.</span>
              </label>
            </div>
            <div class="pt-2 flex flex-wrap items-center justify-between text-xs text-amber-900 font-medium border-t border-amber-200/60">
              <div>Date of Review: <strong>${new Date().toLocaleDateString('en-GB')}</strong></div>
              <div>Sign-Off Nurse: <strong>Sister Mary Thomas, RN (#N-8841)</strong></div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button type="button" onclick="window.appSwitchTab('one-card')" class="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
              Cancel & Return to Passport
            </button>
            <button type="submit" class="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black rounded-xl shadow-lg transition flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>Save & Re-Generate Passport (Annual Review Complete)</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  function attachAnnualUpdateEvents() {
    const studentSelect = document.getElementById('update-student-select');
    if (studentSelect) {
      studentSelect.addEventListener('change', (e) => {
        state.selectedStudentId = e.target.value;
        const globalSel = document.getElementById('global-student-select');
        if (globalSel) globalSel.value = e.target.value;
        renderCurrentTab();
      });
    }

    const form = document.getElementById('annual-update-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const student = getSelectedStudent();
        
        // Update student fields
        const newBlood = document.getElementById('up-blood').value;
        student.bloodGroup = newBlood;
        student.lastAnnualReviewDate = new Date().toISOString().split('T')[0];
        
        const newCondition = document.getElementById('up-condition').value;
        if (newCondition) student.primaryCondition = newCondition;

        // Log incident audit
        const auditLog = {
          id: `INC-${Date.now().toString().slice(-6)}`,
          timestamp: new Date().toLocaleString(),
          studentId: student.id,
          studentName: student.name,
          grade: `${student.grade}-${student.section}`,
          complaint: "Annual Health Passport Review Completed",
          triageAction: `Nurse verified Blood Group (${newBlood}), re-authenticated parental consent (${student.parentConsent.consentId}), and inspected emergency locker medication.`,
          medicationGiven: "None (Annual Review)",
          parentNotified: "Yes - Verified Consent on file",
          resolution: "Health Passport Re-Generated with new annual QR hash.",
          nurse: "Sr. Mary Thomas"
        };
        state.incidents.unshift(auditLog);

        alert(`✅ ANNUAL NURSE UPDATE COMPLETE!

Health Passport successfully updated and re-generated for ${student.name}.

• Blood Group: ${newBlood}
• Parental Consent: Re-verified for 2026-2027
• QR Matrix: Refreshed with new security hash
• Audit Timestamp: ${new Date().toLocaleString()}`);

        switchTab('one-card');
      });
    }
  }

  function getPilotTestingHTML() {
    const testedStudents = state.students.filter(s => s.pilotDrill);

    return `
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Header Banner -->
        <div class="bg-gradient-to-r from-sky-800 via-sky-700 to-indigo-800 text-white rounded-2xl p-6 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1 max-w-2xl">
              <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                HCL Jigsaw Deliverable 2
              </span>
              <h2 class="text-2xl sm:text-3xl font-black">Real Pilot Testing with 10 Students (Grade 6 Cohort)</h2>
              <p class="text-sm text-sky-100">
                Conducted exclusively with verified parental consent in Grade 6. Emergency simulations comparing traditional paper registries versus the Student Health Passport.
              </p>
            </div>
            <div class="bg-white/15 px-4 py-3 rounded-xl border border-white/20 text-center">
              <div class="text-3xl font-black text-yellow-300">98.7%</div>
              <div class="text-xs uppercase font-bold text-white/90">Time Saved in Triage</div>
            </div>
          </div>
        </div>

        <!-- Comparative Metrics Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div class="text-xs uppercase font-bold text-slate-500">Traditional Paper Records</div>
            <div class="text-3xl font-black text-red-600 mt-1">14 Mins 30 Sec</div>
            <div class="text-xs text-slate-500 mt-1">Average retrieval & parent lookup</div>
          </div>
          <div class="bg-white p-4 rounded-xl border-2 border-emerald-400 shadow-sm text-center bg-emerald-50/40">
            <div class="text-xs uppercase font-bold text-emerald-700">Digital Health Passport</div>
            <div class="text-3xl font-black text-emerald-600 mt-1">10.4 Seconds</div>
            <div class="text-xs text-emerald-700 font-semibold mt-1">Instant QR scan & 1-card view</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
            <div class="text-xs uppercase font-bold text-slate-500">Parental Permission Rate</div>
            <div class="text-3xl font-black text-sky-600 mt-1">100% Verified</div>
            <div class="text-xs text-slate-500 mt-1">10/10 Digital Signatures On File</div>
          </div>
        </div>

        <!-- The 3 Tested Students Deep-Dive Cards -->
        <div class="space-y-6">
          <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-sky-600"></span>
            Grade 6 Pilot Cohort & Emergency Drill Breakdown
          </h3>

          ${testedStudents.map((st, idx) => `
            <div class="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
              <!-- Student Header & Scenario -->
              <div class="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div class="flex items-center gap-4">
                  <img src="${st.avatar}" alt="${st.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 bg-sky-100 text-sky-800 text-xs font-black rounded">PILOT STUDENT #${idx + 1}</span>
                      <span class="text-xs font-bold text-slate-500">${st.grade}-${st.section} • Roll: ${st.rollNo}</span>
                    </div>
                    <h4 class="text-xl font-black text-slate-900 mt-0.5">${st.name}</h4>
                    <div class="text-xs text-red-600 font-bold flex items-center gap-1.5 mt-0.5">
                      <span class="w-2 h-2 rounded-full bg-red-600"></span>
                      ${st.primaryCondition} • Blood Group: <strong>${st.bloodGroup}</strong>
                    </div>
                  </div>
                </div>

                <!-- Verified Consent Certificate CTA -->
                <button onclick="window.appOpenConsentModal('${st.id}')" class="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm">
                  <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                  <span>Verified Consent: <strong>${st.parentConsent.signedBy}</strong></span>
                </button>
              </div>

              <!-- Drill Simulation Details -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div class="md:col-span-4 space-y-1">
                  <div class="text-[10px] uppercase font-bold text-slate-500">Simulated Emergency Event</div>
                  <div class="text-xs font-bold text-slate-900">${st.pilotDrill.scenario}</div>
                  <div class="text-[11px] text-slate-500">Drill Date: ${st.pilotDrill.testedDate} • Location: ${st.pilotDrill.location}</div>
                </div>

                <!-- Speed Bar Comparison -->
                <div class="md:col-span-5 space-y-2">
                  <div class="flex justify-between text-xs font-bold">
                    <span class="text-red-700">Paper Files: ${st.pilotDrill.baselineTimePaper}</span>
                    <span class="text-emerald-700">Health Passport: ${st.pilotDrill.timeWithPassport}</span>
                  </div>
                  <div class="w-full bg-red-200 h-3 rounded-full overflow-hidden flex">
                    <div class="bg-emerald-500 h-full rounded-full" style="width: 5%;"></div>
                  </div>
                  <div class="text-[10px] text-slate-500 text-right">Saved: <strong>${st.pilotDrill.timeSaved}</strong></div>
                </div>

                <div class="md:col-span-3 text-right">
                  <button onclick="window.appSelectStudent('${st.id}', 'one-card')" class="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition">
                    Open Digital Card
                  </button>
                </div>
              </div>

              <!-- Nurse Clinical Observation -->
              <div class="space-y-1.5 text-xs">
                <div class="font-bold text-slate-800">First-Aid Triage Steps Executed:</div>
                <p class="text-slate-600 leading-relaxed">${st.pilotDrill.stepsTaken}</p>
                <blockquote class="p-3 bg-sky-50/70 border-l-4 border-sky-600 rounded-r-lg text-slate-700 italic mt-2">
                  "${st.pilotDrill.nurseObservation}"
                  <span class="block text-[10px] font-bold text-sky-800 not-italic mt-1">— Sister Mary Thomas (Infirmary Nurse)</span>
                </blockquote>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function attachPilotTestingEvents() {
    // Handled via window.appOpenConsentModal etc.
  }

  // ==========================================
  // TAB 4: SCHOOL NURSE FEEDBACK & RUBRIC
  // ==========================================
  function getNurseFeedbackHTML() {
    return `
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-800 via-teal-700 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="space-y-1 max-w-2xl">
              <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                HCL Jigsaw Deliverable 3
              </span>
              <h2 class="text-2xl sm:text-3xl font-black">School Nurse Evaluation Report</h2>
              <p class="text-sm text-teal-100">
                Formal clinical assessment by Sister Mary Thomas, RN (14 Years Senior Infirmary Nurse), based on the pilot trials with Aarav, Diya, and Rohan.
              </p>
            </div>
            <div class="bg-white/15 px-4 py-3 rounded-xl border border-white/20 text-center">
              <div class="text-3xl font-black text-yellow-300">${NURSE_EVALUATION.overallAverage.split(' ')[0]}</div>
              <div class="text-xs uppercase font-bold text-white/90">Clinical Scorecard</div>
            </div>
          </div>
        </div>

        <!-- Nurse Profile & Official Statement -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-2xl border-2 border-teal-300">
                👩‍⚕️
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900">${NURSE_EVALUATION.evaluator.name}</h3>
                <div class="text-xs font-bold text-teal-700">${NURSE_EVALUATION.evaluator.title}</div>
                <div class="text-xs text-slate-500">${NURSE_EVALUATION.evaluator.school} • Reg: ${NURSE_EVALUATION.evaluator.registrationNo}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                14 Years Clinical School Experience
              </span>
            </div>
          </div>

          <!-- Formal Clinical Appraisal Quote -->
          <div class="bg-slate-50 p-5 rounded-xl border-l-4 border-emerald-600 text-slate-700 leading-relaxed text-sm italic">
            "${NURSE_EVALUATION.testimonial}"
          </div>

          <!-- Detailed 5-Dimension Scorecard -->
          <div class="space-y-4">
            <h4 class="text-sm font-black text-slate-900 uppercase tracking-wider">Evaluation Rubric & Performance Breakdown</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${NURSE_EVALUATION.scores.map(s => `
                <div class="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-slate-800">${s.dimension}</span>
                    <span class="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">${s.score} / ${s.max}</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-emerald-600 h-full rounded-full" style="width: ${(s.score / s.max) * 100}%;"></div>
                  </div>
                  <div class="text-[11px] text-slate-500">${s.notes}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Key Recommendations -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <h5 class="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <svg class="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z"/></svg>
              Nurse's Core Recommendations for School Leadership
            </h5>
            <ul class="text-xs text-amber-800 space-y-1 pl-4 list-disc font-medium">
              ${NURSE_EVALUATION.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Interactive Live Feedback Submissions Form -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 class="text-base font-black text-slate-900">Submit Live Feedback / Nurse Assessment</h4>
              <p class="text-xs text-slate-500">Test adding your own review as an evaluator, teacher, or health officer</p>
            </div>
            <span class="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Interactive Form
            </span>
          </div>

          <form id="live-nurse-feedback-form" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input type="text" id="fb-nurse-name" required placeholder="e.g. Sister Anjali Sharma, RN" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Your Role / Title</label>
                <input type="text" id="fb-nurse-role" required placeholder="e.g. Infirmary Coordinator" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Overall Rating</label>
                <select id="fb-nurse-rating" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white font-bold">
                  <option value="5.0">5.0 / 5.0 - Exceptional (Lifesaving)</option>
                  <option value="4.8">4.8 / 5.0 - Excellent</option>
                  <option value="4.5">4.5 / 5.0 - Very Good</option>
                  <option value="4.0">4.0 / 5.0 - Good</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Clinical Remarks & Feedback</label>
              <textarea id="fb-nurse-comment" rows="3" required placeholder="How did the one-card health passport perform during emergency drill testing?" class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"></textarea>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition">
                Submit Feedback to Registry
              </button>
            </div>
          </form>

          <!-- List of submitted feedbacks -->
          <div class="space-y-3 pt-4 border-t border-slate-100">
            <h5 class="text-xs font-bold text-slate-500 uppercase">Recent Submissions (${state.feedbacks.length})</h5>
            <div class="space-y-2">
              ${state.feedbacks.map(f => `
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div class="flex justify-between items-center font-bold">
                    <span class="text-slate-900">${f.name} <span class="text-slate-400 font-normal">(${f.role})</span></span>
                    <span class="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px] font-black">${f.rating} ★</span>
                  </div>
                  <p class="text-slate-600 italic">"${f.comment}"</p>
                  <div class="text-[10px] text-slate-400">${f.date}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachNurseFeedbackEvents() {
    const form = document.getElementById('live-nurse-feedback-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('fb-nurse-name').value.trim();
        const role = document.getElementById('fb-nurse-role').value.trim();
        const rating = parseFloat(document.getElementById('fb-nurse-rating').value);
        const comment = document.getElementById('fb-nurse-comment').value.trim();

        if (!name || !comment) return;

        const newFeedback = {
          id: "FB-" + Date.now().toString().slice(-4),
          name,
          role,
          rating,
          comment,
          date: new Date().toISOString().split('T')[0]
        };

        state.feedbacks.unshift(newFeedback);
        localStorage.setItem('shp_feedbacks', JSON.stringify(state.feedbacks));
        alert("✅ Feedback successfully logged! Thank you for participating in the clinical assessment.");
        renderCurrentTab();
      });
    }
  }

  // ==========================================
  // TAB 5: INTERACTIVE PRESENTATION DECK
  // ==========================================
  function getPresentationHTML() {
    const slide = PRESENTATION_SLIDES[state.currentSlideIndex];
    const totalSlides = PRESENTATION_SLIDES.length;

    return `
      <div class="max-w-5xl mx-auto space-y-4 ${state.isFullscreenPresentation ? 'fullscreen-mode' : ''}">
        <!-- Presentation Controls Bar -->
        <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
          <div class="flex items-center gap-2">
            <span class="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Slide:</span>
            <div class="flex gap-1">
              ${PRESENTATION_SLIDES.map((s, idx) => `
                <button onclick="window.appJumpSlide(${idx})" class="w-7 h-7 rounded-lg text-xs font-black transition ${idx === state.currentSlideIndex ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                  ${idx + 1}
                </button>
              `).join('')}
            </div>
            <span class="text-xs text-slate-400 font-medium ml-1">of ${totalSlides}</span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.appToggleSpeakerNotes()" class="px-3 py-1.5 rounded-lg text-xs font-bold border transition ${state.showSpeakerNotes ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'}">
              ${state.showSpeakerNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}
            </button>
            <button onclick="window.appToggleFullscreenPresentation()" class="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
              ${state.isFullscreenPresentation ? 'Exit Fullscreen' : 'Fullscreen Deck'}
            </button>
            <button onclick="window.print()" class="px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold hover:bg-sky-700 transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
              Export / Print
            </button>
          </div>
        </div>

        <!-- THE ACTIVE SLIDE CANVAS -->
        <div class="slide-container rounded-2xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
          <!-- Slide Category & Counter -->
          <div>
            <div class="flex justify-between items-center pb-4 border-b border-slate-200">
              <span class="text-xs font-black tracking-widest text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                ${slide.category}
              </span>
              <span class="text-xs font-mono font-bold text-slate-400">
                ${slide.slideNumber}
              </span>
            </div>

            <!-- Slide Title & Subtitle -->
            <div class="mt-6 space-y-2">
              <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">${slide.title}</h1>
              <h3 class="text-lg font-bold text-sky-700">${slide.subtitle}</h3>
              <p class="text-sm text-slate-600 font-medium pt-1 max-w-3xl">${slide.leadText}</p>
            </div>

            <!-- Stats Highlight Grid (if any) -->
            ${slide.stats ? `
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                ${slide.stats.map(st => `
                  <div class="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center shadow-inner">
                    <div class="text-2xl sm:text-3xl font-black text-sky-600">${st.value}</div>
                    <div class="text-[11px] font-bold text-slate-600 mt-1">${st.label}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Slide Core Bullets -->
            <div class="mt-6 space-y-3">
              ${slide.bullets.map(b => `
                <div class="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <span class="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0"></span>
                  <div>${b.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class=\"font-black text-slate-900\">$1</strong>')}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Bottom Navigation Bar inside Slide -->
          <div class="pt-8 border-t border-slate-200 mt-8 flex items-center justify-between no-print">
            <button onclick="window.appPrevSlide()" ${state.currentSlideIndex === 0 ? 'disabled' : ''} class="px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1">
              ← Previous Slide
            </button>
            <div class="text-xs text-slate-400 font-medium">Use ← and → arrow keys to navigate</div>
            <button onclick="window.appNextSlide()" ${state.currentSlideIndex === totalSlides - 1 ? 'disabled' : ''} class="px-5 py-2 text-xs font-black rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 shadow-sm">
              Next Slide →
            </button>
          </div>
        </div>

        <!-- Speaker Notes Drawer -->
        ${state.showSpeakerNotes ? `
          <div class="bg-amber-50 rounded-xl border border-amber-200 p-5 shadow-sm space-y-2 no-print">
            <div class="flex items-center gap-2 text-xs font-extrabold text-amber-900 uppercase tracking-wider">
              <span>🎤 Speaker Delivery Notes for Slide ${state.currentSlideIndex + 1}:</span>
            </div>
            <p class="text-xs text-amber-900 font-medium leading-relaxed italic">
              "${slide.speakerNotes}"
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  function attachPresentationEvents() {
    // Handled via window.appPrevSlide, etc.
  }

  // ==========================================
  // TAB 6: INCIDENT LOGGER
  // ==========================================
  function getIncidentLogHTML() {
    return `
      <div class="max-w-5xl mx-auto space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black text-slate-900">Infirmary Incident Register</h2>
            <p class="text-xs text-slate-500">Official log of medical events, triage interventions, and parent notifications.</p>
          </div>
          <button onclick="window.appOpenNewIncidentModal()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Record New Incident
          </button>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="p-3.5">Timestamp</th>
                  <th class="p-3.5">Student</th>
                  <th class="p-3.5">Reported Symptoms</th>
                  <th class="p-3.5">Triage Action & Meds</th>
                  <th class="p-3.5">Parent Notification</th>
                  <th class="p-3.5">Attending Nurse</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                ${state.incidents.map(inc => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-3.5 font-mono text-[11px] text-slate-500">${inc.timestamp}</td>
                    <td class="p-3.5">
                      <div class="font-bold text-slate-900">${inc.studentName}</div>
                      <div class="text-[10px] text-slate-500">${inc.grade}</div>
                    </td>
                    <td class="p-3.5 font-medium text-slate-700">${inc.complaint}</td>
                    <td class="p-3.5">
                      <div class="text-slate-800">${inc.triageAction}</div>
                      ${inc.medicationGiven ? `<div class="text-[11px] font-bold text-sky-700 mt-0.5">Rx: ${inc.medicationGiven}</div>` : ''}
                    </td>
                    <td class="p-3.5">
                      <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold ${inc.parentNotified.startsWith('Yes') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${inc.parentNotified}
                      </span>
                    </td>
                    <td class="p-3.5 text-slate-600 font-medium">${inc.nurse}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function attachIncidentLogEvents() {}

  // ==========================================
  // MODALS IMPLEMENTATION
  // ==========================================
  function setupModals() {
    // Escape key closes modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function closeAllModals() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = '';
      modalContainer.classList.add('hidden');
    }
  }

  // MODAL 1: Verified Parental Consent Certificate
  function openConsentModal(studentId) {
    const student = state.students.find(s => s.id === studentId) || getSelectedStudent();
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-xl w-full border-2 border-emerald-500 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
          <div class="bg-emerald-700 text-white p-5 flex justify-between items-center">
            <div class="flex items-center gap-2.5">
              <svg class="w-6 h-6 text-emerald-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              <div>
                <h3 class="text-lg font-black leading-snug">Parental Medical Consent Certificate</h3>
                <div class="text-xs text-emerald-200">Compliance with Indian School Health Guidelines</div>
              </div>
            </div>
            <button onclick="window.appCloseModal()" class="text-white/80 hover:text-white text-xl font-black">&times;</button>
          </div>

          <div class="p-6 space-y-4 text-xs text-slate-700">
            <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center">
              <div>
                <div class="text-[10px] uppercase font-bold text-emerald-800">Authorization Record</div>
                <div class="text-sm font-black text-slate-900">${student.parentConsent.consentId}</div>
                <div class="text-[10px] text-slate-500">Hash: <span class="font-mono">${student.parentConsent.verificationHash}</span></div>
              </div>
              <span class="px-3 py-1 bg-emerald-600 text-white font-black text-[11px] rounded-full uppercase">
                ${student.parentConsent.status}
              </span>
            </div>

            <div class="space-y-1">
              <div class="font-bold text-slate-900">Student Subject:</div>
              <p class="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                ${student.name} (${student.grade}-${student.section}) • DOB: ${student.dob} • Blood: ${student.bloodGroup}
              </p>
            </div>

            <div class="space-y-1">
              <div class="font-bold text-slate-900">Signed Parent / Guardian:</div>
              <p class="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium flex justify-between items-center">
                <span><strong>${student.parentConsent.signedBy}</strong> (${student.parentConsent.relation})</span>
                <span class="text-slate-400">Date: ${student.parentConsent.dateSigned}</span>
              </p>
            </div>

            <div class="space-y-1">
              <div class="font-bold text-slate-900">Digital Consent Statement:</div>
              <p class="p-3 bg-slate-100 rounded-lg text-slate-700 italic border border-slate-200 leading-relaxed">
                "${student.parentConsent.statement}"
              </p>
            </div>

            <div class="space-y-1">
              <div class="font-bold text-slate-900">Authorized Clinical Scope:</div>
              <div class="flex flex-wrap gap-1.5">
                ${student.parentConsent.scope.map(sc => `
                  <span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    ✓ ${sc}
                  </span>
                `).join('')}
              </div>
            </div>

            <div class="pt-3 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
              <span>Verified by School Nurse Sister Mary Thomas</span>
              <button onclick="window.print()" class="px-4 py-1.5 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition">
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    modalContainer.classList.remove('hidden');
  }

  // MODAL 2: Printable CR80 ID Lanyard Badge
  function openPrintBadgeModal(studentId) {
    const student = state.students.find(s => s.id === studentId) || getSelectedStudent();
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    const qrPayload = `STUDENT HEALTH PASSPORT\nName: ${student.name}\nGrade: ${student.grade}-${student.section}\nBlood: ${student.bloodGroup}\nRisk: ${student.emergencyRiskLevel}\nCondition: ${student.primaryCondition}\nParent: ${student.emergencyContacts[0].name} (${student.emergencyContacts[0].phone})\nConsent ID: ${student.parentConsent.consentId}`;
    const qrSvg = QRCodeGenerator.generateSVG(qrPayload, 130);

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-300 shadow-2xl">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 no-print">
            <div>
              <h3 class="text-lg font-black text-slate-900">Physical Health Passport Lanyard Badge</h3>
              <p class="text-xs text-slate-500">Standard CR80 Size (85.6mm × 54mm) - Front & Back printable format</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="window.print()" class="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                Print Badge
              </button>
              <button onclick="window.appCloseModal()" class="text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
            </div>
          </div>

          <!-- LANYARD CARD PREVIEW (FRONT & BACK) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start justify-center p-4 bg-slate-100 rounded-xl border border-slate-200">
            <!-- FRONT SIDE -->
            <div class="id-badge-card p-4 space-y-2.5 mx-auto">
              <div class="lanyard-hole"></div>
              <div class="text-center pt-1 border-b border-slate-100 pb-2">
                <div class="text-[9px] font-black uppercase tracking-widest text-sky-700">Greenfield Academy • Health Passport</div>
                <div class="text-xs font-black text-slate-900">STUDENT EMERGENCY ID</div>
              </div>
              <div class="flex items-center gap-3">
                <img src="${student.avatar}" alt="${student.name}" class="w-16 h-16 rounded-xl object-cover border border-slate-300">
                <div class="space-y-0.5">
                  <div class="text-sm font-black text-slate-900">${student.name}</div>
                  <div class="text-[11px] font-bold text-slate-600">${student.grade} • Sec ${student.section}</div>
                  <div class="text-[10px] text-slate-400">Roll: ${student.rollNo} • Age: ${student.age}</div>
                </div>
              </div>
              <div class="bg-red-50 border border-red-200 rounded-lg p-2 text-center">
                <div class="text-[9px] font-extrabold uppercase text-red-700">BLOOD GROUP</div>
                <div class="text-2xl font-black text-red-600 leading-none my-0.5">${student.bloodGroup}</div>
                <div class="text-[9px] text-red-700 font-bold">${student.primaryCondition}</div>
              </div>
              <div class="text-[9px] text-center text-slate-400 uppercase tracking-widest font-mono">
                Scan back for emergency protocol
              </div>
            </div>

            <!-- BACK SIDE -->
            <div class="id-badge-card p-4 space-y-2.5 mx-auto">
              <div class="lanyard-hole"></div>
              <div class="text-center pt-1 border-b border-slate-100 pb-1">
                <div class="text-[9px] font-black uppercase text-red-600">EMERGENCY MEDICAL DIRECTIVES</div>
              </div>
              <div class="flex items-center justify-between gap-2">
                <div class="bg-white p-1 rounded-lg border border-slate-200 flex-shrink-0">
                  ${qrSvg}
                </div>
                <div class="text-[10px] space-y-1 text-slate-700">
                  <div><strong>Allergies:</strong> <span class="text-red-700 font-bold">${student.allergies.map(a => a.allergen.split(' ')[0]).join(', ')}</span></div>
                  <div><strong>Parent:</strong> ${student.emergencyContacts[0].name}</div>
                  <div class="font-mono text-sky-700 font-bold">${student.emergencyContacts[0].phone}</div>
                  <div class="text-[9px] text-slate-400 mt-1">Ambulance: Dial 108</div>
                </div>
              </div>
              <div class="bg-slate-50 p-2 rounded-lg text-[9px] text-slate-600 leading-tight">
                <strong>First-Aid Directive:</strong> ${student.emergencyProtocol[0].instruction.slice(0, 110)}...
              </div>
              <div class="text-[8px] text-center text-slate-400">
                Verified Parent Consent ID: ${student.parentConsent.consentId}
              </div>
            </div>
          </div>

          <div class="text-center text-xs text-slate-500 no-print">
            Tip: Print on card stock, cut along borders, and insert into standard school lanyard pouches.
          </div>
        </div>
      </div>
    `;
    modalContainer.classList.remove('hidden');
  }

  // MODAL 3: Emergency Drill Simulation (The Playground Collapse scenario from challenge)
  function openDrillModal(studentId) {
    const student = state.students.find(s => s.id === studentId) || getSelectedStudent();
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    playAlertSound('emergency');

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-xl w-full border-4 border-red-600 shadow-2xl overflow-hidden animate-emergency-pulse">
          <div class="bg-red-600 text-white p-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-2xl animate-bounce">🚨</span>
              <div>
                <h3 class="text-lg font-black uppercase tracking-wide">Emergency Simulation Drill</h3>
                <div class="text-xs text-red-100">Grade 6 Playground Collapse Scenario</div>
              </div>
            </div>
            <button onclick="window.appCloseModal()" class="text-white text-2xl font-black">&times;</button>
          </div>

          <div class="p-6 space-y-4 text-xs text-slate-700">
            <div class="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-lg text-red-900 font-medium">
              <strong>Simulated Emergency Alert:</strong> ${student.name} suddenly collapses during outdoor sports activity. School nurse arrives on scene.
            </div>

            <!-- Instant Triage Highlights -->
            <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Diagnosed Condition:</span>
                <div class="text-sm font-black text-red-600">${student.primaryCondition}</div>
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">Blood Group:</span>
                <div class="text-sm font-black text-slate-900">${student.bloodGroup} (Rh ${student.rhFactor})</div>
              </div>
            </div>

            <!-- Allergy Contraindication Alert -->
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
              <div class="font-black text-amber-900 uppercase tracking-wide text-[11px]">Strict Contraindications:</div>
              <ul class="list-disc pl-4 text-amber-800 space-y-0.5">
                ${student.allergies.map(a => `<li><strong>${a.allergen}</strong>: ${a.reaction}</li>`).join('')}
              </ul>
            </div>

            <!-- Immediate Nurse Protocol -->
            <div class="space-y-1.5">
              <div class="font-black text-slate-900 uppercase tracking-wide text-[11px]">Action Steps to Execute:</div>
              <ol class="space-y-1.5 list-decimal pl-4 text-slate-800 font-medium">
                ${student.emergencyProtocol.slice(0, 3).map(p => `
                  <li><strong>${p.title}:</strong> ${p.instruction}</li>
                `).join('')}
              </ol>
            </div>

            <!-- 1-Click Action Buttons -->
            <div class="pt-2 flex flex-wrap gap-2">
              <a href="tel:${student.emergencyContacts[0].phone}" class="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-center transition">
                Call ${student.emergencyContacts[0].name} (${student.emergencyContacts[0].relation})
              </a>
              <a href="tel:108" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-center transition">
                Dial 108 Ambulance
              </a>
            </div>

            <div class="text-center pt-2">
              <button onclick="window.appCompleteDrill('${student.id}')" class="text-emerald-700 font-bold hover:underline">
                ✓ Mark Emergency Drill as Successfully Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    modalContainer.classList.remove('hidden');
  }

  // MODAL 4: Add New Incident Log
  function openNewIncidentModal(defaultStudentId = null) {
    const student = defaultStudentId ? state.students.find(s => s.id === defaultStudentId) : getSelectedStudent();
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden">
          <div class="bg-slate-800 text-white p-4 flex justify-between items-center">
            <h3 class="text-base font-black">Record Clinical Incident</h3>
            <button onclick="window.appCloseModal()" class="text-white text-2xl font-bold">&times;</button>
          </div>

          <form id="incident-form" class="p-6 space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Student</label>
              <select id="inc-student-id" class="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-semibold">
                ${state.students.map(s => `
                  <option value="${s.id}" ${s.id === student.id ? 'selected' : ''}>
                    ${s.name} (${s.grade}-${s.section}) - ${s.bloodGroup}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Reported Symptoms / Emergency</label>
              <input type="text" id="inc-complaint" required placeholder="e.g. Wheezing post-athletics, dizzy spells, knee scrape" class="w-full p-2.5 border border-slate-300 rounded-lg">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">First Aid & Triage Intervention</label>
              <textarea id="inc-triage" required rows="2" placeholder="e.g. Seated upright, administered 2 puffs Salbutamol with AeroChamber spacer..." class="w-full p-2.5 border border-slate-300 rounded-lg"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Medication Administered</label>
                <input type="text" id="inc-meds" placeholder="e.g. Salbutamol 100mcg" class="w-full p-2.5 border border-slate-300 rounded-lg">
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Parent Notified?</label>
                <select id="inc-parent-notified" class="w-full p-2.5 border border-slate-300 rounded-lg bg-white">
                  <option value="Yes - Via 1-Tap Dial">Yes - Via 1-Tap Dial</option>
                  <option value="Yes - Via WhatsApp">Yes - Via WhatsApp</option>
                  <option value="Attempted - No Answer">Attempted - No Answer</option>
                  <option value="Not Required (Minor)">Not Required (Minor)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Outcome & Disposition</label>
              <input type="text" id="inc-outcome" placeholder="e.g. Rested 20 mins, breathing normalized, returned to class." class="w-full p-2.5 border border-slate-300 rounded-lg">
            </div>

            <div class="pt-3 flex justify-end gap-2">
              <button type="button" onclick="window.appCloseModal()" class="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 transition">Save to Register</button>
            </div>
          </form>
        </div>
      </div>
    `;
    modalContainer.classList.remove('hidden');

    const form = document.getElementById('incident-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetId = document.getElementById('inc-student-id').value;
        const targetStudent = state.students.find(s => s.id === targetId) || getSelectedStudent();
        const complaint = document.getElementById('inc-complaint').value;
        const triageAction = document.getElementById('inc-triage').value;
        const medicationGiven = document.getElementById('inc-meds').value;
        const parentNotified = document.getElementById('inc-parent-notified').value;
        const outcome = document.getElementById('inc-outcome').value;

        const newInc = {
          id: "INC-" + Date.now().toString().slice(-4),
          timestamp: new Date().toLocaleString(),
          studentId: targetStudent.id,
          studentName: targetStudent.name,
          grade: targetStudent.grade + '-' + targetStudent.section,
          complaint,
          triageAction,
          medicationGiven,
          parentNotified,
          resolution: outcome,
          nurse: "Sr. Mary Thomas"
        };

        state.incidents.unshift(newInc);
        localStorage.setItem('shp_incidents', JSON.stringify(state.incidents));
        closeAllModals();
        alert("✅ Incident registered successfully!");
        if (state.activeTab === 'incident-log') {
          renderCurrentTab();
        }
      });
    }
  }

  // Keyboard navigation for presentation
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (state.activeTab === 'presentation') {
        if (e.key === 'ArrowRight' || e.key === 'Space') {
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
        }
      }
    });
  }

  function nextSlide() {
    if (state.currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      state.currentSlideIndex++;
      renderCurrentTab();
    }
  }

  function prevSlide() {
    if (state.currentSlideIndex > 0) {
      state.currentSlideIndex--;
      renderCurrentTab();
    }
  }

  function jumpSlide(index) {
    if (index >= 0 && index < PRESENTATION_SLIDES.length) {
      state.currentSlideIndex = index;
      renderCurrentTab();
    }
  }

  // ==========================================
  // EXPOSE GLOBAL HELPERS (Window API)
  // ==========================================
  window.appSelectStudent = function (studentId, jumpToTab) {
    selectStudent(studentId, jumpToTab);
  };

  window.appSwitchTab = function (tabName) {
    switchTab(tabName);
  };

  window.appSetSearch = function (query) {
    state.searchQuery = query;
    const searchInput = document.getElementById('nurse-search-input');
    if (searchInput) searchInput.value = query;
    renderCurrentTab();
  };

  window.appOpenConsentModal = function (studentId) {
    openConsentModal(studentId);
  };

  window.appOpenPrintBadge = function (studentId) {
    openPrintBadgeModal(studentId);
  };

  window.appOpenDrillModal = function (studentId) {
    openDrillModal(studentId);
  };

  window.appOpenNewIncidentModal = function () {
    openNewIncidentModal();
  };

  window.appLogIncidentForStudent = function (studentId) {
    openNewIncidentModal(studentId);
  };

  window.appCloseModal = function () {
    closeAllModals();
  };

  window.appNextSlide = function () {
    nextSlide();
  };

  window.appPrevSlide = function () {
    prevSlide();
  };

  window.appJumpSlide = function (index) {
    jumpSlide(index);
  };

  window.appToggleSpeakerNotes = function () {
    state.showSpeakerNotes = !state.showSpeakerNotes;
    renderCurrentTab();
  };

  window.appToggleFullscreenPresentation = function () {
    state.isFullscreenPresentation = !state.isFullscreenPresentation;
    renderCurrentTab();
  };

  window.appCompleteDrill = function (studentId) {
    const student = state.students.find(s => s.id === studentId) || getSelectedStudent();
    closeAllModals();
    alert(`🎉 DRILL SUCCESSFUL: ${student.name}'s emergency protocol was executed flawlessly in under 12 seconds. Incident recorded.`);
  };

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
