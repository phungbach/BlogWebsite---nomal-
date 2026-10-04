import React from 'react';
import { Terminal, Shield, Cpu, Code2 } from 'lucide-react';

interface TechFooterProps {
  onSelectCategory: (category: string | null) => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
}

export const TechFooter: React.FC<TechFooterProps> = ({
  onSelectCategory,
  onOpenAdmin,
  onGoHome,
}) => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#0B0F17] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
        
        {/* Brand & Manifesto */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <button
              onClick={onGoHome}
              className="text-lg font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer text-left font-mono"
            >
              NEXUS // TECH BLOG
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
            Chuyên trang phân tích kiến trúc phần mềm, nghiên cứu hệ thống phân tán, hạ tầng AI suy luận và các công nghệ bán dẫn tiên tiến.
          </p>
          <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kỹ thuật lõi · Mã nguồn mở · Tri thức hệ thống</span>
          </div>
        </div>

        {/* Chuyên mục */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-semibold uppercase text-slate-200 text-xs mb-3 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chuyên Mục Kỹ Thuật</span>
          </h4>
          <ul className="space-y-1.5 text-xs">
            {[
              { label: 'Trí tuệ Nhân tạo & LLMs', val: 'AI & Machine Learning' },
              { label: 'Hệ thống Phân tán & Storage', val: 'Distributed Systems' },
              { label: 'An ninh Mạng & eBPF', val: 'DevSecOps & Cloud' },
              { label: 'Kiến trúc Phần mềm Hiện đại', val: 'Software Architecture' },
              { label: 'Bán dẫn & Phần cứng 2nm', val: 'Semiconductors & Hardware' },
            ].map((d) => (
              <li key={d.val}>
                <button
                  onClick={() => onSelectCategory(d.val)}
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {d.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quản trị & Điều khiển */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-semibold uppercase text-slate-200 text-xs mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cổng Quản Trị Hệ Thống</span>
          </h4>
          <p className="text-xs font-sans text-slate-400 leading-relaxed">
            Khu vực dành cho quản trị viên và biên tập viên đăng tải bài viết mới và kiểm soát kho bài viết cũ.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 rounded text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Truy Cập Web Admin →</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <div>
          © {new Date().getFullYear()} NEXUS TECH. Nền tảng chia sẻ tri thức kỹ thuật độc lập.
        </div>
        <div className="flex items-center gap-3">
          <span>React 19</span>
          <span>·</span>
          <span>Tailwind v4</span>
          <span>·</span>
          <span>Zero-Telemetry</span>
        </div>
      </div>
    </footer>
  );
};
