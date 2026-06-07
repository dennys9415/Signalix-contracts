import type { ISODateString, UUID } from "../shared";

/**
 * Cryptographic foundation contracts (v0.8.0).
 *
 * These DTOs describe the wire format for device keys and key bundles that
 * future Signal-Protocol-style E2EE will exchange. They are intentionally
 * pure data shapes: nothing in this file performs encryption, KDF, or
 * signature verification. v0.8.0 only stores and serves these blobs;
 * v0.9.0 will start using them to actually encrypt messages.
 *
 * All raw key material is transported as **base64url** strings (without
 * padding) for portability across HTTP / JSON.
 */

/** Algorithm tag for forward-compatibility. v0.8.0 only ships "x25519". */
export type KeyAlgorithm = "x25519";

/**
 * The device's long-term identity key, used to authenticate the device
 * in handshakes. Includes a separate signing key (Ed25519) and a 32-bit
 * registration ID for session disambiguation (Signal-style).
 */
export interface DeviceIdentityKeyDTO {
  deviceId: UUID;
  /** base64url X25519 public key, 32 bytes raw. */
  identityKey: string;
  /** base64url Ed25519 public signing key, 32 bytes raw. */
  signingKey: string;
  /** 32-bit unsigned int. Persisted as INTEGER. */
  registrationId: number;
  algorithm: KeyAlgorithm;
  registeredAt: ISODateString;
}

/**
 * Long-lived one-time pre-key. Consumed by the *first* message of a new
 * session — once `consumedAt` is set, the row is no longer returned in
 * bundles.
 */
export interface PreKeyDTO {
  keyId: number;
  /** base64url X25519 public key, 32 bytes raw. */
  publicKey: string;
  algorithm: KeyAlgorithm;
}

/**
 * Signed pre-key. The device's current signed pre-key is the one with the
 * highest `keyId` that has not been rotated out. Signed by the device's
 * Ed25519 signing key.
 */
export interface SignedPreKeyDTO {
  keyId: number;
  /** base64url X25519 public key, 32 bytes raw. */
  publicKey: string;
  /** base64url Ed25519 signature over `publicKey`, 64 bytes raw. */
  signature: string;
  algorithm: KeyAlgorithm;
}

/**
 * The complete bundle a sender needs to start a session with a recipient
 * device. `preKey` is optional — when the recipient's one-time pre-key
 * pool is exhausted the server returns the signed pre-key only and the
 * sender falls back to a slightly-less-forward-secret handshake.
 *
 * Each call to `GET /crypto/users/:userId/key-bundle` consumes one
 * one-time pre-key per returned device.
 */
export interface DeviceKeyBundleDTO {
  deviceId: UUID;
  identityKey: string;
  signingKey: string;
  registrationId: number;
  algorithm: KeyAlgorithm;
  signedPreKey: SignedPreKeyDTO;
  preKey?: PreKeyDTO;
}

export interface KeyBundleResponse {
  userId: UUID;
  bundles: DeviceKeyBundleDTO[];
}

/**
 * Initial publication of the device's key material. Sent once on a fresh
 * device, then never again — subsequent rotations use the dedicated
 * endpoints below. The signed pre-key + initial pre-key batch arrive
 * together so the device is immediately reachable.
 */
export interface RegisterDeviceKeysRequest {
  registrationId: number;
  identityKey: string;
  signingKey: string;
  signedPreKey: SignedPreKeyDTO;
  preKeys: PreKeyDTO[];
  algorithm?: KeyAlgorithm;
}

export interface RegisterDeviceKeysResponse {
  deviceId: UUID;
  preKeyCount: number;
}

/** Periodic signed-pre-key rotation. Typically every ~30 days. */
export interface RotateSignedPreKeyRequest {
  signedPreKey: SignedPreKeyDTO;
}

export interface RotateSignedPreKeyResponse {
  deviceId: UUID;
  signedPreKey: SignedPreKeyDTO;
}

/** Top-up the pool of one-time pre-keys after several have been consumed. */
export interface UploadPreKeysRequest {
  preKeys: PreKeyDTO[];
  algorithm?: KeyAlgorithm;
}

export interface UploadPreKeysResponse {
  deviceId: UUID;
  /** Total *unconsumed* pre-keys on this device after the upload. */
  preKeyCount: number;
}
