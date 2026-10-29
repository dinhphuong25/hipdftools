export type ToolCategory =
  | "organize"
  | "edit"
  | "convert_to_pdf"
  | "convert_from_pdf"
  | "optimize"
  | "ocr"
  | "security"
  | "forms"
  | "view_inspect"
  | "ai_translate"
  | "utilities";

export type ToolStatus =
  | "available"
  | "not_configured"
  | "coming_soon"
  | "unavailable";

export type ProcessingMode = "client_side" | "server_async" | "cloud_api";

export interface ToolCapability {
  supportsBatch: boolean;
  maxFiles?: number;
  maxFileSizeMB?: number;
  engineName?: string;
  notes?: string;
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  icon: string;
  acceptedFormats: string[];
  outputFormats: string[];
  multiple: boolean;
  processingMode: ProcessingMode;
  status: ToolStatus;
  capabilities: ToolCapability;
  isPopular?: boolean;
  isFocal?: boolean; // For Translate PDF
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "ai_translate",
    name: "Dịch thuật & AI",
    description: "Dịch PDF giữ bố cục, tóm tắt và trích xuất thông tin thông minh",
    icon: "Languages",
  },
  {
    id: "organize",
    name: "Tổ chức trang",
    description: "Ghép, tách, xoay, trích xuất, xóa và sắp xếp lại trang PDF",
    icon: "Layers",
  },
  {
    id: "edit",
    name: "Chỉnh sửa & Chú thích",
    description: "Thêm số trang, hình mờ watermark, siêu dữ liệu và chú thích",
    icon: "FileEdit",
  },
  {
    id: "security",
    name: "Bảo mật & Chữ ký",
    description: "Đặt mật khẩu, mở khóa, ký tài liệu và bảo vệ thông tin",
    icon: "ShieldCheck",
  },
  {
    id: "convert_to_pdf",
    name: "Chuyển sang PDF",
    description: "Chuyển ảnh, tài liệu Office và văn bản sang định dạng PDF",
    icon: "FileInput",
  },
  {
    id: "convert_from_pdf",
    name: "Chuyển từ PDF",
    description: "Xuất trang PDF sang ảnh, văn bản hoặc tài liệu Office",
    icon: "FileOutput",
  },
  {
    id: "optimize",
    name: "Tối ưu & Khôi phục",
    description: "Nén tệp, làm phẳng biểu mẫu và tối ưu hóa dung lượng",
    icon: "Sparkles",
  },
  {
    id: "ocr",
    name: "OCR & Quét",
    description: "Nhận dạng ký tự quang học cho tài liệu scan và ảnh",
    icon: "ScanText",
  },
  {
    id: "forms",
    name: "Biểu mẫu",
    description: "Điền biểu mẫu, tạo trường nhập và làm phẳng form",
    icon: "CheckSquare",
  },
  {
    id: "view_inspect",
    name: "Đọc & Kiểm tra",
    description: "Xem tài liệu, kiểm tra cấu trúc, font và metadata",
    icon: "Eye",
  },
  {
    id: "utilities",
    name: "Tiện ích nâng cao",
    description: "Mã QR, chuyển đổi định dạng phụ trợ và chuỗi thao tác",
    icon: "Wrench",
  },
];

export const TOOLS: ToolItem[] = [
  // --- FOCAL: Dịch PDF giữ bố cục ---
  {
    id: "translate-pdf",
    slug: "translate-pdf",
    name: "Dịch PDF giữ nguyên định dạng",
    shortDescription: "Bảo toàn bố cục, bảng biểu, hình ảnh và thay thế chữ chuẩn xác",
    description:
      "Dịch tài liệu PDF sang tiếng Việt hoặc hơn 50+ ngôn ngữ khác mà vẫn giữ trọn vẹn bố cục cột, bảng biểu, kích thước font chữ và hình ảnh gốc. Hỗ trợ hiển thị đối chiếu song ngữ trực tiếp.",
    category: "ai_translate",
    keywords: ["dịch", "translate", "song ngữ", "bilingual", "giữ định dạng", "tiếng anh", "tiếng việt"],
    icon: "Languages",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    isFocal: true,
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 35,
      engineName: "Hi PDF Layout Engine / Cloud Translators",
      notes: "Hỗ trợ chế độ giữ bố cục gốc hoặc xem song ngữ đối chiếu",
    },
  },

  // --- A. TỔ CHỨC TRANG ---
  {
    id: "merge-pdf",
    slug: "merge-pdf",
    name: "Ghép PDF",
    shortDescription: "Kết hợp nhiều tệp PDF thành một tài liệu duy nhất theo thứ tự mong muốn",
    description:
      "Kéo thả để sắp xếp lại các tệp PDF và ghép chúng lại thành một file duy nhất với tốc độ tức thì, xử lý hoàn toàn bảo mật trên trình duyệt của bạn.",
    category: "organize",
    keywords: ["ghép", "merge", "gộp", "nối", "combine"],
    icon: "Merge",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: true,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: true,
      maxFiles: 20,
      maxFileSizeMB: 100,
      engineName: "pdf-lib (WebAssembly/Pure JS)",
      notes: "Xử lý trực tiếp trong trình duyệt, không tải lên máy chủ ngoài",
    },
  },
  {
    id: "split-pdf",
    slug: "split-pdf",
    name: "Tách PDF",
    shortDescription: "Tách theo khoảng trang cụ thể hoặc tách riêng từng trang",
    description:
      "Trích xuất các trang bạn cần từ tệp PDF gốc theo từng trang lẻ hoặc dải trang (ví dụ: 1-3, 5, 8-10).",
    category: "organize",
    keywords: ["tách", "split", "chia", "dải trang"],
    icon: "Split",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib",
      notes: "Tự do chọn khoảng trang hoặc tách thành nhiều tệp",
    },
  },
  {
    id: "rotate-pdf",
    slug: "rotate-pdf",
    name: "Xoay trang PDF",
    shortDescription: "Xoay toàn bộ hoặc từng trang PDF 90°, 180° hoặc 270°",
    description:
      "Chỉnh lại hướng trang hiển thị đúng chiều (thẳng đứng hoặc nằm ngang) cho từng trang hoặc toàn bộ tài liệu.",
    category: "organize",
    keywords: ["xoay", "rotate", "hướng trang", "ngang", "dọc"],
    icon: "RotateCw",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib",
    },
  },
  {
    id: "extract-delete-pages",
    slug: "extract-delete-pages",
    name: "Xóa & Trích xuất trang",
    shortDescription: "Xem thumbnail trực quan và nhấp chuột để xóa hoặc trích trang thừa",
    description:
      "Hiển thị toàn bộ các trang dưới dạng lưới hình thu nhỏ (thumbnail). Dễ dàng chọn các trang muốn loại bỏ hoặc xuất các trang đã chọn ra tệp mới.",
    category: "organize",
    keywords: ["xóa trang", "delete page", "trích trang", "extract page"],
    icon: "Trash2",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib + PDF.js",
    },
  },
  {
    id: "reorder-pages",
    slug: "reorder-pages",
    name: "Sắp xếp lại thứ tự trang",
    shortDescription: "Kéo thả trực quan các trang để xếp lại theo trình tự mới",
    description:
      "Xem ảnh thu nhỏ của từng trang và dùng thao tác kéo thả để hoán đổi vị trí các trang theo đúng ý bạn.",
    category: "organize",
    keywords: ["sắp xếp", "reorder", "kéo thả", "đổi vị trí"],
    icon: "ArrowUpDown",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib + PDF.js",
    },
  },

  // --- B. CHỈNH SỬA & CHÚ THÍCH ---
  {
    id: "page-numbers",
    slug: "page-numbers",
    name: "Thêm số trang",
    shortDescription: "Đánh số trang tự động với tùy chọn vị trí, định dạng và font chữ",
    description:
      "Tự động chèn số trang vào đầu trang (header) hoặc chân trang (footer), hỗ trợ định dạng 'Trang X / Y' hoặc số đơn giản.",
    category: "edit",
    keywords: ["số trang", "đánh số", "page numbers", "footer", "header"],
    icon: "Hash",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib + fontkit",
      notes: "Hỗ trợ font Unicode tiếng Việt chuẩn xác",
    },
  },
  {
    id: "watermark-pdf",
    slug: "watermark-pdf",
    name: "Đóng dấu Watermark",
    shortDescription: "Chèn dấu mờ văn bản hoặc logo bản quyền chéo trang",
    description:
      "Bảo vệ bản quyền tài liệu bằng cách thêm chữ mờ (ví dụ: 'NỘI BỘ', 'BẢN THẢO', tên tác giả) với góc xoay, độ mờ đục và kích thước tùy chỉnh.",
    category: "edit",
    keywords: ["watermark", "đóng dấu", "hình mờ", "bản quyền", "chữ mờ"],
    icon: "Stamp",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib + fontkit",
      notes: "Hỗ trợ đầy đủ tiếng Việt có dấu",
    },
  },
  {
    id: "pdf-metadata",
    slug: "pdf-metadata",
    name: "Xem & Sửa Metadata",
    shortDescription: "Kiểm tra và chỉnh sửa tiêu đề, tác giả, từ khóa và phần mềm tạo",
    description:
      "Xem thông tin chi tiết của tài liệu PDF và cập nhật lại tiêu đề (Title), tác giả (Author), chủ đề (Subject), từ khóa (Keywords) hoặc xóa sạch để bảo mật.",
    category: "edit",
    keywords: ["metadata", "thông tin", "tác giả", "tiêu đề", "thuộc tính"],
    icon: "Info",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib",
    },
  },

  // --- G. BẢO MẬT & CHỮ KÝ ---
  {
    id: "protect-pdf",
    slug: "protect-pdf",
    name: "Đặt mật khẩu PDF",
    shortDescription: "Mã hóa và bảo vệ tài liệu bằng mật khẩu mở tệp",
    description:
      "Thiết lập mật khẩu bảo vệ để ngăn chặn người không có thẩm quyền mở và đọc tài liệu.",
    category: "security",
    keywords: ["mật khẩu", "password", "bảo vệ", "khóa", "mã hóa"],
    icon: "Lock",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib",
    },
  },
  {
    id: "unlock-pdf",
    slug: "unlock-pdf",
    name: "Mở khóa PDF",
    shortDescription: "Gỡ bỏ mật khẩu bảo vệ khi đã có mật khẩu hợp lệ",
    description:
      "Nhập mật khẩu của bạn một lần để lưu lại bản PDF không còn bị khóa mật khẩu mỗi lần mở.",
    category: "security",
    keywords: ["mở khóa", "unlock", "xóa mật khẩu"],
    icon: "Unlock",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib",
    },
  },
  {
    id: "sign-pdf",
    slug: "sign-pdf",
    name: "Ký tên lên PDF",
    shortDescription: "Vẽ chữ ký tay hoặc tải ảnh con dấu để chèn vào vị trí mong muốn",
    description:
      "Tạo chữ ký cá nhân trực tiếp trên màn hình cảm ứng / chuột hoặc tải ảnh chữ ký có nền trong suốt để đặt vào đúng vị trí ký trên tài liệu.",
    category: "security",
    keywords: ["ký tên", "chữ ký", "sign", "con dấu"],
    icon: "PenTool",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "Canvas + pdf-lib",
      notes: "Chữ ký hình ảnh cá nhân; phân biệt rõ với chứng thư số cryptographic",
    },
  },

  // --- C. CHUYỂN SANG PDF ---
  {
    id: "image-to-pdf",
    slug: "image-to-pdf",
    name: "Hình ảnh sang PDF",
    shortDescription: "Chuyển ảnh JPG, PNG, WEBP thành tệp PDF chất lượng cao",
    description:
      "Gộp một hoặc nhiều hình ảnh thành các trang PDF sắc nét, tự động căn lề hoặc giữ đúng tỷ lệ ảnh gốc.",
    category: "convert_to_pdf",
    keywords: ["ảnh sang pdf", "jpg to pdf", "png sang pdf", "webp"],
    icon: "Image",
    acceptedFormats: [".jpg", ".jpeg", ".png", ".webp"],
    outputFormats: [".pdf"],
    multiple: true,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: true,
      maxFiles: 30,
      maxFileSizeMB: 50,
      engineName: "Canvas + pdf-lib",
    },
  },
  {
    id: "office-to-pdf",
    slug: "office-to-pdf",
    name: "Word / Excel / PPT sang PDF",
    shortDescription: "Chuyển tài liệu văn phòng sang PDF giữ nguyên định dạng",
    description:
      "Chuyển đổi các tệp .docx, .xlsx, .pptx thành tài liệu PDF chuẩn. Cần kết nối dịch vụ Gotenberg hoặc LibreOffice engine.",
    category: "convert_to_pdf",
    keywords: ["word to pdf", "docx", "excel", "powerpoint", "office sang pdf"],
    icon: "FileSpreadsheet",
    acceptedFormats: [".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 40,
      engineName: "Hi PDF Document Engine",
      notes: "Chuyển đổi trực tiếp tài liệu Office sang PDF chuẩn định dạng",
    },
  },

  // --- D. CHUYỂN TỪ PDF ---
  {
    id: "pdf-to-image",
    slug: "pdf-to-image",
    name: "PDF sang Hình ảnh",
    shortDescription: "Trích xuất các trang PDF thành ảnh PNG hoặc JPG độ nét cao",
    description:
      "Render từng trang PDF với độ phân giải cao thành tệp hình ảnh để dễ dàng chia sẻ hoặc chèn vào bài thuyết trình.",
    category: "convert_from_pdf",
    keywords: ["pdf sang ảnh", "pdf to png", "pdf to jpg", "render ảnh"],
    icon: "Images",
    acceptedFormats: [".pdf"],
    outputFormats: [".png", ".jpg"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    isPopular: true,
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 60,
      engineName: "PDF.js + Canvas API",
      notes: "Tải ảnh từng trang hoặc tải gói ảnh trọn vẹn",
    },
  },
  {
    id: "extract-text",
    slug: "extract-text",
    name: "Trích xuất văn bản",
    shortDescription: "Trích toàn bộ văn bản text có trong tệp PDF sang tệp TXT",
    description:
      "Đọc các khối chữ từ các trang PDF và xuất thành văn bản thuần túy, nhanh chóng sao chép hoặc phân tích.",
    category: "convert_from_pdf",
    keywords: ["trích text", "lấy chữ", "extract text", "pdf to txt"],
    icon: "FileText",
    acceptedFormats: [".pdf"],
    outputFormats: [".txt"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "PDF.js Text Content Stream",
    },
  },
  {
    id: "pdf-to-word",
    slug: "pdf-to-word",
    name: "PDF sang Word (DOCX)",
    shortDescription: "Chuyển PDF sang tệp Word có thể chỉnh sửa nội dung",
    description:
      "Tái tạo cấu trúc bảng biểu và đoạn văn từ PDF sang tài liệu Word .docx. Cần adapter Adobe PDF Services hoặc Nutrient để đạt độ chính xác cao.",
    category: "convert_from_pdf",
    keywords: ["pdf to word", "pdf sang docx", "sửa word"],
    icon: "FileCode",
    acceptedFormats: [".pdf"],
    outputFormats: [".docx"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 50,
      engineName: "Hi PDF docx Engine (GitHub Open Source)",
      notes: "Tự động trích xuất cấu trúc đoạn văn, phân cấp đề mục và xuất sang file Word (.docx)",
    },
  },

  // --- E. TỐI ƯU & KHÔI PHỤC ---
  {
    id: "flatten-pdf",
    slug: "flatten-pdf",
    name: "Làm phẳng PDF (Flatten)",
    shortDescription: "Khóa các trường biểu mẫu và chú thích vào nội dung trang cố định",
    description:
      "Biến đổi các trường form nhập liệu, checkbox và chữ ký thành hình vẽ cố định trên trang, giúp hiển thị đồng nhất trên mọi máy in và thiết bị đọc.",
    category: "optimize",
    keywords: ["flatten", "làm phẳng", "khóa form", "cố định"],
    icon: "Minimize2",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 80,
      engineName: "pdf-lib Flatten API",
    },
  },
  {
    id: "compress-pdf",
    slug: "compress-pdf",
    name: "Nén & Giảm dung lượng PDF",
    shortDescription: "Tối ưu hóa hình ảnh và luồng dữ liệu để giảm kích thước tệp",
    description:
      "Tối ưu lại các luồng nội dung và nén ảnh để tệp nhẹ hơn, dễ dàng gửi qua email hoặc nộp hồ sơ trực tuyến.",
    category: "optimize",
    keywords: ["nén", "giảm dung lượng", "compress", "nhẹ hơn"],
    icon: "FileArchive",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 100,
      engineName: "pdf-lib Stream Recompression",
    },
  },

  // --- F. OCR & QUÉT ---
  {
    id: "ocr-pdf",
    slug: "ocr-pdf",
    name: "OCR Nhận dạng chữ Scan",
    shortDescription: "Tạo lớp văn bản có thể bôi đen và tìm kiếm cho tài liệu scan",
    description:
      "Sử dụng công nghệ Tesseract OCR nhận diện tiếng Việt và tiếng Anh để tạo file PDF có thể tìm kiếm và sao chép chữ.",
    category: "ocr",
    keywords: ["ocr", "scan", "nhận dạng chữ", "tìm kiếm được"],
    icon: "ScanText",
    acceptedFormats: [".pdf", ".jpg", ".png"],
    outputFormats: [".pdf", ".txt"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 50,
      engineName: "Tesseract.js Engine (vie + eng)",
      notes: "Nhận dạng ký tự quang học trực tiếp trong trình duyệt qua WebAssembly",
    },
  },

  // --- I. ĐỌC & KIỂM TRA ---
  {
    id: "view-pdf",
    slug: "view-pdf",
    name: "Trình đọc & Kiểm tra PDF",
    shortDescription: "Xem trước mượt mà, phóng to thu nhỏ, duyệt danh mục và in ấn",
    description:
      "Trình xem tài liệu PDF tốc độ cao với các công cụ thu phóng, xem ảnh thu nhỏ từng trang, xoay góc nhìn và kiểm tra thuộc tính tệp.",
    category: "view_inspect",
    keywords: ["xem pdf", "đọc pdf", "viewer", "in ấn"],
    icon: "BookOpen",
    acceptedFormats: [".pdf"],
    outputFormats: [".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 100,
      engineName: "PDF.js Canvas Renderer",
    },
  },

  // --- J. AI & HỌC TẬP ---
  {
    id: "ai-summary",
    slug: "ai-summary",
    name: "Tóm tắt tài liệu bằng AI",
    shortDescription: "Tóm tắt ý chính theo toàn bài, từng trang hoặc lập dàn ý",
    description:
      "Tận dụng trí tuệ nhân tạo Gemini để trích xuất các luận điểm quan trọng, kết luận và bài học từ tài liệu dài hàng chục trang chỉ trong vài giây.",
    category: "ai_translate",
    keywords: ["ai", "tóm tắt", "summary", "gemini", "luận điểm"],
    icon: "Sparkles",
    acceptedFormats: [".pdf"],
    outputFormats: [".txt", ".pdf"],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 30,
      engineName: "Hi PDF Semantic Summarizer / Gemini API",
      notes: "Tự động phân tích ngữ nghĩa, tóm tắt luận điểm và số liệu quan trọng",
    },
  },
  {
    id: "ai-ask",
    slug: "ai-ask",
    name: "Hỏi đáp tài liệu (có dẫn trang)",
    shortDescription: "Đặt câu hỏi về nội dung tài liệu và nhận câu trả lời kèm số trang nguồn",
    description:
      "Trợ lý AI trả lời các thắc mắc dựa trên nội dung chính xác của tệp PDF, luôn trích dẫn số trang để bạn kiểm chứng nhanh chóng.",
    category: "ai_translate",
    keywords: ["hỏi đáp", "q&a", "trợ lý", "dẫn nguồn", "chat pdf"],
    icon: "MessageSquare",
    acceptedFormats: [".pdf"],
    outputFormats: [],
    multiple: false,
    processingMode: "client_side",
    status: "available",
    capabilities: {
      supportsBatch: false,
      maxFiles: 1,
      maxFileSizeMB: 30,
      engineName: "Hi PDF Semantic Locator",
      notes: "Tra cứu câu trả lời chuẩn xác và định vị số trang tương ứng",
    },
  },
];

export function getToolBySlug(slug: string): ToolItem | undefined {
  return TOOLS.find((tool) => tool.slug === slug || tool.id === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolItem[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getPopularTools(): ToolItem[] {
  return TOOLS.filter((tool) => tool.isPopular);
}
