export class ValidationError extends Error {
  errors: { type: string; message: string }[]

  constructor(errors: VError[]) {
    super('ValidationError')

    this.name = 'ValidationError'
    this.errors = errors.map((error: VError) => ({
      type: error.keyword,
      prop: error.dataPath?.replace(/\/data\/[\d+]\//, ''),
      message: error.message
    }))
  }
}

// based on return of ajv validation
type VError = {
  keyword: string
  dataPath?: string
  message?: string
}
