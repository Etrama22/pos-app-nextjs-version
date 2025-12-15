import { NextRequest, NextResponse } from "next/server";
import { backupService } from "@/modules/backup";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { BackupType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const query = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      type: searchParams.get("type") as BackupType | undefined,
      sortBy:
        (searchParams.get("sortBy") as "createdAt" | "fileSize") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    const result = await backupService.getBackups(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching backup list:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar backup" },
      { status: 500 }
    );
  }
}
