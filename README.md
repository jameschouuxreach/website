# 個人作品集網站

純 HTML / CSS / JS 的靜態個人作品集，簡約現代風格。目前使用假資料。

## 結構

```
website/
├── index.html      # 首頁（Hero / 作品 / 關於 / 聯絡）
├── css/style.css   # 樣式與設計 tokens
├── js/main.js      # 作品假資料、進場動畫、手機選單
└── README.md
```

## 本地預覽

任選一種方式，然後開啟 http://localhost:8000

```bash
# Python 3
python3 -m http.server 8000

# 或 Node（若已安裝 npx）
npx serve
```

也可直接用瀏覽器開啟 `index.html`。

## 換成真實資料

- 作品：編輯 `js/main.js` 最上方的 `projects` 陣列。
- 個人資訊 / 文案 / 聯絡方式：編輯 `index.html`。
- 配色與字體：編輯 `css/style.css` 最上方的 `:root` tokens。
