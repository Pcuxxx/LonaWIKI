/** Компактное окно GitHub поверх сайта вместо полноэкранной вкладки. */
export function openGitHubPopup(url: string, name: string) {
  if (typeof window === "undefined") return null;
  const width = Math.min(820, Math.max(320, window.innerWidth - 40));
  const height = Math.min(900, Math.max(420, window.innerHeight - 40));
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
  const popup = window.open(
    url,
    name,
    `popup=yes,width=${width},height=${height},left=${left},top=${top}`,
  );
  if (popup) {
    try {
      popup.opener = null;
    } catch {
      /* некоторые браузеры запрещают доступ к opener */
    }
  }
  return popup;
}
