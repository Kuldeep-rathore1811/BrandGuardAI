
import cv2
import numpy as np
from pathlib import Path


REFERENCE_LOGO = Path(__file__).parent / "brand_logo.jpg"


def verify_logo(image_bytes):

    if not REFERENCE_LOGO.exists():
        return {
            "status": "Inconclusive",
            "matching_features": 0,
            "message": "Approved reference logo not found."
        }

    reference = cv2.imread(str(REFERENCE_LOGO))

    uploaded_array = np.frombuffer(image_bytes, np.uint8)
    uploaded = cv2.imdecode(uploaded_array, cv2.IMREAD_COLOR)

    if reference is None or uploaded is None:
        return {
            "status": "Inconclusive",
            "matching_features": 0,
            "message": "Could not read the logo image."
        }

    # Safely resize large images
    def resize_image(image):

        if image is None or image.size == 0:
            return None

        height, width = image.shape[:2]

        if height <= 0 or width <= 0:
            return None

        if max(height, width) > 1200:

            scale = 1200 / max(height, width)

            new_width = max(1, int(width * scale))
            new_height = max(1, int(height * scale))

            image = cv2.resize(
                image,
                (new_width, new_height)
            )

        return image

    reference = resize_image(reference)
    uploaded = resize_image(uploaded)

    if reference is None or uploaded is None:
        return {
            "status": "Inconclusive",
            "matching_features": 0,
            "message": "Invalid or empty image dimensions."
        }

    # Convert images to grayscale
    reference_gray = cv2.cvtColor(
        reference, cv2.COLOR_BGR2GRAY
    )

    uploaded_gray = cv2.cvtColor(
        uploaded, cv2.COLOR_BGR2GRAY
    )

    # Detect ORB features
    orb = cv2.ORB_create(nfeatures=2000)

    keypoints1, descriptors1 = orb.detectAndCompute(
        reference_gray, None
    )

    keypoints2, descriptors2 = orb.detectAndCompute(
        uploaded_gray, None
    )

    if descriptors1 is None or descriptors2 is None:
        return {
            "status": "Inconclusive",
            "matching_features": 0,
            "geometric_inliers": 0,
            "message": "Not enough visual features were detected."
        }

    # Match visual features
    matcher = cv2.BFMatcher(cv2.NORM_HAMMING)

    matches = matcher.knnMatch(
        descriptors1,
        descriptors2,
        k=2
    )

    good_matches = []

    for pair in matches:

        if len(pair) == 2:

            first, second = pair

            if first.distance < 0.75 * second.distance:
                good_matches.append(first)

    match_count = len(good_matches)

    # Check geometric alignment
    if match_count < 8:
        return {
            "status": "Logo not verified",
            "matching_features": match_count,
            "geometric_inliers": 0,
            "message": "Too few matching visual features."
        }

    points1 = np.float32([
        keypoints1[m.queryIdx].pt
        for m in good_matches
    ]).reshape(-1, 1, 2)

    points2 = np.float32([
        keypoints2[m.trainIdx].pt
        for m in good_matches
    ]).reshape(-1, 1, 2)

    try:
        homography, mask = cv2.findHomography(
            points1,
            points2,
            cv2.RANSAC,
            5.0
        )

    except cv2.error:
        homography = None
        mask = None

    if homography is None or mask is None:
        return {
            "status": "Inconclusive",
            "matching_features": match_count,
            "geometric_inliers": 0,
            "message": "Geometric verification was unsuccessful."
        }

    inliers = int(mask.sum())
    inlier_ratio = inliers / match_count

    # Final prototype classification
    if inliers >= 15 and inlier_ratio >= 0.35:

        status = "Likely logo match"
        message = (
            "Visual features and geometric alignment "
            "support a logo match."
        )

    elif inliers < 5 or inlier_ratio < 0.15:

        status = "Logo not verified"
        message = (
            "The uploaded image does not sufficiently "
            "resemble the approved logo."
        )

    else:

        status = "Inconclusive"
        message = (
            "Some similarities were found, but the match "
            "is not strong enough."
        )

    return {
        "status": status,
        "matching_features": match_count,
        "geometric_inliers": inliers,
        "inlier_ratio": round(inlier_ratio, 3),
        "message": message
    }
