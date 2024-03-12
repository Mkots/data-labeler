import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { makeServer } from "./api/server"
import { getMessage } from './api/getMessage'
import { updateLabel } from './api/updateLabel'

if (!import.meta.env.PROD) makeServer();

const keyMap = {
  SPAM: "1",
  OK: "2",
  HARM: "3"
};

const labelsMap = [
  "OK",
  "Spam",
  "Harm"
]

export const App: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState<{_id: string, text: string, label?: number}>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getMessage()
      .then((json) => {
        setCurrentMessage(json)
        setIsLoading(false)
      })
  }, [])

  const updateMessageLabel = (message: any, label: number) => {
    updateLabel(message, label)
    getMessage()
      .then((json) => {
        setCurrentMessage(json)
        setIsLoading(false)
      })
  }

  useHotkeys(keyMap.SPAM, () => updateMessageLabel(currentMessage, 100))
  useHotkeys(keyMap.OK, () => updateMessageLabel(currentMessage, 0))
  useHotkeys(keyMap.HARM, () => updateMessageLabel(currentMessage, 200))

  if (isLoading) {
    return (
      <main className="container">
        <article style={{ marginTop: "25vh", textAlign: "center" }}>
        <button aria-busy="true" className="outline">Please wait…</button>
        </article>
      </main>
    )
  }

  return (
    <main className="container">
      <article key={currentMessage!._id} style={{ marginTop: "25vh", textAlign: "center" }}>
        <header>Previously labeled as <strong>{labelsMap[currentMessage?.label || 0]}</strong></header>
        {currentMessage!.text}
        <footer>
          <div className="grid">
            <button type="button" style={{ backgroundColor: '#7d2424' }} onClick={() => updateMessageLabel(currentMessage, 100)}>[1] Spam</button>
            <button type="button" style={{ backgroundColor: '#2f6f1b' }} onClick={() => updateMessageLabel(currentMessage, 0)}>[2] OK</button>
            <button type="button" style={{ backgroundColor: '#a95025' }} onClick={() => updateMessageLabel(currentMessage, 200)}>[3] Harm</button>
          </div>
        </footer>
      </article>
    </main>
  )
}
