---
title: Quad‐fisheye Image Stitching for Monoscopic Panorama Reconstruction
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Cheng, H., Xu, C., Wang, J., & Zhao, L. (2022, September). Quad‐fisheye Image Stitching for Monoscopic Panorama Reconstruction. In Computer graphics forum (Vol. 41, No. 6, pp. 94-109).
:::

<img src="/images/publications/FEF-Stitching_01.png" />

Monoscopic panorama provides the display of omnidirectional contents surrounding the viewer. An increasingly popular way to reconstruct a panorama is to stitch a collection of fisheye images. However, such non-planar views may result in problems such as distortions and boundary irregularities. In most cases, the computational expense for stitching non-planar images is also too high to satisfy real-time applications. 

In this paper, a novel monoscopic panorama reconstruction pipeline that produces better quad-fisheye image stitching results for omnidirectional environment viewing is proposed. The main idea is to apply mesh deformation for image alignment. To optimize inter-lens parallaxes, unwarped images are firstly cropped and reshuffled to facilitate the circular environment scene composition by the seamless ring-connection of the panorama borders. Several mesh constraints are then adopted to ensure a high alignment accuracy. After alignment, the boundary of the result is rectified to be rectangular to prevent gapping artifacts. We further extend our approach to video stitching. The temporal smoothness model is added to prevent unexpected artifacts in the panoramic videos. 

To support interactive applications, our stitching algorithm is programmed using CUDA. The camera motion and average gradient per video frame are further calculated to accelerate for synchronous real-life panoramic scene reconstruction and visualization. Experimental results demonstrate that our method has advantages in respects of alignment accuracy, adaptability and image quality of the stitching result.


<img src="/images/publications/FEF-Stitching_02.png" />

