---
# ============================================
# 攝影集 Frontmatter 欄位說明
# ============================================
# 此檔案展示所有可用的攝影集 frontmatter 欄位
# 檔名開頭使用 _ 表示這是範例檔案，不會在網站上顯示

# --------------------------------------------
# 必填欄位 (Required Fields)
# --------------------------------------------

title: "Example Photography Collection"
# 攝影集標題
# - 會顯示在相簿卡片、相簿頁面頂部
# - 建議長度：10-60 字元
# - 使用描述性且吸引人的標題
# - 範例：
#   - "Coastal Dawn, Hualien"
#   - "Midnight Taipei"
#   - "Urban Geometry"
#   - "Misty Mountains, Alishan"

description: "A comprehensive example showing all available frontmatter fields for photography collections. Use this as a reference when creating new photo galleries."
# 攝影集簡介
# - 會顯示在相簿卡片下方和相簿頁面
# - 建議長度：80-200 字元
# - 用於 SEO meta description
# - 應該傳達拍攝的氛圍或故事
# - 可以包含拍攝地點、時間、主題等背景資訊

date: "2024-12-20"
# 拍攝日期或發布日期
# - 格式：YYYY-MM-DD (完整日期)
# - 用於相簿列表的排序（越新越前面）
# - 顯示在相簿頁面

coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80"
# 封面圖片
# - 必填！每個攝影集都需要封面圖
# - 可以是：
#   - 完整 URL (例如：Unsplash、自己的 CDN)
#   - 相對路徑 (例如：/images/photography/collection-name/cover.jpg)
# - 建議尺寸：1600x1067px 或更大 (3:2 比例)
# - 用途：
#   - 相簿列表頁的卡片縮圖
#   - 社群分享預覽 (OpenGraph)
#   - 相簿頁面的 hero 圖片

images:
  # 相片陣列
  # - 必填！至少要有 1 張相片
  # - 每張相片包含以下欄位：src, alt, caption, orientation
  # - 相片會按照陣列順序顯示

  - src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80"
    # 圖片來源
    # - 必填
    # - 可以是完整 URL 或相對路徑
    # - 建議寬度：1200-1600px
    # - 支援格式：.jpg, .png, .webp

    alt: "Mountain landscape at sunrise with fog in valleys"
    # 圖片替代文字
    # - 必填 (無障礙要求)
    # - 簡短描述圖片內容
    # - 用於螢幕閱讀器和 SEO
    # - 建議長度：10-50 字元

    caption: "The first light breaks through the mist, painting the valley in shades of gold and blue."
    # 圖片說明文字
    # - 選填
    # - 會顯示在圖片下方
    # - 可以包含：
    #   - 拍攝故事或背景
    #   - 技術細節
    #   - 個人感想
    # - 建議長度：20-150 字元

    orientation: "landscape"
    # 圖片方向
    # - 必填
    # - 可用值：
    #   - "landscape" - 橫向 (寬 > 高)
    #   - "portrait"  - 直向 (高 > 寬)
    #   - "square"    - 正方形 (寬 = 高)
    # - 影響圖片在網格中的排版
    # - 建議根據實際圖片比例設定

  - src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80"
    alt: "Close-up of morning dew on grass"
    caption: "Macro details reveal the intricate patterns of nature often missed by the hurried eye."
    orientation: "portrait"

  - src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
    alt: "Silhouette of photographer against sunset sky"
    caption: "Every photographer becomes part of the landscape they capture."
    orientation: "landscape"

# --------------------------------------------
# 選填欄位 (Optional Fields)
# --------------------------------------------

coverOrientation: "landscape"
# 封面圖片方向
# - 選填 (但強烈建議設定)
# - 可用值："landscape", "portrait", "square"
# - 用於優化封面圖片的顯示比例
# - 如果省略，系統會嘗試自動判斷

location: "Yangmingshan National Park, Taiwan"
# 拍攝地點
# - 選填
# - 格式：自由文字
# - 建議格式：具體地點, 城市, 國家
# - 範例：
#   - "Qixingtan Beach, Hualien, Taiwan"
#   - "Shibuya Crossing, Tokyo, Japan"
#   - "Central Park, New York, USA"
# - 會顯示在相簿頁面的資訊區

camera: "Sony A7C II"
# 相機型號
# - 選填
# - 格式：自由文字
# - 範例：
#   - "Sony A7C II"
#   - "Canon EOS R5"
#   - "Fujifilm X-T4"
#   - "iPhone 14 Pro"
# - 會顯示在相簿頁面的資訊區

lens: "35mm f/1.8"
# 鏡頭規格
# - 選填
# - 格式：自由文字
# - 範例：
#   - "24-70mm f/2.8"
#   - "50mm f/1.4"
#   - "16-35mm f/4"
# - 會顯示在相簿頁面的資訊區

tags: ["Landscape", "Nature", "Mountain", "Dawn", "Taiwan"]
# 攝影標籤
# - 選填
# - 格式：陣列
# - 建議數量：3-6 個
# - 常用標籤：
#   - 類型：Landscape, Portrait, Street, Architecture, Nature
#   - 主題：Urban, Rural, Coastal, Mountain
#   - 時間：Dawn, Dusk, Night, Blue Hour, Golden Hour
#   - 地點：Taiwan, Tokyo, New York
# - 用途：
#   - 相簿分類和過濾
#   - 相關相簿推薦
#   - SEO 關鍵字

# --------------------------------------------
# 系統自動生成欄位 (Auto-generated Fields)
# --------------------------------------------
# 以下欄位由系統自動生成，不需要也不應該手動設定：

# slug: "example-photography-collection"
# URL slug
# - 自動從檔案名稱生成
# - 檔案：coastal-dawn.md → slug: "coastal-dawn"

# readingTime: "2 min read"
# 預估瀏覽時間
# - 根據圖片數量和內容計算

# --------------------------------------------
# 未來可能新增的欄位 (Future Fields)
# --------------------------------------------

# featured: true
# 是否為精選相簿
# - 用於首頁展示
# - 目前尚未實作

# series: "Taiwan Landscapes"
# 系列攝影集
# - 將多個相簿組織成系列
# - 目前尚未實作

# exif:
#   iso: 100
#   shutterSpeed: "1/250"
#   aperture: "f/5.6"
#   focalLength: "35mm"
# EXIF 詳細資訊
# - 技術參數
# - 目前尚未實作

# collaborators: ["Alice Chen", "Bob Lin"]
# 協作攝影師
# - 用於團隊拍攝專案
# - 目前尚未實作

---

## 攝影集內容區域

這裡可以撰寫更詳細的拍攝故事、創作理念、或技術說明。

### 支援的 Markdown 功能

#### 基本格式

- **粗體** - 使用 `**text**`
- *斜體* - 使用 `*text*`
- `行內程式碼` - 使用反引號
- [連結](https://example.com)

#### 段落和引用

攝影不只是記錄當下，更是捕捉情感和氛圍的藝術。

> "The best camera is the one that's with you."
> — Chase Jarvis

#### 拍攝技巧分享

可以在內容中分享拍攝技巧：

1. **黃金時段拍攝**
   - 日出前後 30 分鐘
   - 日落前後 30 分鐘
   - 光線柔和且色溫溫暖

2. **構圖原則**
   - 三分法則
   - 引導線構圖
   - 前景、中景、背景層次

3. **後製建議**
   - 保持自然，避免過度調整
   - 注意白平衡和色調
   - 適度銳化和降噪

### 建議的攝影集結構

一個完整的攝影集通常包含：

1. **簡短介紹** - 拍攝背景和動機
2. **系列照片** - 在 frontmatter 的 images 陣列中定義
3. **拍攝故事** - 詳細描述拍攝過程和感想
4. **技術說明** - 分享使用的器材和技巧（選填）
5. **後記** - 個人反思或延伸思考

### 攝影集撰寫建議

**內容風格：**
- 使用第一人稱敘述
- 分享真實的拍攝經驗
- 描述當時的情境和感受
- 保持簡潔，避免過度文學化

**技術細節：**
- 適度分享相機設定和技巧
- 不需要每張照片都詳細說明
- 重點分享有趣或特別的拍攝經驗

**照片數量：**
- 建議每個相簿 8-15 張照片
- 太少會顯得單薄
- 太多會降低每張照片的影響力
- 精選最好的作品，寧缺勿濫

### 發布檢查清單

發布前確認：

- [ ] 所有必填欄位都已填寫
- [ ] coverImage 能正常顯示
- [ ] 所有 images 的 src 都有效
- [ ] 每張照片都有 alt 和 orientation
- [ ] 照片順序符合敘事邏輯
- [ ] 文字內容無錯別字
- [ ] 標籤相關且足夠

---

**注意**：此檔案僅供參考，檔名開頭的 `_` 表示不會在網站上顯示。

攝影集的重點在於照片本身，文字說明應該簡潔有力，讓照片說話。
