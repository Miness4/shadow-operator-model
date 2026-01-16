import { MessageSquare, Mail, FileCheck } from 'lucide-react';

export default function GhostwritePage(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ghostwrite</h1>
        <p className="mt-2 text-muted-foreground">
          Copywriting OS - Generate campaign content using the 11 psychological buy buttons
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Story Copy Generator */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-ghostwrite/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ghostwrite/10">
            <MessageSquare className="h-6 w-6 text-ghostwrite" />
          </div>
          <h3 className="text-lg font-semibold">14-Day Story Sequence</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate a complete 14-day Instagram story sequence with psychological triggers for each day.
          </p>
          <button className="mt-4 rounded-md bg-ghostwrite/10 px-4 py-2 text-sm font-medium text-ghostwrite transition-colors hover:bg-ghostwrite/20">
            Generate Stories
          </button>
        </div>

        {/* Sales Page Generator */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-ghostwrite/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ghostwrite/10">
            <FileCheck className="h-6 w-6 text-ghostwrite" />
          </div>
          <h3 className="text-lg font-semibold">Sales Page Builder</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create high-converting sales page copy with headlines, benefits, and risk reversal frameworks.
          </p>
          <button className="mt-4 rounded-md bg-ghostwrite/10 px-4 py-2 text-sm font-medium text-ghostwrite transition-colors hover:bg-ghostwrite/20">
            Build Sales Page
          </button>
        </div>

        {/* Email Sequence */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-ghostwrite/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-ghostwrite/10">
            <Mail className="h-6 w-6 text-ghostwrite" />
          </div>
          <h3 className="text-lg font-semibold">Email Sequence</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Auto-generate 5-email launch sequences with subject lines optimized for open rates.
          </p>
          <button className="mt-4 rounded-md bg-ghostwrite/10 px-4 py-2 text-sm font-medium text-ghostwrite transition-colors hover:bg-ghostwrite/20">
            Create Emails
          </button>
        </div>
      </div>

      {/* Campaign DNA Section */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="text-lg font-semibold">Campaign DNA</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure your brand voice, ICP, and buying psychology to personalize all generated content.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-bg-tertiary p-4">
            <p className="text-sm font-medium">Active Campaign</p>
            <p className="mt-1 text-muted-foreground">No campaign selected</p>
          </div>
          <div className="rounded-lg border border-border bg-bg-tertiary p-4">
            <p className="text-sm font-medium">Voice Profile</p>
            <p className="mt-1 text-muted-foreground">Not configured</p>
          </div>
          <div className="rounded-lg border border-border bg-bg-tertiary p-4">
            <p className="text-sm font-medium">Generations Today</p>
            <p className="mt-1 text-2xl font-bold">0</p>
          </div>
        </div>
      </div>

      {/* Psychological Buttons Reference */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="text-lg font-semibold">11 Psychological Buy Buttons</h3>
        <div className="mt-4 grid gap-2 md:grid-cols-4 lg:grid-cols-6">
          {[
            'Curiosity',
            'Scarcity',
            'Social Proof',
            'Urgency',
            'Authority',
            'Reciprocity',
            'Likeability',
            'Personalization',
            'FOMO',
            'Risk Reversal',
            'Pain Removal',
          ].map((button, i) => (
            <div
              key={button}
              className="rounded-md bg-bg-tertiary px-3 py-2 text-center text-sm"
            >
              <span className="text-muted-foreground">{i + 1}.</span> {button}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
