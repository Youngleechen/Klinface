'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

interface Screenshot {
  id: number
  image_url: string
  tagline: string
  created_at: string
}

export default function ScreenshotsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [selectedImage, setSelectedImage] = useState<Screenshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchScreenshots()
  }, [])

  const fetchScreenshots = async () => {
    const { data, error } = await supabase
      .from('screenshots')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setScreenshots(data || [])
    } else {
      console.error('Error fetching screenshots:', error)
    }

    setLoading(false)
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 py-10">

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
        Screenshots
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : screenshots.length === 0 ? (
        <p className="text-center text-gray-500">
          No screenshots yet.
        </p>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {screenshots.map((shot) => (
            <div
              key={shot.id}
              onClick={() => setSelectedImage(shot)}
              className="cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-white"
            >

              {/* Image */}
              <div className="relative h-[220px] md:h-[260px] lg:h-[300px]">
                <Image
                  src={shot.image_url}
                  alt={shot.tagline}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Tagline */}
              {shot.tagline && (
                <div className="p-3 text-center bg-white">
                  <p className="text-black text-sm md:text-base font-medium">
                    {shot.tagline}
                  </p>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {/* FULLSCREEN IMAGE VIEWER */}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >

          <button
            className="absolute top-6 right-6 text-white text-4xl"
            onClick={() => setSelectedImage(null)}
          >
            ✕
          </button>

          <div
            className="relative w-full max-w-7xl h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.image_url}
              alt={selectedImage.tagline}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

        </div>
      )}

    </div>
  )
}