#!/bin/bash

# ============================================
# BYD Video Frame Extractor for Sabeh Importers
# ============================================

echo "🎬 BYD Video Frame Extractor"
echo "============================"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed."
    echo ""
    echo "Install ffmpeg using Homebrew:"
    echo "  brew install ffmpeg"
    echo ""
    echo "Or download from: https://ffmpeg.org/download.html"
    exit 1
fi

echo "✅ ffmpeg found!"

# Source video path
VIDEO_PATH="/Users/mekdesyared/Downloads/sabeh-importers/public/Create_a_smooth_1080p_202601130757.mp4"
OUTPUT_DIR="/Users/mekdesyared/Downloads/sabeh-importers/public/frames2"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo ""
echo "📹 Source: $VIDEO_PATH"
echo "📁 Output: $OUTPUT_DIR"
echo ""

# Extract frames at 24fps, 1920x1080 resolution, high quality
echo "🔄 Extracting frames..."
ffmpeg -i "$VIDEO_PATH" \
    -vf "fps=24,scale=1920:1080" \
    -q:v 2 \
    "$OUTPUT_DIR/byd2_%03d.jpg" \
    -y

echo ""
echo "✅ Frame extraction complete!"
echo ""

# Count extracted frames
FRAME_COUNT=$(ls -1 "$OUTPUT_DIR"/byd2_*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "📊 Extracted $FRAME_COUNT frames"
echo ""
echo "🎉 Done! Update TOTAL_FRAMES in VIDEO_CONFIGS if needed."
