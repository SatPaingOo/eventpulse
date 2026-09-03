(function(){
  var data = window.CHART_DATA || null;
  var cv = document.getElementById('price-chart');
  if (!data || !cv) return;
  var wrap = document.getElementById('chart-wrap');
  var tip = document.getElementById('chart-tip');
  var upColor = cv.getAttribute('data-up-color') || '#34d399';
  var downColor = cv.getAttribute('data-down-color') || '#e8a020';
  var legendSw = document.querySelector('[data-legend="price"]');
  function draw(){
    var rect = cv.getBoundingClientRect();
    var W = rect.width, H = 300;
    var dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    var closes = data.closes || [];
    var n = closes.length;
    if (!n) return;
    var lo = Math.min.apply(null, closes), hi = Math.max.apply(null, closes);
    var pad = (hi - lo) * 0.08 || 1; lo -= pad; hi += pad;
    var px = function(i){ return (n === 1 ? W / 2 : i / (n - 1) * W); };
    var py = function(v){ return H - 14 - (v - lo) / (hi - lo) * (H - 34); };
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (var g = 0; g < 4; g++){ var y = 10 + g * (H - 24) / 3; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    var up = closes[n - 1] >= closes[0];
    var stroke = up ? upColor : downColor;
    if (legendSw){ legendSw.style.background = stroke; }
    var gcol = up ? 'rgba(52,211,153,' : 'rgba(232,160,32,';
    ctx.beginPath(); ctx.moveTo(px(0), py(closes[0]));
    for (var i = 1; i < n; i++) ctx.lineTo(px(i), py(closes[i]));
    ctx.lineTo(px(n - 1), H - 8); ctx.lineTo(px(0), H - 8); ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, gcol + '0.20)'); grad.addColorStop(1, gcol + '0.02)');
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(px(0), py(closes[0]));
    for (var j = 1; j < n; j++) ctx.lineTo(px(j), py(closes[j]));
    ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
    var evs = data.events || [];
    var dateIdx = {}; (data.dates || []).forEach(function(dt, k){ dateIdx[dt] = k; });
    var markers = [];
    evs.forEach(function(e){
      var idx = dateIdx[e.date];
      if (idx === undefined) return;
      var x = px(idx), y = py(closes[idx]);
      ctx.beginPath();
      ctx.moveTo(x, y - 8); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 8); ctx.lineTo(x - 5, y); ctx.closePath();
      ctx.fillStyle = (e.severity && e.severity >= 4) ? '#fb7185' : '#f6c453';
      ctx.fill();
      markers.push({x: x, y: y, e: e});
    });
    window.__epMarkers = markers;
    ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(px(n - 1), py(closes[n - 1])); ctx.lineTo(W, py(closes[n - 1])); ctx.stroke();
    ctx.setLineDash([]);
  }
  function onMove(ev){
    var rect = cv.getBoundingClientRect();
    var x = ev.clientX - rect.left, y = ev.clientY - rect.top;
    var best = null;
    (window.__epMarkers || []).forEach(function(m){ var dx = m.x - x, dy = m.y - y; if (dx*dx + dy*dy < 64) best = m; });
    if (!best || !tip){ return; }
    tip.classList.remove('hidden');
    tip.style.left = (best.x + 10) + 'px';
    tip.style.top = (best.y - 10) + 'px';
    tip.innerHTML = '<div style="font-weight:600;color:#f6c453;margin-bottom:2px">' + (best.e.event_type || 'event') + ' · ' + (best.e.region || '') + ' · sev ' + (best.e.severity || '') + '</div><div style="max-width:240px">' + (best.e.summary || '') + '</div>';
  }
  if (cv){ cv.addEventListener('mousemove', onMove); cv.addEventListener('mouseleave', function(){ if (tip) tip.classList.add('hidden'); }); }
  window.addEventListener('resize', draw);
  draw();
})();