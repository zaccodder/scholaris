const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const isValidUUID = (id: string | string[]): boolean => {
  if (Array.isArray(id)) {
    if (id.length === 0) return false
    return id.every((item) => UUID_REGEX.test(item))
  }
  return UUID_REGEX.test(id)
}

export default isValidUUID
