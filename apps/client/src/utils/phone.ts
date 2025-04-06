export function formatPhoneBR(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 10) {
      return digits.replace(
        /^(\d{0,2})(\d{0,4})(\d{0,4}).*/,
        (_, ddd, part1, part2) => {
          let result = '';
          if (ddd) result += `(${ddd}`;
          if (ddd.length === 2) result += `) `;
          if (part1) result += part1;
          if (part2) result += `-${part2}`;
          return result;
        }
      );
    }

    return digits.replace(
      /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
      (_, ddd, part1, part2) => {
        let result = '';
        if (ddd) result += `(${ddd}`;
        if (ddd.length === 2) result += `) `;
        if (part1) result += part1;
        if (part2) result += `-${part2}`;
        return result;
      }
    );
  }