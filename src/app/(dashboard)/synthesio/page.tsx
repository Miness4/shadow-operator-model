import { Search, FileText, Target } from 'lucide-react';

export default function SynthesioPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Synthesio</h1>
        <p className="mt-2 text-muted-foreground">
          Product Architect - Transform creator profiles into monetization blueprints
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Creator DNA Scanner */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-synthesio/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-synthesio/10">
            <Search className="h-6 w-6 text-synthesio" />
          </div>
          <h3 className="text-lg font-semibold">Creator DNA Scanner</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Analyze Instagram profiles to extract creator DNA, desperation scores, and monetization gaps.
          </p>
          <button className="mt-4 rounded-md bg-synthesio/10 px-4 py-2 text-sm font-medium text-synthesio transition-colors hover:bg-synthesio/20">
            Scan Creator
          </button>
        </div>

        {/* Gameplan Generator */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-synthesio/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-synthesio/10">
            <FileText className="h-6 w-6 text-synthesio" />
          </div>
          <h3 className="text-lg font-semibold">Gameplan Generator</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create comprehensive monetization gameplans with pricing, curriculum, and launch timelines.
          </p>
          <button className="mt-4 rounded-md bg-synthesio/10 px-4 py-2 text-sm font-medium text-synthesio transition-colors hover:bg-synthesio/20">
            Create Gameplan
          </button>
        </div>

        {/* Niche Explorer */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-synthesio/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-synthesio/10">
            <Target className="h-6 w-6 text-synthesio" />
          </div>
          <h3 className="text-lg font-semibold">Niche Explorer</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore 200+ niches with profitability scores, competition levels, and creator recommendations.
          </p>
          <button className="mt-4 rounded-md bg-synthesio/10 px-4 py-2 text-sm font-medium text-synthesio transition-colors hover:bg-synthesio/20">
            Explore Niches
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Creators Scanned</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Gameplans Created</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Pitch Decks Generated</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Avg Desperation Score</p>
          <p className="mt-1 text-2xl font-bold">-</p>
        </div>
      </div>
    </div>
  );
}
