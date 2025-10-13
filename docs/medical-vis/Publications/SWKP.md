---
title: Real-Time Volume Rendering Image Denoising Based on Spatiotemporal Weighted Kernel Prediction
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Xu, Xinran, **Chunxiao Xu**, and Lingxiao Zhao. 2025. "Real-Time Volume-Rendering Image Denoising Based on Spatiotemporal Weighted Kernel Prediction" **Journal of Imaging** 11, no. 4: 126. https://doi.org/10.3390/jimaging11040126
:::

<img src="/images/publications/SWKP_01.png" />

Volumetric Path Tracing (VPT) based on Monte Carlo (MC) sampling often requires numerous samples for high-quality images, but real-time applications limit samples to maintain interaction rates, leading to significant noise. Traditional real-time denoising methods use radiance and geometric features as neural network inputs, but lightweight networks struggle with temporal stability and complex mapping relationships, causing blurry results. 

To address these issues, a spatiotemporal lightweight neural network is proposed to enhance the denoising performance of VPT-rendered images with low samples per pixel. First, the reprojection technique is employed to obtain features from historical frames. Next, a dual-input convolutional neural network architecture is designed to predict filtering kernels. Radiance and geometric features are encoded independently. The encod- 1ing of geometric features guides the pixel-wise fitting of radiance feature filters. Finally, learned weight filtering kernels are applied to images spatiotemporal filtering to produce denoised results. 

Experimental results across multiple denoising datasets demonstrate that this approach outperforms baseline models in terms of feature extraction and detail representation capabilities while effectively suppressing noise with superior performance and enhanced temporal stability.

<img src="/images/publications/SWKP_02.png" />

<img src="/images/publications/SWKP_03.png" />

<img src="/images/publications/SWKP_04.png" />