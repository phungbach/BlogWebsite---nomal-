import { Post, Comment } from '../types';

export const INITIAL_TECH_POSTS: Post[] = [
  {
    id: 'tech-post-1',
    slug: 'kien-truc-mixture-of-experts-moe-toi-uu-inference-llm',
    title: 'Kiến Trúc Mixture-of-Experts (MoE) & Kỹ Thuật Tối Ưu Inference Cho LLM Siêu Lớn',
    subtitle: 'Phân tích cơ chế Gating Network, Sparsity Activation và kỹ thuật FlashAttention-3 trong hệ thống phục vụ mô hình hàng trăm tỷ tham số.',
    excerpt: 'Làm thế nào để phục vụ một mô hình 128B tham số với chi phí tính toán chỉ tương đương 14B tham số hoạt động? Đi sâu vào toán học Gating Network, Token Routing và cơ chế PagedAttention trên cụm GPU H100.',
    category: 'AI & Machine Learning',
    author: {
      name: 'Nguyễn Thành Long',
      role: 'Staff AI Infrastructure Engineer @ DeepScale AI',
      bio: 'Chuyên nghiên cứu hệ thống tính toán phân tán cho LLM, kernel CUDA và tăng tốc suy luận mô hình ngôn ngữ lớn.',
      github: 'long-neural'
    },
    publishedAt: '03/10/2026',
    updatedAt: '03/10/2026',
    readTimeMinutes: 8,
    claps: 542,
    views: 3820,
    featured: true,
    isPinned: true,
    status: 'published',
    tags: ['AI', 'LLM', 'MoE', 'CUDA', 'PyTorch', 'vLLM'],
    techStack: ['PyTorch 2.4', 'Triton', 'vLLM', 'CUDA 12.6', 'FlashAttention-3'],
    coverImage: '/src/assets/images/tech_neural_network_core_1791093394796.jpg',
    coverImageCaption: 'Hình 1: Cấu trúc ma trận định tuyến Token Routing đa lõi trên vi xử lý bán dẫn chuyên dụng Tensor Core.',
    content: `Trong bối cảnh các mô hình ngôn ngữ lớn (LLM) ngày càng phình to về số lượng trọng số (Dense Models), chi phí suy luận (Inference Latency & VRAM footprint) trở thành rào cản nghiêm trọng nhất đối với hạ tầng sản phẩm.

Kiến trúc **Mixture-of-Experts (MoE)** đã giải quyết bài toán nan giải này bằng nguyên lý kích hoạt thưa (Sparse Activation): chỉ một tập hợp con nhỏ các chuyên gia (Experts) được kích hoạt cho mỗi token đầu vào.

\`\`\`python
import torch
import torch.nn as nn
import torch.nn.functional as F

class TopKGatingNetwork(nn.Module):
    """
    Gating Router tính toán softmax phân phối trọng số cho Top-K Experts
    """
    def __init__(self, d_model: int, num_experts: int, top_k: int = 2):
        super().__init__()
        self.top_k = top_k
        self.gate = nn.Linear(d_model, num_experts, bias=False)

    def forward(self, x: torch.Tensor):
        # logits shape: [batch_size, seq_len, num_experts]
        logits = self.gate(x)
        weights, indices = torch.topk(F.softmax(logits, dim=-1), self.top_k)
        
        # Chuẩn hoá lại trọng số để tổng bằng 1.0
        normalized_weights = weights / weights.sum(dim=-1, keepdim=True)
        return normalized_weights, indices
\`\`\`

### 1. Cơ chế Token Routing & Cân bằng Tải (Load Balancing)

Thách thức lớn nhất trong MoE không nằm ở tầng tính toán Feed-Forward Network (FFN), mà nằm ở hiện tượng **Expert Bottleneck**: khi một số Expert thông dụng nhận hầu hết lưu lượng token, trong khi các Expert khác bị "bỏ đói" (Starvation).

Để giải quyết vấn đề này, hàm mất mát cân bằng tải phụ trợ (Auxiliary Load Balancing Loss) được thêm vào trong quá trình huấn luyện:

$$\\mathcal{L}_{aux} = \\alpha \\cdot N \\sum_{i=1}^N f_i \\cdot P_i$$

Trong đó $f_i$ là tỷ lệ token được gán cho Expert $i$, và $P_i$ là xác suất trung bình của Router dành cho Expert đó. Khi nhân tử này đạt cực tiểu, lưu lượng token được phân bổ đều khắp các node GPU.

### 2. Kỹ Thuật PagedAttention & Triton Kernel

Khi triển khai trên cụm máy chủ 8x H100 SXM5 qua NVLink, chúng tôi áp dụng kỹ thuật **PagedAttention v2** phối hợp cùng **Triton Custom Kernel**. Nhờ cơ chế này, bộ nhớ KV Cache không còn bị phân mảnh (Internal Fragmentation), cho phép tăng Throughput hệ thống lên tới **3.8 lần** so với kiến trúc Dense tương đương.

> "Kiến trúc MoE không chỉ giảm tiêu thụ điện năng trên mỗi token suy luận, mà còn mở ra kỷ nguyên cá nhân hóa tri thức chuyên ngành theo thời gian thực."`
  },
  {
    id: 'tech-post-2',
    slug: 'thiet-ke-he-thong-phan-tan-trieu-qps-voi-rust-va-raft',
    title: 'Thiết Kế Hệ Thống Phân Tán Triệu QPS Với Rust Và Đồng Thuận Raft',
    subtitle: 'Kỹ thuật zero-copy networking, epoll event loops và state machine replication đạt độ trễ p99 dưới 1.2ms.',
    excerpt: 'Hành trình xây dựng KV Store phân tán đạt 1.5 triệu requests/giây. Chi tiết cách chúng tôi sử dụng Rust async runtime Tokio, io_uring và giải thuật Raft consensus để đảm bảo Strong Consistency.',
    category: 'Distributed Systems',
    author: {
      name: 'Trần Hoàng Đức',
      role: 'Principal Systems Architect @ KubeMatrix',
      bio: '12 năm kinh nghiệm thiết kế Storage Engine phân tán, High-performance Networking và hệ thống tài chính độ trễ thấp.',
      github: 'duc-sys'
    },
    publishedAt: '01/10/2026',
    updatedAt: '02/10/2026',
    readTimeMinutes: 7,
    claps: 418,
    views: 2950,
    featured: false,
    isPinned: true,
    status: 'published',
    tags: ['Rust', 'Raft', 'DistributedSystems', 'io_uring', 'Performance'],
    techStack: ['Rust 1.81', 'Tokio', 'io_uring', 'gRPC', 'RocksDB'],
    coverImage: '/src/assets/images/tech_cloud_cluster_server_1791093416133.jpg',
    coverImageCaption: 'Hình 2: Cụm rack máy chủ phiến mỏng phân bố đa vùng khả dụng (Multi-AZ) phục vụ replication Raft quorum.',
    content: `Trong các hệ thống phân tán cấp độ Internet, việc duy trì tính nhất quán mạnh mẽ (Linearizable Consistency) song song với lưu lượng hàng triệu truy vấn mỗi giây (Million QPS) luôn là bài toán khó bậc nhất của kỹ sư hệ thống.

Ngôn ngữ **Rust** với mô hình quyền sở hữu bộ nhớ (Ownership & Borrowing) cùng cơ chế không cần Garbage Collection mang lại lợi thế vượt trội về độ ổn định độ trễ đuôi (p99/p99.9 latency).

\`\`\`rust
// Khởi tạo kênh giao tiếp bất đồng bộ qua io_uring với zero memory copy
use tokio::net::TcpListener;
use tokio::sync::mpsc;

pub struct RaftNode {
    node_id: u64,
    current_term: u64,
    voted_for: Option<u64>,
    log: Vec<LogEntry>,
    commit_index: usize,
}

impl RaftNode {
    pub async fn handle_append_entries(
        &mut self,
        term: u64,
        leader_id: u64,
        entries: Vec<LogEntry>,
    ) -> Result<bool, RaftError> {
        if term < self.current_term {
            return Ok(false);
        }
        // Xác thực log và append vào đĩa bất đồng bộ
        self.persist_log_entries(&entries).await?;
        Ok(true)
    }
}
\`\`\`

### Triệt Tiêu Context Switch Bằng io_uring

Trước đây, kiến trúc \`epoll\` truyền thống đòi hỏi mỗi I/O operation phải chuyển đổi qua lại giữa User Space và Kernel Space (Syscall Context Switch). Với Linux \`io_uring\`, chúng tôi thiết lập hai ring buffer chia sẻ giữa ứng dụng và nhân hệ điều hành (Submission Queue và Completion Queue). 

Kết quả đo đạc thực tế:
- CPU Context switches giảm **72%**.
- Tỉ lệ cache miss L1/L2 giảm **38%**.
- Độ trễ p99 đạt mốc **1.14ms** tại ngưỡng tải 1.2M QPS trên 5 node cụm.`
  },
  {
    id: 'tech-post-3',
    slug: 'zero-trust-mesh-va-bao-mat-ebpf-kubernetes-production',
    title: 'Zero-Trust Mesh & Phòng Thủ Trực Tiếp Tại Kernel Bằng eBPF Trong Kubernetes',
    subtitle: 'Thay thế iptables lỗi thời bằng Cilium eBPF: Cách ngăn chặn tấn công mạo danh IP và quan sát mạng thời gian thực.',
    excerpt: 'Khi iptables đạt giới hạn 50,000 rules, cụm K8s bắt đầu nghẽn cổ chai mạng. Tìm hiểu cách Cilium sử dụng Extended Berkeley Packet Filter (eBPF) để đạt tốc độ xử lý gói tin wire-speed và bảo mật mTLS gốc.',
    category: 'DevSecOps & Cloud',
    author: {
      name: 'Lê Minh Quân',
      role: 'Lead Cloud Security Architect @ CyberShield VN',
      bio: 'Chuyên gia bảo mật hạ tầng Cloud Native, Kubernetes Security Specialist (CKS) và đóng góp cho dự án Cilium OSS.',
      github: 'quan-cloudsec'
    },
    publishedAt: '28/09/2026',
    updatedAt: '29/09/2026',
    readTimeMinutes: 6,
    claps: 367,
    views: 2410,
    featured: false,
    isPinned: false,
    status: 'published',
    tags: ['Kubernetes', 'eBPF', 'Cilium', 'Security', 'ZeroTrust'],
    techStack: ['Kubernetes 1.31', 'Cilium eBPF', 'SPIFFE/SPIRE', 'WireGuard'],
    coverImage: '/src/assets/images/tech_cyber_security_shield_1791093432890.jpg',
    coverImageCaption: 'Hình 3: Ma trận phân tích luồng gói tin tại tầng Linux Socket Layer thông qua chương trình eBPF bytecode.',
    content: `Trong kiến trúc microservices hiện đại, giả định rằng "mạng nội bộ an toàn" đã hoàn toàn sụp đổ. Bất kỳ pod nào bị chiếm đoạt đều có thể trở thành bàn đạp để quét cổng (port scan) và di chuyển ngang (lateral movement).

Mô hình **Zero-Trust** đòi hỏi:
1. Không bao giờ tin tưởng, luôn luôn xác thực (Never Trust, Always Verify).
2. Mã hóa toàn diện mọi đường truyền (Strict mTLS).
3. Nguyên tắc đặc quyền tối thiểu (Least Privilege Access).

### eBPF Thay Đổi Cuộc Chơi Như Thế Nào?

Trước đây, Service Mesh phải inject một Envoy sidecar proxy vào mỗi pod. Điều này gây hao tổn bộ nhớ khổng lồ và cộng thêm 2-4ms độ trễ cho mỗi network hop.

Với **eBPF (Extended Berkeley Packet Filter)**, logic định tuyến và kiểm tra chính sách an ninh mạng được thực thi ngay trong Linux Kernel:

\`\`\`bash
# Giám sát packet drop và vi phạm network policy bằng Cilium CLI
cilium monitor --type drop --related

# Kiểm tra eBPF map cho endpoint table
bpftool map dump name cilium_ep4_map
\`\`\`

Nhờ gắn trực tiếp hook vào tầng Socket Layer (\`sock_ops\`), các gói tin giữa hai pod trên cùng một node vật lý được bypass hoàn toàn qua TCP/IP stack thông thường, đạt tốc độ tiệm cận với IPC (Inter-Process Communication).`
  },
  {
    id: 'tech-post-4',
    slug: 'react-19-server-components-island-architecture-toi-uu-web',
    title: 'React 19 Server Components & Island Architecture: Kỷ Nguyên Web Không Trọng Lượng',
    subtitle: 'Phân tích sâu cơ chế Streaming SSR, React Compiler và kiến trúc Partial Hydration mang lại Zero-bundle cost.',
    excerpt: 'Tìm hiểu tại sao Server Components là bước ngoặt lớn nhất của React trong 10 năm qua. Cách loại bỏ 80% dung lượng JavaScript client mà vẫn giữ trọn vẹn trải nghiệm ứng dụng đơn trang (SPA).',
    category: 'Software Architecture',
    author: {
      name: 'Vũ Đăng Khoa',
      role: 'Staff Frontend Engineer @ TechFrontier Labs',
      bio: 'Tác giả sách kỹ thuật web, diễn giả cộng đồng Web Performance và chuyên gia tối ưu hóa trải nghiệm người dùng.',
      github: 'khoa-web'
    },
    publishedAt: '25/09/2026',
    updatedAt: '26/09/2026',
    readTimeMinutes: 5,
    claps: 298,
    views: 2120,
    featured: false,
    isPinned: false,
    status: 'published',
    tags: ['React', 'NextJS', 'Frontend', 'WebPerf', 'JavaScript'],
    techStack: ['React 19', 'React Compiler', 'Vite', 'TypeScript 5.6'],
    coverImage: '/src/assets/images/tech_neural_network_core_1791093394796.jpg',
    coverImageCaption: 'Hình 4: Sơ đồ luồng phân chia ranh giới Server Components và Client Islands tương tác.',
    content: `Trong suốt một thập kỷ qua, các ứng dụng React client-side đã ngày càng phình to (Client Bloat). Việc tải về hàng megabyte bundle JavaScript chỉ để hiển thị giao diện bài viết tĩnh là một sự lãng phí tài nguyên và làm suy giảm nghiêm trọng chỉ số Core Web Vitals (INP, LCP).

**React 19** cùng kiến trúc Server Components (RSC) mang lại lời giải triệt để:

### Nguyên lý Server-First Execution

Các component không có tính tương tác (như Layout, Bài viết, Header, Footer) sẽ được render hoàn toàn tại server và trả về client dưới dạng **React Virtual DOM Wire Format**, không cần gửi kèm code mã nguồn JS.

\`\`\`tsx
// Server Component - 0 byte JavaScript gửi về Client
import db from '@/db';

export async function ArticleFeed({ categoryId }: { categoryId: string }) {
  // Trực tiếp query CSDL ngay trong component mà không sợ lộ credentials
  const articles = await db.query('SELECT * FROM articles WHERE cat_id = ?', [categoryId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((art) => (
        <article key={art.id} className="p-4 border border-slate-800 rounded-lg">
          <h2 className="text-xl font-bold">{art.title}</h2>
          <p className="text-slate-400">{art.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
\`\`\`

Chỉ những thành phần cần tương tác (như nút Like, ô Bình luận, Search modal) mới được đánh dấu \`'use client'\` để hydrate. Trình duyệt tải trang tức thì mà không bị giật lag.`
  },
  {
    id: 'tech-post-5',
    slug: 'ky-nguyen-ban-dan-2nm-transistor-gaa-va-gioi-han-vat-ly',
    title: 'Kỷ Nguyên Bán Dẫn 2nm: Transistor GAAFET & Cuộc Chiến Vượt Giới Hạn Vật Lý',
    subtitle: 'Giải phẫu công nghệ Nanosheet GAA, Thấu kính quang khắc High-NA EUV và kỹ thuật cung cấp nguồn mặt sau (Backside Power Delivery).',
    excerpt: 'Khi công nghệ FinFET chạm ngưỡng rò rỉ dòng điện lượng tử ở tiến trình 3nm, ngành công nghiệp bán dẫn bắt buộc phải chuyển dịch sang GAAFET (Gate-All-Around). Đánh giá bước đột phá công nghệ của TSMC, Intel và Samsung.',
    category: 'Semiconductors & Hardware',
    author: {
      name: 'Phạm Quang Huy',
      role: 'VLSI Chip Design Specialist & Tech Columnist',
      bio: 'Chuyên nghiên cứu kiến trúc bộ vi xử lý silicon, công nghệ in thạch bản và chuỗi cung ứng bán dẫn toàn cầu.',
      github: 'huy-silicon'
    },
    publishedAt: '20/09/2026',
    updatedAt: '21/09/2026',
    readTimeMinutes: 7,
    claps: 325,
    views: 1980,
    featured: false,
    isPinned: false,
    status: 'published',
    tags: ['Semiconductor', 'Hardware', 'Chips', 'TSMC', 'Intel'],
    techStack: ['2nm GAAFET', 'High-NA EUV', 'BSPDN', 'Silicon Photonics'],
    coverImage: '/src/assets/images/tech_cloud_cluster_server_1791093416133.jpg',
    coverImageCaption: 'Hình 5: Mặt cắt hiển vi điện tử của cấu trúc 4 tấm Nanosheet xếp chồng trong transistor Gate-All-Around.',
    content: `Định luật Moore đã nhiều lần bị tuyên bố là đã chết, nhưng sự sáng tạo của các kỹ sư bán dẫn liên tục kéo dài tuổi thọ của nó. Tại tiến trình dưới 3 nanomet, hiện tượng hiệu ứng kênh ngắn (Short-Channel Effects) và rò rỉ cơ học lượng tử (Quantum Tunneling) khiến cấu trúc vây 3D FinFET không còn khả năng kiểm soát dòng điện đóng/ngắt.

### Bước Chuyển Sang Gate-All-Around (GAAFET)

Thay vì một vây silicon thẳng đứng được bao bọc ở 3 mặt như FinFET, cấu trúc GAA sử dụng các tấm nano dát mỏng (Nanosheets) xếp chồng theo chiều dọc, với cổng điện cực (Gate) bao bọc kín toàn bộ 4 mặt chu vi của kênh dẫn.

Nhờ diện tích tiếp xúc cổng tối đa:
- Khả năng kiểm soát dòng rò tăng **35%**.
- Điện áp hoạt động danh định giảm từ 0.75V xuống **0.65V**.
- Hiệu suất năng lượng (Performance per Watt) cải thiện **20-25%** so với nút 3nm thế hệ đầu.

### Backside Power Delivery Network (BSPDN)

Đột phá thứ hai tại tiến trình 2nm là chuyển toàn bộ lưới dây phân phối điện áp (Power Rails) ra mặt sau của tấm wafer silicon, tách biệt hoàn toàn khỏi các đường dây tín hiệu (Signal Interconnects) ở mặt trước. Điều này triệt tiêu sụt áp (IR Drop) và giúp các bóng bán dẫn xung nhịp cao hoạt động mát hơn đáng kể.`
  }
];

export const INITIAL_TECH_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    postId: 'tech-post-1',
    authorName: 'Hoàng Minh Tuấn',
    authorRole: 'Senior ML Engineer @ Zalo AI',
    content: 'Bài viết phân tích rất chuẩn về bài toán Token Routing. Thực tế khi huấn luyện MoE, nếu không tune kỹ auxiliary loss weight thì 2 Expert đầu sẽ ôm 70% token, dẫn đến OOM cục bộ trên rank 0.',
    createdAt: 'Hôm qua lúc 14:32',
    claps: 24,
    status: 'approved'
  },
  {
    id: 'comm-2',
    postId: 'tech-post-1',
    authorName: 'Đặng Tuấn Anh',
    authorRole: 'DevOps Lead @ FPT Software',
    content: 'Có thể chia sẻ thêm về throughput benchmark khi dùng vLLM với FlashAttention-3 trên H100 so với A100 được không tác giả? Rất mong chờ bài viết tiếp theo!',
    createdAt: 'Hôm qua lúc 18:05',
    claps: 11,
    status: 'approved'
  },
  {
    id: 'comm-3',
    postId: 'tech-post-2',
    authorName: 'Vũ Quốc Khánh',
    authorRole: 'Backend Engineer @ VNG Corp',
    content: 'io_uring kết hợp với Rust quả thực là vũ khí tối thượng cho High-throughput network server. Điểm ăn tiền nhất là triệt tiêu hoàn toàn copy buffer và syscall overhead.',
    createdAt: '2 ngày trước',
    claps: 18,
    status: 'approved'
  }
];
