# 📦 Phase 2 – التفكير بالبيانات (Data Mindset) 

## 2.0 – Input Specification (قابل للنسخ)

| # | الحقل         | النوع         | قيود                | مثال       | Tags       |
| - | ------------- | ------------- | ------------------- | ---------- | ---------- |
| 1 | `name`        | String        | مطلوب، ≤100 char    | "محمد"     | #personal  |
| 2 | `amount`      | Decimal(10,2) | مطلوب، >0           | 125.50     | #financial |
| 3 | `date`        | Date (ISO)    | مطلوب، ≤ اليوم      | 2025-08-07 | #temporal  |
| 4 | `category_id` | UUID          | موجود في `Category` | "c1-..."   | #ref       |
| 5 | `notes`       | String        | اختياري، ≤500 char  | "قهوة"     | #optional  |

**Validation rules (server):**

* أنواع صارمة، استخدام JSON Schema أو TypeORM/Sequelize validators.
* تحقق من حدود الأرقام، توحيد الوقت (UTC) أو تخزين timezone إذا مطلوب.

## 2.1 – Entity / Data Model (ER) — مثال مبسّط

**Entity: Expense**  
`Expense { id UUID PK, user_id UUID FK -> User.id #PII?, name String, amount Decimal, date Date, category_id UUID FK, created_at Timestamp, updated_at Timestamp }`

**Entity: Category**  
`Category { id UUID PK, name String UNIQUE }`

> ملاحظات خصوصية: علّم الحقول الحساسة بـ `#PII` أو `#sensitive`. كل جدول يحتوي على حقل `created_by`/`user_id` يجب أن يخضع لسياسة وصول مخصصة.

## 2.2 – Relationships

* Expense → Category : Many‑to‑One.
* User → Expense : One‑to‑Many (كل مصروف مرتبط بمستخدم).

## 2.3 – SQL Schema Example (Postgres)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_expenses_user_date ON expenses(user_id, date);
```

**Indexing notes:**

* Index على `(user_id, date)` لقراءة سريعة حسب المستخدم/الفترة.
* فكر في partitioning حسب `date` إذا >10M سجلات.

## 2.4 – Non‑Functional Requirements (NFR) — Data & Performance

| الفئة       | المتطلب                | مقياس             | ملاحظة                       |
| ----------- | ---------------------- | ----------------- | ---------------------------- |
| Performance | API read latency (p50) | ≤ 120 ms          | under typical load           |
| Scalability | DB size                | يدعم 10M+ records | partition + archiving plan   |
| Consistency | Transactional safety   | ACID for writes   | use DB transactions          |
| Security    | Data access control    | RBAC enforced     | row‑level security إذا مطلوب |

## 2.5 – SLI / SLO (مقترح للـ APIs)

**SLO examples (30d window)**

* `GET /expenses` availability SLO: 99.9% (SLI = successful responses / total requests).
* `POST /expenses` latency SLO: p95 ≤ 300 ms.

**Error budget policy:**

* إذا تجاوزت الـ error budget (مثلاً 0.1% downtime) يتم تفعيل freeze للتغييرات وتأجيل الميزات غير الحرجة.

## 2.6 – Monitoring & Alerts (what to measure)

* Request rate (rps) per endpoint.
* Error rate (5xx) per endpoint — alert threshold: >1% over 5m.
* Latency p50/p95/p99 — alert if p95 > 500ms for 10m.
* DB slow queries — >200ms queries list.
* SLO burn rate — alert if burn rate > 14x for 1h.

> استخدم Prometheus + Grafana + Alertmanager، أضف Sentry للتتبّع البرمجي.

## 2.7 – Caching Strategy

* Cache `GET /categories` (rarely changing) with TTL 1h (Redis).
* Use per‑user caching for expensive aggregations (e.g., totals per month) with short TTL (30s) and cache‑invalidate on write.

## 2.8 – Backup & Restore / DR

* Full nightly backup + WAL archiving in Postgres.
* Test restore procedure شهريًا.
* Recovery Time Objective (RTO): ≤ 1h.
* Recovery Point Objective (RPO): ≤ 15 minutes (WAL shipping).

## 2.9 – Data Retention & Archiving

* Active financial records: keep 2 years in primary DB.
* Archive older records to cheaper storage (Parquet on S3) بعد 2 سنة.
* Ability to rehydrate archive for queries (async job).

## 2.10 – Privacy & Compliance

* تصنيف البيانات (Data Classification): PII, Financial, System.
* حذف بيانات المستخدم عند طلبه (Right to be forgotten): حذف أو تشفير البيانات مع الاحتفاظ بالسجلات القانونية (anonymize vs delete policy).
* إن أمكن، احتفظ بسجل إجرائي (audit log) مجزَّأ ولا يحتوي على بيانات حساسة بالكامل.

## 2.11 – Access Control & Security

* Apply RBAC and, إن لزم، Row Level Security (Postgres RLS) لفرض سياسات الوصول.
* Use parameterized queries / ORM to prevent SQL Injection.
* Ensure secrets management (Vault / GitHub Secrets) and rotate keys periodically.

## 2.12 – Migration Strategy (Schema Changes)

* Use migrations with tools (Flyway / Liquibase / Knex / TypeORM migrations).
* Strategy for backward compatible changes: Add columns nullable → backfill → set NOT NULL with migration flag.
* Feature flags for switching behavior during rollout.
* Rollback plan: reverse migration scripts + DB snapshot before risky changes.

## 2.13 – Data Quality & Observability

* Background job to validate referential integrity monthly.
* Expose data quality dashboard: null rates, duplicates, orphaned FKs.
* Alert if >1% of new records fail validation rules.

## 2.14 – Dev Experience (templates & files to add)

* `docs/data-model.md` (ER diagrams + privacy annotations).
* `src/models/expense.model.ts` (ORM schema example).
* `migrations/` (example migration .sql).
* `templates/slo/sli-slo-template.md` (to fill per endpoint).

## 2.15 – Time‑Box (اقتراح)

* Input Spec: **15–20 دقيقة**.
* ER Diagram + Indexing plan: **30–45 دقيقة**.
* SLO & Monitoring plan: **30 دقيقة**.

## 2.16 – Definition of Ready (DoR) — Phase‑2

* ✅ كل الحقول المطلوبة مُعرَّفة مع القيود والنماذج.
* ✅ ER diagram مُحمل في `docs/`.
* ✅ SLOs مُوضَّحة لكل API رئيسي.
* ✅ خطة retention & backup documented.

---

# Quick sign‑off & next steps

* Sign‑off:

  * PO: _________ (date)
  * Tech Lead: _________ (date)
  * SRE: _________ (date)

