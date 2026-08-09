---
title: '化学内容渲染测试'
description: '验证 LaTeX 公式以及 SMILES、SDF、XYZ、GJF 的 Markdown 渲染约定。'
pubDate: '2026-08-10'
tags:
  - KaTeX
  - RDKit.js
  - 3Dmol.js
draft: false
---

这篇文章定义博客中三类科学内容的最小写法。所有输入仍然是普通 Markdown，不要求 MDX 组件。

## 公式与化学方程

行内公式使用单个美元符号，例如轨道能量 $\varepsilon_i$。块级公式使用两个美元符号：

$$
E_{\mathrm{HF}}
= \sum_i^{\mathrm{occ}} h_{ii}
+ \frac{1}{2}\sum_{ij}^{\mathrm{occ}}(J_{ij}-K_{ij}).
\tag{1}
$$

化学式与反应式使用 KaTeX 的 `mhchem` 语法，元素下标和反应箭头会自动排版：

$$
\ce{2 H2 + O2 -> 2 H2O}
$$

## 二维分子结构

### 从 SMILES 生成

把 SMILES 放进语言标记为 `smiles` 的代码块中，浏览器会按需加载 RDKit.js 并生成 SVG。下面是阿司匹林：

```smiles
CC(=O)Oc1ccccc1C(=O)O
```

### 从 SDF 或 MOL block 生成

语言标记为 `sdf` 或 `mol` 时会检查坐标：普通二维坐标生成 SVG，包含三维坐标时自动切换到交互式三维视图。

```sdf
Water
  ChemBlog

  3  2  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7586    0.5043    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7586    0.5043    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
M  END
```

## 三维分子结构

代码块的语言就是文件格式，不需要再添加 `-3d`。当前支持 `xyz`、`gjf`、`pdb`、`mol2`、`cif` 和 `cube`；旧的 `xyz-3d` 等写法仍然兼容。

```xyz
3
water
O   0.000000   0.000000   0.000000
H   0.758602   0.000000   0.504284
H  -0.758602   0.000000   0.504284
```

Gaussian 输入文件使用 `gjf`（`.com` 文件也可以使用 `com`）。目前直接读取电荷、多重度之后的笛卡尔坐标：

```gjf
%chk=water.chk
#p b3lyp/6-31g(d) opt

water optimization

0 1
O   0.000000   0.000000   0.000000
H   0.758602   0.000000   0.504284
H  -0.758602   0.000000   0.504284

```

三维视图由 3Dmol.js 驱动，可以拖动旋转、滚轮缩放。GJF 的 Z-matrix 暂时不自动转换；普通文章没有这些代码块时，不会加载 RDKit WASM 或 3Dmol.js。
