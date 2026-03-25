"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string; // Adicionado suporte mínimo a className
}

function ScrollColumn({
  items,
  selected,
  onSelect,
  isLeft = false,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  isLeft?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleWheel = React.useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
    }
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = items.indexOf(selected);
    if (idx >= 0) {
      el.scrollTop = idx * 34; // 34px approximate height of each item
    }
  }, [selected, items]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      dir={isLeft ? "rtl" : "ltr"}
      className={cn(
        "w-1/2 overflow-y-auto h-[224px] flex flex-col",
        // Scrollbar simples e consistente com tokens do projeto
        "scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      )}
    >
      <div dir="ltr" className="px-1 py-2 flex flex-col gap-0.5 w-full">
        {items.map((item) => (
          <Button
            key={item}
            variant={item === selected ? "default" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-center h-8 font-normal rounded-md shrink-0 transition-colors", // Atualizado para rounded-md
              item !== selected && "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => onSelect(item)}
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function TimePicker({ value, onChange, disabled, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");

  // Sincroniza o input quando o valor externo muda (ex: via scroll columns)
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Permite digitar apenas números e :
    val = val.replace(/[^\d:]/g, "");
    
    // Auto-insere o : se o user digitar 2 números
    if (val.length === 2 && !val.includes(":") && !inputValue.includes(":")) {
      val = val + ":";
    }
    
    setInputValue(val.slice(0, 5));

    // Se o formato estiver completo e válido, dispara o onChange
    if (/^[0-2][0-9]:[0-5][0-9]$/.test(val)) {
      onChange?.(val);
    }
  };

  const handleInputBlur = () => {
    // Se sair do campo com valor incompleto, tenta formatar ou volta pro anterior
    if (!/^[0-2][0-9]:[0-5][0-9]$/.test(inputValue)) {
      setInputValue(value || "00:00");
    }
  };

  const [hour, minute] = React.useMemo(
    () => (value?.split(":") ?? ["00", "00"]) as [string, string],
    [value]
  );

  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")),
    []
  );
  const minutes = React.useMemo(
    () => Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")),
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative group/time-input cursor-text", className)}>
          <Input
            type="text"
            placeholder="00:00"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={disabled}
            className={cn(
              "h-8 pr-10 cursor-text",
              !value && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            autoComplete="off"
          />
          <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none group-hover/time-input:text-foreground transition-colors" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-32 p-0 overflow-hidden"
        align="start"
        // Permite focar no input enquanto o popover está aberto
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex divide-x bg-background border rounded-md">
          <ScrollColumn
            items={hours}
            selected={hour}
            onSelect={(h) => onChange?.(`${h}:${minute}`)}
            isLeft
          />
          <ScrollColumn
            items={minutes}
            selected={minute}
            onSelect={(m) => {
              onChange?.(`${hour}:${m}`);
              setOpen(false);
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
