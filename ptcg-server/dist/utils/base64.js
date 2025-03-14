// export class Base64 {
//   public decode(s: string): string {
//     return decodeURIComponent(escape(atob(s)));
//   }
//   public encode(s: string): string {
//     return btoa(unescape(encodeURIComponent(s)));
//   }
// }
export class Base64 {
    constructor() {
        this.padchar = '=';
        this.alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    }
    getByte64(s, i) {
        const idx = this.alpha.indexOf(s.charAt(i));
        if (idx === -1) {
            throw new Error('Cannot decode base64');
        }
        return idx;
    }
    decode(s) {
        // convert to string
        s = String(s);
        let pads = 0;
        let imax = s.length;
        if (imax === 0) {
            return s;
        }
        if (imax % 4 !== 0) {
            throw new Error('Cannot decode base64');
        }
        if (s.charAt(imax - 1) === this.padchar) {
            pads = 1;
            if (s.charAt(imax - 2) === this.padchar) {
                pads = 2;
            }
            // either way, we want to ignore this last block
            imax -= 4;
        }
        const x = [];
        let b10;
        let i;
        for (i = 0; i < imax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) |
                (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
        }
        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) |
                    (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
            default:
        }
        return x.join('');
    }
    getByte(s, i) {
        const x = s.charCodeAt(i);
        if (x > 255) {
            throw new Error('INVALID_CHARACTER_ERR: DOM Exception 5');
        }
        return x;
    }
    encode(s) {
        s = String(s);
        const imax = s.length - s.length % 3;
        if (s.length === 0) {
            return s;
        }
        const x = [];
        let b10;
        let i;
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.alpha.charAt(b10 >> 18));
            x.push(this.alpha.charAt((b10 >> 12) & 0x3F));
            x.push(this.alpha.charAt((b10 >> 6) & 0x3f));
            x.push(this.alpha.charAt(b10 & 0x3f));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 0x3F) +
                    this.padchar + this.padchar);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.alpha.charAt(b10 >> 18) + this.alpha.charAt((b10 >> 12) & 0x3F) +
                    this.alpha.charAt((b10 >> 6) & 0x3f) + this.padchar);
                break;
            default:
        }
        return x.join('');
    }
}
