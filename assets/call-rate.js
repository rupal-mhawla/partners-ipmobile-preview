document.querySelectorAll('[data-call-rate]').forEach(panel => {
  const calls = document.getElementById('q65');
  const accounts = document.getElementById('q66');
  if (!calls || !accounts) return;
  const output = panel.querySelector('[data-call-rate-value]');
  const update = () => {
    const unknown = ['q65', 'q66'].some(id => document.querySelector(`[name="${id}_unknown"]`)?.checked);
    const valid = !unknown && calls.value.trim() !== '' && accounts.value.trim() !== '' && calls.validity.valid && accounts.validity.valid && Number(accounts.value) > 0;
    output.textContent = valid
      ? `${(Number(calls.value) / Number(accounts.value) * 100).toFixed(2)} calls per 100 accounts per day`
      : 'Enter daily calls and a customer count greater than zero to calculate this rate.';
  };
  document.addEventListener('input', update);
  document.addEventListener('change', update);
  update();
});
