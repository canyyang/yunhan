# 云汉教育 · YunHan

基于 Vue 3 + Element Plus + Vite 的家教管理平台前端。

## 功能概览

| 路由 | 说明 |
|------|------|
| `/` | 首页 |
| `/student` | 学员在线报名表 |
| `/teacher` | 教员在线报名表 |
| `/public` | 待接学员公开信息栏（不含联系方式，供教员查看） |
| `/login` | 管理员登录 |
| `/admin` | 学员管理：筛选、分院、分页 |
| `/detail/:id` | 学员详情：公开/隐藏、删除、分配教员 |
| `/teachers` | 教员列表：筛选、详情、删除 |

## 业务流程

1. 学员 / 教员通过在线表单提交报名信息
2. 管理员登录后进行学员「分院」分配
3. 在学员详情页为学员匹配教员
4. 可将学员信息公开至 `/public`，供其他教员查看并联系编委对接

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- Vue Router 4
- Element Plus
- Axios
- Vite 6

## 本地开发

```bash
npm install
npm run dev
```

## 构建与部署

```bash
npm run build
npm run preview   # 本地预览构建产物
```

生产环境使用 PM2 托管静态服务（`vite-admin-server.js`，端口 7002），详见 `ecosystem.config.js`。

## 项目结构

```
src/
├── components/       # 公共组件（Header、Teachers、StudentDetailCard）
├── constants/        # 业务常量（科目、地区、学院等）
├── router/           # 路由配置
├── services/         # API 请求封装
├── styles/           # 共享样式
├── utils/            # 工具函数
└── views/            # 页面视图
```

## 说明

- 后端 API 独立部署，前端通过 Axios 与之通信
- 「期数」按 2013-04-01 起自动计算
- 管理端采用哈利波特主题（分院帽、四大学院等）作为内部运营趣味元素
