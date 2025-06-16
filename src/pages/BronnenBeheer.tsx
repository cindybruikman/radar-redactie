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
  Globe,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Source {
  id: string;
  name: string;
  type: "website" | "forum" | "social" | "official" | "rss";
  url: string;
  status: "active" | "inactive" | "error";
  lastScanned?: string;
  signalsFound: number;
  priority: "high" | "medium" | "low";
}

const BronnenBeheer = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const fetchSources = async () => {
      const { data, error } = await supabase.from("sources").select("*");
      if (!error && data) setSources(data);
    };
    fetchSources();
  }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (!error) setSources((prev) => prev.filter((s) => s.id !== id));
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
          signalsFound: 0,
        },
      ])
      .select();
    if (!error && data) {
      setSources((prev) => [...prev, ...data]);
      setNewName("");
      setNewUrl("");
      setNewSourceDialogOpen(false);
    }
  };

  const handleScan = async (source: Source) => {
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: source.url,
          source_id: source.id,
        }),
      });
      const result = await res.json();
      console.log("Scrape result:", result);
    } catch (err) {
      console.error("Scrape error:", err);
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

  return (
    <Layout title="Bronnen Beheer" subtitle="Beheer en scan je nieuwsbronnen">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Nieuwsbronnen</CardTitle>
            <Dialog
              open={newSourceDialogOpen}
              onOpenChange={setNewSourceDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nieuwe Bron
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nieuwe Bron</DialogTitle>
                  <DialogDescription>
                    Voeg een nieuwe bron toe.
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
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Naam</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Signalen</TableHead>
                  <TableHead>Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="flex items-center gap-2">
                      {getStatusIcon(source.status)}
                      <Badge variant="secondary">{source.status}</Badge>
                    </TableCell>
                    <TableCell>{source.name}</TableCell>
                    <TableCell>{source.type}</TableCell>
                    <TableCell>
                      <Badge>{source.signalsFound ?? 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleScan(source)}
                        >
                          Scan
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
