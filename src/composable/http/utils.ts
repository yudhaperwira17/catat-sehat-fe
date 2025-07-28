export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const BMIStatus = {
  MALNUTRITION: 'MALNUTRITION',
  UNDERNUTRITION: 'UNDERNUTRITION',
  NORMAL: 'NORMAL',
  OVERWEIGHT: 'OVERWEIGHT',
  OBESITY: 'OBESITY'
}

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
}

export const BMI_RANGES = {
  [Gender.FEMALE]: [
    {
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 11.9, status: BMIStatus.MALNUTRITION },
        { min: 12, max: 13.1, status: BMIStatus.UNDERNUTRITION },
        { min: 13.2, max: 18.4, status: BMIStatus.NORMAL },
        { min: 18.5, max: 20.4, status: BMIStatus.OVERWEIGHT },
        { min: 20.5, max: Infinity, status: BMIStatus.OBESITY }
      ]
    },
    {
      min: 2,
      max: 5,
      ranges: [
        { min: 0, max: 11.6, status: BMIStatus.MALNUTRITION },
        { min: 11.7, max: 12.6, status: BMIStatus.UNDERNUTRITION },
        { min: 12.7, max: 18.7, status: BMIStatus.NORMAL },
        { min: 18.8, max: 20.9, status: BMIStatus.OVERWEIGHT },
        { min: 21, max: Infinity, status: BMIStatus.OBESITY }
      ]
    }
    // Tambahkan rentang lainnya jika perlu
  ],
  [Gender.MALE]: [
    {
      min: 0,
      max: 2,
      ranges: [
        { min: 0, max: 12.5, status: BMIStatus.MALNUTRITION },
        { min: 12.6, max: 13.5, status: BMIStatus.UNDERNUTRITION },
        { min: 13.6, max: 18.5, status: BMIStatus.NORMAL },
        { min: 18.6, max: 20.1, status: BMIStatus.OVERWEIGHT },
        { min: 20.2, max: Infinity, status: BMIStatus.OBESITY }
      ]
    }
    // Tambahkan rentang lainnya jika perlu
  ]
}
