const INITIAL_COLORS: { [key: string]: string } = {
    'A': '#FF6B6B', // Vermelho coral
    'B': '#4ECDC4', // Turquesa
    'C': '#45B7D1', // Azul celeste
    'D': '#96CEB4', // Verde menta
    'E': '#FFEEAD', // Amarelo pastel
    'F': '#D4A5A5', // Rosa antigo
    'G': '#9B59B6', // Roxo
    'H': '#3498DB', // Azul claro
    'I': '#E67E22', // Laranja
    'J': '#2ECC71', // Verde esmeralda
    'K': '#F1C40F', // Amarelo
    'L': '#E74C3C', // Vermelho
    'M': '#1ABC9C', // Turquesa escuro
    'N': '#34495E', // Azul marinho
    'O': '#8E44AD', // Roxo escuro
    'P': '#2C3E50', // Azul petróleo
    'Q': '#F39C12', // Laranja escuro
    'R': '#16A085', // Verde água
    'S': '#27AE60', // Verde
    'T': '#D35400', // Laranja queimado
    'U': '#7F8C8D', // Cinza
    'V': '#C0392B', // Vermelho escuro
    'W': '#2980B9', // Azul royal
    'X': '#8E44AD', // Roxo médio
    'Y': '#D35400', // Laranja terra
    'Z': '#2C3E50'  // Azul noite
};

const getInitials = (name: string): string | null => {
    if (!name) {
        return null;
    }

    const nameParts = name.split(' ');
    const firstLetterUppercase = nameParts[0][0].toUpperCase();

    const initials = nameParts.length > 1
        ? `${firstLetterUppercase}${nameParts[1][0].toUpperCase()}`
        : firstLetterUppercase;

    return initials;
}

const getColorByInitials = (initials: string) => {
    return INITIAL_COLORS[initials[0]] || '#718096';
}

export { getInitials, getColorByInitials };