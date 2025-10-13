---
title: Code Structure
tags:
  - 
PageLayout: 'custom' 
navbar: true
aside: true
---

## Coordinate System World and Camera Coordinate System

- The world coordinate system follows a **right-handed** convention.
- The camera coordinate system in Crystal is the same as Mitsuba. In the camera coordinate system, the camera is oriented along the **positive z-axis**, with the up vector aligned with the **positive y-axis** and the right direction corresponding to the **negative x-axis**.

<img src="/images/Development_Manual/Code_Structure_01.png" />

- Image Coordinate System: For an image with width w and height h  (the resolution of the film), the pixel range in the image is [0,0] to [w−1,h−1].
- Raster Coordinate System (for imaging film): The range of the raster coordinate system is [0,0] to [w,h]. A pixel [i,j] in the raster coordinate system corresponds to the range [i,j] to [i+1,j+1].
- Screen Coordinate System: The range of the screen coordinate system is [-w/h, -1] to [w/h,1].

<img src="/images/Development_Manual/Code_Structure_02.png" />

In the image space, the vertical coordinate has lower values at the top and higher values at the bottom, which is the opposite of the camera's observation. Similarly, the horizontal coordinate is also reversed.
Therefore, the Screen2Raster transformation performs coordinate flipping in both the vertical and horizontal directions.

Screen2Raster transformation: 
Horizontal coordinate, Transforms the range [w/h,−w/h] to [0, w], where w/h maps to 0, and -w/h maps to w.
Vertical coordinate, Transforms the range [-1, 1] to [h,0], where −1 maps to h and 1 maps to 0.

## Volume Coordinate System

The resolution of the three axes of the volumetric data is denoted as [res.x, res.y, res.z], while the voxel dimensions along these axes in world space are represented as [vs.x, vs.y, vs.z]. The resolution and voxel dimensions are multiplied element-wise to obtain the actual size of the volumetric data, denoted as [v.x, v.y, v.z]. In the local coordinate system of the volumetric space, the coordinate range of the volumetric data is from [0, 0, 0] to [v.x, v.y, v.z]. 

<img src="/images/Development_Manual/Code_Structure_03.png" />

The origin of the visualization space is at the center of the volumetric data. The light sources are defined within the visualization space, including point lights, area lights, directional lights and panoramic HDR environment lights. All of these light sources are directed towards the origin of the visualization space and are used to illuminate the medical image volume data.

The transformation of the volume data from volume space to world space consists of the following steps: (1) translation by [-v.x/2, -v.y/2, -v.z/2]; (2) rotation (to ensure the center of rotation is at the center of the volume's bounding box); and (3) another translation.

Steps (1) and (2) are collectively referred to as the VolumeToVisSpace transformation, while the combined operations of (1), (2) and (3) are referred to as the VolumeToWorld transformation. In general, step (3) is not applied, allowing the light sources to always point towards the center of the volume data. 

## Light Coordinate System

All fundamental light sources (point lights, area lights and directional lights) are defined using spherical coordinates (latitude and longitude), with the direction always pointing towards the origin of the visualization space, which corresponds to the center of the volume data.

The representation of HDR panoramic environment light in the [panoramic coordinate system]:

<img src="/images/Development_Manual/Code_Structure_04.png" />

The following figure illustrates the initial state of the HDR panoramic environment light in the visualization space:

<img src="/images/Development_Manual/Code_Structure_05.png" />

In the visualization space, the panoramic environment light is typically rotated around the y-axis. The following figure shows the result after a 90-degree rotation:

<img src="/images/Development_Manual/Code_Structure_06.png" />

**GLM .vs. Crystal**