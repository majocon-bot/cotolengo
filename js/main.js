(function(){
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const CORREO='cottolengoriocuarto@consolacion.org', CORREO_DIR='direccion.cottolengoriocuarto@consolacion.org';

  // Iconos
  if(window.lucide) lucide.createIcons();

  const anio=$('#anio'); if(anio) anio.textContent=new Date().getFullYear();

  // Scroll: cabecera, progreso, botón arriba
  const cab=$('#cab'), arriba=$('#arriba'), prog=$('#progreso');
  function alScroll(){
    const h=document.documentElement, max=h.scrollHeight-h.clientHeight, p=max>0?h.scrollTop/max*100:0;
    if(prog) prog.style.width=p+'%';
    if(cab) cab.classList.toggle('scrolled',scrollY>40);
    if(arriba) arriba.classList.toggle('ver',scrollY>700);
  }
  addEventListener('scroll',alScroll,{passive:true}); alScroll();
  if(arriba) arriba.onclick=()=>scrollTo({top:0,behavior:'smooth'});

  // Menú móvil
  const hamb=$('#hamb'), menu=$('#menu'), velo=$('#velo');
  function menuToggle(f){const a=menu.classList.toggle('abierto',f);hamb.classList.toggle('abierto',a);velo.classList.toggle('ver',a);hamb.setAttribute('aria-expanded',a)}
  if(hamb&&menu&&velo){
    hamb.onclick=()=>menuToggle(); velo.onclick=()=>menuToggle(false);
    $$('#menu a').forEach(a=>a.addEventListener('click',()=>menuToggle(false)));
  }

  // Revelar al hacer scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ver');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -50px 0px'});
  $$('.rv').forEach(el=>io.observe(el));

  // Contadores
  const ioC=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return; const el=e.target,fin=parseFloat(el.dataset.fin),dec=+el.dataset.dec||0,t0=performance.now(),dur=2000;
    (function paso(t){const p=Math.min((t-t0)/dur,1),v=fin*(1-Math.pow(1-p,4));el.textContent=v.toFixed(dec).replace('.',',');if(p<1)requestAnimationFrame(paso)})(t0);
    ioC.unobserve(el);
  }),{threshold:.6});
  $$('.cont').forEach(el=>ioC.observe(el));

  // Pestañas (página Sumate). Se pueden abrir con un enlace: sumate.html#voluntariado
  function abrir(id){
    if(!document.getElementById(id)||!document.getElementById(id).classList.contains('panel'))return false;
    $$('.tab').forEach(b=>b.classList.toggle('activa',b.dataset.panel===id));
    $$('.panel').forEach(p=>p.classList.toggle('activo',p.id===id));
    return true;
  }
  $$('.tab').forEach(b=>b.onclick=()=>abrir(b.dataset.panel));
  function desdeHash(){
    const id=location.hash.slice(1);
    if(id&&abrir(id)){const t=$('.tabs');if(t)setTimeout(()=>t.scrollIntoView({behavior:'smooth'}),50)}
  }
  addEventListener('hashchange',desdeHash); desdeHash();

  // Toast
  let tt; function aviso(m){const t=$('#toast');if(!t)return;t.querySelector('span').textContent=m;t.classList.add('ver');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('ver'),2800)}

  // Copiar alias
  $$('[data-copiar]').forEach(b=>b.onclick=()=>{const v=b.dataset.copiar;(navigator.clipboard?navigator.clipboard.writeText(v):Promise.reject()).then(()=>aviso('Alias copiado: '+v)).catch(()=>aviso('Alias: '+v))});

  // Visita virtual (sustituir cuando esté el vídeo)
  const btnVisita=$('#btnVisita'); if(btnVisita) btnVisita.onclick=()=>aviso('La visita virtual estará disponible muy pronto.');

  // Formularios → abren el correo del visitante
  const mailto=(d,a,c)=>location.href='mailto:'+d+'?subject='+encodeURIComponent(a)+'&body='+encodeURIComponent(c);
  const fC=$('#formContacto');
  if(fC){
    const motivo=new URLSearchParams(location.search).get('motivo');
    if(motivo) $('#cMotivo').value=motivo;
    fC.onsubmit=e=>{e.preventDefault();mailto(CORREO,'Web – '+$('#cMotivo').value,'Nombre: '+$('#cNombre').value+'\nCorreo: '+$('#cCorreo').value+'\n\n'+$('#cMensaje').value);aviso('Abriendo tu correo para enviar el mensaje…')};
  }
  const fE=$('#formEtico'), anon=$('#anonimo');
  if(fE&&anon){
    anon.onchange=()=>$('#datosEtico').style.display=anon.checked?'none':'';
    fE.onsubmit=e=>{e.preventDefault();const q=anon.checked?'Comunicación ANÓNIMA':'Nombre: '+$('#eNombre').value+'\nCorreo: '+$('#eCorreo').value;mailto(CORREO_DIR,'Canal Ético – '+$('#eTipo').value,q+'\n\n'+$('#eMensaje').value);aviso('Abriendo tu correo para enviar la comunicación…')};
  }
})();

// Visor de fotos de la galería
(function(){
  const dlg=document.getElementById('visorFoto'); if(!dlg||!dlg.showModal) return;
  const enlaces=[...document.querySelectorAll('[data-galeria]')]; let i=0, origen=null;
  const img=dlg.querySelector('img'), cap=dlg.querySelector('figcaption');
  function mostrar(n){i=(n+enlaces.length)%enlaces.length;const a=enlaces[i],m=a.querySelector('img');img.src=a.href;img.alt=m.alt;cap.textContent=m.alt+' ('+(i+1)+' de '+enlaces.length+')'}
  enlaces.forEach((a,n)=>a.addEventListener('click',e=>{e.preventDefault();origen=a;mostrar(n);dlg.showModal()}));
  dlg.querySelector('.vf-cerrar').onclick=()=>dlg.close();
  dlg.querySelector('.vf-ant').onclick=()=>mostrar(i-1);
  dlg.querySelector('.vf-sig').onclick=()=>mostrar(i+1);
  dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
  dlg.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')mostrar(i-1);if(e.key==='ArrowRight')mostrar(i+1)});
  dlg.addEventListener('close',()=>{if(origen)origen.focus()});
})();
