# Hi PDF — Nền tảng Công cụ PDF & Dịch thuật Bảo toàn Bố cục

Website: **Hi PDF** — Không gian làm việc trực quan, hiện đại và bảo mật dành cho sinh viên, giáo viên, nhà nghiên cứu và nhân viên văn phòng. Điểm nhấn trọng tâm là tính năng **Dịch PDF giữ nguyên định dạng** (Layout-Preserving Document Translation), hiển thị đối chiếu song ngữ đồng bộ.

---

## 1. Hướng dẫn khởi động nhanh

### Yêu cầu môi trường
- **Node.js**: >= 18 (Đã kiểm thử tối ưu trên Node v24)
- **npm** / **pnpm** / **yarn**

### Cài đặt và Chạy máy chủ phát triển
```bash
# 1. Cài đặt các gói phụ thuộc
npm install --legacy-peer-deps

# 2. Khởi chạy ở chế độ phát triển
npm run dev
# Mở trình duyệt tại http://localhost:3000

# 3. Biên dịch và chạy bản tối ưu Production
npm run build
npm start
```

---

## 2. Bảng ánh xạ công cụ và Trạng thái Engine

| Nhóm | Tên công cụ | Slug | Engine / Nhà cung cấp thực tế | Trạng thái | Ghi chú & Giới hạn |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dịch thuật & AI** | **Dịch PDF giữ nguyên định dạng** | `/tools/translate-pdf` | Hi PDF Semantic Layout Engine + Arial Unicode / Cloud Adapters | **Hoạt động (Trọng tâm)** | Bảo toàn tọa độ khối chữ, bảng biểu, ảnh. Hỗ trợ đối chiếu song ngữ. |
| **Tổ chức trang** | **Ghép PDF** | `/tools/merge-pdf` | `pdf-lib 1.17.1` (WebAssembly/Client) | **Hoạt động** | Xử lý trực tiếp trong trình duyệt, tối đa 20 tệp / 100MB. |
| **Tổ chức trang** | **Tách PDF** | `/tools/split-pdf` | `pdf-lib` | **Hoạt động** | Tách theo khoảng trang (vd: 1-3, 5, 8-10) hoặc tách riêng từng trang. |
| **Tổ chức trang** | **Xoay trang PDF** | `/tools/rotate-pdf` | `pdf-lib` | **Hoạt động** | Xoay 90°, 180°, 270° cho toàn bộ hoặc từng trang. |
| **Tổ chức trang** | **Xóa & Trích xuất trang** | `/tools/extract-delete-pages` | `pdf-lib` + `PDF.js` | **Hoạt động** | Xem lưới thumbnail trực quan để chọn trang xóa/trích xuất. |
| **Tổ chức trang** | **Sắp xếp thứ tự trang** | `/tools/reorder-pages` | `pdf-lib` + `PDF.js` | **Hoạt động** | Di chuyển, hoán đổi vị trí các trang trực quan. |
| **Chỉnh sửa** | **Thêm số trang** | `/tools/page-numbers` | `pdf-lib` + `@pdf-lib/fontkit` | **Hoạt động** | Font Unicode Arial, định dạng "Trang X / Y", không lỗi font tiếng Việt. |
| **Chỉnh sửa** | **Đóng dấu Watermark** | `/tools/watermark-pdf` | `pdf-lib` + `@pdf-lib/fontkit` | **Hoạt động** | Nhúng chữ bản quyền có dấu tiếng Việt, tùy chỉnh độ mờ, góc xoay. |
| **Chỉnh sửa** | **Xem & Sửa Metadata** | `/tools/pdf-metadata` | `pdf-lib` | **Hoạt động** | Đọc và chỉnh sửa Title, Author, Subject, Keywords. |
| **Bảo mật** | **Đặt mật khẩu PDF** | `/tools/protect-pdf` | `pdf-lib` | **Hoạt động** | Thiết lập mật khẩu bảo vệ quyền truy cập. |
| **Bảo mật** | **Mở khóa PDF** | `/tools/unlock-pdf` | `pdf-lib` | **Hoạt động** | Gỡ bỏ mật khẩu khi người dùng có mật khẩu hợp lệ. |
| **Bảo mật** | **Ký tên lên PDF** | `/tools/sign-pdf` | Canvas API + `pdf-lib` | **Hoạt động** | Vẽ chữ ký cảm ứng/chuột hoặc tải ảnh chữ ký trong suốt. |
| **Chuyển đổi** | **Hình ảnh sang PDF** | `/tools/image-to-pdf` | Canvas API + `pdf-lib` | **Hoạt động** | Chuyển đổi hàng loạt ảnh JPG, PNG, WEBP thành tệp PDF. |
| **Chuyển đổi** | **PDF sang Hình ảnh** | `/tools/pdf-to-image` | `PDF.js` + Canvas API | **Hoạt động** | Render các trang PDF với độ phân giải cao thành ảnh PNG/JPG. |
| **Chuyển đổi** | **Trích xuất văn bản** | `/tools/extract-text` | `PDF.js` Text Stream | **Hoạt động** | Trích xuất toàn bộ luồng chữ sạch ra tệp `.txt`. |
| **Tối ưu** | **Làm phẳng PDF (Flatten)** | `/tools/flatten-pdf` | `pdf-lib Flatten API` | **Hoạt động** | Khóa cứng các trường form và chú thích vào nền trang. |
| **Tối ưu** | **Nén & Giảm dung lượng** | `/tools/compress-pdf` | `pdf-lib Stream Optimizer` | **Hoạt động** | Nén luồng dữ liệu trang và tối ưu hóa tài nguyên nhị phân. |
| **Đọc & Kiểm tra** | **Trình đọc & Kiểm tra PDF** | `/tools/view-pdf` | `PDF.js` Canvas Renderer | **Hoạt động** | Xem trước mượt mà, thu phóng, điều hướng trang. |
| **Chuyển đổi** | **Word / Office sang PDF** | `/tools/office-to-pdf` | Gotenberg / LibreOffice | **Cần cấu hình** | Cần kết nối Gotenberg server (`GOTENBERG_URL`). |
| **Chuyển đổi** | **PDF sang Word (DOCX)** | `/tools/pdf-to-word` | Adobe PDF Services / Nutrient | **Cần cấu hình** | Yêu cầu API credentials của Adobe PDF Services. |
| **OCR** | **OCR Nhận dạng chữ Scan** | `/tools/ocr-pdf` | OCRmyPDF + Tesseract (`vie`, `eng`) | **Cần cấu hình** | Cần backend worker cài đặt Tesseract OCR tiếng Việt. |
| **AI** | **Tóm tắt tài liệu AI** | `/tools/ai-summary` | Google Gemini API | **Cần cấu hình** | Nhập khóa Gemini API trong trang Cài đặt để kích hoạt. |
| **AI** | **Hỏi đáp tài liệu (dẫn trang)** | `/tools/ai-ask` | Google Gemini API + Page Locator | **Cần cấu hình** | Nhập khóa Gemini API trong trang Cài đặt để kích hoạt. |

---

## 3. Kiến trúc Tính năng Trọng tâm: Dịch PDF Giữ Bố Cục

### Nguyên lý hoạt động
1. **Trích xuất Tọa độ và Phân cụm Ngữ nghĩa**:
   - Sử dụng `PDF.js` đọc ma trận biến đổi (transformation matrix) để xác định chính xác tọa độ $(X, Y, \text{Width}, \text{Height})$, kích thước cỡ chữ (font size) của từng khối văn bản.
   - Gom các dòng văn bản liền kề thành đoạn văn hoàn chỉnh để bảo toàn ngữ pháp tiếng Việt, tránh hiện tượng dịch rời rạc từng từ.
2. **Dịch thuật Ngữ cảnh**:
   - Gửi các khối đoạn văn bản qua API dịch thuật (`/api/translate`) hoặc kết nối Azure / Google Translator adapter.
3. **Căn chỉnh Tỷ lệ & Xuống dòng tự động (Text-Fitting Algorithm)**:
   - Bản dịch tiếng Việt thường dài hơn tiếng Anh khoảng 15–25%. Thuật toán tự động ngắt dòng vừa vặn với chiều rộng bounding-box và thu nhỏ cỡ chữ (down-scale) trong giới hạn cho phép (tối thiểu 7–8pt) để không làm vỡ bố cục hay tràn ra ngoài trang.
4. **Bảo tồn Đồ họa & Nhúng Font Unicode**:
   - Nạp tệp PDF gốc bằng `pdf-lib`, giữ trọn vẹn 100% hình ảnh, logo, đường kẻ bảng, biểu đồ vector.
   - Phủ một lớp bề mặt sạch lên vị trí chữ gốc và vẽ lại chữ tiếng Việt bằng font **Arial Unicode** (`public/fonts/Arial-Unicode.ttf`) thông qua `@pdf-lib/fontkit`. Loại bỏ 100% hiện tượng lỗi ô vuông hoặc mất dấu thanh.
5. **Xem Đối chiếu Song ngữ Đồng bộ (Dual Viewer)**:
   - Giao diện hai cột cạnh nhau trên Desktop (và tab chuyển đổi trên Mobile) giúp người đọc dễ dàng đối chiếu bản gốc và bản dịch theo từng trang.

---

## 4. Hướng dẫn Kết nối Dịch vụ Đám mây & Chi phí

### A. Microsoft Azure Document Translation
- **Loại tài nguyên**: Azure AI Translator (S1 Standard hoặc Free F0).
- **Cách cấu hình**: Truy cập `/settings`, nhập **Azure API Key** và **Region** (ví dụ: `southeastasia`).
- **Ước tính chi phí**: F0 miễn phí 2 triệu ký tự/tháng. Gói S1 khoảng $15 cho mỗi triệu ký tự dịch tài liệu.

### B. Google Cloud Translation API
- **Loại tài nguyên**: Cloud Translation API v3.
- **Cách cấu hình**: Nhập **Google Cloud API Key** tại `/settings`.
- **Ước tính chi phí**: 500,000 ký tự đầu tiên miễn phí mỗi tháng. Sau đó khoảng $20 cho mỗi triệu ký tự.

### C. Google Gemini API (Document AI)
- **Loại tài nguyên**: Gemini 1.5 Pro / Flash.
- **Cách cấu hình**: Nhập **Gemini API Key** tại `/settings`.
- **Ước tính chi phí**: Gói miễn phí (Free Tier) có sẵn quota 15 RPM.

---

## 5. Cấu trúc Dự án

```
hipdf/
├── public/
│   ├── fonts/
│   │   └── Arial-Unicode.ttf    # Font Unicode tiếng Việt chuẩn nhúng vào PDF
│   └── pdf.worker.min.mjs       # PDF.js worker đồng bộ phiên bản
├── src/
│   ├── app/
│   │   ├── globals.css          # Design system, biến màu sắc, dark mode
│   │   ├── layout.tsx           # Root layout với Inter font và ThemeProvider
│   │   ├── page.tsx             # Trang chủ: "Mọi công cụ PDF, trong một không gian."
│   │   ├── tools/
│   │   │   ├── page.tsx         # Trang danh mục toàn bộ công cụ
│   │   │   ├── [slug]/page.tsx  # Không gian làm việc động cho từng công cụ
│   │   │   └── translate-pdf/   # Trang Dịch PDF giữ bố cục (Trọng tâm)
│   │   ├── favorites/page.tsx   # Trang công cụ yêu thích
│   │   ├── recent/page.tsx      # Trang công cụ gần đây
│   │   ├── help/page.tsx        # Hướng dẫn & kiến trúc giải pháp
│   │   ├── settings/page.tsx    # Cấu hình khóa API và tùy chọn
│   │   ├── privacy/page.tsx     # Chính sách quyền riêng tư thực tế
│   │   └── api/
│   │       ├── capabilities/    # Endpoint công bố engine & capabilities
│   │       └── translate/       # API dịch thuật tiếng Việt
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx     # Bố cục 3 vùng (Sidebar trái — Nội dung — Sidebar phải)
│   │   │   ├── LeftSidebar.tsx  # Thanh điều hướng thu gọn được (236px / 64px)
│   │   │   ├── RightSidebar.tsx # Không gian làm việc (Inspector 288px)
│   │   │   ├── FloatingHeader.tsx # Header nổi bo tròn căn giữa nội dung chính
│   │   │   └── QuickSearchModal.tsx # Tìm kiếm nhanh tiếng Việt (Ctrl+K)
│   │   ├── pdf/
│   │   │   ├── PdfViewer.tsx    # Trình xem PDF.js với điều khiển zoom, trang
│   │   │   ├── DualPdfViewer.tsx # Trình xem đối chiếu song ngữ đồng bộ
│   │   │   └── PageGridOrganizer.tsx # Lưới thumbnail sắp xếp/xóa trang trực quan
│   │   ├── tools/
│   │   │   ├── PdfDropzone.tsx  # Vùng kéo thả tệp PDF với phân tích metadata
│   │   │   ├── ToolCard.tsx     # Thẻ công cụ đơn sắc tinh tế, huy hiệu trạng thái
│   │   │   ├── ToolGrid.tsx     # Lưới công cụ có bộ lọc tab và tìm kiếm
│   │   │   ├── ToolWorkspace.tsx # Không gian xử lý tương tác của các công cụ
│   │   │   └── ToolOptionsRenderer.tsx # Tùy chọn theo ngữ cảnh của từng công cụ
│   │   └── translation/
│   │       ├── TranslationWorkspace.tsx # Không gian làm việc dịch PDF
│   │       └── TranslationOptions.tsx   # Cấu hình cặp ngôn ngữ, chế độ, trang
│   └── lib/
│       ├── tools-registry.ts    # Registry tập trung tất cả công cụ
│       ├── utils.ts             # Tiện ích bỏ dấu tiếng Việt, định dạng file
│       ├── store/
│       │   └── useAppStore.ts   # Zustand store quản lý tệp, job, layout, cài đặt
│       └── pdf/
│           ├── pdf-renderer.ts  # Tương tác với PDF.js và trích xuất bounding box
│           ├── pdf-engine.ts    # Thao tác PDF client-side bằng pdf-lib & fontkit
│           └── layout-translator.ts # Engine dịch thuật giữ nguyên bố cục
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 6. Quyền riêng tư & Bảo mật
- **Không tải tệp lên server đối với công cụ client-side**: Các thao tác ghép, tách, xoay, thêm chữ ký, đóng dấu watermark, đánh số trang chạy 100% bằng WebAssembly/JS trong trình duyệt người dùng.
- **Không lưu trữ nội dung PDF trong localStorage**: Chỉ có danh sách yêu thích và cài đặt API của người dùng được lưu trong trình duyệt.
- **Giải phóng bộ nhớ tự động**: Các Object URL được thu hồi ngay khi tệp bị xóa hoặc phiên làm việc kết thúc.

---

## 7. Giấy phép các thành phần (Open Source Licenses)
- **Next.js**: MIT License
- **React & React DOM**: MIT License
- **pdf-lib**: MIT License
- **@pdf-lib/fontkit**: Apache 2.0 License
- **pdfjs-dist (Mozilla PDF.js)**: Apache 2.0 License
- **Lucide Icons**: ISC License
- **Zustand**: MIT License
- **Tailwind CSS**: MIT License
