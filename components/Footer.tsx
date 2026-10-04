import { footer } from "@/lib/content";
import { contact, site } from "@/lib/site";
import { container, textLink } from "@/lib/ui";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-surface" aria-labelledby="contact-heading">
      <div className={`${container} py-16 md:py-20`}>
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="contact-heading" className="text-3xl md:text-4xl">
              {site.brand}
            </h2>
            <p className="mt-4 max-w-md text-ink-2">{footer.tagline}</p>
            <p className="mt-2 text-ink-2">{footer.sessions}</p>
          </div>

          <address className="not-italic">
            <dl className="grid gap-5">
              <div>
                <dt className="text-sm font-medium tracking-wide text-ink-2 uppercase">Address</dt>
                <dd className="mt-1">{contact.address.display}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium tracking-wide text-ink-2 uppercase">Phone</dt>
                <dd className="mt-1">
                  <a href={contact.phoneHref} className={textLink}>
                    {contact.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium tracking-wide text-ink-2 uppercase">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={contact.whatsappHref} className={textLink} target="_blank" rel="noopener noreferrer">
                    {contact.whatsappDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium tracking-wide text-ink-2 uppercase">Email</dt>
                <dd className="mt-1">
                  <a href={contact.emailHref} className={textLink}>
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>
          </address>
        </div>

        <p className="mt-14 border-l-2 border-accent bg-bg px-5 py-4 text-ink" role="note">
          {footer.safety}
        </p>

        <p className="mt-10 border-t border-line pt-6 text-sm text-ink-2">{footer.copyright}</p>
      </div>
    </footer>
  );
}
