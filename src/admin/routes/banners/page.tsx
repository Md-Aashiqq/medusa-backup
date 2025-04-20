// src/admin/routes/banners/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { AiAssistent, Trash, ArrowUpMini , ArrowDown } from "@medusajs/icons"
import { 
  Container, 
  Heading, 
  Button, 
  Text, 
  Toaster, 
  toast, 
  IconButton,
} from "@medusajs/ui"
import { useEffect, useState } from "react"

const BannersPage = () => {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [banners, setBanners] = useState<Array<{
    id: string, 
    url: string, 
    name: string,
    rank: number,
    file_id: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch("/admin/banners")
      const data = await response.json()
      setBanners(data.banners || [])
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast.error("error", {
        description: "Failed to fetch banner images"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3)
      setFiles(selectedFiles)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      
      // Append each file with the same field name
      files.forEach(file => {
        formData.append("files", file)
      })
      
      // Calculate and append ranks
      const highestRank = banners.length > 0 
        ? Math.max(...banners.map(b => b.rank))
        : -1
      
      const newRanks = Array(files.length).fill(0)
        .map((_, i) => highestRank + 1 + i)
      formData.append('ranks', JSON.stringify(newRanks))

      console.log("formData", formData)

      const response = await fetch("/admin/banners", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Refresh the banner list
      await fetchBanners()
      
      setFiles([])
      toast.success("success", {
        description: "Banner images uploaded successfully"
      })    
    } catch (error) {
      console.error("Error uploading files:", error)
      toast.error("error", {
        description: "Failed to upload banner images"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    
    setDeleting(id)
    
    try {
      const response = await fetch(`/admin/banners/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Delete failed")
      }
      
      // Refresh the banner list
      await fetchBanners()
      
      toast.success("success", {
        description: "Banner image deleted successfully"
      })
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast.error("error", {
        description: "Failed to delete banner image"
      })
    } finally {
      setDeleting(null)
    }
  }

  const handleUpdateRank = async (id: string, newRank: number) => {
    if (!id) return
    
    setUpdating(id)
    
    try {
      const response = await fetch(`/admin/banners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rank: newRank }),
      })
      
      if (!response.ok) {
        throw new Error("Update failed")
      }
      
      // Refresh the banner list
      await fetchBanners()
      
        toast.success("success", {
            description: "Banner order updated successfully"
        })
    } catch (error) {
      console.error("Error updating banner:", error)
      toast.error("error", {
        description: "Failed to update banner order"
      })
    } finally {
      setUpdating(null)
    }
  }

  const moveUp = (index: number) => {
    if (index === 0) return // Already at the top
    
    const banner = banners[index]
    const prevBanner = banners[index - 1]
    
    // Swap ranks
    handleUpdateRank(banner.id, prevBanner.rank)
  }

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return // Already at the bottom
    
    const banner = banners[index]
    const nextBanner = banners[index + 1]
    
    // Swap ranks
    handleUpdateRank(banner.id, nextBanner.rank)
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Banner Images</Heading>
      </div>
      <div className="p-6">
        <Text>Upload banner images for your store</Text>
        <div className="mt-4">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleFileChange}
            className="mb-4"
          />
          <div>
            <Button 
              variant="primary" 
              onClick={handleUpload}
              isLoading={uploading}
              disabled={files.length === 0}
            >
              Upload Banners
            </Button>
          </div>
        </div>
        Add
        {loading ? (
          <div className="mt-6 flex justify-center">
            <Text>Loading banners...</Text>
          </div>
        ) : banners.length > 0 ? (
          <div className="mt-6">
            <Heading level="h3">Current Banners</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {banners
                .sort((a, b) => a.rank - b.rank) // Sort by rank
                .map((banner, index) => (
                <div key={banner.id} className="border rounded p-2 relative">
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <IconButton
                      size="small"
                      onClick={() => moveUp(index)}
                      disabled={index === 0 || updating !== null}
                    >
                      <ArrowUpMini className="text-ui-fg-base" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => moveDown(index)}
                      disabled={index === banners.length - 1 || updating !== null}
                    >
                      <ArrowDown className="text-ui-fg-base" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(banner.id)}
                      isLoading={deleting === banner.id}
                      disabled={deleting !== null}
                    >
                      <Trash className="text-white" />
                    </IconButton>
                  </div>
                  <img src={banner.url.replace('localhost', '147.93.102.223')} alt={`Banner ${index + 1}`} className="w-full h-auto" />
                  <div className="mt-2">
                    <Text className="text-sm truncate">{banner.name}</Text>
                    <Text className="text-xs text-ui-fg-subtle">Rank: {banner.rank}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Text>No banner images uploaded yet.</Text>
          </div>
        )}
      </div>
      <Toaster />
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Banners",
  icon: AiAssistent,
})

export default BannersPage
