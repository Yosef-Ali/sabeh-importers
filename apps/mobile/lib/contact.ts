/**
 * Contact helpers — WhatsApp deeplink + tel: fallback.
 *
 * Ethiopia context: WhatsApp is the dominant buyer↔seller channel even on
 * marketplace apps. We try the native `whatsapp://` scheme first (opens the
 * app directly with a pre-filled message), then fall back to `https://wa.me/`
 * which works in the browser and triggers the OS app handler if installed.
 *
 * Phone numbers must be E.164 (with the leading `+`). The `wa.me` and
 * WhatsApp scheme both expect the country code without the `+` or any
 * formatting — we strip non-digits at the boundary.
 */
import { Linking, Alert } from "react-native";

function toDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function openWhatsApp(phone: string, message: string): Promise<void> {
  const digits = toDigits(phone);
  const text = encodeURIComponent(message);
  const nativeUrl = `whatsapp://send?phone=${digits}&text=${text}`;
  const webUrl = `https://wa.me/${digits}?text=${text}`;

  try {
    const canOpenNative = await Linking.canOpenURL(nativeUrl);
    await Linking.openURL(canOpenNative ? nativeUrl : webUrl);
  } catch {
    Alert.alert(
      "Couldn't open WhatsApp",
      "Make sure WhatsApp is installed, or copy the number to message the seller manually.",
    );
  }
}

export async function openPhoneCall(phone: string): Promise<void> {
  const url = `tel:${toDigits(phone)}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Couldn't start call", "Your device doesn't support phone calls from this app.");
  }
}
