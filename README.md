# Customer Management System

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)

**ผู้พัฒนา:** OSP101  
**สื่อประกอบการสอนวิชา SC363204 Java Web Application Development**  
**สงวนลิขสิทธิ์**

---

## 📖 เกี่ยวกับโปรเจกต์

ระบบจัดการข้อมูลลูกค้า (Customer Management System) เป็นส่วนหนึ่งของสื่อการสอนวิชา Java Web Application Development โดยใช้เทคโนโลยีต่อไปนี้:

- **Backend:** Spring Boot
- **Frontend:** Vite + React + Material-UI (MUI)

---

## 🚀 การติดตั้งและรันโปรเจกต์

### ขั้นตอนที่ 1: Clone repository จาก GitHub
```bash
git clone https://github.com/OSP101/customer-react.git
```

### ขั้นตอนที่ 2: เปลี่ยนไปยังโฟลเดอร์ `customer-react`
```bash
cd customer-react-main
```
### ขั้นตอนที่ 3: ติดตั้งแพ็คเกจที่จำเป็น
```bash
npm install
```
### ขั้นตอนที่ 4: แก้ไขไฟล์ `.env`
สร้างไฟล์ `.env` ในโฟลเดอร์ `customer-react` และกรอก URL ของ API ของคุณดังนี้:
```bash
VITE_API_URL=http://your-api-url
```
### ขั้นตอนที่ 5: รันโปรเจกต์
```bash
npm run dev
```
จากนั้นเปิดเบราว์เซอร์และไปที่ ``http://localhost:5173``

---

## 🛠️ โครงสร้างข้อมูล API

### 1. Get all customers
- Method: GET
- Endpoint: /api/v1/customer
- Parameters

  Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  length | String | จำนวนลูกค้า
  data | Array | ข้อมูลลูกค้า

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  customerid | Int | ไอดีของลูกค้า
  firstname | String | ชื่อลูกค้า
  lastname | String | นามสกุลลูกค้า

- Body:
```json
{
  "length": 2,
  "data": [
    {
      "customerid": 1,
      "firstname": "Apichai",
      "lastname": "Tinchong"
    },
    {
      "customerid": 2,
      "firstname": "Jakkrit",
      "lastname": "Kaewyotha"
    }
  ]
}
```

### 2. Get customer by ID
- Method: GET
- Endpoint: /api/v1/customer/${id}
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  customerid | Int | ไอดีของลูกค้า
  firstname | String | ชื่อลูกค้า
  lastname | String | นามสกุลลูกค้า
- Body:
```json
{
  "customerid": 1,
  "firstname": "Apichai",
  "lastname": "Tinchong"
}
```

### 3. Create forum
- Method: POST
- Endpoint: /api/v1/customer
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  firstname | String | ชื่อลูกค้า
  lastname | String | นามสกุลลูกค้า

- Body:
```json
{
  "firstname": "Sutthida",
  "lastname": "Paksawad"
}
```

### 4. Update customer
- Method: PUT
- Endpoint: /api/v1/customer/${id}
- Parameters

    Parameter | ชนิด | คำอธิบาย
  ---- | ---- | ---- |
  firstname | String | ชื่อลูกค้า
  lastname | String | นามสกุลลูกค้า

- Request Body:
```json
{
  "firstname": "Sutthida",
  "lastname": "Paksawad"
}
```

### 5. Delete customer
- Method: DELETE
- Endpoint: /api/v1/customer/${id}

---
## 📞 ติดต่อผู้พัฒนา
หากมีข้อสงสัยหรือต้องการความช่วยเหลือ สามารถติดต่อได้ที่:
OSP101

---

## 📜 ใบอนุญาต
โปรเจกต์นี้เป็นส่วนหนึ่งของสื่อการสอนวิชา SC363204 Java Web Application Development และสงวนลิขสิทธิ์โดย OSP101

---

### ตัวอย่างการแสดงผล:

![ตัวอย่าง README](https://firebasestorage.googleapis.com/v0/b/computer-e84a8.appspot.com/o/images%2Fcustomer-react.png?alt=media&token=1eaf7003-8a99-41db-87cd-79c70271df4b)
