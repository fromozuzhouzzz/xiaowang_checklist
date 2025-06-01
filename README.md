# 酒店開／關店 Checklist 系統

基於 Cloudflare Pages + KV 免費層的酒店開關店檢查清單系統。

## 功能特點

- ✅ 無需賬號登錄
- ✅ 明確的「開店」和「關店」按鈕
- ✅ 完整的檢查清單
- ✅ 日曆視圖顯示完成狀態
- ✅ 完全免費（使用 Cloudflare 免費層）

## 項目結構

```
📂 root
├─ public/
│  ├─ index.html        # UI 與腳本
│  ├─ tasks.js          # 開/關店任務配置
│  └─ style.css         # 簡易 CSS
├─ functions/           # Pages Functions (Workers)
│  ├─ api/
│  │   ├─ tasks.js      # GET /api/tasks
│  │   ├─ submit.js     # POST /api/submit
│  │   └─ summary.js    # GET /api/summary
├─ wrangler.toml        # 作用域綁定 KV
└─ package.json         # 僅用於本地預覽
```

## 部署步驟

1. **註冊 / 登入 Cloudflare** → 選單 Pages
2. **Create a Project** → 連接 GitHub → 新增倉庫（推上本專案）
3. **Build settings**:
   - Framework = **None**
   - Build command = 留空
   - Build output = `public`
4. **點擊 Deploy** → 首次部署完成
5. 進入 Pages 專案 **Settings → Functions → KV Bindings**:
   - Add binding name `KV`, namespace 選 **Create** → 填寫任意名稱 → Save
   - 複製 namespace id 到 `wrangler.toml` 文件中
6. **重新部署**（Commit 或按 Retry deployment）
7. 打開分配的 `https://<project>.pages.dev` 測試

## 使用方法

1. 點擊「開店」或「關店」按鈕
2. 勾選所有檢查項目
3. 填入提交人姓名
4. 點擊「提交」
5. 在日曆中查看完成狀態

## 備份數據

使用 Wrangler CLI：
```bash
wrangler kv:bulk export <namespace-id> > backup.json
``` 