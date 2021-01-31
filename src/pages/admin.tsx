import React, { useRef, FormEvent } from 'react'
import Papa from 'papaparse'
import send from '../utils/request'

// TODO PROTECT ROUTE
const Admin = (): JSX.Element => {
  const inputEl = useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    // disable submit button
    if (inputEl.current && inputEl.current.files) {
      const csv = inputEl.current.files[0]
      Papa.parse(csv, {
        worker: true,
        complete: async results => await send('/api/import', results),
        header: true
      })
    }

    // if no file give error
  }
  return (
    <div style={{ margin: '2rem' }}>
      <h1>Admin</h1>

      <form encType="multipart/form-data" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="csvInput">
            Choose CSV file to import guest list.
          </label>
          <input
            type="file"
            ref={inputEl}
            id="csvInput"
            name="csvInput"
            accept=".csv"
          />
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Admin
