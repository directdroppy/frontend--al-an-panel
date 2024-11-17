import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReferralList } from '@/components/referrals/ReferralList';
import { mockReferrals } from '@/data/referrals';

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Referanslar</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Referans Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferralList referrals={mockReferrals} />
        </CardContent>
      </Card>
    </div>
  );
}