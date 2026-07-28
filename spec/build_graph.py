#!/usr/bin/env python3
"""Paper Trail — Phase 1 concept graph builder.

Authors the BT/MA/FA concept graph, validates it, and emits:
  - concepts.json                     (machine-readable, for Claude Code)
  - Paper_Trail_Concept_Graph_v1.0.md (human review document)
"""

import json
from collections import defaultdict

CONCEPTS = []


def C(cid, name, outcome, definition, prereq=None, grows=None, integ=None):
    CONCEPTS.append({
        "id": cid,
        "name": name,
        "paper": cid.split("-")[0],
        "outcome": outcome,
        "definition": definition,
        "prerequisite_of": [],          # filled by inversion below
        "prerequisites": prereq or [],
        "grows_into": grows or [],
        "integrates_with": integ or [],
        "stub": cid.split("-")[1].startswith("S"),
    })


# ============================================================
# STUB LANDING NODES — Skills-level targets, created first so
# grows_into edges resolve. No lessons or items authored here.
# ============================================================

FR_STUBS = [
    ("FR-S01", "Revaluation model for PPE", "FR B"),
    ("FR-S02", "Impairment of assets", "FR B"),
    ("FR-S03", "Leases (IFRS 16)", "FR C"),
    ("FR-S04", "Revenue — the five-step model", "FR C"),
    ("FR-S05", "Consolidation with fair value adjustments", "FR D"),
    ("FR-S06", "Associates — the equity method at FR depth", "FR D"),
    ("FR-S07", "Statement of cash flows at FR depth", "FR D"),
    ("FR-S08", "Interpretation and analysis at FR depth", "FR E"),
    ("FR-S09", "Provisions and contingencies (IAS 37)", "FR C"),
    ("FR-S10", "Earnings per share (IAS 33)", "FR C"),
    ("FR-S11", "The conceptual framework at FR depth", "FR A"),
    ("FR-S12", "Intangible assets (IAS 38)", "FR B"),
    ("FR-S13", "Government grants and borrowing costs", "FR B"),
    ("FR-S14", "Income taxes (IAS 12)", "FR C"),
    ("FR-S15", "Inventories and biological assets", "FR C"),
    ("FR-S16", "Financial instruments", "FR C"),
    ("FR-S17", "Single-entity statements from a trial balance", "FR D"),
]

PM_STUBS = [
    ("PM-S01", "Activity based costing at PM depth", "PM A"),
    ("PM-S02", "Target costing", "PM A"),
    ("PM-S03", "Life-cycle costing", "PM A"),
    ("PM-S04", "Throughput accounting", "PM A"),
    ("PM-S05", "Environmental accounting", "PM A"),
    ("PM-S06", "Relevant cost analysis", "PM B"),
    ("PM-S07", "Cost-volume-profit analysis", "PM B"),
    ("PM-S08", "Limiting factors and linear programming", "PM B"),
    ("PM-S09", "Pricing decisions", "PM B"),
    ("PM-S10", "Risk and uncertainty in decision making", "PM B"),
    ("PM-S11", "Budgetary systems and types", "PM C"),
    ("PM-S12", "Advanced variances — mix, yield, planning and operational", "PM C"),
    ("PM-S13", "Divisional performance and transfer pricing", "PM D"),
    ("PM-S14", "Performance measurement frameworks", "PM D"),
]

FM_STUBS = [
    ("FM-S01", "Investment appraisal at FM depth", "FM D"),
    ("FM-S02", "Working capital management", "FM C"),
    ("FM-S03", "Cost of capital and WACC", "FM E"),
    ("FM-S04", "Sources of business finance", "FM E"),
    ("FM-S05", "Business valuations", "FM F"),
    ("FM-S06", "Risk management — currency and interest rate", "FM G"),
    ("FM-S07", "Financial analysis at FM depth", "FM B"),
]

for cid, name, outcome in FR_STUBS + PM_STUBS + FM_STUBS:
    C(cid, name, outcome, "Skills-level landing node. Reserved target for growth edges; no Phase 1 content.")


# ============================================================
# BT — Business and Technology (areas A-F)
# ============================================================

# A. The business organisation, its stakeholders and the external environment
C("BT-01", "Purpose and types of business organisation", "BT A1",
  "Why organisations exist, and how sole traders, partnerships, limited companies, not-for-profits and public sector bodies differ.")
C("BT-02", "Profit orientation and not-for-profit objectives", "BT A1",
  "How the objective of the organisation changes what 'performance' means.", prereq=["BT-01"])
C("BT-03", "Stakeholders and stakeholder classification", "BT A2",
  "Internal, connected and external stakeholders, and the claim each holds on the organisation.", prereq=["BT-01"])
C("BT-04", "Stakeholder power, interest and conflict", "BT A2",
  "Mendelow-style mapping of power against interest, and how competing claims are resolved.", prereq=["BT-03"])
C("BT-05", "Political and legal factors", "BT A3",
  "How government policy, law and regulation shape what an organisation may do.")
C("BT-06", "Data protection, employment and health-and-safety regulation", "BT A3",
  "The specific legal duties an employer carries towards data, staff and workplace safety.", prereq=["BT-05"])
C("BT-07", "Macroeconomic policy and objectives", "BT A4",
  "Fiscal and monetary policy and the four standard objectives governments pursue.")
C("BT-08", "The business cycle and macroeconomic indicators", "BT A4",
  "Growth, inflation, unemployment and balance of payments, and how the cycle moves them.", prereq=["BT-07"])
C("BT-09", "Demand, supply and elasticity", "BT A5",
  "How price, income and substitutes move quantity, and what elasticity tells a business.")
C("BT-10", "Social and demographic factors", "BT A6",
  "Population structure, workforce change and social attitudes as business drivers.")
C("BT-11", "Technological factors and the value chain", "BT A7",
  "How technology reshapes primary and support activities and the sources of value.")
C("BT-12", "Environmental factors and sustainability", "BT A8",
  "Environmental impact, sustainable practice and the reporting expectations that follow.")
C("BT-13", "Competitive forces and competitive advantage", "BT A9",
  "The five competitive forces and the generic strategies available in response.", prereq=["BT-09"])
C("BT-14", "PESTEL as an integrating framework", "BT A3-A9",
  "Assembling political, economic, social, technological, environmental and legal factors into one external analysis.",
  prereq=["BT-05", "BT-07", "BT-10", "BT-11", "BT-12"], integ=["BT-13"])

# B. Business organisational structure, functions and governance
C("BT-15", "Formal and informal organisation", "BT B1",
  "The official structure versus the real network of relationships that operates alongside it.")
C("BT-16", "Organisational structure and design", "BT B2",
  "Functional, divisional, geographic, matrix and boundaryless structures and when each fits.", prereq=["BT-15"])
C("BT-17", "Mintzberg's building blocks and coordinating mechanisms", "BT B2",
  "The five parts of the organisation and how work is coordinated between them.", prereq=["BT-16"])
C("BT-18", "Centralisation, decentralisation and span of control", "BT B2",
  "Where decisions sit, how tall or flat the hierarchy runs, and the trade-offs of each.", prereq=["BT-16"])
C("BT-19", "Organisational culture", "BT B3",
  "Shared values and assumptions, and why culture constrains what structure can achieve.")
C("BT-20", "Culture models — Handy, Schein, Hofstede", "BT B3",
  "The named typologies used to describe and compare cultures.", prereq=["BT-19"])
C("BT-21", "Committees in business organisations", "BT B4",
  "Types of committee, their purpose, and the strengths and weaknesses of committee decision making.")
C("BT-22", "Corporate governance principles", "BT B5",
  "The agency problem, the separation of ownership from control, and the principles that answer it.", prereq=["BT-03"])
C("BT-23", "Board structure and non-executive directors", "BT B5",
  "Board composition, the role of NEDs, and the standing committees of the board.", prereq=["BT-22"], integ=["BT-21"])
C("BT-24", "Corporate social responsibility", "BT B5",
  "Responsibility beyond shareholders, and how CSR positions are argued and criticised.", prereq=["BT-22"], integ=["BT-12"])

# C. Accounting and reporting systems, compliance, control, technology and security
C("BT-25", "Accounting's relationship with other business functions", "BT C1",
  "How finance interlocks with operations, marketing, HR and IT.")
C("BT-26", "The accounting and finance function", "BT C2",
  "Financial accounting, management accounting, treasury and internal audit as distinct roles.", prereq=["BT-25"])
C("BT-27", "Financial versus management accounting", "BT C2",
  "External reporting to fixed rules versus internal reporting shaped to the decision.", prereq=["BT-26"])
C("BT-28", "Law and regulation governing accounting and audit", "BT C3",
  "Company law, accounting standards and the audit requirement in outline.")
C("BT-29", "Internal and external audit", "BT C3",
  "Who each auditor serves, what each examines, and how the two differ in independence and scope.", prereq=["BT-28"])
C("BT-30", "Sources and purpose of financial information", "BT C4",
  "What information the business produces, for whom, and to what end.", prereq=["BT-27"])
C("BT-31", "Financial systems, procedures and IT applications", "BT C5",
  "The transaction cycles and the systems that record them.", prereq=["BT-30"])
C("BT-32", "Internal control systems and their limitations", "BT C6",
  "Control objectives, control types, and why no control system is absolute.", prereq=["BT-31"])
C("BT-33", "Authorisation, data security and compliance", "BT C6",
  "Access control, segregation of duties, and safeguarding data.", prereq=["BT-32"])
C("BT-34", "Fraud, fraud risk and prevention", "BT C7",
  "The conditions that make fraud possible and the controls that reduce them.", prereq=["BT-32"])
C("BT-35", "Money laundering", "BT C7",
  "The stages of laundering, the offences, and the reporting duties placed on accountants.", prereq=["BT-34"])
C("BT-36", "Financial technology and its impact on accounting", "BT C8",
  "Automation, cloud systems, big data, AI and distributed ledgers as they touch the finance function.",
  prereq=["BT-31"], integ=["BT-11"])

# D. Leadership, management and people
C("BT-37", "Leadership, management and supervision", "BT D1",
  "The distinction between leading, managing and supervising work.")
C("BT-38", "Management theory — Fayol, Mintzberg, Drucker", "BT D1",
  "The classical functions, the observed managerial roles, and management by objectives.", prereq=["BT-37"])
C("BT-39", "Leadership styles and contingency approaches", "BT D1",
  "Blake and Mouton's grid, Bennis, Heifetz, and situational fit.", prereq=["BT-37"])
C("BT-40", "Recruitment and selection", "BT D2",
  "Job analysis through to selection method, and the validity of each method.")
C("BT-41", "Diversity and equal opportunities", "BT D2",
  "The difference between equal opportunity compliance and managing diversity.", prereq=["BT-40"])
C("BT-42", "Individual and group behaviour", "BT D3",
  "Personality, perception and role, and how behaviour changes inside a group.")
C("BT-43", "Team formation and Belbin roles", "BT D4",
  "What makes a team rather than a group, and the roles a balanced team needs.", prereq=["BT-42"])
C("BT-44", "Team development — Tuckman", "BT D4",
  "Forming, storming, norming, performing and dorming as a predictable sequence.", prereq=["BT-43"])
C("BT-45", "Motivation theories — Maslow, Herzberg, Vroom", "BT D5",
  "Content and process theories of what makes people work.", prereq=["BT-42"])
C("BT-46", "Reward and incentive systems", "BT D5",
  "Pay structures and incentives, and how they interact with motivation theory.", prereq=["BT-45"])
C("BT-47", "Learning and training at work", "BT D6",
  "Training needs analysis, methods of development, and evaluating training.")
C("BT-48", "Learning styles — Kolb, Honey and Mumford", "BT D6",
  "The learning cycle and the four learner preferences.", prereq=["BT-47"])
C("BT-49", "Performance appraisal", "BT D7",
  "The purposes of appraisal, the process, and the barriers to it working.", prereq=["BT-47"])

# E. Personal effectiveness and communication
C("BT-50", "Personal effectiveness and time management", "BT E1",
  "Planning, prioritising and organising one's own work.")
C("BT-51", "Consequences of ineffectiveness at work", "BT E2",
  "How individual ineffectiveness propagates into team and organisational failure.", prereq=["BT-50"])
C("BT-52", "Competence frameworks and continuing development", "BT E3",
  "Defining competence, identifying gaps, and the CPD obligation.", prereq=["BT-50"])
C("BT-53", "Conflict sources and resolution", "BT E4",
  "Where workplace conflict originates and the techniques for resolving or referring it.", prereq=["BT-42"])
C("BT-54", "Communicating in business", "BT E5",
  "The communication process, channel choice, and the barriers that distort a message.")

# F. Professional ethics
C("BT-55", "Fundamental principles of ethical behaviour", "BT F1",
  "Integrity, objectivity, professional competence and due care, confidentiality, professional behaviour.")
C("BT-56", "Rules-based and principles-based approaches", "BT F1",
  "Why the profession codifies principles rather than an exhaustive rulebook.", prereq=["BT-55"])
C("BT-57", "Regulatory and professional bodies", "BT F2",
  "Who sets and enforces professional standards, and the public interest duty behind them.", prereq=["BT-28"])
C("BT-58", "Corporate codes of ethics", "BT F3",
  "What an organisational code contains and how it differs from the professional code.", prereq=["BT-55"])
C("BT-59", "Ethical threats and safeguards", "BT F4",
  "Self-interest, self-review, advocacy, familiarity and intimidation, and the safeguards against each.", prereq=["BT-55"])
C("BT-60", "Resolving ethical conflicts and dilemmas", "BT F4",
  "The escalation route when principles collide, up to and including withdrawal.", prereq=["BT-59"], integ=["BT-35"])


# ============================================================
# MA — Management Accounting (areas A-F)
# ============================================================

# A. The nature, source and purpose of management information
C("MA-01", "Purpose of management accounting information", "MA A1",
  "Information produced to plan, control and decide inside the business.", prereq=["BT-27"])
C("MA-02", "Financial, management and cost accounting compared", "MA A1",
  "Three uses of the same underlying data, distinguished by audience and rules.", prereq=["MA-01"])
C("MA-03", "The planning, control and decision-making cycle", "MA A1",
  "Set objectives, plan, act, measure, compare, correct — the loop management accounting serves.", prereq=["MA-01"])
C("MA-04", "Data, information and the qualities of good information", "MA A2",
  "What raises raw data into information a manager can act on.")
C("MA-05", "Sources of data — internal and external", "MA A2",
  "Where management information comes from and the limits of each source.", prereq=["MA-04"])
C("MA-06", "Cost classification by nature, function and traceability", "MA A3",
  "Direct and indirect, product and period, materials, labour and overhead.")
C("MA-07", "Cost behaviour — fixed, variable, semi-variable, stepped", "MA A3",
  "How cost responds to changes in activity, and the relevant range assumption.", prereq=["MA-06"])
C("MA-08", "Cost units, cost centres, profit and investment centres", "MA A3",
  "The responsibility structure that costs and revenues are collected against.", prereq=["MA-06"], integ=["BT-18"])
C("MA-09", "Presenting management information", "MA A4",
  "Tables, charts and report formats chosen to fit the decision and the reader.", prereq=["MA-04"])

# B. Data analysis and statistical techniques
C("MA-10", "Sampling methods", "MA B1",
  "Random, systematic, stratified, multistage, cluster and quota sampling and their biases.")
C("MA-11", "The high-low method", "MA B2",
  "Splitting a semi-variable cost into its fixed and variable elements from two activity levels.", prereq=["MA-07"])
C("MA-12", "Correlation and linear regression", "MA B2",
  "Fitting and interpreting a cost or sales line, and what the correlation coefficient does and does not prove.",
  prereq=["MA-11"])
C("MA-13", "Time series analysis and seasonal variation", "MA B2",
  "Trend, seasonal, cyclical and random components, and additive versus multiplicative models.", prereq=["MA-12"])
C("MA-14", "Index numbers", "MA B2",
  "Restating money amounts to a common base to compare across time.")
C("MA-15", "Expected values and probability", "MA B2",
  "Weighting outcomes by likelihood, and the limitations of a single expected figure.",
  grows=["PM-S10"])
C("MA-16", "Averages and measures of dispersion", "MA B3",
  "Mean, median, mode, range, standard deviation and what spread adds to an average.")
C("MA-17", "The normal distribution", "MA B3",
  "Using a standardised distribution to attach probability to a range of outcomes.", prereq=["MA-16"])
C("MA-18", "Spreadsheets in management accounting", "MA B4",
  "Structure, formulae, and the control weaknesses spreadsheets introduce.", integ=["BT-36"])

# C. Cost accounting techniques
C("MA-19", "Accounting for materials — ordering and holding", "MA C1",
  "Reorder levels, economic order quantity and economic batch quantity.", prereq=["MA-06"])
C("MA-20", "Inventory valuation — FIFO and AVCO", "MA C1",
  "Costing issues out of store, and the effect of method choice on profit.", prereq=["MA-19"], integ=["FA-21"])
C("MA-21", "Accounting for labour", "MA C1",
  "Remuneration methods, direct versus indirect labour, idle time and overtime.", prereq=["MA-06"])
C("MA-22", "Labour turnover and efficiency ratios", "MA C1",
  "Measuring the workforce: turnover, capacity, efficiency and production volume ratios.", prereq=["MA-21"])
C("MA-23", "Overhead allocation and apportionment", "MA C1",
  "Assigning indirect cost to cost centres, including reciprocal service departments.", prereq=["MA-06"])
C("MA-24", "Overhead absorption rates", "MA C1",
  "Building a predetermined rate and charging overhead to units.", prereq=["MA-23"])
C("MA-25", "Over- and under-absorption of overhead", "MA C1",
  "Why absorbed overhead differs from actual, and how the difference is treated.", prereq=["MA-24"])
C("MA-26", "Absorption costing", "MA C2",
  "Full product cost including a share of fixed production overhead.", prereq=["MA-24"])
C("MA-27", "Marginal costing and contribution", "MA C2",
  "Variable cost as the decision cost, and contribution as the measure that follows.",
  prereq=["MA-07"], grows=["PM-S06", "PM-S07"])
C("MA-28", "Reconciling absorption and marginal costing profit", "MA C2",
  "Why the two methods report different profit, and how inventory movement explains the gap.",
  prereq=["MA-26", "MA-27"])
C("MA-29", "Job and batch costing", "MA C3",
  "Costing discrete, identifiable units of work.", prereq=["MA-26"])
C("MA-30", "Process costing — normal and abnormal losses", "MA C3",
  "Continuous production, expected loss, scrap value, and abnormal loss or gain.", prereq=["MA-26"])
C("MA-31", "Process costing — equivalent units and work in progress", "MA C3",
  "Valuing partly complete output under weighted average and FIFO.", prereq=["MA-30"])
C("MA-32", "Joint products and by-products", "MA C3",
  "Splitting common cost at the separation point and treating incidental output.", prereq=["MA-30"])
C("MA-33", "Service costing", "MA C3",
  "Costing where there is no physical product, using composite cost units.", prereq=["MA-26"])
C("MA-34", "Activity based costing", "MA C4",
  "Driving overhead by activity rather than volume.", prereq=["MA-24"], grows=["PM-S01"])
C("MA-35", "Target costing", "MA C4",
  "Working backwards from market price and required margin to an allowable cost.",
  prereq=["MA-26"], grows=["PM-S02"])
C("MA-36", "Life-cycle costing", "MA C4",
  "Costing a product across its whole life rather than one period.", prereq=["MA-26"], grows=["PM-S03"])
C("MA-37", "Total quality management and cost of quality", "MA C4",
  "Prevention, appraisal, internal and external failure cost.", prereq=["MA-26"], grows=["PM-S04"])

# D. Budgeting
C("MA-38", "Purpose and stages of budgeting", "MA D1",
  "Planning, coordinating, communicating, motivating, controlling and evaluating.", prereq=["MA-03"])
C("MA-39", "Budget committee, budget manual and responsibility", "MA D1",
  "Who owns which budget and how the process is administered.", prereq=["MA-38"], integ=["MA-08"])
C("MA-40", "Functional budgets and the master budget", "MA D2",
  "Sales, production, materials, labour and overhead budgets assembling into the master budget.", prereq=["MA-38"])
C("MA-41", "Cash budgets", "MA D2",
  "Timing receipts and payments, and reading the resulting cash position.",
  prereq=["MA-40"], grows=["FM-S02"], integ=["FA-51"])
C("MA-42", "The principal budget factor", "MA D2",
  "Identifying the constraint that the whole budget must be built around.", prereq=["MA-40"], grows=["PM-S08"])
C("MA-43", "Flexible budgets", "MA D3",
  "Restating the budget at actual activity so the comparison is fair.", prereq=["MA-07", "MA-40"])
C("MA-44", "Fixed, flexed and actual comparison", "MA D3",
  "The three-column control report and what each variance column means.", prereq=["MA-43"])
C("MA-45", "Time value of money and discounting", "MA D4",
  "Why a shilling today outranks a shilling next year, and how discount factors express it.")
C("MA-46", "Net present value", "MA D4",
  "Discounting a project's cash flows to a single accept-or-reject figure.",
  prereq=["MA-45"], grows=["FM-S01"])
C("MA-47", "Internal rate of return", "MA D4",
  "The discount rate at which a project breaks even, and interpolation to find it.",
  prereq=["MA-46"], grows=["FM-S01"])
C("MA-48", "Payback period", "MA D4",
  "How fast the outlay returns, and why speed alone is an incomplete test.", prereq=["MA-45"])
C("MA-49", "Annuities and perpetuities", "MA D4",
  "Shortcuts for level cash flow streams, including delayed starts.", prereq=["MA-45"])
C("MA-50", "Budgetary control and variance reporting", "MA D5",
  "Comparing outcome to plan and reporting the difference to the responsible manager.",
  prereq=["MA-44"], grows=["PM-S11"])
C("MA-51", "Behavioural aspects of budgeting", "MA D6",
  "Participation, budget slack, targets and the dysfunctional behaviour budgets can cause.",
  prereq=["MA-50"], integ=["BT-45"])

# E. Standard costing
C("MA-52", "Standard costing systems and setting standards", "MA E1",
  "Building the standard cost card, and ideal, attainable, current and basic standards.", prereq=["MA-26"])
C("MA-53", "Material variances", "MA E2",
  "Price and usage variances, and the causes behind each.", prereq=["MA-52"], grows=["PM-S12"])
C("MA-54", "Labour variances", "MA E2",
  "Rate, efficiency and idle time variances.", prereq=["MA-52"], grows=["PM-S12"])
C("MA-55", "Variable overhead variances", "MA E2",
  "Expenditure and efficiency variances on variable overhead.", prereq=["MA-52"])
C("MA-56", "Fixed overhead variances", "MA E2",
  "Expenditure, and under absorption costing, volume, capacity and efficiency variances.",
  prereq=["MA-52", "MA-25"])
C("MA-57", "Sales variances", "MA E2",
  "Sales price and sales volume variances under both costing methods.", prereq=["MA-52"], grows=["PM-S12"])
C("MA-58", "Operating statements and profit reconciliation", "MA E3",
  "Reconciling budgeted to actual profit through the variance line.",
  prereq=["MA-53", "MA-54", "MA-55", "MA-56", "MA-57"])
C("MA-59", "Interpreting and interrelating variances", "MA E3",
  "Reading variances as evidence about decisions, including where one variance causes another.",
  prereq=["MA-58"], grows=["PM-S12"])

# F. Performance measurement
C("MA-60", "Purpose of performance measurement", "MA F1",
  "What measurement is for, and the mission-to-measure chain.", prereq=["MA-03"], grows=["PM-S14"])
C("MA-61", "Financial performance indicators", "MA F2",
  "Profitability, liquidity, activity and gearing measures.", prereq=["MA-60"], integ=["FA-62", "FA-63"])
C("MA-62", "Non-financial indicators and the balanced scorecard", "MA F2",
  "Measuring what money does not capture, across four perspectives.", prereq=["MA-60"], grows=["PM-S14"])
C("MA-63", "Divisional performance — ROI and residual income", "MA F2",
  "Measuring a division as an investment centre, and the distortions each measure creates.",
  prereq=["MA-61", "MA-08"], grows=["PM-S13"])
C("MA-64", "Performance in manufacturing and service contexts", "MA F2",
  "Productivity, quality, and the extra difficulty of measuring intangible service output.", prereq=["MA-60"])
C("MA-65", "Cost reduction and value enhancement", "MA F3",
  "Value analysis and cost reduction distinguished from indiscriminate cost cutting.", prereq=["MA-60"])
C("MA-66", "Monitoring, reporting and benchmarking", "MA F4",
  "Reporting performance onward, and comparing against internal and external benchmarks.",
  prereq=["MA-60"], integ=["MA-09"])


# ============================================================
# FA — Financial Accounting (areas A-H)
# ============================================================

# A. The context and purpose of financial reporting
C("FA-01", "Purpose and scope of financial statements", "FA A1",
  "What the financial statements are for, and the stewardship and decision-usefulness objectives.",
  prereq=["BT-27"], grows=["FR-S11"])
C("FA-02", "Types of business entity for reporting", "FA A1",
  "Sole trader, partnership and limited company in outline, and the reporting consequence of each. (Detailed partnership accounting is outside the FA syllabus.)",
  prereq=["FA-01"], integ=["BT-01"])
C("FA-03", "Users and their information needs", "FA A2",
  "Who reads the statements and what each reader is trying to decide.", prereq=["FA-01"], integ=["BT-03"])
C("FA-04", "The elements — assets, liabilities, equity, income, expenses", "FA A3",
  "The five definitions everything else in the syllabus is built from.", prereq=["FA-01"], grows=["FR-S11"])
C("FA-05", "The accounting equation", "FA A3",
  "Assets equal liabilities plus equity, and why it never breaks.", prereq=["FA-04"])
C("FA-06", "The regulatory framework and standard setting", "FA A4",
  "IFRS Foundation, the Board, the standard-setting process and the role of the framework.",
  prereq=["FA-01"], grows=["FR-S11"], integ=["BT-28"])
C("FA-07", "Duties of those charged with governance", "FA A5",
  "Directors' responsibility for the financial statements and for the systems behind them.",
  prereq=["FA-06"], integ=["BT-22"])

# B. The qualitative characteristics of financial information
C("FA-08", "Fundamental qualitative characteristics", "FA B1",
  "Relevance and faithful representation, and why only these two are fundamental.",
  prereq=["FA-04"], grows=["FR-S11"])
C("FA-09", "Enhancing qualitative characteristics", "FA B1",
  "Comparability, verifiability, timeliness and understandability as improvers, not qualifiers.", prereq=["FA-08"])
C("FA-10", "Underlying assumptions — accruals and going concern", "FA B1",
  "The two assumptions the statements are prepared under, distinct from the characteristics.", prereq=["FA-08"])

# C. The use of double-entry and accounting systems
C("FA-11", "Duality and the double-entry principle", "FA C1",
  "Every transaction has two effects, and debits equal credits as a consequence of the equation.", prereq=["FA-05"])
C("FA-12", "Source documents and the audit trail", "FA C1",
  "Invoices, credit notes, remittances and the evidence chain behind every entry.",
  prereq=["FA-11"], integ=["BT-31"])
C("FA-13", "Books of prime entry", "FA C2",
  "Day books, cash book and petty cash book as the first record before the ledger.", prereq=["FA-12"])
C("FA-14", "Ledger accounts and the nominal ledger", "FA C2",
  "T-accounts, posting, balancing off, and the ledger's place in the system.", prereq=["FA-13"])
C("FA-15", "Journals and their use", "FA C2",
  "The journal as the entry route for anything not passing through a day book.", prereq=["FA-14"])

# D. Recording transactions and events
C("FA-16", "Recording sales and purchases", "FA D1",
  "Credit and cash sales and purchases through prime entry to the ledger.", prereq=["FA-14"], grows=["FR-S04"])
C("FA-17", "Sales tax", "FA D1",
  "Input and output tax, the sales tax control account, and irrecoverable tax.", prereq=["FA-16"])
C("FA-18", "Discounts — trade and settlement", "FA D1",
  "How each discount type is recorded and why the treatment differs.", prereq=["FA-16"])
C("FA-19", "Cash and bank transactions", "FA D2",
  "Recording receipts and payments through the cash book.", prereq=["FA-13"])
C("FA-20", "Petty cash and the imprest system", "FA D2",
  "Running and restoring a petty cash float.", prereq=["FA-19"])
C("FA-21", "Inventory recognition and valuation", "FA D3",
  "What inventory is, and FIFO and average cost as valuation methods.",
  prereq=["FA-16"], grows=["FR-S15"], integ=["MA-20"])
C("FA-22", "Cost and net realisable value", "FA D3",
  "The lower-of rule, applied item by item.", prereq=["FA-21"], grows=["FR-S15"])
C("FA-23", "Inventory, cost of sales and the closing adjustment", "FA D3",
  "How opening and closing inventory build cost of sales in the ledger.", prereq=["FA-22"])
C("FA-24", "Tangible non-current assets — recognition and cost", "FA D4",
  "What qualifies as PPE and which costs enter its carrying amount.", prereq=["FA-04"],
  grows=["FR-S01", "FR-S13"])
C("FA-25", "Capital and revenue expenditure", "FA D4",
  "The classification decision that determines whether a cost hits the asset or the profit.", prereq=["FA-24"])
C("FA-26", "Depreciation methods and the annual charge", "FA D5",
  "Straight line, reducing balance, useful life, residual value, and the accruals logic behind depreciation.",
  prereq=["FA-25", "FA-10"], grows=["FR-S01", "FR-S02"])
C("FA-27", "Disposals and part-exchange", "FA D5",
  "Removing an asset and computing the profit or loss on disposal.", prereq=["FA-26"])
C("FA-28", "Revaluation of non-current assets", "FA D5",
  "Revaluing upward, the revaluation surplus, and the effect on subsequent depreciation.",
  prereq=["FA-26"], grows=["FR-S01"])
C("FA-29", "The non-current asset register", "FA D4",
  "The subsidiary record of assets and its reconciliation to the ledger.", prereq=["FA-26"])
C("FA-30", "Intangible assets and amortisation", "FA D6",
  "Recognition criteria for intangibles and the amortisation charge.", prereq=["FA-24"], grows=["FR-S12"])
C("FA-31", "Research and development expenditure", "FA D6",
  "Why research is expensed and development may be capitalised.", prereq=["FA-30"], grows=["FR-S12"])
C("FA-32", "Accruals and prepayments", "FA D7",
  "Matching expense and income to period rather than to cash movement.", prereq=["FA-10", "FA-14"])
C("FA-33", "Receivables, irrecoverable debts and allowances", "FA D8",
  "Writing off, allowing for doubt, and the movement in the allowance.", prereq=["FA-16"])
C("FA-34", "Payables and accrued liabilities", "FA D8",
  "Recording amounts owed to suppliers and other short-term creditors.", prereq=["FA-16"])
C("FA-35", "Provisions and contingencies", "FA D9",
  "When an obligation is recognised, disclosed, or ignored.", prereq=["FA-04"], grows=["FR-S09"])
C("FA-36", "Share capital, share premium and reserves", "FA D10",
  "Ordinary and preference shares, issues at a premium, bonus and rights issues.", prereq=["FA-05"],
  grows=["FR-S10", "FM-S04"])
C("FA-37", "Dividends", "FA D10",
  "When a dividend is recognised, and why proposed dividends are not liabilities.", prereq=["FA-36"])
C("FA-38", "Loans, debentures and finance costs", "FA D10",
  "Long-term borrowing, accrued interest, and the current/non-current split.",
  prereq=["FA-32"], grows=["FR-S16", "FM-S04"])

# E. Preparing a trial balance
C("FA-39", "The trial balance", "FA E1",
  "Extracting balances and proving that debits equal credits.", prereq=["FA-14"])
C("FA-40", "Errors not revealed by the trial balance", "FA E2",
  "Omission, commission, principle, original entry, reversal and compensating errors.", prereq=["FA-39"])
C("FA-41", "Correction of errors", "FA E2",
  "Journalising corrections and tracing their effect on profit.", prereq=["FA-40", "FA-15"])
C("FA-42", "Suspense accounts", "FA E5",
  "Holding a difference, then clearing it as errors are found.", prereq=["FA-41"])
C("FA-43", "Receivables ledger control account reconciliation", "FA E3",
  "Reconciling the control account to the sum of individual customer balances.", prereq=["FA-33"])
C("FA-44", "Payables ledger control account reconciliation", "FA E3",
  "Reconciling the control account to the supplier statements and individual balances.", prereq=["FA-34"])
C("FA-45", "Bank reconciliation", "FA E4",
  "Reconciling the cash book to the bank statement through timing differences and errors.",
  prereq=["FA-19"], integ=["BT-32"])

# F. Preparing basic financial statements
C("FA-46", "Statement of financial position preparation", "FA F1",
  "Assembling assets, liabilities and equity into the statement, correctly classified.",
  prereq=["FA-39", "FA-26", "FA-32", "FA-33"], grows=["FR-S17"])
C("FA-47", "Statement of profit or loss and other comprehensive income", "FA F2",
  "Building the performance statement from the trial balance and adjustments.",
  prereq=["FA-39", "FA-23", "FA-32"], grows=["FR-S17"])
C("FA-48", "Statement of changes in equity", "FA F2",
  "Reconciling opening to closing equity through profit, dividends, issues and revaluation.",
  prereq=["FA-47", "FA-36", "FA-28"])
C("FA-49", "Disclosure notes", "FA F3",
  "The supporting notes, and the non-current asset movements note in particular.", prereq=["FA-46"])
C("FA-50", "Events after the reporting period", "FA F4",
  "Adjusting and non-adjusting events, and the treatment each demands.", prereq=["FA-46"], grows=["FR-S09"])
C("FA-51", "Statement of cash flows — operating activities", "FA F5",
  "Reconciling profit to operating cash flow under the indirect method.",
  prereq=["FA-46", "FA-47"], grows=["FR-S07"])
C("FA-52", "Statement of cash flows — investing and financing", "FA F5",
  "Cash movements on assets, borrowings and equity, and the net change in cash.",
  prereq=["FA-51"], grows=["FR-S07"])
C("FA-53", "Incomplete records — margins and mark-ups", "FA F6",
  "Reconstructing missing figures from a known profit percentage.", prereq=["FA-23"])
C("FA-54", "Incomplete records — control account and equation techniques", "FA F6",
  "Deriving missing sales, purchases or drawings from the accounting equation and control accounts.",
  prereq=["FA-53", "FA-43", "FA-05"])

# G. Preparing simple consolidated financial statements
C("FA-55", "Group concepts — control, parent and subsidiary", "FA G1",
  "What control means and when consolidation is required.", prereq=["FA-46"], grows=["FR-S05"])
C("FA-56", "Goodwill on acquisition and non-controlling interest", "FA G1",
  "Computing goodwill and measuring the interest the parent does not own.",
  prereq=["FA-55"], grows=["FR-S05"])
C("FA-57", "Consolidated statement of financial position", "FA G1",
  "Adding across, cancelling the investment, and presenting group equity.",
  prereq=["FA-56"], grows=["FR-S05"])
C("FA-58", "Intra-group balances and unrealised profit", "FA G1",
  "Eliminating trading between group members and profit still sitting in inventory.",
  prereq=["FA-57", "FA-21"], grows=["FR-S05"])
C("FA-59", "Consolidated statement of profit or loss", "FA G1",
  "Consolidating performance and splitting profit between owners and the non-controlling interest.",
  prereq=["FA-58"], grows=["FR-S05"])
C("FA-60", "Associates and significant influence", "FA G2",
  "Identifying an associate and applying the equity method in outline.",
  prereq=["FA-59"], grows=["FR-S06"])

# H. Interpretation of financial statements
C("FA-61", "Purpose and limitations of analysis", "FA H1",
  "What ratio analysis can and cannot tell a user.", prereq=["FA-46", "FA-47"], grows=["FR-S08"])
C("FA-62", "Profitability ratios", "FA H2",
  "Margins, return on capital employed, and what drives each.", prereq=["FA-61"], grows=["FR-S08", "FM-S07"])
C("FA-63", "Liquidity and efficiency ratios", "FA H2",
  "Current and quick ratios, and the working capital cycle in days.",
  prereq=["FA-61"], grows=["FR-S08", "FM-S02"])
C("FA-64", "Gearing and investor ratios", "FA H2",
  "Capital structure, interest cover, and the ratios that speak to shareholders.",
  prereq=["FA-61", "FA-38"], grows=["FR-S08", "FM-S03"])
C("FA-65", "Interpreting ratios and drawing conclusions", "FA H3",
  "Turning computed ratios into a reasoned statement about the business.",
  prereq=["FA-62", "FA-63", "FA-64"], grows=["FR-S08"], integ=["MA-61"])


# ============================================================
# VALIDATION
# ============================================================

def validate(concepts):
    errors, warnings = [], []
    by_id = {c["id"]: c for c in concepts}

    if len(by_id) != len(concepts):
        errors.append("Duplicate concept ids present.")

    # Dangling edges
    for c in concepts:
        for field in ("prerequisites", "grows_into", "integrates_with"):
            for target in c[field]:
                if target not in by_id:
                    errors.append(f"{c['id']}: {field} points at missing node {target}")

    # Prerequisite edges must not point forward into Skills stubs
    for c in concepts:
        for target in c["prerequisites"]:
            if target in by_id and by_id[target]["stub"]:
                errors.append(f"{c['id']}: prerequisite {target} is a Skills stub")

    # Cycle detection on prerequisites
    colour = {}

    def visit(node, stack):
        colour[node] = "grey"
        for nxt in by_id[node]["prerequisites"]:
            if nxt not in by_id:
                continue
            if colour.get(nxt) == "grey":
                errors.append(f"Prerequisite cycle: {' -> '.join(stack + [node, nxt])}")
            elif colour.get(nxt) != "black":
                visit(nxt, stack + [node])
        colour[node] = "black"

    for c in concepts:
        if colour.get(c["id"]) != "black":
            visit(c["id"], [])

    # Every stub must be reachable by at least one grows_into edge
    landed = {t for c in concepts for t in c["grows_into"]}
    for c in concepts:
        if c["stub"] and c["id"] not in landed:
            warnings.append(f"Stub {c['id']} ({c['name']}) has no growth edge into it")

    # Syllabus sub-area coverage
    covered = defaultdict(set)
    for c in concepts:
        if not c["stub"]:
            covered[c["paper"]].add(c["outcome"])

    expected = {
        "BT": ["BT A1", "BT A2", "BT A3", "BT A4", "BT A5", "BT A6", "BT A7", "BT A8", "BT A9",
               "BT B1", "BT B2", "BT B3", "BT B4", "BT B5",
               "BT C1", "BT C2", "BT C3", "BT C4", "BT C5", "BT C6", "BT C7", "BT C8",
               "BT D1", "BT D2", "BT D3", "BT D4", "BT D5", "BT D6", "BT D7",
               "BT E1", "BT E2", "BT E3", "BT E4", "BT E5",
               "BT F1", "BT F2", "BT F3", "BT F4"],
        "MA": ["MA A1", "MA A2", "MA A3", "MA A4",
               "MA B1", "MA B2", "MA B3", "MA B4",
               "MA C1", "MA C2", "MA C3", "MA C4",
               "MA D1", "MA D2", "MA D3", "MA D4", "MA D5", "MA D6",
               "MA E1", "MA E2", "MA E3",
               "MA F1", "MA F2", "MA F3", "MA F4"],
        "FA": ["FA A1", "FA A2", "FA A3", "FA A4", "FA A5",
               "FA B1",
               "FA C1", "FA C2",
               "FA D1", "FA D2", "FA D3", "FA D4", "FA D5", "FA D6", "FA D7", "FA D8", "FA D9", "FA D10",
               "FA E1", "FA E2", "FA E3", "FA E4", "FA E5",
               "FA F1", "FA F2", "FA F3", "FA F4", "FA F5", "FA F6",
               "FA G1", "FA G2",
               "FA H1", "FA H2", "FA H3"],
    }

    gaps = {}
    for paper, subs in expected.items():
        missing = [s for s in subs if s not in covered[paper] and
                   not any(s in o for o in covered[paper])]
        if missing:
            gaps[paper] = missing
            errors.append(f"{paper}: sub-areas with no concept — {', '.join(missing)}")

    return errors, warnings, gaps, expected


# Invert prerequisites -> prerequisite_of
by_id = {c["id"]: c for c in CONCEPTS}
for c in CONCEPTS:
    for p in c["prerequisites"]:
        if p in by_id:
            by_id[p]["prerequisite_of"].append(c["id"])

errors, warnings, gaps, expected = validate(CONCEPTS)

live = [c for c in CONCEPTS if not c["stub"]]
stubs = [c for c in CONCEPTS if c["stub"]]

print("=" * 60)
print("PAPER TRAIL — CONCEPT GRAPH VALIDATION")
print("=" * 60)
for paper in ("BT", "MA", "FA"):
    n = len([c for c in live if c["paper"] == paper])
    print(f"  {paper}: {n} concepts, {len(expected[paper])} syllabus sub-areas")
print(f"  Live concepts total : {len(live)}")
print(f"  Stub landing nodes  : {len(stubs)} (FR {len(FR_STUBS)}, PM {len(PM_STUBS)}, FM {len(FM_STUBS)})")
edges = sum(len(c["prerequisites"]) + len(c["grows_into"]) + len(c["integrates_with"]) for c in CONCEPTS)
print(f"  Edges               : {edges}")
print()
print(f"ERRORS   : {len(errors)}")
for e in errors:
    print("   -", e)
print(f"WARNINGS : {len(warnings)}")
for w in warnings:
    print("   -", w)

import os
_out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "concepts.json")
with open(_out, "w") as f:
    json.dump({
        "schema_version": "1.0",
        "spec": "Paper Trail Learning System Specification v1.0, Section 3",
        "built": "2026-07-28",
        "counts": {
            "live": len(live),
            "stubs": len(stubs),
            "edges": edges,
        },
        "concepts": CONCEPTS,
    }, f, indent=2)

print("\nWrote " + _out)
