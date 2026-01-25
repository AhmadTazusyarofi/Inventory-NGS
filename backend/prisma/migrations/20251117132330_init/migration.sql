-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `aktif` BOOLEAN NOT NULL,
    `last_login_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gudang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(20) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `lokasi` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `kapasitas` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `gudang_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `suppliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(150) NOT NULL,
    `telepon` VARCHAR(30) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `kota` VARCHAR(100) NULL,
    `provinsi` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kode` VARCHAR(50) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `id_kategori` INTEGER NOT NULL,
    `id_supplier` INTEGER NOT NULL,
    `satuan` VARCHAR(50) NOT NULL,
    `stok_minimum` INTEGER NOT NULL,
    `deskripsi` TEXT NULL,
    `url_gambar` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `barang_kode_key`(`kode`),
    INDEX `barang_id_kategori_idx`(`id_kategori`),
    INDEX `barang_id_supplier_idx`(`id_supplier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stok_gudang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_barang` INTEGER NOT NULL,
    `id_gudang` INTEGER NOT NULL,
    `stok_now` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `stok_gudang_id_barang_id_gudang_key`(`id_barang`, `id_gudang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `batch_barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_barang` INTEGER NOT NULL,
    `id_gudang` INTEGER NOT NULL,
    `nomor_batch` VARCHAR(50) NOT NULL,
    `tanggal_kedaluwarsa` DATE NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mutasi_stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_barang` INTEGER NOT NULL,
    `id_gudang` INTEGER NOT NULL,
    `jenis_mutasi` VARCHAR(20) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `jenis_penyesuaian` VARCHAR(20) NULL,
    `id_batch` INTEGER NULL,
    `nomor_referensi` VARCHAR(50) NULL,
    `catatan` TEXT NULL,
    `dibuat_oleh` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `mutasi_stok_id_barang_idx`(`id_barang`),
    INDEX `mutasi_stok_id_gudang_idx`(`id_gudang`),
    INDEX `mutasi_stok_jenis_mutasi_idx`(`jenis_mutasi`),
    INDEX `mutasi_stok_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transfer_stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_transfer` VARCHAR(50) NOT NULL,
    `id_gudang_asal` INTEGER NOT NULL,
    `id_gudang_tujuan` INTEGER NOT NULL,
    `tanggal` DATETIME(0) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `catatan` TEXT NULL,
    `dibuat_oleh` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `transfer_stok_nomor_transfer_key`(`nomor_transfer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_transfer_stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_transfer` INTEGER NOT NULL,
    `id_barang` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `id_batch_asal` INTEGER NULL,
    `id_batch_tujuan` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opname_stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_opname` VARCHAR(50) NOT NULL,
    `id_gudang` INTEGER NOT NULL,
    `tanggal` DATETIME(0) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `total_item` INTEGER NOT NULL,
    `total_selisih` INTEGER NOT NULL,
    `dibuat_oleh` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `opname_stok_nomor_opname_key`(`nomor_opname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_opname_stok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_opname` INTEGER NOT NULL,
    `id_barang` INTEGER NOT NULL,
    `stok_sistem` INTEGER NOT NULL,
    `stok_fisik` INTEGER NOT NULL,
    `selisih` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `id_batch` INTEGER NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_aktivitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `aksi` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `log_aktivitas_id_user_idx`(`id_user`),
    INDEX `log_aktivitas_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `barang` ADD CONSTRAINT `barang_id_kategori_fkey` FOREIGN KEY (`id_kategori`) REFERENCES `kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barang` ADD CONSTRAINT `barang_id_supplier_fkey` FOREIGN KEY (`id_supplier`) REFERENCES `suppliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stok_gudang` ADD CONSTRAINT `stok_gudang_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stok_gudang` ADD CONSTRAINT `stok_gudang_id_gudang_fkey` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `batch_barang` ADD CONSTRAINT `batch_barang_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `batch_barang` ADD CONSTRAINT `batch_barang_id_gudang_fkey` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasi_stok` ADD CONSTRAINT `mutasi_stok_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasi_stok` ADD CONSTRAINT `mutasi_stok_id_gudang_fkey` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasi_stok` ADD CONSTRAINT `mutasi_stok_id_batch_fkey` FOREIGN KEY (`id_batch`) REFERENCES `batch_barang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutasi_stok` ADD CONSTRAINT `mutasi_stok_dibuat_oleh_fkey` FOREIGN KEY (`dibuat_oleh`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_stok` ADD CONSTRAINT `transfer_stok_id_gudang_asal_fkey` FOREIGN KEY (`id_gudang_asal`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_stok` ADD CONSTRAINT `transfer_stok_id_gudang_tujuan_fkey` FOREIGN KEY (`id_gudang_tujuan`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_stok` ADD CONSTRAINT `transfer_stok_dibuat_oleh_fkey` FOREIGN KEY (`dibuat_oleh`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transfer_stok` ADD CONSTRAINT `detail_transfer_stok_id_transfer_fkey` FOREIGN KEY (`id_transfer`) REFERENCES `transfer_stok`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transfer_stok` ADD CONSTRAINT `detail_transfer_stok_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transfer_stok` ADD CONSTRAINT `detail_transfer_stok_id_batch_asal_fkey` FOREIGN KEY (`id_batch_asal`) REFERENCES `batch_barang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transfer_stok` ADD CONSTRAINT `detail_transfer_stok_id_batch_tujuan_fkey` FOREIGN KEY (`id_batch_tujuan`) REFERENCES `batch_barang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opname_stok` ADD CONSTRAINT `opname_stok_id_gudang_fkey` FOREIGN KEY (`id_gudang`) REFERENCES `gudang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opname_stok` ADD CONSTRAINT `opname_stok_dibuat_oleh_fkey` FOREIGN KEY (`dibuat_oleh`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_opname_stok` ADD CONSTRAINT `detail_opname_stok_id_opname_fkey` FOREIGN KEY (`id_opname`) REFERENCES `opname_stok`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_opname_stok` ADD CONSTRAINT `detail_opname_stok_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_opname_stok` ADD CONSTRAINT `detail_opname_stok_id_batch_fkey` FOREIGN KEY (`id_batch`) REFERENCES `batch_barang`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_aktivitas` ADD CONSTRAINT `log_aktivitas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
