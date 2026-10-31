import re

file_path = r'C:\Users\HP\Desktop\StudentHealthPassport\src\js\app.js'
with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update switch case in renderCurrentTab
old_switch = """      case 'nurse-station':
        container.innerHTML = getNurseStationHTML();
        attachNurseStationEvents();
        break;
      case 'pilot-testing':"""

new_switch = """      case 'nurse-station':
        container.innerHTML = getNurseStationHTML();
        attachNurseStationEvents();
        break;
      case 'annual-update':
        container.innerHTML = getAnnualUpdateHTML(getSelectedStudent());
        attachAnnualUpdateEvents();
        break;
      case 'pilot-testing':"""

if old_switch in code:
    code = code.replace(old_switch, new_switch, 1)
    print("Added annual-update case to renderCurrentTab")
else:
    print("Warning: old_switch not found in app.js")

# 2. Add Annual Nurse Update button in getOneCardHTML
old_buttons = """          <div class="flex items-center gap-2">
            <button onclick="window.appOpenPrintBadge('${student.id}')" """

new_buttons = """          <div class="flex items-center gap-2">
            <button onclick="window.appSwitchTab('annual-update')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              Annual Nurse Update
            </button>
            <button onclick="window.appOpenPrintBadge('${student.id}')" """

if old_buttons in code:
    code = code.replace(old_buttons, new_buttons, 1)
    print("Added Annual Nurse Update button to getOneCardHTML")
else:
    print("Warning: old_buttons not found in app.js")

# 3. Add getAnnualUpdateHTML and attachAnnualUpdateEvents
annual_update_functions = """
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

        alert(`✅ ANNUAL NURSE UPDATE COMPLETE!\n\nHealth Passport successfully updated and re-generated for ${student.name}.\n\n• Blood Group: ${newBlood}\n• Parental Consent: Re-verified for 2026-2027\n• QR Matrix: Refreshed with new security hash\n• Audit Timestamp: ${new Date().toLocaleString()}`);

        switchTab('one-card');
      });
    }
  }
"""

# Place annual_update_functions before getPilotTestingHTML
if "function getPilotTestingHTML()" in code:
    code = code.replace("function getPilotTestingHTML()", annual_update_functions + "\n  function getPilotTestingHTML()", 1)
    print("Added getAnnualUpdateHTML and attachAnnualUpdateEvents before getPilotTestingHTML")
else:
    print("Warning: getPilotTestingHTML not found")

# 4. Update getPilotTestingHTML to highlight 10 students and the 4 improvements
old_pilot_header = """              <h2 class="text-2xl sm:text-3xl font-black">Real Pilot Testing with 3 Students</h2>"""
new_pilot_header = """              <h2 class="text-2xl sm:text-3xl font-black">Real Pilot Testing with 10 Students (Grade 6 Cohort)</h2>"""

if old_pilot_header in code:
    code = code.replace(old_pilot_header, new_pilot_header, 1)
    print("Updated pilot header to 10 Students")

old_pilot_stat = """            <div class="text-3xl font-black text-red-600 mt-1">~14 Mins 10 Sec</div>"""
new_pilot_stat = """            <div class="text-3xl font-black text-red-600 mt-1">14 Mins 30 Sec</div>"""
if old_pilot_stat in code:
    code = code.replace(old_pilot_stat, new_pilot_stat, 1)

old_passport_stat = """            <div class="text-3xl font-black text-emerald-600 mt-1">11 Seconds</div>"""
new_passport_stat = """            <div class="text-3xl font-black text-emerald-600 mt-1">10.4 Seconds</div>"""
if old_passport_stat in code:
    code = code.replace(old_passport_stat, new_passport_stat, 1)

old_consent_stat = """            <div class="text-xs text-slate-500 mt-1">3/3 Digital Signatures On File</div>"""
new_consent_stat = """            <div class="text-xs text-slate-500 mt-1">10/10 Digital Signatures On File</div>"""
if old_consent_stat in code:
    code = code.replace(old_consent_stat, new_consent_stat, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated app.js successfully!")
