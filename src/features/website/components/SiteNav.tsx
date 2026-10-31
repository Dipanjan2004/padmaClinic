"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Menu, MessageCircle, Navigation, Phone, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { bookPath, dictionary, formatPhone, type Lang } from "../i18n";
import { Avatar } from "./Avatar";
import { ClinicMark } from "./ClinicMark";
import { LanguageSwitch } from "./LanguageSwitch";

export type NavLink = { id: string; label: string };
type NavDoctor = { slug: string; name: string; nameEn: string; photoUrl: string | null };

/** Makes everything except `keep` inert and stops the page scrolling. Returns the undo. */
function lockPageBehind(keep: HTMLElement): () => void {
  const others = Array.from(keep.parentElement?.children ?? []).filter(
    (el): el is HTMLElement => el !== keep && el instanceof HTMLElement && !el.inert,
  );
  others.forEach((el) => (el.inert = true));
  const root = document.documentElement;
  const overflow = root.style.overflow;
  root.style.overflow = "hidden";
  return () => {
    others.forEach((el) => (el.inert = false));
    root.style.overflow = overflow;
  };
}

// Icon-over-label tiles for the menu's quick actions, on the blue panel.
const tile =
  "press flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border border-white/25 text-sm font-medium text-white hover:bg-white/10";

type Props = {
  lang: Lang;
  clinicName: string;
  homeHref: string;
  bookHref: string;
  links: NavLink[];
  doctors: NavDoctor[];
  phone: string | null;
  whatsappHref: string | null;
  directionsHref: string | null;
  owner: string | null;
};

/**
 * Floating navbar (after the Bond reference, D-025). Over the blue hero it is
 * transparent with white text; once the page scrolls it becomes a white rounded
 * bar. On phones the menu button turns into a close button in place, and the
 * menu drops down from the top behind the bar, which never moves. The menu holds
 * the sections, one-tap booking with each doctor, and Call, WhatsApp and Directions.
 */
export function SiteNav(props: Props) {
  const { lang, links } = props;
  const t = dictionary(lang);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const afterCloseRef = useRef<(() => void) | null>(null);
  const linkIds = links.map((link) => link.id).join(",");
  const onHero = !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Underline the section that crosses the middle of the screen.
  useEffect(() => {
    const sections = linkIds
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [linkIds]);

  // The open menu is one entry in the browser history, so the phone's Back button
  // closes it instead of leaving the site. A reload can leave that entry behind;
  // it is neutralised on load.
  useEffect(() => {
    if (window.history.state?.siteMenu) window.history.replaceState({ siteMenu: false }, "");
  }, []);

  const openMenu = () => {
    window.history.pushState({ siteMenu: true }, "");
    setMenuOpen(true);
  };

  /** Closes the menu by stepping back over its history entry; `then` runs once it is closed. */
  const closeMenu = (then?: () => void) => {
    if (window.history.state?.siteMenu) {
      afterCloseRef.current = then ?? null;
      window.history.back();
    } else {
      setMenuOpen(false);
      if (then) requestAnimationFrame(then);
    }
  };

  // Menu links close the menu, then go to their section. Tapping the section the page
  // is already on still scrolls there and still tells the booking card which doctor.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, hash: string) => {
    event.preventDefault();
    closeMenu(() => {
      if (window.location.hash === hash) {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      } else {
        window.location.hash = hash;
      }
    });
  };

  // While the menu is open: the rest of the page is inert and does not scroll,
  // Back and Escape close it, and it closes by itself if the screen grows past phone size.
  useEffect(() => {
    const header = headerRef.current;
    const toggle = toggleRef.current;
    if (!menuOpen || !header?.parentElement) return;
    const unlockPage = lockPageBehind(header);
    const onPop = () => {
      setMenuOpen(false);
      const then = afterCloseRef.current;
      afterCloseRef.current = null;
      // Two frames: the page is scrollable again before `then` scrolls it.
      if (then) requestAnimationFrame(() => requestAnimationFrame(then));
    };
    // Same as closeMenu() without a follow-up: step back over the menu's history entry.
    const close = () => (window.history.state?.siteMenu ? window.history.back() : setMenuOpen(false));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWide = () => wide.matches && close();
    window.addEventListener("popstate", onPop);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      unlockPage();
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      // Focus inside the closing menu would be lost; hand it back to the button.
      if (document.getElementById("site-menu")?.contains(document.activeElement)) toggle?.focus();
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-4 md:pt-4">
      <div
        className={`relative mx-auto flex h-16 max-w-6xl items-center gap-1.5 rounded-2xl px-2 transition-[background-color,box-shadow,color] duration-300 min-[400px]:gap-2 min-[400px]:px-3 md:h-[4.5rem] md:px-5 ${
          onHero ? "text-white" : "bg-surface/95 text-ink shadow-nav backdrop-saturate-150"
        }`}
      >
        {/* Below 400px the logo is a little smaller and never wraps, so everything fits on one line. */}
        <Link
          href={props.homeHref}
          className="mr-auto flex min-h-11 min-w-0 items-center gap-2 rounded-lg min-[400px]:gap-2.5 lg:mr-0"
        >
          <ClinicMark className="h-7 w-7 shrink-0 min-[400px]:h-8 min-[400px]:w-8" inverse={onHero} />
          <span className="font-display text-lg font-semibold tracking-[-0.02em] whitespace-nowrap max-[299px]:sr-only min-[400px]:text-xl">
            {props.clinicName}
          </span>
        </Link>

        <nav aria-label={t.nav.label} className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const current = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={current ? "location" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-200 after:absolute after:inset-x-3.5 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:transition-transform after:duration-300 after:ease-out-expo ${
                  onHero ? "after:bg-lime" : "after:bg-brand"
                } ${
                  current
                    ? `${onHero ? "text-white" : "text-ink"} after:scale-x-100`
                    : `${onHero ? "text-white/75 hover:text-white" : "text-ink-muted hover:text-ink"} after:scale-x-0`
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {props.phone && (
          <a
            href={`tel:${props.phone}`}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium tabular-nums xl:inline-flex"
          >
            <Phone aria-hidden="true" className={`h-4 w-4 ${onHero ? "text-lime" : "text-brand"}`} />
            {formatPhone(props.phone)}
          </a>
        )}
        <LanguageSwitch lang={lang} tone={onHero ? "dark" : "light"} compact />
        <a
          href={props.bookHref}
          className={`press group hidden h-11 items-center gap-2 rounded-full pr-1.5 pl-5 text-sm font-medium md:inline-flex ${
            onHero ? "bg-white text-ink hover:bg-white/90" : "bg-brand text-white hover:bg-brand-strong"
          }`}
        >
          {t.actions.book}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-ink">
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:rotate-45"
            />
          </span>
        </a>
        <button
          ref={toggleRef}
          type="button"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          aria-haspopup="dialog"
          aria-controls="site-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? t.nav.close : t.nav.menu}
          className={`press grid h-11 w-11 shrink-0 place-items-center rounded-xl lg:hidden ${
            onHero ? "bg-white text-ink" : "border border-line text-ink hover:border-ink/30"
          }`}
        >
          {/* The two icons cross-fade and turn in place. */}
          <Menu
            aria-hidden="true"
            className={`col-start-1 row-start-1 h-5 w-5 transition duration-300 ease-out-expo motion-reduce:transition-none ${
              menuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            aria-hidden="true"
            className={`col-start-1 row-start-1 h-5 w-5 transition duration-300 ease-out-expo motion-reduce:transition-none ${
              menuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </button>
      </div>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menu}
        data-open={menuOpen}
        inert={!menuOpen}
        className="menu-panel fixed inset-0 -z-10 flex flex-col overflow-y-auto overscroll-contain bg-surface pt-[5.25rem] pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pt-24 lg:hidden"
      >
        <nav aria-label={t.nav.label} className="px-5 pt-2">
          <ul className="divide-y divide-line border-y border-line">
            {links.map((link, i) => (
              <li key={link.id} className="menu-item" style={{ "--i": i } as CSSProperties}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => goTo(event, `#${link.id}`)}
                  className="group flex h-16 items-center justify-between font-display text-[1.75rem] font-medium tracking-[-0.02em] [:lang(bn)_&]:tracking-normal"
                >
                  {link.label}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-5 w-5 text-ink-muted transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The same inset blue panel as the hero and footer. It stretches to the bottom of the screen but never
            shrinks below its content, so on short screens the menu scrolls instead of cutting the panel off. */}
        <div
          className="menu-item relative isolate mx-3 mt-6 flex flex-[1_0_auto] flex-col overflow-hidden rounded-[1.75rem] bg-brand p-4 text-white"
          style={{ "--i": links.length } as CSSProperties}
        >
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            className="absolute -right-16 bottom-28 -z-10 h-72 w-72 text-white/[0.08]"
          >
            <path d="M13.5 8.5h5v5h5v5h-5v5h-5v-5h-5v-5h5z" fill="currentColor" />
          </svg>
          <p className="px-1 pt-1 font-display text-2xl font-medium tracking-[-0.02em] [:lang(bn)_&]:tracking-normal">
            {t.hero.badge}
          </p>
          {props.doctors.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {props.doctors.map((doctor) => (
                <li key={doctor.slug}>
                  <a
                    href={bookPath(doctor.slug)}
                    onClick={(event) => goTo(event, bookPath(doctor.slug))}
                    aria-label={t.week.bookWith(doctor.name)}
                    className="press flex items-center gap-3 rounded-2xl bg-surface px-3.5 py-3 text-ink"
                  >
                    <Avatar name={doctor.nameEn} photoUrl={doctor.photoUrl} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{doctor.name}</span>
                      <span className="block text-sm text-brand">{t.actions.book}</span>
                    </span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime">
                      <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <a
              href={props.bookHref}
              onClick={(event) => goTo(event, props.bookHref)}
              className="press mt-4 flex h-13 w-full items-center justify-between rounded-full bg-surface pr-1.5 pl-6 font-medium text-ink"
            >
              {t.actions.book}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-lime">
                <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
              </span>
            </a>
          )}

          <div className="mt-auto pt-6">
            <div className="grid grid-cols-3 gap-2">
              {props.phone && (
                <a href={`tel:${props.phone}`} className={tile}>
                  <Phone aria-hidden="true" className="h-5 w-5" />
                  {t.actions.call}
                </a>
              )}
              {props.whatsappHref && (
                <a href={props.whatsappHref} className={tile}>
                  <MessageCircle aria-hidden="true" className="h-5 w-5" />
                  {t.actions.whatsapp}
                </a>
              )}
              {props.directionsHref && (
                <a href={props.directionsHref} target="_blank" rel="noopener noreferrer" className={tile}>
                  <Navigation aria-hidden="true" className="h-5 w-5" />
                  {t.actions.directions}
                </a>
              )}
            </div>
            {props.owner && (
              <p className="px-1 pt-3 text-sm text-white/80">
                {t.contact.owner}: <span className="text-white">{props.owner}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
