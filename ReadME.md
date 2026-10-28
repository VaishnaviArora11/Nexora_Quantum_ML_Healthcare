# Nexora — Quantum Healthcare Platform
A browser-based web app that brings quantum-computing models into healthcare for three groups of people: researchers, hospitals, and students / the community. It runs entirely in the browser with plain HTML, CSS and JavaScript (no build step, no backend).

    Important: the quantum circuits are simulated on your device, not run on real quantum hardware. All data and patient records are synthetic demo data. This is a research demo, not a diagnostic tool. Do not enter real patient data.

# What we built
## 1. For researchers
    Quantum ML lab — benchmarks a quantum-kernel classifier (QSVM) and a variational quantum classifier (VQC) against logistic regression, using patient-level 5-fold cross-validation. Upload a CSV or load the demo dataset.
    Drug discovery (quantum QSAR) — learns which compound descriptors predict activity, validates by chemical series, then ranks new candidate compounds.
    Disease risk (hybrid quantum model) — validates by centre/cohort, then scores a single new patient or a batch CSV, useful for research labs and detection centres.
    Papers — a searchable library of 100 sample entries across 10 topics, with topic filters, sorting, expandable abstracts, a Saved list, and a form to add your own.
## 2. For hospitals (doctors and hospital staff)
    Staff & availability — shift-based roster with availability toggles.
    Ward allocation — distributes available staff to wards in proportion to patients × acuity weight, and shows patients-per-staff ratios.
    Machine readings — simulated live bedside vitals (HR, SpO₂, BP) refreshed every 2 seconds, with a hybrid quantum risk score and alerts per patient.
    Patient data — a patient table with a hybrid quantum-classical risk column, plus add/remove.
    Publish to students (doctors) — post trending topics, new diseases and education sessions for students.
## 3. For students and the community
    Health impact wallet — points and a literacy level (Beginner / Informed / Expert) earned from a health-literacy quiz.
    Community & trends — education sessions you can join (+5 pts), and trending topics on new diseases, viruses and prevention.
    
    
# Design
   A dark, atmospheric UI inspired by the Kage landing page: a single red accent, light Onest type, hairline borders, an animated landing page with a glowing quantum "sun", drifting particles and scroll-reveal scenes. A role switcher at the top lets you view the app as a researcher, doctor, hospital staff member or student.

# What it solves
Problem	How Nexora addresses it
    Classical ML can struggle on small, noisy, high-dimensional biomedical data	Quantum-kernel and variational models are benchmarked side by side with a classical baseline, so researchers can see whether quantum helps on their data
    Models that look good but fail on new patients, centres or compound series	Validation is grouped by patient, centre or series rather than random rows, which gives more honest results
    Hospitals juggling staffing against patient load	Acuity-weighted staff allocation and shift availability in one view
    Missed warning signs at the bedside	Live vitals combined with a risk model flag patients for review
    Research, clinical operations and public education living in separate tools	One platform with role-based views for each audience
    Low health literacy and slow spread of reliable prevention information	A points-based wallet, quiz and community sessions published by doctors and researchers

## Project structure

nexora/
├── index.html
├── styles.css
└── js/
    ├── core.js            # helpers, user state, roles
    ├── risk-model.js      # 4-qubit hybrid risk model
    ├── roles.js           # tabs and role switcher
    ├── hospital.js        # staff, ward allocation, live monitor
    ├── papers-wallet.js   # papers library, wallet and quiz
    ├── lab.js             # quantum ML lab (QSVM, VQC, benchmarking)
    ├── patients.js        # patient table
    ├── community.js       # publishing and community sessions
    ├── home.js            # landing page
    └── app.js             # renders the app (must load last)

Scripts share one global scope, so the load order in index.html matters: core.js first, app.js last.

Running it

Open index.html in a browser. No install is needed. The Onest font loads from Google Fonts and falls back to the system font offline.

# Known limitations
    Simulated quantum computing — up to 8 qubits, run in the browser.
    Demo role switcher — there is no sign-in, sign-up or login yet.
    Local storage only — patient and staff edits are saved in your browser only.
    Shared content needs claude.ai — sessions and topics published by doctors only reach students when the page is opened from claude.ai. Elsewhere, shared storage is unavailable.
    Sample papers — the 100 titles are placeholders, not real citations.
    Unverified content — published topics show "Pending verification" because no verification step exists yet.

# Roadmap
    Real sign-up, login and role selection (student, hospital staff, researcher)
    Verified doctor profiles, online video consultations and payments
    A secure, compliant backend for real patient data
    Real quantum-hardware backends
    Real research-paper sources