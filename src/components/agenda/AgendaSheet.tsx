"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Bath,
  ChessQueen,
  CheckCircle2,
  Clock,
  Edit2,
  Hourglass,
  House,
  IdCard,
  Loader,
  Save,
  Scissors,
  UserStar,
  UserCog,
  ChevronsUpDown,
  Check,
  AlertCircle,
} from "lucide-react";

export interface Evento {
  id: string;
  data: string;
  hora: string;
  duracao: number;
  pet: string;
  servico: string;
  tutor: string;
  responsavel: string;
  status: string;
  observacoes: string;
}

export type SheetAction = { type: "new"; selectedDate?: string } | { type: "view"; evento: Evento } | null;

interface AgendaSheetProps {
  action: SheetAction;
  onClose: () => void;
  onSave: (evento: Evento) => void;
  error?: string | null;
  onClearError?: () => void;
  checkConflict?: (evento: Partial<Evento>) => { pet: string | null; responsavel: string | null };
}

const PETS_MOCK = ["Zeus", "Thor", "Mel", "Luna", "Pérola", "Isis Magdalena", "Buster"];
const SERVICOS_MOCK = ["Só Banho", "Só Tosa", "Banho e Tosa", "Creche", "Hotel"];
const STATUS_MOCK = ["Programado", "Aguardando", "Em andamento", "Atrasado", "Concluído"];
const RESPONSAVEIS_MOCK = ["Carla Souza", "Paula Lima", "Ana Beatriz", "Roberto Alves"];
const DURACOES_MOCK = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "45", label: "45 min" },
  { value: "60", label: "60 min" },
];

// Função auxiliar para mapear o status para a variante do Badge
function getBadgeVariant(status: string) {
  if (status === "Atrasado") return "alerta";
  if (status === "Em andamento") return "andamento";
  if (status === "Aguardando") return "neutro";
  if (status === "Concluído") return "concluido";
  return "outline";
}

function StatusBadge({ status }: { status: string }) {
  const variant = getBadgeVariant(status);
  return (
    <Badge variant={variant as any}>
      {status === "Atrasado" && <Hourglass className="h-3 w-3" />}
      {status === "Em andamento" && <Loader className="h-3 w-3" />}
      {status === "Aguardando" && <Clock className="h-3 w-3" />}
      {status === "Concluído" && <CheckCircle2 className="h-3 w-3" />}
      {status}
    </Badge>
  );
}

// Ícone do serviço alinhado com a timeline
function ServicoIcon({ servico }: { servico: string }) {
  if (servico === "Só Tosa") return <Scissors className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (servico === "Só Banho") return <Bath className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (servico === "Banho e Tosa") return <ChessQueen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  if (servico === "Creche" || servico === "Hotel") return <House className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
  return <Scissors className="h-3.5 w-3.5 text-muted-foreground shrink-0" />;
}

// Horário final derivado — nunca editável diretamente
function calcHoraFim(horaInicio: string, minutos: number): string {
  if (!horaInicio) return "--:--";
  const [h, m] = horaInicio.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "--:--";
  const total = h * 60 + m + minutos;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function AgendaSheet({ action, onClose, onSave, error, onClearError, checkConflict }: AgendaSheetProps) {
  const [internalMode, setInternalMode] = useState<"view" | "edit" | "new" | null>(null);
  const [draft, setDraft] = useState<Partial<Evento>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [openPetCombo, setOpenPetCombo] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ pet: string | null; responsavel: string | null }>({ pet: null, responsavel: null });

  useEffect(() => {
    if (checkConflict && (draft.hora || draft.pet || draft.responsavel)) {
      setFieldErrors(checkConflict(draft));
    } else {
      setFieldErrors({ pet: null, responsavel: null });
    }
  }, [draft.hora, draft.duracao, draft.pet, draft.responsavel, draft.data, checkConflict]);

  useEffect(() => {
    if (!action) {
      setInternalMode(null);
      setDraft({});
      setIsDirty(false);
      return;
    }

    // Só inicializa o draft se for uma nova ação ou se o ID/Data mudar
    // Isso evita que o formulário seja limpo ao selecionar um responsável (que causa re-render no pai)
    const isNewAction = 
      (action.type === "new" && draft.data !== action.selectedDate) ||
      (action.type === "view" && draft.id !== action.evento.id);

    if (isNewAction || !internalMode) {
      if (action.type === "new") {
        setInternalMode("new");
        setDraft({
          data: action.selectedDate || "",
          hora: "",
          duracao: 30,
          pet: "",
          servico: "",
          tutor: "",
          responsavel: "",
          status: "Programado",
          observacoes: "",
        });
        setIsDirty(false);
      } else if (action.type === "view") {
        setInternalMode("view");
        setDraft({ ...action.evento });
        setIsDirty(false);
      }
    }
  }, [action]);

  function handleEditClick() {
    setInternalMode("edit");
  }

  function handleCloseAction(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  function handleCancelClick() {
    handleCloseAction(false);
  }

  function handleChange(field: keyof Evento, value: any) {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (error && onClearError) onClearError();
  }

  function handleSaveClick() {
    if (!draft.pet || !draft.servico || !draft.hora || !draft.duracao) {
      alert("Preencha os campos obrigatórios: Pet, Serviço, Hora e Duração.");
      return;
    }
    onSave({
      id: draft.id || "",
      data: draft.data || "",
      hora: draft.hora!,
      duracao: Number(draft.duracao),
      pet: draft.pet!,
      servico: draft.servico!,
      tutor: draft.tutor || "",
      responsavel: draft.responsavel || "",
      status: draft.status || "Programado",
      observacoes: draft.observacoes || "",
    });
  }

  if (!action || !internalMode) return null;

  const isView = internalMode === "view";
  const isNew = internalMode === "new";

  return (
    <Sheet open={!!action} onOpenChange={handleCloseAction}>
      <SheetContent className="w-full max-w-[560px]! flex flex-col overflow-hidden sm:max-w-[560px]! border-l p-0">

        {/* CABEÇALHO */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b shrink-0">
          <SheetTitle className="text-lg font-semibold tracking-tight leading-tight text-foreground">
            {isView ? draft.pet : isNew ? "Novo Agendamento" : `Editando — ${draft.pet}`}
          </SheetTitle>
          {isView && (
            <p className="text-sm text-muted-foreground mt-0.5">Detalhes do agendamento</p>
          )}
        </SheetHeader>

        {/* CONTEÚDO SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-7">

          {/* —— SEÇÃO: HORÁRIO —— */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Horário</p>
            <div className="grid grid-cols-3 gap-3">

              {/* Início */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Início {!isView && <span className="text-destructive ml-0.5">*</span>}
                </label>
                {isView ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {draft.hora}
                  </div>
                ) : (
                  <TimePicker
                    value={draft.hora}
                    onChange={(v) => handleChange("hora", v)}
                  />
                )}
              </div>

              {/* Duração */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Duração {!isView && <span className="text-destructive ml-0.5">*</span>}
                </label>
                {isView ? (
                  <span className="text-sm font-medium">{draft.duracao} min</span>
                ) : (
                  <Select
                    value={String(draft.duracao)}
                    onValueChange={(v) => handleChange("duracao", Number(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Duração" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURACOES_MOCK.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Término derivado — sempre read-only */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Término</label>
                {isView ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Hourglass className="h-3.5 w-3.5" />
                    {calcHoraFim(draft.hora || "", draft.duracao || 30)}
                  </div>
                ) : (
                  <Input
                    type="time"
                    value={calcHoraFim(draft.hora || "00:00", draft.duracao || 30)}
                    disabled
                    readOnly
                    className="bg-muted/30 text-muted-foreground font-medium w-full"
                  />
                )}
              </div>

            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* —— SEÇÃO: ATENDIMENTO —— */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Atendimento</p>

            {/* Pet */}
            <div className="flex flex-col gap-1.5">
              <label className={cn("text-xs font-medium text-muted-foreground transition-colors", !!fieldErrors.pet && "text-destructive")}>
                Pet {!isView && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {isView ? (
                <span className="text-base font-semibold text-foreground">{draft.pet}</span>
              ) : (
                <div className="relative">
                  <Popover open={openPetCombo} onOpenChange={setOpenPetCombo}>
                    <PopoverAnchor asChild>
                      <div className="relative group/pet-input">
                        <Input
                          placeholder="Selecione ou digite o nome do pet..."
                          value={draft.pet || ""}
                          onChange={(e) => {
                            handleChange("pet", e.target.value);
                            if (!openPetCombo) setOpenPetCombo(true);
                          }}
                          onClick={() => setOpenPetCombo(true)}
                          autoComplete="off"
                          aria-invalid={!!fieldErrors.pet}
                          className="pr-10"
                        />
                        <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
                      </div>
                    </PopoverAnchor>
                    <PopoverContent
                      className="w-(--radix-popover-trigger-width) p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()} // Evita roubar foco do input
                      onCloseAutoFocus={(e) => e.preventDefault()}
                    >
                      <Command>
                        <CommandList>
                          {/* Filtragem manual já que o input é externo ao Command */}
                          {(() => {
                            const filtered = PETS_MOCK.filter((p) =>
                              p.toLowerCase().includes((draft.pet || "").toLowerCase())
                            );
                            if (filtered.length === 0) {
                              return <CommandEmpty>Nenhum pet encontrado.</CommandEmpty>;
                            }
                            return (
                              <CommandGroup>
                                {filtered.map((p) => (
                                  <CommandItem
                                    key={p}
                                    value={p}
                                    onSelect={(currentValue) => {
                                      const selectedPet = PETS_MOCK.find(
                                        (pet) => pet.toLowerCase() === currentValue.toLowerCase()
                                      ) || currentValue;
                                      handleChange("pet", selectedPet);
                                      setOpenPetCombo(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        draft.pet?.toLowerCase() === p.toLowerCase()
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {p}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            );
                          })()}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              {fieldErrors.pet && !isView && (
                <div className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground animate-in fade-in slide-in-from-top-1 px-1 mt-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.pet}
                </div>
              )}
            </div>

            {/* Serviço */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Serviço {!isView && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {isView ? (
                <div className="flex items-center gap-1.5">
                  <ServicoIcon servico={draft.servico || ""} />
                  <span className="text-sm font-medium">{draft.servico}</span>
                </div>
              ) : (
                <Select value={draft.servico} onValueChange={(v) => handleChange("servico", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICOS_MOCK.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              {isView ? (
                <StatusBadge status={draft.status || ""} />
              ) : (
                <div className="flex flex-col gap-1">
                  <Select
                    value={draft.status}
                    onValueChange={(v) => handleChange("status", v)}
                    disabled={isNew}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_MOCK.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isNew && (
                    <span className="text-[11px] text-muted-foreground">
                      Fixado em Programado na criação.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/50" />

          {/* —— SEÇÃO: PESSOAS —— */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pessoas</p>
            <div className="grid grid-cols-2 gap-4">

              {/* Tutor — input livre (tutores não têm cadastro sistêmico ainda) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Tutor</label>
                {isView ? (
                  <div className="flex items-center gap-1.5">
                    <UserStar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{draft.tutor || "—"}</span>
                  </div>
                ) : (
                  <Input
                    type="text"
                    placeholder="Nome do tutor"
                    value={draft.tutor || ""}
                    onChange={(e) => handleChange("tutor", e.target.value)}
                  />
                )}
              </div>

              {/* Responsável — select de funcionários */}
              <div className="flex flex-col gap-1.5">
                <label className={cn("text-xs font-medium text-muted-foreground transition-colors", !!fieldErrors.responsavel && "text-destructive")}>Responsável</label>
                {isView ? (
                  <div className="flex items-center gap-1.5">
                    <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{draft.responsavel || "—"}</span>
                  </div>
                ) : (
                  <Select
                    value={draft.responsavel || ""}
                    onValueChange={(v) => handleChange("responsavel", v)}
                  >
                    <SelectTrigger 
                      aria-invalid={!!fieldErrors.responsavel}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSAVEIS_MOCK.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {fieldErrors.responsavel && !isView && (
                  <div className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground animate-in fade-in slide-in-from-top-1 px-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.responsavel}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* —— OBSERVAÇÕES —— */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Observações</label>
            {isView ? (
              <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2.5 border border-input/50 min-h-[56px] leading-relaxed">
                {draft.observacoes || "Nenhuma observação registrada."}
              </p>
            ) : (
              <Textarea
                placeholder="Detalhes adicionais..."
                className="min-h-[80px]"
                value={draft.observacoes || ""}
                onChange={(e) => handleChange("observacoes", e.target.value)}
              />
            )}
          </div>

        </div>

        {/* RODAPÉ */}
        <div className="px-6 py-4 border-t shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-end gap-2 w-full">
            {isView ? (
              <Button onClick={handleEditClick} className="gap-2">
                <Edit2 className="h-4 w-4" /> Editar
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancelClick}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveClick} 
                  className={cn("gap-2", (!!fieldErrors.pet || !!fieldErrors.responsavel) && "opacity-50 grayscale cursor-not-allowed")}
                  disabled={!!fieldErrors.pet || !!fieldErrors.responsavel}
                >
                  <Save className="h-4 w-4" /> Salvar
                </Button>
              </>
            )}
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
