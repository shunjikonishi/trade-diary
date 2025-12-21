'use client'

import { useState } from 'react'
import CompanyPane from './left/CompanyPane'

type TabType = 'companies' | 'history' | 'diary'

export default function LeftPane() {
  const [activeTab, setActiveTab] = useState<TabType>('companies')

  const tabs = [
    { id: 'companies' as TabType, label: '企業', color: '#3b82f6', lightColor: '#dbeafe' },
    { id: 'history' as TabType, label: '履歴', color: '#10b981', lightColor: '#d1fae5' },
    { id: 'diary' as TabType, label: '日記', color: '#f59e0b', lightColor: '#fef3c7' },
  ]

  return (
    <div style={{ padding: '2rem', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '1rem' }}>Trade Diary</h2>

      {/* タブヘッダー */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0', borderBottom: '2px solid #e5e7eb' }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                backgroundColor: isActive ? tab.color : 'transparent',
                color: isActive ? '#ffffff' : '#6b7280',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                fontWeight: isActive ? '600' : '400',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                borderBottom: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                marginBottom: '-2px',
                position: 'relative' as const,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = tab.lightColor
                  e.currentTarget.style.color = tab.color
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* タブコンテンツ */}
      <div style={{ flex: 1, overflow: 'auto', marginTop: '1rem' }}>
        {activeTab === 'companies' && <CompanyPane />}
        {activeTab === 'history' && (
          <div>
            <h3>履歴</h3>
            <p>取引履歴がここに表示されます</p>
          </div>
        )}
        {activeTab === 'diary' && (
          <div>
            <h3>日記</h3>
            <p>日記がここに表示されます</p>
          </div>
        )}
      </div>
    </div>
  )
}

