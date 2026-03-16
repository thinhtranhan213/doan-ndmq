package com.imdb.util;

import java.util.Random;

public class OtpGenerator {
    private static final Random random = new Random();
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRATION_MINUTES = 10;

    public static String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public static long getOtpExpiration() {
        return System.currentTimeMillis() + (OTP_EXPIRATION_MINUTES * 60 * 1000);
    }

    public static boolean isOtpExpired(Long expirationTime) {
        return expirationTime == null || System.currentTimeMillis() > expirationTime;
    }
}
