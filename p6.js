window.__W5C=window.__W5C||[];
window.__W5C[6]=
"\"||/clock/i.test(f.name||\"\"))){clockApp(c,wid);return;}\n  c.innerHTML='<div style=\"padding:20px\"><h2>'+(extra&&extra.title||\"Programm\")+'</h2><p style=\"opacity:.7;margin-top:8px\">Virtuelle .exe \u2013 kein"+
"e echte Windows-Binary.</p><button class=\"btn btn-p\" id=\"'+wid+'_run\">Starten</button></div>';\n  $(wid+\"_run\").onclick=function(){openApp(\"clock\");};\n}\nfunction clock(){function t(){$(\"clock\").textCon"+
"tent=new Date().toLocaleTimeString(\"de-DE\",{hour:\"2-digit\",minute:\"2-digit\"});}t();setInterval(t,1000);}\nboot().then(login).then(function(){desktop();clock();initVFSClockExe();toast(\"Windos 5\",\"Ziehen"+
" an Titelleiste \u00b7 Proxy an\",\"\u2b1b\");\ntry{window.open=function(u){toast(\"Browser\",\"Kein neuer Tab \u2013 nutze Adresszeile\",\"\ud83c\udf0a\");return null;};}catch(e){}\n});\n})();\n";
