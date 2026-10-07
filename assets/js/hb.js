/* Hill Bottom Properties — behaviour.
   Progressive: without JS the page is fully readable, every link works,
   nothing is hidden, and the form falls back to native validation. */
(function () {
  "use strict";
  var doc = document;
  var root = doc.body;
  root.classList.add("js");
  var html = doc.documentElement;
  /* ---- Hill Bottom brand intro: CSS owns the timeline, script owns memory + skip ---- */
  var siteLoader = doc.querySelector("[data-site-loader]");
  var introQueue = [];
  var introPending = function () {
    return (siteLoader && !html.classList.contains("hbi-seen")) || (doc.querySelector(".uki") && !html.classList.contains("uki-seen"));
  };
  var whenIntroDone = function (fn) { if (introPending()) introQueue.push(fn); else fn(); };
  if (siteLoader) {
    var finishLoader = function () {
      if (html.classList.contains("hbi-seen")) return;
      html.classList.add("hbi-seen", "intro-reveal");
      html.classList.remove("intro-lock");
      setTimeout(function () { html.classList.remove("intro-reveal"); }, 2600);
      try { sessionStorage.setItem("hb-intro-v3", "1"); } catch (e) {}
      introQueue.splice(0).forEach(function (fn) { fn(); });
      setTimeout(function () { if (siteLoader.parentNode) siteLoader.parentNode.removeChild(siteLoader); }, 1300);
    };
    if (html.classList.contains("hbi-seen")) siteLoader.parentNode.removeChild(siteLoader);
    else {
      html.classList.add("intro-lock");
      // hand off as the exit begins, so the page arrives underneath the dissolving panel
      siteLoader.addEventListener("animationstart", function (e) { if (e.target === siteLoader && e.animationName === "hbi-out") finishLoader(); });
      siteLoader.addEventListener("click", function () { siteLoader.classList.add("is-skipped"); finishLoader(); });
      doc.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { siteLoader.classList.add("is-skipped"); finishLoader(); } }, { once: true });
      setTimeout(finishLoader, 4800);
    }
  }
  // reveal the page once styles and the first paint are settled
  var ready = function () { root.classList.add("ready"); };
  if (document.readyState === "complete") ready();
  else window.addEventListener("load", ready);
  setTimeout(ready, 1200);

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  function trap(e, elements) {
    if (e.key !== "Tab") return;
    var items = elements.filter(function (el) { return !el.disabled && el.getClientRects().length && !el.closest('[inert]'); });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  var focusables = 'a[href],button,input,select,textarea,[tabindex="0"]';

  /* Reflective material follows the pointer without taking over layout. */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".btn").forEach(function (button) {
      button.addEventListener("pointermove", function (e) {
        var box = button.getBoundingClientRect();
        button.style.setProperty("--mx", ((e.clientX - box.left) / box.width * 100).toFixed(1) + "%");
        button.style.setProperty("--my", ((e.clientY - box.top) / box.height * 100).toFixed(1) + "%");
      });
      button.addEventListener("pointerleave", function () {
        button.style.removeProperty("--mx");
        button.style.removeProperty("--my");
      });
    });
  }

  /* Keep scrolling native. A sentinel changes the compact header without a scroll listener. */
  var hdr = $(".hdr");
  var revealItems = $$(".rv, .alt");
  if (reduced || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealItems.forEach(function (el, i) {
      el.style.setProperty("--rv-i", String(i % 5));
      revealObserver.observe(el);
    });
  }
  if (hdr && "IntersectionObserver" in window) {
    var headerAnchor = $(".hero");
    if (!headerAnchor) { hdr.classList.add("is-stuck"); }
    var headerObserver = new IntersectionObserver(function (entries) {
      hdr.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });
    if (headerAnchor) headerObserver.observe(headerAnchor);
  } else if (hdr) {
    hdr.classList.add("is-stuck");
  }

  /* ---- the hero line arrives word by word — the one orchestrated moment ---- */
  $$("[data-words]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var wrap = doc.createElement("span");
      wrap.className = "wr";
      var inner = doc.createElement("span");
      inner.textContent = w;
      inner.style.setProperty("--d", (90 + i * 85) + "ms");
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(" "));
    });
  });
  var hero = $(".hero");
  if (hero) whenIntroDone(function () { requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add("lit"); }); }); });

  /* ---- Urban Kaza identity intro (native motion; CSS timeline, ~6.4s) ---- */
  var ukIntro = $(".uki");
  if (ukIntro) {
    root.appendChild(ukIntro);
    var UK_KEY = "uk-intro-v4";
    var ukDone = false;
    var ukSuspended = [];
    var finishUk = function (quick) {
      if (ukDone) return;
      ukDone = true;
      if (quick) ukIntro.classList.add("is-skipped");
      html.classList.add("uki-seen", "intro-reveal");
      html.classList.remove("intro-lock");
      setTimeout(function () { html.classList.remove("intro-reveal"); }, 2600);
      ukIntro.inert = true;
      ukSuspended.forEach(function (el) { el.inert = false; });
      ukSuspended = [];
      try { sessionStorage.setItem(UK_KEY, "1"); } catch (e) {}
      introQueue.splice(0).forEach(function (fn) { fn(); });
      var ukHeading = $("main h1");
      if (ukHeading) { ukHeading.setAttribute("tabindex", "-1"); ukHeading.focus({ preventScroll: true }); }
      setTimeout(function () { if (ukIntro.parentNode) ukIntro.parentNode.removeChild(ukIntro); }, 1400);
    };
    var skipUk = $("[data-uk-skip]", ukIntro);
    if (skipUk) skipUk.addEventListener("click", function () { finishUk(true); });
    if (html.classList.contains("uki-seen")) ukIntro.parentNode.removeChild(ukIntro);
    else {
      ukIntro.inert = false;
      html.classList.add("intro-lock");
      ukSuspended = Array.prototype.slice.call(root.children).filter(function (el) { return el !== ukIntro && !el.inert && el.tagName !== "SCRIPT"; });
      ukSuspended.forEach(function (el) { el.inert = true; });
      ukIntro.addEventListener("animationstart", function (e) { if (e.target === ukIntro && e.animationName === "uki-out") finishUk(false); });
      if (skipUk) skipUk.focus({ preventScroll: true });
      setTimeout(function () { finishUk(false); }, 7400);
      doc.addEventListener("keydown", function (e) {
        if (ukDone) return;
        if (e.key === "Escape") finishUk(true);
        trap(e, skipUk ? [skipUk] : []);
      });
    }
  }

  /* ---- mobile drawer ---- */
  var burger = $(".burger"), drawer = $(".drawer");
  if (burger && drawer) {
    drawer.inert = true;
    var setDrawer = function (open) {
      if (open && wel && wel.classList.contains("is-open")) closeWel(false);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawer.classList.toggle("is-open", open);
      drawer.setAttribute("aria-hidden", String(!open));
      drawer.inert = !open;
      $$("main,.ftr,.rail,.bar,.welcome,.chatw").forEach(function (el) { el.inert = open || el.getAttribute("aria-hidden") === "true"; });
      root.style.overflow = open ? "hidden" : "";
      if (open) requestAnimationFrame(function () {
        if (drawer.classList.contains("is-open")) $("a", drawer).focus();
      });
      else burger.focus();
    };
    burger.addEventListener("click", function () {
      setDrawer(burger.getAttribute("aria-expanded") !== "true");
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
    doc.addEventListener("keydown", function (e) {
      if (!drawer.classList.contains("is-open")) return;
      if (e.key === "Escape") setDrawer(false);
      trap(e, [burger].concat($$(focusables, drawer)));
    });
    window.addEventListener("resize", function () { if (window.innerWidth >= 1140 && drawer.classList.contains("is-open")) setDrawer(false); });
  }

  /* ---- chat widget: real canned-question panel, not a WhatsApp redirect ---- */
  var chatw = $("#hb-chat");
  if (chatw) {
    var chatFab = $("[data-chat-toggle]", chatw);
    var chatPanel = $(".chatw__panel", chatw);
    var chatList = $("[data-chat-list]", chatw);
    var chatAnswers = $$("[data-chat-a]", chatw);
    var setChat = function (open) {
      chatw.classList.toggle("is-open", open);
      chatFab.setAttribute("aria-expanded", String(open));
      chatPanel.setAttribute("aria-hidden", String(!open));
      if (!open) {
        chatList.hidden = false;
        chatAnswers.forEach(function (a) { a.hidden = true; });
      }
    };
    chatFab.addEventListener("click", function () {
      setChat(!chatw.classList.contains("is-open"));
    });
    $$("[data-chat-close]", chatw).forEach(function (b) { b.addEventListener("click", function () { setChat(false); }); });
    $$("[data-chat-q]", chatw).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = btn.getAttribute("data-chat-q");
        chatList.hidden = true;
        chatAnswers.forEach(function (a) { a.hidden = a.getAttribute("data-chat-a") !== i; });
      });
    });
    $$("[data-chat-back]", chatw).forEach(function (b) {
      b.addEventListener("click", function () {
        chatList.hidden = false;
        chatAnswers.forEach(function (a) { a.hidden = true; });
      });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && chatw.classList.contains("is-open")) setChat(false);
    });
    /* Clicking anywhere outside the widget (the rest of the page) closes
       it, same as the question list's own Back/Close controls. */
    doc.addEventListener("click", function (e) {
      if (chatw.classList.contains("is-open") && !chatw.contains(e.target)) setChat(false);
    });
  }

  /* ---- welcome sheet: the Ayat-to-Kazanchis handover ---- */
  var wel = $(".welcome"), scrim = $(".scrim");
  if (wel) {
    wel.inert = true;
    var KEY = "hb-welcome-v2";
    var closeWel = function (remember) {
      wel.classList.remove("is-open");
      if (scrim) scrim.classList.remove("is-on");
      wel.setAttribute("aria-hidden", "true");
      if (wel.contains(doc.activeElement)) {
        var heading = $("main h1");
        if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      }
      wel.inert = true;
      if (remember) { try { localStorage.setItem(KEY, "1"); } catch (e) {} }
    };
    var seen = false;
    try { seen = localStorage.getItem(KEY) === "1"; } catch (e) { seen = false; }
    if (!seen) whenIntroDone(function () {
      setTimeout(function () {
        if ((drawer && drawer.classList.contains("is-open")) || $(".lb.is-on")) return;
        wel.classList.add("is-open");
        wel.setAttribute("aria-hidden", "false");
        wel.inert = false;
        if (scrim) scrim.classList.add("is-on");
      }, reduced ? 600 : 2600);
    });
    $$("[data-wel-close]", wel).forEach(function (b) {
      b.addEventListener("click", function () { closeWel(true); });
    });
    if (scrim) scrim.addEventListener("click", function () { closeWel(true); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && wel.classList.contains("is-open")) closeWel(true);
    });
  }

  /* ---- gallery lightbox ---- */
  var lb = $(".lb");
  if (lb) {
    // The viewer must not inherit inert from the page it overlays.
    root.appendChild(lb);
    lb.inert = true;
    var suspended = [];
    var lbImg = $(".lb img", lb), lbCap = $(".lb figcaption", lb);
    var toItem = function (el) { return { src: el.getAttribute("data-lb"), cap: el.getAttribute("data-lb-cap") || "" }; };
    var shots = $$("[data-lb]"), items = shots.map(toItem), at = 0, lastFocus = null;
    var show = function (i) {
      at = (i + items.length) % items.length;
      lbImg.setAttribute("src", items[at].src);
      lbImg.setAttribute("alt", items[at].cap);
      lbCap.textContent = items[at].cap;
    };
    // a component can open the viewer on its own sequence
    window.hbLightbox = function (list, i) { items = list; openLb(i); };
    var openLb = function (i) {
      lastFocus = doc.activeElement;
      show(i); lb.classList.add("is-on"); lb.setAttribute("aria-hidden", "false");
      lb.inert = false;
      suspended = Array.prototype.slice.call(root.children).filter(function (el) { return el !== lb && !el.inert && el.tagName !== 'SCRIPT'; });
      suspended.forEach(function (el) { el.inert = true; });
      root.style.overflow = "hidden";
      var x = $(".lb__x", lb); if (x) x.focus({ preventScroll: true });
    };
    var closeLb = function () {
      lb.classList.remove("is-on"); lb.setAttribute("aria-hidden", "true");
      lb.inert = true;
      suspended.forEach(function (el) { el.inert = false; });
      root.style.overflow = "";
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    shots.forEach(function (b, i) { b.addEventListener("click", function () { items = shots.map(toItem); openLb(i); }); });
    $$("[data-lb-close]", lb).forEach(function (b) { b.addEventListener("click", closeLb); });
    $$("[data-lb-prev]", lb).forEach(function (b) { b.addEventListener("click", function () { show(at - 1); }); });
    $$("[data-lb-next]", lb).forEach(function (b) { b.addEventListener("click", function () { show(at + 1); }); });
    doc.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-on")) return;
      trap(e, $$(focusables, lb));
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") show(at - 1);
      if (e.key === "ArrowRight") show(at + 1);
    });
  }

  /* ---- Phase 3 interiors: zone tabs + stage + filmstrip ---- */
  $$("[data-zones]").forEach(function (box) {
    var tabs = $$("[role=tab]", box), panels = $$("[role=tabpanel]", box);
    var stage = $("[data-stage]", box), stageImg = $(".rec-stage__img", stage), stageBg = $(".rec-stage__bg", stage), stageCap = $("[data-stage-cap]", box), count = $("[data-stage-count]", box);
    var all = $$("[data-full]", box);
    var list = all.map(function (a) { return { src: a.getAttribute("data-full"), cap: a.getAttribute("data-cap") }; });
    var cur = 0;
    box.classList.add("is-enhanced");
    var paint = function (i, focusThumb) {
      cur = i;
      var a = all[i];
      all.forEach(function (t) { t.setAttribute("aria-current", String(t === a)); });
      var next = a.getAttribute("data-full");
      if (stageImg.getAttribute("src") !== next) {
        stage.classList.add("is-swapping");
        var pre = new Image();
        pre.onload = pre.onerror = function () {
          stageImg.setAttribute("src", next);
          if (stageBg) stageBg.setAttribute("src", a.getAttribute("data-thumb"));
          stageImg.setAttribute("alt", a.getAttribute("data-cap"));
          requestAnimationFrame(function () { stage.classList.remove("is-swapping"); });
        };
        pre.src = next;
      }
      if (stageCap) stageCap.textContent = a.getAttribute("data-cap");
      if (count) count.textContent = String(i + 1).padStart(2, "0") + " / " + String(all.length).padStart(2, "0");
      var zone = a.closest("[role=tabpanel]");
      tabs.forEach(function (t) {
        var on = t.getAttribute("aria-controls") === zone.id;
        t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p) { p.hidden = p !== zone; });
      if (focusThumb) a.focus({ preventScroll: true });
    };
    all.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); paint(i); });
    });
    tabs.forEach(function (t, ti) {
      t.addEventListener("click", function () { paint(all.indexOf($("[data-full]", doc.getElementById(t.getAttribute("aria-controls"))))); });
      t.addEventListener("keydown", function (e) {
        var k = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!k) return;
        e.preventDefault();
        var nt = tabs[(ti + k + tabs.length) % tabs.length];
        nt.click(); nt.focus();
      });
    });
    $$("[data-stage-step]", box).forEach(function (b) {
      b.addEventListener("click", function () { paint((cur + Number(b.getAttribute("data-stage-step")) + all.length) % all.length); });
    });
    stage.addEventListener("click", function () { if (window.hbLightbox) window.hbLightbox(list, cur); });
    // swipe on touch
    var sx = null;
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 44) paint((cur + (dx < 0 ? 1 : -1) + all.length) % all.length);
    });
    paint(0);
  });

  /* ---- inquiry form ----
     Validates, reports, and hands off. There is no endpoint yet: replace the
     body of submitInquiry() with the real POST when the backend exists. */
  /* ---- conversion (audit §30) ----
     Set window.HB_FORM_ENDPOINT and every form on the site posts to it with
     campaign attribution attached. Until it is set the submit button stays
     disabled and the form says plainly that delivery is not connected. */
  var HB_FORM_ENDPOINT = window.HB_FORM_ENDPOINT || "";

  // UTMs persist for the session so a lead keeps the campaign that produced it
  var attribution = (function () {
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
    var store = {};
    try { store = JSON.parse(sessionStorage.getItem("hb-attr") || "{}"); } catch (e) { store = {}; }
    var q = new URLSearchParams(location.search);
    keys.forEach(function (k) { if (q.get(k)) store[k] = q.get(k); });
    if (!store.landing_page) store.landing_page = location.pathname;
    if (!store.referrer) store.referrer = document.referrer || "direct";
    try { sessionStorage.setItem("hb-attr", JSON.stringify(store)); } catch (e) {}
    return store;
  })();

  function submitInquiry(data, done) {
    Object.keys(attribution).forEach(function (k) { data.append(k, attribution[k]); });
    data.append("page", location.pathname);
    if (!HB_FORM_ENDPOINT) return done(new Error("no-endpoint"));
    fetch(HB_FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) { done(r.ok ? null : new Error("http-" + r.status)); })
      .catch(function () { done(new Error("network")); });
  }

  $$("form[data-inquiry]").forEach(function (form) {
    var submit = $("button[type=submit]", form);
    if (submit && HB_FORM_ENDPOINT) { submit.disabled = false; }

    var ok = $(".form__ok", form);
    var failEl = $(".form__fail", form);
    var btn = $("button[type=submit]", form);
    if (btn) btn.disabled = false;
    var invalidate = function (field, msg) {
      var wrap = field.closest(".field");
      wrap.classList.add("is-bad");
      var err = $(".field__err", wrap);
      if (err) err.textContent = msg;
      field.setAttribute("aria-invalid", "true");
    };
    var clear = function (field) {
      field.closest(".field").classList.remove("is-bad");
      field.removeAttribute("aria-invalid");
    };
    $$("input,select,textarea", form).forEach(function (f) {
      var error = $(".field__err", f.closest(".field"));
      if (error) { error.id = f.id + "-error"; f.setAttribute("aria-describedby", error.id); }
      f.addEventListener("input", function () { clear(f); });
      f.addEventListener("change", function () { clear(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = null;
      var name = $("[name=name]", form), email = $("[name=email]", form), phone = $("[name=phone]", form);
      if (name && name.value.trim().length < 2) { invalidate(name, "Please enter your full name."); bad = bad || name; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { invalidate(email, "Please enter a valid email address, e.g. name@example.com."); bad = bad || email; }
      if (phone && phone.value.replace(/[^\d]/g, "").length < 7) { invalidate(phone, "Please enter a phone number we can reach you on."); bad = bad || phone; }
      if (bad) { bad.focus(); return; }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }
      submitInquiry(new FormData(form), function (err) {
        if (btn) { btn.disabled = false; if (btn.dataset.label) btn.textContent = btn.dataset.label; }
        var status = err ? failEl : ok;
        if (status) {
          status.classList.add("is-on");
          status.focus({ preventScroll: true });
          status.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
        }
        if (!err) form.reset();
      });
    });
  });

  /* ---- hero film ----
     The poster still is the baseline. The film reveals only once a frame has
     decoded, so a missing or slow video never leaves a black hero. */
  var hv = $("[data-hero-video]");
  if (hv && !reduced) {
    hv.addEventListener("loadeddata", function () {
      var p = hv.play();
      var reveal = function () { hv.classList.add("is-live"); };
      if (p && p.then) p.then(reveal).catch(function () {}); else reveal();
    });
    hv.addEventListener("error", function () { hv.remove(); }, true);
    hv.preload = "auto";
    hv.load();
  } else if (hv) {
    hv.remove();
  }

  /* Decorative showcase films reveal only after a decodable frame exists. */
  $$('[data-loop-video]').forEach(function (film) {
    if (reduced) { film.remove(); return; }
    var revealFilm = function () {
      var playback = film.play();
      var reveal = function () { film.classList.add('is-live'); };
      if (playback && playback.then) playback.then(reveal).catch(function () {}); else reveal();
    };
    film.addEventListener('loadeddata', revealFilm, { once: true });
    film.addEventListener('error', function () { film.remove(); }, { once: true });
    film.preload = 'auto';
    film.load();
  });

  /* ---- unit selector (Urban Kaza) ----
     Filters the published schedule. Without JS every unit is simply visible,
     which is the correct fallback for a list of residences. */
  $$("[data-units]").forEach(function (root_) {
    var cards = $$(".unit", root_);
    var count = $(".units__count", root_);
    var empty = $(".units__empty", root_);
    var apply = function () {
      var beds = (root_.querySelector("input[name=beds]:checked") || {}).value || "";
      var band = (root_.querySelector("input[name=band]:checked") || {}).value || "";
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!beds || c.getAttribute("data-beds") === beds) &&
                 (!band || c.getAttribute("data-band") === band);
        c.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown + (shown === 1 ? " residence" : " residences");
      if (empty) empty.hidden = shown > 0;
    };
    $$("input", root_).forEach(function (i) { i.addEventListener("change", apply); });
    apply();
  });

  /* ---- floor explorer (Urban Kaza) ---- */
  $$("[data-floors]").forEach(function (list) {
    var scope = list.closest("[data-floor-scope]");
    var media = scope && $("[data-floor-media]", scope);
    $$("[data-floor]", list).forEach(function (row) {
      var swap = function () {
        $$("[data-floor]", list).forEach(function (r) { r.setAttribute("aria-current", "false"); });
        row.setAttribute("aria-current", "true");
        if (media) {
          var src = row.getAttribute("data-floor-img");
          if (src) { media.setAttribute("src", src); media.setAttribute("alt", row.getAttribute("data-floor") + " — Urban Kaza"); }
        }
      };
      row.addEventListener("mouseenter", swap);
      row.addEventListener("focus", swap);
      row.addEventListener("click", swap);
    });
  });

  /* ---- Urban Kaza location: a restrained, guided map reveal ---- */
  $$("[data-uk-map]").forEach(function (stage) {
    var triggers = $$("[data-map-trigger]", stage);
    var pins = $$("[data-map-pin]", stage);
    var mapIndex = 0;
    var mapTimer = null;
    var setMapActive = function (next) {
      mapIndex = (next + triggers.length) % triggers.length;
      triggers.forEach(function (trigger, i) { trigger.setAttribute("aria-current", String(i === mapIndex)); });
      pins.forEach(function (pin) { pin.classList.toggle("is-active", Number(pin.getAttribute("data-map-pin")) === mapIndex); });
    };
    triggers.forEach(function (trigger, i) {
      ["pointerenter", "focus", "click"].forEach(function (eventName) {
        trigger.addEventListener(eventName, function () { setMapActive(i); });
      });
    });
    setMapActive(0);
    if (!reduced && "IntersectionObserver" in window) {
      var mapObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          stage.classList.add("is-cinematic");
          if (!mapTimer) mapTimer = setInterval(function () { setMapActive(mapIndex + 1); }, 2200);
        } else if (mapTimer) {
          clearInterval(mapTimer);
          mapTimer = null;
        }
      }, { threshold: 0.3 });
      mapObserver.observe(stage);
    } else stage.classList.add("is-cinematic");
  });

  /* ---- contact locations: locally styled Leaflet / OpenStreetMap view ---- */
  $$("[data-contact-map]").forEach(function (map) {
    var canvas = $("[data-contact-map-canvas]", map);
    var title = $("[data-contact-map-title]", map);
    var locations = $$("[data-contact-location]", map);
    if (!canvas || !window.L || !locations.length) return;
    var points = locations.map(function (location) {
      return {
        lat: Number(location.getAttribute("data-location-lat")),
        lng: Number(location.getAttribute("data-location-lng")),
        name: location.getAttribute("data-location-title"),
        button: location
      };
    });
    var locationMap = L.map(canvas, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      minZoom: 10,
      maxZoom: 18
    }).setView([points[0].lat, points[0].lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(locationMap);
    L.control.zoom({ position: "topright" }).addTo(locationMap);
    var pin = L.divIcon({
      className: "hb-map-marker",
      html: '<span><i></i></span>',
      iconSize: [42, 52],
      iconAnchor: [21, 48],
      tooltipAnchor: [0, -44]
    });
    var markers = points.map(function (point) {
      return L.marker([point.lat, point.lng], { icon: pin })
        .addTo(locationMap)
        .bindTooltip(point.name, { direction: "top", permanent: false, className: "hb-map-tooltip" });
    });
    var activate = function (index) {
      var point = points[index];
      locations.forEach(function (item, i) {
        var active = i === index;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      map.setAttribute("data-active-location", point.name);
      if (title) title.textContent = point.name;
      if (reduced) locationMap.setView([point.lat, point.lng], 16);
      else locationMap.flyTo([point.lat, point.lng], 16, { duration: 1.15 });
      markers[index].openTooltip();
    };
    locations.forEach(function (location, index) {
      location.addEventListener("click", function () { activate(index); });
    });
    activate(0);
    setTimeout(function () { locationMap.invalidateSize(false); }, 120);
  });

  /* ---- Urban Kaza tower: functions move through the isometric model ---- */
  /* ---- Urban Kaza zoning model: three orthographic views x five zones ---- */
  $$("[data-zoning]").forEach(function (box) {
    var zones = $$("[data-zoning-key]", box);
    var viewBtns = $$("[data-zoning-set-view]", box);
    var load = function (img) {
      if (!img || img.getAttribute("src")) return;
      img.setAttribute("srcset", img.getAttribute("data-srcset"));
      img.setAttribute("src", img.getAttribute("data-src"));
    };
    var view = "aerial", zone = "none", armed = false;
    var paint = function () {
      box.setAttribute("data-view", view); box.setAttribute("data-zone", zone);
      $$("[data-zoning-view]", box).forEach(function (v) {
        var on = v.getAttribute("data-zoning-view") === view;
        v.hidden = !on;
        if (on && armed) $$("[data-zoning-layer]", v).forEach(load);   // warm every zone of the visible view
      });
      $$("[data-zoning-layer],[data-zoning-pin]", box).forEach(function (el) {
        var k = el.getAttribute("data-zoning-layer") || el.getAttribute("data-zoning-pin");
        el.classList.toggle("is-on", k === zone);
      });
      zones.forEach(function (z) { var on = z.getAttribute("data-zoning-key") === zone; z.setAttribute("aria-current", String(on)); z.classList.toggle("is-active", on); });
      viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-zoning-set-view") === view)); });
    };
    zones.forEach(function (z) {
      var key = z.getAttribute("data-zoning-key");
      z.addEventListener("click", function () { zone = key; paint(); });
      z.addEventListener("focus", function () { zone = key; paint(); });
      if (window.matchMedia("(hover: hover)").matches) z.addEventListener("pointerenter", function () { zone = key; paint(); });
    });
    viewBtns.forEach(function (b) { b.addEventListener("click", function () { view = b.getAttribute("data-zoning-set-view"); paint(); }); });
    zone = (zones[3] || zones[0]).getAttribute("data-zoning-key");
    // start loading once the section is near, then show the first zone
    var start = function () { armed = true; paint(); };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); start(); } }, { rootMargin: "600px 0px" });
      io.observe(box);
    } else start();
    paint();
  });
})();
