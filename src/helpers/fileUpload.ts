interface CloudinaryResponse {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
}

export const fileUpload = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No tenemos ningún archivo a subir")
  }

  const cloudUrl = import.meta.env.VITE_CLOUDINARY_URL
  if (!cloudUrl) {
    throw new Error("URL de Cloudinary no configurada")
  }

  const formData = new FormData()
  formData.append("upload_preset", "reactjournal")
  formData.append("file", file)

  try {
    const resp = await fetch(cloudUrl, {
      method: "POST",
      body: formData,
    })

    if (!resp.ok) {
      throw new Error(
        `Error al subir imagen: ${resp.status} ${resp.statusText}`
      )
    }

    const cloudResp: CloudinaryResponse = await resp.json()
    return cloudResp.secure_url
  } catch (error) {
    console.error("Error en fileUpload:", error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("Error desconocido al subir archivo")
  }
}
