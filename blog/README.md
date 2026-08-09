# 文章目录规范

每篇文章使用一个独立目录：

```text
blog/<slug>/
├── index.md
├── img/                 # 封面、插图、图表与截图
├── assets/              # SDF、XYZ、GJF、轨迹与计算结果
├── ai/                  # AI 摘要、上下文、翻译和处理记录
└── article.config.yaml  # 同步、渲染与 AI 工作流配置
```

`index.md` 只保存正文和文章元数据。图片使用相对于正文的 `./img/...` 路径；科学文件使用 `./assets/...` 路径。
