import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function hoursAgo(hours: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

async function main() {
  await prisma.emailToken.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Sampah / Kutipan' } }),
    prisma.category.create({ data: { name: 'Longkang / Saliran' } }),
    prisma.category.create({ data: { name: 'Pokok / Landskap' } }),
    prisma.category.create({ data: { name: 'Haiwan Liar / Perosak' } }),
    prisma.category.create({ data: { name: 'Infrastruktur / Jalan' } }),
    prisma.category.create({ data: { name: 'Keselamatan' } }),
    prisma.category.create({ data: { name: 'Lain-lain' } }),
  ]);

  const password = await bcrypt.hash('admin123', 10);

  const admin1 = await prisma.user.create({
    data: { email: 'admin@ccms.local', password, name: 'Ahmad Faiz (MPKj)', role: 'ADMIN', verified: true },
  });

  const admin2 = await prisma.user.create({
    data: { email: 'nurul@ccms.local', password, name: 'Nurul Huda (MPKj)', role: 'ADMIN', verified: true },
  });

  const residents = await Promise.all([
    prisma.user.create({ data: { email: 'rahim@villa.local', password, name: 'Abdul Rahim bin Samad', role: 'CUSTOMER', verified: true } }),
    prisma.user.create({ data: { email: 'siti@villa.local', password, name: 'Siti Zulaikha bt Ismail', role: 'CUSTOMER', verified: true } }),
    prisma.user.create({ data: { email: 'kumar@villa.local', password, name: 'Kumar a/l Muthusamy', role: 'CUSTOMER', verified: true } }),
    prisma.user.create({ data: { email: 'mei@villa.local', password, name: 'Tan Mei Ling', role: 'CUSTOMER', verified: true } }),
    prisma.user.create({ data: { email: 'zainal@villa.local', password, name: 'Zainal Abidin bin Hashim', role: 'CUSTOMER', verified: true } }),
    prisma.user.create({ data: { email: 'fatimah@villa.local', password, name: 'Fatimah bt Abdullah', role: 'CUSTOMER', verified: true } }),
  ]);

  const admins = [admin1, admin2];

  const complaintsData = [
    {
      title: 'Sampah tidak dikutip di Jalan Dahlia 3',
      description: 'Sudah 5 hari sampah di sepanjang Jalan Dahlia 3 tidak dikutip. Tong sampah sudah melimpah dan berbau busuk. Lalat dan lipas mula kelihatan. Penduduk sekitar mula risau tentang kebersihan dan kesihatan. Sila aturkan kutipan segera.',
      category: categories[0], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 5, assignedAdmin: admin1, customer: residents[0],
    },
    {
      title: 'Lori sampah tidak datang langsung minggu ini',
      description: 'Lori sampah sepatutnya datang setiap Isnin dan Khamis. Tetapi minggu ini (minggu 3 April), lori sampah tidak datang langsung. Semua penduduk di Jalan Villa 1 hingga Villa 5 terjejas. Ada yang mula bakar sampah di belakang rumah.',
      category: categories[0], status: 'NEW', priority: 'HIGH', daysAgo: 1, assignedAdmin: null, customer: residents[1],
    },
    {
      title: 'Tong sampah komuniti rosak dan bocor',
      description: 'Tong sampah komunal di hadapan Blok A Taman Villa Damai sudah rosak. Bahagian bawah bocor, air kotor meleleh ke jalan. Bau sangat busuk terutama waktu tengah hari. Sila ganti dengan tong sampah baru segera.',
      category: categories[0], status: 'NEW', priority: 'MEDIUM', daysAgo: 2, assignedAdmin: null, customer: residents[2],
    },
    {
      title: 'Sampah pukal (perabot lama) dibuang tepi jalan',
      description: 'Terdapat perabot lama seperti tilam, almari, dan sofa dibuang di tepi Jalan Villa Damai 2, berhampiran taman permainan. Sampah pukal ini sudah berada di situ lebih 2 minggu dan menyebabkan pandangan tidak selesa serta menghalang laluan pejalan kaki.',
      category: categories[0], status: 'IN_PROGRESS', priority: 'MEDIUM', daysAgo: 3, assignedAdmin: admin2, customer: residents[3],
    },
    {
      title: 'Longkang tersumbat depan rumah No. 28',
      description: 'Longkang di hadapan rumah No. 28, Jalan Dahlia 5 tersumbat dengan sampah dan daun kering. Air hujan tidak dapat mengalir dan mula bertakung. Nyamuk Aedes mula membiak. Ini bahaya kerana kes denggi semakin meningkat di kawasan Kajang.',
      category: categories[1], status: 'NEW', priority: 'HIGH', daysAgo: 0, assignedAdmin: null, customer: residents[4],
    },
    {
      title: 'Air longkang melimpah masuk ke halaman rumah',
      description: 'Setiap kali hujan lebat, air dari longkang besar di belakang rumah No. 15, Jalan Villa Damai 4 akan melimpah masuk ke halaman. Punca longkang cetek dan tidak diselenggara. Sudah 3 kali rumah saya dinaiki air. Minta longkang diperdalamkan.',
      category: categories[1], status: 'RESOLVED', priority: 'HIGH', daysAgo: 12, assignedAdmin: admin1, customer: residents[5],
    },
    {
      title: 'Parit di Jalan Utama Villa Damai pecah',
      description: 'Parit konkrit di sepanjang Jalan Utama Taman Villa Damai telah pecah di beberapa bahagian. Ini menyebabkan hakisan tanah dan lubang besar di tepi jalan. Sangat bahaya untuk kanak-kanak dan penunggang motosikal pada waktu malam.',
      category: categories[1], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 2, assignedAdmin: admin2, customer: residents[0],
    },
    {
      title: 'Pokok besar tumbang selepas ribut semalam',
      description: 'Selepas ribut petang semalam, sebatang pokok angsana besar tumbang melintangi Jalan Villa Damai 3. Jalan tidak boleh dilalui langsung. Dahan terkena wayar elektrik TNB. Sangat bahaya. Sila hantar pasukan segera untuk alihkan pokok.',
      category: categories[2], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 0, assignedAdmin: admin1, customer: residents[1],
    },
    {
      title: 'Dahan pokok menghala ke bumbung rumah',
      description: 'Sepohon pokok di taman permainan Blok B mempunyai dahan besar yang menjulur terlalu dekat dengan bumbung rumah saya (No. 33, Jalan Dahlia 1). Saya bimbang dahan akan patah dan jatuh menimpa bumbung bila angin kuat. Minta dahan dicantas segera.',
      category: categories[2], status: 'NEW', priority: 'MEDIUM', daysAgo: 4, assignedAdmin: null, customer: residents[2],
    },
    {
      title: 'Rumput di padang awam terlalu panjang',
      description: 'Rumput di padang awam dan kawasan rekreasi Taman Villa Damai sudah sangat panjang, hampir separas lutut. Ular dan serangga berbisa pernah kelihatan. Kanak-kanak tidak dapat bermain dengan selamat. Minta kontraktor landskap potong rumput segera.',
      category: categories[2], status: 'CLOSED', priority: 'LOW', daysAgo: 18, assignedAdmin: admin1, customer: residents[3],
    },
    {
      title: 'Pokok bunga raya di roundabout mati tidak diganti',
      description: 'Pokok bunga raya dan tanaman hiasan di bulatan masuk Taman Villa Damai sudah mati dan tidak diganti sejak 3 bulan lepas. Pandangan menjadi tidak cantik dan memberiimej buruk kepada pengunjung. Taman ini pernah menang anugerah landskap terbaik.',
      category: categories[2], status: 'NEW', priority: 'LOW', daysAgo: 7, assignedAdmin: null, customer: residents[4],
    },
    {
      title: 'Anjing liar berkeliaran di kawasan perumahan',
      description: 'Sekumpulan 4-5 ekor anjing liar berkeliaran di sekitar Jalan Villa Damai 1 hingga 3 setiap malam. Anjing ini agresif dan pernah mengejar penduduk. Kanak-kanak takut keluar rumah. Penduduk minta pihak berkuasa tangkap dan pindahkan anjing ini.',
      category: categories[3], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 1, assignedAdmin: admin2, customer: residents[5],
    },
    {
      title: 'Anjing liar kencing dan berak di halaman rumah',
      description: 'Anjing liar selalu masuk ke halaman rumah saya (No. 10, Jalan Dahlia 2) pada waktu subuh. Kencing dan najis anjing bersepah di halaman. Saya ada anak kecil yang suka main di halaman. Ini isu kebersihan dan kesihatan yang serius.',
      category: categories[3], status: 'NEW', priority: 'HIGH', daysAgo: 0, assignedAdmin: null, customer: residents[0],
    },
    {
      title: 'Kucing terbiar terlalu banyak di belakang kedai',
      description: 'Belakang deretan kedai di Jalan Villa Damai terdapat koloni kucing terbiar. Dianggarkan lebih 20 ekor. Kucing ini kurus, berpenyakit, dan mati di merata tempat. Bau busuk merebak. Sila hantar pasukan veterinar untuk tangkap dan mandulkan.',
      category: categories[3], status: 'NEW', priority: 'MEDIUM', daysAgo: 3, assignedAdmin: null, customer: residents[1],
    },
    {
      title: 'Ular sawa dijumpai dalam longkang rumah',
      description: 'Petang tadi saya ternampak seekor ular sawa sepanjang 2 meter dalam longkang di belakang rumah No. 7, Jalan Villa Damai 5. Ular tidak ditangkap dan masih di situ. Saya sangat takut kerana ada anak kecil. Minta bantuan segera dari bomba atau perhilitan.',
      category: categories[3], status: 'NEW', priority: 'HIGH', daysAgo: 0, assignedAdmin: null, customer: residents[2],
    },
    {
      title: 'Jalan berlubang besar di Jalan Villa Utama',
      description: 'Terdapat lubang besar sedalam 8 inci di tengah Jalan Villa Utama, berhampiran surau Al-Hidayah. Lubang ini sangat bahaya terutama pada waktu malam kerana tiada lampu jalan. Beberapa kereta sudah rosak tayar. Minta tindakan segera dari MPKj.',
      category: categories[4], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 2, assignedAdmin: admin1, customer: residents[3],
    },
    {
      title: 'Lampu jalan di Jalan Dahlia 4 rosak semua',
      description: 'Kesemua 5 batang lampu jalan di sepanjang Jalan Dahlia 4 tidak berfungsi sejak 2 minggu lepas. Kawasan menjadi gelap gelita pada malam hari. Kejadian ragut dan pecah rumah meningkat. Penduduk rasa tidak selamat. Sila baiki segera.',
      category: categories[4], status: 'NEW', priority: 'HIGH', daysAgo: 3, assignedAdmin: null, customer: residents[4],
    },
    {
      title: 'Bumper jalan (speed bump) hilang tanda',
      description: 'Bumper jalan di hadapan Sekolah Kebangsaan Taman Villa Damai sudah hilang semua tanda amaran dan cat kuning. Pemandu tidak nampak bumper pada waktu malam dan kerap terlanggar dengan kuat. Sila cat semula dan pasang papan tanda amaran.',
      category: categories[4], status: 'RESOLVED', priority: 'MEDIUM', daysAgo: 8, assignedAdmin: admin2, customer: residents[5],
    },
    {
      title: 'Tiada kemudahan OKU di taman permainan',
      description: 'Taman permainan Villa Damai telah dinaik taraf tetapi tiada langsung kemudahan untuk Orang Kurang Upaya (OKU). Tiada ramp, tiada parking OKU, dan permainan tidak mesra OKU. Sebagai penjaga anak istimewa, saya minta MPKj ambil tindakan.',
      category: categories[4], status: 'NEW', priority: 'LOW', daysAgo: 10, assignedAdmin: null, customer: residents[0],
    },
    {
      title: 'Kes kecurian motosikal di Blok C',
      description: 'Malam tadi berlaku kes kecurian motosikal di kawasan parkir Blok C. Tiga buah motosikal hilang. Ini kejadian ke-4 dalam masa 2 bulan. CCTV di kawasan itu rosak. Penduduk minta rondaan polis atau pengawal keselamatan dipertingkatkan.',
      category: categories[5], status: 'NEW', priority: 'HIGH', daysAgo: 0, assignedAdmin: null, customer: residents[1],
    },
    {
      title: 'Pagar taman permainan rosak - kanak-kanak bahaya',
      description: 'Pagar di sekeliling taman permainan kanak-kanak telah rosak. Pagar dawai berlubang besar dan kanak-kanak kecil boleh keluar ke jalan raya dengan mudah. Sangat bahaya. Sila baiki pagar dengan segera sebelum berlaku kemalangan.',
      category: categories[5], status: 'IN_PROGRESS', priority: 'HIGH', daysAgo: 1, assignedAdmin: admin2, customer: residents[3],
    },
    {
      title: 'Lori pembuangan sampah haram pada waktu malam',
      description: 'Setiap malam sekitar jam 2-3 pagi, ada lori kecil masuk ke Jalan Villa Damai 6 dan membuang sampah pembinaan secara haram di tanah kosong. Bunyi bising mengganggu tidur penduduk. Debu simen berterbangan. Sila pasang CCTV atau buat sekatan jalan.',
      category: categories[5], status: 'RESOLVED', priority: 'MEDIUM', daysAgo: 15, assignedAdmin: admin1, customer: residents[5],
    },
    {
      title: 'Papan tanda papan iklan haram tumbuh macam cendawan',
      description: 'Sepanjang jalan masuk ke Taman Villa Damai, terlalu banyak papan iklan haram (billboard kecil) dipasang pada tiang lampu dan pokok. Papan iklan pinjaman wang dan ubat kuat ini mencacatkan pemandangan. Sila turunkan dan kenakan tindakan.',
      category: categories[6], status: 'NEW', priority: 'LOW', daysAgo: 6, assignedAdmin: null, customer: residents[4],
    },
    {
      title: 'Aktiviti Karaoke bising lewat malam',
      description: 'Rumah No. 42 Jalan Dahlia 2 kerap mengadakan aktiviti karaoke sehingga jam 1-2 pagi pada hujung minggu. Bunyi bising mengganggu tidur jiran terutama warga emas dan keluarga dengan bayi kecil. Sudah ditegur tapi tiada perubahan. Minta tindakan.',
      category: categories[6], status: 'CLOSED', priority: 'LOW', daysAgo: 22, assignedAdmin: admin1, customer: residents[2],
    },
    {
      title: 'Pembakaran terbuka di tanah kosong belakang Villa',
      description: 'Setiap petang Khamis, ada individu bakar sampah secara terbuka di tanah kosong di belakang Taman Villa Damai. Asap tebal merebak ke kawasan perumahan. Penduduk yang ada asma dan masalah pernafasan sangat terjejas. Ini melanggar Akta Kualiti Alam Sekeliling.',
      category: categories[6], status: 'NEW', priority: 'MEDIUM', daysAgo: 1, assignedAdmin: null, customer: residents[0],
    },
  ];

  for (const c of complaintsData) {
    await prisma.complaint.create({
      data: {
        title: c.title,
        description: c.description,
        categoryId: c.category.id,
        status: c.status,
        priority: c.priority,
        customerId: c.customer.id,
        assignedAdminId: c.assignedAdmin?.id ?? null,
        createdAt: daysAgo(c.daysAgo),
        updatedAt: daysAgo(c.daysAgo),
      },
    });
  }

  console.log(`Seed complete: ${categories.length} kategori, 8 pengguna, ${complaintsData.length} aduan komuniti`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
