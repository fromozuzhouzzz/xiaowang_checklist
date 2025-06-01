# Cloudflare KV 设置指南

## 问题诊断
您的应用出现500错误是因为缺少KV存储绑定配置。所有API函数都需要访问Cloudflare KV来存储和读取数据。

## 解决步骤

### 方法1: 使用Cloudflare Dashboard（推荐）

1. **登录Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 进入您的账户

2. **创建KV命名空间**
   - 在左侧菜单中找到 "Workers & Pages"
   - 点击 "KV"
   - 点击 "Create a namespace"
   - 命名空间名称建议使用: `xiaowang-checklist-kv`
   - 点击 "Add"

3. **获取命名空间ID**
   - 创建完成后，您会看到命名空间列表
   - 复制新创建的命名空间的ID（一串字符）

4. **配置Pages项目**
   - 回到 "Workers & Pages"
   - 找到您的项目 "xiaowang-checklist"
   - 点击项目名称进入设置
   - 点击 "Settings" 标签
   - 找到 "Functions" 部分
   - 在 "KV namespace bindings" 中点击 "Add binding"
   - Variable name: `KV`
   - KV namespace: 选择刚创建的命名空间
   - 点击 "Save"

### 方法2: 使用Wrangler CLI

如果您安装了wrangler CLI，可以运行以下命令：

```bash
# 创建KV命名空间
npx wrangler kv:namespace create "xiaowang-checklist-kv"

# 创建预览命名空间（用于开发）
npx wrangler kv:namespace create "xiaowang-checklist-kv" --preview
```

然后将输出的ID更新到wrangler.toml文件中。

## 验证设置

设置完成后：
1. 重新部署您的项目（推送新的commit或在Cloudflare Dashboard中手动重新部署）
2. 访问您的网站
3. 错误应该消失，日历功能应该正常工作

## 注意事项

- KV存储在Cloudflare的免费计划中有使用限制
- 第一次访问时，应用会自动初始化默认的任务列表
- 数据会持久保存在KV存储中

## 如果仍有问题

请检查：
1. KV绑定的变量名是否为 `KV`（大写）
2. 命名空间是否正确绑定到项目
3. 项目是否重新部署成功 