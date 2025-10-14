---
title: Geometry Process
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: false
---

Currently, our mesh extraction and optimization features are implemented using several excellent open-source libraries. Due to the powerful features of these libraries, we will no longer develop and maintain a new algorithm library but will instead directly utilize the capabilities of these libraries.

The libraries we use are:

- [MeshLab](https://www.meshlab.net/)
- [OpenMesh](https://www.graphics.rwth-aachen.de/software/openmesh/)
- [VTK](https://vtk.org/)
- [3D Slicer](https://www.slicer.org/)
- [Open3D](https://www.open3d.org/)


## Extracting and constructing mesh from volumetric data

Crystal is used for 3D visualization of the extracted mesh. There are three visualization modes for the mesh: displaying only the edges, displaying only the faces, or displaying both the edges and the faces.

<img src="/images/Research_Field/Geometry_Process_01.png" />

## Mesh denoising and smoothing

<img src="/images/Research_Field/Geometry_Process_02.png" />

Different smoothing factors are used to obtain various levels of smoothness for the mesh. It is important to note that excessive smoothing may result in a loss of data accuracy.

<img src="/images/Research_Field/Geometry_Process_03.png" />

## geometry optimization

Simplify the mesh using MeshLab and Visualizing the mesh using Crystal.

<img src="/images/Research_Field/Geometry_Process_04.png" />