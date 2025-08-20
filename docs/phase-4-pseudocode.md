# 📦 Phase 4 – كتابة الوصفة (Pseudo‑code) 

## 🎯 الهدف

تحويل كل User Story إلى وصف تفصيلي ومرتّب للخطوات—بدرجة كافية ليمكن لأي مطور أو مولد كود (scaffold) تحويله إلى شيفرة قابلة للاختبار دون فقدان قرارات التصميم.

---

## 4.0 – تنسيق موحّد (Template) — اطبعها وكررها لكل دالة/عملية

```
# 1. <اسم الدالة / الإجراء>
#   الوصف: <وصف قصير يوضح الهدف>
#   المدخلات: <قائمة المتغيرات مع نوعها وقيودها>
#   المخرجات: <ما تُعيده الدالة أو الأثر الجانبي>
#   الـ Side‑Effects: <مثال: تحديث الكاش، إرسال حدث>

def <function_name>(<params>):
    # 1.1 Validate input
    if <invalid_condition>:
        return Error("<message>")

    # 1.2 Preconditions
    #   (e.g., check user permissions, feature flag)

    # 1.3 Main steps
    #   Step 1: <شرح>
    #   Step 2: <شرح>

    # 1.4 Error handling / retries
    try:
        # call repository / external API
    except TransientError as e:
        # retry logic or bubble up
    except Exception as e:
        # log and return structured error

    # 1.5 Post‑conditions / Side effects
    #   e.g., update cache, emit event

    return Success(<value>)
```

**ملاحظات:** اكتب كل خطوة برقم (1.1, 1.2...) لتسهيل الربط بالـ flowchart وملفات الاختبارات.

---

## 4.1 – مثال تطبيقي (Add Expense) — Python (قابل للنسخ)

```python
# add_expense
# الوصف: يضيف مصروفًا جديدًا بعد التحقق من صحة المدخلات وسريان الميزانية.
# المدخلات: expense_data: dict {name:str, amount:Decimal, date:date, category_id:UUID, user_id:UUID}
# المخرجات: dict {success:bool, message:str, expense_id?:UUID}

def add_expense(expense_data):
    # 1.1 Validate input
    if not expense_data.get('name') or expense_data.get('amount', 0) <= 0:
        return {'success': False, 'message': 'الرجاء إدخال اسم وقيمة صحيحة'}

    # 1.2 Preconditions (auth)
    if not check_user_exists(expense_data['user_id']):
        return {'success': False, 'message': 'المستخدم غير موجود'}

    # 1.3 Main logic
    try:
        expense_id = repo.save_expense(expense_data)
    except DatabaseError as e:
        logger.error('DB save failed', exc_info=e)
        return {'success': False, 'message': 'حدث خطأ في الخادم'}

    # 1.4 Post‑conditions
    cache.invalidate(f"expenses:{expense_data['user_id']}")
    events.emit('expense.created', {'id': expense_id})

    return {'success': True, 'message': 'تمت الإضافة بنجاح', 'expense_id': expense_id}
```

---

## 4.2 – مثال TypeScript Service + Controller (skeleton)

```ts
// services/expense.service.ts
export async function addExpense(expenseData: AddExpenseDto) : Promise<Result> {
  // Validate
  if (!expenseData.name || expenseData.amount <= 0) {
    return { success: false, message: 'Validation failed' };
  }

  // Try save
  try {
    const id = await repo.save(expenseData);
    await cache.invalidate(`expenses:${expenseData.userId}`);
    eventBus.emit('expense.created', { id });
    return { success: true, message: 'OK', id };
  } catch (err) {
    logger.error('save failed', err);
    return { success: false, message: 'Server error' };
  }
}
```

---

## 4.3 – Plop.js template (توليد ملفات service/controller)

```js
module.exports = function(plop) {
  plop.setGenerator('service', {
    description: 'Generate service + tests',
    prompts: [{ type: 'input', name: 'name', message: 'Service name (kebab-case)' }],
    actions: [{ type: 'add', path: 'src/services/{{kebabCase name}}.service.ts', templateFile: 'plop-templates/service.hbs' },
              { type: 'add', path: 'tests/{{kebabCase name}}.test.ts', templateFile: 'plop-templates/service.test.hbs' }]
  });
};
```

**خلاصة:** اجعل كل ملف يولّد من قالب يتضمّن header pseudo‑code (comments) يشرح المدخلات والمخرجات — هذا يربط المستندات بالشيفرة المولّدة.

---

## 4.4 – Mapping to Tests (Unit + BDD)

* لكل خطوة (1.1, 1.2, 1.3...) أنشئ Unit tests تغطي: success path، validation، error handling، edge cases.
* انقل الـ flow happy path إلى Scenario Gherkin واحد على الأقل.

**Test matrix example:**
| Story | Unit Tests | BDD Scenario | CI Job |
| US‑01 Add | success, negative amount, DB error | features/add_expense.feature | ci-add.yml |

---

## 4.5 – Error Handling & Observability

* **Errors:** Returned structured errors `{ code, message, details? }` not raw stacks.
* **Logging:** Use structured logging with `requestId`, user context, and error_code.
* **Tracing:** instrument service calls (OpenTelemetry) to link traces to SLOs.

---

## 4.6 – Edge Cases & Defensive Programming

* Race conditions on concurrent writes — use DB transactions or optimistic locking.
* Idempotency for POST endpoints (use client‑generated idempotency key or server‑side dedupe).
* Backpressure handling for heavy aggregation endpoints (queue + async job).

---

## 4.7 – Dev Experience (what to add to repo)

* `docs/pseudocode/` directory: ملف لكل دالة/story (مثلاً `add_expense.md`).
* `plop-templates/` مع قالب Service + Test.
* `templates/errors.md` يوضح Error Codes وMessages.

---

## 4.8 – Time‑Box & DoR / DoD

* Writing pseudo‑code per story: **20 دقيقة**.
* Review + link to flowchart & tests: **15 دقيقة**.

**DoR — Phase‑4**

* ✅ كل node من الـ flowchart مربوط بخطوات pseudo‑code مرقّمة.
* ✅ Inputs/Outputs موثّقة مع القيود.
* ✅ Security/PII notes مذكورة إن وُجدت.

**DoD — Phase‑4**

* ✅ ملف pseudo‑code موجود في `docs/pseudocode/<story>.md`.
* ✅ توليد قالب Service + Test عبر Plop يعمل بنجاح.
* ✅ Unit tests skeleton موجود ومترابط بـ CI.

---

# Sign‑off

* PO: _______
* Tech Lead: _______
* QA: _______

