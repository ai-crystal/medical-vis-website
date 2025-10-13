---
title: Real-time Realistic Volume Rendering of Consistently High Quality with Dynamic Illumination
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
**Chunxiao Xu**, H. Cheng, Z. Chen, J. Wang, Y. Chen and L. Zhao, **"Real-time Realistic Volume Rendering of Consistently High Quality with Dynamic Illumination,"** in IEEE Transactions on Visualization and Computer Graphics, doi: 10.1109/TVCG.2024.3445339.
:::

<img src="\images\publications\RTR-DVR_01.png" />

Direct Volume Rendering (DVR) plays an important role in scientific data visualization. To generate photo-realistic DVR results, the physical light transport throughout the volume is simulated by applying the Monte Carlo-based volumetric path tracing (VPT) approach. For real-time applications, due to the time constraint for rendering each frame, only a limited number of samples shall be taken for the computation per pixel. This can result in a significant amount of noise in the rendering results. 

This paper describes our optimized VPT sampling algorithm and a novel denoising technique to generate consistently high-quality realistic DVR results in real time. **(1) We develop a new shading model that can reduce estimation variance to enhance the quality of DVR results. (2) Additionally, a hybrid acceleration structure is created by integrating both octree and macrocell to improve sampling efficiency. This allows the acquisition of sufficiently more shading samples while maintaining the desired interactive frame rate. (3) To further eliminate remaining noise and improve temporal stability of DVR results, we develop a novel spatiotemporal denoising framework.** Our denoiser decouples the estimated radiance into high-detail low-noise and low-detail high-noise components. Different denoising algorithms are separately applied to these components to reduce noise without introducing blurring artifacts. 

Our DVR system can consistently offer high rendering quality and good temporal stability across DVR result frames in real time. During fast user interactions and with rapid alterations of the illumination condition, our rendering method can still provide good visual comfort and representation accuracy without visible latency.

<img src="\images\publications\RTR-DVR_02.png" />

::: tip software
Download Link: [Realistic VolumeRender-EXE.zip](https://pan.baidu.com/s/1QXC-8YMX6wNoH7Y3YCHdmg)   Extract code: dezg

Operating environment: Windows 7 and above, supporting Nvidia CUDA GPU, minimum graphics memory requirement: 8GB
:::
<ArtPlayer src="https://drive.threekd.com/?file=medical-vis-website/videos/publications/RTR-DVR_01.mp4" fullscreen />