import {
  Calendar,
  Settings,
  LayoutDashboard,
  Scissors,
  Dog,
  PawPrint,
  Users,
  MessageSquare,
  Inbox,
} from "lucide-react";

export const NAV_LINKS = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
  },
  {
    title: "Banho e Tosa",
    href: "/banho-e-tosa",
    icon: Scissors,
  },
  {
    title: "Creche",
    href: "/creche",
    icon: Dog,
  },
  {
    title: "Pets",
    href: "/pets",
    icon: PawPrint,
  },
  {
    title: "Tutores",
    href: "/tutores",
    icon: Users,
  },
  {
    title: "Mensagens",
    href: "/mensagens",
    icon: MessageSquare,
  },
  {
    title: "Solicitações",
    href: "/solicitacoes",
    icon: Inbox,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];
