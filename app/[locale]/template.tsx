/** Re-mounted on every navigation: a soft fade + rise between pages. */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
