import { PageContainer } from "@/components/shared/page-container";

export default function DashboardPage() {
  // Mock estático
  const todayDateStr = "Terça-feira, 24 de março";

  return (
    <PageContainer>
      {/* Container mestre que injeta a macro-hierarquia de respiro (Gaps) */}
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Bloco 1: Topo e Aviso (Apoio Terciário) */}
        <div className="flex flex-col gap-3">
          <header>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {todayDateStr}
            </p>
          </header>

          {/* Aviso Discreto / Inline */}
          <div className="inline-flex w-fit items-center rounded-lg bg-orange-500/10 px-4 py-2 border border-orange-500/20">
            <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
              1 tutor solicitou alteração de horário hoje.
            </span>
          </div>
        </div>

        {/* Bloco 2: Métricas Essenciais (Módulos Tangíveis) */}
        <section className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center rounded-xl bg-muted/40 border border-border/50 p-5">
            <span className="text-5xl font-bold tracking-tight text-foreground">14</span>
            <span className="text-sm font-medium text-muted-foreground mt-2 leading-snug">
              Pets presentes agora
            </span>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-muted/40 border border-border/50 p-5">
            <span className="text-5xl font-bold tracking-tight text-foreground">42</span>
            <span className="text-sm font-medium text-muted-foreground mt-2 leading-snug">
              Agendamentos Hoje
            </span>
          </div>
        </section>

        {/* Bloco 3: Fila de Operação (O Coração da Tela - Container Mestre) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground px-1">
            Próximos atendimentos
          </h2>
          
          {/* Caixa central sólida para a fila, decolando do fundo flutuante da tela */}
          <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden flex flex-col">
            
            {/* Row 1 - Atrasado */}
            <div className="flex items-center gap-4 py-5 px-6 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
              <div className="w-14 shrink-0 text-left text-[15px] font-semibold tabular-nums text-muted-foreground">
                09:30
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-bold leading-none text-foreground truncate">
                  Thor
                </h3>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
                  Banho
                </span>
                <span className="text-sm font-semibold text-amber-600 dark:text-amber-500">
                  Atrasado
                </span>
              </div>
            </div>
            
            {/* Row 2 - Normal / Em andamento */}
            <div className="flex items-center gap-4 py-5 px-6 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
              <div className="w-14 shrink-0 text-left text-[15px] font-semibold tabular-nums text-foreground">
                09:45
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-bold leading-none text-foreground truncate">
                  Luna
                </h3>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
                  Tosa
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Em andamento
                </span>
              </div>
            </div>

            {/* Row 3 - Aguardando */}
            <div className="flex items-center gap-4 py-5 px-6 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
              <div className="w-14 shrink-0 text-left text-[15px] font-semibold tabular-nums text-muted-foreground">
                10:00
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[19px] font-bold leading-none text-foreground truncate">
                  Zeus
                </h3>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-full">
                  Creche
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  Aguardando
                </span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </PageContainer>
  );
}
