import { createElement, type ReactElement } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  ImageIcon,
  LayoutDashboard,
  ListFilter,
  ListTodo,
  LoaderCircle,
  LogOut,
  MessageSquare,
  PackageCheck,
  Pencil,
  PencilLine,
  Plus,
  PlusCircle,
  Shapes,
  Store,
  Tag,
  UtensilsCrossed,
  X,
  XCircle,
} from "lucide-react";

export const ICON_CLASS_NAME = "h-4 w-4 shrink-0";

export {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageIcon,
  LayoutDashboard,
  ListFilter,
  ListTodo,
  LogOut,
  MessageSquare,
  Pencil,
  Plus,
  Shapes,
  Store,
  Tag,
  UtensilsCrossed,
  X,
};

export function getSuggestionStatusIcon(status: string): LucideIcon {
  const normalized = status.toUpperCase();
  if (normalized === "PENDING") {
    return Clock3;
  }
  if (normalized === "APPROVED") {
    return CheckCircle2;
  }
  if (normalized === "REJECTED") {
    return XCircle;
  }
  if (normalized === "PREPARING") {
    return PackageCheck;
  }
  if (normalized === "PROCESSING") {
    return LoaderCircle;
  }
  if (normalized === "FINISHED") {
    return BadgeCheck;
  }
  return CircleHelp;
}

export function getSuggestionTypeIcon(type: string): LucideIcon {
  const normalized = type.toUpperCase();
  if (normalized === "ADD_FOOD") {
    return PlusCircle;
  }
  if (normalized === "UPDATE_FOOD") {
    return PencilLine;
  }
  if (normalized === "OTHER") {
    return CircleHelp;
  }
  return CircleHelp;
}

export function renderSuggestionStatusIcon(
  status: string,
  className: string = ICON_CLASS_NAME,
): ReactElement {
  const Icon = getSuggestionStatusIcon(status);
  return createElement(Icon, { className, "aria-hidden": "true" });
}

export function renderSuggestionTypeIcon(
  type: string,
  className: string = ICON_CLASS_NAME,
): ReactElement {
  const Icon = getSuggestionTypeIcon(type);
  return createElement(Icon, { className, "aria-hidden": "true" });
}
