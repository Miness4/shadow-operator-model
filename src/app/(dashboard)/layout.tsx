import { AppShell } from '@/components/shared/AppShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <AppShell>{children}</AppShell>;
}
