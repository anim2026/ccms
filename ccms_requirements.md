# Customer Complaint Management System (CCMS)

## 1. Scope

### In-Scope

-   Web-based system
-   Single portal (Customer & Admin, role-based access)
-   Authentication (register, login, forgot password)
-   Complaint CRUD (Customer)
-   Complaint management + assignment (Admin)
-   Status workflow (Open → In Progress → Resolved → Closed)
-   Email notifications

### Out-of-Scope

-   Mobile app
-   SLA automation
-   Real-time chat / comment thread
-   Multi-tenant

------------------------------------------------------------------------

## 2. Glossary

  Term             Definition
  ---------------- -------------------------------------
  Complaint        Aduan yang dihantar oleh customer
  Status           Tahap progress complaint
  Priority         Tahap kepentingan (Low/Medium/High)
  Category         Jenis aduan
  Assigned Admin   Admin yang bertanggungjawab

------------------------------------------------------------------------

## 3. User Stories

### US-01: Register Account

Sebagai public user, saya mahu mendaftar akaun menggunakan email supaya
saya boleh menghantar complaint.

### US-02: Verify Email

Sebagai user berdaftar, saya mahu mengesahkan email saya supaya akaun
saya aktif.

### US-03: Login

Sebagai user, saya mahu login ke sistem supaya saya boleh akses fungsi
complaint.

### US-04: Create Complaint

Sebagai customer, saya mahu cipta complaint supaya aduan saya
direkodkan.

### US-05: View My Complaints

Sebagai customer, saya mahu lihat senarai complaint saya supaya saya
boleh track status.

### US-06: Update Complaint

Sebagai customer, saya mahu kemaskini complaint saya supaya maklumat
tepat.

### US-07: Delete Complaint

Sebagai customer, saya mahu padam complaint saya supaya saya boleh urus
data sendiri.

### US-08: View All Complaints

Sebagai admin, saya mahu lihat semua complaint supaya saya boleh urus
operasi.

### US-09: Assign Complaint

Sebagai admin, saya mahu assign complaint kepada admin tertentu supaya
ada ownership jelas.

### US-10: Update Status

Sebagai admin, saya mahu kemaskini status complaint supaya progress
dapat dijejak.

### US-11: Dashboard View

Sebagai admin, saya mahu lihat dashboard supaya saya faham keadaan
sistem.

------------------------------------------------------------------------

## 4. Acceptance Criteria (Sample)

### Create Complaint

-   Given user is logged in
-   When user submits valid complaint
-   Then complaint is created with status Open

### Update Complaint

-   Given complaint is not Closed
-   When user updates complaint
-   Then changes are saved

### Update Status

-   Given admin updates status
-   Then flow must follow Open → In Progress → Resolved → Closed
