import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadFileToFirebase(file, folder = 'dokumen') {
  if (!file) throw new Error('File tidak ditemukan')

  try {
    const fileName = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    const buffer = await file.arrayBuffer()

    // Tambahkan metadata untuk preview inline
    const metadata = {
      contentType: file.type || 'application/pdf',
      contentDisposition: 'inline',
    }

    // Upload dengan metadata
    const snapshot = await uploadBytes(storageRef, buffer, metadata)

    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Gagal mengunggah file ke Firebase Storage')
  }
}
