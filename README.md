# 云汉教育 · YunHan

基于 Vue 3 + Element Plus + Vite 的家教管理平台前端，配合独立后端 API 使用。

## 功能概览

### 公众端

| 路由 | 说明 |
|------|------|
| `/` | 首页入口 |
| `/student` | 学员在线报名（含区域单选、分步表单） |
| `/teacher` | 教员在线报名 |
| `/public` | 待接学员公开信息栏（不含联系方式） |

### 管理端

| 路由 | 说明 |
|------|------|
| `/login` | 管理员登录 |
| `/admin` | 数据概览（学员状态统计、学段分布、热门科目） |
| `/admin/students` | 学员中心（筛选、分院、分页） |
| `/admin/students/:id` | 学员详情（公开/删除、推荐教员、匹配度排序） |
| `/admin/teachers` | 教员中心（筛选、详情、删除） |

旧路由 `/detail/:id`、`/teachers` 会自动重定向到新路径。

## 业务流程

1. 学员 / 教员通过在线表单提交报名信息
2. 管理员登录后，在学员中心完成「分院」
3. 在学员详情页查看推荐教员（按科目、年级、区域、负荷计算匹配度）并分配
4. 可将学员信息公开至 `/public`，供教员查看编号后联系编委对接

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- Vue Router 4
- Element Plus
- Axios
- Vite 6
- PM2 + pushstate-server（生产静态托管）

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址见终端输出（Vite 本地端口）。

构建与预览：

```bash
npm run build
npm run preview
```

## 后端 API

前端通过 `src/services/axios.js` 中的 `baseURL` 请求后端，当前为：

```
https://canyyang.xyz:7001
```

修改 API 地址时，编辑该文件中的 `baseURL` 后重新构建即可。

管理端数据主要走 `GET /admin/dataset`，公众端公开列表走 `GET /student/public`。

## 期数规则

- 起点：**2013-06-01**，每年 **6 月 1 日**换期
- 学员编号：前 2 位 = 期数，后 3 位 = 当期内序号

## 项目结构

```
src/
├── components/          # 公共组件（Teachers、StudentDetailCard、UI 组件等）
├── composables/         # 数据集、统计、匹配度等组合式逻辑
├── constants/           # 业务常量（科目、地区、学院等）
├── layouts/             # AdminLayout 管理端布局
├── router/              # 路由
├── services/            # API 封装
├── styles/              # 全局与设计 token
├── utils/               # 工具函数、列表筛选排序
└── views/               # 页面（admin/ 为管理端）
```

---

## 阿里云部署

前端部署在 ECS 上，使用 **PM2** 托管 `dist` 静态资源，默认端口 **7002**。后端 API 独立部署（如 `7001` 端口），不在本仓库内。

### 一、服务器环境准备

在阿里云 ECS（示例：`120.77.36.205`）上安装：

```bash
# Node.js 18+（建议用 nvm 或官方源安装）
node -v
npm -v

# PM2
npm install -g pm2

# Git
git -v
```

安全组放行 **7002**（前端）。若通过 Nginx 反代 80/443，则放行对应端口。

### 二、配置 SSH 免密登录

PM2 deploy 需要从本机 SSH 到服务器拉代码。

**1. 本机已有密钥**（一般为 `~/.ssh/id_rsa.pub`），将公钥导入阿里云：

- 控制台 → **ECS** → **网络与安全** → **密钥对** → **导入已有密钥对**
- 粘贴完整一行公钥（`ssh-rsa AAAA... 备注`）
- 绑定到目标实例

**2. 本机 SSH 配置**（`~/.ssh/config` 示例）：

```
Host yunhan-prod
  HostName 120.77.36.205
  User root
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes
```

**3. 验证连接：**

```bash
ssh yunhan-prod "echo ok"
```

输出 `ok` 表示 SSH 已通。

### 三、服务器访问 GitHub

`ecosystem.config.js` 中仓库地址为 `git@github.com:canyyang/yunhan.git`，服务器需能拉取代码：

**方式 A：Deploy Key（推荐）**

```bash
# 在服务器上
ssh-keygen -t ed25519 -C "yunhan-deploy" -f ~/.ssh/yunhan_github -N ""
cat ~/.ssh/yunhan_github.pub
```

将公钥添加到 GitHub 仓库 → **Settings** → **Deploy keys** → **Add deploy key**（勾选只读即可）。

```bash
# ~/.ssh/config  on server
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/yunhan_github
  IdentitiesOnly yes
```

测试：`ssh -T git@github.com`

**方式 B：** 使用服务器上已有、具备仓库权限的 SSH 密钥。

### 四、修改部署配置

编辑根目录 `ecosystem.config.js`，按实际环境调整：

| 字段 | 说明 |
|------|------|
| `deploy.production.user` | SSH 用户，如 `root` |
| `deploy.production.host` | 服务器 IP 或 SSH Host 别名 |
| `deploy.production.key` | 本机私钥路径（Windows 示例：`C:/Users/你的用户名/.ssh/id_rsa`） |
| `deploy.production.repo` | Git 仓库 SSH 地址 |
| `deploy.production.path` | 服务器上的部署目录，如 `~/workspace/yunhan` |
| `apps[0].env.PORT` | 静态服务端口，默认 `7002` |

### 五、首次部署

**本机**安装 PM2 并执行 setup（只需一次）：

```bash
npm install -g pm2
pm2 deploy ecosystem.config.js production setup
```

成功后会在服务器创建目录并克隆仓库。再执行正式部署：

```bash
pm2 deploy ecosystem.config.js production
```

`post-deploy` 会自动：`git pull` → `npm install` → `npm run build` → `pm2 startOrReload`。

### 六、日常更新

代码推送到 `main` 后，在本机执行：

```bash
pm2 deploy ecosystem.config.js production
```

### 七、服务器上常用命令

```bash
pm2 list
pm2 logs yunhan
pm2 restart yunhan
```

部署目录默认为 `~/workspace/yunhan/current`（PM2 deploy 会在 `path` 下维护 `current`、`source` 等目录）。

### 八、（可选）Nginx 反向代理

若希望通过域名访问而非 `:7002`，可在同一台或其他 ECS 上配置 Nginx：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:7002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

HTTPS 建议使用 Let's Encrypt 等证书，配置 `listen 443 ssl` 即可。

---

## 常见问题

**PM2 deploy 报 `Permission denied (publickey)`**  
本机公钥未写入服务器 `~/.ssh/authorized_keys`，或未在阿里云绑定密钥对。按上文「配置 SSH 免密登录」处理。

**deploy 在 `git pull` 阶段失败**  
服务器无法访问 GitHub，检查 Deploy Key 或 `ssh -T git@github.com`。

**页面能开但接口报错**  
检查 `src/services/axios.js` 的 `baseURL`、后端是否运行、跨域与 HTTPS 证书是否正常。

---

## 说明

- 后端 API 独立部署，本仓库仅包含前端
- 管理端采用哈利波特主题（分院帽、四大学院）作为内部运营趣味元素
- 生产环境由 `vite-admin-server.js` 提供 SPA 静态服务，需保证所有前端路由回退到 `index.html`
