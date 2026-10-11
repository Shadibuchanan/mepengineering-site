const allowedServices = new Set(['Mechanical', 'Electrical', 'Plumbing', 'Kitchen Hoods', 'Fire Alarm', 'Fire Sprinkler']);

export function initializeContactForm(form: HTMLFormElement): void {
  const endpoint = form.dataset.endpoint;
  // Keep a missing configuration inert, including if a disabled button is changed in the browser.
  if (!endpoint || !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
    form.addEventListener('submit', (event) => event.preventDefault());
    return;
  }

  const button = form.querySelector<HTMLButtonElement>('[data-submit-button]');
  const label = form.querySelector<HTMLElement>('[data-submit-label]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  if (!button || !label || !status) return;

  const serviceInput = form.querySelector<HTMLInputElement>('[data-requested-service]');
  const service = new URLSearchParams(window.location.search).get('service');
  if (serviceInput && service && allowedServices.has(service)) serviceInput.value = service;

  let sending = false;
  const setStatus = (state: 'sending' | 'success' | 'error', message: string): void => {
    status.dataset.state = state;
    status.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;

    sending = true;
    button.disabled = true;
    label.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    setStatus('sending', 'Sending your inquiry…');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error('Submission rejected');

      setStatus('success', 'Thank you. Your inquiry has been sent to our team. We look forward to learning more about your project.');
      form.reset();
      if (serviceInput && service && allowedServices.has(service)) serviceInput.value = service;
      status.focus({ preventScroll: true });
    } catch (error: unknown) {
      const timedOut = error instanceof Error && error.name === 'AbortError';
      setStatus('error', timedOut
        ? 'We couldn’t confirm delivery. Your details are still here. Please try again, or email info@mepengineers.com.'
        : 'Your inquiry couldn’t be sent. Your details are still here. Please try again, or email info@mepengineers.com.');
      status.focus({ preventScroll: true });
    } finally {
      window.clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      button.disabled = false;
      label.textContent = 'Send inquiry';
      sending = false;
    }
  });
}
