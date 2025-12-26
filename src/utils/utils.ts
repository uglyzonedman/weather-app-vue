export const days = [
  'Воскресенье',
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
]

export const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export const weatherCode = (code: number) => {
  switch (code) {
    case 0:
      return 'Ясно'

    case 1:
    case 2:
      return 'Переменная облачность'

    case 3:
      return 'Пасмурно'

    case 45:
    case 48:
      return 'Туман'

    case 51:
    case 53:
    case 55:
      return 'Морось'

    case 56:
    case 57:
      return 'Переохлаждённая морось'

    case 61:
    case 63:
    case 65:
      return 'Дождь'

    case 66:
    case 67:
      return 'Переохлаждённый дождь'

    case 71:
    case 73:
    case 75:
      return 'Снегопад'

    case 77:
      return 'Снежные зерна'

    case 80:
    case 81:
    case 82:
      return 'Ливни'

    case 85:
    case 86:
      return 'Снегопады сильные'

    case 95:
      return 'Гроза'

    case 96:
    case 99:
      return 'Гроза с градом'

    default:
      return 'Неизвестная погода'
  }
}
