# 📦 Phase 5 – اختبار (Testing)

## 🎯 الهدف

ضمان جودة المنتج عبر اختبارات قابلة للتكرار وموثوقة ذات تغطية مناسبة، مع CI يضمن أن أي تغيير يمرّ بمعايير الجودة قبل الدمج/النشر.

---

## 5.0 – Test Strategy Overview (ملخص سريع)

* **Test Pyramid:** Unit (القاعدة) → Integration → E2E → Manual/Exploratory.
* **Security & Compliance tests:** SAST + DAST + Dependency Scans (SCA) داخل CI.
* **Contract tests:** Consumer‑driven contracts (Pact) للواجهات الخارجية/الـ microservices.
* **Mutation testing:** كـ gate لقياس جودة الاختبارات (اختياري للـ critical services).
* **Continuous testing:** تشغيل Unit+Integration على كل push، E2E + Security nightly or on PR to main.

---

## 5.1 – BDD Scenarios (Gherkin) — أمثلة جاهزة

ضع هذه في `features/` واستخدم Cucumber / behave / pytest‑bdd حسب اللغة.

### Feature: Add expense

```gherkin
Feature: Add expense
  As a user
  I want to add a new expense
  So that it appears in my list and totals update

  Scenario: Successful addition
    Given the user is authenticated
    When the user fills the fields with valid data:
      | name   | amount | date       | category |
      | "قهوة" | 5.00   | 2025-08-07 | "Food"   |
    And clicks the "Add" button
    Then a success toast "تمت الإضافة بنجاح" is shown
    And the expense appears in the expenses list

  Scenario: Invalid amount
    Given the user is authenticated
    When the user fills the fields with amount "-10"
    Then an error toast "الرجاء ملء جميع الحقول بصورة صحيحة" is shown
    And no new expense is added
```

---

## 5.2 – Unit Tests (best practices)

* Keep unit tests fast, deterministic, isolated from external systems.
* Use test doubles (mocks / stubs / fakes) for DB, external APIs.
* Arrange‑Act‑Assert structure; clear test names.
* Example (Jest): `tests/services/addExpense.test.js` — cover success / validation / repository error.

**Coverage gates:** Configure CI to fail if coverage < 80% (project policy), and per‑module minimal thresholds for critical modules.

---

## 5.3 – Integration Tests

* Test interactions with real DB (use test DB), message brokers or persisting layers.
* Use Docker Compose to bring up dependencies during CI integration job.
* Keep integration tests limited in number and run in a dedicated CI job (longer timeout).

**Example**

* Job `integration-tests` runs: start services via docker‑compose -f docker-compose.test.yml up -d → run pytest/jest with test DB → teardown.

---

## 5.4 – End‑to‑End (E2E) Tests

* Target user flows (Add expense, Delete, Filter, Login).
* Use Playwright / Cypress for frontend flows.
* Run E2E in a stable environment (staging mirrored from prod) and back with test data teardown.
* Keep E2E count limited (5–10 critical flows) and run on PR to main or nightly.

**Flaky tests mitigation:**

* Retry strategy only at test runner level (e.g., Playwright retries=1) and investigate flakes; do not ignore.
* Track flaky tests in a dashboard and assign owners to fix.

---

## 5.5 – Contract Testing (API compatibility)

* Use Pact or similar: Consumers publish expectations; provider verifies in CI.
* Run provider verification in CI before deploy; fail pipeline if contract broken.

---

## 5.6 – Security & Dependency Scanning in CI

* **SCA (Software Composition Analysis):** Dependabot/GitHub Dependabot or Snyk to scan dependencies.
* **SAST (Static analysis):** Run tools (ESLint + security plugins, bandit for Python, semgrep) in CI on PRs.
* **DAST (Dynamic analysis):** Run OWASP ZAP scans against a deployed test environment nightly or on release candidate.
* **Secrets scanning:** git‑secrets or GitHub secret scanning in CI.

**Gate policy:** PRs to `main` must pass SCA + SAST checks; high severity issues block merge.

---

## 5.7 – Mutation Testing (measure test quality)

* Tools: Stryker (JS), MutPy (Python), PIT (Java).
* Run mutation tests periodically (weekly or in a dedicated job) and use results to improve tests for critical modules.

---

## 5.8 – Test Data Strategy

* Use fixtures and factories rather than heavy DB seeds.
* Use ephemeral test DB instances per CI job if feasible.
* Keep synthetic test data representative of edge cases (long strings, special chars, timezone boundaries, leap years).

---

## 5.9 – CI Pipeline (suggested GitHub Actions matrix)

**File:** `.github/workflows/ci.yml` (example skeleton)

```yaml
name: CI
on: [push, pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with: node-version: '20'
      - run: npm ci
      - run: npm test -- --coverage

  integration:
    needs: unit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d
      - run: npm run test:integration

  e2e:
    if: github.event_name == 'pull_request' || github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run test:e2e

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Snyk
        uses: snyk/actions/node@master
        with:
          args: test
```

**Notes:**

* Separate quick unit job from long integration/E2E/security jobs.
* Use caching (npm, pip) to speed CI.
* Deny merge until `unit` + `security` jobs pass; run slow jobs in gating but optionally allow merge with warning if non‑critical.

---

## 5.10 – Test Flakiness & Reliability

* Track flaky tests using test result annotations; auto‑label PRs with flaky test indicators.
* Maintain a `flake` dashboard with failure counts and owners.
* Enforce fixing flaky tests within N sprints.

---

## 5.11 – Observability for Tests

* Push test results to a test analytics store (Allure, ReportPortal) for trends.
* Monitor test durations; alert if suite runtime increases beyond threshold.

---

## 5.12 – Linking Tests to SLO / DORA

* Map failing integration/E2E tests types to potential SLO impacts.
* Track deployment failure rate and lead time via CI metrics.

---

## 5.13 – Roles & Ownership (Testing RACI)

| Role         | Responsibility                                        |
| ------------ | ----------------------------------------------------- |
| Developers   | Write Unit + Integration tests; fix failing tests.    |
| QA           | E2E scenarios, exploratory testing, acceptance tests. |
| SRE / DevOps | Maintain CI infra, test environments, data teardown.  |
| Security     | Run SAST/DAST, validate findings, approve releases.   |

---

## 5.14 – Metrics & Gates (example thresholds)

* Unit test coverage: ≥ 80%.
* Integration tests pass rate: 100% on PR.
* E2E pass rate: 95%.
* Vulnerabilities: no critical/high unmitigated in dependencies.

---

## 5.15 – Time‑Box & DoR / DoD

* Writing BDD scenarios: **20–30 minutes/story**.
* Unit tests per story: **30–60 minutes**.
* Integration/E2E pipeline setup: **1–2 days** (initial).

**DoR — Phase‑5**

* ✅ Each User Story has at least one BDD scenario.
* ✅ Unit tests skeleton for the story exists.
* ✅ CI jobs configured for unit + security checks.

**DoD — Phase‑5**

* ✅ All unit tests pass locally and in CI.
* ✅ Integration tests for critical paths pass in CI.
* ✅ E2E tests for critical flows pass in staging and are linked to PR.
* ✅ SAST/SCA scan passed or mitigations documented.

---

# Sign‑off

* PO: _______
* Tech Lead: _______
* QA Lead: _______

