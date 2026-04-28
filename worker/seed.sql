INSERT OR IGNORE INTO categories (id, name) VALUES
  ('cat_sampah', 'Sampah / Kutipan'),
  ('cat_longkang', 'Longkang / Saliran'),
  ('cat_pokok', 'Pokok / Landskap'),
  ('cat_haiwan', 'Haiwan Liar / Perosak'),
  ('cat_infra', 'Infrastruktur / Jalan'),
  ('cat_selamat', 'Keselamatan'),
  ('cat_lain', 'Lain-lain');

INSERT OR IGNORE INTO users (id, email, password, name, role, verified) VALUES
  ('u_admin1', 'admin@ccms.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ahmad Faiz (MPKj)', 'ADMIN', 1),
  ('u_admin2', 'nurul@ccms.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nurul Huda (MPKj)', 'ADMIN', 1),
  ('u_rahim', 'rahim@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Abdul Rahim bin Samad', 'CUSTOMER', 1),
  ('u_siti', 'siti@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Siti Zulaikha bt Ismail', 'CUSTOMER', 1),
  ('u_kumar', 'kumar@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kumar a/l Muthusamy', 'CUSTOMER', 1),
  ('u_mei', 'mei@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tan Mei Ling', 'CUSTOMER', 1),
  ('u_zainal', 'zainal@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Zainal Abidin bin Hashim', 'CUSTOMER', 1),
  ('u_fatimah', 'fatimah@villa.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Fatimah bt Abdullah', 'CUSTOMER', 1);

INSERT OR IGNORE INTO complaints (id, title, description, status, priority, category_id, customer_id, assigned_admin_id, created_at) VALUES
  ('c1', 'Sampah tidak dikutip di Jalan Dahlia 3', 'Sudah 5 hari sampah tidak dikutip. Tong sampah melimpah dan berbau busuk.', 'IN_PROGRESS', 'HIGH', 'cat_sampah', 'u_rahim', 'u_admin1', datetime('now', '-5 days')),
  ('c2', 'Lori sampah tidak datang langsung minggu ini', 'Lori sampah sepatutnya datang Isnin dan Khamis. Semua penduduk Jalan Villa 1-5 terjejas.', 'NEW', 'HIGH', 'cat_sampah', 'u_siti', NULL, datetime('now', '-1 day')),
  ('c3', 'Tong sampah komuniti rosak dan bocor', 'Tong sampah komunal Blok A rosak. Air kotor meleleh ke jalan.', 'NEW', 'MEDIUM', 'cat_sampah', 'u_kumar', NULL, datetime('now', '-2 days')),
  ('c4', 'Sampah pukal perabot lama dibuang tepi jalan', 'Perabot lama dibuang di Jalan Villa Damai 2, berhampiran taman permainan.', 'IN_PROGRESS', 'MEDIUM', 'cat_sampah', 'u_mei', 'u_admin2', datetime('now', '-3 days')),
  ('c5', 'Longkang tersumbat depan rumah No. 28', 'Longkang tersumbat dengan sampah dan daun. Nyamuk Aedes membiak.', 'NEW', 'HIGH', 'cat_longkang', 'u_zainal', NULL, datetime('now')),
  ('c6', 'Air longkang melimpah masuk halaman rumah', 'Setiap hujan lebat air longkang melimpah. Rumah dinaiki air 3 kali.', 'RESOLVED', 'HIGH', 'cat_longkang', 'u_fatimah', 'u_admin1', datetime('now', '-12 days')),
  ('c7', 'Parit Jalan Utama Villa Damai pecah', 'Parit konkrit pecah di beberapa bahagian. Hakisan tanah dan lubang besar.', 'IN_PROGRESS', 'HIGH', 'cat_longkang', 'u_rahim', 'u_admin2', datetime('now', '-2 days')),
  ('c8', 'Pokok besar tumbang selepas ribut semalam', 'Pokok angsana tumbang melintangi Jalan Villa Damai 3. Terkena wayar TNB.', 'IN_PROGRESS', 'HIGH', 'cat_pokok', 'u_siti', 'u_admin1', datetime('now')),
  ('c9', 'Dahan pokok menghala ke bumbung rumah', 'Dahan besar terlalu dekat dengan bumbung. Bimbang patah bila angin kuat.', 'NEW', 'MEDIUM', 'cat_pokok', 'u_kumar', NULL, datetime('now', '-4 days')),
  ('c10', 'Rumput padang awam terlalu panjang', 'Rumput separas lutut. Ular dan serangga kelihatan. Kanak-kanak tak selamat.', 'CLOSED', 'LOW', 'cat_pokok', 'u_mei', 'u_admin1', datetime('now', '-18 days')),
  ('c11', 'Anjing liar berkeliaran di kawasan perumahan', '4-5 ekor anjing liar setiap malam. Agresif dan pernah kejar penduduk.', 'IN_PROGRESS', 'HIGH', 'cat_haiwan', 'u_fatimah', 'u_admin2', datetime('now', '-1 day')),
  ('c12', 'Anjing liar kencing dan berak di halaman rumah', 'Anjing liar masuk halaman waktu subuh. Ada anak kecil main di halaman.', 'NEW', 'HIGH', 'cat_haiwan', 'u_rahim', NULL, datetime('now')),
  ('c13', 'Kucing terbiar terlalu banyak di belakang kedai', 'Koloni kucing 20+ ekor. Kurus, berpenyakit, mati merata. Bau busuk.', 'NEW', 'MEDIUM', 'cat_haiwan', 'u_siti', NULL, datetime('now', '-3 days')),
  ('c14', 'Ular sawa dalam longkang rumah', 'Ular sawa 2 meter dalam longkang belakang rumah. Ada anak kecil. Minta bantuan.', 'NEW', 'HIGH', 'cat_haiwan', 'u_kumar', NULL, datetime('now')),
  ('c15', 'Jalan berlubang besar di Jalan Villa Utama', 'Lubang sedalam 8 inci di tengah jalan, dekat surau. Kereta rosak tayar.', 'IN_PROGRESS', 'HIGH', 'cat_infra', 'u_mei', 'u_admin1', datetime('now', '-2 days')),
  ('c16', 'Lampu jalan Jalan Dahlia 4 rosak semua', '5 lampu jalan tidak berfungsi 2 minggu. Gelap, ragut dan pecah rumah meningkat.', 'NEW', 'HIGH', 'cat_infra', 'u_zainal', NULL, datetime('now', '-3 days')),
  ('c17', 'Kecurian motosikal di Blok C', '3 motosikal hilang malam tadi. Kejadian ke-4 dalam 2 bulan. CCTV rosak.', 'NEW', 'HIGH', 'cat_selamat', 'u_siti', NULL, datetime('now')),
  ('c18', 'Pagar taman permainan rosak', 'Pagar dawai berlubang besar. Kanak-kanak boleh keluar ke jalan raya.', 'IN_PROGRESS', 'HIGH', 'cat_selamat', 'u_mei', 'u_admin2', datetime('now', '-1 day')),
  ('c19', 'Lori buang sampah haram waktu malam', 'Lori kecil buang sampah pembinaan jam 2-3 pagi. Debu simen dan bunyi bising.', 'RESOLVED', 'MEDIUM', 'cat_selamat', 'u_fatimah', 'u_admin1', datetime('now', '-15 days')),
  ('c20', 'Pembakaran terbuka di tanah kosong', 'Individu bakar sampah setiap Khamis petang. Asap tebal ke perumahan.', 'NEW', 'MEDIUM', 'cat_lain', 'u_rahim', NULL, datetime('now', '-1 day'));
