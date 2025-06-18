import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { scrapeWebsite } from "@/lib/scraper";

interface Source {
  id: string;
  name: string;
  type: "website" | "forum" | "social" | "official" | "rss";
  url: string;
  status: "active" | "inactive" | "error";
  lastScanned: string;
  signalsFound: number;
  priority: "high" | "medium" | "low";
}

const BronnenBeheer = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editSource, setEditSource] = useState<Source | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      const { data, error } = await supabase.from("sources").select("*");
      if (error) console.error(error);
      else setSources(data);
    };

    fetchSources();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (!error) {
      setSources((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleUpdate = async () => {
    if (!editSource) return;
    const { id, ...updateData } = editSource;
    const { data, error } = await supabase
      .from("sources")
      .update(updateData)
      .eq("id", id)
      .select();

    if (!error && data) {
      setSources((prev) => prev.map((s) => (s.id === id ? data[0] : s)));
      setEditSource(null);
    }
  };

  const handlePriorityChange = async (sourceId: string, newPriority: Source["priority"]) => {
    const { error } = await supabase
      .from("sources")
      .update({ priority: newPriority })
      .eq("id", sourceId);

    if (!error) {
      setSources((prev) => 
        prev.map((s) => s.id === sourceId ? { ...s, priority: newPriority } : s)
      );
    }
  };

  const handleAdd = async () => {
    if (!newName || !newUrl) return;
    const { data, error } = await supabase
      .from("sources")
      .insert([
        {
          name: newName,
          url: newUrl,
          type: "website",
          status: "active",
          priority: "medium",
        },
      ])
      .select();

    if (!error && data) {
      setSources((prev) => [...prev, ...(data ?? [])]);
      setNewName("");
      setNewUrl("");
      setNewSourceDialogOpen(false);
    }
  };

  const getStatusIcon = (status: Source["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getStatusBadge = (status: Source["status"]) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      error: "bg-red-100 text-red-800",
    };

    return <Badge className={variants[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: Source["priority"]) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };

    return <Badge className={variants[priority]}>{priority}</Badge>;
  };

  const getPriorityDropdown = (source: Source) => {
    const priorityOptions = [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" }
    ] as const;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
            {getPriorityBadge(source.priority)}
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {priorityOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handlePriorityChange(source.id, option.value)}
              className="cursor-pointer"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const getTypeLabel = (type: Source["type"]) => {
    const labels = {
      website: "Website",
      forum: "Forum",
      social: "Sociaal",
      official: "Officieel",
      rss: "RSS Feed",
    };
    return labels[type];
  };

  return (
    <Layout
      title="Bronnen Beheer"
      subtitle="Beheer en configureer nieuwsbronnen voor RadarRedactie"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Nieuwsbronnen</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-end mb-4">
              <Dialog
                open={newSourceDialogOpen}
                onOpenChange={setNewSourceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Nieuwe Bron
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Nieuwe Bron Toevoegen</DialogTitle>
                    <DialogDescription>
                      Voeg een nieuwe nieuwsbron toe.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Naam</Label>
                      <Input
                        className="col-span-3"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">URL</Label>
                      <Input
                        className="col-span-3"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAdd}>Toevoegen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Naam</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prioriteit</TableHead>
                  <TableHead>Laatste Scan</TableHead>
                  <TableHead>Signalen</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(source.status)}
                        {getStatusBadge(source.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-sm text-gray-500">{source.url}</div>
                    </TableCell>
                    <TableCell>{getTypeLabel(source.type)}</TableCell>
                    <TableCell>{getPriorityDropdown(source)}</TableCell>
                    <TableCell>{source.lastScanned}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{source.signalsFound}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={source.status === "active"} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const res = await fetch("/api/scrape", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                url: source.url,
                                source_id: source.id,
                              }),
                            });

                            const data = await res.json();
                            console.log("Scrape result:", data);

                            // Opslaan in Supabase, indien succesvol
                            if (
                              data.success &&
                              data.headlines &&
                              data.paragraphs
                            ) {
                              await supabase.from("signals").insert([
                                {
                                  source_id: source.id,
                                  title:
                                    data.headlines[0]?.trim() ??
                                    "Geen titel gevonden",
                                  content: data.paragraphs
                                    .join(" ")
                                    .slice(0, 500),
                                  url: source.url,
                                },
                              ]);
                            }
                          }}
                        >
                          Scan
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditSource(source)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(source.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BronnenBeheer;