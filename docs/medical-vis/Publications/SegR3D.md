---
title: "SegR3D: A multi-target 3D visualization system for realistic volume rendering of meningiomas"
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
outline: [2,4]
---

::: note ::ci:book-open::
Zhang, J., Xu, C., Xu, X., Zhao, Y., & Zhao, L. (2025). SegR3D: A Multi-Target 3D Visualization System for Realistic Volume Rendering of Meningiomas. Journal of Imaging, 11(7), 216.
:::

<img src="/images/publications/SegR3D_01.png" />

Our system conducts multi-target segmentation on the input patient medical image sequence to extract meningiomas regions and the surrounding non-enhancing T2/FLAIR hyperintensity (SNFH). SNFH is usually inflammatory or edematous brain tissue. Subsequently, visualization of the data is performed utilizing our rendering pipeline. Advanced illumination enhances users’ perception of lesion shapes. The dataset utilized originates from the [BraTS 2023 dataset](https://arxiv.org/abs/2305.07642).

**importance transfer function – regulates the visual appearance.**

<img src="/images/publications/SegR3D_02.png" />

Adjusting the transparency of brain tissue with importance transfer function to achieve various visualization outcomes aids physicians in better discerning tumor locations.

<img src="/images/publications/SegR3D_03.png" />

Modifying the importance transfer function enables the selection of displaying or concealing certain structures.

<img src="/images/publications/SegR3D_04.png" />

**User interaction video**

**Changing observation angle/adjusting importance transfer function/using real-time denoising**

<ArtPlayer src="https://drive.threekd.com/?file=medical-vis-website/videos/publications/SegR3D_01.mp4" fullscreen />

**High-precision semi-supervised segmentation**

<img src="/images/publications/SegR3D_05.png" />

The segmentation accuracy of our system is compared with that of other state-of-the-art segmentation networks.

**User Study**
**Descriptions**

<img src="/images/publications/SegR3D_06.png" />

- Q1: The results of SegR3D are particularly beneficial for comprehending the location and distribution of tumors and SNFH within the intracranial space.
- Q2: Our visualization outcomes significantly aid in understanding the shape and size of tumors and SNFH.
- Q3: SegR3D is the optimal tool among these methods for tumor analysis.

<img src="/images/publications/SegR3D_07.png" />

- Q4: The current precision of the SegR3D system is sufficient for tumor analysis and surgical planning purposes.

**Rating Results**

<img src="/images/publications/SegR3D_08.png" />

Gantt chart for user experiment rating results

**Feedback and suggestions from physicians participating in the user experiment**

1. Is it possible to visualize the relationship between tumors and blood vessels? Attention must be given to tumors closely associated with blood vessels during surgery, as neglecting to protect these vessels can lead to substantial intraoperative bleeding and postoperative complications.
2. Can the relationship between tumors and the skull be demonstrated? For tumors located in specific regions, such as the skull base, it is crucial to examine the relationship between the tumor and adjacent bone for guidance in surgical procedures.
3. Is it feasible to illustrate the relationship between tumors and nerves? Tumors closely intertwined with nerves require careful protection during surgery, as damaging the nerves can result in postoperative functional impairments corresponding to the affected neural pathways.
4. Can users selectively display specific brain tissues (e.g., only showing the frontal lobe and lesions)?