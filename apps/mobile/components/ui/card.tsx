import { View, type ViewProps } from "react-native";
import { colors, shadows } from "@/lib/theme";

/**
 * Sabeh card — white surface, 1px navy border, hard shadow. RN equivalent
 * of the web Card primitive. Set `hardShadow={false}` for inert containers
 * (e.g., when nested inside another shadowed card).
 */
export function Card({
  children,
  hardShadow = true,
  style,
  ...rest
}: { children: React.ReactNode; hardShadow?: boolean } & ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 0,
          ...(hardShadow ? shadows.hard : {}),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
