/** Small shared helpers. Kept dependency-free and side-effect free. */

let toastTimer;

/** Shows a short, screen-reader-announced message at the bottom of the page. */
export function showToast(message, duration = 2600) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;

  toast.textContent = message;
  toast.dataset.show = "true";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.dataset.show = "false";
  }, duration);
}

/** Copies text, falling back to a hidden textarea on older browsers. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Repeated-safe storage access: private modes throw on write. */
export const storage = {
  read(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  write(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },
};

/** Zeros-pads a number for the countdown display. */
export const pad = (value) => String(Math.max(0, value)).padStart(2, "0");
