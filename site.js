/* AODA Report Desk: small progressive enhancements. Every feature works (more simply) without this file. */
(function () {
  'use strict';

  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) { /* analytics is optional */ }
  }

  /* 1. Mobile navigation */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* 2. "Do you need to file?" self-check */
  var check = document.querySelector('[data-selfcheck]');
  if (check) {
    var results = check.querySelectorAll('.result[data-band]');
    var placeholder = check.querySelector('.result-placeholder');
    var formSelect = document.getElementById('lead-employees');
    var mapToForm = { '20-49': '20–49', '50-199': '50–199', '200plus': '200+', 'unsure': 'Not sure' };
    check.addEventListener('change', function (e) {
      if (!e.target.matches('input[name="band"]')) return;
      var band = e.target.value;
      results.forEach(function (r) { r.classList.toggle('is-active', r.getAttribute('data-band') === band); });
      if (placeholder) placeholder.hidden = true;
      if (formSelect && mapToForm[band]) formSelect.value = mapToForm[band];
      track('self_check', { band: band });
    });
  }

  /* 3. Request forms (snapshot on home / free-aoda-snapshot, multi-intent on start.html).
     They POST to venture.json "lead_form_action" (FormSubmit). Nothing opens the visitor's email app. */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    var summary = form.querySelector('.error-summary');
    var sending = false;
    var nextBase = (form.elements._next && form.elements._next.value.split('?')[0]) || '';
    var subjects = { snapshot: 'New AODA snapshot request', package: 'New AODA package request', call: 'New AODA call request' };
    form.setAttribute('novalidate', '');
    // Record the landing path and query (UTM tags, prospect id) with the submission.
    if (form.elements.source_page) form.elements.source_page.value = location.pathname + location.search;

    function intent() {
      var el = form.elements.intent; // hidden input or radio group
      return (el && el.value) || 'snapshot';
    }
    function syncIntent() {
      var cur = intent();
      form.querySelectorAll('[data-show-for]').forEach(function (box) {
        var on = box.getAttribute('data-show-for') === cur;
        box.hidden = !on;
        box.querySelectorAll('input, select, textarea').forEach(function (f) { f.disabled = !on; if (!on) f.removeAttribute('aria-invalid'); });
      });
      var btn = form.querySelector('[type="submit"]');
      if (btn && form.getAttribute('data-lead-form') === 'start') {
        btn.textContent = cur === 'package' ? 'Start my package' : cur === 'call' ? 'Request my call' : 'Send my snapshot request';
      }
    }
    // Preselect from ?intent=snapshot|package|call and ?package=a|b
    var q = new URLSearchParams(location.search);
    var qi = q.get('intent');
    if (qi && form.querySelector('input[name="intent"][value="' + qi + '"]')) form.querySelector('input[name="intent"][value="' + qi + '"]').checked = true;
    var qp = q.get('package');
    if (qp && form.elements.package) form.elements.package.selectedIndex = qp === 'a' ? 1 : qp === 'b' ? 2 : 0;
    form.addEventListener('change', function (e) { if (e.target.name === 'intent') syncIntent(); });
    syncIntent();

    var rules = [
      { name: 'package', msg: 'Choose a package.', when: 'package' },
      { name: 'name', msg: 'Enter your name.' },
      { name: 'email', msg: 'Enter your work email address, like name@company.ca.', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
      { name: 'organization', msg: 'Enter your organization’s name.' },
      { name: 'website', msg: 'Enter your website address, like company.ca. Write “none” if you don’t have one.', test: function (v) { return /\./.test(v) || /^none$/i.test(v); } },
      { name: 'employees', msg: 'Choose your approximate number of Ontario employees.' },
      { name: 'call_times', msg: 'Tell us a few times that suit you for the call.', when: 'call' },
      { name: 'consent', msg: 'Tick the box so we can reply to you by email.', checkbox: true }
    ];

    function fieldError(input, msg) {
      var err = document.getElementById(input.id + '-error');
      if (err) err.textContent = msg || '';
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    function validateOne(rule) {
      if (rule.when && rule.when !== intent()) return null;
      var input = form.elements[rule.name];
      if (!input || input.disabled) return null;
      var ok = rule.checkbox ? input.checked : (input.value.trim() !== '' && (!rule.test || rule.test(input.value.trim())));
      fieldError(input, ok ? '' : rule.msg);
      return ok ? null : { input: input, msg: rule.msg };
    }
    rules.forEach(function (rule) {
      var input = form.elements[rule.name];
      if (!input) return;
      input.addEventListener(rule.checkbox || input.tagName === 'SELECT' ? 'change' : 'blur', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateOne(rule);
      });
    });

    form.addEventListener('submit', function (e) {
      if (sending) { e.preventDefault(); return; }
      if (form.elements._honey && form.elements._honey.value) { e.preventDefault(); return; } // spam trap
      var errors = rules.map(validateOne).filter(Boolean);
      if (errors.length) {
        e.preventDefault();
        var list = summary.querySelector('ul');
        list.innerHTML = '';
        errors.forEach(function (er) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + er.input.id;
          a.textContent = er.msg;
          a.addEventListener('click', function (ev) { ev.preventDefault(); er.input.focus(); });
          li.appendChild(a);
          list.appendChild(li);
        });
        summary.hidden = false;
        summary.focus();
        track('form_error_' + intent(), { errors: errors.length });
        return;
      }
      // Valid: set subject and thank-you URL for this intent, then let the normal POST proceed.
      summary.hidden = true;
      sending = true;
      var cur = intent();
      var subject = subjects[cur] || subjects.snapshot;
      if (cur === 'package' && form.elements.package && form.elements.package.value) subject += ': ' + form.elements.package.value;
      if (form.elements._subject) form.elements._subject.value = subject + ' (' + form.elements.organization.value.trim() + ')';
      if (form.elements._next && nextBase) form.elements._next.value = nextBase + '?intent=' + cur;
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.textContent = 'Sending…';
      track('form_submit_' + cur, { method: 'form', intent: cur, employees: form.elements.employees ? form.elements.employees.value : '', transport_type: 'beacon' });
    });
  });

  /* 4. Printable checklist: print button and ticks saved in this browser only */
  var printBtn = document.querySelector('[data-print]');
  if (printBtn) {
    printBtn.hidden = false;
    printBtn.addEventListener('click', function () { window.print(); });
  }
  var boxes = document.querySelectorAll('.check-items input[type="checkbox"]');
  if (boxes.length) {
    var key = 'aoda-checklist-2026';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) { saved = {}; }
    var count = document.querySelector('[data-check-count]');
    var update = function () {
      if (!count) return;
      var n = 0; boxes.forEach(function (b) { if (b.checked) n++; });
      count.textContent = n + ' of ' + boxes.length + ' items ticked';
    };
    boxes.forEach(function (b) {
      if (saved[b.id]) b.checked = true;
      b.addEventListener('change', function () {
        saved[b.id] = b.checked;
        try { localStorage.setItem(key, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ }
        update();
      });
    });
    update();
    var reset = document.querySelector('[data-check-reset]');
    if (reset) {
      reset.hidden = false;
      reset.addEventListener('click', function () {
        boxes.forEach(function (b) { b.checked = false; });
        saved = {};
        try { localStorage.removeItem(key); } catch (e) { /* storage unavailable */ }
        update();
      });
    }
  }
})();
