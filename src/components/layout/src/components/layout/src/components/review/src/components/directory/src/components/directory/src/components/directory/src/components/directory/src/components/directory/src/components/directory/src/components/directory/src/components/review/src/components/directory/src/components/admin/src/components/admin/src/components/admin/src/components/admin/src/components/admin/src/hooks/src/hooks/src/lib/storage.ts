// จัดการข้อมูล LocalStorage สำหรับระบบ Bookmark และ Visit Count
export const Bookmarks = {
  get: () => JSON.parse(localStorage.getItem('bookmarks') || '[]') as string[],
  toggle: (id: string) => {
    const current = Bookmarks.get();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem('bookmarks', JSON.stringify(next));
    return next;
  },
};

export const VisitStore = {
  record: (id: string) => {
    const visits = JSON.parse(localStorage.getItem('visits') || '{}');
    visits[id] = (visits[id] || 0) + 1;
    localStorage.setItem('visits', JSON.stringify(visits));
  },
  countOf: (id: string): number => {
    const visits = JSON.parse(localStorage.getItem('visits') || '{}');
    return visits[id] || 0;
  },
};
