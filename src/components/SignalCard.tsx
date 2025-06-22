import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Tag } from "lucide-react";
import { Signal } from "@/components/Dashboard";
import { supabase } from "@/lib/supabaseClient";

interface SignalCardProps {
  signal: Signal;
  onAction: (
    signalId: string,
    action: "follow-up" | "covered" | "ignored"
  ) => void;
  refresh: () => void;
}

const priorityStyles = {
  high: {
    border: "border-l-4 border-red-500",
    badge: "bg-red-100 text-red-800",
    label: "⚠️ Hoog",
  },
  medium: {
    border: "border-l-4 border-yellow-400",
    badge: "bg-yellow-100 text-yellow-800",
    label: "⚡ Midden",
  },
  low: {
    border: "border-l-4 border-blue-400",
    badge: "bg-blue-100 text-blue-800",
    label: "🕓 Laag",
  },
};

export const SignalCard = ({ signal, onAction, refresh }: SignalCardProps) => {
  const style = priorityStyles[signal.priority] ?? priorityStyles["low"];

  const handleSaveAsLead = async (signal: Signal) => {
    const newLead = {
      title: signal.title ?? "Zonder titel",
      description: signal.content ?? "",
      savedBy: "journalist",
      savedDate: new Date().toISOString(),
      category: signal.topic ?? "Onbekend",
      priority: signal.priority ?? "medium",
      status: "research",
      sourceType: "signal",
      neighborhood: signal.neighborhood ?? "Onbekend",
      notes: "",
      tags: [],
    };

    const { error: leadError } = await supabase.from("leads").insert([newLead]);

    if (leadError) {
      console.error("Fout bij opslaan als lead:", leadError);
      return;
    }

    const { error: updateError } = await supabase
      .from("signals")
      .update({ status: "follow-up", is_saved: true })
      .eq("id", signal.id);

    if (updateError) {
      console.error("Fout bij updaten van signal-status:", updateError);
    } else {
      onAction(signal.id, "follow-up");
    }
  };

  return (
    <Card
      className={`${style.border} bg-white hover:shadow-md transition-shadow rounded-lg`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {signal.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {signal.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {signal.neighborhood}
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {signal.topic}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end ml-4">
            <Badge className={style.badge}>{style.label}</Badge>
            <Badge className="bg-gray-100 text-gray-800">
              {signal.status === "new"
                ? "nieuw"
                : signal.status === "follow-up"
                ? "opgeslagen"
                : signal.status === "covered"
                ? "gedekt"
                : "genegeerd"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {signal.content}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {signal.source}
          </span>

          {signal.status === "new" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(signal.id, "ignored")}
                className="text-xs"
              >
                Negeren
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAction(signal.id, "covered")}
                className="text-xs"
              >
                Al gedekt
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveAsLead(signal)}
                className="text-xs"
              >
                Opslaan
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
