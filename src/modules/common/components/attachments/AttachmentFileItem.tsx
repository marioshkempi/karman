// Place in: storefront/src/modules/products/components/erp-attachments/index.tsx

"use client"

import React from "react"

type AttachmentPosition =
  | "product_tab"
  | "before_add_to_cart"
  | "after_add_to_cart"

interface ErpFile {
  id: number
  name: string
  originalFilename: string
  customFilename: string
  extension: string
  url: string
  fileUrl: string
  description: string
  category_id: number
  category_name: string
  docSize: number
  uploadDate: string
  hoverImage: boolean
  defaultImage: boolean
}

interface AttachmentGroup {
  id: string
  attachment_id: number
  title: string | null
  position: AttachmentPosition
  sort_order: number
  files: ErpFile[]
}

const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "avif",
]
const isImage = (ext: string) => IMAGE_EXTENSIONS.includes(ext.toLowerCase())

const PLACEHOLDER_IMAGE = "/images/no-image-found.jpg"

const getImageSrc = (file: ErpFile) =>
  file.fileUrl || file.url || PLACEHOLDER_IMAGE
const getImageHref = (file: ErpFile) => file.url || file.fileUrl || undefined
const getDocHref = (file: ErpFile) => file.fileUrl || file.url || undefined

// ─── File type icon ───────────────────────────────────────────────────────────

function FileIcon({
  extension,
  className = "w-5 h-5",
}: {
  extension: string
  className?: string
}) {
  const ext = extension.toLowerCase()

  if (ext === "pdf") {
    return (
      <svg
        className={`${className} text-red-500`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
        <text
          x="8"
          y="17"
          fontSize="6"
          fill="currentColor"
          stroke="none"
          fontWeight="bold"
        >
          PDF
        </text>
      </svg>
    )
  }

  if (["doc", "docx"].includes(ext)) {
    return (
      <svg
        className={`${className} text-blue-600`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    )
  }

  if (["xls", "xlsx", "csv"].includes(ext)) {
    return (
      <svg
        className={`${className} text-green-600`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    )
  }

  return (
    <svg
      className={`${className} text-gray-500`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ErpAttachmentsProps {
  groups: AttachmentGroup[]
  position: AttachmentPosition
}

const ErpAttachments: React.FC<ErpAttachmentsProps> = ({
  groups: allGroups,
  position,
}) => {
  const groups = allGroups.filter((g) => g.position === position)

  if (groups.length === 0) return null

  // ── product_tab ─────────────────────────────────────────────────────────────
  if (position === "product_tab") {
    return (
      <div className="w-full space-y-5">
        {groups.map((group) => {
          const images = group.files.filter((f) => isImage(f.extension))
          const documents = group.files.filter((f) => !isImage(f.extension))

          return (
            <div key={group.id}>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {group.title ||
                  group.files[0]?.category_name ||
                  `Category ${group.attachment_id}`}
              </p>

              {images.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto mb-2">
                  {images.map((file) => {
                    const href = getImageHref(file)
                    return (
                      <a
                        key={file.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 ${
                          !href ? "pointer-events-none" : ""
                        }`}
                      >
                        <img
                          src={getImageSrc(file)}
                          alt={file.customFilename || file.originalFilename}
                          className="w-12 h-12 rounded object-cover hover:opacity-80 transition-opacity"
                          loading="lazy"
                        />
                      </a>
                    )
                  })}
                </div>
              )}

              {documents.length > 0 && (
                <div className="grid gap-1.5">
                  {documents.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between py-2 px-2.5 rounded hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileIcon
                          extension={file.extension}
                          className="w-4 h-4 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {file.customFilename ||
                              file.originalFilename ||
                              file.name}
                          </p>
                          {file.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {getDocHref(file) && (
                        <a
                          href={getDocHref(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors flex-shrink-0 ml-2"
                        >
                          Λήψη
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ── before_add_to_cart ──────────────────────────────────────────────────────
  if (position === "before_add_to_cart") {
    return (
      <div className="w-full mb-3">
        {groups.map((group) => {
          const images = group.files.filter((f) => isImage(f.extension))
          const documents = group.files.filter((f) => !isImage(f.extension))

          return (
            <div key={group.id} className="py-3 mb-1 last:mb-0">
              <span className="text-sm font-semibold text-gray-900 mb-2 block">
                {group.title ||
                  group.files[0]?.category_name ||
                  `Category ${group.attachment_id}`}
              </span>

              {images.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto mb-2">
                  {images.map((file) => {
                    const href = getImageHref(file)
                    return (
                      <a
                        key={file.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 ${
                          !href ? "pointer-events-none" : ""
                        }`}
                      >
                        <img
                          src={getImageSrc(file)}
                          alt={file.customFilename || file.originalFilename}
                          className="w-16 h-16 rounded object-cover hover:opacity-80 transition-opacity"
                          loading="lazy"
                        />
                      </a>
                    )
                  })}
                </div>
              )}

              {documents.length > 0 && (
                <div className="space-y-1.5">
                  {documents.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileIcon
                          extension={file.extension}
                          className="w-4 h-4 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-800 truncate">
                          {file.customFilename ||
                            file.originalFilename ||
                            file.name}
                        </span>
                      </div>
                      {getDocHref(file) && (
                        <a
                          href={getDocHref(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-600 hover:text-gray-800 underline underline-offset-2 transition-colors flex-shrink-0 ml-2"
                        >
                          Λήψη
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // ── after_add_to_cart ───────────────────────────────────────────────────────
  if (position === "after_add_to_cart") {
    return (
      <div className="w-full mt-4">
        {groups.map((group) => {
          const images = group.files.filter((f) => isImage(f.extension))
          const documents = group.files.filter((f) => !isImage(f.extension))

          return (
            <div key={group.id} className="mb-2 last:mb-0">
              <span className="text-sm font-semibold text-gray-700 block mb-2">
                {group.title ||
                  group.files[0]?.category_name ||
                  `Category ${group.attachment_id}`}
              </span>

              {images.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto mb-2">
                  {images.map((file) => {
                    const href = getImageHref(file)
                    return (
                      <a
                        key={file.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 ${
                          !href ? "pointer-events-none" : ""
                        }`}
                      >
                        <img
                          src={getImageSrc(file)}
                          alt={file.customFilename || file.originalFilename}
                          className="w-12 h-12 rounded object-cover hover:opacity-80 transition-opacity"
                          loading="lazy"
                        />
                      </a>
                    )
                  })}
                </div>
              )}

              {documents.length > 0 && (
                <div className="space-y-1">
                  {documents.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-2.5 py-1.5 px-1 rounded hover:bg-gray-50 transition-colors"
                    >
                      <FileIcon
                        extension={file.extension}
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <p className="text-sm text-gray-800 truncate flex-1 min-w-0">
                        {file.customFilename ||
                          file.originalFilename ||
                          file.name}
                      </p>
                      {getDocHref(file) && (
                        <a
                          href={getDocHref(file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-600 hover:text-gray-800 underline underline-offset-2 transition-colors flex-shrink-0"
                        >
                          Λήψη
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return null
}

export default ErpAttachments
