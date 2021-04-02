import React, { useRef, useState, FormEvent } from 'react'
import Papa from 'papaparse'
import useRequest, { Response } from '../../utils/use-request'
import { Container } from './index-sc'

const Admin = (): JSX.Element => {
  const inputEl = useRef<HTMLInputElement>(null)
  const submitEl = useRef<HTMLButtonElement>(null)

  const [isSuccess, setIsSuccess] = useState<boolean>(true)
  const [resMessage, setResMessage] = useState<string>('')

  const send = useRequest()

  const relayResponse = (res: Response<[]>) => {
    if (res.error) {
      setIsSuccess(false)
      setResMessage(`Error: ${res.error}`)
    } else {
      setIsSuccess(true)
      setResMessage(`Success! ${res.data?.length} entries have been added.`)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (inputEl.current && inputEl.current.files?.length) {
      submitEl.current && submitEl.current.setAttribute('disabled', 'true')
      const csv = inputEl.current.files[0]
      Papa.parse(csv, {
        worker: true,
        complete: async results => {
          const response = (await send('/api/import', results)) as Response<[]>
          relayResponse(response)
          submitEl.current && submitEl.current.removeAttribute('disabled')
        },
        header: true
      })
    } else {
      setIsSuccess(false)
      setResMessage('Whoops! Select a csv file to import.')
    }
  }

  return (
    <Container pColor={isSuccess}>
      <h1>Admin</h1>

      <section>{resMessage && <p>{resMessage}</p>}</section>

      <section>
        <hr />
        <h3>Import</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="csvInput">
            Choose CSV file to import guest list (headers must contain
            &quot;first_name&quot;, &quot;last_name&quot;, &quot;family&quot;)
          </label>
          <input
            type="file"
            ref={inputEl}
            id="csvInput"
            name="csvInput"
            aria-label="csv-input"
            accept=".csv"
          />
          <button type="submit" ref={submitEl}>
            Submit
          </button>
        </form>
      </section>

      <section>
        <hr />
        <h4>Export</h4>
        <label>Download guest list</label>
        <button>Export</button>
      </section>

      <hr />
    </Container>
  )
}

export default Admin
