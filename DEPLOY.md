# Vercel 部署指南

## 方法 1: 使用 Vercel CLI

### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署项目
在项目根目录运行：
```bash
vercel
```

首次部署会询问：
- Set up and deploy? → Yes
- Which scope? → 选择你的账号
- Link to existing project? → No
- What's your project's name? → 输入项目名（如 pdf-tools）
- In which directory is your code located? → ./ (直接回车)

### 4. 生产环境部署
```bash
vercel --prod
```

## 方法 2: 使用 Vercel 网站（更简单）

### 1. 推送代码到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. 在 Vercel 导入项目
1. 访问 https://vercel.com
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 点击 "Deploy"

就这么简单！Vercel 会自动检测这是静态网站并部署。

## 访问地址

部署成功后，你会得到：
- 主页: https://你的项目名.vercel.app/
- 导航页: https://你的项目名.vercel.app/tooles/index.html
- PDF 工具: https://你的项目名.vercel.app/pdf-tools/pdf-preview.html

## 自动部署

如果使用 GitHub 集成，每次推送代码到 main 分支，Vercel 会自动重新部署。

## 自定义域名（可选）

在 Vercel 项目设置中可以添加自定义域名。

## 注意事项

- 所有文件都是静态的，无需服务器端配置
- PDF 处理在浏览器本地完成，不会上传到服务器
- 部署是免费的（个人项目）
