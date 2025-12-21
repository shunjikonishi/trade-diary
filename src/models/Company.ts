/**
 * モニターステータスの定義
 */
export enum MonitorStatus {
  /** 未監視 */
  None = 0,
  /** 監視 */
  Normal = 1,
  /** 優先監視 */
  High = 2,
}

/**
 * モニターステータスのラベル
 */
export const MonitorStatusLabel: Record<MonitorStatus, string> = {
  [MonitorStatus.None]: '未監視',
  [MonitorStatus.Normal]: '監視',
  [MonitorStatus.High]: '優先監視',
}

/**
 * 企業モデル
 */
export interface Company {
  id: number
  name: string
  code: string
  monitor_status: MonitorStatus
  created_at: Date | string
  updated_at: Date | string
}

/**
 * 企業作成時の入力データ（IDとタイムスタンプを除く）
 */
export interface CreateCompanyInput {
  name: string
  code: string
  monitor_status: MonitorStatus
}

/**
 * 企業更新時の入力データ（すべてオプショナル）
 */
export interface UpdateCompanyInput {
  name?: string
  code?: string
  monitor_status?: MonitorStatus
}

