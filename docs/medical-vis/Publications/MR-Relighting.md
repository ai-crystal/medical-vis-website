---
title: Realistic Volume Rendering with Environment-Synced Illumination in Mixed Reality
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Cheng, H., **Xu, C.(co-first)**, Chen, X., Chen, Z., Wang, J., & Zhao, L. (2023, October). Realistic Volume Rendering with Environment-Synced Illumination in Mixed Reality. In 2023 IEEE International Symposium on Mixed and Augmented Reality Adjunct (ISMAR-Adjunct) (pp. 423-428). IEEE.
:::

<img src="/images/publications/MR-Relighting_01.png" />

Interactive volumetric data visualization using a mixed reality (MR) system is increasingly popular in the research and development field of computer graphics. To the best of our knowledge, there is no MR approach that visualizes volumetric data regarding the environment illumination that varies dynamically. Due to sophisticated requirements of user interaction and vision when using MR head-mounted display (HMD) devices, the conflict between the realisticness and efficiency of direct volume rendering (DVR) is yet to be resolved. 

In this paper, a novel MR visualization framework that supports interactive realistic volume rendering is proposed. A new algorithm is first used to compute accurate environment illumination with high dynamic range (HDR) using space calibration of low dynamic range (LDR) panoramic images. The DVR algorithm using Monte Carlo simulation is then applied to perform an interactive realistic volume rendering that can promptly respond to the dynamically varying environment illumination. A new spatio-temporal denoising algorithm is designed to optimize the image quality of DVR results. Based on a reprojection strategy, it makes full use of temporal coherence between adjacent frames and spatial coherence between the two screens of an HMD to optimize MR rendering quality. Several MR development modules are also designed for related devices in our MR system to help the volumetric data be efficiently and stably displayed in an MR HMD. 

Experimental results demonstrate that our MR visualization framework is capable of producing high-quality blending and shading effects of volumetric data synchronously reflecting surrounding real-world illumination in real-time. Our framework can better support intuitive user perception during MR viewing than most existing MR solutions.

<img src="/images/publications/MR-Relighting_02.png" />

