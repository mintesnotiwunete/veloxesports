import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">Settings</h1>
         <p className="text-sm text-gray-400 font-medium mt-1">Configure platform preferences.</p>
      </div>
      <Card className="bg-[#0d1412] border-white/5">
        <CardContent className="p-12 text-center text-gray-500 font-medium">
          Settings coming soon.
        </CardContent>
      </Card>
    </div>
  );
}
