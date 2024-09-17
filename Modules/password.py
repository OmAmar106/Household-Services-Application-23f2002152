
MOD = 10**9 + 7

def getHash(left, right,hashL,power):
    left += 1
    right += 1
    h1 = hashL[right]
    h2 = (hashL[left - 1] * power[right - left + 1]) % MOD
    return (h1 + MOD - h2) % MOD

def hash(st):
    n = len(st)
    hashL = [0] * (n + 1)
    power = [0] * (n + 1)
    P = 131
    power[0] = 1
    for i in range(n):
        power[i + 1] = (power[i] * P) % MOD
        hashL[i + 1] = (hashL[i] * P + ord(st[i])) % MOD
    return str(getHash(0,n-1,hashL,power))
