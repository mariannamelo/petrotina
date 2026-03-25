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
import { useEffect, useState, useMemo } from "react";
import { AgendaSheet, Evento, SheetAction } from "@/components/agenda/AgendaSheet";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    default: return "futuro";
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

const INITIAL_EVENTS: Evento[] = [
  { id: "1", data: "2026-03-24", hora: "08:30", duracao: 30, pet: "Zeus", servico: "Creche", tutor: "João Carlos", responsavel: "Carla Souza", status: "Atrasado", observacoes: "" },
  { id: "2", data: "2026-03-24", hora: "09:00", duracao: 60, pet: "Thor", servico: "Banho e Tosa", tutor: "Mariana Silva", responsavel: "Paula Lima", status: "Em andamento", observacoes: "" },
  { id: "3", data: "2026-03-24", hora: "10:30", duracao: 30, pet: "Mel", servico: "Só Tosa", tutor: "Roberta Costa", responsavel: "Carla Souza", status: "Aguardando", observacoes: "" },
  { id: "4", data: "2026-03-24", hora: "14:00", duracao: 30, pet: "Luna", servico: "Só Banho", tutor: "Felipe Martins", responsavel: "Paula Lima", status: "Concluído", observacoes: "" },
  { id: "5", data: "2026-03-25", hora: "09:00", duracao: 30, pet: "Pérola", servico: "Banho", tutor: "Márcia Mendes", responsavel: "Carla Souza", status: "Concluído", observacoes: "" },
  { id: "6", data: "2026-03-24", hora: "16:00", duracao: 30, pet: "Isis Magdalena", servico: "Só Banho", tutor: "Marianna Melo", responsavel: "Paula Lima", status: "Programado", observacoes: "" },
  { id: "7", data: "2026-03-27", hora: "10:00", duracao: 60, pet: "Buster", servico: "Creche", tutor: "Ana Beatriz", responsavel: "Paula Lima", status: "Programado", observacoes: "" },
];

// Auxiliares de data (nativos como pedido)
const toYMD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTitleDate = (d: Date) => {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" }).format(d);
};

const getStartOfWeek = (d: Date) => {
  const res = new Date(d);
  const day = res.getDay(); // 0: Sun, 1: Mon...
  const diff = res.getDate() - (day === 0 ? 6 : day - 1);
  res.setDate(diff);
  res.setHours(0, 0, 0, 0);
  return res;
};

const getEndOfWeek = (d: Date) => {
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
};

export default function AgendaPage() {
  const [agora, setAgora] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date("2026-03-24"));
  const [viewMode, setViewMode] = useState<"dia" | "semana">("dia");
  const [eventos, setEventos] = useState<Evento[]>(INITIAL_EVENTS);
  const [sheetAction, setSheetAction] = useState<SheetAction>(null);
  
  // Estabiliza o sheetAction para evitar re-renders desnecessários no AgendaSheet
  const stableSheetAction = useMemo(() => {
    if (!sheetAction) return null;
    if (sheetAction.type === "new") {
      return { ...sheetAction, selectedDate: toYMD(selectedDate) };
    }
    return sheetAction;
  }, [sheetAction, selectedDate]);

  const [sheetError, setSheetError] = useState<string | null>(null);

  // Limpa o erro ao abrir/trocar de ação no drawer
  useEffect(() => {
    if (sheetAction) setSheetError(null);
  }, [sheetAction]);

  const checkConflict = (evento: Partial<Evento>) => {
    if (!evento.hora || !evento.data) return { pet: null, responsavel: null };

    const inicioA = horaToMin(evento.hora);
    const fimA = inicioA + (evento.duracao || 30);

    let petError: string | null = null;
    let respError: string | null = null;

    eventos.forEach((e) => {
      if (e.data !== evento.data || e.id === evento.id) return;

      const inicioB = horaToMin(e.hora);
      const fimB = inicioB + e.duracao;

      const sobrepoe = inicioA < fimB && inicioB < fimA;
      if (!sobrepoe) return;

      if (evento.pet && e.pet === evento.pet) {
        petError = "Este pet já possui um agendamento nesse horário.";
      }
      if (evento.responsavel && e.responsavel === evento.responsavel) {
        respError = "Este profissional já possui um agendamento nesse horário.";
      }
    });

    return { pet: petError, responsavel: respError };
  };

  function handleSave(evento: Evento) {
    // Validação de Conflito de Agenda (Intervalo: inícioA < fimB e inícioB < fimA)

    const errors = checkConflict(evento);
    
    if (errors.pet || errors.responsavel) {
      setSheetError(errors.pet || errors.responsavel);
      return;
    }

    setSheetError(null);

    let atualizados = [...eventos];
    if (evento.id) {
      atualizados = atualizados.map((e) => (e.id === evento.id ? evento : e));
    } else {
      evento.id = Date.now().toString();
      atualizados.push(evento);
    }
    atualizados.sort((a, b) => horaToMin(a.hora) - horaToMin(b.hora));
    setEventos(atualizados);
    setSheetAction(null);
  }

  useEffect(() => {
    const tick = () => {
      const now = new Date();
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

  const moveDate = (dir: number) => {
    const step = viewMode === "semana" ? 7 : 1;
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + (dir * step));
    setSelectedDate(next);
  };

  const handleHoje = () => {
    setSelectedDate(new Date());
  };

  // Filtragem
  const eventosDoDia = useMemo(() => {
    const ymd = toYMD(selectedDate);
    return eventos.filter(e => e.data === ymd);
  }, [eventos, selectedDate]);

  const isToday = useMemo(() => {
    return toYMD(selectedDate) === toYMD(new Date());
  }, [selectedDate]);

  // Marcador só aparece no dia de hoje
  let marcadorPct: number | null = null;
  if (isToday && agora !== null && eventosDoDia.length > 0) {
    const lastEvento = eventosDoDia[eventosDoDia.length - 1];
    const lastEnd = horaToMin(lastEvento.hora) + lastEvento.duracao;

    if (agora < lastEnd) {
      for (let i = 0; i < eventosDoDia.length; i++) {
        const slotStart = horaToMin(eventosDoDia[i].hora);
        const slotDuration = eventosDoDia[i].duracao;
        const slotEnd = slotStart + slotDuration;

        if (agora >= slotStart && agora < slotEnd) {
          const progress = (agora - slotStart) / slotDuration;
          marcadorPct = ((i + progress) / eventosDoDia.length) * 100;
          break;
        }

        const nextSlotStart = i < eventosDoDia.length - 1 ? horaToMin(eventosDoDia[i + 1].hora) : Infinity;
        if (agora >= slotEnd && agora < nextSlotStart) {
          marcadorPct = ((i + 1) / eventosDoDia.length) * 100;
          break;
        }
      }
    }
  }

  const agoraStr = agora !== null
    ? `${String(Math.floor(agora / 60)).padStart(2, "0")}:${String(agora % 60).padStart(2, "0")}`
    : "";

  const titleText = useMemo(() => {
    if (viewMode === "dia") return formatTitleDate(selectedDate);
    const start = getStartOfWeek(selectedDate);
    const end = getEndOfWeek(selectedDate);
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} a ${end.getDate()} de ${new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(start)}`;
    }
    return `${start.getDate()} ${new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(start)} - ${end.getDate()} ${new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(end)}`;
  }, [selectedDate, viewMode]);

  return (
    <PageContainer>
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-12">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" size="sm" className="font-semibold px-4 border-border/60 text-foreground/90 shadow-xs"
            onClick={handleHoje}
          >
            Hoje
          </Button>
          <div className="flex items-center ml-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:text-foreground" onClick={() => moveDate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/80 hover:text-foreground" onClick={() => moveDate(1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground ml-2 capitalize">
            {titleText}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center p-1 bg-muted/30 rounded-lg border border-border/40">
            <Button 
              variant="ghost" size="sm" 
              className={cn("h-7 text-[12px] px-4 font-bold transition-all", viewMode === "dia" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground")}
              onClick={() => setViewMode("dia")}
            >
              Dia
            </Button>
            <Button 
              variant="ghost" size="sm" 
              className={cn("h-7 text-[12px] px-4 font-bold transition-all", viewMode === "semana" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground")}
              onClick={() => setViewMode("semana")}
            >
              Semana
            </Button>
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

      {/* CONTEÚDO DINÂMICO: DIA OU SEMANA */}
      {viewMode === "dia" ? (
        <div className="relative">
          {/* MARCADOR DE HORA ATUAL */}
          {marcadorPct !== null && (
            <div
              className="absolute left-24 md:left-20 right-0 z-20 flex items-center pointer-events-none"
              style={{ top: `${marcadorPct}%` }}
            >
              <div className="absolute left-[10px] md:left-[12px] -translate-x-1/2 bg-slate-400 text-white text-[12.5px] font-medium px-2 py-0.5 rounded-sm whitespace-nowrap z-30">
                {agoraStr}
              </div>
              <div className="w-full h-px bg-slate-400/30 dark:bg-slate-700/30" />
            </div>
          )}

          {eventosDoDia.length > 0 ? (
            eventosDoDia.map((ev, i) => (
              <div
                key={ev.id}
                onClick={() => setSheetAction({ type: "view", evento: ev })}
                className={cn(
                  "flex items-center gap-5 md:gap-6 group px-5 -mx-5 rounded-2xl transition-all cursor-pointer",
                  "hover:bg-muted/50 dark:hover:bg-muted/30",
                  i < eventosDoDia.length - 1 && "border-b border-border/40"
                )}
                style={{ minHeight: "100px" }}
              >
                {/* COLUNA HORA */}
                <div className="w-24 md:w-20 shrink-0 flex items-center justify-center md:justify-end md:pr-5">
                  <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
                    {ev.hora}
                  </span>
                </div>

                {/* COLUNA CONTEÚDO */}
                <div className="flex-1 p-6 flex flex-col md:flex-row md:items-start gap-2 md:gap-12 text-foreground/90">
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
                  <div className="shrink-0 mt-0.5 self-start md:self-auto">
                    {statusBadge(getStatusTipo(ev.status), ev.status)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground/40">
              <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Nenhum agendamento para este dia.</p>
            </div>
          )}
        </div>
      ) : (
        /* VISÃO SEMANAL */
        <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border/30 border border-border/40 rounded-2xl overflow-hidden shadow-sm">
          {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
            const date = new Date(getStartOfWeek(selectedDate));
            date.setDate(date.getDate() + dayOffset);
            const ymd = toYMD(date);
            const dayEvents = eventos.filter(e => e.data === ymd);
            const isTodayColumn = toYMD(new Date()) === ymd;

            return (
              <div key={ymd} className={cn("min-h-[500px] bg-background flex flex-col pt-1", isTodayColumn && "bg-muted/5")}>
                {/* Cabeçalho do Dia */}
                <div className={cn(
                  "p-4 flex flex-col items-center gap-1",
                  isTodayColumn && "text-primary bg-primary/5 mx-2 rounded-xl mb-2"
                )}>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                    {new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date)}
                  </span>
                  <span className="text-xl font-bold">
                    {date.getDate()}
                  </span>
                </div>

                {/* Lista de Eventos */}
                <div className="flex-1 p-2 flex flex-col gap-2">
                  {dayEvents.length > 0 ? (
                    dayEvents.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => setSheetAction({ type: "view", evento: ev })}
                        className="p-3 rounded-xl border border-border/50 bg-white dark:bg-slate-950 shadow-xs hover:border-primary/30 hover:bg-muted/5 transition-all cursor-pointer group"
                      >
                        <div className="text-[10px] font-bold text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                          <span>{ev.hora}</span>
                          <div className={cn("h-1.5 w-1.5 rounded-full", 
                            ev.status === "Atrasado" ? "bg-red-500" : 
                            ev.status === "Em andamento" ? "bg-blue-500" : "bg-slate-300"
                          )} />
                        </div>
                        <div className="font-bold text-sm truncate mt-1 text-foreground/90">
                          {ev.pet}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate opacity-80">
                          {ev.servico}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex items-center justify-center opacity-5">
                       <Plus className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AgendaSheet 
        action={stableSheetAction} 
        onClose={() => { setSheetAction(null); setSheetError(null); }} 
        onSave={handleSave} 
        error={sheetError}
        onClearError={() => setSheetError(null)}
        checkConflict={checkConflict}
      />
    </PageContainer>
  );
}
