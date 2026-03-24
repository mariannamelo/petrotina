import { PageContainer } from "@/components/shared/page-container";

export default function SolicitacoesPage() {
  return (
    <PageContainer>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Solicitações</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Em breve: Caixa de entrada com novos pedidos de agendamento feitos pelo app do tutor.
        </p>
      </div>
    </PageContainer>
  );
}
