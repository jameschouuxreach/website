// ===== 假資料：作品集 =====
// 想放圖片時，把 image 設成圖片路徑，例如 image: "images/work-1.jpg"
// 若 image 留空字串，會自動顯示原本的色塊 + 縮寫。
const projects = [
  {
    name: "Fintech 行動銀行 App",
    tag: "UX / UI · 2025",
    desc: "重新設計轉帳與帳戶總覽流程，任務完成率提升 32%。",
    image: "images/image1.jpg",
    color: "#4f46e5",
    initials: "FB",
  },
  {
    name: "電商結帳流程優化",
    tag: "Product Design · 2024",
    desc: "簡化三步結帳，將購物車放棄率降低 18%。",
    image: "images/image2.jpg",
    color: "#0ea5e9",
    initials: "EC",
  },
  {
    name: "SaaS 數據儀表板",
    tag: "設計系統 · 2024",
    desc: "建立可擴充的元件庫，統一 40+ 頁面的視覺語言。",
    image: "images/image3.jpg",
    color: "#059669",
    initials: "DB",
  },
  {
    name: "健康追蹤穿戴介面",
    tag: "UX 研究 · 2023",
    desc: "以使用者訪談為基礎，設計低干擾的每日健康提示。",
    image: "images/image4.jpg",
    color: "#ea580c",
    initials: "HT",
  },
  {
    name: "線上課程學習平台",
    tag: "UX / UI · 2023",
    desc: "重構課程導覽與進度追蹤，學習完成率提升 25%。",
    image: "",
    color: "#db2777",
    initials: "LP",
  },
  {
    name: "旅遊訂房品牌官網",
    tag: "Web Design · 2022",
    desc: "從 0 到 1 打造品牌識別與響應式官網。",
    image: "",
    color: "#7c3aed",
    initials: "TR",
  },
];

// ===== 渲染作品卡片 =====
function renderProjects() {
  const grid = document.getElementById("workGrid");
  if (!grid) return;
  grid.innerHTML = projects
    .map(
      (p) => `
      <article class="work-card">
        ${
          p.image
            ? `<div class="work-thumb"><img src="${p.image}" alt="${p.name} 作品縮圖" loading="lazy" /></div>`
            : `<div class="work-thumb" style="background:${p.color}">${p.initials}</div>`
        }
        <div class="work-info">
          <span class="work-tag">${p.tag}</span>
          <h3 class="work-name">${p.name}</h3>
          <p class="work-desc">${p.desc}</p>
        </div>
      </article>`
    )
    .join("");
}

// ===== 進場動畫（IntersectionObserver）=====
function revealOnScroll() {
  const cards = document.querySelectorAll(".work-card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), i * 80);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  cards.forEach((c) => io.observe(c));
}

// ===== 手機選單 =====
function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ===== 初始化 =====
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  revealOnScroll();
  setupNav();
});
