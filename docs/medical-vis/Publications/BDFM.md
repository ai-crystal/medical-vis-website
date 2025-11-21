---
title: BDFM - Brain Diseases Foundation Model for Segmentation and Classification Tasks
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Jiatian Zhang, Chunxiao Xu, Han Zhong, Yiheng Cao, and Lingxiao Zhao. 2025. **"BDFM: Brain Diseases Foundation Model for Segmentation and Classification Tasks"**,  Early access.
:::

<img src="/images/publications/BDFM_01.png" />

The lack of high-quality annotated images and the limited transferability of task-specific models delay the development of AI-assisted diagnosis for brain diseases. Developing self-supervised foundation models has attracted the attention of more and more researchers as a promising solution to address this problem. 

This paper proposes a masked image modeling (MIM)-based foundation model of brain disease named BDFM. First, we create a database named BD-15k of more than ten brain diseases for pre-training. Second, to enhance the model’s ability to extract key features in lesion regions, we propose a spatial-frequency dualdomain decoder, which allows the decoding perspective of BDFM to focus on both spatial and frequency domains. In addition, our method employs a spatial mean masking strategy to replace the traditional masking methods. BDFM outperforms the baseline method in reconstructing lesion details. 

<img src="/images/publications/BDFM_02.png" />

Extensive qualitative and quantitative experiments on two public datasets demonstrate that BDFM adapts well to segmentation and classification tasks based on small annotated datasets. Its performance outperforms task-specific models and does not require additional complex task-specific design, which has significant clinical value for AI-assisted diagnosis of brain diseases. The source code is available at https://github.com/zzzjjj98/BDFM.

<img src="/images/publications/BDFM_03.png" />






