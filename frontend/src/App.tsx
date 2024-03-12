import { useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { CiSquareChevLeft, CiSquareChevRight } from "react-icons/ci";

import { makeServer } from "./api/server"
import { getMessage } from './api/getMessage'
import { updateLabel } from './api/updateLabel'

if (!import.meta.env.PROD) makeServer();

const keyMap = {
  BAD: ["1", "left"],
  OK: ["2", "right"],
};

const labelsMap = [
  "OK",
  "BAD"
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
    setIsLoading(true)
    updateLabel(message, label)
    getMessage()
      .then((json) => {
        setCurrentMessage(json)
        setIsLoading(false)
      })
  }

  useHotkeys(keyMap.BAD, () => updateMessageLabel(currentMessage, 1))
  useHotkeys(keyMap.OK, () => updateMessageLabel(currentMessage, 0))

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
      <article key={currentMessage!.text} style={{ marginTop: "25vh", textAlign: "center" }}>
        <header>Previously labeled as <strong>{labelsMap[currentMessage?.label || 0]}</strong></header>
        {currentMessage!.text}
        <footer>
          <div className="grid">
            <button type="button" style={{ backgroundColor: '#7d2424' }} onClick={() => updateMessageLabel(currentMessage, 1)}>
            <CiSquareChevLeft size={32}/> BAD</button>
            <button type="button" style={{ backgroundColor: '#2f6f1b' }} onClick={() => updateMessageLabel(currentMessage, 0)}>
            OK <CiSquareChevRight size={32}/></button>
          </div>
        </footer>
      </article>
    </main>
  )
}
