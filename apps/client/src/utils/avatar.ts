import { COLORS } from "./colors";

const INITIAL_COLORS = {
    'A': COLORS.CORAL_RED,
    'B': COLORS.TURQUOISE,
    'C': COLORS.SKY_BLUE,
    'D': COLORS.MINT_GREEN,
    'E': COLORS.PASTEL_YELLOW,
    'F': COLORS.ANTIQUE_PINK,
    'G': COLORS.PURPLE,
    'H': COLORS.LIGHT_BLUE,
    'I': COLORS.ORANGE,
    'J': COLORS.EMERALD_GREEN,
    'K': COLORS.YELLOW,
    'L': COLORS.RED,
    'M': COLORS.DARK_TURQUOISE,
    'N': COLORS.NAVY_BLUE,
    'O': COLORS.DARK_PURPLE,
    'P': COLORS.PETROL_BLUE,
    'Q': COLORS.DARK_ORANGE,
    'R': COLORS.AQUA_GREEN,
    'S': COLORS.GREEN,
    'T': COLORS.BURNT_ORANGE,
    'U': COLORS.GRAY,
    'V': COLORS.ROYAL_BLUE,
    'W': COLORS.MEDIUM_PURPLE,
    'X': COLORS.EARTH_ORANGE,
    'Y': COLORS.NIGHT_BLUE,
    'Z': COLORS.GRAY
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
    const firstInitial = initials[0].toUpperCase() as keyof typeof INITIAL_COLORS;

    return INITIAL_COLORS[firstInitial] || '#718096';
}

export { getInitials, getColorByInitials };