'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTelegram } from '@/components/TelegramProvider';
import { ArrowLeft, Shield, Users, UserPlus, Check, X, Loader2, Trophy } from 'lucide-react';
import Link from 'next/link';
import { requestToJoinTeam, manageTeamRequest } from '@/app/team-actions';
import { useRouter } from 'next/navigation';

export default function TeamProfileClient({ team }: { team: any }) {
  const { user } = useTelegram();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('roster');

  const tgBigInt = user?.id ? BigInt(user.id.toString()) : null;
  // Note: we can't easily check exact ownership strictly on client without user.id matching DB, 
  // but we can check telegramUsername or we assume the server will protect the route.
  // We'll check if the connected user is a member of this team by comparing telegram info (simplistic for UI).
  const isCaptain = team.captain.telegramUsername === user?.username || (user && team.captain.firstName === user.first_name);
  
  const memberRecord = team.members.find((m: any) => 
    m.user.telegramUsername === user?.username || (user && m.user.firstName === user.first_name)
  );

  const isMember = !!memberRecord && memberRecord.status === 'ACTIVE';
  const isPending = !!memberRecord && memberRecord.status === 'PENDING';

  const handleJoin = async () => {
    if (!user) return;
    setIsSubmitting(true);
    await requestToJoinTeam(user.id, team.id);
    setIsSubmitting(false);
    router.refresh(); // Refresh the page to get updated state
  };

  const handleManage = async (memberId: string, action: 'ACCEPT' | 'REJECT' | 'KICK') => {
    if (!user) return;
    await manageTeamRequest(user.id, memberId, action);
    router.refresh();
  };

  const activeMembers = team.members.filter((m: any) => m.status === 'ACTIVE');
  const pendingMembers = team.members.filter((m: any) => m.status === 'PENDING');

  return (
    <div className="pb-24 min-h-screen bg-[#0a0a0a]">
      {/* Header Image / Info */}
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-cyan-950 to-[#0a0a0a] border-b border-white/10" />
        <Link href="/teams" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="bg-black/50 text-white hover:bg-black/70 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div className="px-6 relative -mt-16 mb-4 flex flex-col items-center sm:items-start sm:flex-row gap-4">
          <div className="w-32 h-32 rounded-lg bg-[#111] border-4 border-[#0a0a0a] shadow-xl overflow-hidden flex items-center justify-center shrink-0">
            {team.logoUrl ? (
              <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              <Shield className="w-16 h-16 text-cyan-500/50" />
            )}
          </div>
          
          <div className="sm:mt-16 text-center sm:text-left flex-1">
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">{team.name}</h1>
            <p className="text-cyan-500 font-bold uppercase tracking-widest text-xs mt-1">Captain: {team.captain.telegramUsername || team.captain.firstName}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        {team.description && (
          <p className="text-slate-400 text-sm mb-4 bg-[#111] p-4 rounded-sm border border-white/5">
            {team.description}
          </p>
        )}

        {/* Call to Action */}
        {user && !isCaptain && !isMember && !isPending && (
          <Button 
            onClick={handleJoin} 
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest h-12 rounded-sm mb-4"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request to Join Squad'}
          </Button>
        )}

        {isPending && (
          <Button disabled className="w-full bg-slate-800 text-slate-400 font-bold uppercase tracking-widest h-12 rounded-sm mb-4">
            Request Pending...
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-[#111] border border-white/5 rounded-sm p-1 h-auto mb-4">
            <TabsTrigger value="roster" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black rounded-sm py-2 font-bold uppercase tracking-widest text-xs">
              Active Roster
            </TabsTrigger>
            {isCaptain && (
              <TabsTrigger value="manage" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black rounded-sm py-2 font-bold uppercase tracking-widest text-xs">
                Manage ({pendingMembers.length})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="roster" className="space-y-3">
            {activeMembers.map((member: any) => (
              <Card key={member.id} className="bg-[#1a1a1a] border-white/5 rounded-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      {member.user.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white">{member.user.firstName}</p>
                      <p className="text-xs text-slate-400">@{member.user.telegramUsername || 'user'}</p>
                    </div>
                  </div>
                  {member.role === 'CAPTAIN' ? (
                    <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold uppercase tracking-wider rounded-sm">Captain</span>
                  ) : (
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-sm">Member</span>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {isCaptain && (
            <TabsContent value="manage" className="space-y-4">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2 mb-3">Pending Requests</h3>
              {pendingMembers.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No pending join requests.</p>
              ) : (
                pendingMembers.map((member: any) => (
                  <Card key={member.id} className="bg-[#1a1a1a] border-white/5 rounded-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                          {member.user.avatarUrl ? (
                            <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white">{member.user.firstName}</p>
                          <p className="text-xs text-slate-400">@{member.user.telegramUsername}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="icon" 
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 h-8 w-8 rounded-sm"
                          onClick={() => handleManage(member.id, 'ACCEPT')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-8 w-8 rounded-sm"
                          onClick={() => handleManage(member.id, 'REJECT')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
