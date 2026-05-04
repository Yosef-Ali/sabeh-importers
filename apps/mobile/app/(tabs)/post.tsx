import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/theme";

/**
 * Post a listing — placeholder. Real flow needs camera/photo upload,
 * category picker, price/title fields, condition selector. Wire to the
 * web app's /api/listings POST endpoint when auth lands.
 */
export default function PostScreen() {
  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background, padding: 24, gap: 16 }}>
      <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 10, color: colors.gold, textTransform: "uppercase", letterSpacing: 2, marginTop: 32 }}>
        New Listing
      </Text>
      <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 28, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.5 }}>
        Post your asset
      </Text>
      <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: colors.muted, lineHeight: 22 }}>
        Add photos, set a price, choose a category. Verified sellers reach more buyers.
      </Text>
      <View style={{ marginTop: 24 }}>
        <Button fullWidth>Start a listing</Button>
      </View>
    </SafeAreaView>
  );
}
