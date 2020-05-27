const getSessionIdFromCookies = (): string =>
  Object.fromEntries(document.cookie.split('; ').map((x) => x.split('=')))
    .sessionId;

export { getSessionIdFromCookies };
