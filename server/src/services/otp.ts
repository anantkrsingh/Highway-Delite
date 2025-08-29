export function generateOtp(length: number = 6, durationMs: number = 5 * 60 * 1000) {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }

    const expiresAt = Date.now() + durationMs;

    return {
        otp,
        expiresAt
    };
}