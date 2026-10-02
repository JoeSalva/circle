// Progressive enhancement only: the page works with JS disabled.
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Copy-email button
  const btn = document.getElementById('copy-email');
  const hint = document.getElementById('copy-hint');
  if (btn && hint) {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email || '';
      try {
        await navigator.clipboard.writeText(email);
        hint.textContent = `Copied: ${email}`;
      } catch {
        hint.textContent = email; // clipboard blocked: just show it
      }
      setTimeout(() => { hint.textContent = ''; }, 4000);
    });
  }
});
