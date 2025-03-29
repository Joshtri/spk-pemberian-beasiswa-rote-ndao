import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadFileToFirebase(file, folder = 'dokumen') {
  if (!file) throw new Error('File tidak ditemukan')

  try {
    // Create a unique filename with timestamp
    const fileName = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `${folder}/${fileName}`)

    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer()

    // Upload file
    const snapshot = await uploadBytes(storageRef, buffer)

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Gagal mengunggah file ke Firebase Storage')
  }
}
