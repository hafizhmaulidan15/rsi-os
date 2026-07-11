# RSI OS — Sistem Operasional Rumah Susu Indonesia

Sistem manajemen operasional terpadu untuk produsen susu pasteurisasi. Mengelola seluruh siklus bisnis dari penerimaan susu mentah, quality control otomatis, produksi (mozzarella & susu cup), manajemen inventory, tracking shelf life, hingga analytics & reporting — semuanya dalam satu platform.

> **Tagline:** *Dari Kandang ke Konsumen, Satu Platform*

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Fitur Utama](#fitur-utama)
- [Alur Bisnis](#alur-bisnis)
- [Arsitektur](#arsitektur)
- [Database Schema](#database-schema)
- [Service Layer](#service-layer)
- [Enum & Status](#enum--status)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Deployment](#deployment)
- [Default Data](#default-data)
- [Configuration](#configuration)
- [Form Validation](#form-validation)
- [Export (CSV & PDF)](#export-csv--pdf)
- [Audit Logging](#audit-logging)
- [Notification System](#notification-system)
- [Dependencies](#dependencies)
- [License](#license)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Laravel | 12.x (PHP 8.2+) |
| Frontend | React + TypeScript | 18.x |
| SPA Bridge | Inertia.js | v2 |
| UI Framework | Tailwind CSS (dark theme) | 3.x |
| Icons | Lucide React | 1.21 |
| Charts | Recharts | 3.8 |
| Form Management | react-hook-form | 7.x |
| Schema Validation | Zod | 4.x |
| Data Table | TanStack React Table | 8.x |
| Animations | Motion (Framer Motion) | 12.x |
| Toast | Sonner | 2.x |
| UI Components | Radix UI (Dialog, Dropdown, Select, Tabs, Toast, Label) | - |
| Database | SQLite (default) / PostgreSQL (Neon serverless) | - |
| PDF Generation | DomPDF (barryvdh/laravel-dompdf) | - |
| Excel Import/Export | Maatwebsite Excel | - |
| API Auth | Laravel Sanctum | 4.x |
| Auth Scaffolding | Laravel Breeze | 2.x |
| Build Tool | Vite | 7.x |
| PWA | vite-plugin-pwa | 1.x |
| Deployment | Railway (Nixpacks builder) | - |

---

## Fitur Utama

### 1. Dashboard

Halaman utama dengan KPI cards dan monitoring real-time:

**5 KPI Cards:**
| Card | Icon | Warna | Deskripsi |
|------|------|-------|-----------|
| Batch Aktif | Factory | Biru | Jumlah batch yang sedang diproduksi atau di chiller |
| Produksi Hari Ini | Milk | Hijau | Jumlah batch produksi yang dimulai hari ini |
| QC Hari Ini | FlaskConical | Amber | Jumlah tes QC yang dilakukan hari ini |
| Shelf Life Alerts | Clock | Merah | Batch yang sudah expired atau <= 3 hari lagi |
| Stok Rendah/Habis | TrendingDown | Merah | Item inventory yang stoknya di bawah minimum |

**Sections:**
- **Latest QC** — Tabel 5 QC terakhir: nama supplier, tipe QC, TS, Fat, badge LULUS/DITOLAK
- **Inventory Summary** — Setiap item: nama, stok, health bar (lebar berdasarkan rasio stok/min stock), health badge
- **Shelf Life Alerts** — Batch expired (merah, badge "Expired") & batch <= 3 hari (amber, badge "{N} hari lagi")
- **Mozzarella Chiller** — Batch mozzarella yang sedang di chiller: nomor batch, supplier, status

**Banner:** Peringatan server sleep — "Server akan sleep setelah 15 menit tidak ada aktivitas. Saat diakses lagi, perlu 30 detik - 1 menit cold start."

---

### 2. Penerimaan Susu (Milk Intake)

Manajemen penerimaan susu mentah dari supplier.

**Fitur:**
- Form penerimaan: pilih supplier, tanggal/waktu terima, volume (liter), target produksi (mozzarella/susu cup), catatan
- Auto-generate nomor batch: `RM-YYYYMMDD-NNN` (contoh: `RM-20260712-001`)
- Status tracking: `pending_qc` → `approved`/`rejected` → `consumed`
- Tabel paginated dengan pencarian
- Detail view: info batch, riwayat QC, status
- Edit & hapus batch

**Field Form:**
| Field | Tipe | Validasi |
|-------|------|----------|
| `supplier_id` | Select | required, harus exist di tabel suppliers |
| `received_date` | Date picker | required |
| `received_time` | Time picker | required, format H:i |
| `volume_liter` | Number | required, numeric, min 0.01 |
| `production_target` | Radio (mozzarella/susu_cup) | required |
| `notes` | Textarea | nullable |

---

### 3. Quality Control (QC)

Sistem QC otomatis dengan engine evaluasi threshold.

**3 Tipe QC:**
| Tipe | Kode | Kapan Digunakan |
|------|------|-----------------|
| Raw | `raw` | QC susu mentah setelah diterima |
| Pasteurisasi | `pasteurized` | QC susu cup setelah pasteurisasi |
| Mozzarella | `mozzarella` | QC produk mozzarella |

**Parameter QC (14+ field):**
| Parameter | Tipe | Validasi | Deskripsi |
|-----------|------|----------|-----------|
| Fat | Number | 0-100 | Kandungan lemak (%) |
| SNF | Number | 0-100 | Solid Not Fat (%) |
| Density | Number | min 0 | Densitas |
| Protein | Number | 0-100 | Kandungan protein (%) |
| Lactose | Number | 0-100 | Kandungan laktosa (%) |
| Salts | Number | 0-100 | Kandungan garam (%) |
| Total Solids | Number | 0-100 | Total solids (%) |
| Added Water | Number | 0-100 | Air tambahan (%) |
| Freezing Point | Number | - | Titik beku |
| Temperature | Number | - | Suhu pengukuran |
| pH | Number | 0-14 | Derajat keasaman |
| Peroxide | Text | max 20 char | Positif/Negatif |
| Antibiotic | Text | max 20 char | Positif/Negatif |
| Aroma | Select | - | normal/abnormal |
| Taste | Select | - | normal/abnormal |
| Texture | Select | - | normal/abnormal |

**QCEngine — Algoritma Evaluasi Otomatis:**

```
STEP 1: Antibiotic Check (HARD REJECT)
  Jika antibiotic = 'positive' → LANGSUNG DITOLAK
  Return: { result: 'reject', warnings: ['Antibiotic Positive'] }

STEP 2: Peroxide Check (HARD REJECT)
  Jika peroxide = 'positive' → LANGSUNG DITOLAK
  Return: { result: 'reject', warnings: ['Peroxide Positive'] }

STEP 3: Load Thresholds dari Settings
  ts_min = setting('qc_ts_min')      → default 11.0
  protein_min = setting('qc_protein_min') → default 2.8
  fat_min = setting('qc_fat_min')    → default 3.0
  ph_min = setting('qc_ph_min')      → default 6.4
  ph_max = setting('qc_ph_max')      → default 6.8

STEP 4: Total Solids Check
  Jika total_solids < ts_min → tambah warning 'TS Rendah'

STEP 5: Protein Check
  Jika protein < protein_min → tambah warning 'Protein Rendah'

STEP 6: Fat Check
  Jika fat < fat_min → tambah warning 'Fat Rendah'

STEP 7: pH Check
  Jika ph < ph_min ATAU ph > ph_max → tambah warning 'pH Tidak Ideal'

STEP 8: Sensory Checks
  Jika aroma != 'normal' → tambah warning 'Aroma Tidak Normal'
  Jika taste != 'normal' → tambah warning 'Rasa Tidak Normal'
  Jika texture != 'normal' → tambah warning 'Tekstur Tidak Normal'

STEP 9: Final Verdict
  Jika ADA warning → result = 'reject'
  Jika TIDAK ADA warning → result = 'pass'
```

**Design Decisions:**
- Antibiotic & peroxide = **hard reject** (short-circuit, tidak cek yang lain)
- Parameter lainnya = **akumulatif** (satu saja warning = ditolak)
- Thresholds **bisa dikonfigurasi** dari halaman Settings tanpa ubah kode

---

### 4. Produksi

Manajemen produksi mozzarella dan susu cup dengan multi-step workflow.

**Dua Tipe Produksi:**
| Tipe | Kode | Batch Prefix | Deskripsi |
|------|------|-------------|-----------|
| Mozzarella | `mozzarella` | `MZ-YYYYMMDD-NNN` | Produksi keju mozzarella |
| Susu Cup | `susu_cup` | `SC-YYYYMMDD-NNN` | Produksi susu pasteurisasi dalam cup |

**Status Workflow:**
```
production → chiller → ready → closed
   ↓           ↓         ↓        ↓
 Sedang      Masuk     Siap     Batch
 diproduksi  chiller   dijual   selesai
```

**Multi-Step Workflow:**

**Step 1 — Buat Batch Produksi:**
- Pilih milk batch yang sudah approved
- Pilih tipe produksi (mozzarella/susu cup)
- Input waktu mulai
- Otomatis: milk batch status berubah ke `consumed`, batch nomor auto-generated

**Step 2 — Production Steps (detail proses):**

Untuk Mozzarella:
| Field | Deskripsi |
|-------|-----------|
| Rennet (ml) | Jumlah rennet yang digunakan |
| Nitric Acid (ml) | Jumlah asam nitrat |
| Target Temperature (°C) | Suhu target pemanasan |
| Actual Temperature (°C) | Suhu aktual yang tercapai |
| Holding Time (menit) | Waktu tahan di suhu tertentu |
| Cooling Time (menit) | Waktu pendinginan |
| Notes | Catatan proses |

Untuk Susu Cup:
- Parameter pasteurisasi (suhu & waktu)

**Step 3 — Yield Recording (khusus Mozzarella):**

YieldEngine — Formula perhitungan:
```
predicted_yield_kg = volume_liters × (total_solids / 100) × yield_factor

Contoh:
  Volume: 1000L
  Total Solids: 11.5%
  Yield Factor: 0.85
  Predicted = 1000 × 0.115 × 0.85 = 97.75 kg

Variance:
  variance_percent = ((actual - predicted) / predicted) × 100
  Positive = over-performed (lebih dari prediksi)
  Negative = under-performed (kurang dari prediksi)
```

**Step 4 — Shelf Life:**

ShelfLifeService — Perhitungan:
```
shelf_life_days = setting('shelf_life_default_days') → default 14 hari
expiry_date = chiller_in_date + shelf_life_days
remaining_days = MAX(0, diff_in_days(now, expiry_date))
```
- Saat shelf life dicatat, status batch otomatis berubah dari `production` ke `chiller`

**Step 5 — QC Produk (inline dari halaman produksi):**
- Input QC post-pasteurisasi langsung dari detail batch produksi
- Parameter: pH, suhu, aroma, rasa, tekstur, peroxide

---

### 5. Inventory

Sistem manajemen stok produk jadi, bahan baku, dan kemasan.

**4 Tab View:**
| Tab | Deskripsi |
|-----|-----------|
| Semua Stok | Semua item aktif dengan stok & health bar |
| Produk Jadi | Filter hanya mozzarella & susu cup |
| Packaging & Items | Filter hanya packaging materials |
| Transaksi | Riwayat semua transaksi |

**11 Item Default:**

*Produk Jadi (3):*
| Code | Nama | Unit | Min Stok |
|------|------|------|----------|
| MOZZA-001 | Mozzarella Fresh | kg | 5 |
| CUP130-001 | Susu Cup 130ml | pcs | 50 |
| CUP175-001 | Susu Cup 175ml | pcs | 50 |

*Packaging (8):*
| Code | Nama | Unit | Min Stok |
|------|------|------|----------|
| PKG-CUP130 | Cup 130ml (kosong) | pcs | 10.000 |
| PKG-CUP175 | Cup 175ml (kosong) | pcs | 5.000 |
| PLG-2L | Plastik Logo 2 Line | pcs | 5 |
| PLG-4L | Plastik Logo 4 Line | pcs | 5 |
| PLG-RL | Plastik Roll Logo | pcs | 10 |
| PLG-RP | Plastik Roll Polos | pcs | 2 |
| BOX-01 | Box Tasik | pcs | 10 |
| TRAY-01 | Tray Tasik | pcs | 10 |

**3 Tipe Transaksi:**
| Tipe | Kode | Deskripsi |
|------|------|-----------|
| Masuk | `in` | Stok bertambah (quantity positif) |
| Keluar | `out` | Stok berkurang (quantity disimpan negatif) |
| Adjustment | `adjustment` | Koreksi manual stok |

**Health Bar — 4 Level:**
| Kondisi | Label | Warna | Algoritma |
|---------|-------|-------|-----------|
| Stok > min × 2 | Aman | Hijau | `ok` |
| min < stok ≤ min × 2 | Cukup | Kuning | `medium` |
| 0 < stok ≤ min | Rendah | Merah | `low` |
| Stok ≤ 0 | Habis | Abu-abu | `out_of_stock` |

**Rumus Health Bar Width:**
```
ratio = min(stock / minimum_stock, 2) / 2  → normalized 0-1, capped di 2x
bar_width = min(ratio × 100, 100)          → persentase untuk CSS width
```

**Transaksi dengan Running Balance:**
Setiap transaksi ditampilkan dengan saldo berjalan (running balance) sehingga bisa dilacak stok berubah dari waktu ke waktu.

**Field Transaksi:**
| Field | Tipe | Validasi |
|-------|------|----------|
| `item_id` | Select | required, harus exist |
| `transaction_type` | Radio (in/out/adjustment) | required |
| `quantity` | Number | required, min 0.01 |
| `production_batch_id` | Select (optional) | nullable, harus exist jika diisi |
| `transaction_date` | Date picker | required |
| `request_by` | Text | max 100 char |
| `no_sj` | Text (No. Surat Jalan) | max 100 char |
| `notes` | Textarea | nullable |

---

### 6. Purchase Order

Session-based PO builder untuk restocking packaging materials.

**Fitur:**
- Add item langsung dari tabel inventory (tombol "+" di setiap baris)
- Input quantity per item
- Kelola item dalam PO (edit quantity, hapus item)
- Save PO (simpan ke database)
- Clear PO (kosongkan session)

---

### 7. Analytics & Charts

Dashboard analytics dengan 5 visualisasi menggunakan Recharts.

**Tab Overview:**
| Chart | Tipe | Data |
|-------|------|------|
| Yield Trend | Line chart | Predicted vs Actual yield per 50 batch terakhir |
| Inventory Stock | Bar chart | Stok saat ini vs minimum stok per item |
| Shelf Life Overview | Summary | Count: expired / expiring soon / healthy |

**Tab QC Trends:**
| Chart | Tipe | Data |
|-------|------|------|
| QC Parameters | Line chart | Total Solids, Fat, Protein, pH dari 100 QC terakhir |
| QC Pass Rate | Badge | Persentase pass/reject |

**Tab Suppliers:**
| Chart | Tipe | Data |
|-------|------|------|
| Supplier Volume | Bar chart | Jumlah batch & rata-rata volume per supplier |

---

### 8. Shelf Life Monitoring

Halaman khusus untuk monitoring masa simpan produk.

**Fitur:**
- Tabel semua batch dengan shelf life, diurutkan berdasarkan `remaining_days` (paling mendesak di atas)
- Info: batch number, tipe produksi, supplier, chiller-in date, expiry date, remaining days
- Badge warna: expired (merah), <= 3 hari (amber), aman (hijau)

---

### 9. Settings

Konfigurasi threshold dan parameter sistem.

**3 Group Settings:**

**QC Thresholds** (Thermometer icon, biru):
| Key | Default | Label | Deskripsi |
|-----|---------|-------|-----------|
| `qc_ts_min` | 11.0 | Min Total Solids (%) | Batas minimum total solids untuk lolos QC |
| `qc_protein_min` | 2.8 | Min Protein (%) | Batas minimum protein untuk lolos QC |
| `qc_fat_min` | 3.0 | Min Fat (%) | Batas minimum lemak untuk lolos QC |
| `qc_ph_min` | 6.4 | Min pH | Batas minimum pH |
| `qc_ph_max` | 6.8 | Max pH | Batas maksimum pH |

**Shelf Life Defaults** (Calendar icon, amber):
| Key | Default | Label |
|-----|---------|-------|
| `shelf_life_default_days` | 14 | Default Shelf Life (days) |

**Yield Calculation** (Calculator icon, hijau):
| Key | Default | Label |
|-----|---------|-------|
| `yield_default_factor` | 0.85 | Yield Factor |

Semua settings bisa diubah dari UI dan langsung berlaku untuk evaluasi QC & yield berikutnya.

---

### 10. Export (CSV & PDF)

**CSV Export:**
| Type | Filename | Kolom |
|------|----------|-------|
| `production` | `production-export.csv` | Batch, Type, Supplier, Status, Start Time |
| `qc` | `qc-export.csv` | Supplier, TS, Fat, Protein, pH, Result, Date |
| `inventory` | `inventory-export.csv` | Item, Type, Quantity, Date, Notes |

Menggunakan chunked query (100 records/chunk) untuk efisiensi memori pada dataset besar.

**PDF Export:**
| Type | Judul | Kolom |
|------|-------|-------|
| `production` | Laporan Produksi | Batch, Tipe, Supplier, Status, Mulai |
| `qc` | Laporan Quality Control | Batch, Tipe, Supplier, pH, TS, Lemak, Protein, Aroma, Rasa, Hasil, Tanggal |

PDF menggunakan DomPDF dengan template Blade yang sudah styled:
- Header: "RSI OS — {title}" dengan subjudul "Rumah Susu Indonesia"
- Meta: tanggal cetak & jumlah data
- Tabel dengan header biru, badge LULUS (hijau) / DITOLAK (merah)
- Footer: "RSI OS v{version} | Dicetak otomatis dari sistem"
- Font: DejaVu Sans (kompatibel PDF)

---

### 11. Auth & User Management

Menggunakan Laravel Breeze dengan React:

**Halaman Auth:**
- Login (`/login`)
- Register (`/register`)
- Forgot Password (`/forgot-password`)
- Reset Password (`/reset-password/{token}`)
- Confirm Password (`/confirm-password`)
- Verify Email (`/verify-email/{id}/{hash}`)

**Profile Management (`/profile`):**
- Edit nama & email
- Ganti password
- Hapus akun (dengan password confirmation)

**Rate Limiting:**
- Login: max 5 attempts, locked out dengan timer
- Throttle key: `lowercase(email)|ip`

---

### 12. Audit Logging

Setiap perubahan data dicatat lengkap.

**16 Tipe Aksi yang Di-audit:**
| Action | Tabel | Trigger |
|--------|-------|---------|
| `milk_batch_created` | `milk_batches` | Membuat batch susu baru |
| `milk_batch_updated` | `milk_batches` | Edit batch susu |
| `milk_batch_deleted` | `milk_batches` | Hapus batch susu |
| `production_batch_created` | `production_batches` | Mulai produksi |
| `production_steps_updated` | `production_steps` | Simpan langkah produksi |
| `yield_updated` | `yield_records` | Simpan data yield |
| `shelf_life_updated` | `shelf_life_records` | Simpan data shelf life |
| `qc_created` | `qc_results` | Simpan hasil QC |
| `inventory_transaction_created` | `inventory_transactions` | Transaksi stok |
| `inventory_item_created` | `inventory_items` | Tambah item inventory |
| `inventory_item_updated` | `inventory_items` | Edit item inventory |
| `inventory_item_deleted` | `inventory_items` | Hapus item inventory |
| `supplier_created` | `suppliers` | Tambah supplier |
| `supplier_updated` | `suppliers` | Edit supplier |
| `supplier_deleted` | `suppliers` | Hapus supplier |
| `settings_updated` | `settings` | Ubah settings |

**Setiap log berisi:**
- `user_id` — siapa yang melakukan
- `action` — apa yang dilakukan
- `table_name` — tabel mana yang terpengaruh
- `record_id` — ID record yang terpengaruh
- `old_data` — JSON data SEBELUM perubahan (untuk update/delete)
- `new_data` — JSON data SESUDAH perubahan (untuk create/update)

---

### 13. Notification System

Notifikasi otomatis untuk perubahan penting.

| Tipe | Kode | Kapan Triggered | Title Format | Message Format |
|------|------|-----------------|--------------|----------------|
| QC Warning | `qc_warning` | QC result = reject | "QC Failed: {batchNumber}" | "Batch ditolak karena {warnings}" |
| Inventory Warning | `inventory_warning` | Stok low atau out_of_stock | "Stock Rendah: {itemName}" | "Stok {itemName} tersisa {currentStock} {unit} (min: {minimumStock})" |

**Severity Levels:**
| Level | Kode | Deskripsi |
|-------|------|-----------|
| Info | `info` | Informasi saja |
| Warning | `warning` | Perlu perhatian |
| Critical | `critical` | Butuh tindakan segera |

---

## Alur Bisnis

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR BISNIS RSI OS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PENERIMAAN SUSU MENTAH                                     │
│     Supplier kirim susu                                         │
│     → Buat Milk Batch (auto: RM-YYYYMMDD-NNN)                  │
│     → Status: pending_qc                                        │
│                                                                 │
│  2. QUALITY CONTROL (RAW)                                       │
│     Input 14+ parameter ke QCEngine                             │
│     → Antibiotic/Peroxide positive = AUTO REJECT                │
│     → Threshold check: TS, Protein, Fat, pH, Sensory            │
│     → Pass: status "approved"                                   │
│     → Reject: status "rejected" + notification                  │
│                                                                 │
│  3. PRODUKSI                                                    │
│     Pilih milk batch approved                                   │
│     → Buat Production Batch (auto: MZ/SC-YYYYMMDD-NNN)         │
│     → Milk batch status: "consumed"                             │
│     → Production status: "production"                           │
│                                                                 │
│  4. PROSES PRODUKSI                                             │
│     Mozzarella: rennet, nitric acid, suhu, holding/cooling      │
│     Susu Cup: pasteurisasi suhu & waktu                         │
│     → Simpan production steps                                   │
│                                                                 │
│  5. YIELD RECORDING (Mozzarella)                                │
│     Input actual yield                                          │
│     → YieldEngine prediksi: volume × TS% × factor               │
│     → Variance % dihitung                                       │
│                                                                 │
│  6. QC PRODUK (Post-Pasteurisasi)                               │
│     pH, suhu, aroma, rasa, tekstur, peroxide check              │
│     → Inline dari halaman produksi                              │
│                                                                 │
│  7. SHELF LIFE                                                  │
│     Input chiller-in date/time                                  │
│     → ShelfLifeService hitung expiry (default 14 hari)          │
│     → Batch status: "chiller"                                   │
│                                                                 │
│  8. INVENTORY                                                   │
│     Produk jadi & packaging tracking via transaksi              │
│     → Stock health monitoring (4 level)                         │
│     → Low stock notifications                                   │
│     → Purchase Order builder untuk restocking                   │
│                                                                 │
│  9. MONITORING & REPORTING                                      │
│     Dashboard KPI, Analytics charts                             │
│     CSV/PDF exports                                             │
│     Audit logs tracking semua perubahan                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Status Lifecycle:**

```
Milk Batch:
  pending_qc ──→ approved ──→ consumed
       │
       └──→ rejected

Production Batch:
  production ──→ chiller ──→ ready ──→ closed
```

---

## Arsitektur

```
rsi-os/
├── app/
│   ├── Enums/                  # 8 PHP enums untuk status & tipe
│   │   ├── BatchStatus.php
│   │   ├── ProductionStatus.php
│   │   └── General.php         # ProductionType, QCType, QCResult, TransactionType,
│   │                           # InventoryCategory, NotificationType, NotificationSeverity
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Web/            # 12 controllers untuk halaman web
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── SupplierController.php
│   │   │   │   ├── MilkBatchController.php
│   │   │   │   ├── ProductionBatchController.php
│   │   │   │   ├── InventoryController.php
│   │   │   │   ├── QcResultController.php
│   │   │   │   ├── AnalyticsController.php
│   │   │   │   ├── ShelfLifeController.php
│   │   │   │   ├── SettingController.php
│   │   │   │   ├── ExportController.php
│   │   │   │   ├── PurchaseOrderController.php
│   │   │   │   └── ProfileController.php
│   │   │   └── Api/            # 10 controllers untuk REST API
│   │   │       ├── DashboardController.php
│   │   │       ├── SupplierController.php
│   │   │       ├── MilkBatchController.php
│   │   │       ├── QcResultController.php
│   │   │       ├── ProductionBatchController.php
│   │   │       ├── InventoryController.php
│   │   │       ├── AnalyticsController.php
│   │   │       ├── SettingController.php
│   │   │       ├── ShelfLifeController.php
│   │   │       └── YieldRecordController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php
│   │   └── Requests/           # 8 Form Request validation classes
│   ├── Models/                 # 13 Eloquent models
│   ├── Services/               # 7 service classes (business logic)
│   │   ├── QCEngine.php
│   │   ├── YieldEngine.php
│   │   ├── ShelfLifeService.php
│   │   ├── InventoryService.php
│   │   ├── NotificationService.php
│   │   ├── AuditService.php
│   │   └── BatchNumberService.php
│   └── Providers/
│       └── NeonDatabaseServiceProvider.php
├── resources/
│   ├── js/
│   │   ├── Layouts/
│   │   │   ├── AuthenticatedLayout.tsx    # Dark sidebar + top bar + mobile nav
│   │   │   └── GuestLayout.tsx
│   │   ├── Pages/              # 26 React/TypeScript pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Suppliers/
│   │   │   ├── MilkIntake/
│   │   │   ├── Production/
│   │   │   ├── QC/
│   │   │   ├── Inventory/
│   │   │   ├── Analytics/
│   │   │   ├── ShelfLife/
│   │   │   ├── Settings/
│   │   │   └── Auth/
│   │   └── Components/         # 18 reusable components
│   │       ├── ui/             # Shadcn-style components
│   │       │   ├── button.tsx
│   │       │   ├── card.tsx
│   │       │   ├── badge.tsx
│   │       │   ├── input.tsx
│   │       │   ├── label.tsx
│   │       │   └── data-table.tsx
│   │       ├── ExportButton.tsx
│   │       ├── Modal.tsx
│   │       └── ...
│   ├── views/
│   │   ├── app.blade.php       # Inertia SPA shell
│   │   └── exports/
│   │       └── report.blade.php # PDF report template
│   └── css/
├── routes/
│   ├── web.php                 # 40+ web routes
│   ├── api.php                 # 16 API endpoints
│   └── auth.php                # Auth routes (Breeze)
├── database/
│   ├── migrations/             # 15 migration files
│   ├── seeders/                # 4 seeders (User, Supplier, InventoryItem, Setting)
│   └── database.sqlite
├── config/
├── public/
├── storage/
├── tests/
├── railway.json                # Railway deployment config
├── nixpacks.toml               # Nixpacks PHP extensions
├── vite.config.js
├── tailwind.config.js
├── composer.json
├── package.json
└── FLOWCHART.md
```

---

## Database Schema

### ER Diagram (Relasi)

```
User
  └── AuditLog (1:N)

Supplier (1) ──→ (N) MilkBatch

MilkBatch (1) ──→ (N) QcResult
MilkBatch (1) ──→ (N) ProductionBatch

ProductionBatch (1) ──→ (N) ProductionStep
ProductionBatch (1) ──→ (1) YieldRecord
ProductionBatch (1) ──→ (1) ShelfLifeRecord
ProductionBatch (1) ──→ (N) QcResult
ProductionBatch (1) ──→ (N) InventoryTransaction

InventoryItem (1) ──→ (N) InventoryTransaction

Setting (standalone)
Notification (standalone, polymorphic)
```

### Tabel Detail

#### `users`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `name` | string | |
| `email` | string | Unique |
| `email_verified_at` | timestamp | Nullable |
| `password` | string | Hashed |
| `remember_token` | string | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `suppliers`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `supplier_code` | string | Unique, max 50 char (format: SUP-NNN) |
| `name` | string | Max 255 char |
| `phone` | string | Nullable, max 100 char |
| `address` | text | Nullable |
| `notes` | text | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `milk_batches`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `batch_number` | string | Unique, format: RM-YYYYMMDD-NNN |
| `supplier_id` | bigint FK | → suppliers.id |
| `production_target` | enum | mozzarella / susu_cup |
| `volume_liter` | decimal | |
| `received_date` | date | Indexed |
| `received_time` | time | |
| `status` | enum | pending_qc / approved / rejected / consumed |
| `notes` | text | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `qc_results`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `milk_batch_id` | bigint FK | Nullable, → milk_batches.id, indexed |
| `production_batch_id` | bigint FK | Nullable, → production_batches.id, indexed |
| `qc_type` | enum | raw / pasteurized / mozzarella, indexed |
| `fat` | decimal | Nullable |
| `snf` | decimal | Nullable |
| `density` | decimal | Nullable |
| `protein` | decimal | Nullable |
| `lactose` | decimal | Nullable |
| `salts` | decimal | Nullable |
| `total_solids` | decimal | Nullable |
| `added_water` | decimal | Nullable |
| `freezing_point` | decimal | Nullable |
| `temperature` | decimal | Nullable |
| `ph` | decimal | Nullable |
| `peroxide` | string | Nullable, max 20 char |
| `antibiotic` | string | Nullable, max 20 char |
| `aroma` | string | Nullable |
| `taste` | string | Nullable |
| `texture` | string | Nullable |
| `result` | enum | pass / reject |
| `warnings` | json | Array of warning strings |
| `created_at` / `updated_at` | timestamp | |

#### `production_batches`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `batch_number` | string | Unique, format: MZ/SC-YYYYMMDD-NNN |
| `milk_batch_id` | bigint FK | → milk_batches.id, indexed |
| `production_type` | enum | mozzarella / susu_cup |
| `start_time` | timestamp | |
| `end_time` | timestamp | Nullable |
| `status` | enum | production / chiller / ready / closed |
| `notes` | text | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `production_steps`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `production_batch_id` | bigint FK | → production_batches.id, indexed |
| `rennet_ml` | decimal | Nullable |
| `nitric_acid_ml` | decimal | Nullable |
| `target_temperature` | decimal | Nullable |
| `actual_temperature` | decimal | Nullable |
| `holding_time_minutes` | integer | Nullable |
| `cooling_time_minutes` | integer | Nullable |
| `notes` | text | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `yield_records`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `production_batch_id` | bigint FK | → production_batches.id, indexed |
| `predicted_yield_kg` | decimal | |
| `actual_yield_kg` | decimal | Nullable |
| `variance_percent` | decimal | Nullable |
| `created_at` / `updated_at` | timestamp | |

#### `shelf_life_records`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `production_batch_id` | bigint FK | → production_batches.id, indexed |
| `chiller_in_date` | date | |
| `chiller_in_time` | time | |
| `shelf_life_days` | integer | Default: 14 |
| `expiry_date` | date | Indexed |
| `remaining_days` | integer | Computed |
| `created_at` / `updated_at` | timestamp | |

#### `inventory_items`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `item_code` | string | Unique (format: XXX-NNN) |
| `name` | string | |
| `category` | enum | mozzarella / susu_cup / packaging |
| `unit` | string | kg / pcs |
| `minimum_stock` | decimal | |
| `is_active` | boolean | Default: true |
| `created_at` / `updated_at` | timestamp | |

#### `inventory_transactions`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `item_id` | bigint FK | → inventory_items.id, indexed |
| `production_batch_id` | bigint FK | Nullable, → production_batches.id |
| `transaction_type` | enum | in / out / adjustment |
| `quantity` | decimal | Negatif untuk keluar |
| `transaction_date` | date | Indexed |
| `notes` | text | Nullable |
| `request_by` | string | Nullable, max 100 char |
| `no_sj` | string | Nullable, max 100 char (No. Surat Jalan) |
| `created_at` / `updated_at` | timestamp | |

#### `settings`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `key` | string | Unique |
| `value` | string | |
| `group` | string | qc / shelf_life / yield |
| `created_at` / `updated_at` | timestamp | |

#### `audit_logs`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `user_id` | bigint FK | Nullable, → users.id, indexed |
| `action` | string | Indexed |
| `table_name` | string | Indexed |
| `record_id` | bigint | |
| `old_data` | json | Nullable |
| `new_data` | json | Nullable |
| `created_at` | timestamp | Indexed |

#### `notifications`
| Kolom | Tipe | Notes |
|-------|------|-------|
| `id` | bigint PK | Auto-increment |
| `type` | string | Indexed |
| `notifiable_type` | string | Polymorphic, indexed |
| `notifiable_id` | bigint | Polymorphic, indexed |
| `title` | string | |
| `message` | text | |
| `data` | json | Nullable |
| `is_read` | boolean | Default: false, indexed |
| `read_at` | timestamp | Nullable |
| `created_at` | timestamp | |

---

## Service Layer

7 service classes yang memisahkan business logic dari controllers:

### QCEngine
- `evaluate(array $data): array` — Evaluasi QC otomatis terhadap thresholds
- Hard reject: antibiotic/positif
- Accumulative warnings: TS, Protein, Fat, pH, Sensory

### YieldEngine
- `predict(float $volume, float $totalSolids, ?float $factor): float` — Prediksi yield
- `calculateVariance(float $predicted, float $actual): float` — Hitung variance %
- Formula: `volume × (TS/100) × factor`

### ShelfLifeService
- `calculate(string $date, string $time, ?int $days): array` — Hitung expiry & remaining days
- Default: 14 hari dari chiller-in datetime

### InventoryService
- `getCurrentStock(int $itemId): float` — Sum semua transaksi
- `getStockHealth(float $stock, float $min): string` — ok/medium/low/out_of_stock
- `getAllStock(): array` — Semua item dengan stok & health
- `getTransactionsWithRunningBalance(int $itemId): array` — Transaksi + saldo berjalan

### NotificationService
- `create(...)` — Buat notifikasi baru
- `getUnread(int $limit): Collection` — Ambil notifikasi belum dibaca
- `markAsRead(int $id)` — Tandai sudah dibaca
- `markAllAsRead()` — Tandai semua sudah dibaca
- `getUnreadCount(): int` — Jumlah belum dibaca

### AuditService
- `log(string $action, string $table, ?int $recordId, ?array $old, ?array $new): void` — Catat perubahan

### BatchNumberService
- `generate(string $prefix): string` — Auto-generate nomor batch
- Format: `{PREFIX}-{YYYYMMDD}-{NNN}` (counter reset harian)
- Prefix: RM (raw milk), MZ (mozzarella), SC (susu cup)

---

## Enum & Status

### BatchStatus
| Case | Value | Deskripsi |
|------|-------|-----------|
| `PendingQc` | `pending_qc` | Susu diterima, menunggu QC |
| `Approved` | `approved` | Lolos QC, siap produksi |
| `Rejected` | `rejected` | Gagal QC, tidak bisa dipakai |
| `Consumed` | `consumed` | Sudah dipakai di produksi |

### ProductionStatus
| Case | Value | Deskripsi |
|------|-------|-----------|
| `Production` | `production` | Sedang diproduksi |
| `Chiller` | `chiller` | Di chiller, shelf life berjalan |
| `Ready` | `ready` | Siap dijual |
| `Closed` | `closed` | Batch selesai, diarsipkan |

### ProductionType
| Case | Value |
|------|-------|
| `Mozzarella` | `mozzarella` |
| `SusuCup` | `susu_cup` |

### QCType
| Case | Value | Kapan |
|------|-------|-------|
| `Raw` | `raw` | Susu mentah |
| `Pasteurized` | `pasteurized` | Susu cup |
| `Mozzarella` | `mozzarella` | Keju mozzarella |

### QCResult
| Case | Value |
|------|-------|
| `Pass` | `pass` |
| `Reject` | `reject` |

### TransactionType
| Case | Value | Qty |
|------|-------|-----|
| `In` | `in` | Positif |
| `Out` | `out` | Negatif |
| `Adjustment` | `adjustment` | Bisa +/- |

### InventoryCategory
| Case | Value |
|------|-------|
| `Mozzarella` | `mozzarella` |
| `SusuCup` | `susu_cup` |
| `Packaging` | `packaging` |

### NotificationType
| Case | Value |
|------|-------|
| `InventoryWarning` | `inventory_warning` |
| `ShelfLifeWarning` | `shelf_life_warning` |
| `QcWarning` | `qc_warning` |

### NotificationSeverity
| Case | Value |
|------|-------|
| `Info` | `info` |
| `Warning` | `warning` |
| `Critical` | `critical` |

---

## API Endpoints

Tersedia REST API dengan `auth:sanctum`:

### Dashboard
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard` | KPI summary (active batches, today production, today QC, alerts) |

### Suppliers
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/suppliers` | List semua supplier |
| POST | `/api/suppliers` | Buat supplier baru |
| GET | `/api/suppliers/{id}` | Detail supplier |
| PUT | `/api/suppliers/{id}` | Update supplier |
| DELETE | `/api/suppliers/{id}` | Hapus supplier |

### Milk Batches
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/milk-batches` | List semua milk batch |
| POST | `/api/milk-batches` | Buat milk batch baru |
| GET | `/api/milk-batches/{id}` | Detail milk batch |

### QC Results
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/qc-results` | List semua QC results |
| POST | `/api/qc-results` | Submit QC result baru |
| GET | `/api/qc-results/{id}` | Detail QC result |

### Production Batches
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/production-batches` | List semua production batch |
| POST | `/api/production-batches` | Buat production batch baru |
| GET | `/api/production-batches/{id}` | Detail production batch |

### Inventory
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/inventory` | Semua stok dengan health status |
| GET | `/api/inventory/items` | Semua item aktif |
| POST | `/api/inventory/transactions` | Buat transaksi baru |

### Analytics
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/analytics/yield` | Yield analytics (predicted vs actual) |
| GET | `/api/analytics/qc` | QC parameter trends |
| GET | `/api/analytics/suppliers` | Supplier volume analytics |
| GET | `/api/analytics/shelf-life` | Shelf life overview |

### Settings
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/settings` | Ambil semua settings |
| PUT | `/api/settings` | Update settings |

### Shelf Life
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/shelf-life` | Semua shelf life records |

### Yield Records
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/yield-records` | Semua yield records |

---

## Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ & npm
- SQLite (default) atau PostgreSQL

### Setup

```bash
# Clone repo
git clone https://github.com/hafizhmaulidan15/rsi-os.git
cd rsi-os

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database setup (SQLite)
touch database/database.sqlite
php artisan migrate --seed

# Build frontend assets
npm run build

# Start development server
php artisan serve
```

### Atau gunakan Composer script:
```bash
composer setup    # Full setup: install, env, key, migrate, npm install, npm build
composer dev      # Concurrent: artisan serve, queue:listen, pail, npm run dev
composer test     # Clear config + run pest tests
```

### Default Credentials

| Email | Password |
|-------|----------|
| `hafizh@rsi.com` | `password` |

### Aplikasi berjalan di:
```
http://localhost:8000
```

---

## Deployment

### Railway

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cp .env.example .env && php artisan key:generate --force && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

```toml
# nixpacks.toml
[php]
extensions = ["pgsql", "pdo_pgsql"]
```

**Health Check:** `GET /health` → `200 OK`

### PWA Support
- Service Worker via `vite-plugin-pwa`
- Manifest: "RSI OS - Rumah Susu Indonesia", standalone, dark theme `#0F172A`
- Workbox: NetworkFirst untuk `/api/*`, 1-hour expiration, max 50 entries

### Environment Variables Penting

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `APP_NAME` | `"RSI OS"` | Nama aplikasi |
| `APP_ENV` | `local` | Environment (local/production) |
| `APP_DEBUG` | `true` | Debug mode |
| `DB_CONNECTION` | `sqlite` | Database driver |
| `SESSION_DRIVER` | `database` | Session storage |
| `QUEUE_CONNECTION` | `database` | Queue driver |
| `CACHE_STORE` | `database` | Cache store |

---

## Configuration

### Composer Scripts
| Script | Command | Deskripsi |
|--------|---------|-----------|
| `setup` | Full project setup | Install, env, key, migrate, npm |
| `dev` | Concurrent development | artisan serve + queue:listen + pail + npm dev |
| `test` | Run tests | Clear config + pest |

### Middleware
| Middleware | Scope | Deskripsi |
|-----------|-------|-----------|
| `auth` | Semua web routes | Autentikasi wajib |
| `verified` | Semua app routes | Email verified |
| `guest` | Auth routes | Hanya untuk tamu (login/register) |
| `auth:sanctum` | Semua API routes | API token auth |
| `HandleInertiaRequests` | Global | Share auth.user & flash messages |
| `AddLinkHeadersForPreloadedAssets` | Global | Performance headers |
| `trimStrings` | Global | Trim whitespace input |
| `convertEmptyStringsToNull` | Global | Empty → null |
| Trust Proxies (`*`) | Global | Required untuk Railway deployment |

### Trusted Proxies
```
//bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

---

## Form Validation

### StoreMilkBatchRequest
```php
'supplier_id'       => 'required|exists:suppliers,id'
'received_date'     => 'required|date'
'received_time'     => 'required|date_format:H:i'
'volume_liter'      => 'required|numeric|min:0.01'
'production_target' => 'required|in:mozzarella,susu_cup'
'notes'             => 'nullable|string'
```

### StoreProductionBatchRequest
```php
'milk_batch_id'    => 'required|exists:milk_batches,id'
'production_type'  => 'required|in:mozzarella,susu_cup'
'start_time'       => 'required|date'
'notes'            => 'nullable|string'
```

### StoreQcResultRequest
```php
'milk_batch_id'       => 'required_without:production_batch_id|exists:milk_batches,id|nullable'
'production_batch_id' => 'required_without:milk_batch_id|exists:production_batches,id|nullable'
'qc_type'             => 'required|in:raw,pasteurized,mozzarella'
'fat'                 => 'nullable|numeric|min:0|max:100'
'snf'                 => 'nullable|numeric|min:0|max:100'
'density'             => 'nullable|numeric|min:0'
'protein'             => 'nullable|numeric|min:0|max:100'
'lactose'             => 'nullable|numeric|min:0|max:100'
'salts'               => 'nullable|numeric|min:0|max:100'
'total_solids'        => 'nullable|numeric|min:0|max:100'
'added_water'         => 'nullable|numeric|min:0|max:100'
'freezing_point'      => 'nullable|numeric'
'temperature'         => 'nullable|numeric'
'ph'                  => 'nullable|numeric|min:0|max:14'
'peroxide'            => 'nullable|string|max:20'
'antibiotic'          => 'nullable|string|max:20'
'aroma'               => 'nullable|string'
'taste'               => 'nullable|string'
'texture'             => 'nullable|string'
'notes'               => 'nullable|string'
```

### StoreInventoryTransactionRequest
```php
'item_id'             => 'required|exists:inventory_items,id'
'transaction_type'    => 'required|in:in,out,adjustment'
'quantity'            => 'required|numeric|min:0.01'
'production_batch_id' => 'nullable|exists:production_batches,id'
'transaction_date'    => 'required|date'
'notes'               => 'nullable|string'
'request_by'          => 'nullable|string|max:100'
'no_sj'               => 'nullable|string|max:100'
```

### StoreSupplierRequest
```php
'supplier_code' => 'required|string|max:50|unique:suppliers'
'name'          => 'required|string|max:255'
'phone'         => 'nullable|string|max:100'
'address'       => 'nullable|string'
'notes'         => 'nullable|string'
```

### ProfileUpdateRequest
```php
'name'  => 'required|string|max:255'
'email' => 'required|string|lowercase|email|max:255|unique:users,id,{id}'
```

### Auth\LoginRequest
```php
'email'    => 'required|string|email'
'password' => 'required|string'
```
- Rate limiting: 5 attempts max
- Throttle key: `lowercase(email)|ip`

---

## Export (CSV & PDF)

### CSV Export
Menggunakan chunked queries (100 records/chunk) untuk efisiensi memori.

| Type | Filename | Kolom |
|------|----------|-------|
| `production` | `production-export.csv` | Batch, Type, Supplier, Status, Start Time |
| `qc` | `qc-export.csv` | Supplier, TS, Fat, Protein, pH, Result, Date |
| `inventory` | `inventory-export.csv` | Item, Type, Quantity, Date, Notes |

### PDF Export
Menggunakan DomPDF dengan Blade template yang sudah styled.

| Type | Judul | Kolom |
|------|-------|-------|
| `production` | Laporan Produksi | Batch, Tipe, Supplier, Status, Mulai |
| `qc` | Laporan Quality Control | Batch, Tipe, Supplier, pH, TS, Lemak, Protein, Aroma, Rasa, Hasil, Tanggal |

**PDF Template Features:**
- Header: "RSI OS — {title}" + subjudul "Rumah Susu Indonesia"
- Meta: tanggal cetak + jumlah data
- Tabel: header biru (#2563EB), baris bergantian (#F9FAFB)
- Badge: `.badge-pass` (hijau) / `.badge-reject` (merah)
- Font: DejaVu Sans (kompatibel PDF)
- Footer: "RSI OS | Dicetak otomatis dari sistem"

---

## Audit Logging

Setiap perubahan data dicatat ke tabel `audit_logs`:

```php
AuditService::log(
    action: 'milk_batch_created',
    tableName: 'milk_batches',
    recordId: $batch->id,
    oldData: null,           // null untuk create
    newData: $batch->toArray() // data baru
);
```

**16 aksi yang di-audit:**
`milk_batch_created/updated/deleted`, `production_batch_created`, `production_steps_updated`, `yield_updated`, `shelf_life_updated`, `qc_created`, `inventory_transaction_created`, `inventory_item_created/updated/deleted`, `supplier_created/updated/deleted`, `settings_updated`

---

## Notification System

**Trigger Points:**
1. **QC Failed** → Saat QC result = `reject`
2. **Stock Rendah** → Saat health = `low` atau `out_of_stock` setelah transaksi

**Notification Payload:**
```php
NotificationService::create(
    type: 'qc_warning',
    title: 'QC Failed: RM-20260712-001',
    message: 'Batch ditolak karena TS Rendah, Fat Rendah',
    notifiableType: User::class,
    notifiableId: 1,
    data: ['qc_result_id' => 1, 'milk_batch_id' => 1]
);
```

---

## Dependencies

### PHP (composer.json)

**Production:**
| Package | Purpose |
|---------|---------|
| `laravel/framework` ^12.0 | Core framework |
| `laravel/sanctum` ^4.0 | API token auth |
| `laravel/breeze` ^2.4 | Auth scaffolding |
| `inertiajs/inertia-laravel` ^2.0 | Inertia server adapter |
| `tightenco/ziggy` ^2.0 | Laravel routes in JS |
| `barryvdh/laravel-dompdf` * | PDF generation |
| `maatwebsite/excel` * | Excel import/export |
| `laravel/tinker` ^2.10 | REPL |

**Dev:**
| Package | Purpose |
|---------|---------|
| `pestphp/pest` ^3.8 | Testing |
| `laravel/pint` ^1.24 | Code style |
| `laravel/pail` ^1.2 | Log viewer |
| `laravel/sail` ^1.41 | Docker dev |
| `mockery/mockery` ^1.6 | Test mocking |
| `fakerphp/faker` ^1.23 | Test data |

### JavaScript (package.json)

**Runtime:**
| Package | Purpose |
|---------|---------|
| `react` / `react-dom` ^18.2 | UI rendering |
| `@inertiajs/react` ^2.0 | Inertia React adapter |
| `@radix-ui/react-*` | UI primitives (Dialog, Dropdown, Select, Tabs, Toast, Label) |
| `@tanstack/react-table` ^8.21 | Headless data table |
| `react-hook-form` ^7.80 | Form management |
| `zod` ^4.4 | Schema validation |
| `recharts` ^3.8 | Charts |
| `lucide-react` ^1.21 | Icons |
| `motion` ^12.40 | Animations |
| `sonner` ^2.0 | Toast |
| `class-variance-authority` | Variant classes |
| `clsx` + `tailwind-merge` | Class utilities |

**Dev:**
| Package | Purpose |
|---------|---------|
| `tailwindcss` ^3.2 | CSS framework |
| `vite` ^7.0 | Build tool |
| `typescript` ^5.0 | Type checking |
| `vite-plugin-pwa` ^1.3 | PWA support |
| `@vitejs/plugin-react` ^4.2 | React Vite plugin |
| `axios` ^1.11 | HTTP client |

---

## UI Components

### Sidebar Menu (9 items)
| # | Label | Icon | Route |
|---|-------|------|-------|
| 1 | Dashboard | LayoutDashboard | `/dashboard` |
| 2 | Supplier | Building2 | `/suppliers` |
| 3 | Milk Intake | Milk | `/milk-intake` |
| 4 | QC | FlaskConical | `/qc` |
| 5 | Production | Factory | `/production` |
| 6 | Inventory | Package | `/inventory` |
| 7 | Shelf Life | Clock | `/shelf-life` |
| 8 | Analytics | BarChart3 | `/analytics` |
| 9 | Settings | Settings | `/settings` |

### Mobile Bottom Nav (5 items)
| Label | Icon | Route |
|-------|------|-------|
| Dashboard | LayoutDashboard | `/dashboard` |
| QC | FlaskConical | `/qc` |
| Production | Factory | `/production` |
| Inventory | Package | `/inventory` |
| Settings | Settings | `/settings` |

### Reusable Components
**Shadcn-style UI:** button, card, badge, input, label, data-table (TanStack Table)

**Custom:** ExportButton, ApplicationLogo, Checkbox, DangerButton, Dropdown, InputError, InputLabel, Modal, NavLink, PrimaryButton, SecondaryButton, ResponsiveNavLink, TextInput

### Layout
- **Dark theme:** `bg-[#0F172A]` body, `bg-[#111827]` sidebar
- **Fixed sidebar:** 264px (`w-64`), collapsible submenus
- **Top header:** 64px, hamburger menu (mobile), logout
- **Mobile bottom nav:** fixed, visible on `lg:hidden`
- **Toast:** Sonner component via `<Toaster />`

---

## License

MIT License
