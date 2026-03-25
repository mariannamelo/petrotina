"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
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
        // Estilização do Scrollbar para os tokens Shadcn
        "[&::-webkit-scrollbar]:w-1.5",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      )}
    >
      <div dir="ltr" className="px-1 py-2 flex flex-col gap-0.5 w-full">
        {items.map((item) => (
          <Button
            key={item}
            variant={item === selected ? "default" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-center h-8 font-normal rounded-sm shrink-0 transition-colors",
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

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

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
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent h-8 px-3 text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            !value && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {value || "00:00"}
          <Clock className="pointer-events-none size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) pt-0 pb-2 px-0 overflow-hidden"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex divide-x bg-background">
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
