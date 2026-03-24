import { PageContainer } from "@/components/shared/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <PageContainer>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Banhos Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 desde ontem</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Creche (Pets)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Lotação: 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Faturamento do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 850,00</div>
            <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 rounded-xl border bg-card shadow-sm p-8 flex items-center justify-center min-h-[300px] text-muted-foreground">
        Área reservada para próximos agendamentos (Placeholder)
      </div>
    </PageContainer>
  );
}
