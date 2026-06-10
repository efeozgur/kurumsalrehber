import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  discoverSchema(filePath: string) {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Dosya bulunamadı');
    }

    const db = new Database(filePath);
    try {
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        .all() as { name: string }[];

      return tables.map((t) => {
        const cols = db.prepare(`PRAGMA table_info("${t.name}")`).all() as {
          name: string;
          type: string;
          notnull: number;
        }[];
        return {
          name: t.name,
          columns: cols.map((c) => ({
            name: c.name,
            type: c.type,
            nullable: c.notnull === 0,
          })),
        };
      });
    } finally {
      db.close();
    }
  }

  async executeImport(filePath: string, config: any) {
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('Dosya bulunamadı');
    }

    const db = new Database(filePath);
    try {
      return await this.importData(db, config);
    } finally {
      db.close();
    }
  }

  private normalizeStr(val: unknown): string | null {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    return s.length > 0 ? s : null;
  }

  private resolveName(row: Record<string, unknown>, mapping: any): { firstName: string; lastName: string } | null {
    // fullName (tek kolon) varsa split et
    if (mapping.fullName) {
      const raw = this.normalizeStr(row[mapping.fullName]);
      if (!raw) return null;
      const splitMode = mapping.splitMode || 'last';
      if (splitMode === 'last') {
        const idx = raw.lastIndexOf(' ');
        if (idx === -1) return { firstName: raw, lastName: '' };
        return { firstName: raw.substring(0, idx).trim(), lastName: raw.substring(idx + 1).trim() };
      } else {
        const idx = raw.indexOf(' ');
        if (idx === -1) return { firstName: raw, lastName: '' };
        return { firstName: raw.substring(0, idx).trim(), lastName: raw.substring(idx + 1).trim() };
      }
    }

    const firstName = mapping.firstName ? this.normalizeStr(row[mapping.firstName]) : null;
    const lastName = mapping.lastName ? this.normalizeStr(row[mapping.lastName]) : null;
    if (!firstName && !lastName) return null;
    return { firstName: firstName || '', lastName: lastName || '' };
  }

  private async importData(db: Database.Database, config: any) {
    const { contactTable, departmentTable, mapping } = config;

    // Pre-load departments from separate table
    const deptNameMap: Record<string, number> = {};
    const deptIdMap: Record<string, number> = {};
    if (departmentTable) {
      const deptRows = db.prepare(`SELECT * FROM "${departmentTable}"`).all() as Record<string, unknown>[];
      for (const row of deptRows) {
        const name = mapping.departmentName ? this.normalizeStr(row[mapping.departmentName]) : null;
        const oldId = mapping.deptTableIdColumn ? this.normalizeStr(row[mapping.deptTableIdColumn]) : null;
        if (!name) continue;
        const dept = await this.prisma.department.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        deptNameMap[name] = dept.id;
        if (oldId != null) deptIdMap[String(oldId)] = dept.id;
      }
    }

    const contactRows = db.prepare(`SELECT * FROM "${contactTable}"`).all() as Record<string, unknown>[];
    let imported = 0;
    let skipped = 0;

    for (const row of contactRows) {
      const name = this.resolveName(row, mapping);
      if (!name) {
        skipped++;
        continue;
      }

      const existing = await this.prisma.contact.findFirst({
        where: { firstName: name.firstName, lastName: name.lastName },
      });
      if (existing) {
        skipped++;
        continue;
      }

      // Resolve department
      let departmentId: number | null = null;
      if (mapping.departmentName && !departmentTable) {
        const deptName = this.normalizeStr(row[mapping.departmentName]);
        if (deptName) {
          if (deptNameMap[deptName]) {
            departmentId = deptNameMap[deptName];
          } else {
            const dept = await this.prisma.department.upsert({
              where: { name: deptName },
              update: {},
              create: { name: deptName },
            });
            deptNameMap[deptName] = dept.id;
            departmentId = dept.id;
          }
        }
      }
      if (!departmentId && departmentTable && mapping.departmentContactId) {
        const oldId = this.normalizeStr(row[mapping.departmentContactId]);
        if (oldId != null && deptIdMap[String(oldId)]) {
          departmentId = deptIdMap[String(oldId)];
        }
      }

      // Resolve title (always directly from contact row)
      let titleId: number | null = null;
      if (mapping.titleName) {
        const tName = this.normalizeStr(row[mapping.titleName]);
        if (tName) {
          const title = await this.prisma.title.upsert({
            where: { name: tName },
            update: {},
            create: { name: tName },
          });
          titleId = title.id;
        }
      }

      await this.prisma.contact.create({
        data: {
          firstName: name.firstName,
          lastName: name.lastName,
          sicilNo: mapping.sicilNo ? this.normalizeStr(row[mapping.sicilNo]) : null,
          phoneInternal: mapping.phoneInternal ? this.normalizeStr(row[mapping.phoneInternal]) : null,
          phoneMobile: mapping.phoneMobile ? this.normalizeStr(row[mapping.phoneMobile]) : null,
          email: mapping.email ? this.normalizeStr(row[mapping.email]) : null,
          departmentId,
          titleId,
        },
      });
      imported++;
    }

    return { total: contactRows.length, imported, skipped };
  }

  async clearAll() {
    await this.prisma.searchLog.deleteMany();
    await this.prisma.mealPlan.deleteMany();
    await this.prisma.foodItem.deleteMany();
    await this.prisma.userModulePermission.deleteMany();
    await this.prisma.bankAccount.deleteMany();
    await this.prisma.goldAccount.deleteMany();
    await this.prisma.ward.deleteMany();
    await this.prisma.contact.deleteMany();
    await this.prisma.title.deleteMany();
    await this.prisma.department.deleteMany();
    await this.prisma.tip.deleteMany();
    return { message: 'Tüm kayıtlar silindi.' };
  }

  saveTempFile(buffer: Buffer, ext: string): string {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-'));
    const filePath = path.join(tmpDir, `upload${ext}`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  cleanupTempFile(filePath: string) {
    try {
      const dir = path.dirname(filePath);
      fs.unlinkSync(filePath);
      fs.rmdirSync(dir);
    } catch {}
  }
}
