"use client";

import { MessageCircle, Navigation, Phone } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  bookHref: string;
  bookLabel: string;
  callHref: string | null;
  callLabel: string;
  whatsappHref: string | null;
  whatsappLabel: string;
  directionsHref: string | null;
  directionsLabel: string;
};

/**
 * Phone-only bar that slides up once the hero's buttons scroll out of view. It
 * steps aside while the booking card is on screen: the card has its own buttons,
 * and the bar would otherwise sit over the card's Send button.
 */
export function MobileActionBar(props: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroActions = document.getElementById("hero-actions");
    if (!heroActions) return;
    const bookCard = document.getElementById("book");
    let heroGone = false;
    let cardShowing = false;
    const update = () => setVisible(heroGone && !cardShowing);
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroGone = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    // The card only matters where the bar sits: the bottom quarter of the screen.
    const cardObserver = new IntersectionObserver(
      ([entry]) => {
        cardShowing = entry.isIntersecting;
        update();
      },
      { rootMargin: "-75% 0px 0px 0px" },
    );
    heroObserver.observe(heroActions);
    if (bookCard) cardObserver.observe(bookCard);
    return () => {
      heroObserver.disconnect();
      cardObserver.disconnect();
    };
  }, []);

  const secondary =
    "press flex h-12 min-w-0 flex-col items-center justify-center rounded-2xl text-[0.7rem] leading-tight font-medium text-ink hover:bg-mist";

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-bar transition-transform duration-300 ease-out-expo motion-reduce:transition-none md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-1">
        {props.callHref && (
          <a href={props.callHref} className={`${secondary} flex-1`}>
            <Phone aria-hidden="true" className="mb-0.5 h-5 w-5 text-brand" />
            {props.callLabel}
          </a>
        )}
        {props.whatsappHref && (
          <a href={props.whatsappHref} className={`${secondary} flex-1`}>
            <MessageCircle aria-hidden="true" className="mb-0.5 h-5 w-5 text-brand" />
            {props.whatsappLabel}
          </a>
        )}
        {props.directionsHref && (
          <a
            href={props.directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`${secondary} flex-1`}
          >
            <Navigation aria-hidden="true" className="mb-0.5 h-5 w-5 text-brand" />
            {props.directionsLabel}
          </a>
        )}
        <a
          href={props.bookHref}
          className="press ml-1 flex h-12 flex-[1.6] items-center justify-center rounded-full bg-brand px-4 text-[0.95rem] font-medium whitespace-nowrap text-white hover:bg-brand-strong"
        >
          {props.bookLabel}
        </a>
      </div>
    </div>
  );
}
