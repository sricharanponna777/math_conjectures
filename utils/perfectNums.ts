function isPrime(num: number): boolean {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

// Generate perfect numbers using Euclid’s formula
export default function generatePerfectNumbers(limit: number): number[] {
    const perfectNumbers: number[] = [];

    for (let p = 2; p <= limit; p++) {
        const mersenne = Math.pow(2, p) - 1;
        if (isPrime(mersenne)) {
            const perfectNum = Math.pow(2, p - 1) * mersenne;
            perfectNumbers.push(perfectNum);
        }
    }

    return perfectNumbers;
}
