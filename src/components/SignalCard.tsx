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

export const SignalCard = ({ signal, onAction }: SignalCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "follow-up":
        return "bg-orange-100 text-orange-800";
      case "covered":
        return "bg-green-100 text-green-800";
      case "ignored":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      .update({ status: "follow-up", is_saved: true }) // ✅ voeg is_saved toe
      .eq("id", signal.id);

    if (updateError) {
      console.error("Fout bij updaten van signal-status:", updateError);
    } else {
      console.log("Signaalstatus geüpdatet naar 'follow-up'");
      onAction(signal.id, "follow-up"); // ✅ Update status in React state
      // Je mag `refresh()` daarna ook nog oproepen als je verse data uit db wil
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 leading-tight mb-2">
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
          <div className="flex gap-2 ml-4">
            <Badge className={getPriorityColor(signal.priority)}>
              {signal.priority}
            </Badge>
            <Badge className={getStatusColor(signal.status)}>
              {signal.status === "new"
                ? "nieuw"
                : signal.status === "follow-up"
                ? "opvolgen"
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
                onClick={() => {
                  handleSaveAsLead(signal);
                }}
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
