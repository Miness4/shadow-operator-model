import { Users, MessageCircle, Bell, TrendingUp } from 'lucide-react';

const PIPELINE_STAGES = [
  { name: 'Prospect', count: 0, color: 'bg-muted-foreground' },
  { name: 'Reached Out', count: 0, color: 'bg-secondary' },
  { name: 'In Conversation', count: 0, color: 'bg-warning' },
  { name: 'Deal Signed', count: 0, color: 'bg-primary' },
  { name: 'Active Client', count: 0, color: 'bg-success' },
];

export default function FlowyPage(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Flowy</h1>
        <p className="mt-2 text-muted-foreground">
          CRM - Track creator relationships, outreach, and campaign metrics
        </p>
      </div>

      {/* Pipeline Overview */}
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="text-lg font-semibold">Pipeline Overview</h3>
        <div className="mt-4 flex gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <div
              key={stage.name}
              className="flex-1 rounded-lg border border-border bg-bg-tertiary p-4"
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                <p className="text-sm font-medium">{stage.name}</p>
              </div>
              <p className="mt-2 text-2xl font-bold">{stage.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Contact Management */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-flowy/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-flowy/10">
            <Users className="h-6 w-6 text-flowy" />
          </div>
          <h3 className="text-lg font-semibold">Contact Management</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your creator contacts with tags, notes, and status tracking through the pipeline.
          </p>
          <button className="mt-4 rounded-md bg-flowy/10 px-4 py-2 text-sm font-medium text-flowy transition-colors hover:bg-flowy/20">
            Add Contact
          </button>
        </div>

        {/* Outreach Tracker */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-flowy/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-flowy/10">
            <MessageCircle className="h-6 w-6 text-flowy" />
          </div>
          <h3 className="text-lg font-semibold">Outreach Tracker</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Track DMs, responses, and follow-up sequences with automated reminders.
          </p>
          <button className="mt-4 rounded-md bg-flowy/10 px-4 py-2 text-sm font-medium text-flowy transition-colors hover:bg-flowy/20">
            Log Interaction
          </button>
        </div>

        {/* Reminders */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-flowy/50 hover:shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-flowy/10">
            <Bell className="h-6 w-6 text-flowy" />
          </div>
          <h3 className="text-lg font-semibold">Smart Reminders</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Never miss a follow-up with automated reminder notifications and task management.
          </p>
          <button className="mt-4 rounded-md bg-flowy/10 px-4 py-2 text-sm font-medium text-flowy transition-colors hover:bg-flowy/20">
            Set Reminder
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              No recent activity. Start by adding contacts!
            </p>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h3 className="text-lg font-semibold">Upcoming Reminders</h3>
          <div className="mt-4 space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              No upcoming reminders. You&apos;re all caught up!
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-flowy" />
            <p className="text-sm text-muted-foreground">Response Rate</p>
          </div>
          <p className="mt-1 text-2xl font-bold">-</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Total Contacts</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Active Deals</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Pending Follow-ups</p>
          <p className="mt-1 text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
