import pdfParse from 'pdf-parse'

const MIN_CHARS_PER_PAGE = 50

export async function extractPdfText(buffer) {
  const data = await pdfParse(buffer)
  const numPages = data.numpages || 1
  const text = (data.text || '').trim()
  const charsPerPage = text.length / numPages
  const isScanned = charsPerPage < MIN_CHARS_PER_PAGE

  return { text, numPages, charsPerPage, isScanned }
}
