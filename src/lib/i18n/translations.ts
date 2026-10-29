export type Language = "vi" | "en";

export interface Translations {
  nav: {
    search: string;
    searchPlaceholder: string;
    theme: string;
    language: string;
  };
  hero: {
    headline: string;
    subtitle: string;
    bullets: string[];
    dropzone: {
      title: string;
      dropText: string;
      dragActive: string;
      or: string;
      uploadBtn: string;
      sampleBtn: string;
      sampleGenerating: string;
      supportedFormats: string;
    };
    activeFile: {
      uploadedSuccess: string;
      chooseTool: string;
      changeFile: string;
      removeFile?: string;
      pages: string;
      dragToReplace?: string;
      quickToolsTitle?: string;
      viewAllTools?: string;
      clientSideBadge?: string;
    };
  };
  toolModal: {
    title: string;
    toolsCount: string;
    desc: string;
    searchPlaceholder: string;
    uploadedSuccess: string;
    changeFile: string;
    categories: {
      all: string;
      popular: string;
      convert: string;
      ai_translate: string;
      edit_sign: string;
      organize: string;
      security_optimize: string;
    };
    applyTool: string;
    popularBadge: string;
    aiBadge: string;
    notFound: string;
    clearFilter: string;
  };
  workflow: {
    badge: string;
    title: string;
    desc: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  spotlight: {
    badge: string;
    title: string;
    desc: string;
    viewMode: string;
    compare: string;
    original: string;
    translated: string;
    tryNow: string;
    originalDoc: string;
    translatedDoc: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  catalog: {
    badge: string;
    toolCount: string;
    title: string;
    desc: string;
    searchPlaceholder: string;
    categories: {
      all: string;
      popular: string;
      ai_translate: string;
      organize: string;
      convert: string;
      edit: string;
      security: string;
    };
    openTool: string;
    popularBadge: string;
    browserMode: string;
    aiCloud: string;
    notFound: string;
    notFoundHint: string;
    viewAll: string;
  };
  security: {
    badge: string;
    title: string;
    desc: string;
    pillars: Array<{
      badge: string;
      title: string;
      description: string;
      points: string[];
    }>;
  };
  faq: {
    title: string;
    desc: string;
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  footer: {
    tagline: string;
    contact: string;
    terms: string;
    privacy: string;
    copyright: string;
    foundedBy: string;
    ecosystem: string;
  };
  quickSearch: {
    placeholder: string;
    notFound: string;
    clearQuery: string;
    closeEsc: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  vi: {
    nav: {
      search: "Tìm kiếm",
      searchPlaceholder: "Tìm kiếm công cụ (Ctrl+K hoặc ⌘K)",
      theme: "Giao diện",
      language: "Ngôn ngữ",
    },
    hero: {
      headline: "Trình chỉnh sửa và chuyển đổi PDF tất cả trong một dành cho bạn",
      subtitle:
        "Chuyển đổi, chỉnh sửa, ký số và dịch tài liệu giữ nguyên 100% bố cục gốc. Hoàn toàn miễn phí, không chèn watermark và bảo mật dữ liệu tuyệt đối.",
      bullets: [
        "Hoạt động mọi lúc trên mọi thiết bị",
        "Không cần cài đặt",
        "An toàn, riêng tư và bảo mật khi sử dụng",
        "Giữ nguyên bố cục ban đầu",
      ],
      dropzone: {
        title: "Tải lên tập tin của bạn",
        dropText: "Thả các tập tin PDF vào đây",
        dragActive: "Thả tệp vào đây ngay!",
        or: "HOẶC",
        uploadBtn: "Tải lên để chỉnh sửa",
        sampleBtn: "Thử tài liệu mẫu",
        sampleGenerating: "Đang tạo...",
        supportedFormats: "Định dạng hỗ trợ:",
      },
      activeFile: {
        uploadedSuccess: "Đã tải tệp lên thành công",
        chooseTool: "Xem tất cả công cụ",
        changeFile: "Đổi tệp khác",
        removeFile: "Xóa tệp",
        pages: "trang",
        dragToReplace: "Thả tệp mới để thay thế",
        quickToolsTitle: "CÔNG CỤ PHỔ BIẾN",
        viewAllTools: "Xem tất cả 50+ công cụ PDF",
        clientSideBadge: "100% Client-Side WASM",
      },
    },
    toolModal: {
      title: "CHỌN CÔNG CỤ BẠN MUỐN ÁP DỤNG:",
      toolsCount: "công cụ",
      desc: "Nhấp vào bất kỳ công cụ nào để mở giao diện tinh chỉnh và xử lý tài liệu.",
      searchPlaceholder: "Tìm công cụ (ký, nén, word, ocr...)",
      uploadedSuccess: "Đã tải tệp xong",
      changeFile: "Đổi tệp khác",
      categories: {
        all: "Tất cả công cụ",
        popular: "Phổ biến nhất",
        convert: "Chuyển đổi PDF",
        ai_translate: "Dịch thuật & AI",
        edit_sign: "Chỉnh sửa & Ký",
        organize: "Tổ chức trang",
        security_optimize: "Bảo mật & Nén",
      },
      applyTool: "Áp dụng công cụ này",
      popularBadge: "Phổ biến",
      aiBadge: "AI Nổi bật",
      notFound: "Không tìm thấy công cụ phù hợp với từ khóa",
      clearFilter: "Xóa bộ lọc & xem tất cả công cụ",
    },
    workflow: {
      badge: "Quy trình 3 bước tinh gọn",
      title: "Xử lý tài liệu nhanh chóng, không rườm rà",
      desc: "Không cần tạo tài khoản, không phải cài đặt phần mềm. Mọi thao tác đều hoàn tất trong vài giây.",
      step1Title: "Tải tài liệu lên",
      step1Desc: "Kéo thả trực tiếp file PDF, Word, Excel, PowerPoint hoặc ảnh vào không gian làm việc. Hỗ trợ tệp lên đến 50MB.",
      step2Title: "Lựa chọn & Tinh chỉnh",
      step2Desc: "Chọn công cụ mong muốn: Dịch giữ nguyên bố cục, Ghép tệp, Tách trang, Nén dung lượng hoặc Ký số trực quan.",
      step3Title: "Tải về máy tức thì",
      step3Desc: "Thuật toán WebAssembly xử lý trong chớp mắt ngay trên thiết bị của bạn. Tải file kết quả mà không bị đóng watermark.",
    },
    spotlight: {
      badge: "Công nghệ dịch thuật tài liệu độc quyền",
      title: "Dịch PDF giữ nguyên bố cục & định dạng gốc",
      desc: "Không làm xô lệch bảng biểu, không vỡ khung chữ, không làm mất hình vẽ vector. Tự động co giãn cỡ chữ để vừa khít tọa độ gốc.",
      viewMode: "Chế độ xem mẫu:",
      compare: "Đối chiếu song ngữ",
      original: "Bản gốc (EN)",
      translated: "Bản dịch (VI)",
      tryNow: "Trải nghiệm Dịch PDF ngay",
      originalDoc: "Tài liệu tiếng Anh gốc",
      translatedDoc: "Bản dịch tiếng Việt chuẩn xác",
      feature1Title: "Bảo toàn tọa độ hình học",
      feature1Desc: "Nhận diện chính xác từng khối văn bản và căn chỉnh font chữ tự động.",
      feature2Title: "Dịch thuật AI chuẩn xác",
      feature2Desc: "Thuật ngữ chuyên ngành kế toán, pháp lý và kỹ thuật được bảo toàn nghĩa.",
      feature3Title: "Không đóng watermark",
      feature3Desc: "Tải về tệp kết quả sạch sẽ, sẵn sàng in ấn hoặc lưu hành nội bộ.",
    },
    catalog: {
      badge: "Hệ sinh thái công cụ",
      toolCount: "tiện ích tích hợp",
      title: "Tất cả công cụ xử lý PDF",
      desc: "Xử lý nhanh chóng, trực tiếp trên trình duyệt hoặc thông qua mô hình trí tuệ nhân tạo chuyên sâu.",
      searchPlaceholder: "Tìm kiếm công cụ (vd: nén, ghép, dịch...)",
      categories: {
        all: "Tất cả công cụ",
        popular: "Phổ biến nhất",
        ai_translate: "Dịch thuật & AI",
        organize: "Tổ chức trang",
        convert: "Chuyển đổi",
        edit: "Chỉnh sửa",
        security: "Bảo mật & Ký",
      },
      openTool: "Mở công cụ",
      popularBadge: "Phổ biến",
      browserMode: "Trình duyệt",
      aiCloud: "AI Cloud",
      notFound: "Không tìm thấy công cụ phù hợp với từ khóa",
      notFoundHint: "Thử tìm kiếm với từ khóa khác như 'nén', 'ghép', 'ký' hoặc xóa bộ lọc.",
      viewAll: "Xem lại tất cả công cụ",
    },
    security: {
      badge: "Tiêu chuẩn bảo mật & Công nghệ",
      title: "Tài liệu của bạn. Thuộc về bạn.",
      desc: "Chúng tôi tin rằng các tác vụ xử lý tài liệu thường ngày không nên yêu cầu người dùng phải hy sinh sự riêng tư của những tài liệu mật và nhạy cảm.",
      pillars: [
        {
          badge: "WebAssembly & Client-Side",
          title: "Xử lý cục bộ trên trình duyệt",
          description:
            "Các công cụ như Ghép PDF, Tách trang, Nén tài liệu, Sắp xếp thứ tự và Ký số chạy trực tiếp 100% trong trình duyệt của bạn thông qua WebAssembly và JavaScript.",
          points: [
            "Tệp không bị tải lên bất kỳ máy chủ nào",
            "Tốc độ xử lý tức thì, không phụ thuộc đường truyền mạng",
            "Tuyệt đối an toàn cho tài liệu tài chính, hợp đồng pháp lý",
          ],
        },
        {
          badge: "Mã hóa TLS 1.3",
          title: "Cơ chế Zero-Retention cho AI",
          description:
            "Khi sử dụng tính năng Dịch PDF giữ định dạng hoặc OCR, văn bản được mã hóa end-to-end chỉ để xử lý chuyển ngữ và lập tức bị xóa bỏ khỏi bộ nhớ đệm.",
          points: [
            "Không lưu trữ vĩnh viễn tệp trên đĩa cứng máy chủ",
            "Không sử dụng dữ liệu của bạn để huấn luyện mô hình AI",
            "Tùy chọn tự kết nối khóa API cá nhân (Gemini, OpenAI, Claude)",
          ],
        },
        {
          badge: "Unicode Typography",
          title: "Tối ưu hóa chuẩn mực tiếng Việt",
          description:
            "Được xây dựng chuyên biệt cho tiếng Việt. Chúng tôi giải quyết triệt để vấn đề lỗi font, vỡ dấu, nhảy dòng và tràn ô thường gặp ở các công cụ quốc tế.",
          points: [
            "Nhúng font Unicode chuẩn xác đầy đủ 134 ký tự dấu",
            "Thuật toán đo đạc pixel tự động co giãn tỷ lệ font vừa khít ô",
            "Bảo tồn tuyệt đối cấu trúc bảng số liệu và chữ ký điện tử",
          ],
        },
      ],
    },
    faq: {
      title: "Bạn có câu hỏi?",
      desc: "Chúng tôi có câu trả lời cho những câu hỏi phổ biến nhất từ người dùng của mình.",
      items: [
        {
          q: "HiPDF là gì?",
          a: "HiPDF là nền tảng xử lý và biên tập tài liệu PDF trực tuyến đa năng, tích hợp hơn 24+ công cụ từ ghép tệp, tách trang, xoay hướng, nén dung lượng, ký tên, chuyển đổi Word/Excel/Ảnh cho đến dịch thuật giữ nguyên bố cục gốc. Mọi thao tác được thực thi 100% trên trình duyệt của bạn với tốc độ tức thì.",
        },
        {
          q: "HiPDF có an toàn và bảo mật không?",
          a: "Hoàn toàn an toàn và bảo mật tuyệt đối. 100% tác vụ (ghép tệp, tách trang, xoay hướng, nén dung lượng, ký tên, đánh số trang, bảo mật mật khẩu) đều được thực thi trực tiếp trong bộ nhớ RAM trình duyệt của bạn (Client-side execution). Tệp tin của bạn không bao giờ bị truyền tải hay lưu trữ trên bất kỳ máy chủ nào.",
        },
        {
          q: "Tôi có cần cài đặt phần mềm nào để sử dụng HiPDF không?",
          a: "Không. Bạn chỉ cần mở trình duyệt web (Chrome, Safari, Edge, Cốc Cốc, Firefox) trên máy tính hoặc điện thoại là có thể sử dụng ngay lập tức mà không cần cài đặt bất kỳ phần mềm, tiện ích hay ứng dụng bổ sung nào.",
        },
        {
          q: "HiPDF cung cấp các tính năng nào?",
          a: "HiPDF cung cấp trọn bộ công cụ mạnh mẽ: Dịch thuật PDF song ngữ giữ nguyên 100% bố cục, Nén PDF giảm dung lượng đến 85%, Ký số điện tử trực quan, Nhận dạng chữ scan OCR tiếng Việt/Anh, Chuyển đổi PDF sang Word (.docx), Excel (.csv) và Ảnh (PNG/JPG), Chỉnh sửa siêu dữ liệu, Đóng dấu Watermark và Mã hóa mật khẩu bảo vệ AES-256.",
        },
        {
          q: "Sử dụng HiPDF có mất phí hay cần đăng ký tài khoản không?",
          a: "HiPDF hoàn toàn miễn phí và không yêu cầu đăng ký tài khoản. Đây là dự án công cụ tiện ích phi lợi nhuận phục vụ học tập, nghiên cứu và làm việc. Hệ thống không chèn watermark bản quyền lên tệp kết quả và không có quảng cáo độc hại.",
        },
        {
          q: "Tính năng Dịch PDF giữ nguyên bố cục hoạt động như thế nào?",
          a: "Công cụ tự động phân tích tọa độ hình học (Bounding Boxes), kích thước font chữ, các bảng biểu và hình ảnh trong file PDF gốc. Sau khi dịch thuật nội dung, thuật toán sẽ tự động căn chỉnh tỉ lệ chữ vừa vặn vào đúng vị trí cũ, bảo toàn trọn vẹn 100% đồ họa và cấu trúc văn bản.",
        },
        {
          q: "Tôi có thể xử lý PDF trên điện thoại iPhone và Android không?",
          a: "Hoàn toàn được. HiPDF được tối ưu giao diện cảm ứng đa nền tảng, hoạt động mượt mà trên Safari (iOS), Chrome và Cốc Cốc (Android). Bạn có thể mở file, vẽ chữ ký tay hoặc dịch tài liệu mọi lúc mọi nơi ngay trên điện thoại.",
        },
      ],
    },
    footer: {
      tagline: "Công cụ PDF trực tuyến miễn phí.",
      contact: "Liên Hệ",
      terms: "Điều Khoản",
      privacy: "Bảo Mật",
      copyright: "© 2026 Hi PDF. Toàn quyền được bảo lưu.",
      foundedBy: "Được thành lập và phát triển bởi",
      ecosystem: "Một dự án nhỏ thuộc",
    },
    quickSearch: {
      placeholder: "Tìm kiếm công cụ PDF (có dấu hoặc không dấu)...",
      notFound: "Không tìm thấy công cụ nào phù hợp với từ khóa",
      clearQuery: "Xóa từ khóa",
      closeEsc: "Đóng tìm kiếm (ESC)",
    },
  },
  en: {
    nav: {
      search: "Search",
      searchPlaceholder: "Search tools (Ctrl+K or ⌘K)",
      theme: "Theme",
      language: "Language",
    },
    hero: {
      headline: "All-in-one PDF editor and converter designed for you",
      subtitle:
        "Convert, edit, e-sign, and translate documents preserving 100% original layout. Completely free, no watermark, and absolute data privacy.",
      bullets: [
        "Works anywhere on any device",
        "No software installation required",
        "Secure, private, and confidential",
        "Preserves 100% original document layout",
      ],
      dropzone: {
        title: "Upload your files",
        dropText: "Drop PDF files here",
        dragActive: "Drop file here now!",
        or: "OR",
        uploadBtn: "Upload to Edit",
        sampleBtn: "Try sample PDF",
        sampleGenerating: "Generating...",
        supportedFormats: "Supported formats:",
      },
      activeFile: {
        uploadedSuccess: "File uploaded successfully",
        chooseTool: "View all tools",
        changeFile: "Change file",
        removeFile: "Remove file",
        pages: "pages",
        dragToReplace: "Drop new file here to replace",
        quickToolsTitle: "POPULAR TOOLS",
        viewAllTools: "Explore all 50+ PDF tools",
        clientSideBadge: "100% Client-Side WASM",
      },
    },
    toolModal: {
      title: "SELECT A TOOL TO APPLY:",
      toolsCount: "tools",
      desc: "Click on any tool to open configuration and document processing.",
      searchPlaceholder: "Search tools (sign, compress, word, ocr...)",
      uploadedSuccess: "Upload complete",
      changeFile: "Change file",
      categories: {
        all: "All tools",
        popular: "Most popular",
        convert: "Convert PDF",
        ai_translate: "AI & Translation",
        edit_sign: "Edit & Sign",
        organize: "Organize pages",
        security_optimize: "Security & Compress",
      },
      applyTool: "Apply this tool",
      popularBadge: "Popular",
      aiBadge: "Featured AI",
      notFound: "No tools found matching keyword",
      clearFilter: "Clear filter & view all tools",
    },
    workflow: {
      badge: "Streamlined 3-step workflow",
      title: "Fast, effortless document processing",
      desc: "No account required, no software installation. Everything completes in seconds.",
      step1Title: "Upload Documents",
      step1Desc: "Drag and drop PDF, Word, Excel, PowerPoint, or image files directly. Supports files up to 50MB.",
      step2Title: "Select & Customize",
      step2Desc: "Choose your desired tool: Layout-preserved translation, Merge, Split, Compress, or Visual e-signature.",
      step3Title: "Instant Download",
      step3Desc: "WebAssembly algorithms process in the blink of an eye right on your device. Download clean files without watermarks.",
    },
    spotlight: {
      badge: "Proprietary Document Translation Tech",
      title: "Translate PDF Preserving Layout & Formatting",
      desc: "No distorted tables, no broken text frames, no lost vector graphics. Font sizes automatically scale to fit original coordinates seamlessly.",
      viewMode: "Sample preview mode:",
      compare: "Bilingual Comparison",
      original: "Original (EN)",
      translated: "Translated (VI)",
      tryNow: "Try PDF Translator Now",
      originalDoc: "Original English Document",
      translatedDoc: "Accurate Vietnamese Translation",
      feature1Title: "Geometric Coordinates Preserved",
      feature1Desc: "Accurately detects each text boundary and scales font automatically.",
      feature2Title: "Precise AI Translation",
      feature2Desc: "Preserves specialized technical, financial, and legal terminology.",
      feature3Title: "100% Watermark-Free",
      feature3Desc: "Download clean, presentation-ready files ready for printing or distribution.",
    },
    catalog: {
      badge: "Tool Ecosystem",
      toolCount: "integrated tools",
      title: "All PDF Processing Tools",
      desc: "Fast processing directly in your web browser or powered by specialized AI deep learning models.",
      searchPlaceholder: "Search tools (e.g., compress, merge, translate...)",
      categories: {
        all: "All tools",
        popular: "Most popular",
        ai_translate: "AI & Translation",
        organize: "Organize pages",
        convert: "Convert",
        edit: "Edit",
        security: "Security & Sign",
      },
      openTool: "Open tool",
      popularBadge: "Popular",
      browserMode: "In-Browser",
      aiCloud: "AI Cloud",
      notFound: "No tools found matching keyword",
      notFoundHint: "Try searching with different terms like 'compress', 'merge', 'sign' or clear filters.",
      viewAll: "View all tools",
    },
    security: {
      badge: "Security Standards & Tech",
      title: "Your Documents. Strictly Yours.",
      desc: "We believe everyday document processing shouldn't force users to compromise the privacy of sensitive and confidential files.",
      pillars: [
        {
          badge: "WebAssembly & Client-Side",
          title: "100% Local In-Browser Processing",
          description:
            "Tools like Merge PDF, Split, Compress, Reorder, and Sign execute entirely in your web browser using WebAssembly and client-side JavaScript.",
          points: [
            "Files are never uploaded to any remote server",
            "Instant execution speed without network latency bottlenecks",
            "Absolute confidentiality for legal contracts and financial data",
          ],
        },
        {
          badge: "TLS 1.3 Encryption",
          title: "Zero-Retention AI Architecture",
          description:
            "When using layout-preserving AI Translation or OCR, text is encrypted end-to-end solely for translation and deleted from memory immediately.",
          points: [
            "Zero permanent disk storage on cloud servers",
            "Your files and text are never used for AI model training",
            "Option to bring your own personal API keys (Gemini, OpenAI, Claude)",
          ],
        },
        {
          badge: "Unicode Typography",
          title: "Precision Vietnamese Typography",
          description:
            "Built with comprehensive typography support, preventing font errors, broken diacritics, and overflowing text boxes common with legacy tools.",
          points: [
            "Full 134-character Vietnamese Unicode diacritic support",
            "Pixel-precise auto-scaling algorithm for perfect bounding-box fit",
            "Strict preservation of table cell structures and digital stamps",
          ],
        },
      ],
    },
    faq: {
      title: "Frequently Asked Questions",
      desc: "Quick answers to the most common questions about HiPDF.",
      items: [
        {
          q: "What is HiPDF?",
          a: "HiPDF is an all-in-one online PDF platform featuring over 24+ tools from merge, split, rotate, compress, e-sign, and Word/Excel conversion to layout-preserving document translation. All tasks run directly in your browser with lightning speed.",
        },
        {
          q: "Is HiPDF safe and private?",
          a: "Completely safe with zero data retention. 100% of standard operations (merge, split, rotate, compress, sign, page numbers, password protection) execute locally in your browser's RAM (Client-side execution). Your files are never transmitted or stored on any server.",
        },
        {
          q: "Do I need to install any software to use HiPDF?",
          a: "No. All you need is a modern web browser (Chrome, Safari, Edge, Firefox) on your computer or smartphone to use HiPDF instantly without any installations or plugins.",
        },
        {
          q: "What features does HiPDF offer?",
          a: "HiPDF offers a comprehensive suite: Bilingual layout-preserving PDF translation, PDF compression up to 85%, interactive digital signatures, OCR text extraction, PDF to Word (.docx)/Excel (.csv)/Images (PNG/JPG), metadata editor, watermarks, and AES-256 encryption.",
        },
        {
          q: "Is HiPDF free or is account registration required?",
          a: "HiPDF is completely free and requires no account registration. It is a non-profit utility project designed for study, research, and work. No watermark is added to your output files, and there are zero intrusive ads.",
        },
        {
          q: "How does the layout-preserving PDF translator work?",
          a: "The tool analyzes geometric bounding boxes, font dimensions, tables, and images in the source PDF. After translating content, it dynamically recalculates font scaling to fit translated text back into the original coordinates without altering layout.",
        },
        {
          q: "Can I use HiPDF on iPhone and Android mobile devices?",
          a: "Yes, absolutely. HiPDF is fully responsive and touch-optimized for mobile browsers including Safari (iOS) and Chrome (Android). You can view, sign, or translate documents anytime on your smartphone.",
        },
      ],
    },
    footer: {
      tagline: "Free online PDF tools.",
      contact: "Contact",
      terms: "Terms",
      privacy: "Privacy",
      copyright: "© 2026 Hi PDF. All rights reserved.",
      foundedBy: "Founded and developed by",
      ecosystem: "A small project belonging to",
    },
    quickSearch: {
      placeholder: "Search PDF tools (with or without accents)...",
      notFound: "No tools found matching keyword",
      clearQuery: "Clear keyword",
      closeEsc: "Close search (ESC)",
    },
  },
};

// English translations dictionary for tool items
export const TOOL_TRANSLATIONS_EN: Record<string, { name: string; shortDescription: string }> = {
  "translate-pdf": {
    name: "Translate PDF (Preserve Layout)",
    shortDescription: "Preserve layout, tables, graphics, and accurately replace text with font auto-fit",
  },
  "bilingual-pdf-translator": {
    name: "Bilingual PDF Translator",
    shortDescription: "Translate PDF into other languages preserving 100% original layout and formatting",
  },
  "merge-pdf": {
    name: "Merge PDF",
    shortDescription: "Combine multiple PDF files into a single unified document in desired order",
  },
  "split-pdf": {
    name: "Split PDF",
    shortDescription: "Split PDF by page ranges or extract individual pages into separate files",
  },
  "rotate-pdf": {
    name: "Rotate PDF Pages",
    shortDescription: "Rotate all or selected PDF pages by 90°, 180°, or 270°",
  },
  "extract-delete-pages": {
    name: "Delete & Extract Pages",
    shortDescription: "Visually select page thumbnails to remove or extract pages into a new document",
  },
  "delete-pages": {
    name: "Delete Pages",
    shortDescription: "Visually select and remove unnecessary pages from your PDF",
  },
  "reorder-pages": {
    name: "Reorder Pages",
    shortDescription: "Drag and drop page thumbnails to rearrange document page sequence",
  },
  "page-numbers": {
    name: "Page Numbers",
    shortDescription: "Add automated page numbers with customizable header/footer positioning",
  },
  "watermark-pdf": {
    name: "Watermark PDF",
    shortDescription: "Add custom text or copyright logo watermarks with opacity and rotation",
  },
  "pdf-metadata": {
    name: "View & Edit Metadata",
    shortDescription: "Inspect and modify Title, Author, Subject, Keywords, or strip metadata",
  },
  "protect-pdf": {
    name: "Protect with Password",
    shortDescription: "Encrypt and secure your document with custom open passwords",
  },
  "unlock-pdf": {
    name: "Unlock PDF",
    shortDescription: "Remove password protection and print restrictions with authorized password",
  },
  "sign-pdf": {
    name: "Sign PDF",
    shortDescription: "Draw handwritten signatures or upload transparent digital stamps",
  },
  "image-to-pdf": {
    name: "Images to PDF",
    shortDescription: "Convert JPG, PNG, and WebP images into high-quality PDF files",
  },
  "office-to-pdf": {
    name: "Office to PDF (Word/Excel/PPT)",
    shortDescription: "Convert Word, Excel, and PowerPoint documents to professional PDFs",
  },
  "pdf-to-image": {
    name: "PDF to Images",
    shortDescription: "Extract PDF pages into crisp high-resolution PNG or JPG images",
  },
  "extract-text": {
    name: "Extract Text",
    shortDescription: "Extract all text content from PDF pages into plain text TXT files",
  },
  "pdf-to-word": {
    name: "PDF to Word (DOCX)",
    shortDescription: "Convert PDF documents to editable Microsoft Word files with preserved layouts",
  },
  "flatten-pdf": {
    name: "Flatten PDF",
    shortDescription: "Lock all interactive form fields, checkboxes, and annotations permanently into page content",
  },
  "compress-pdf": {
    name: "Compress PDF",
    shortDescription: "Optimize embedded images and data streams to reduce file size without losing clarity",
  },
  "ocr-pdf": {
    name: "OCR Text Recognition",
    shortDescription: "Generate searchable, selectable text layers from scanned documents and images",
  },
  "view-pdf": {
    name: "PDF Viewer & Inspector",
    shortDescription: "Smooth zoomable document reader with thumbnails, rotation, and printing",
  },
  "ai-summary": {
    name: "AI Document Summary",
    shortDescription: "Summarize key findings, chapters, or whole documents using advanced AI",
  },
  "ai-ask": {
    name: "Chat with PDF (Page-Citations)",
    shortDescription: "Ask questions about document content and receive accurate answers with page citations",
  },
};

