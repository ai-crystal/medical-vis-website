---
title: A Multi-Material Radiative Transfer Model for Realistic Direct Volume Rendering
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
**Xu, Chunxiao**, Xinran Xu, Jiatian Zhang, Yiheng Cao, and Lingxiao Zhao. 2025. **"Efficient Multi-Material Volume Rendering for Realistic Visualization with Complex Transfer Functions"** Journal of Imaging 11, no. 6: 193. https://doi.org/10.3390/jimaging11060193
:::

<img src="/images/publications/PBDVR_01.png" />

Physically-based realistic direct volume rendering (DVR) is a critical area of research in scientific data visualization. The prevailing realistic DVR methods are primarily rooted in outdated theories of participating media rendering and often lack comprehensive analyses of their applicability to realistic DVR scenarios. As a result, the fidelity of material representation in the rendered output is frequently limited. 

To address these challenges, we present a novel multi-material radiative transfer model (MM-RTM) designed for realistic DVR, grounded in recent advancements in light transport theories. Additionally, we standardize various transfer function techniques and propose five distinct forms of transfer functions along with proxy volumes. This comprehensive approach enables our DVR framework to accommodate a wide range of complex transfer function techniques, which we illustrate through several visualizations. Furthermore, to enhance sampling efficiency, we develop a new multi-hierarchical volumetric acceleration method that supports multi-level searches and volume traversal. Our volumetric accelerator also facilitates real-time structural updates when applying complex transfer functions in DVR. 

Our MM-RTM, the unified representation of complex transfer functions, and the acceleration structure for real-time updates are complementary components that collectively establish a comprehensive framework for realistic multi-material DVR. Evaluation from a user study indicates that the rendering results produced by our method demonstrate the most realistic effects among various publicly available state-of-the-art techniques.

<img src="/images/publications/PBDVR_02.png" />

<img src="/images/publications/PBDVR_03.png" />