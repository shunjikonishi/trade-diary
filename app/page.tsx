'use client'

import { Panel, Group, Separator } from 'react-resizable-panels'
import LeftPane from './components/LeftPane'
import RightPane from './components/RightPane'

export default function Home() {
  return (
    <main style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
      <Group orientation="horizontal" style={{ width: '100%', height: '100%' }}>
        <Panel defaultSize={50} minSize={20}>
          <LeftPane />
        </Panel>
        <Separator style={{ width: '4px', backgroundColor: '#e0e0e0', cursor: 'col-resize' }} />
        <Panel defaultSize={50} minSize={20}>
          <RightPane />
        </Panel>
      </Group>
    </main>
  )
}

