/**
 * Formata minutos em horas e minutos de forma legível
 * @param minutes - Total de minutos
 * @returns String formatada (ex: "2h 30min" ou "45min")
 */
export const formatTimeFromMinutes = (minutes: number): string => {
	if (minutes < 60) {
		return `${minutes}min`;
	}
	
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	
	if (remainingMinutes === 0) {
		return `${hours}h`;
	}
	
	return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formata um número grande com sufixo K, M, etc.
 * @param num - Número a ser formatado
 * @returns String formatada (ex: "1.5k", "2.3M")
 */
export const formatLargeNumber = (num: number): string => {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k';
	}
	return Math.round(num).toString();
}; 