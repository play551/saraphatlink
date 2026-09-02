import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    nameTh: 'ปัญญาประดิษฐ์',
    icon: 'sparkles',
    color: 'from-violet-500 to-fuchsia-500',
    description: 'แชตบอต, สร้างภาพ, เขียนโค้ด และเครื่องมือ AI ทุกรูปแบบ',
    subCategories: [
      { id: 'ai-chat', name: 'Chatbots', nameTh: 'แชตบอต' },
      { id: 'ai-image', name: 'Image Generation', nameTh: 'สร้างภาพ' },
      { id: 'ai-code', name: 'Coding Assistant', nameTh: 'ผู้ช่วยเขียนโค้ด' },
      { id: 'ai-video', name: 'Video & Audio', nameTh: 'วิดีโอและเสียง' },
      { id: 'ai-writing', name: 'Writing', nameTh: 'งานเขียน' },
    ],
  },
  {
    id: 'dev',
    name: 'Development',
    nameTh: 'พัฒนาซอฟต์แวร์',
    icon: 'code',
    color: 'from-sky-500 to-cyan-500',
    description: 'โฮสต์โค้ด, เฟรมเวิร์ก, API และเครื่องมือนักพัฒนา',
    subCategories: [
      { id: 'dev-hosting', name: 'Code Hosting', nameTh: 'โฮสต์โค้ด' },
      { id: 'dev-deploy', name: 'Deployment', nameTh: 'ดีพลอย' },
      { id: 'dev-docs', name: 'Documentation', nameTh: 'เอกสาร' },
      { id: 'dev-tools', name: 'Dev Tools', nameTh: 'เครื่องมือ' },
      { id: 'dev-community', name: 'Community', nameTh: 'ชุมชน' },
    ],
  },
  {
    id: 'design',
    name: 'Design & Creative',
    nameTh: 'ออกแบบและงานสร้างสรรค์',
    icon: 'palette',
    color: 'from-pink-500 to-rose-500',
    description: 'UI/UX, กราฟิก, ไอคอน, ฟอนต์ และแรงบันดาลใจ',
    subCategories: [
      { id: 'design-ui', name: 'UI/UX Tools', nameTh: 'เครื่องมือ UI/UX' },
      { id: 'design-graphic', name: 'Graphic Design', nameTh: 'กราฟิก' },
      { id: 'design-asset', name: 'Assets & Icons', nameTh: 'ไอคอนและทรัพยากร' },
      { id: 'design-inspire', name: 'Inspiration', nameTh: 'แรงบันดาลใจ' },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity',
    nameTh: 'เพิ่มประสิทธิภาพ',
    icon: 'bolt',
    color: 'from-amber-500 to-orange-500',
    description: 'จดบันทึก, จัดการงาน, ปฏิทิน และการทำงานร่วมกัน',
    subCategories: [
      { id: 'prod-notes', name: 'Notes', nameTh: 'จดบันทึก' },
      { id: 'prod-tasks', name: 'Task Management', nameTh: 'จัดการงาน' },
      { id: 'prod-collab', name: 'Collaboration', nameTh: 'ทำงานร่วมกัน' },
      { id: 'prod-storage', name: 'Cloud Storage', nameTh: 'พื้นที่เก็บข้อมูล' },
    ],
  },
  {
    id: 'learning',
    name: 'Learning & Education',
    nameTh: 'การเรียนรู้',
    icon: 'academic',
    color: 'from-emerald-500 to-teal-500',
    description: 'คอร์สออนไลน์, บทเรียน, ภาษา และแหล่งความรู้',
    subCategories: [
      { id: 'learn-course', name: 'Online Courses', nameTh: 'คอร์สออนไลน์' },
      { id: 'learn-code', name: 'Learn to Code', nameTh: 'เรียนเขียนโค้ด' },
      { id: 'learn-lang', name: 'Languages', nameTh: 'ภาษา' },
      { id: 'learn-ref', name: 'Reference', nameTh: 'อ้างอิง' },
    ],
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    nameTh: 'สื่อและความบันเทิง',
    icon: 'play',
    color: 'from-red-500 to-orange-600',
    description: 'วิดีโอ, เพลง, สตรีมมิ่ง และพอดแคสต์',
    subCategories: [
      { id: 'media-video', name: 'Video', nameTh: 'วิดีโอ' },
      { id: 'media-music', name: 'Music', nameTh: 'เพลง' },
      { id: 'media-stream', name: 'Streaming', nameTh: 'สตรีมมิ่ง' },
    ],
  },
  {
    id: 'business',
    name: 'Business & Finance',
    nameTh: 'ธุรกิจและการเงิน',
    icon: 'chart',
    color: 'from-indigo-500 to-blue-600',
    description: 'อีคอมเมิร์ซ, การตลาด, การเงิน และเครื่องมือธุรกิจ',
    subCategories: [
      { id: 'biz-ecom', name: 'E-Commerce', nameTh: 'อีคอมเมิร์ซ' },
      { id: 'biz-marketing', name: 'Marketing', nameTh: 'การตลาด' },
      { id: 'biz-finance', name: 'Finance', nameTh: 'การเงิน' },
      { id: 'biz-hr', name: 'Freelance & Jobs', nameTh: 'งานและฟรีแลนซ์' },
    ],
  },
  {
    id: 'social',
    name: 'Social & Community',
    nameTh: 'โซเชียลและชุมชน',
    icon: 'users',
    color: 'from-blue-500 to-sky-400',
    description: 'โซเชียลมีเดีย, ฟอรัม และเครือข่ายมืออาชีพ',
    subCategories: [
      { id: 'social-network', name: 'Social Networks', nameTh: 'โซเชียลเน็ตเวิร์ก' },
      { id: 'social-forum', name: 'Forums', nameTh: 'ฟอรัม' },
      { id: 'social-pro', name: 'Professional', nameTh: 'เครือข่ายมืออาชีพ' },
    ],
  },
  {
    id: 'utility',
    name: 'Utilities & Tools',
    nameTh: 'เครื่องมืออเนกประสงค์',
    icon: 'wrench',
    color: 'from-slate-500 to-slate-700',
    description: 'แปลงไฟล์, ย่อลิงก์, ความปลอดภัย และเครื่องมือประจำวัน',
    subCategories: [
      { id: 'util-convert', name: 'Converters', nameTh: 'แปลงไฟล์' },
      { id: 'util-security', name: 'Security & Privacy', nameTh: 'ความปลอดภัย' },
      { id: 'util-web', name: 'Web Utilities', nameTh: 'เครื่องมือเว็บ' },
    ],
  },
];

/* ── Helper functions ─────────────────────────────────────────── */

export const getCategoryById = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);

export const getSubCategoryById = (
  categoryId: string,
  subId: string
): { id: string; name: string; nameTh: string } | undefined =>
  getCategoryById(categoryId)?.subCategories.find((s) => s.id === subId);

export const getCategoryColor = (id: string): string =>
  getCategoryById(id)?.color ?? 'from-slate-500 to-slate-700';

export const getCategoryName = (id: string, th = true): string => {
  const c = getCategoryById(id);
  if (!c) return 'อื่น ๆ';
  return th ? c.nameTh : c.name;
};
