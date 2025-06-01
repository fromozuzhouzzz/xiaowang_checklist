# 酒店开/关店 Checklist 系统

基于 Cloudflare Pages + KV 免费层的酒店开关店检查清单系统。

## 功能特点

- ✅ 无需账号登录
- ✅ 明确的「开店」和「关店」按钮
- ✅ 完整的检查清单
- ✅ 日历视图显示完成状态
- ✅ 完全免费（使用 Cloudflare 免费层）

## 项目结构

```
📂 root
├─ public/
│  ├─ index.html        # UI 与脚本
│  ├─ tasks.js          # 开/关店任务配置
│  └─ style.css         # 简易 CSS
├─ functions/           # Pages Functions (Workers)
│  ├─ api/
│  │   ├─ tasks.js      # GET /api/tasks
│  │   ├─ submit.js     # POST /api/submit
│  │   └─ summary.js    # GET /api/summary
├─ wrangler.toml        # 作用域绑定 KV
└─ package.json         # 仅用于本地预览
```

## 部署步骤

1. **注册 / 登入 Cloudflare** → 选单 Pages
2. **Create a Project** → 连接 GitHub → 新增仓库（推上本项目）
3. **Build settings**:
   - Framework = **None**
   - Build command = 留空
   - Build output = `public`
4. **点击 Deploy** → 首次部署完成
5. 进入 Pages 项目 **Settings → Functions → KV Bindings**:
   - Add binding name `KV`, namespace 选 **Create** → 填写任意名称 → Save
   - 复制 namespace id 到 `wrangler.toml` 文件中
6. **重新部署**（Commit 或按 Retry deployment）
7. 打开分配的 `https://<project>.pages.dev` 测试

## 使用方法

1. 点击「开店」或「关店」按钮
2. 勾选所有检查项目
3. 填入提交人姓名
4. 点击「提交」
5. 在日历中查看完成状态

## 备份数据

使用 Wrangler CLI：
```bash
wrangler kv:bulk export <namespace-id> > backup.json
``` 