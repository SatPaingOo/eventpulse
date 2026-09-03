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
    var s=(Date.now()-d.getTime())/1000; if(s<45) return 'just now';
    var m=s/60; if(m<60) return Math.round(m)+'m ago'; var h=m/60; if(h<24) return Math.round(h)+'h ago';
    var da=h/24; if(da<30) return Math.round(da)+'d ago'; return d.toLocaleDateString(); }
  function epDT(iso){ if(!iso) return ''; var d=new Date(iso); if(isNaN(d)) return iso;
    return d.toLocaleString(undefined,{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}); }
  document.querySelectorAll('[data-utc]').forEach(function(el){
    var iso=el.getAttribute('data-utc'); if(!iso) return;
    var loc=epLocal(iso), rel=epRel(iso);
    if (el.hasAttribute('data-dt')){
      el.textContent=epDT(iso);
      el.setAttribute('title',rel+' (local time)');
    } else {
      el.textContent=rel?rel:loc;
      el.setAttribute('title',loc+' (local time)');
    }
  });
});