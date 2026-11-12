(function () {
  "use strict";
  var PW = "heyduhacker123";
  var apps = [
    { id: "google", name: "Google", icon: "🔍" },
    { id: "games", name: "Spiele", icon: "🕹️" },
    { id: "roblox", name: "Roblox", icon: "🎮" },
    { id: "files", name: "Dateien", icon: "📁" },
    { id: "terminal", name: "Terminal", icon: "⬛" },
    { id: "notes", name: "Notizen", icon: "📝" },
    { id: "calculator", name: "Rechner", icon: "🔢" },
    { id: "settings", name: "Einstellungen", icon: "⚙️" }
  ];
  var wins = new Map();
  var z = 100;
  var focused = null;
  var vfs = {};
  try { vfs = JSON.parse(localStorage.getItem("vpc_vfs") || "{}"); } catch (e) {}
  function $(id) { return document.getElementById(id); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function toast(t, b, i) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = (i || "") + " " + t + ": " + b;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2800);
  }
  function saveVfs() {
    try { localStorage.setItem("vpc_vfs", JSON.stringify(vfs)); } catch (e) {}
  }

  async function boot() {
    var bios = $("bios");
    var lines = ["Windos 5", "", "CPU OK", "RAM OK", "Google OK", "Spiele OK", ""];
    for (var i = 0; i < lines.length; i++) {
      bios.textContent += lines[i] + "\n";
      await sleep(40);
    }
    await sleep(60);
    bios.classList.add("hidden");
    var bootEl = $("boot");
    bootEl.classList.remove("hidden");
    var bar = $("bar");
    var steps = [["System", 30], ["Spiele", 70], ["Fertig", 100]];
    for (var j = 0; j < steps.length; j++) {
      $("loadmsg").textContent = "Lade " + steps[j][0] + "…";
      bar.style.width = steps[j][1] + "%";
      await sleep(150);
    }
    bootEl.classList.add("fade");
    await sleep(250);
    bootEl.classList.add("hidden");
  }

  function login() {
    return new Promise(function (resolve) {
      var ls = $("login");
      ls.classList.remove("hidden");
      $("lf").onsubmit = function (e) {
        e.preventDefault();
        var v = $("lp").value;
        if (v === PW || v === "") {
          ls.classList.add("hidden");
          $("desk").classList.remove("hidden");
          resolve();
        } else {
          $("le").textContent = "Falsches Passwort";
        }
      };
      setTimeout(function () { $("lp").focus(); }, 80);
    });
  }

  function desktop() {
    var icons = [
      { id: "google", name: "Google", icon: "🔍" },
      { id: "games", name: "Spiele", icon: "🕹️" },
      { id: "roblox", name: "Roblox", icon: "🎮" },
      { id: "files", name: "Dateien", icon: "📁" },
      { id: "terminal", name: "Terminal", icon: "⬛" },
      { id: "notes", name: "Notizen", icon: "📝" },
      { id: "calculator", name: "Rechner", icon: "🔢" }
    ];
    var cont = $("icons");
    icons.forEach(function (ic) {
      var el = document.createElement("div");
      el.className = "icon";
      el.innerHTML = '<div class="ii">' + ic.icon + '</div><div class="il">' + ic.name + "</div>";
      var t = 0;
      function open() { openApp(ic.id); }
      el.onclick = function (e) {
        e.stopPropagation();
        var n = Date.now();
        if (n - t < 400) { open(); t = 0; }
        else if (el.classList.contains("on")) open();
        else {
          document.querySelectorAll(".icon").forEach(function (x) { x.classList.remove("on"); });
          el.classList.add("on");
          t = n;
        }
      };
      el.ondblclick = open;
      cont.appendChild(el);
    });
    var list = $("alist");
    apps.forEach(function (a) {
      var el = document.createElement("div");
      el.className = "si";
      el.innerHTML = '<span style="font-size:20px">' + a.icon + "</span><span>" + a.name + "</span>";
      el.onclick = function () {
        openApp(a.id);
        $("start").classList.add("hidden");
      };
      list.appendChild(el);
    });
    $("sbtn").onclick = function () { $("start").classList.toggle("hidden"); };
    $("desk").onclick = function (e) {
      if (e.target.id === "desk" || e.target.classList.contains("wp")) {
        $("start").classList.add("hidden");
      }
    };
  }

  function openApp(id, extra) {
    var app = apps.find(function (a) { return a.id === id; }) || { id: id, name: id, icon: "📦" };
    var wid = "w" + Date.now();
    var sizes = { google: [820, 560], games: [520, 480], roblox: [600, 460], game: [400, 480], files: [440, 340], terminal: [460, 300] };
    var sz = sizes[id] || [400, 300];
    var win = document.createElement("div");
    win.className = "win focus";
    win.id = wid;
    win.style.cssText = "left:" + (26 + wins.size * 12) + "px;top:" + (20 + wins.size * 12) + "px;width:" + sz[0] + "px;height:" + sz[1] + "px;z-index:" + (++z);
    var title = (extra && extra.title) || app.name;
    var icon = (extra && extra.icon) || app.icon;
    win.innerHTML = '<div class="wt"><span style="margin-right:6px">' + icon + '</span><span class="t">' + title + '</span><div class="wc"><button class="wb" data-a="min">─</button><button class="wb" data-a="max">□</button><button class="wb x" data-a="close">✕</button></div></div><div class="wbody" id="' + wid + '_c"></div>';
    $("wins").appendChild(win);
    wins.set(wid, { el: win, id: wid, appId: id, max: false, min: false });
    win.querySelectorAll(".wb").forEach(function (btn) {
      function f(e) {
        e.preventDefault();
        e.stopPropagation();
        var a = btn.getAttribute("data-a");
        if (a === "close") closeW(wid);
        else if (a === "min") minW(wid);
        else if (a === "max") maxW(wid);
      }
      btn.onclick = f;
      btn.ontouchend = function (e) { e.preventDefault(); f(e); };
    });
    win.onmousedown = function () { focusW(wid); };
    drag(win, wid);
    render(id, $(wid + "_c"), wid, extra);
    focusW(wid);
    taskbar();
  }

  function render(id, c, wid, extra) {
    if (id === "calculator") {
      c.innerHTML = '<div class="calc"><div class="d" id="' + wid + '_d">0</div>' +
        ["C", "÷", "×", "⌫", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "."].map(function (x) {
          return '<button data-k="' + x + '">' + x + "</button>";
        }).join("") + "</div>";
      var cur = "0", op = null, prev = null;
      var d = $(wid + "_d");
      c.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () {
          var k = b.getAttribute("data-k");
          if ((k >= "0" && k <= "9") || k === ".") {
            cur = cur === "0" && k !== "." ? k : cur + k;
            d.textContent = cur;
          } else if (k === "C") { cur = "0"; op = null; prev = null; d.textContent = cur; }
          else if (k === "⌫") { cur = cur.slice(0, -1) || "0"; d.textContent = cur; }
          else if (k === "=") {
            if (op && prev !== null) {
              var a = parseFloat(prev), b2 = parseFloat(cur);
              var map = { "+": a + b2, "-": a - b2, "×": a * b2, "÷": a / b2 };
              cur = String(map[op]);
              d.textContent = cur;
              op = null; prev = null;
            }
          } else { prev = cur; op = k; cur = "0"; }
        };
      });
    } else if (id === "notes") {
      c.innerHTML = '<textarea class="notes" id="' + wid + '_ta"></textarea>';
      var ta = $(wid + "_ta");
      ta.value = localStorage.getItem("vpc_notes") || "";
      ta.oninput = function () { localStorage.setItem("vpc_notes", ta.value); };
    } else if (id === "terminal") {
      c.innerHTML = '<div class="term"><div class="term-o" id="' + wid + '_o">Windos 5\nhelp · games · google\n\n</div><div class="term-r"><span style="color:#0f0;margin-right:6px">></span><input id="' + wid + '_i"></div></div>';
      var o = $(wid + "_o"), i = $(wid + "_i");
      i.onkeydown = function (e) {
        if (e.key !== "Enter") return;
        var cmd = i.value.trim();
        i.value = "";
        o.textContent += "> " + cmd + "\n";
        if (cmd === "help") o.textContent += "help, clear, games, google, ls\n";
        else if (cmd === "clear") o.textContent = "";
        else if (cmd === "games") openApp("games");
        else if (cmd === "google") openApp("google");
        else if (cmd === "ls") o.textContent += (Object.keys(vfs).join("\n") || "(leer)") + "\n";
        else if (cmd) o.textContent += "?\n";
        o.scrollTop = 1e9;
      };
      setTimeout(function () { i.focus(); }, 50);
    } else if (id === "google") googleApp(c, wid);
    else if (id === "games") gamesFolder(c, wid);
    else if (id === "game") playGame(c, wid, (extra && extra.n) || 1);
    else if (id === "roblox") robloxApp(c, wid);
    else if (id === "files") filesApp(c, wid);
    else if (id === "settings") {
      c.innerHTML = '<div style="padding:16px"><h2>Einstellungen</h2><p style="opacity:.7;margin-top:8px">Windos 5 · Google · 10 Spiele</p></div>';
    }
  }

  function googleApp(c, wid) {
    c.innerHTML = '<div class="gwrap"><div class="gbar"><button type="button" id="' + wid + '_h">⌂</button><input id="' + wid + '_q" placeholder="Bei Google suchen"><button type="button" id="' + wid + '_go" class="btn btn-p" style="padding:6px 12px;color:#fff">Suche</button></div><div class="gpane" id="' + wid + '_p"></div></div>';
    var pane = $(wid + "_p");
    var inp = $(wid + "_q");
    function home() {
      pane.innerHTML = '<div class="ghome"><div class="glogo">Google</div><form id="' + wid + '_f"><input id="' + wid + '_q2" placeholder="Suchen…"><button type="submit">Google Suche</button></form></div>';
      $(wid + "_f").onsubmit = function (e) {
        e.preventDefault();
        go($(wid + "_q2").value);
      };
      inp.value = "";
    }
    function go(q) {
      q = (q || "").trim();
      if (!q) return home();
      inp.value = q;
      var u = "https://www.google.com/search?igu=1&q=" + encodeURIComponent(q);
      pane.innerHTML = "";
      var fr = document.createElement("iframe");
      fr.src = u;
      fr.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:none;background:#fff";
      pane.appendChild(fr);
      setTimeout(function () {
        var tip = document.createElement("div");
        tip.style.cssText = "position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:8px 12px;border-radius:8px;font-size:12px;z-index:5;display:flex;gap:8px";
        tip.innerHTML = "<span>Leer?</span>";
        var b = document.createElement("button");
        b.className = "btn btn-p";
        b.style.cssText = "padding:4px 10px;font-size:12px";
        b.textContent = "DuckDuckGo";
        b.onclick = function () {
          fr.src = "https://duckduckgo.com/?q=" + encodeURIComponent(q);
        };
        tip.appendChild(b);
        pane.appendChild(tip);
        setTimeout(function () { tip.remove(); }, 5000);
      }, 3500);
    }
    $(wid + "_go").onclick = function () { go(inp.value); };
    inp.onkeydown = function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        go(inp.value);
      }
    };
    $(wid + "_h").onclick = home;
    home();
  }

  var GAMES = [
    { n: 1, name: "Spiel 1", sub: "Ragdoll Sandbox", desc: "Physik-Sandbox" },
    { n: 2, name: "Spiel 2", sub: "Snake", desc: "Schlange" },
    { n: 3, name: "Spiel 3", sub: "Pong", desc: "Ball" },
    { n: 4, name: "Spiel 4", sub: "Breakout", desc: "Ziegel" },
    { n: 5, name: "Spiel 5", sub: "Memory", desc: "Paare" },
    { n: 6, name: "Spiel 6", sub: "TicTacToe", desc: "3 gewinnt" },
    { n: 7, name: "Spiel 7", sub: "Clicker", desc: "Klicken" },
    { n: 8, name: "Spiel 8", sub: "Flappy", desc: "Fliegen" },
    { n: 9, name: "Spiel 9", sub: "Maze", desc: "Labyrinth" },
    { n: 10, name: "Spiel 10", sub: "Reaction", desc: "Reaktion" }
  ];

  function gamesFolder(c, wid) {
    c.innerHTML = '<div class="gfolder"><h2>🕹️ Spiele</h2><p class="desc">10 Spiele – jedes Modul separat geladen.</p><div class="ggrid">' +
      GAMES.map(function (g) {
        return '<button type="button" class="gcard" data-n="' + g.n + '"><div class="gn">' + g.name + '</div><div class="gs">' + g.sub + '</div><div class="gd">' + g.desc + "</div></button>";
      }).join("") + "</div></div>";
    c.querySelectorAll("[data-n]").forEach(function (b) {
      b.onclick = function () {
        var n = +b.getAttribute("data-n");
        var g = GAMES.find(function (x) { return x.n === n; });
        openApp("game", { n: n, title: g.name + " – " + g.sub, icon: "🕹️" });
      };
    });
  }

  function loadGameScript(n) {
    return new Promise(function (resolve, reject) {
      if (window.W5Games && window.W5Games[n]) {
        resolve(window.W5Games[n]);
        return;
      }
      var s = document.createElement("script");
      s.src = "games/spiel" + n + ".js";
      s.onload = function () {
        if (window.W5Games && window.W5Games[n]) resolve(window.W5Games[n]);
        else reject(new Error("Spiel " + n + " nicht gefunden"));
      };
      s.onerror = function () { reject(new Error("Laden fehlgeschlagen: Spiel " + n)); };
      document.head.appendChild(s);
    });
  }

  function playGame(c, wid, n) {
    c.innerHTML = '<div class="gplay"><div class="ginfo">Lade Spiel ' + n + "…</div></div>";
    loadGameScript(n).then(function (startFn) {
      c.innerHTML = '<div class="gplay"><canvas id="' + wid + '_cv" width="360" height="400"></canvas><div class="ginfo" id="' + wid + '_info"></div><button class="btn btn-s" id="' + wid + '_rst">Neu</button></div>';
      var canvas = $(wid + "_cv");
      var ctx = canvas.getContext("2d");
      var info = $(wid + "_info");
      var stop = startFn(canvas, ctx, info);
      $(wid + "_rst").onclick = function () {
        if (typeof stop === "function") stop();
        playGame(c, wid, n);
      };
    }).catch(function (err) {
      c.innerHTML = '<div style="padding:16px;color:#f55">' + err.message + "</div>";
    });
  }

  function robloxApp(c, wid) {
    c.innerHTML = '<div class="rx"><div class="big">🎮</div><h1>Roblox</h1><p>Launcher</p><div class="acts"><button class="btn btn-p" id="' + wid + '_c">▶ Client starten</button><button class="btn btn-s" id="' + wid + '_w">Website</button></div><div class="rx-note">Echte Roblox-Spiele brauchen den Client. Die 10 Spiele im Ordner Spiele laufen hier direkt.</div></div>';
    $(wid + "_c").onclick = function () {
      var a = document.createElement("a");
      a.href = "roblox://";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("Roblox", "Client…", "🎮");
    };
    $(wid + "_w").onclick = function () {
      c.style.position = "relative";
      c.innerHTML = '<div class="rxframe"><div class="top"><button class="btn btn-s" id="' + wid + '_b">←</button></div><iframe src="https://translate.google.com/translate?hl=de&sl=auto&tl=de&u=' + encodeURIComponent("https://www.roblox.com") + '" style="flex:1;border:none;width:100%"></iframe></div>';
      $(wid + "_b").onclick = function () { robloxApp(c, wid); };
    };
  }

  function filesApp(c, wid) {
    function draw() {
      var n = Object.keys(vfs);
      c.innerHTML = '<div class="files"><h2>📁 Dateien</h2><input type="file" id="' + wid + '_f" multiple style="display:none"><button class="btn btn-p" id="' + wid + '_u">📤 Hochladen</button><div style="margin-top:12px">' +
        (n.length ? n.map(function (x) {
          return '<div class="frow"><span>📄</span><div class="fmeta"><div class="fname">' + x + '</div></div><button class="btn btn-p" data-d="' + x + '" style="padding:6px 10px;font-size:12px">⬇</button><button class="btn btn-s" data-r="' + x + '" style="padding:6px 8px">🗑</button></div>';
        }).join("") : '<p style="opacity:.5;padding:12px;text-align:center">Leer</p>') + "</div></div>";
      $(wid + "_u").onclick = function () { $(wid + "_f").click(); };
      $(wid + "_f").onchange = async function (e) {
        var files = e.target.files || [];
        for (var i = 0; i < files.length; i++) {
          var f = files[i];
          if (f.size > 3e6) continue;
          var data = await new Promise(function (res, rej) {
            var r = new FileReader();
            r.onload = function () { res(r.result); };
            r.onerror = rej;
            r.readAsDataURL(f);
          });
          vfs[f.name] = { data: data, size: f.size };
          toast("OK", f.name, "📥");
        }
        saveVfs();
        draw();
      };
      c.querySelectorAll("[data-d]").forEach(function (b) {
        b.onclick = function () {
          var a = document.createElement("a");
          a.href = vfs[b.getAttribute("data-d")].data;
          a.download = b.getAttribute("data-d");
          a.click();
        };
      });
      c.querySelectorAll("[data-r]").forEach(function (b) {
        b.onclick = function () {
          delete vfs[b.getAttribute("data-r")];
          saveVfs();
          draw();
        };
      });
    }
    draw();
  }

  function closeW(id) {
    var w = wins.get(id);
    if (!w) return;
    w.el.remove();
    wins.delete(id);
    taskbar();
  }
  function minW(id) {
    var w = wins.get(id);
    if (!w) return;
    w.el.classList.add("min");
    w.min = true;
    taskbar();
  }
  function maxW(id) {
    var w = wins.get(id);
    if (!w) return;
    w.el.classList.toggle("max");
    w.max = w.el.classList.contains("max");
  }
  function focusW(id) {
    wins.forEach(function (w, i) { w.el.classList.toggle("focus", i === id); });
    var w = wins.get(id);
    if (w) {
      w.el.style.zIndex = ++z;
      w.el.classList.remove("min");
      w.min = false;
      focused = id;
    }
    taskbar();
  }
  function taskbar() {
    var tb = $("tb-apps");
    tb.innerHTML = "";
    wins.forEach(function (w, id) {
      var app = apps.find(function (a) { return a.id === w.appId; }) || { icon: "🕹️" };
      var b = document.createElement("button");
      b.className = "tb-a" + (focused === id ? " on" : "");
      b.textContent = app.icon || "📦";
      b.onclick = function () {
        if (w.min || focused !== id) focusW(id);
        else minW(id);
      };
      tb.appendChild(b);
    });
  }
  function drag(el, id) {
    var tb = el.querySelector(".wt");
    var ox, oy, sl, st, d = false;
    function start(x, y) {
      var w = wins.get(id);
      if (!w || w.max) return;
      d = true;
      ox = x; oy = y;
      sl = parseInt(el.style.left) || 0;
      st = parseInt(el.style.top) || 0;
      focusW(id);
    }
    function move(x, y) {
      if (!d) return;
      el.style.left = Math.max(0, sl + x - ox) + "px";
      el.style.top = Math.max(0, st + y - oy) + "px";
    }
    tb.onmousedown = function (e) {
      if (e.target.closest(".wb")) return;
      start(e.clientX, e.clientY);
      e.preventDefault();
    };
    window.addEventListener("mousemove", function (e) { move(e.clientX, e.clientY); });
    window.addEventListener("mouseup", function () { d = false; });
    tb.ontouchstart = function (e) {
      if (e.target.closest(".wb")) return;
      var t = e.touches[0];
      start(t.clientX, t.clientY);
    };
    tb.ontouchmove = function (e) {
      if (!d) return;
      e.preventDefault();
      var t = e.touches[0];
      move(t.clientX, t.clientY);
    };
    tb.ontouchend = function () { d = false; };
  }
  function clock() {
    function t() {
      $("clock").textContent = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    }
    t();
    setInterval(t, 1000);
  }

  boot().then(login).then(function () {
    desktop();
    clock();
    toast("Windos 5", "Bereit", "🔴");
  });
})();
