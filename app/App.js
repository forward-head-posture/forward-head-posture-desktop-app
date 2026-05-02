import React, { useState, useEffect, useCallback, useRef } from "react"
import { Container } from "react-bootstrap"
import { ipcRenderer } from "electron"
import ForwardHeadPosture from "react-forward-head-posture"
import Store from "electron-store"

const store = new Store()
const MAX_SAMPLES = 10

export default function App() {
  const recentScores = useRef([])
  const [under, setUnder] = useState(store.get("under", 0))
  const [averageScore, setAverageScore] = useState(0)
  const onEstimate = useCallback(score => {
    const scores = recentScores.current
    if (scores.length >= MAX_SAMPLES) {
      scores.shift()
    }
    scores.push(score)
    const average = scores.reduce((sum, value) => sum + value, 0) / scores.length
    setAverageScore(average)
    ipcRenderer.send("average", average)
  }, [])

  useEffect(() => {
    if (averageScore < under) {
      // eslint-disable-next-line no-new
      new Notification(`score: ${averageScore}`)
    }
  }, [averageScore, under])

  return (
    <Container>
      <div className="d-flex">
        <h4>Alert under : </h4>
        <input
          type="number"
          value={under}
          onChange={e => {
            const value = Number(e.target.value)
            setUnder(value)
            store.set("under", value)
          }}
        />
      </div>
      <h5>score: {averageScore}</h5>
      <div style={{ height: "80%", width: "100%" }}>
        <ForwardHeadPosture onEstimate={onEstimate} frameRate={5} />
      </div>
    </Container>
  )
}
