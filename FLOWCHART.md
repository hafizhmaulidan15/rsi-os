# RSI OS — Flowchart Inventory & Produksi

```mermaid
flowchart TB
    subgraph PENERIMAAN["📥 Penerimaan Susu"]
        A[Milk Intake] --> B[QC Mentah]
        B -->|Pass| C[Status: Approved]
        B -->|Reject| D[Status: Rejected]
    end

    subgraph PRODUKSI["🏭 Produksi"]
        C --> E{Target Produksi}
        E -->|Mozzarella| F[Produksi Mozzarella]
        E -->|Susu Cup| G[Produksi Susu Cup]
        G --> H[QC Produk Pasteurisasi]
        H --> I[Status: Ready / Chiller]
    end

    subgraph STOK_BAHAN_BAKU["📦 Stok Bahan Baku & Kemasan"]
        J1[Cup 130ml kosong<br/>Min: 10.000 pcs]
        J2[Cup 175ml kosong<br/>Min: 5.000 pcs]
        J3[Plastik Logo 2 Line<br/>Min: 5 pcs]
        J4[Plastik Logo 4 Line<br/>Min: 5 pcs]
        J5[Plastik Roll Logo<br/>Min: 10 pcs]
        J6[Plastik Roll Polos<br/>Min: 2 pcs]
        J7[Box Tasik<br/>Min: 10 pcs]
        J8[Tray Tasik<br/>Min: 10 pcs]
    end

    subgraph STOK_PRODUK_JADI["🥛 Stok Produk Jadi"]
        K1[Mozzarella Fresh<br/>Min: 5 kg]
        K2[Susu Cup 130ml<br/>Min: 50 pcs]
        K3[Susu Cup 175ml<br/>Min: 50 pcs]
    end

    subgraph TRANSAKSI["🔄 Transaksi Inventory"]
        L[Form Transaksi Baru]
        M{Tipe Transaksi}
        N[Masuk +]
        O[Keluar -]
        P[Preview Stok]
        Q[Field: Request By, No. SJ, Keterangan]
        L --> M
        M --> N
        M --> O
        N --> P
        O --> P
        P --> Q
    end

    subgraph LAPORAN["📊 Dashboard & Laporan"]
        R[Semua Stok]
        S[Tab: Produk Jadi]
        T[Tab: Packaging & Items]
        U[Tab: Transaksi]
        V[Health Bar: Aman / Cukup / Rendah / Habis]
        R --> V
        S --> V
        T --> V
    end

    G -.->|Gunakan| J1
    G -.->|Gunakan| J2
    G -.->|Gunakan| J3
    G -.->|Gunakan| J4
    
    F --> K1
    G --> K2
    G --> K3

    J1 <--> TRANSAKSI
    J2 <--> TRANSAKSI
    J3 <--> TRANSAKSI
    J4 <--> TRANSAKSI
    J5 <--> TRANSAKSI
    J6 <--> TRANSAKSI
    J7 <--> TRANSAKSI
    J8 <--> TRANSAKSI
    K1 <--> TRANSAKSI
    K2 <--> TRANSAKSI
    K3 <--> TRANSAKSI

    TRANSAKSI --> LAPORAN
```

## Alur Proses

| Langkah | Proses | Catatan |
|---------|--------|---------|
| 1 | Susu mentah masuk → QC Mentah | Di QC, pilih tipe "Mentah" |
| 2 | Jika lolos QC → siap produksi | Status batch jadi "approved" |
| 3 | Produksi Susu Cup → butuh stok cup kosong & plastik | Stok kemasan otomatis terpakai |
| 4 | QC Produk (pasteurisasi) | Di QC, pilih tipe "Pasteurisasi" |
| 5 | Produk jadi masuk inventory | Transaksi IN untuk Susu Cup |
| 6 | Stok packaging & items bisa ditambah/dikurang manual | Via form transaksi inventory |

## Cara Baca Health Bar

| Health | Rentang Stok | Warna |
|--------|-------------|-------|
| **Aman** | Stok > Min × 2 | Hijau |
| **Cukup** | Min < Stok ≤ Min × 2 | Kuning |
| **Rendah** | 0 < Stok ≤ Min | Merah |
| **Habis** | Stok ≤ 0 | Abu-abu |

## Item Default (Seeder)

| Kode | Nama | Kategori | Min Stok |
|------|------|----------|----------|
| MOZZA-001 | Mozzarella Fresh | mozzarella | 5 kg |
| CUP130-001 | Susu Cup 130ml | susu_cup | 50 pcs |
| CUP175-001 | Susu Cup 175ml | susu_cup | 50 pcs |
| PKG-CUP130 | Cup 130ml (kosong) | packaging | 10.000 pcs |
| PKG-CUP175 | Cup 175ml (kosong) | packaging | 5.000 pcs |
| PLG-2L | Plastik Logo 2 Line | packaging | 5 pcs |
| PLG-4L | Plastik Logo 4 Line | packaging | 5 pcs |
| PLG-RL | Plastik Roll Logo | packaging | 10 pcs |
| PLG-RP | Plastik Roll Polos | packaging | 2 pcs |
| BOX-01 | Box Tasik | packaging | 10 pcs |
| TRAY-01 | Tray Tasik | packaging | 10 pcs |
