import { getTeamBySlug } from '@/app/team-actions';
import { notFound } from 'next/navigation';
import TeamProfileClient from './TeamProfileClient';

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  return <TeamProfileClient team={team} />;
}
