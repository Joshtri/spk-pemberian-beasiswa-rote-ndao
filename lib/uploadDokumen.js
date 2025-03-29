// lib/uploadDokumen.js
import { storage, IDHelper } from './appwriteServer'; // ⬅️ PAKAI YANG BARU!

export async function uploadDokumen(file) {
  try {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      IDHelper.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error("Upload error detail:", error);
    throw new Error(error.message || "Upload gagal");
  }
}
