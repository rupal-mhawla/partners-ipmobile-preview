const next=document.currentScript.dataset.next;
document.querySelectorAll('[data-vendor-details]').forEach(details=>{
 const question=details.closest('[data-question]'),select=question.querySelector('select'),unknown=question.querySelector('[data-unknown]'),input=details.querySelector('input');
 const update=()=>{const shown=select.value==='Yes'&&!unknown.checked;details.hidden=!shown;input.disabled=!shown;};
 document.addEventListener('change',event=>{if(event.target===select||event.target===unknown)update();});
 update();
});
document.querySelectorAll('[data-provider-select]').forEach(select=>{
 const update=()=>{document.getElementById(select.getAttribute('aria-controls')).hidden=!['Other','Custom / in-house system'].includes(select.value);};
 select.addEventListener('change',update);update();
});
document.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
 const text=button.textContent.trim();
 if(button.hasAttribute('data-print')){window.print();return;}
 if(button.value==='next'||['Sign in','Set password and continue','Submit questionnaire'].includes(text)){location.href=next;return;}
 if(text==='Sign out'){location.href='login.html?v=menu4';return;}
 document.getElementById('preview-status').textContent='Preview only — no changes were saved and no email was sent.';
}));
document.querySelectorAll('[data-unknown]').forEach(box=>box.addEventListener('change',()=>box.closest('[data-question]').querySelectorAll('input:not([data-unknown]),select,textarea').forEach(input=>input.disabled=box.checked)));
const search=document.getElementById('partner-search'),status=document.getElementById('partner-status');
if(search&&status){const filter=()=>{let count=0;const rows=[...document.querySelectorAll('[data-partner-row]')];rows.forEach(row=>{row.hidden=!(row.dataset.search.includes(search.value.trim().toLowerCase())&&(status.value==='all'||row.dataset.status===status.value));if(!row.hidden)count++;});document.getElementById('partner-results').textContent=`${count} of ${rows.length} accounts shown`;};search.addEventListener('input',filter);status.addEventListener('change',filter);}
const currentPage=location.pathname.split('/').pop()||'index.html';
const currentMenu=currentPage.startsWith('questionnaire')?'questionnaire-0.html':currentPage==='admin-review.html'?'admin.html':currentPage==='submitted.html'?'review.html':currentPage;
document.querySelectorAll('.preview-menu a').forEach(link=>{if(link.getAttribute('href').split('?')[0]===currentMenu)link.setAttribute('aria-current','page');});
const menu=document.querySelector('.preview-menu');
if(menu&&window.matchMedia('(max-width:760px)').matches)menu.removeAttribute('open');
const menuSize=window.matchMedia('(max-width:760px)');
menuSize.addEventListener('change',event=>{if(menu)menu.open=!event.matches;});
const milestoneBox=document.querySelector('[name="q47_unknown"]');
if(milestoneBox){const updateMilestone=()=>{document.querySelector('.milestone-unknown').hidden=!milestoneBox.checked;};milestoneBox.addEventListener('change',updateMilestone);updateMilestone();}
