package com.moyucloud.shared;

import java.security.SecureRandom;

/** ULID generator used for every persisted identifier. */
public final class Ulid {
    private static final char[] ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();

    private Ulid() {}

    public static String next() {
        long time = System.currentTimeMillis();
        char[] out = new char[26];
        for (int i = 9; i >= 0; i--) {
            out[i] = ALPHABET[(int) (time & 31)];
            time >>>= 5;
        }
        byte[] random = new byte[10];
        RANDOM.nextBytes(random);
        for (int i = 10; i < 26; i++) {
            int bitOffset = (i - 10) * 5;
            int byteOffset = bitOffset / 8;
            int shift = bitOffset % 8;
            int value = (random[byteOffset] & 0xff) << 8;
            if (byteOffset + 1 < random.length) value |= random[byteOffset + 1] & 0xff;
            out[i] = ALPHABET[(value >>> (11 - shift)) & 31];
        }
        return new String(out);
    }
}
