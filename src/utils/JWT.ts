export const getJWTFromCookie = (): string | null => {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwt') {
      return value;
    }
  }
  return null;
};