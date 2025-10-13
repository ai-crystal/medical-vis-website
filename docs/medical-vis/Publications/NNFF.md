---
title: Real-time realistic direct volume rendering using neural noisy feature fusion
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Xu, C., Xu, X., Zhang, J., Liu, Y., Cao, Y. and Zhao, L. (2025), Real-time Neural Denoising for Volume Rendering Using Dual-Input Feature Fusion Network. Computer Graphics Forum e70276. https://doi.org/10.1111/cgf.70276
:::

Direct volume rendering (DVR) is a widely-used technique in the visualization of volumetric data. As an important DVR technique, volumetric path tracing (VPT) simulates light transport to produce realistic rendering results, which provides enhanced perception and understanding for users, especially in the field of medical imaging. VPT, based on the Monte Carlo (MC) method, typically requires a large number of samples to generate noise-free results. However, in real-time applications, only a limited number of samples per pixel is allowed and significant noise can be created. 

This paper introduces a novel neural denoising approach that utilizes a new feature fusion method for VPT. Our method uses a feature decomposition technique that separates radiance into components according to noise levels. Our new decomposition technique mitigates biases found in the contemporary decoupling denoising algorithm and better utilizes of samples. A lightweight dual-input network is designed to correlate these components with noise-free ground truth. Additionally, for denoising sequences of video frames, we develop a learning-based temporal method that calculates temporal weight maps, blending reprojected results of previous frames with spatially denoised current frames. Comparative results demonstrate that our network performs faster inference than existing methods and can produce denoised output of higher quality in real time.

<img src="/images/publications/NNFF_01.png" />

<ArtPlayer src="https://drive.threekd.com/?file=medical-vis-website/videos/publications/NNFF_01.mp4" fullscreen />

<img src="/images/publications/NNFF_02.png" />

<img src="/images/publications/NNFF_03.png" />

<img src="/images/publications/NNFF_04.png" />