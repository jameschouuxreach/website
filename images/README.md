# 圖片放這裡

## 作品縮圖
1. 把圖片檔（建議 .jpg 或 .webp）放進這個資料夾，例如 `work-1.jpg`。
2. 打開 `../js/main.js`，在對應作品的 `image:` 填上路徑，例如：
   ```js
   image: "images/work-1.jpg",
   ```
3. 有填 image 就顯示圖片，留空 `""` 則顯示原本的色塊 + 縮寫。

建議尺寸：橫向 4:3，寬約 1200px。

## 個人照片
1. 把照片放這裡，命名 `profile.jpg`。
2. 打開 `../index.html`，找到 `about-media` 區塊，
   取消註解 `<img class="about-photo" ...>` 那行，並刪掉下方的 `<div class="about-photo">`。

建議尺寸：正方形 1:1，寬約 800px。
