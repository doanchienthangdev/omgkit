---
name: image-processing
description: Enterprise image manipulation with Sharp including optimization, resizing, format conversion, and batch operations
category: tools
triggers:
  - image processing
  - sharp
  - image optimization
  - resize images
  - image conversion
  - thumbnail generation
  - webp avif
---

# Image Processing

High-performance **image processing** with Sharp. This skill covers optimization, resizing, format conversion, and batch processing for web applications.

## Purpose

Process images efficiently for web delivery:

- Resize and crop images maintaining aspect ratios
- Convert to modern formats (WebP, AVIF)
- Optimize file sizes without quality loss
- Generate responsive image sets
- Process uploads in batch
- Apply watermarks and overlays

## Features

### 1. Basic Image Operations

```typescript
import sharp from 'sharp';
import path from 'path';

interface ResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'top' | 'right top' | 'right' | 'right bottom' | 'bottom' | 'left bottom' | 'left' | 'left top' | 'center';
  background?: string;
}

// Resize image with options
async function resizeImage(
  inputPath: string,
  outputPath: string,
  options: ResizeOptions
): Promise<sharp.OutputInfo> {
  const { width, height, fit = 'cover', position = 'center', background = '#ffffff' } = options;

  return sharp(inputPath)
    .resize({
      width,
      height,
      fit,
      position,
      background,
    })
    .toFile(outputPath);
}

// Crop to specific dimensions
async function cropImage(
  inputPath: string,
  outputPath: string,
  region: { left: number; top: number; width: number; height: number }
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .extract(region)
    .toFile(outputPath);
}

// Smart crop with attention detection
async function smartCrop(
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .resize(width, height, {
      fit: 'cover',
      position: sharp.strategy.attention, // Focus on interesting parts
    })
    .toFile(outputPath);
}

// Rotate image
async function rotateImage(
  inputPath: string,
  outputPath: string,
  angle: number
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .rotate(angle, { background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toFile(outputPath);
}

// Flip and flop
async function flipImage(
  inputPath: string,
  outputPath: string,
  direction: 'horizontal' | 'vertical'
): Promise<sharp.OutputInfo> {
  const image = sharp(inputPath);

  if (direction === 'horizontal') {
    return image.flop().toFile(outputPath);
  }

  return image.flip().toFile(outputPath);
}
```

### 2. Format Conversion & Optimization

```typescript
interface OptimizeOptions {
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  progressive?: boolean;
  stripMetadata?: boolean;
}

// Optimize image for web
async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeOptions = {}
): Promise<sharp.OutputInfo> {
  const {
    quality = 80,
    format = 'webp',
    progressive = true,
    stripMetadata = true,
  } = options;

  let image = sharp(inputPath);

  if (stripMetadata) {
    image = image.rotate(); // Auto-rotate based on EXIF, then strip
  }

  switch (format) {
    case 'jpeg':
      return image
        .jpeg({ quality, progressive, mozjpeg: true })
        .toFile(outputPath);

    case 'png':
      return image
        .png({ quality, compressionLevel: 9, palette: true })
        .toFile(outputPath);

    case 'webp':
      return image
        .webp({ quality, effort: 6 })
        .toFile(outputPath);

    case 'avif':
      return image
        .avif({ quality, effort: 6 })
        .toFile(outputPath);

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

// Convert to multiple formats
async function convertToMultipleFormats(
  inputPath: string,
  outputDir: string,
  formats: OptimizeOptions['format'][] = ['jpeg', 'webp', 'avif']
): Promise<Map<string, string>> {
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const results = new Map<string, string>();

  await Promise.all(
    formats.map(async (format) => {
      const outputPath = path.join(outputDir, `${baseName}.${format}`);
      await optimizeImage(inputPath, outputPath, { format });
      results.set(format!, outputPath);
    })
  );

  return results;
}

// Generate srcset for responsive images
interface SrcsetOptions {
  widths: number[];
  formats: ('jpeg' | 'webp' | 'avif')[];
  quality?: number;
}

async function generateSrcset(
  inputPath: string,
  outputDir: string,
  options: SrcsetOptions
): Promise<{
  sources: Array<{ srcset: string; type: string }>;
  fallback: string;
}> {
  const { widths, formats, quality = 80 } = options;
  const baseName = path.basename(inputPath, path.extname(inputPath));
  const sources: Array<{ srcset: string; type: string }> = [];

  for (const format of formats) {
    const srcsetParts: string[] = [];

    for (const width of widths) {
      const filename = `${baseName}-${width}w.${format}`;
      const outputPath = path.join(outputDir, filename);

      await sharp(inputPath)
        .resize(width)
        .toFormat(format, { quality })
        .toFile(outputPath);

      srcsetParts.push(`${filename} ${width}w`);
    }

    sources.push({
      srcset: srcsetParts.join(', '),
      type: `image/${format}`,
    });
  }

  // Generate fallback JPEG
  const fallbackPath = path.join(outputDir, `${baseName}-fallback.jpg`);
  await sharp(inputPath)
    .resize(widths[widths.length - 1])
    .jpeg({ quality })
    .toFile(fallbackPath);

  return {
    sources,
    fallback: `${baseName}-fallback.jpg`,
  };
}
```

### 3. Image Effects & Filters

```typescript
// Apply blur effect
async function blurImage(
  inputPath: string,
  outputPath: string,
  sigma: number = 10
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .blur(sigma)
    .toFile(outputPath);
}

// Sharpen image
async function sharpenImage(
  inputPath: string,
  outputPath: string,
  options: { sigma?: number; flat?: number; jagged?: number } = {}
): Promise<sharp.OutputInfo> {
  const { sigma = 1, flat = 1, jagged = 2 } = options;

  return sharp(inputPath)
    .sharpen(sigma, flat, jagged)
    .toFile(outputPath);
}

// Adjust colors
interface ColorAdjustments {
  brightness?: number; // 0.5 to 2
  saturation?: number; // 0 to 2
  hue?: number; // 0 to 360
}

async function adjustColors(
  inputPath: string,
  outputPath: string,
  adjustments: ColorAdjustments
): Promise<sharp.OutputInfo> {
  const { brightness = 1, saturation = 1, hue = 0 } = adjustments;

  return sharp(inputPath)
    .modulate({
      brightness,
      saturation,
      hue,
    })
    .toFile(outputPath);
}

// Apply grayscale
async function grayscale(
  inputPath: string,
  outputPath: string
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .grayscale()
    .toFile(outputPath);
}

// Apply tint
async function tintImage(
  inputPath: string,
  outputPath: string,
  color: string // hex color
): Promise<sharp.OutputInfo> {
  return sharp(inputPath)
    .tint(color)
    .toFile(outputPath);
}

// Create placeholder blur (LQIP)
async function createLQIP(
  inputPath: string,
  outputPath: string
): Promise<{ dataUri: string; width: number; height: number }> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  const buffer = await image
    .resize(20) // Tiny size
    .blur(5)
    .jpeg({ quality: 20 })
    .toBuffer();

  return {
    dataUri: `data:image/jpeg;base64,${buffer.toString('base64')}`,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
```

### 4. Watermarks & Overlays

```typescript
// Add text watermark
async function addTextWatermark(
  inputPath: string,
  outputPath: string,
  text: string,
  options: {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    fontSize?: number;
    color?: string;
    opacity?: number;
  } = {}
): Promise<sharp.OutputInfo> {
  const {
    position = 'bottom-right',
    fontSize = 24,
    color = '#ffffff',
    opacity = 0.5,
  } = options;

  const metadata = await sharp(inputPath).metadata();
  const { width = 800, height = 600 } = metadata;

  // Create SVG text overlay
  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .watermark {
          fill: ${color};
          font-size: ${fontSize}px;
          font-family: Arial, sans-serif;
          opacity: ${opacity};
        }
      </style>
      <text
        x="${getXPosition(position, width, fontSize * text.length * 0.6)}"
        y="${getYPosition(position, height, fontSize)}"
        class="watermark"
      >${text}</text>
    </svg>
  `;

  return sharp(inputPath)
    .composite([{
      input: Buffer.from(svg),
      gravity: positionToGravity(position),
    }])
    .toFile(outputPath);
}

// Add image watermark/overlay
async function addImageOverlay(
  inputPath: string,
  overlayPath: string,
  outputPath: string,
  options: {
    position?: sharp.Gravity;
    opacity?: number;
    blend?: sharp.Blend;
    scale?: number;
  } = {}
): Promise<sharp.OutputInfo> {
  const {
    position = 'southeast',
    opacity = 0.8,
    blend = 'over',
    scale,
  } = options;

  let overlay = sharp(overlayPath);

  if (scale) {
    const overlayMeta = await overlay.metadata();
    overlay = overlay.resize(
      Math.round((overlayMeta.width || 100) * scale),
      Math.round((overlayMeta.height || 100) * scale)
    );
  }

  const overlayBuffer = await overlay
    .ensureAlpha(opacity)
    .toBuffer();

  return sharp(inputPath)
    .composite([{
      input: overlayBuffer,
      gravity: position,
      blend,
    }])
    .toFile(outputPath);
}

// Create image collage
async function createCollage(
  images: string[],
  outputPath: string,
  options: {
    columns: number;
    tileWidth: number;
    tileHeight: number;
    gap?: number;
    background?: string;
  }
): Promise<sharp.OutputInfo> {
  const { columns, tileWidth, tileHeight, gap = 0, background = '#ffffff' } = options;
  const rows = Math.ceil(images.length / columns);

  const totalWidth = columns * tileWidth + (columns - 1) * gap;
  const totalHeight = rows * tileHeight + (rows - 1) * gap;

  // Create base canvas
  const canvas = sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 3,
      background,
    },
  });

  // Prepare tiles
  const composites: sharp.OverlayOptions[] = await Promise.all(
    images.map(async (imagePath, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const buffer = await sharp(imagePath)
        .resize(tileWidth, tileHeight, { fit: 'cover' })
        .toBuffer();

      return {
        input: buffer,
        left: col * (tileWidth + gap),
        top: row * (tileHeight + gap),
      };
    })
  );

  return canvas
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(outputPath);
}
```

### 5. Metadata & Analysis

```typescript
interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: number;
  hasAlpha: boolean;
  orientation?: number;
  colorSpace?: string;
  exif?: Record<string, any>;
}

// Get comprehensive image info
async function getImageInfo(inputPath: string): Promise<ImageInfo> {
  const metadata = await sharp(inputPath).metadata();
  const stats = await fs.stat(inputPath);

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: stats.size,
    hasAlpha: metadata.hasAlpha || false,
    orientation: metadata.orientation,
    colorSpace: metadata.space,
    exif: metadata.exif ? parseExif(metadata.exif) : undefined,
  };
}

// Extract dominant colors
async function getDominantColors(
  inputPath: string,
  count: number = 5
): Promise<string[]> {
  const { data, info } = await sharp(inputPath)
    .resize(100, 100, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const colors = extractColors(data, info.width, info.height, count);

  return colors.map(([r, g, b]) =>
    `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  );
}

// Analyze image for blur/quality
async function analyzeImageQuality(inputPath: string): Promise<{
  sharpness: number;
  brightness: number;
  contrast: number;
  isBlurry: boolean;
}> {
  const { data, info } = await sharp(inputPath)
    .resize(200) // Analyze at smaller size for speed
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Calculate Laplacian variance (blur detection)
  const laplacianVariance = calculateLaplacianVariance(data, info.width, info.height);

  // Calculate other metrics
  const { mean, stddev } = calculateStats(data);

  return {
    sharpness: laplacianVariance,
    brightness: mean / 255,
    contrast: stddev / 128,
    isBlurry: laplacianVariance < 100, // Threshold for blur detection
  };
}
```

### 6. Batch Processing

```typescript
import PQueue from 'p-queue';

interface BatchProcessOptions {
  concurrency?: number;
  outputDir: string;
  transform: (image: sharp.Sharp, filename: string) => sharp.Sharp;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  quality?: number;
}

async function batchProcessImages(
  inputPaths: string[],
  options: BatchProcessOptions
): Promise<Map<string, { success: boolean; outputPath?: string; error?: string }>> {
  const {
    concurrency = 4,
    outputDir,
    transform,
    format = 'jpeg',
    quality = 80,
  } = options;

  const queue = new PQueue({ concurrency });
  const results = new Map<string, { success: boolean; outputPath?: string; error?: string }>();

  await fs.mkdir(outputDir, { recursive: true });

  const tasks = inputPaths.map((inputPath) =>
    queue.add(async () => {
      const filename = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(outputDir, `${filename}.${format}`);

      try {
        let image = sharp(inputPath);
        image = transform(image, filename);

        await image.toFormat(format, { quality }).toFile(outputPath);

        results.set(inputPath, { success: true, outputPath });
      } catch (error) {
        results.set(inputPath, {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    })
  );

  await Promise.all(tasks);

  return results;
}

// Example: Batch resize and optimize
async function processUploads(uploadPaths: string[]): Promise<void> {
  const results = await batchProcessImages(uploadPaths, {
    outputDir: './processed',
    concurrency: 4,
    format: 'webp',
    quality: 80,
    transform: (image) => image
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .sharpen(),
  });

  for (const [input, result] of results) {
    if (result.success) {
      console.log(`Processed: ${input} -> ${result.outputPath}`);
    } else {
      console.error(`Failed: ${input} - ${result.error}`);
    }
  }
}
```

## Use Cases

### 1. E-commerce Product Images

```typescript
// Process product image with all variants
async function processProductImage(
  inputPath: string,
  productId: string
): Promise<ProductImageSet> {
  const outputDir = path.join(MEDIA_DIR, 'products', productId);
  await fs.mkdir(outputDir, { recursive: true });

  const sizes = [
    { name: 'thumb', width: 150, height: 150 },
    { name: 'small', width: 300, height: 300 },
    { name: 'medium', width: 600, height: 600 },
    { name: 'large', width: 1200, height: 1200 },
  ];

  const images: Record<string, Record<string, string>> = {};

  for (const size of sizes) {
    images[size.name] = {};

    for (const format of ['webp', 'jpeg'] as const) {
      const outputPath = path.join(outputDir, `${size.name}.${format}`);

      await sharp(inputPath)
        .resize(size.width, size.height, { fit: 'contain', background: '#ffffff' })
        .toFormat(format, { quality: format === 'webp' ? 85 : 90 })
        .toFile(outputPath);

      images[size.name][format] = `/media/products/${productId}/${size.name}.${format}`;
    }
  }

  // Generate LQIP
  const lqip = await createLQIP(inputPath, path.join(outputDir, 'lqip.jpg'));

  return { images, lqip: lqip.dataUri };
}
```

### 2. User Avatar Processing

```typescript
// Process avatar upload
async function processAvatar(
  inputPath: string,
  userId: string
): Promise<AvatarSet> {
  const outputDir = path.join(MEDIA_DIR, 'avatars', userId);
  await fs.mkdir(outputDir, { recursive: true });

  const sizes = [32, 64, 128, 256];
  const urls: Record<number, string> = {};

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${size}.webp`);

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: sharp.strategy.attention,
      })
      .webp({ quality: 90 })
      .toFile(outputPath);

    urls[size] = `/media/avatars/${userId}/${size}.webp`;
  }

  return { sizes: urls, default: urls[128] };
}
```

## Best Practices

### Do's

- **Use WebP/AVIF for web** - Modern formats save 25-50% bandwidth
- **Implement lazy loading** - Generate LQIP placeholders
- **Cache processed images** - Store results, don't reprocess
- **Use streams for large images** - Avoid memory issues
- **Strip metadata** - Remove EXIF for privacy and size
- **Validate uploads** - Check dimensions and format

### Don'ts

- Don't upscale images (use withoutEnlargement)
- Don't over-compress (quality < 60 shows artifacts)
- Don't process without error handling
- Don't ignore color profiles
- Don't skip responsive images
- Don't forget fallbacks for older browsers

## Related Skills

- **media-processing** - Video processing companion
- **frontend-design** - Image usage in UI
- **performance-profiling** - Image impact on performance

## Reference Resources

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [Squoosh](https://squoosh.app/) - Format comparison
- [AVIF Support](https://caniuse.com/avif)
