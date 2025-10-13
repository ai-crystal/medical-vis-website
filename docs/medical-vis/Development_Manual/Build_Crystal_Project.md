---
title: Build Crystal Project
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
---

Install Visual Studio, 2017 or above versions. [Visual Studio - 2019、2017、2015](https://visualstudio.microsoft.com/zh-hans/vs/older-downloads/)

Install CUDA，both version 11 and 12 are ok.[CUDA Toolkit Archive | NVIDIA Developer](https://developer.nvidia.com/cuda-toolkit-archive)

Install Qt 6.[Try Qt | Develop Applications and Embedded Systems | Qt](https://www.qt.io/download-dev#eval-form)

Install Python development environment (Anaconda management is recommended).[Download Anaconda Distribution | Anaconda](https://www.anaconda.com/download)

## How to build Crystal with Python support

Choose Python bindings and fill the path of the python interpreter: 

<img src="/images/Development_Manual/Build_Crystal_Project_01.png" />

Then configure it and select the newly emerged two option: 

<img src="/images/Development_Manual/Build_Crystal_Project_02.png" />

Compile the pycrystal_core project:

<img src="/images/Development_Manual/Build_Crystal_Project_03.png" />

And you can found [pycrystal_core.cp39-win_amd64.pyd]. 

Put it in: Crystal/Scripts/pycrystal/pystal/win or linux (depending on your compiling operating system)