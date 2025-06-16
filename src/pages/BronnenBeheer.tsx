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
import { Globe, Plus, Settings, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

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

  useEffect(() => {
    const fetchSources = async () => {
      const { data, error } = await supabase.from("sources").select("*");
      if (error) console.error(error);
      else setSources(data);
    };

    fetchSources();
  }, []);

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

    return (
      <Badge className={variants[status]}>
        {status === "active"
          ? "Actief"
          : status === "inactive"
          ? "Inactief"
          : "Fout"}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Source["priority"]) => {
    const variants = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={variants[priority]}>
        {priority === "high"
          ? "Hoog"
          : priority === "medium"
          ? "Gemiddeld"
          : "Laag"}
      </Badge>
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
        <div className="flex justify-end">
          <Dialog
            open={newSourceDialogOpen}
            onOpenChange={setNewSourceDialogOpen}
          >
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
                  <Label htmlFor="name" className="text-right">
                    Naam
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    className="col-span-3"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
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

                    if (error) {
                      console.error("Fout bij toevoegen:", error);
                    } else {
                      setSources((prev) => [...prev, ...(data ?? [])]);
                      setNewName("");
                      setNewUrl("");
                      setNewSourceDialogOpen(false);
                    }
                  }}
                >
                  Toevoegen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Totaal Bronnen
              </CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sources.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Actieve Bronnen
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sources.filter((s) => s.status === "active").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Signalen Vandaag
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sources.reduce((sum, source) => sum + (Number(source.signalsFound) || 0), 0)}
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
                {sources.filter((s) => s.status === "error").length}
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
                        <div className="text-sm text-gray-500">
                          {source.url}
                        </div>
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
                        <Switch defaultChecked={source.status === "active"} />
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
