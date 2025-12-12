export const config = {
  appName: process.env.APP_NAME || 'POS App',
  taxRate: parseFloat(process.env.TAX_RATE || '0.11'),
  currency: 'IDR',
  locale: 'id-ID',
  
  backup: {
    dailyTime: '00:00', // Midnight
    weeklyDay: 0, // Sunday
    monthlyDate: 1, // First day of month
    retentionDays: {
      daily: 7,
      weekly: 30,
      monthly: 365,
    },
  },
  
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
  
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
}

export const paymentMethods = [
  { value: 'CASH', label: 'Tunai' },
  { value: 'DEBIT', label: 'Kartu Debit' },
  { value: 'CREDIT', label: 'Kartu Kredit' },
  { value: 'QRIS', label: 'QRIS' },
  { value: 'TRANSFER', label: 'Transfer Bank' },
] as const

export const roles = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'CASHIER', label: 'Kasir' },
] as const

export const backupTypes = [
  { value: 'DAILY', label: 'Harian' },
  { value: 'WEEKLY', label: 'Mingguan' },
  { value: 'MONTHLY', label: 'Bulanan' },
  { value: 'MANUAL', label: 'Manual' },
] as const
