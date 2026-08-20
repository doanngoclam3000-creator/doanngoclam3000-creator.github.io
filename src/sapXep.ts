// Sap xep bai viet: bai duoc ghim len dau, sau do den bai moi nhat
export function sapXepBai<T extends { data: { ghim?: boolean; ngayDang: Date } }>(ds: T[]): T[] {
  return [...ds].sort((a, b) => {
    const ghimA = a.data.ghim ? 1 : 0;
    const ghimB = b.data.ghim ? 1 : 0;
    if (ghimA !== ghimB) return ghimB - ghimA;
    return +b.data.ngayDang - +a.data.ngayDang;
  });
}
