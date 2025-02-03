export class base62 {
    private static BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    static encode(hexString: string) {
        let decNum = BigInt(`0x${hexString}`)
        let str = '';
        while (decNum > 0n) {
            str = this.BASE62_ALPHABET[Number(decNum % 62n)] + str;
            decNum /= 62n;
        }
        return str || '0'
    }

    static decode(str: string) {
        let num = 0n;
        for (let i = 0; i<str.length;i++) {
            const value = BigInt(this.BASE62_ALPHABET.indexOf(str[i]))
            num = num * 62n + value
        }
        let hexString = num.toString(16).padStart(24, "0")
        return hexString
    }
}