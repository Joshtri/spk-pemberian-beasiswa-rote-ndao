"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Upload, FileCheck, FileX, AlertCircle, Download, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import ThreeLoading from "@/components/three-loading"
import ModalForm from "@/components/ui/modal-form"

export default function CalonPenerimaDokumen() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Kartu Tanda Penduduk (KTP)",
      description: "Scan KTP yang masih berlaku",
      required: true,
      status: "uploaded", // not_uploaded, uploading, uploaded, rejected
      file: "ktp_budi.pdf",
      uploadDate: "2025-01-15",
      fileSize: "1.2 MB",
      message: null,
    },
    {
      id: 2,
      name: "Kartu Keluarga",
      description: "Scan Kartu Keluarga yang masih berlaku",
      required: true,
      status: "uploaded",
      file: "kk_budi.pdf",
      uploadDate: "2025-01-15",
      fileSize: "1.5 MB",
      message: null,
    },
    {
      id: 3,
      name: "Surat Keterangan Aktif Kuliah",
      description: "Surat keterangan aktif kuliah dari perguruan tinggi",
      required: true,
      status: "not_uploaded",
      file: null,
      uploadDate: null,
      fileSize: null,
      message: null,
    },
    {
      id: 4,
      name: "Transkrip Nilai",
      description: "Transkrip nilai terakhir dari perguruan tinggi",
      required: true,
      status: "not_uploaded",
      file: null,
      uploadDate: null,
      fileSize: null,
      message: null,
    },
    {
      id: 5,
      name: "Surat Pernyataan",
      description: "Surat pernyataan tidak menerima beasiswa lain",
      required: true,
      status: "not_uploaded",
      file: null,
      uploadDate: null,
      fileSize: null,
      message: null,
    },
  ])

  const handleUpload = (documentId) => {
    // Simulate file upload
    const updatedDocuments = [...documents]
    const docIndex = updatedDocuments.findIndex((doc) => doc.id === documentId)

    if (docIndex !== -1) {
      updatedDocuments[docIndex].status = "uploading"
      setDocuments(updatedDocuments)

      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        updatedDocuments[docIndex].status = "uploaded"
        updatedDocuments[docIndex].file = `dokumen_${documentId}.pdf`
        updatedDocuments[docIndex].uploadDate = new Date().toISOString().split("T")[0]
        updatedDocuments[docIndex].fileSize = "1.3 MB"

        setDocuments(updatedDocuments)
        setIsLoading(false)
      }, 2000)
    }
  }

  const handleDelete = (documentId) => {
    // Simulate file deletion
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedDocuments = [...documents]
      const docIndex = updatedDocuments.findIndex((doc) => doc.id === documentId)

      if (docIndex !== -1) {
        updatedDocuments[docIndex].status = "not_uploaded"
        updatedDocuments[docIndex].file = null
        updatedDocuments[docIndex].uploadDate = null
        updatedDocuments[docIndex].fileSize = null
        updatedDocuments[docIndex].message = null

        setDocuments(updatedDocuments)
      }

      setIsLoading(false)
    }, 1500)
  }

  const handlePreview = (document) => {
    setSelectedDocument(document)
    setIsPreviewModalOpen(true)
  }

  const getCompletionPercentage = () => {
    const uploadedCount = documents.filter((doc) => doc.status === "uploaded").length
    return (uploadedCount / documents.length) * 100
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "uploaded":
        return <FileCheck className="h-5 w-5 text-green-500" />
      case "uploading":
        return <Upload className="h-5 w-5 text-blue-500" />
      case "rejected":
        return <FileX className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "uploaded":
        return "Terunggah"
      case "uploading":
        return "Sedang Diunggah"
      case "rejected":
        return "Ditolak"
      default:
        return "Belum Diunggah"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "uploaded":
        return "text-green-500"
      case "uploading":
        return "text-blue-500"
      case "rejected":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <>
 
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-2xl font-bold">Dokumen Beasiswa</h1>
          <p className="text-muted-foreground">Unggah dokumen yang diperlukan untuk pengajuan beasiswa</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Status Dokumen</CardTitle>
              <CardDescription>Progres kelengkapan dokumen Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Dokumen Terunggah</span>
                  <span className="font-medium">
                    {documents.filter((doc) => doc.status === "uploaded").length} / {documents.length}
                  </span>
                </div>
                <Progress value={getCompletionPercentage()} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Perhatian</AlertTitle>
            <AlertDescription className="text-amber-700">
              Pastikan dokumen yang diunggah dalam format PDF dengan ukuran maksimal 2MB. Dokumen harus jelas dan
              lengkap untuk menghindari penolakan.
            </AlertDescription>
          </Alert>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Semua Dokumen</TabsTrigger>
              <TabsTrigger value="uploaded">Terunggah</TabsTrigger>
              <TabsTrigger value="pending">Belum Terunggah</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="uploaded" className="mt-4">
              <div className="space-y-4">
                {documents
                  .filter((doc) => doc.status === "uploaded")
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onUpload={handleUpload}
                      onDelete={handleDelete}
                      onPreview={handlePreview}
                    />
                  ))}

                {documents.filter((doc) => doc.status === "uploaded").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">Belum ada dokumen yang diunggah</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {documents
                  .filter((doc) => doc.status !== "uploaded")
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onUpload={handleUpload}
                      onDelete={handleDelete}
                      onPreview={handlePreview}
                    />
                  ))}

                {documents.filter((doc) => doc.status !== "uploaded").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">Semua dokumen sudah diunggah</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Document Preview Modal */}
      <ModalForm
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={selectedDocument?.name || "Preview Dokumen"}
        onSubmit={() => setIsPreviewModalOpen(false)}
        submitText="Tutup"
        size="lg"
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">{selectedDocument.file}</span>
                </div>
                <span className="text-sm text-muted-foreground">{selectedDocument.fileSize}</span>
              </div>
              <div className="text-sm text-muted-foreground">Diunggah pada: {selectedDocument.uploadDate}</div>
            </div>

            <div className="border rounded-md p-4 h-[400px] flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Preview dokumen tidak tersedia</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsPreviewModalOpen(false)}>
                  <Download className="h-4 w-4 mr-2" />
                  Unduh untuk melihat
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalForm>
    </>
  )
}

function DocumentCard({ document, onUpload, onDelete, onPreview }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {getStatusIcon(document.status)}
              <span className="ml-2">{document.name}</span>
              {document.required && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Wajib</span>
              )}
            </CardTitle>
            <CardDescription>{document.description}</CardDescription>
          </div>
          <span className={`text-sm font-medium ${getStatusColor(document.status)}`}>
            {getStatusText(document.status)}
          </span>
        </div>
      </CardHeader>

      {document.status === "uploaded" && (
        <CardContent>
          <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <p className="text-sm font-medium truncate max-w-[200px]">{document.file}</p>
                <p className="text-xs text-muted-foreground">
                  {document.uploadDate} • {document.fileSize}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onPreview(document)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(document.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {document.status === "rejected" && (
        <CardContent>
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {document.message || "Dokumen ditolak. Silakan unggah ulang dokumen yang sesuai."}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}

      <CardFooter className="bg-gray-50 border-t">
        {document.status === "not_uploaded" && (
          <Button className="w-full" onClick={() => onUpload(document.id)}>
            <Upload className="mr-2 h-4 w-4" />
            Unggah Dokumen
          </Button>
        )}

        {document.status === "uploading" && (
          <Button className="w-full" disabled>
            <Upload className="mr-2 h-4 w-4 animate-pulse" />
            Sedang Mengunggah...
          </Button>
        )}

        {document.status === "uploaded" && (
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Unduh Dokumen
          </Button>
        )}

        {document.status === "rejected" && (
          <Button className="w-full" onClick={() => onUpload(document.id)}>
            <Upload className="mr-2 h-4 w-4" />
            Unggah Ulang
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

