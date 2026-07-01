"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  Gamepad2,
  Gift,
  Lightbulb,
  MapPin,
  MessageCircle,
  Package,
  Settings,
  Sparkles,
  Star,
  Swords,
  Tag,
  Target,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavier components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// Tier badge styles — all driven by the global nav theme color (no hardcoded hex)
const TIER_STYLES: Record<string, string> = {
  SS: "bg-[hsl(var(--nav-theme))] text-white border-transparent",
  S: "bg-[hsl(var(--nav-theme)/0.85)] text-white border-transparent",
  A: "bg-[hsl(var(--nav-theme)/0.65)] text-white border-transparent",
  B: "bg-[hsl(var(--nav-theme)/0.45)] text-white border-transparent",
  D: "bg-[hsl(var(--nav-theme)/0.25)] text-foreground border-[hsl(var(--nav-theme)/0.4)]",
  Trade:
    "bg-[hsl(var(--nav-theme-light)/0.18)] text-[hsl(var(--nav-theme-light))] border-[hsl(var(--nav-theme-light)/0.4)]",
};

// Priority badge — single source of truth, theme color only
function PriorityBadge({ priority }: { priority: string }) {
  const isHigh = priority.toLowerCase() === "high";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
        isHigh
          ? "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]"
          : "bg-white/5 border-border text-muted-foreground"
      }`}
    >
      <Star className="w-3 h-3" />
      {priority}
    </span>
  );
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sakurastandwiki.wiki";

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [standsExpanded, setStandsExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1800);
  };

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Sakura Stand Wiki",
        description:
          "Complete Sakura Stand Wiki covering Roblox codes, tier list, Trello links, specs, stands, skins, items, trading values, and beginner guides for faster progress.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 687,
          height: 432,
          caption: "Sakura Stand - Roblox Anime Fighting Experience",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Sakura Stand Wiki",
        alternateName: "Sakura Stand",
        url: siteUrl,
        description:
          "Complete Sakura Stand Wiki resource hub for Roblox codes, tier list, specs, stands, skins, items, trading values, and Trello links",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 687,
          height: 432,
          caption: "Sakura Stand Wiki - Roblox Anime Fighting Experience",
        },
        sameAs: [
          "https://www.roblox.com/games/8534845015/Sakura-Stand",
          "https://discord.com/invite/sakurastand",
          "https://www.reddit.com/r/SakuraStand/",
          "https://www.youtube.com/watch?v=ha4FRZ3WrTk",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Sakura Stand",
        gamePlatform: ["PC", "Mac", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Anime", "Fighting", "Adventure", "Farming"],
        numberOfPlayers: { minValue: 1, maxValue: 20 },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/8534845015/Sakura-Stand",
        },
      },
      {
        "@type": "VideoObject",
        name: "Going From Noob To Sukuna In Roblox Sakura Stand",
        description:
          "Sakura Stand progression gameplay — going from a brand-new player to unlocking the Sukuna spec.",
        uploadDate: "2023-12-19",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/ha4FRZ3WrTk",
        url: "https://www.youtube.com/watch?v=ha4FRZ3WrTk",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Ad slot 1: sticky top banner */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* ===== Hero Section ===== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                          bg-[hsl(var(--nav-theme)/0.1)]
                          border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/8534845015/Sakura-Stand"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* ===== Video Section ===== */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="ha4FRZ3WrTk"
              title="Going From Noob To Sukuna In Roblox Sakura Stand"
            />
          </div>
        </div>
      </section>

      {/* ===== Tools Grid - 8 Navigation Cards ===== */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                "codes",
                "trello-and-discord",
                "beginner-guide",
                "tier-list",
                "stands-and-specs",
                "items-and-farming",
                "bosses-and-quests",
                "updates-and-patch-notes",
              ];
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad slot 2: native banner */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* Ad slot 3: responsive banner */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Module 1: Codes (code-cards) — no source links ===== */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Gift className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                {t.modules.sakuraStandCodes.subtitle}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandCodes.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandCodes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Code cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {t.modules.sakuraStandCodes.codes.map((c: any, index: number) => (
                <div
                  key={index}
                  className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <code className="text-sm md:text-base font-bold text-[hsl(var(--nav-theme-light))] break-all">
                      {c.code}
                    </code>
                    <button
                      onClick={() => copyCode(c.code)}
                      aria-label={`Copy code ${c.code}`}
                      className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                    >
                      {copiedCode === c.code ? (
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]">
                      {c.reward}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground">
                      {c.status}
                    </span>
                    <span className="text-muted-foreground">{c.best_for}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Redemption steps panel */}
            <div className="p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-base md:text-lg">How to Redeem</h3>
              </div>
              <ol className="space-y-4">
                {t.modules.sakuraStandCodes.steps.map((s: any, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{s.step}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {s.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot 4 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* ===== Module 2: Trello & Discord (card-list) ===== */}
      <section
        id="trello-and-discord"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Official Links
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandTrelloDiscord.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandTrelloDiscord.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {t.modules.sakuraStandTrelloDiscord.links.map((l: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base md:text-lg">{l.label}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                    {l.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{l.content}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  <span className="font-medium text-foreground/80">Best for: </span>
                  {l.use_case}
                </p>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors"
                >
                  Open Link
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 3: Beginner Guide (step-by-step) ===== */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Starter Guide
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandBeginnerGuide.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandBeginnerGuide.intro}
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            {t.modules.sakuraStandBeginnerGuide.steps.map((s: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 md:flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {s.description}
                  </p>
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)]">
                    <Lightbulb className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {s.tip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad slot 5 */}
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Module 4: Tier List (tier-grid) ===== */}
      <section
        id="tier-list"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Trophy className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Meta Rankings
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandTierList.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandTierList.intro}
            </p>
          </div>

          <div className="space-y-4 md:space-y-5">
            {t.modules.sakuraStandTierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 p-4 md:p-5 bg-white/5 border border-border rounded-xl"
              >
                <div className="flex items-center gap-3 md:w-48 md:flex-shrink-0">
                  <span
                    className={`inline-flex items-center justify-center min-w-[3rem] h-12 px-3 rounded-lg text-lg font-bold border ${TIER_STYLES[tier.tier] || TIER_STYLES.D}`}
                  >
                    {tier.tier}
                  </span>
                  <div>
                    <p className="font-bold text-sm md:text-base">{tier.category}</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tier.entries.map((e: string, i: number) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-white/5 border border-border text-xs md:text-sm"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {tier.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 5: Stands & Specs (accordion) ===== */}
      <section id="stands-and-specs" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Swords className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Abilities
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandStandsSpecs.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandStandsSpecs.intro}
            </p>
          </div>

          <div className="space-y-3">
            {t.modules.sakuraStandStandsSpecs.groups.map((g: any, gi: number) => {
              const isOpen = standsExpanded === gi;
              return (
                <div
                  key={gi}
                  className="border border-border rounded-xl overflow-hidden bg-white/5"
                >
                  <button
                    onClick={() => setStandsExpanded(isOpen ? null : gi)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-base md:text-lg">{g.group}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                        {g.summary}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))] transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 md:px-5 pb-4 md:pb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {g.entries.map((e: any, ei: number) => (
                        <div
                          key={ei}
                          className="p-4 rounded-lg bg-white/5 border border-border"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h4 className="font-semibold text-sm md:text-base">
                              {e.name}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                              {e.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground/80">Obtain: </span>
                            {e.obtain}
                          </p>
                          <p className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium text-foreground/80">Role: </span>
                            {e.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {e.best_for}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ad slot 6: mobile banner */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* ===== Module 6: Items & Farming (table) ===== */}
      <section
        id="items-and-farming"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Package className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Items
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandItemsFarming.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandItemsFarming.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {t.modules.sakuraStandItemsFarming.items.map((it: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm md:text-base">{it.item}</h3>
                  <PriorityBadge priority={it.priority} />
                </div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] mb-2">
                  {it.category}
                </span>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground/80">Source: </span>
                  {it.source}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/80">Use: </span>
                  {it.use}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 7: Bosses, NPCs & Quests (card-list) ===== */}
      <section id="bosses-and-quests" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Target className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Routes
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandBossesQuests.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandBossesQuests.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.sakuraStandBossesQuests.routes.map((r: any, index: number) => (
              <div
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                    {r.type}
                  </span>
                </div>
                <h3 className="font-bold text-base mb-2">{r.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  <span className="font-medium text-foreground/80">NPC/Boss: </span>
                  {r.npc}
                </p>
                <p className="text-xs text-muted-foreground mb-3 flex items-start gap-1">
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{r.location}</span>
                </p>
                <div className="mb-2">
                  <p className="text-xs font-semibold text-foreground/80 mb-1">
                    Requirements
                  </p>
                  <ul className="space-y-1">
                    {r.requirements.map((req: string, ri: number) => (
                      <li
                        key={ri}
                        className="text-xs text-muted-foreground flex items-start gap-1.5"
                      >
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-foreground/80 mb-1">
                    Rewards
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.rewards.map((rw: string, rwi: number) => (
                      <span
                        key={rwi}
                        className="text-xs px-2 py-0.5 rounded-md bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]"
                      >
                        {rw}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-auto text-xs text-muted-foreground italic">
                  {r.goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Module 8: Updates & Patch Notes (timeline) ===== */}
      <section
        id="updates-and-patch-notes"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 mb-3 text-[hsl(var(--nav-theme-light))]">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                Updates
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.sakuraStandUpdates.title}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.sakuraStandUpdates.intro}
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.sakuraStandUpdates.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                      <Tag className="w-3 h-3" />
                      {entry.tag}
                    </span>
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.date} · {entry.label}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2">{entry.headline}</h3>
                  <ul className="space-y-1">
                    {entry.changes.map((ch: string, ci: number) => (
                      <li
                        key={ci}
                        className="text-sm text-muted-foreground flex items-start gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Latest Updates (preserved module — renders only when articles exist) ===== */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* ===== FAQ Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* ===== CTA Section ===== */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad slot 7 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* ===== Footer ===== */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/sakurastand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/SakuraStand/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://trello.com/b/YEDWCrGW/official-sakura-stand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.trello}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/8534845015/Sakura-Stand"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
