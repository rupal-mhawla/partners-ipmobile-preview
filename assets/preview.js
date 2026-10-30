const next=document.currentScript.dataset.next;
const registrationKey='ipmobile-demo-registration';
const registrationForm=document.querySelector('[data-demo-register]');
if(registrationForm){
 const password=registrationForm.elements.password,confirm=registrationForm.elements.confirm;
 const checkMatch=()=>confirm.setCustomValidity(confirm.value!==password.value?'Passwords must match.':'');
 password.addEventListener('input',checkMatch);confirm.addEventListener('input',checkMatch);
 registrationForm.addEventListener('submit',event=>{
  event.preventDefault();checkMatch();if(!registrationForm.reportValidity())return;
  const registration={company:registrationForm.elements.company.value.trim(),contact:registrationForm.elements.contact.value.trim(),email:registrationForm.elements.email.value.trim(),created:new Date().toISOString()};
  if(!registration.company||!registration.contact){document.getElementById('register-error').textContent='Enter your company and contact name.';return;}
  try{sessionStorage.setItem(registrationKey,JSON.stringify(registration));}
  catch{document.getElementById('register-error').textContent='Enable browser storage to try this registration preview.';return;}
  password.value='';confirm.value='';
  location.href='questionnaire-0.html?v=registration20261029';
 });
}
let demoRegistration=null;
try{demoRegistration=JSON.parse(sessionStorage.getItem(registrationKey)||'null');}catch{}
if(demoRegistration&&typeof demoRegistration.company==='string'&&typeof demoRegistration.email==='string'){
 if(document.querySelector('.workspace')){
  const heading=document.querySelector('.steps h2');if(heading)heading.textContent=demoRegistration.company;
  const company=document.getElementById('company'),contact=document.getElementById('contact');
  if(company)company.value=demoRegistration.company;if(contact)contact.value=demoRegistration.contact||'';
  const email=document.querySelector('.user-email');if(email)email.textContent=demoRegistration.email;
  document.querySelectorAll('p.hint').forEach(p=>{if(p.textContent.startsWith('Account email:'))p.textContent='Account email: '+demoRegistration.email;});
  window.previewResponses.restore(demoRegistration);
 }
 const tbody=document.querySelector('.admin-page tbody');
 if(tbody){
  const row=document.createElement('tr');row.setAttribute('data-partner-row','');row.dataset.search=(demoRegistration.company+' '+demoRegistration.email).toLowerCase();row.dataset.status='draft';
  const identity=document.createElement('td'),name=document.createElement('strong'),email=document.createElement('span');
  name.textContent=demoRegistration.company;email.textContent=demoRegistration.email;
  identity.append(name,document.createElement('br'),email);row.append(identity);
  for(const text of ['Draft',new Date(demoRegistration.created).toLocaleString(),'Active','Self-Registered','']){const cell=document.createElement('td');cell.textContent=text;row.append(cell);}
  const viewAnswers=document.createElement('a');viewAnswers.href='admin-review.html?self=1';viewAnswers.textContent='View answers';
  row.children[4].replaceChildren(viewAnswers);
  const registrationLabel=document.createElement('small');registrationLabel.textContent='Self-Registered';row.children[0].append(document.createElement('br'),registrationLabel);
  const accessButton=document.createElement('button');
  accessButton.type='button';accessButton.className='text-button';accessButton.setAttribute('data-registration-access','');
  const updateAccess=()=>{
   const active=demoRegistration.active!==false;
   row.children[3].textContent=active?'Active':'Disabled';
   row.dataset.status=active?'draft':'disabled';
   accessButton.textContent=active?'Disable access':'Restore access';
  };
  accessButton.addEventListener('click',()=>{
   const updated={...demoRegistration,active:demoRegistration.active===false};
   try{sessionStorage.setItem(registrationKey,JSON.stringify(updated));}
   catch{document.getElementById('preview-status').textContent='Unable to update demo access. Please try again.';return;}
   demoRegistration=updated;updateAccess();
   document.getElementById('partner-search').dispatchEvent(new Event('input'));
   document.getElementById('preview-status').textContent=updated.active?'Demo access restored.':'Demo access disabled.';
  });
  const accessActions=document.createElement('div');accessActions.append(accessButton);row.children[4].append(accessActions);
  updateAccess();
  const deleteButton=document.createElement('button');
  deleteButton.type='button';deleteButton.className='delete-invitation-button';deleteButton.textContent='Delete partner';deleteButton.setAttribute('data-delete-registration','');
  deleteButton.addEventListener('click',()=>{
   if(!window.confirm('Delete '+demoRegistration.company+' and its demo registration details?'))return;
   try{sessionStorage.removeItem(registrationKey);}catch{document.getElementById('preview-status').textContent='Unable to delete the demo registration. Please try again.';return;}
   row.remove();demoRegistration=null;
   const remaining=tbody.querySelectorAll('[data-partner-row]').length;
   document.querySelector('.admin-metrics strong').textContent=String(remaining);
   document.querySelector('.table-title>span').textContent=remaining+' accounts';
   document.getElementById('partner-search').dispatchEvent(new Event('input'));
   document.getElementById('preview-status').textContent='Demo registration deleted.';
  });
  row.lastElementChild.className='invitation-action';
  row.lastElementChild.append(deleteButton);
  tbody.prepend(row);
  const count=tbody.querySelectorAll('[data-partner-row]').length;
  document.querySelector('.admin-metrics strong').textContent=String(count);
  document.querySelector('.table-title>span').textContent=count+' accounts';
 }
}
window.previewResponses.render(demoRegistration);
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
 if(button.closest('[data-demo-register]')||button.hasAttribute('data-delete-registration')||button.hasAttribute('data-registration-access'))return;
 const text=button.textContent.trim();
 if(button.hasAttribute('data-print')){window.print();return;}
 if(demoRegistration&&button.closest('.form-panel')&&(button.value==='save'||button.value==='next')){
  try{demoRegistration=window.previewResponses.save(demoRegistration,registrationKey);}
  catch{document.getElementById('preview-status').textContent='Unable to save demo responses. Please try again.';return;}
  if(button.value==='next')location.href=next;
  else document.getElementById('preview-status').textContent='Demo responses saved in this browser tab.';
  return;
 }
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
