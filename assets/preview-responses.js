// Browser-tab-only demo data; never stores credentials or contacts a server.
window.previewResponses={
 restore(registration){
  const panel=document.querySelector('.form-panel');if(!panel)return;
  const section=location.pathname.split('/').pop();
  const saved=registration.sections?.[section];
  panel.querySelectorAll('input,select,textarea').forEach(input=>{
   if(!input.name)return;
   const value=saved?.fields?.[input.name];
   if(input.type==='checkbox')input.checked=Array.isArray(value)&&value.includes(input.value);
   else input.value=typeof value==='string'?value:'';
  });
  if(!saved){
   const company=document.getElementById('company'),contact=document.getElementById('contact');
   if(company)company.value=registration.company;if(contact)contact.value=registration.contact||'';
  }
  panel.querySelectorAll('[data-unknown]').forEach(box=>box.closest('[data-question]').querySelectorAll('input:not([data-unknown]),select,textarea').forEach(input=>input.disabled=box.checked));
  const hint=document.querySelector('.steps>.hint');if(hint)hint.textContent='Demo responses are saved in this browser tab. Use Save before leaving a section.';
 },
 save(registration,key){
  const panel=document.querySelector('.form-panel');if(!panel)return registration;
  const fields=Object.create(null),items=[];
  const label=input=>(input.labels?.[0]?.textContent||input.name).trim();
  panel.querySelectorAll('input,select,textarea').forEach(input=>{
   if(!input.name||input.type==='password')return;
   if(input.type==='checkbox'){fields[input.name]??=[];if(input.checked)fields[input.name].push(input.value);}
   else fields[input.name]=input.value;
  });
  const questions=[...panel.querySelectorAll('[data-question]')];
  if(questions.length){
   questions.forEach(question=>{
    const lines=[];
    const unknown=question.querySelector('[data-unknown]');
    if(unknown?.checked)lines.push('Not sure / discuss with IP Mobile');
    question.querySelectorAll('input,select,textarea').forEach(input=>{
     if(input===unknown||!input.value.trim()||input.disabled||input.hasAttribute('data-retain'))return;
     if(input.type==='checkbox'){if(input.checked)lines.push(label(input));return;}
     const main=/^q\d+$/.test(input.name);
     lines.push(main?input.value:label(input)+': '+input.value);
    });
    if(lines.length)items.push({label:question.querySelector('legend').textContent.trim().replace(/^(\d+)/,'$1 · '),answer:lines.join('\n')});
   });
  }else{
   panel.querySelectorAll('input,select,textarea').forEach(input=>{if(input.value.trim()&&!input.disabled&&!input.closest('[hidden]'))items.push({label:label(input),answer:input.value});});
  }
  const section=location.pathname.split('/').pop();
  const updated={...registration,sections:{...registration.sections,[section]:{title:panel.querySelector('h1').textContent.trim(),fields,items}},updated:new Date().toISOString()};
  if(fields.company!==undefined){updated.company=fields.company.trim()||registration.company;updated.contact=fields.contact.trim();}
  sessionStorage.setItem(key,JSON.stringify(updated));
  const state=panel.querySelector('.save-state');if(state)state.textContent='Saved in this browser tab: '+new Date(updated.updated).toLocaleString();
  return updated;
 },
 render(registration){
  const root=document.querySelector('.summary-page');if(!root)return;
  const self=new URLSearchParams(location.search).get('self')==='1';
  if(!registration&&!self)return;
  if(location.pathname.endsWith('admin-review.html')&&!self)return;
  const make=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  root.replaceChildren();
  const heading=make('div',null,'page-heading'),identity=make('div');
  identity.append(make('p',self?'SELF-REGISTERED PARTNER RESPONSES':'REVIEW YOUR QUESTIONNAIRE','eyebrow'),make('h1',registration?.company||'Registration unavailable'),make('p',registration?registration.email+' · Draft':''));
  heading.append(identity);const back=make('a',self?'Dashboard':'Continue questionnaire','secondary');back.href=self?'admin.html':'questionnaire-0.html';heading.append(back);root.append(heading);
  root.append(make('p','Preview only. Responses are available in the same browser tab and are not sent to the live portal.','hint'));
  if(!registration){root.append(make('p','No self-registration was found in this browser tab.'));return;}
  const sections=Object.entries(registration.sections||{}).sort(([a],[b])=>a.localeCompare(b,undefined,{numeric:true}));
  if(!sections.some(([page])=>page==='questionnaire-0.html'))sections.unshift(['questionnaire-0.html',{title:'Company Details',items:[{label:'Company Name',answer:registration.company},{label:'Primary Contact',answer:registration.contact||'Not answered'}]}]);
  let answers=0;
  sections.forEach(([page,section])=>{
   if(!section.items?.length)return;
   const card=make('section',null,'card summary-section');card.append(make('h2',section.title));const list=make('dl');
   section.items.forEach(item=>{const entry=make('div'),answer=make('dd',item.answer);answer.style.whiteSpace='pre-wrap';entry.append(make('dt',item.label),answer);list.append(entry);});
   card.append(list);root.append(card);if(page!=='questionnaire-0.html')answers+=section.items.length;
  });
  if(!answers)root.append(make('p','No questionnaire answers have been saved yet.'));
 }
};
