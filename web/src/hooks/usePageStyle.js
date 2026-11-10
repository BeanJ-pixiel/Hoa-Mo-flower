import { useEffect } from "react";

// CSS mỗi trang có selector toàn cục (*, body) và trùng tên class,
// nên chỉ chèn vào <head> khi mở trang và gỡ ra khi rời trang.
export default function usePageStyle(css, title) {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
    if (title) document.title = title;
    return () => el.remove();
  }, [css, title]);
}
