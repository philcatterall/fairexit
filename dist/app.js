const money = value => new Intl.NumberFormat('en-GB', {style:'currency', currency:'GBP', maximumFractionDigits:0}).format(value);
const gain = document.querySelector('#gain');
const range = document.querySelector('#gain-range');
function updateGain(value, source) {
  const parsed = Number(value);
  const amount = Math.max(0, Math.min(1000000, Number.isFinite(parsed) ? parsed : 0));
  if (source !== gain || parsed !== amount) gain.value = amount;
  range.value = amount;
  const earlier = amount * .1;
  const current = amount * .18;
  const planned = Math.min(amount,500000) * .18 + Math.max(0, amount-500000) * .24;
  document.querySelector('#tax-earlier').textContent = money(earlier);
  document.querySelector('#tax-current').textContent = money(current);
  document.querySelector('#tax-planned').textContent = money(planned);
  document.querySelector('#tax-extra').textContent = money(planned-earlier);
}
gain.addEventListener('input', () => updateGain(gain.value,gain));
gain.addEventListener('change', () => { gain.value = Math.max(0,Math.min(1000000,Number(gain.value)||0)); });
range.addEventListener('input', () => updateGain(range.value,range));
const letters = {
 mp: `Dear [MP’s name],

I am a constituent writing to ask you to challenge the changes to Business Asset Disposal Relief (BADR).

The BADR rate has already risen from 10% to 18%. The government has now announced plans to halve the lifetime limit on qualifying gains from £1 million to £500,000 for disposals from 6 April 2027.

For a £1 million gain, assuming no previous BADR claims, no Founders’ Relief, and 24% tax above the announced cap, the combined changes would mean £210,000 in tax rather than £100,000 under the earlier 10% rate and £1 million limit. That illustration excludes allowances, losses and other reliefs.

[Add your own experience: how long you have built your business, the risks you took, your plans and the effects of the changes on you.]

The proposed Founders’ Relief is not a universal replacement. Its minimum £10 million turnover and 15 qualifying full-time employee conditions exclude businesses below those thresholds, before its other tests are considered.

Please ask the Treasury to retain the £1 million BADR limit, reconsider the rate increases and provide fair transitional protection for owners who have planned towards a sale over many years. Please also raise the position of businesses excluded by the proposed Founders’ Relief criteria.

I support fair taxation. I also believe owners need a tax system they can plan around with confidence.

Please let me know your position and what action you will take.

Yours sincerely,
[Your name]
[Your constituency address]`,
 consultation: `To the Founders’ Relief consultation team,

Response to CGT Founders’ Relief: technical consultation, particularly Questions 2, 3 and 4.

I welcome recognition of the work and risk involved in building a business. However, I am concerned that the proposed conditions exclude established smaller businesses whose owners have also spent many years contributing to the UK economy.

[Explain your business in your own words. Include figures only if you want to disclose them, and explain which proposed conditions you cannot meet.]

The mandatory £10 million turnover and 15 qualifying full-time employee thresholds should be reconsidered. A business can provide lasting employment and valuable services without meeting those thresholds or achieving the specified compound growth rates.

The proposal arrives alongside an announced reduction in the BADR lifetime limit, following increases in the BADR rate from 10% to 18%. For owners excluded from Founders’ Relief, those changes raise serious concerns about the stability of long-term planning.

Please consider a route that recognises sustained business ownership and contribution, with proportionate safeguards, and fair transitional arrangements for those approaching a disposal.

[Add your specific suggested changes and evidence.]

Yours sincerely,
[Your name]
[Your preferred contact details]`
};
const mpText = document.querySelector('#mp-letter');
const consultationText = document.querySelector('#consultation-letter');
mpText.value = letters.mp;
consultationText.value = letters.consultation;
function openDialog(id) { document.querySelector(id).showModal(); }
document.querySelectorAll('[data-letter-open]').forEach(button => button.addEventListener('click',()=>openDialog('#letter-dialog')));
document.querySelector('#consultation-open').addEventListener('click',()=>openDialog('#consultation-dialog'));
document.querySelector('#privacy-open').addEventListener('click',()=>openDialog('#privacy-dialog'));
document.querySelectorAll('dialog').forEach(dialog => {
 dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{ if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close(); });
});
async function copyDraft(input,status) {
 try { await navigator.clipboard.writeText(input.value); status.textContent='Copied. Review your personal details and send it when you are ready. Nothing has been sent by this site.'; return true; }
 catch { input.focus(); input.select(); status.textContent='Your browser could not copy automatically. The draft is selected: use your device’s Copy command.'; return false; }
}
document.querySelectorAll('[data-copy-letter]').forEach(button=>button.addEventListener('click',async()=>{
 const copied=await copyDraft(mpText,document.querySelector('#letter-status'));
 if(button.id==='copy-letter-top'){
  button.querySelector('span').textContent=copied?'Copied':'Select & copy';
  button.setAttribute('aria-label',copied?'Draft letter copied':'Draft selected; use your device’s Copy command');
 }
}));
mpText.addEventListener('input',()=>{
 const button=document.querySelector('#copy-letter-top');
 button.querySelector('span').textContent='Copy';button.setAttribute('aria-label','Copy draft letter');
});
document.querySelector('#copy-consultation').addEventListener('click',()=>copyDraft(consultationText,document.querySelector('#consultation-status')));
document.querySelector('#download-letter').addEventListener('click',()=>{
 const file = new Blob([mpText.value],{type:'text/plain;charset=utf-8'});
 const url = URL.createObjectURL(file);
 const link = document.createElement('a'); link.href=url; link.download='a-fair-exit-my-mp-letter.txt'; link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 document.querySelector('#letter-status').textContent='Draft downloaded to your device. Nothing has been sent.';
});
document.querySelector('#share-button').addEventListener('click',async()=>{
 const url='https://www.fairexit.org/';
 const status=document.querySelector('#share-status');
 try {
  if(navigator.share){await navigator.share({title:'Enough is enough. A Fair Exit.',text:'The BADR rate rose from 10% to 18%. Now the government plans to halve the lifetime limit. Help make the case for a fair exit.',url});status.textContent='Share options opened. Thank you for getting the word out.';}
  else{await navigator.clipboard.writeText(url);status.textContent='Campaign link copied. Send it to another business owner.';}
 }catch(error){if(error.name!=='AbortError')status.textContent='Share this address: https://www.fairexit.org/';}
});
// Alternate openings for creative review; the public default is the Enough is enough direction.
const direction=new URLSearchParams(location.search).get('direction');
const alternatives={
 'finish-line':{heading:'STOP MOVING<br>THE <span class="headline-accent">FINISH LINE.</span>',kicker:'28 years building a business.<br>A lifetime’s work deserves a fair exit.',explainer:'You take the risks and plan for the long term. Then the rules change: the tax rate under BADR (formerly Entrepreneurs’ Relief; preceded by business asset taper relief) rose from <strong>10% to 18%</strong>. Now the government plans to <strong>halve its lifetime limit</strong>. Help us challenge the changes.'},
 'small-business':{heading:'SMALL BUSINESS.<br><span class="headline-accent">BIG BETRAYAL.</span>',kicker:'You put years in.<br>Don’t let your voice be left out.',explainer:'Business owners deserve to be heard. The tax rate under BADR (formerly Entrepreneurs’ Relief; preceded by business asset taper relief) has risen from <strong>10% to 18%</strong>, and the government now plans to <strong>cut the lifetime limit by 50%</strong>. We say enough is enough.'}
};
if(alternatives[direction]){
 document.documentElement.dataset.direction=direction;
 const variant=alternatives[direction];document.querySelector('#hero-heading').innerHTML=variant.heading;
 document.querySelector('#hero-kicker').innerHTML=variant.kicker;document.querySelector('#hero-explainer').innerHTML=variant.explainer;
}
if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll('.demands-list article,.threshold-row,.action-cards article').forEach(element=>{element.classList.add('reveal');observer.observe(element);});
}
