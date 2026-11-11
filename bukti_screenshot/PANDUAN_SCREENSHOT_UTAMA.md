# Screenshot utama untuk laporan Praktikum 05
Prioritaskan 10 **kelompok bukti** berikut. Satu gambar bisa merekam beberapa pengujian jika status dan respons tetap terbaca. Seluruh 24 skenario pada matriks tetap harus diuji dan dicatat hasil aktualnya.

1. **01_lingkungan_paket.png**: VS Code/terminal menunjukkan `node --version`, `npm --version`, `npm ls express swagger-ui-express`.
2. **02_struktur_dan_server.png**: Explorer struktur src/scripts/docs/samples dan terminal `npm start` dengan port 3200.
3. **03_dashboard_dan_get.png**: dashboard gradient serta GET katalog aktual, dua buku awal.
4. **04_get_pencarian.png**: GET detail ID 2 (`tersedia:false`), pencarian Kotlin dan pencarian kosong.
5. **05_post_dua_buku.png**: POST dua buku yang valid; setidaknya bukti `HTTP 201`, `Location`, dan ID yang dikembalikan.
6. **06_put_dan_get.png**: PUT penuh `HTTP 200` dan GET membuktikan perubahan.
7. **07_delete_dan_get_404.png**: DELETE `HTTP 204` body kosong, GET kemudian `404 BOOK_NOT_FOUND`.
8. **08_validasi_error.png**: gabungkan hasil 400 INVALID_ID / INVALID_BOOK / INVALID_JSON / INVALID_QUERY dan 415 media type (boleh 2 gambar agar terbaca).
9. **09_openapi_swagger.png**: `/openapi.json` dan `/docs/` yang menampilkan 5 operasi; pada Swagger klik Try it out, Execute, dan tunjukkan `Server response` aktual.
10. **10_server_mati_restart.png**: koneksi gagal saat server dimatikan, lalu restart kembali dua buku awal dan data tambahan hilang.
11. **11_instalasi_ulang.png (disarankan)**: `npm ci`, `npm run docs`, `npm start`, dan GET berhasil setelah instalasi ulang.

**Penting**: screenshot yang belum diuji tidak dapat dianggap bukti. Simpan nama file sesuai urutan, kirim bertahap untuk penyusunan laporan. Tugas 2 juga perlu bukti perubahan deskripsi/contoh error generator ditampilkan di Swagger.
