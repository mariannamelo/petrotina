import { PageContainer } from "@/components/shared/page-container";

export default function ConfiguracoesPage() {
  return (
    <PageContainer>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Configurações</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Em breve: Ajustes da empresa, tabela de preços, horários de funcionamento e permissões de equipe.
        </p>
      </div>
    </PageContainer>
  );
}
