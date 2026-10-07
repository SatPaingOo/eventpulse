document.addEventListener('DOMContentLoaded',function(){
  var burger=document.getElementById('navBurger'), menu=document.getElementById('navMenu');
  if(burger&&menu){
    burger.addEventListener('click',function(){ var open=menu.classList.toggle('open');
      burger.setAttribute('aria-expanded',open?'true':'false');
      burger.setAttribute('aria-label',open?'Close menu':'Open menu'); });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){
      menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }); });
    document.addEventListener('click',function(e){ if(!menu.contains(e.target)&&!burger.contains(e.target)){
      menu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); } });
  }
  function epLocal(iso){ if(!iso) return ''; var d=new Date(iso); if(isNaN(d)) return iso;
    return d.toLocaleString(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); }
  function epRel(iso){ if(!iso) return ''; var d=new Date(iso); if(isNaN(d)) return '';
    // works both ways: past stamps read "3h ago", future deadlines "in 2d".
    var s=(Date.now()-d.getTime())/1000, future=s<0; if(future) s=-s;
    if(s<45) return future?'now':'just now';
    var span; var m=s/60;
    if(m<60) span=Math.round(m)+'m';
    else { var h=m/60;
      if(h<24) span=Math.round(h)+'h';
      else { var da=h/24; if(da>=30) return d.toLocaleDateString(); span=Math.round(da)+'d'; } }
    return future?'in '+span:span+' ago'; }
  // Timestamps render in UTC to match the UTC day the record is filed under
  // (local time could read a day off its day header); the local time is on hover.
  function epDT(iso){ if(!iso) return ''; var d=new Date(iso); if(isNaN(d)) return iso;
    return d.toLocaleString('en-US',{timeZone:'UTC',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})+' UTC'; }
  document.querySelectorAll('[data-utc]').forEach(function(el){
    var iso=el.getAttribute('data-utc'); if(!iso) return;
    var loc=epLocal(iso), rel=epRel(iso);
    if (el.hasAttribute('data-dt')){
      el.textContent=epDT(iso);
      el.setAttribute('title',loc+' (your local time) · '+rel);
    } else {
      el.textContent=rel?rel:loc;
      el.setAttribute('title',loc+' (local time)');
    }
  });
});