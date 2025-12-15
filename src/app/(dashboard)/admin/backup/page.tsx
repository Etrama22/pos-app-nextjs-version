"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { formatDateTime } from "@/lib/utils";
import { Database, Download, RefreshCw, Clock } from "lucide-react";
import type { BackupType } from "@prisma/client";

interface Backup {
  id: string;
  fileName: string;
  fileSize: number | null;
  type: BackupType;
  createdAt: string;
}

export default function BackupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  const [backups, setBackups] = React.useState<Backup[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/pos");
    }
  }, [status, session, router]);

  React.useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const res = await fetch("/api/backup/list?limit=20");
      if (res.ok) {
        const data = await res.json();
        setBackups(data.data);
      }
    } catch (error) {
      console.error("Error fetching backups:", error);
    }
  };

  const createManualBackup = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/backup/manual", {
        method: "POST",
      });

      if (res.ok) {
        showToast("success", "Backup berhasil dibuat");
        fetchBackups();
      } else {
        const error = await res.json();
        showToast("error", error.error || "Backup gagal");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan");
    } finally {
      setIsCreating(false);
    }
  };

  const downloadBackup = async (id: string, fileName: string) => {
    try {
      const res = await fetch(`/api/backup/download?id=${id}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast("success", "Backup berhasil diunduh");
      } else {
        showToast("error", "Gagal mengunduh backup");
      }
    } catch (error) {
      showToast("error", "Terjadi kesalahan");
    }
  };

  const backupTypeLabels: Record<BackupType, string> = {
    DAILY: "Harian",
    WEEKLY: "Mingguan",
    MONTHLY: "Bulanan",
    MANUAL: "Manual",
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Backup & Restore
          </h1>
          <p className="text-secondary-600">Kelola backup database</p>
        </div>
        <Button onClick={createManualBackup} isLoading={isCreating}>
          <Database className="w-4 h-4 mr-2" />
          Backup Sekarang
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Total Backup</p>
                <p className="text-xl font-bold">{backups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Auto Backup</p>
                <p className="text-xl font-bold">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-secondary-600">Backup Terakhir</p>
                <p className="text-sm font-medium">
                  {backups[0] ? formatDateTime(backups[0].createdAt) : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Backup</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-mono text-sm">
                    {backup.fileName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="info">
                      {backupTypeLabels[backup.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatFileSize(backup.fileSize)}</TableCell>
                  <TableCell>{formatDateTime(backup.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => downloadBackup(backup.id, backup.fileName)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {backups.length === 0 && (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
              <p className="text-secondary-500">Belum ada backup</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
