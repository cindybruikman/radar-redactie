import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Layout title="Bronnen Beheer" subtitle="Beheer en configureer nieuwsbronnen voor RadarRedactie">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dialog Header */}
        <div className="flex justify-end">
          <Dialog open={newSourceDialogOpen} onOpenChange={setNewSourceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nieuwe Bron
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nieuwe Bron Toevoegen</DialogTitle>
                <DialogDescription>
                  Voeg een nieuwe nieuwsbron toe aan het systeem.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Naam</Label>
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">URL</Label>
                  <Input id="url" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Toevoegen</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Bronnen</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sources.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Bronnen</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sources.filter(s => s.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Signalen Vandaag</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sources.reduce((sum, source) => sum + source.signalsFound, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fouten</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {sources.filter(s => s.status === 'error').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sources Table */}
        <Card>
          <CardHeader>
            <CardTitle>Nieuwsbronnen</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-sm text-gray-500">{source.url}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeLabel(source.type)}</TableCell>
                    <TableCell>{getPriorityBadge(source.priority)}</TableCell>
                    <TableCell>{source.lastScanned}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{source.signalsFound}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked={source.status === 'active'} />
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
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
