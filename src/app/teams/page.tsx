import { getAllTeams } from '@/app/team-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Shield, Trophy } from 'lucide-react';
import Image from 'next/image';

export default async function TeamsPage() {
  const teams = await getAllTeams();

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-[#111111] p-6 pt-10 sticky top-0 z-10 border-b border-white/5">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">Squads</h1>
            <p className="text-cyan-500 text-sm font-medium tracking-widest uppercase mt-1">Clans & Factions</p>
          </div>
          <Link href="/teams/new">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest px-4 h-10 rounded-sm">
              Form Squad
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {teams.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#1a1a1a] border border-white/5 rounded-sm">
            <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">No Squads Yet</h2>
            <p className="text-slate-400 text-sm mb-6">Be the first to create a faction and recruit top players.</p>
            <Link href="/teams/new">
              <Button variant="outline" className="border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black">
                CREATE SQUAD
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <Link href={`/teams/${team.slug}`} key={team.id}>
                <Card className="bg-[#1a1a1a] border-white/5 hover:border-cyan-500/50 transition-colors cursor-pointer rounded-sm overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4">
                      {team.logoUrl ? (
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-black/50 border border-white/10 shrink-0">
                          <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center shrink-0">
                          <Shield className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg truncate group-hover:text-cyan-400 transition-colors">{team.name}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-cyan-500" />
                            {team._count.members} Members
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="truncate">Capt: {team.captain.telegramUsername || team.captain.firstName}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
