"use client";

import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  List as ListIcon,
  Hourglass,
  Loader,
  Clock,
  CheckCircle2,
  Scissors,
  User,
  UserCog,
  Bath,
  ChessQueen,
  UserStar,
  IdCard,
  House,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AgendaSheet, Evento, SheetAction } from "@/components/agenda/AgendaSheet";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const INITIAL_EVENTS: Evento[] = [
  { id: "1", hora: "08:30", duracao: 30, pet: "Zeus", servico: "Creche", tutor: "João Carlos", responsavel: "Carla Souza", status: "Atrasado", observacoes: "" },
  { id: "2", hora: "09:00", duracao: 60, pet: "Thor", servico: "Banho e Tosa", tutor: "Mariana Silva", responsavel: "Paula Lima", status: "Em andamento", observacoes: "" },
  { id: "3", hora: "10:30", duracao: 30, pet: "Mel", servico: "Só Tosa", tutor: "Roberta Costa", responsavel: "Carla Souza", status: "Aguardando", observacoes: "" },
  { id: "4", hora: "14:00", duracao: 30, pet: "Luna", servico: "Só Banho", tutor: "Felipe Martins", responsavel: "Paula Lima", status: "Concluído", observacoes: "" },
  { id: "5", hora: "15:00", duracao: 30, pet: "Pérola", servico: "Banho", tutor: "Márcia Mendes", responsavel: "Carla Souza", status: "Concluído", observacoes: "" },
  { id: "6", hora: "16:00", duracao: 15, pet: "Isis Magdalena", servico: "Só Banho", tutor: "Marianna Melo", responsavel: "Paula Lima", status: "Programado", observacoes: "" },
  { id: "7", hora: "16:30", duracao: 60, pet: "Buster", servico: "Creche", tutor: "Ana Beatriz", responsavel: "Paula Lima", status: "Programado", observacoes: "" },
];

function horaToMin(hora: string): number {
  if (!hora) return 0;
  const [h, m] = hora.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function getStatusTipo(status: string): string {
  switch (status) {
    case "Atrasado": return "alerta";
    case "Em andamento": return "andamento";
    case "Aguardando": return "neutro";
    case "Concluído": return "concluido";
    default: return "futuro"; // Programado ou qualquer outro
  }
}


function statusBadge(tipo: any, label: string) {
  if (tipo === "alerta" || tipo === "andamento" || tipo === "neutro" || tipo === "concluido") {
    return (
      <Badge variant={tipo}>
        {tipo === "alerta" && <Hourglass className="h-3 w-3" />}
        {tipo === "andamento" && <Loader className="h-3 w-3" />}
        {tipo === "neutro" && <Clock className="h-3 w-3" />}
        {tipo === "concluido" && <CheckCircle2 className="h-3 w-3" />}
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-muted-foreground/60 border-border/60">
      {label}
    </Badge>
  );
}

export default function AgendaPage() {
  const [agora, setAgora] = useState<number | null>(null);
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTS);
  const [sheetAction, setSheetAction] = useState<SheetAction>(null);

  function handleSave(evento: Evento) {
    let atualizados = [...eventos];
    if (evento.id) {
      atualizados = atualizados.map((e) => (e.id === evento.id ? evento : e));
    } else {
      evento.id = Date.now().toString();
      atualizados.push(evento);
    }
    // Reordenar chronologicamente
    atualizados.sort((a, b) => horaToMin(a.hora) - horaToMin(b.hora));
    setEventos(atualizados);
    setSheetAction(null);
  }

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Extrai h/m explicitamente no fuso de Brasília, independente do sistema
      const parts = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).formatToParts(now);
      const h = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0");
      const m = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0");
      setAgora(h * 60 + m);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Pos. % do marcador: usa duracao real do evento, congela em gaps, desaparece após o último
  let marcadorPct: number | null = null;
  if (agora !== null && eventos.length > 0) {
    const lastEvento = eventos[eventos.length - 1];
    const lastEnd = horaToMin(lastEvento.hora) + lastEvento.duracao;

    // Se passa do fim do último evento, não exibe o marcador
    if (agora < lastEnd) {
      for (let i = 0; i < eventos.length; i++) {
        const slotStart = horaToMin(eventos[i].hora);
        const slotDuration = eventos[i].duracao;
        const slotEnd = slotStart + slotDuration;

        if (agora >= slotStart && agora < slotEnd) {
          const progress = (agora - slotStart) / slotDuration;
          marcadorPct = ((i + progress) / eventos.length) * 100;
          break;
        }

        // Em gap entre slots: congela na base do próximo
        const nextSlotStart = i < eventos.length - 1 ? horaToMin(eventos[i + 1].hora) : Infinity;
        if (agora >= slotEnd && agora < nextSlotStart) {
          marcadorPct = ((i + 1) / eventos.length) * 100;
          break;
        }
      }
    }
  }

  const agoraStr = agora !== null
    ? `${String(Math.floor(agora / 60)).padStart(2, "0")}:${String(agora % 60).padStart(2, "0")}`
    : "";

  return (
    <PageContainer>
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-12">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-semibold px-4 border-border/60 text-foreground/90 shadow-xs">
            Hoje
          </Button>
          <div className="flex items-center ml-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:text-foreground">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:text-foreground">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground ml-2">
            24 de março
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center p-1 bg-muted/30 rounded-lg border border-border/40">
            <Button variant="ghost" size="sm" className="h-7 text-[12px] font-bold px-4 bg-background shadow-xs text-foreground cursor-default">Dia</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] font-semibold px-4 text-muted-foreground cursor-default transition-none">Semana</Button>
            <Button variant="ghost" size="sm" className="h-7 text-[12px] font-semibold px-4 text-muted-foreground cursor-default transition-none">Mês</Button>
          </div>
          <div className="hidden lg:flex items-center p-1 bg-muted/30 rounded-lg border border-border/40">
            <Button variant="ghost" size="icon" className="h-7 w-8 bg-background shadow-xs text-foreground cursor-default"><ListIcon className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-8 text-muted-foreground cursor-default transition-none"><CalendarIcon className="h-4 w-4" /></Button>
          </div>
          <Button 
            className="w-full sm:w-auto font-bold shadow-md px-6"
            onClick={() => setSheetAction({ type: "new" })}
          >
            <Plus className="mr-2 h-4.5 w-4.5" />
            Novo Agendamento
          </Button>
        </div>
      </header>

      {/* TIMELINE: Eixo Vertical Absoluto (Fundo removido para V2.0) + Linhas de Eventos */}
      <div className="relative">

        {/* MARCADOR DE HORA ATUAL: Reposicionado sobre o eixo (left-24 no mobile) */}
        {marcadorPct !== null && (
          <div
            className="absolute left-24 md:left-20 right-0 z-20 flex items-center pointer-events-none"
            style={{ top: `${marcadorPct}%` }}
          >
            {/* Badge cinza informativo */}
            <div className="absolute left-[10px] md:left-[12px] -translate-x-1/2 bg-slate-400 text-white text-[12.5px] font-medium px-2 py-0.5 rounded-sm whitespace-nowrap z-30">
              {agoraStr}
            </div>
            {/* Linha discreta */}
            <div className="w-full h-px bg-slate-400/30 dark:bg-slate-700/30" />
          </div>
        )}

        {/* LISTA DE EVENTOS: Cada compromisso é uma linha (HORA + CONTEÚDO) */}
        {eventos.map((ev, i) => (
          <div
            key={ev.id}
            onClick={() => setSheetAction({ type: "view", evento: ev })}
            className={cn(
              "flex items-center gap-5 md:gap-6 group px-5 -mx-5 rounded-2xl transition-all cursor-pointer",
              "hover:bg-muted/50 dark:hover:bg-muted/30",
              i < eventos.length - 1 && "border-b border-border/40"
            )}
            style={{ minHeight: "100px" }}
          >
            {/* COLUNA HORA: Leitura forte e prioritária (Centralizada - w-24 no mobile) */}
            <div className="w-24 md:w-20 shrink-0 flex items-center justify-center md:justify-end md:pr-5">
              <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                {ev.hora}
              </span>
            </div>

            {/* COLUNA CONTEÚDO: Espaçada para respirar (Gap-2 no mobile, Gap-12 no desktop) */}
            <div className="flex-1 p-6 flex flex-col md:flex-row md:items-start gap-2 md:gap-12">
              {/* METADADOS: flex-col mobile / flex-wrap desktop */}
              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <h3 className="text-xl font-semibold tracking-tight text-foreground leading-tight truncate">
                  {ev.pet}
                </h3>
                <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-1 md:gap-x-5 md:gap-y-1">
                  {/* Serviço */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-default">
                        {ev.servico === "Só Tosa" && <Scissors className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                        {ev.servico === "Só Banho" && <Bath className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                        {ev.servico === "Banho e Tosa" && <ChessQueen className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                        {(ev.servico === "Creche" || ev.servico === "Hotel") && <House className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                        {!["Só Tosa", "Só Banho", "Banho e Tosa", "Creche", "Hotel"].includes(ev.servico) && <Scissors className="h-3.5 w-3.5 opacity-50 shrink-0" />}
                        <span>{ev.servico}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Serviço</TooltipContent>
                  </Tooltip>

                  {/* Tutor */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-default">
                        <UserStar className="h-3.5 w-3.5 opacity-50 shrink-0" />
                        <span className="truncate">{ev.tutor}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Tutor</TooltipContent>
                  </Tooltip>

                  {/* Responsável */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-default">
                        <IdCard className="h-3.5 w-3.5 opacity-50 shrink-0" />
                        <span className="truncate">{ev.responsavel}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">Responsável</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Status badge: Abaixo no mobile, Direita no desktop */}
              <div className="shrink-0 mt-0.5 md:mt-0.5 self-start md:self-auto">
                {statusBadge(getStatusTipo(ev.status), ev.status)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AgendaSheet 
        action={sheetAction} 
        onClose={() => setSheetAction(null)} 
        onSave={handleSave} 
      />
    </PageContainer>
  );
}
