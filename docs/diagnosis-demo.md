# Diagnosis engine — ten worked cases

Read this to sanity-check the *judgement*, not the test count. Each case: the question, the wrong answer chosen, the cause diagnosed, the confidence, and the repair queued.

---

### 1. High-low method (MA) — arithmetic slip
**Q.** A bakery's electricity was KES 32,000 at 900 trays and KES 24,000 at 500 trays. Variable cost per tray?
- A) KES 20 (correct)
- B) KES 16   ← **chosen (wrong)**
- C) KES 35.60
- D) KES 8

- **Diagnosis: calculation error** (confidence 0.9, from the tagged wrong answer).
- **Repair queued:** parameterized calculation drill set for that operation.

---

### 2. Depreciation entry (FA) — wrong debits/credits
**Q.** Annual depreciation on the fridge is KES 6,000. Which journal is correct?
- A) Dr Depreciation expense, Cr Accumulated depreciation (correct)
- B) Dr Accumulated depreciation, Cr Depreciation expense   ← **chosen (wrong)**
- C) Dr Fridge (cost), Cr Bank
- D) Dr Depreciation expense, Cr Bank

- **Diagnosis: incorrect treatment** (confidence 0.9, from the tagged wrong answer).
- **Repair queued:** rule card; treatment-choice items.

---

### 3. Depreciation (FA) — answered the wrong question
**Q.** Fridge cost 40,000, residual 4,000, life 6 years, straight-line, now 2 years old. Its CARRYING AMOUNT?
- A) KES 28,000 (correct)
- B) KES 6,000   ← **chosen (wrong)**
- C) KES 12,000
- D) KES 40,000

- **Diagnosis: requirement misread** (confidence 0.9, from the tagged wrong answer).
- **Repair queued:** requirement-parsing pack — command verbs and what they demand.

---

### 4. Lower of cost and NRV (FA) — untyped item, first checkpoint
**Q.** Inventory is valued at the lower of cost and ______?
- A) net realisable value (correct)
- B) selling price   ← **chosen (wrong)**
- C) replacement cost
- D) market value

- **Diagnosis: knowledge gap** (confidence 0.6, from the pattern in the attempt history).
- **Repair queued:** reopen the lesson section; re-run the Understood check.

---

### 5. Quick ratio (FA) — untyped, but the history speaks
**Q.** Current assets 300,000 (incl. inventory 120,000), current liabilities 150,000. Quick ratio?
- A) 1.2 (correct)
- B) 2.0   ← **chosen (wrong)**
- C) 0.8
- D) 1.5

- **Diagnosis: conceptual misunderstanding** (confidence 0.6, from the pattern in the attempt history).
- **Repair queued:** contrast mini-lesson; paired discrimination items.

---

### 6. Mixed pack (FA) — right alone, wrong when interleaved
**Q.** A mixed pack combines a disposal, a depreciation charge and a ratio in one scenario.
- A) correct combined answer
- B) used carrying amount from the wrong year   ← **chosen (wrong)**
- C) …
- D) …

- **Diagnosis: transfer failure** (confidence 0.6, from the pattern in the attempt history).
- **Repair queued:** mixed-context set for the concept.

---

### 7. Stakeholders (BT) — fine untimed, wrong on the clock
**Q.** Place KRA on Mendelow’s matrix (timed section).
- A) key player (correct)
- B) keep informed   ← **chosen (wrong)**
- C) keep satisfied
- D) minimal effort

- **Diagnosis: careless slip** (confidence 0.6, from the pattern in the attempt history).
- **Repair queued:** no content remediation; pacing flag; a variant resurfaces within 48 hours.

---

### 8. High-low (MA) — fast and wrong on a mastered-ish concept
**Q.** Quick high-low split (learner is at Competent on this concept).
- A) correct
- B) flipped the subtraction   ← **chosen (wrong)**
- C) …
- D) …

- **Diagnosis: careless slip** (confidence 0.6, from the pattern in the attempt history).
- **Repair queued:** no content remediation; pacing flag; a variant resurfaces within 48 hours.

---

### 9. CONFLICT → micro-probe → resolves (FA NRV)
**Q.** Concept-check on NRV, with a wrong option that looks like an arithmetic slip.
- A) net realisable value (correct)
- B) a mis-added figure   ← **chosen (wrong)**
- C) …
- D) …

- Layers **disagree/are silent** — provisional call: *conceptual misunderstanding* (confidence 0.3, no confident signal → safe default).
- **Micro-probe fires** (one follow-up) to decide between: calculation error  vs  knowledge gap.
- Probe resolves → **knowledge gap** (confidence 0.8, via a one-question micro-probe).
- **Repair queued:** reopen the lesson section; re-run the Understood check.

---

### 10. CONFLICT → micro-probe → inconclusive → conceptual-plus-practice (FA depreciation)
**Q.** Standard depreciation item; wrong option is a treatment error, but the learner was fine at Guided.
- A) correct
- B) reversed the entry   ← **chosen (wrong)**
- C) …
- D) …

- Layers **disagree/are silent** — provisional call: *conceptual misunderstanding* (confidence 0.3, no confident signal → safe default).
- **Micro-probe fires** (one follow-up) to decide between: incorrect treatment  vs  conceptual misunderstanding.
- Probe **inconclusive** → falls back to **conceptual misunderstanding + practice** (confidence 0.3) — a safe default, not a guess.
- **Repair queued:** contrast mini-lesson; paired discrimination items.

