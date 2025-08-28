import math
import time

def isPrime(n):
    if n < 2: return False
    if n % 2 == 0 and n != 2: return False
    r = int(math.sqrt(n))
    for i in range(3, r+1, 2):
        if n % i == 0:
            return False
    return True

def generatePerfectNumbers(limit):
    for p in range(2, limit + 1):
        mersenne = (2 ** p) - 1
        if isPrime(mersenne):
            perfectNum = (2 ** (p - 1)) * mersenne
            print(perfectNum, flush=True)  # flush ensures immediate streaming
            time.sleep(1)

generatePerfectNumbers(10000000000000000000000)

if __name__ == "__main__":
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    generatePerfectNumbers(limit)
