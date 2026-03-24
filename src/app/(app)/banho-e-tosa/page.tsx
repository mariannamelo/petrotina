import { PageContainer } from "@/components/shared/page-container";

export default function BanhoETosaPage() {
  return (
    <PageContainer>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Banho e Tosa</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Em breve: Gerenciamento dos serviços de banho, hidratação e tosa. Acompanhe o status de cada pet no salão.
        </p>
      </div>
    </PageContainer>
  );
}
