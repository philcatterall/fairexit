const money = value => new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
const gain = document.querySelector('#gain');
const range = document.querySelector('#gain-range');
function updateGain(value) {
  const number = Number(value);
  const amount = Math.min(1000000, Math.max(0, Number.isFinite(number) ? number : 0));
  gain.value = amount;
  range.value = amount;
  document.querySelector('#old-tax').textContent = money(amount * .10);
  document.querySelector('#new-tax').textContent = money(amount * .18);
  document.querySelector('#extra-tax').textContent = money(amount * .08);
}
gain.addEventListener('input', () => updateGain(gain.value));
range.addEventListener('input', () => updateGain(range.value));
document.querySelector('#support-form').addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#form-status').textContent = 'Demo complete. On the live campaign, this is where you would receive confirmation. No support has been registered and your details have not been sent or saved.';
  event.target.reset();
});
const dialog = document.querySelector('#letter-dialog');
document.querySelector('#letter-open').addEventListener('click', () => dialog.showModal());
document.querySelector('#letter-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
document.querySelector('#letter-copy').addEventListener('click', async () => {
  const letter = document.querySelector('#letter');
  try { await navigator.clipboard.writeText(letter.value); document.querySelector('#letter-status').textContent = 'Draft copied. Add your own details and review it before sending.'; }
  catch { letter.focus(); letter.select(); document.querySelector('#letter-status').textContent = 'Select and copy the draft using your device’s copy command.'; }
});
document.querySelector('#share').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href.split('#')[0]); document.querySelector('#share-status').textContent = 'Campaign link copied.'; }
  catch { document.querySelector('#share-status').textContent = 'Copy the page address from your browser to share it.'; }
});
