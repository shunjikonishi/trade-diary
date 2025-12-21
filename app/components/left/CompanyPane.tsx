'use client'

import { useState, useEffect } from 'react'
import { MonitorStatus, MonitorStatusLabel, type Company } from '@/src/models/Company'

export default function CompanyPane() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    monitor_status: MonitorStatus.None,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 企業一覧を取得
  const fetchCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/companies')
      const result = await response.json()

      if (!response.ok) {
        console.error('Error fetching companies:', result.error)
        return
      }

      // 監視ステータスでソート（優先監視 > 監視 > 未監視）
      const sortedCompanies = (result.data || []).sort((a: Company, b: Company) => {
        // 監視ステータスで降順ソート（High=2 > Normal=1 > None=0）
        if (b.monitor_status !== a.monitor_status) {
          return b.monitor_status - a.monitor_status
        }
        // 同じステータスの場合は作成日時の降順
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      setCompanies(sortedCompanies)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // コンポーネントマウント時に企業一覧を取得
  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData({ name: '', code: '', monitor_status: MonitorStatus.None })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'エラーが発生しました')
        return
      }

      handleCloseModal()
      fetchCompanies() // 企業一覧を再読み込み
    } catch (error) {
      console.error('Error creating company:', error)
      alert('エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monitor_status' ? parseInt(value) || MonitorStatus.None : value,
    }))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>企業</h3>
        <button
          onClick={handleOpenModal}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem',
          }}
        >
          新規追加
        </button>
      </div>

      {/* 企業一覧テーブル */}
      {isLoading ? (
        <p>読み込み中...</p>
      ) : companies.length === 0 ? (
        <p>企業が登録されていません</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  企業名
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  企業コード
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  監視ステータス
                </th>
                <th
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  作成日時
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>{company.id}</td>
                  <td style={{ padding: '0.75rem', color: '#111827' }}>{company.name}</td>
                  <td style={{ padding: '0.75rem', color: '#111827' }}>{company.code}</td>
                  <td style={{ padding: '0.75rem', color: '#111827' }}>
                    {MonitorStatusLabel[company.monitor_status]}
                  </td>
                  <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                    {new Date(company.created_at).toLocaleString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* モーダルダイアログ */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>企業を追加</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  }}
                >
                  企業名 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  }}
                >
                  企業コード <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  }}
                >
                  監視ステータス <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  name="monitor_status"
                  value={formData.monitor_status}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {Object.values(MonitorStatus)
                    .filter((value) => typeof value === 'number')
                    .map((status) => (
                      <option key={status} value={status}>
                        {MonitorStatusLabel[status as MonitorStatus]}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                  }}
                >
                  {isSubmitting ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

