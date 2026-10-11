const next=document.currentScript.dataset.next;
document.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
 const text=button.textContent.trim();
 if(button.hasAttribute('data-print')){window.print();return;}
 if(button.value==='next'||['Sign in','Set password and continue','Submit questionnaire'].includes(text)){location.href=next;return;}
 if(text==='Sign out'){location.href='login.html';return;}
 document.getElementById('preview-status').textContent='Preview only — no changes were saved and no email was sent.';
}));
document.querySelectorAll('[data-unknown]').forEach(box=>box.addEventListener('change',()=>box.closest('[data-question]').querySelectorAll('input:not([data-unknown]),select,textarea').forEach(input=>input.disabled=box.checked)));
const search=document.getElementById('partner-search'),status=document.getElementById('partner-status');
if(search&&status){const filter=()=>{let count=0;const rows=[...document.querySelectorAll('[data-partner-row]')];rows.forEach(row=>{row.hidden=!(row.dataset.search.includes(search.value.trim().toLowerCase())&&(status.value==='all'||row.dataset.status===status.value));if(!row.hidden)count++;});document.getElementById('partner-results').textContent=`${count} of ${rows.length} accounts shown`;};search.addEventListener('input',filter);status.addEventListener('change',filter);}
