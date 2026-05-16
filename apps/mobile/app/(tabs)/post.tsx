import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { CONDITIONS, type Condition, type Currency } from "@/lib/mock-data";
import {
  createListing,
  NotConfiguredError,
  NotAuthenticatedError,
  ApiError,
} from "@/lib/api";
import { colors, shadows } from "@/lib/theme";

/**
 * Post a Listing — 4-step wizard mirroring the web's ListingWizardContainer.
 *
 *  Step 1: Category       → same categories as web (getCategories())
 *  Step 2: Title + Loc    → title (English + Amharic), location
 *  Step 3: Price + Cond   → price, currency (ETB/USD), condition
 *  Step 4: Review         → summary card + submit
 */

type CategoryEntry = { name: string; icon: ComponentProps<typeof Feather>["name"] };

const LISTING_CATEGORIES: CategoryEntry[] = [
  { name: "Motors",       icon: "truck"      },
  { name: "Electronics",  icon: "cpu"        },
  { name: "Machinery",    icon: "tool"       },
  { name: "Property",     icon: "home"       },
  { name: "Industrial",   icon: "zap"        },
  { name: "Agriculture",  icon: "sun"        },
];

const CURRENCIES: Array<{ value: Currency; label: string }> = [
  { value: "ETB", label: "ETB — Ethiopian Birr" },
  { value: "USD", label: "USD — US Dollar" },
];

const TOTAL_STEPS = 4;

type FormState = {
  category: string;
  title: string;
  titleAm: string;
  location: string;
  price: string;
  currency: Currency;
  condition: Condition;
  description: string;
};

const EMPTY_FORM: FormState = {
  category: "",
  title: "",
  titleAm: "",
  location: "",
  price: "",
  currency: "ETB",
  condition: "NEW",
  description: "",
};

function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
        Step {step} of {TOTAL_STEPS}
      </Text>
      <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 24, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.5 }}>
        {title}
      </Text>
      <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 13, color: colors.muted, marginTop: 4 }}>
        {subtitle}
      </Text>
    </View>
  );
}

function ProgressBar({ current }: { current: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 4, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 3,
            backgroundColor: i < current ? colors.gold : colors.border,
          }}
        />
      ))}
    </View>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 6 }}>
      {label}
    </Text>
  );
}

function TextBox({
  value, onChangeText, placeholder, multiline, keyboardType,
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.muted}
      multiline={multiline}
      keyboardType={keyboardType ?? "default"}
      style={{
        fontFamily: "DMSans_400Regular",
        fontSize: 14,
        color: colors.foreground,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minHeight: multiline ? 80 : undefined,
        textAlignVertical: multiline ? "top" : "center",
        marginBottom: 16,
      }}
    />
  );
}

export default function PostScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function canAdvance() {
    if (step === 1) return form.category !== "";
    if (step === 2) return form.title.trim() !== "" && form.location.trim() !== "";
    if (step === 3) return form.price.trim() !== "" && Number(form.price) > 0;
    return true;
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await createListing({
        title: form.title.trim(),
        titleAmharic: form.titleAm.trim() || undefined,
        description: form.description.trim() || undefined,
        price: Number(form.price),
        currency: form.currency,
        category: form.category,
        location: form.location.trim(),
        condition: form.condition,
      });
      setSubmitted(true);
    } catch (e) {
      if (e instanceof NotAuthenticatedError) {
        Alert.alert(
          "Sign in required",
          "You need to be signed in to post a listing. Sign-in is coming to the mobile app — for now, please post from the web at sabeh.market.",
        );
      } else if (e instanceof NotConfiguredError) {
        Alert.alert(
          "Backend not configured",
          "Set EXPO_PUBLIC_API_BASE_URL to enable listing submission from the mobile app.",
        );
      } else if (e instanceof ApiError) {
        Alert.alert("Couldn't post listing", e.message);
      } else {
        Alert.alert("Couldn't post listing", "Please check your connection and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 32, gap: 16 }}>
        <View style={{ width: 64, height: 64, backgroundColor: "rgba(16,185,129,0.1)", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#10B981" }}>
          <Feather name="check" size={28} color="#10B981" />
        </View>
        <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 22, color: colors.foreground, textTransform: "uppercase", letterSpacing: -0.5, textAlign: "center" }}>
          Listing Submitted
        </Text>
        <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 22 }}>
          Your listing is pending review. You'll see it under{" "}
          <Text style={{ color: colors.gold }}>Pending Review</Text> in your dashboard.
        </Text>
        <View style={{ width: "100%", marginTop: 16, gap: 8 }}>
          <Button fullWidth onPress={() => { setSubmitted(false); setForm(EMPTY_FORM); setStep(1); }}>
            Post Another
          </Button>
          <Button variant="outline" fullWidth onPress={() => router.push("/(tabs)/" as any)}>
            Go to Dashboard
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          {step > 1 ? (
            <Pressable onPress={() => setStep((s) => s - 1)} style={{ width: 36, height: 36, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
              <Feather name="arrow-left" size={18} color={colors.foreground} />
            </Pressable>
          ) : (
            <View style={{ width: 36 }} />
          )}
          <Text style={{ flex: 1, fontFamily: "SpaceGrotesk_700Bold", fontSize: 14, color: colors.foreground, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Post a Listing
          </Text>
        </View>

        <ProgressBar current={step} />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

          {/* ── Step 1: Category ─────────────────────────────────────── */}
          {step === 1 && (
            <View>
              <StepHeader step={1} title="Select Category" subtitle="Choose the category that best describes your item." />
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {LISTING_CATEGORIES.map((cat) => {
                  const active = form.category === cat.name;
                  return (
                    <Pressable
                      key={cat.name}
                      onPress={() => set("category", cat.name)}
                      style={{
                        width: "47%",
                        padding: 16,
                        borderWidth: active ? 2 : 1,
                        borderColor: active ? colors.navy : colors.border,
                        backgroundColor: active ? colors.navy : colors.surface,
                        alignItems: "center",
                        gap: 8,
                        ...(active ? shadows.hard : {}),
                      }}
                    >
                      <Feather name={cat.icon} size={22} color={active ? colors.gold : colors.muted} />
                      <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 11, color: active ? colors.gold : colors.foreground, textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {cat.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Step 2: Title + Location ─────────────────────────────── */}
          {step === 2 && (
            <View>
              <StepHeader step={2} title="Listing Details" subtitle="Give your listing a clear title and location." />

              <FieldLabel label="Title (English) *" />
              <TextBox value={form.title} onChangeText={(v) => set("title", v)} placeholder="e.g. BYD Atto 3 2024 – Like New" />

              <FieldLabel label="Title (Amharic — optional)" />
              <TextBox value={form.titleAm} onChangeText={(v) => set("titleAm", v)} placeholder="ለምሳሌ፡ BYD አቶ 3 2024" />

              <FieldLabel label="Location *" />
              <TextBox value={form.location} onChangeText={(v) => set("location", v)} placeholder="e.g. Addis Ababa, Bole" />
            </View>
          )}

          {/* ── Step 3: Price + Condition ────────────────────────────── */}
          {step === 3 && (
            <View>
              <StepHeader step={3} title="Price & Condition" subtitle="Set your asking price and item condition." />

              <FieldLabel label="Asking Price *" />
              <TextBox value={form.price} onChangeText={(v) => set("price", v)} placeholder="e.g. 4500000" keyboardType="numeric" />

              {/* Currency selector */}
              <FieldLabel label="Currency" />
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
                {CURRENCIES.map((c) => {
                  const active = form.currency === c.value;
                  return (
                    <Pressable
                      key={c.value}
                      onPress={() => set("currency", c.value)}
                      style={{ flex: 1, padding: 12, borderWidth: active ? 2 : 1, borderColor: active ? colors.navy : colors.border, backgroundColor: active ? colors.navy : colors.surface, alignItems: "center", ...(active ? shadows.hard : {}) }}
                    >
                      <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: active ? colors.gold : colors.foreground }}>
                        {c.value}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Condition selector */}
              <FieldLabel label="Condition" />
              <View style={{ gap: 8 }}>
                {CONDITIONS.map((c) => {
                  const active = form.condition === c.value;
                  return (
                    <Pressable
                      key={c.value}
                      onPress={() => set("condition", c.value)}
                      style={{ flexDirection: "row", alignItems: "center", padding: 12, borderWidth: active ? 2 : 1, borderColor: active ? colors.navy : colors.border, backgroundColor: active ? "rgba(10,25,47,0.04)" : colors.surface, gap: 12 }}
                    >
                      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: active ? colors.navy : colors.border, alignItems: "center", justifyContent: "center" }}>
                        {active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.navy }} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 13, color: colors.foreground, textTransform: "uppercase" }}>
                          {c.label}
                        </Text>
                        <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 11, color: colors.muted }}>
                          {c.labelAm}
                        </Text>
                      </View>
                      {active && <Feather name="check" size={16} color={colors.navy} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Step 4: Description + Review ─────────────────────────── */}
          {step === 4 && (
            <View>
              <StepHeader step={4} title="Review & Submit" subtitle="Add a description, then review your listing before submitting." />

              <FieldLabel label="Description (optional)" />
              <TextBox
                value={form.description}
                onChangeText={(v) => set("description", v)}
                placeholder="Describe condition, history, any extras…"
                multiline
              />

              {/* Review summary — mirrors web listing preview */}
              <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
                Listing Preview
              </Text>
              <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, ...shadows.hard }}>
                {/* Category banner */}
                <View style={{ backgroundColor: colors.navy, padding: 12, borderLeftWidth: 4, borderLeftColor: colors.gold }}>
                  <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.gold, textTransform: "uppercase", letterSpacing: 2 }}>
                    {form.category}
                  </Text>
                  <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 16, color: colors.surface, textTransform: "uppercase", marginTop: 4 }}>
                    {form.title || "—"}
                  </Text>
                </View>
                {/* Details */}
                {[
                  ["Price",      `${Number(form.price || "0").toLocaleString("en-US")} ${form.currency}`],
                  ["Condition",  CONDITIONS.find((c) => c.value === form.condition)?.label ?? ""],
                  ["Location",   form.location || "—"],
                  ["Status",     "Pending Review after submit"],
                ].map(([k, v]) => (
                  <View key={k} style={{ flexDirection: "row", justifyContent: "space-between", padding: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 9, color: colors.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>{k}</Text>
                    <Text style={{ fontFamily: "SpaceGrotesk_700Bold", fontSize: 12, color: colors.foreground, textAlign: "right", maxWidth: "60%" }}>{v}</Text>
                  </View>
                ))}
              </View>

              <View style={{ marginTop: 16, padding: 12, borderLeftWidth: 4, borderLeftColor: colors.gold, backgroundColor: "rgba(255,215,0,0.06)" }}>
                <Text style={{ fontFamily: "SpaceMono_700Bold", fontSize: 8, color: colors.gold, textTransform: "uppercase", letterSpacing: 1.6, marginBottom: 4 }}>
                  What happens next?
                </Text>
                <Text style={{ fontFamily: "DMSans_400Regular", fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
                  Your listing goes to Pending Review. The Sabeh admin team approves it within 24 hours, then it appears as Active in the marketplace.
                </Text>
              </View>
            </View>
          )}

        </ScrollView>

        {/* Bottom action bar */}
        <SafeAreaView edges={["bottom"]} style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
          <View style={{ padding: 12 }}>
            {step < TOTAL_STEPS ? (
              <Button fullWidth onPress={() => { if (canAdvance()) setStep((s) => s + 1); }} disabled={!canAdvance()}>
                Continue →
              </Button>
            ) : (
              <Button fullWidth onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color={colors.navy} />
                ) : (
                  "Submit Listing"
                )}
              </Button>
            )}
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
