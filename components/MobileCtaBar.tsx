import { contact } from "@/lib/site";

const item =
  "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[0.9375rem] font-medium text-ink transition-colors duration-150 ease-out hover:text-accent";

/** Sticky bottom CTA bar — mobile only. Pure links, no JS. */
export default function MobileCtaBar() {
  return (
    <nav
      aria-label="Book a consultation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex divide-x divide-line">
        <li className="flex flex-1">
          <a href={contact.phoneHref} className={item}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
            Call
          </a>
        </li>
        <li className="flex flex-1">
          <a href={contact.whatsappHref} className={item} target="_blank" rel="noopener noreferrer">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.6A8.4 8.4 0 1 1 21 11.5z" />
            </svg>
            WhatsApp
          </a>
        </li>
        <li className="flex flex-1">
          <a href={contact.emailHref} className={item}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Email
          </a>
        </li>
      </ul>
    </nav>
  );
}
