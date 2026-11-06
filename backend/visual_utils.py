
from io import BytesIO
import re
from PIL import Image


# Recognised brand colours
BRAND_COLORS = {
    "navy blue": (0, 0, 128),
    "blue": (0, 0, 255),
    "white": (255, 255, 255),
    "black": (0, 0, 0),
    "red": (255, 0, 0),
    "green": (0, 128, 0),
    "yellow": (255, 255, 0),
    "orange": (255, 165, 0),
    "purple": (128, 0, 128),
    "grey": (128, 128, 128),
    "gray": (128, 128, 128)
}


def identify_brand_colors(guidelines):

    guidelines = (guidelines or "").lower()

    allowed_colors = {}

    # Check longer colour names first
    for color_name in sorted(
        BRAND_COLORS.keys(),
        key=len,
        reverse=True
    ):

        pattern = r"\b" + re.escape(color_name) + r"\b"

        if re.search(pattern, guidelines):

            # Avoid detecting blue separately inside navy blue
            if color_name == "blue" and "navy blue" in allowed_colors:
                continue

            allowed_colors[color_name] = BRAND_COLORS[color_name]

    # Support navy as an alternative name
    if re.search(r"\bnavy\b", guidelines) and "navy blue" not in allowed_colors:
        allowed_colors["navy blue"] = BRAND_COLORS["navy blue"]

    return allowed_colors


def analyze_image_colors(image_bytes, visual_guidelines):

    # 1. Open image
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    image.thumbnail((300, 300))

    # 2. Extract five dominant colours
    quantized = image.quantize(colors=5)

    palette = quantized.getpalette()
    color_counts = quantized.getcolors(maxcolors=5)

    total_pixels = sum(count for count, index in color_counts)

    raw_colors = []

    for count, palette_index in color_counts:

        index = palette_index * 3

        rgb = tuple(palette[index:index + 3])

        raw_colors.append({
            "rgb": rgb,
            "count": count
        })

    # 3. Combine very similar colours
    merged_colors = []

    for color in sorted(
        raw_colors,
        key=lambda item: item["count"],
        reverse=True
    ):

        merged = False

        for existing in merged_colors:

            distance = sum(
                (color["rgb"][i] - existing["rgb"][i]) ** 2
                for i in range(3)
            ) ** 0.5

            if distance <= 30:

                old_count = existing["count"]
                new_count = color["count"]
                total_count = old_count + new_count

                existing["rgb"] = tuple(
                    round(
                        (
                            existing["rgb"][i] * old_count
                            + color["rgb"][i] * new_count
                        ) / total_count
                    )
                    for i in range(3)
                )

                existing["count"] = total_count

                merged = True
                break

        if not merged:
            merged_colors.append(color.copy())

    # 4. Prepare dominant colour report
    dominant_colors = []

    for color in merged_colors:

        dominant_colors.append({
            "rgb": list(color["rgb"]),
            "percentage": round(
                color["count"] / total_pixels * 100,
                2
            )
        })

    # 5. Identify approved brand colours
    allowed_colors = identify_brand_colors(visual_guidelines)

    if not allowed_colors:

        return {
            "status": "Guidelines not recognised",
            "dominant_colors": dominant_colors,
            "allowed_brand_colors": [],
            "mismatches": [],
            "message": "No recognised brand colours found."
        }

    # 6. Compare dominant colours
    mismatches = []

    for color in dominant_colors:

        image_rgb = color["rgb"]

        closest_distance = min(
            sum(
                (image_rgb[i] - allowed_rgb[i]) ** 2
                for i in range(3)
            ) ** 0.5
            for allowed_rgb in allowed_colors.values()
        )

        if closest_distance > 100:
            mismatches.append(color)

    # 7. Final result
    return {
        "status": (
            "Potential color mismatch"
            if mismatches
            else "Colors appear consistent"
        ),
        "allowed_brand_colors": list(allowed_colors.keys()),
        "dominant_colors": dominant_colors,
        "mismatches": mismatches
    }
