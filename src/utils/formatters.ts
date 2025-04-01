/**
 * Форматирует дату в соответствии с выбранной локалью
 * 
 * @param dateString Строка с датой в формате "Month YYYY — Month YYYY" или "Month YYYY"
 * @param locale Локаль для форматирования (например, 'ru-RU', 'en-US')
 * @param options Опции форматирования для Intl.DateTimeFormat
 * @returns Отформатированная дата в соответствии с локалью
 */
export function formatDateRange(
  dateString: string,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }
): string {
  if (!dateString) return '';

  // Разбиваем строку на две части, если есть тире "—"
  const parts = dateString.split('—');
  
  // Обрабатываем каждую часть отдельно
  const formattedParts = parts.map(part => {
    // Удаляем лишние пробелы
    const trimmedPart = part.trim();
    
    try {
      // Парсим дату из строки (формат "Month YYYY")
      const [month, year] = trimmedPart.split(' ');
      
      // Месяцы в JavaScript начинаются с 0, поэтому нужно найти номер месяца
      const monthIndex = getMonthIndex(month);
      
      if (monthIndex === -1 || !year) {
        // Если не удалось разобрать дату, возвращаем исходную строку
        return trimmedPart;
      }
      
      // Создаем объект даты
      const date = new Date(parseInt(year), monthIndex);
      
      // Форматируем дату с использованием Intl.DateTimeFormat
      const formattedDate = new Intl.DateTimeFormat(locale, options).format(date);
      
      // Делаем первую букву месяца заглавной
      return capitalizeFirstLetter(formattedDate);
    } catch (error) {
      // В случае ошибки возвращаем исходную строку
      console.error(`Error formatting date: ${trimmedPart}`, error);
      return trimmedPart;
    }
  });
  
  // Соединяем отформатированные части тире с пробелами
  return formattedParts.join(' — ');
}

/**
 * Возвращает индекс месяца (0-11) по его английскому названию
 */
function getMonthIndex(monthName: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthIndex = months.findIndex(
    month => month.toLowerCase() === monthName.toLowerCase()
  );
  
  return monthIndex;
}

/**
 * Делает первую букву строки заглавной
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
} 