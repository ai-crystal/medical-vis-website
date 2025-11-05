---
title: Fast and accurate illumination estimation using LDR panoramic images for realistic rendering
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Cheng, H., **Xu, C.**, Wang, J., Chen, Z., & Zhao, L. (2022). **Fast and accurate illumination estimation using LDR panoramic images for realistic rendering.** IEEE Transactions on Visualization and Computer Graphics, 29(12), 5235-5249.
:::

<img src="/images/publications/Illumin-Estim_01.png" />

The high dynamic range (HDR) image is usually used to reveal the stereo illumination, which is crucial for generating highquality realistic rendering effects. Compared to the high-cost HDR imaging technique, the low dynamic range (LDR) imaging provides a low-cost alternative and is preferable for interactive graphics applications. However, the limited LDR pixel bit depth significantly bothers the accurate illumination estimation using LDR images. The conflict between the realism and promptness of illumination estimation for realistic rendering is still yet to be resolved. 

In this paper, an efficient method that accurately infers illuminations of real-world scenes using LDR panoramic images is proposed. It estimates multiple lighting parameters, including locations, types and intensities of light sources. In our approach, a new algorithm that extracts illuminant characteristics during the exposure attenuation process is developed to first locate light sources and outline their boundaries. To better predict realistic illuminations, a new deep learning model is designed to efficiently parse complex LDR panoramas and classify detected light sources. Finally, realistic illumination intensities are calculated by recovering the inverse camera response function and extending the dynamic range of pixel values based on previously estimated parameters of light sources. The reconstructed radiance map can be used for the high-quality image-based rendering of virtual models. 

<img src="/images/publications/Illumin-Estim_02.png" />

Experimental results demonstrate that the proposed method is capable of efficiently and accurately computing comprehensive illuminations using LDR images. Our method can be used to produce better realistic rendering results than existing approaches.


<img src="/images/publications/Illumin-Estim_03.png" />