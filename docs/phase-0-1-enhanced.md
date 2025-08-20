# 📦 خطة تنفيذ الخوارزمية  Phase 0 + Phase 1

# Phase 0 – Project Setup 

**الهدف:** تجهيز المشروع بجميع المعلومات الحرجة قبل البدء: من تعريف المشكلة إلى سياسات الأمان والقياس ومن يملك القرار.

## 0.0 - Metadata

* **Project name:**
* **Repository:**
* **Owner / Sponsor:**
* **Start date:**
* **Target release (MVP):**

## 0.1 - Problem Statement

* **ما المشكلة؟**
* **لماذا الآن؟**
* **من سيستفيد؟ (وصف موجز للفئة المستهدفة)**

## 0.2 - Value Proposition

* جملة واحدة تشرح القيمة للمستخدم (طفل 10 سنوات).

## 0.3 - Success Metrics (KPIs) — Template

* **KPI‑1 (Usage):** %DAU/MAU أو عدد المستخدمين النشطين خلال 7 أيام.
* **KPI‑2 (Performance):** median API latency ≤ 200 ms.
* **KPI‑3 (Reliability):** SLO مثال: 99.9% availability per 30 days.
* **KPI‑4 (Business):** conversion rate أو retention.

> **ملاحظة:** أضف قيماً عددية واضحة لكل KPI حسب المنتج.

## 0.4 - Roles & RACI (اساس القرار)

| Role                  | مثال (اسم/وظيفة) | RACI: Responsible / Accountable / Consulted / Informed |
| --------------------- | ---------------- | ------------------------------------------------------ |
| Product Owner (PO)    | اسم/Role         | A (يوقّع على Vision وScope)                            |
| Tech Lead / Architect | اسم/Role         | A/R (يقرر التصميم والـ DoD التقنية)                    |
| Developer(s)          | فرِيق التطوير    | R (ينفّذ الـ tasks)                                    |
| QA / Tester           | اسم/Role         | R (اختبارات + قبول قصص)                                |
| DevOps / SRE          | اسم/Role         | C/R (CI/CD, monitoring, SLOs)                          |
| Security Reviewer     | اسم/Role         | C (تفحّص الأمن، approve security gates)                |
| UX / Designer         | اسم/Role         | C (تصميم وAccessibility)                               |
| Stakeholder / PM      | اسم/Role         | I (مُطّلع على التقدّم)                                 |

**قواعد:**

* أي تغيّر على الـ DoD أو SLO يجب أن يوافق عليه PO + Tech Lead + SRE.
* تغييرات النطاق الكبيرة (≥ 20% effort) تحتاج Sign‑off من Sponsor.

## 0.5 - Prioritization (مصفوفة قرار سريعة)

### RICE (Recommended)

* **Reach (R):** عدد المستخدمين المتأثرين خلال فترة.
* **Impact (I):** (3 = كبير، 2 = متوسط، 1 = صغير).
* **Confidence (C):** % الثقة في التقدير.
* **Effort (E):** شخص‑أسبوع.

**RICE score = (R * I * C) / E**

### Betting table (إذا تفضّل Shape‑Up style)

| Bet    | Owner (who bets) | Scope summary         | Appetite (timebox) | Confidence | Decision (Yes/No) |
| ------ | ---------------- | --------------------- | ------------------ | ---------- | ----------------- |
| Bet‑01 | PO               | Feature X short pitch | 2 weeks            | High       | ✅                 |

> استخدم RICE للعناصر الكثيرة والمجدوَلة، واستخدم Betting table للـ big bets خلال cycle.

## 0.6 - Security & Privacy Quick‑Check (DoR must‑have)

**اجب نعم/لا وعلّم مَن يتحمّل تنفيذ النقطة إذا لا.**

* هل حُددت حساسية البيانات (PII)؟
* هل قائمة dependencies محدثة ومسحوبة عبر SCA (Dependabot / Snyk)؟
* هل توجد متطلبات تشفير (at‑rest / in‑transit)؟
* هل هناك خطة لاختبار الاختراق (pen‑test) قبل الإصدار العام؟
* هل تم تضمين OWASP Top‑10 كـ acceptance gate للـ Web/API؟

> ضع إجراءات تصحيح (mitigations) لكل عنصر "No".

## 0.7 - Data Retention & Privacy

* **Retention policy:** مثال: سجلات المستخدمين: 2 سنة؛ سجلات الاستخدام: 90 يوم.
* **Privacy notes:** هل البيانات ستُخزن خارج المنطقة؟ هل تحتاج توافق GDPR / local law؟

## 0.8 - Risk Register (موجز)

| Risk                    | Impact (1‑5) | Likelihood (1‑5) | Owner | Mitigation                    |
| ----------------------- | ------------ | ---------------- | ----- | ----------------------------- |
| Missing SSO requirement | 4            | 3                | PO    | تحديد requirement قبل Phase‑2 |

## 0.9 - Time‑Box (اقتراح)

* إعداد Phase‑0: **30–45 دقيقة** (جلسة سريعة مع PO + Tech Lead).

## 0.10 - Definition of Ready (DoR) — Phase‑0

* ✅ Problem statement مكتوبة.
* ✅ RACI مع أسماء مذكورة أو roles مغطّاة.
* ✅ أهم KPIs محددة.
* ✅ Security quick‑check: جميع البنود الحرجة إما Yes أو Mitigation مذكور.
* ✅ Prioritization method مُحددة (RICE / Betting).

---

# Phase 1 – Idea Autopsy 

**الهدف:** تحويل الفكرة إلى مواصفات قابلة للتنفيذ: Vision قصيرة، Sketch، Component Inventory، Interaction matrix، Accessibility & Acceptance criteria، وTraceability إلى Phase‑2 (Data).

## 1.0 - Vision (1‑sentence)

*اكتب الجملة التي تشرح المشروع لطفل 10 سنوات.*

**Example:** "تطبيق يساعدك تحفظ مصاريفك وتعرف تصرفاتك الشهرية".

## 1.1 - One‑pager / Pitch (Template)

* **Problem:**
* **Solution:**
* **Key metrics:**
* **MVP scope (3 top features):**
* **Risks & Assumptions:**
* **Stakeholders & approvers:**

## 1.2 - Interface Sketch (guidelines)

* إرفاق صورة `designs/01-home-screen.png` أو رابط Figma.
* Designer: اضف نسخة Export (PNG / SVG) مع أسماء الطبقات المهمة.

## 1.3 - Component Inventory (مُنظّم)

| id   | Component  | Type   | Purpose         | State (Design/Dev) |
| ---- | ---------- | ------ | --------------- | ------------------ |
| C‑01 | Add Button | Button | فتح Modal إضافة | Design ready       |

## 1.4 - Interaction Matrix (قابل للنسخ)

| Component  | Action | Expected Result | Error states     | Owner  |
| ---------- | ------ | --------------- | ---------------- | ------ |
| Add Button | Click  | Show Add Modal  | Validation error | Dev/QA |

## 1.5 - Accessibility & Internationalization (a11y / i18n)

* هل تم تحديد RTL support (إذا مطلوب)؟
* هل تحققت من contrast ratios > 4.5:1 للـ body text؟
* هل الحقول لديها aria‑labels والوصف الصحيح؟

## 1.6 - Acceptance Criteria (DoD entry for stories)

* لكل User Story: صيغة Gherkin قصيرة + Definition of Done.

**Template example (Gherkin)**

```gherkin
Feature: Add expense
  Scenario: Successful addition
    Given user opens Add modal
    When user fills valid data
    Then expense appears in list and success toast shown
```

## 1.7 - Traceability (linking)

* Link كل عنصر (Component, Story) إلى ملف في `docs/` وIssue in repo (مثال: `#45`).

## 1.8 - Prioritization (apply RICE quickly)

* عيّن قيم R/I/C/E لكل ميزة MVP، احسب RICE، رتب.

## 1.9 - Security / Privacy notes (for Feature)

* أي Feature تتعامل مع PII يجب أن تُدرج tags: `#PII` و`#sensitive`.
* Feature التي تُعرض بيانات مالية يجب أن تحتاج SRE + Security sign‑off قبل release.

## 1.10 - Time‑Box (اقتراح)

* Vision + Sketch: **45 دقيقة**
* Component Inventory + Interaction: **30 دقيقة**

## 1.11 - Definition of Ready (DoR) — Phase‑1

* ✅ Vision مكتوبة وموقعة من PO.
* ✅ Sketch مُرفق أو رابط Figma.
* ✅ Component inventory مملوء وروابط التصميم.
* ✅ Top‑3 features مُصنّفة بالأولوية (RICE / Betting).
* ✅ أي تداخل أمني/خصوصية مُعلم وتمت مخاطبة Security.

---

# Sign‑off template (لـ Phase‑0 → Phase‑1)

**Sign‑off**

* PO: _______________________  (date)
* Tech Lead: ________________ (date)
* SRE / DevOps: _____________ (date)
* Security Reviewer: ________ (date)
* Designer: _________________ (date)

---

# Quick checklist for the Repo (what to add now)

* `docs/phase-0-1-enhanced.md` (هذا الملف).
* `docs/roles-and-raci.md` (مفصّل إن احتجت).
* `templates/prioritization/rice-template.md` (حيث تحسب RICE لكل backlog item).
* `security/snyk-dependabot.md` (خطوات تشغيل SCA).

