
from io import BytesIO
import math
import re

from PIL import Image


# Standard RGB values for recognised brand colour names
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
    "gray": (128, 128, 128),
}


def hex_to_rgb(hex_code):
    """Convert a HEX colour code into an RGB tuple."""

    value = hex_code.lstrip("#")

    if len(value) == 3:
        value = "".join(character * 2 for character in value)

    return tuple(
        int(value[index:index + 2], 16)
        for index in (0, 2, 4)
    )


def rgb_to_hex(rgb):
    """Convert RGB into a HEX colour code."""

    return "#{:02X}{:02X}{:02X}".format(*rgb)


def identify_brand_colors(guidelines):
    """
    Extract approved named colours and HEX codes.

    Supports:
    Navy blue and white
    #142850 and #FFFFFF
    Navy blue (#142850) and white (#FFFFFF)
    """

    guidelines = (guidelines or "").lower()

    allowed_colors = {}
    used_hex_codes = set()
    used_color_names = set()

    hex_pattern = r"#(?:[0-9a-f]{6}|[0-9a-f]{3})"

    # Check longer colour names first.
    for color_name in sorted(
        BRAND_COLORS.keys(),
        key=len,
        reverse=True
    ):

        if color_name in used_color_names:
            continue
        if color_name == "blue" and "navy blue" in used_color_names:
            continue

        name_pattern = r"\b" + re.escape(color_name) + r"\b"

        # Check whether the named colour has a custom HEX code.
        custom_pattern = (
            name_pattern
            + r"\s*\(\s*("
            + hex_pattern
            + r")\s*\)"
        )

        custom_match = re.search(custom_pattern, guidelines)

        if custom_match:

            hex_code = custom_match.group(1).upper()

            label = f"{color_name} ({hex_code})"

            allowed_colors[label] = hex_to_rgb(hex_code)

            used_hex_codes.add(hex_code.lower())
            used_color_names.add(color_name)

        elif re.search(name_pattern, guidelines):

            # Avoid separately detecting blue inside navy blue.
            if (
                color_name == "blue"
                and any(
                    "navy blue" in name
                    for name in allowed_colors
                )
            ):
                continue

            allowed_colors[color_name] = BRAND_COLORS[color_name]
            used_color_names.add(color_name)

    # Support navy as an alternative name.
    if (
        re.search(r"\bnavy\b", guidelines)
        and "navy blue" not in used_color_names
    ):
        allowed_colors["navy blue"] = BRAND_COLORS["navy blue"]

    # Extract remaining standalone HEX codes.
    hex_codes = re.findall(hex_pattern, guidelines)

    for hex_code in hex_codes:

        if hex_code.lower() in used_hex_codes:
            continue

        normalized_code = hex_code.upper()

        allowed_colors[normalized_code] = hex_to_rgb(
            normalized_code
        )

        used_hex_codes.add(hex_code.lower())

    return allowed_colors


def rgb_to_lab(rgb):
    """Convert sRGB values into CIE Lab colour space."""

    def linearize(value):
        value = value / 255.0

        if value <= 0.04045:
            return value / 12.92

        return ((value + 0.055) / 1.055) ** 2.4

    red, green, blue = [
        linearize(value) for value in rgb
    ]

    # Convert RGB into XYZ using the D65 reference white.
    x = (
        red * 0.4124564
        + green * 0.3575761
        + blue * 0.1804375
    ) / 0.95047

    y = (
        red * 0.2126729
        + green * 0.7151522
        + blue * 0.0721750
    )

    z = (
        red * 0.0193339
        + green * 0.1191920
        + blue * 0.9503041
    ) / 1.08883

    def lab_function(value):
        delta = 6 / 29

        if value > delta ** 3:
            return value ** (1 / 3)

        return value / (3 * delta ** 2) + 4 / 29

    fx = lab_function(x)
    fy = lab_function(y)
    fz = lab_function(z)

    lightness = 116 * fy - 16
    a_value = 500 * (fx - fy)
    b_value = 200 * (fy - fz)

    return lightness, a_value, b_value


def delta_e(color1, color2):
    """Calculate CIE76 perceptual colour difference."""

    lab1 = rgb_to_lab(color1)
    lab2 = rgb_to_lab(color2)

    return math.sqrt(
        sum(
            (lab1[index] - lab2[index]) ** 2
            for index in range(3)
        )
    )


def analyze_image_colors(image_bytes, visual_guidelines):

    # 1. Open and resize image for efficient analysis.
    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    image.thumbnail((300, 300))

    # 2. Extract five dominant colours.
    quantized = image.quantize(colors=5)

    palette = quantized.getpalette()
    color_counts = quantized.getcolors(maxcolors=256) or []

    total_pixels = sum(
        count for count, _ in color_counts
    )

    if not total_pixels:
        return {
            "status": "Unable to analyze image",
            "dominant_colors": [],
            "allowed_brand_colors": [],
            "allowed_brand_color_details": [],
            "mismatches": [],
            "message": "No image colour data could be extracted."
        }

    raw_colors = []

    for count, palette_index in color_counts:

        index = palette_index * 3

        rgb = tuple(
            palette[index:index + 3]
        )

        raw_colors.append({
            "rgb": rgb,
            "count": count
        })

    # 3. Combine very similar RGB colours.
    merged_colors = []

    for color in sorted(
        raw_colors,
        key=lambda item: item["count"],
        reverse=True
    ):

        merged = False

        for existing in merged_colors:

            distance = math.sqrt(
                sum(
                    (color["rgb"][i] - existing["rgb"][i]) ** 2
                    for i in range(3)
                )
            )

            if distance <= 30:

                old_count = existing["count"]
                new_count = color["count"]
                combined_count = old_count + new_count

                existing["rgb"] = tuple(
                    round(
                        (
                            existing["rgb"][i] * old_count
                            + color["rgb"][i] * new_count
                        ) / combined_count
                    )
                    for i in range(3)
                )

                existing["count"] = combined_count

                merged = True
                break

        if not merged:
            merged_colors.append(color.copy())

    # 4. Prepare dominant colour report.
    dominant_colors = []

    for color in merged_colors:

        rgb = color["rgb"]

        dominant_colors.append({
            "rgb": list(rgb),
            "hex": rgb_to_hex(rgb),
            "percentage": round(
                color["count"] / total_pixels * 100,
                2
            )
        })

    # 5. Extract approved brand colours.
    allowed_colors = identify_brand_colors(
        visual_guidelines
    )

    allowed_color_details = [
        {
            "name": name,
            "rgb": list(rgb),
            "hex": rgb_to_hex(rgb)
        }
        for name, rgb in allowed_colors.items()
    ]

    if not allowed_colors:

        return {
            "status": "Guidelines not recognised",
            "dominant_colors": dominant_colors,
            "allowed_brand_colors": [],
            "allowed_brand_color_details": [],
            "mismatches": [],
            "message": "No recognised brand colours or HEX codes found."
        }

    # 6. Compare colours using perceptual Delta E.
    mismatches = []

    for color in dominant_colors:

        image_rgb = tuple(color["rgb"])

        closest_match = min(
            allowed_colors.items(),
            key=lambda item: delta_e(image_rgb, item[1])
        )

        closest_name, closest_rgb = closest_match

        difference = delta_e(image_rgb, closest_rgb)

        color["closest_brand_color"] = closest_name
        color["delta_e"] = round(difference, 2)

        # Flag noticeable differences occupying at least 5% of image.
        if difference > 25 and color["percentage"] >= 5:

            mismatches.append({
                **color,
                "reason": (
                    "This colour differs noticeably from "
                    "the approved brand palette."
                )
            })

    # 7. Prepare final result.
    return {
        "status": (
            "Potential color mismatch"
            if mismatches
            else "Colors appear consistent"
        ),
        "allowed_brand_colors": list(allowed_colors.keys()),
        "allowed_brand_color_details": allowed_color_details,
        "dominant_colors": dominant_colors,
        "mismatches": mismatches,
        "comparison_method": "CIE Lab Delta E 76",
        "mismatch_threshold": 25,
        "minimum_mismatch_percentage": 5
    }
