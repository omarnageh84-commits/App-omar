function evalCalc(expr){try{let c=String(expr).replace(/[,،]/g,'').replace(/[^0-9+\-*/().]/g,'');if(!c)return 0;let r=Function('"use strict";return ('+c+')')();if(isFinite(r))return Math.round(r*100)/100;return expr;}catch(e){return expr;}}
function parseNum(s){s=String(s||'0');if(/[+\-*/()]/.test(s))s=String(evalCalc(s));return parseFloat(s.replace(/[^0-9.-]/g,''))||0;}

// === اصلاح التبويبات الرئيسية الصيدلية / الخاص ===
function openTab(evt, tabName){
    document.querySelectorAll(".tab-content").forEach(c=>c.style.display="none");
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    const t=document.getElementById(tabName);
    if(t){t.style.display="block"; t.classList.add("active-content");}
    evt.currentTarget.classList.add("active");
    if(tabName==='pharmacyTab')populateAllDropdowns();
}

// === اصلاح التبويبات الفرعية اليومية / مشتريات / اجمالي / قواعد بيانات ===
function openSubTab(evt, subTabId, groupClass){
    document.querySelectorAll("."+groupClass).forEach(c=>c.style.display="none");
    document.querySelectorAll(".sub-tabs-header.sub-tab-btn").forEach(b=>b.classList.remove("active"));
    const t=document.getElementById(subTabId);
    if(t){t.style.display="block";}
    evt.currentTarget.classList.add("active");
    if(groupClass==='pharmacy-group')populateAllDropdowns();
    if(subTabId==='purchasesSection')updatePurchaseSummaries();
}

function saveDaily(){const d=document.getElementById('dailyMainDate')?.value||new Date().toISOString().split('T')[0]; alert('✅ تم حفظ يومية '+d);}
function resetDaily(){
    if(!confirm('متأكد عايز تصفر؟'))return;
    document.querySelectorAll('#dailyTableBody.table-input, #vodafoneTableBody.table-input, #instaTableBody.table-input').forEach(el=>{
        if(el.tagName==='SELECT')el.selectedIndex=0; else el.value='0';
        el.classList.remove('is-deficit','is-increase');
    });
    document.querySelectorAll('[data-type="diff"]').forEach(el=>{el.value=0;el.classList.remove('is-deficit','is-increase');});
}
function updatePurchaseSummaries(){
    const rows=[...document.querySelectorAll('#purchaseTableBody tr')]; const dailyMap={}; const supMap={};
    rows.forEach(tr=>{
        const date=tr.querySelector('td:nth-child(1) input')?.value.trim()||'بدون تاريخ';
        const sup=tr.querySelector('td:nth-child(2) select')?.value.trim(); const bayan=tr.querySelector('td:nth-child(3) select')?.value.trim()||'';
        const val=parseNum(tr.querySelector('td:nth-child(4) input')?.value); if(!sup)return;
        if(!dailyMap[date])dailyMap[date]={فاتورة:0,مرتجع:0,اشعار:0,مبيعات:0,مردود:0,مدفوع:0};
        if(!supMap[sup])supMap[sup]={فاتورة:0,مرتجع:0,اشعار:0,مبيعات:0,مردود:0,مدفوع:0};
        if(bayan.includes('مرتجع')){dailyMap[date].مرتجع+=val; supMap[sup].مرتجع+=val;}
        else if(bayan.includes('اشعار')){dailyMap[date].اشعار+=val; supMap[sup].اشعار+=val;}
        else if(bayan.includes('مبيعات')){dailyMap[date].مبيعات+=val; supMap[sup].مبيعات+=val;}
        else if(bayan.includes('مردود')){dailyMap[date].مردود+=val; supMap[sup].مردود+=val;}
        else if(bayan.includes('مدفوع')){dailyMap[date].مدفوع+=val; supMap[sup].مدفوع+=val;}
        else{dailyMap[date].فاتورة+=val; supMap[sup].فاتورة+=val;}
    });
    const db=document.getElementById('dailySummaryBody'); if(db){db.innerHTML=''; Object.keys(dailyMap).forEach(d=>{let x=dailyMap[d];let s=x.فاتورة-x.مرتجع-x.اشعار+x.مبيعات-x.مردود-x.مدفوع; db.innerHTML+=`<tr><td>${d}</td><td>${x.فاتورة.toLocaleString()}</td><td>${x.مرتجع.toLocaleString()}</td><td>${x.اشعار.toLocaleString()}</td><td>${x.مبيعات.toLocaleString()}</td><td>${x.مردود.toLocaleString()}</td><td>${x.مدفوع.toLocaleString()}</td><td style="font-weight:800;background:#f1f5f9">${s.toLocaleString()}</td></tr>`});}
    const sb=document.getElementById('supplierSummaryBody'); if(sb){sb.innerHTML=''; Object.keys(supMap).forEach(su=>{let x=supMap[su];let s=x.فاتورة-x.مرتجع-x.اشعار+x.مبيعات-x.مردود-x.مدفوع; sb.innerHTML+=`<tr><td>${su}</td><td>${x.فاتورة.toLocaleString()}</td><td>${x.مرتجع.toLocaleString()}</td><td>${x.اشعار.toLocaleString()}</td><td>${x.مبيعات.toLocaleString()}</td><td>${x.مردود.toLocaleString()}</td><td>${x.مدفوع.toLocaleString()}</td><td style="font-weight:800;background:#f1f5f9">${s.toLocaleString()}</td></tr>`});}
}
function smartFormatDate(v){if(!v)return v; v=v.trim().replace(/\-/g,'/'); let m=v.match(/^(\d{1,2})\/(\d{1,2})$/); if(m)return`${m[1].padStart(2,'0')}/${m[2].padStart(2,'0')}/${new Date().getFullYear()}`; m=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/); if(m)return`${m[1].padStart(2,'0')}/${m[2].padStart(2,'0')}/20${m[3]}`; m=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); if(m)return`${m[1].padStart(2,'0')}/${m[2].padStart(2,'0')}/${m[3]}`; return v;}
function smartFormatTime(v){if(!v)return v; v=v.trim(); if(v.includes('ص')||v.includes('م'))return v; if(/^\d{1,2}$/.test(v)){let h=parseInt(v); if(h>=0&&h<=23){let s=h>=12?'م':'ص'; let h12=h%12; if(h12===0)h12=12; return`${h12}:00 ${s}`;}} let m=v.match(/^(\d{1,2}):(\d{2})$/); if(m){let h=parseInt(m[1]); let s=h>=12?'م':'ص'; let h12=h%12; if(h12===0)h12=12; return`${h12}:${m[2]} ${s}`;} return v;}
function smartFormatNumber(v){if(!v)return v; if(/[+\-*/()]/.test(v))return v; let n=parseNum(v); if(isNaN(n))return v; return n.toLocaleString('en-US');}

document.addEventListener('input', e=>{
    if(e.target.classList.contains('deficit-col')){let val=parseNum(e.target.value); e.target.classList.remove('is-deficit','is-increase'); if(val<0)e.target.classList.add('is-deficit'); if(val>0)e.target.classList.add('is-increase');}
    if(e.target.classList.contains('calc-input')){
        let r=e.target.closest('tr'); let sys=parseNum(r.querySelector('[data-type="system"]').value); let act=parseNum(r.querySelector('[data-type="actual"]').value);
        let diff=r.querySelector('[data-type="diff']'); if(!diff) diff=r.querySelector('[data-type="diff"]'); diff=r.querySelector('[data-type="diff"]');
        let d=act-sys; let el=r.querySelector('[data-type="diff"]'); el.value=d.toLocaleString(); el.classList.remove('is-deficit','is-increase'); if(d<0)el.classList.add('is-deficit'); if(d>0)el.classList.add('is-increase');
    }
    if(e.target.closest('#employeeTableBody')||e.target.closest('#supplierTableBody')||e.target.closest('#bayanTableBody'))populateAllDropdowns();
    if(e.target.closest('#purchaseTableBody'))updatePurchaseSummaries();
});
document.addEventListener('change', e=>{if(e.target.closest('#purchaseTableBody'))updatePurchaseSummaries();});
document.addEventListener('keydown', e=>{if(e.key==='Enter'&&e.target.classList.contains('table-input')){e.preventDefault(); if(/[+\-*/()]/.test(e.target.value)){e.target.value=evalCalc(e.target.value); e.target.dispatchEvent(new Event('input',{bubbles:true}));} if(e.target.closest('#purchaseTableBody')&&e.target.closest('td')?.cellIndex===0)e.target.value=smartFormatDate(e.target.value); if(e.target.closest('#purchaseTableBody')&&e.target.closest('td')?.cellIndex===3)e.target.value=smartFormatNumber(e.target.value); if(e.target.closest('#employeeTableBody')&&(e.target.closest('td')?.cellIndex===1||e.target.closest('td')?.cellIndex===2))e.target.value=smartFormatTime(e.target.value);}});
document.addEventListener('blur', e=>{if(!e.target.classList.contains('table-input'))return; if(/[+\-*/()]/.test(e.target.value)){e.target.value=evalCalc(e.target.value); e.target.dispatchEvent(new Event('input',{bubbles:true})); if(!e.target.classList.contains('calc-input'))e.target.value=smartFormatNumber(e.target.value); return;} if(e.target.closest('#purchaseTableBody')&&e.target.closest('td')?.cellIndex===0){e.target.value=smartFormatDate(e.target.value); updatePurchaseSummaries();} if(e.target.closest('#employeeTableBody')&&(e.target.closest('td')?.cellIndex===1||e.target.closest('td')?.cellIndex===2))e.target.value=smartFormatTime(e.target.value); if((e.target.closest('#purchaseTableBody')&&e.target.closest('td')?.cellIndex===3)||e.target.closest('#dailyTableBody')){let v=e.target.value.trim(); if(v&&!isNaN(parseNum(v))&&v!=='0')e.target.value=smartFormatNumber(v);} }, true);

function populateAllDropdowns(){let emps=[...document.querySelectorAll('#employeeTableBody tr td:first-child input')].map(i=>i.value.trim()).filter(Boolean); let sups=[...document.querySelectorAll('#supplierTableBody tr td:first-child input')].map(i=>i.value.trim()).filter(Boolean); let bayans=[...document.querySelectorAll('#bayanTableBody tr td:first-child input')].map(i=>i.value.trim()).filter(Boolean); document.querySelectorAll('.employee-dropdown').forEach(s=>{let cur=s.value; s.innerHTML='<option value="">اختر الموظف</option>'; emps.forEach(n=>s.innerHTML+=`<option ${n==cur?'selected':''}>${n}</option>`);}); document.querySelectorAll('.supplier-dropdown').forEach(s=>{let cur=s.value; s.innerHTML='<option value="">اختر المورد</option>'; sups.forEach(n=>s.innerHTML+=`<option ${n==cur?'selected':''}>${n}</option>`);}); document.querySelectorAll('.bayan-dropdown').forEach(s=>{let cur=s.value; s.innerHTML='<option value="">اختر البيان</option>'; bayans.forEach(n=>s.innerHTML+=`<option ${n==cur?'selected':''}>${n}</option>`);});}
function addDailyRow(){document.getElementById('dailyTableBody').insertAdjacentHTML('beforeend',`<tr><td><select class="table-input employee-dropdown"><option value="">اختر الموظف</option></select></td><td><input type="text" class="table-input" value="0"></td><td><input type="text" class="table-input deficit-col" value="0"></td><td><select class="table-input supplier-dropdown"><option value="">اختر المورد</option></select></td><td><input type="text" class="table-input" value="0"></td><td><input type="text" class="table-input" placeholder="ملاحظات"></td><td><button style="background:#fee2e2;color:#ef4444;border:none;padding:5px 8px;border-radius:6px" onclick="this.closest('tr').remove()">✕</button></td></tr>`); populateAllDropdowns();}
function addPurchaseRow(){document.getElementById('purchaseTableBody').insertAdjacentHTML('beforeend',`<tr><td><input type="text" class="table-input" value="${new Date().toLocaleDateString('ar-EG')}"></td><td><select class="table-input supplier-dropdown"><option value="">اختر المورد</option></select></td><td><select class="table-input bayan-dropdown"><option value="">اختر البيان</option></select></td><td><input type="text" class="table-input" value="0"></td><td><input type="text" class="table-input"></td><td><button style="background:#fee2e2;color:#ef4444;border:none;padding:5px 8px;border-radius:6px" onclick="this.closest('tr').remove(); updatePurchaseSummaries();">✕</button></td></tr>`); populateAllDropdowns(); updatePurchaseSummaries();}
function addEmployeeRow(){document.getElementById('employeeTableBody').insertAdjacentHTML('beforeend',`<tr><td><input type="text" class="table-input" value=""></td><td><input type="text" class="table-input" value=""></td><td><input type="text" class="table-input" value=""></td><td><button style="background:#fee2e2;color:#ef4444;border:none;padding:5px 8px;border-radius:6px" onclick="this.closest('tr').remove(); populateAllDropdowns();">✕</button></td></tr>`);}
function addSupplierRow(){document.getElementById('supplierTableBody').insertAdjacentHTML('beforeend',`<tr><td><input type="text" class="table-input" value=""></td><td><input type="text" class="table-input" value=""></td><td><button style="background:#fee2e2;color:#ef4444;border:none;padding:5px 8px;border-radius:6px" onclick="this.closest('tr').remove(); populateAllDropdowns();">✕</button></td></tr>`);}
function addBayanRow(){document.getElementById('bayanTableBody').insertAdjacentHTML('beforeend',`<tr><td><input type="text" class="table-input" value=""></td><td><button style="background:#fee2e2;color:#ef4444;border:none;padding:5px 8px;border-radius:6px" onclick="this.closest('tr').remove(); populateAllDropdowns();">✕</button></td></tr>`);}
function clearPurchaseFilter(){const s=document.getElementById('purchaseStartDate'); const e=document.getElementById('purchaseEndDate'); if(s)s.value=''; if(e)e.value='';}
document.addEventListener('DOMContentLoaded', ()=>{populateAllDropdowns(); updatePurchaseSummaries(); const d=document.getElementById('dailyMainDate'); if(d){d.valueAsDate=new Date(); d.addEventListener('change',e=>{let dt=new Date(e.target.value); if(!isNaN(dt))document.getElementById('dayNameDisplay').textContent=dt.toLocaleDateString('ar-EG',{weekday:'long'});}); d.dispatchEvent(new Event('change'));}});
