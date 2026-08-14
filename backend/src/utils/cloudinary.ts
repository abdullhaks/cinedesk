import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', 'config', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  fileUrl: string;
  publicId: string;
  fileName: string;
  mimetype: string;
}

/**
 * Upload a Buffer to Cloudinary using a stream.
 * If Cloudinary upload fails or is unreachable, falls back safely to a data URL
 * so that offline/local development continues seamlessly without blocking the user.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string = 'cinedesk/general',
  originalName: string = 'file',
  mimetype: string = 'application/octet-stream'
): Promise<UploadResult> {
  // Try Cloudinary upload
  try {
    const isImage = mimetype.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          public_id: `${Date.now()}_${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    return {
      fileUrl: result.secure_url || result.url,
      publicId: result.public_id,
      fileName: originalName,
      mimetype,
    };
  } catch (error) {
    // Fallback to data URI if Cloudinary is unreachable
    const base64 = buffer.toString('base64');
    const fallbackUrl = `data:${mimetype};base64,${base64}`;
    return {
      fileUrl: fallbackUrl,
      publicId: `local_${Date.now()}`,
      fileName: originalName,
      mimetype,
    };
  }
}

export default cloudinary;
