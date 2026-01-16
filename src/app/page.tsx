import Link from 'next/link';
import { Zap, ArrowRight, Sparkles, PenLine, Users } from 'lucide-react';

export default function HomePage(): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SHADOWCORE</span>
          </div>
          <Link
            href="/synthesio"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            AI-Powered
            <span className="block text-primary">Business Hivemind</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Transform creator profiles into monetization blueprints. Generate
            14-day story sequences. Track deals from prospect to payout.
            All powered by 500+ AI models.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/synthesio"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-20 grid max-w-5xl gap-6 px-4 md:grid-cols-3">
          {/* Synthesio */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 text-left transition-all hover:border-synthesio/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-synthesio/10">
              <Sparkles className="h-5 w-5 text-synthesio" />
            </div>
            <h3 className="text-lg font-semibold">Synthesio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Product Architect - Scan creator DNA, generate gameplans, and build
              pitch decks automatically.
            </p>
          </div>

          {/* Ghostwrite */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 text-left transition-all hover:border-ghostwrite/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-ghostwrite/10">
              <PenLine className="h-5 w-5 text-ghostwrite" />
            </div>
            <h3 className="text-lg font-semibold">Ghostwrite</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Copywriting OS - Generate story sequences, sales pages, and emails
              using 11 psychological buy buttons.
            </p>
          </div>

          {/* Flowy */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 text-left transition-all hover:border-flowy/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-flowy/10">
              <Users className="h-5 w-5 text-flowy" />
            </div>
            <h3 className="text-lg font-semibold">Flowy</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              CRM - Track creator relationships, automate follow-ups, and monitor
              campaign metrics in real-time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          SHADOWCORE - Built for Shadow Operators
        </div>
      </footer>
    </div>
  );
}
