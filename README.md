# Server Multi Domain Catalog

Server Node/Express cho hệ thống catalog đa lĩnh vực (Supabase backend). Dự án có Swagger UI sẵn tại `GET /docs`.

## Cấu trúc URL

- Base API: `/api/v1`
- Swagger UI: `/docs`
- Swagger spec: `swagger.yaml`

## Yêu cầu

- Node.js **>= 20** (khuyến nghị, do dùng `--env-file` và `crypto.randomUUID()`).

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env` ở root (đã được `.gitignore`):

```env
SERVER_PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_service_role_key
```

Lưu ý:
- `SUPABASE_SERVICE_ROLE` là **secret** (service role key) → không commit.
- Với import CSV/XLSX, cần có thư mục `tmp/` ở root (multer sẽ lưu file upload vào đây).

## Chạy dự án

Dev (nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

Mặc định server chạy tại: `http://localhost:<SERVER_PORT>`

## Xác thực

### Bearer token (Supabase JWT)

Các API (trừ `/auth/*` và `/public/catalog/*`) yêu cầu header:

```http
Authorization: Bearer <access_token>
```

### API Key cho public catalog

Nhóm endpoint `GET /api/v1/public/catalog/*` yêu cầu header:

```http
x-api-key: <api_key>
```

## Phân quyền (role code)

Trong code hiện dùng các role code:

- `admin`
- `domainOfficer`
- `approver`

Chi tiết role yêu cầu được thể hiện trong Swagger theo từng endpoint.

## Import CSV/XLSX

### 1) Import 1 bảng

Endpoint: `POST /api/v1/import/single` (multipart/form-data)

- Field `file`: `.csv` hoặc `.xlsx`
- Field `type`:
  - `1`: DOMAIN
  - `2`: CATEGORY_GROUP
  - `3`: CATEGORY_ITEM
  - `4`: API_KEY
  - `5`: USERS_MANAGEMENT

### 2) Import catalog (domain + group + item)

Endpoint: `POST /api/v1/import/catalog` (multipart/form-data)

Header (cột) kỳ vọng trong file:
- `domain_code`, `domain_name`, `domain_description`
- `group_code`, `group_name`, `group_description`
- `item_code`, `item_name`, `item_description`

## Swagger (OpenAPI)

- Mở Swagger UI tại `GET /docs`
- File spec nằm ở `swagger.yaml` (được load bởi `src/configs/swagger.config.js`).

