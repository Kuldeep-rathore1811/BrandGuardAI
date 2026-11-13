
import re


CLAIM_PATTERNS = [
    r"\b\d+\s*%\s*(?:success|accuracy|satisfaction)\b",
    r"\b(?:guarantee|guarantees|guaranteed)\b",
    r"\b(?:number one|no\.?\s*1|#1)\b",
    r"\b(?:best|leading|top|world'?s best)\b",
    r"\btrusted by\s+[^.!?\n]+",
    r"\b(?:fastest|cheapest|most reliable)\b"
]


def detect_promotional_claims(document_text):

    claims = []
    seen = set()

    for pattern in CLAIM_PATTERNS:

        for match in re.finditer(
            pattern,
            document_text,
            re.IGNORECASE
        ):

            excerpt = match.group(0).strip()
            normalized = excerpt.lower()

            if normalized in seen:
                continue

            seen.add(normalized)

            claims.append({
                "claim": excerpt,
                "position": match.start(),
                "status": "Unverified",
                "reason": (
                    "This promotional claim requires "
                    "supporting evidence before publication."
                ),
                "evidence": [],
                "suggestion": (
                    "Provide reliable supporting evidence "
                    "or use more balanced wording."
                )
            })

    return claims


def verify_promotional_claims(document_text):

    claims = detect_promotional_claims(document_text)

    for item in claims:

        claim_text = item["claim"].lower()

        if any(term in claim_text for term in [
            "guarantee",
            "guarantees",
            "guaranteed",
            "100% success"
        ]):

            item["status"] = "Potentially Misleading"

            item["reason"] = (
                "This wording makes an absolute promotional "
                "promise that requires strong, verifiable evidence."
            )

            item["suggestion"] = (
                "Remove the absolute guarantee or provide "
                "clear, verifiable evidence supporting it."
            )

    return {
        "total_claims": len(claims),
        "supported": 0,
        "unverified": sum(
            1 for item in claims
            if item["status"] == "Unverified"
        ),
        "potentially_misleading": sum(
            1 for item in claims
            if item["status"] == "Potentially Misleading"
        ),
        "claims": claims
    }


if __name__ == "__main__":

    sample_text = """
    Our platform guarantees 100% success for every customer.
    We are trusted by 1 million customers.
    Our software is the world's best solution.
    """

    import json

    result = verify_promotional_claims(sample_text)

    print(json.dumps(result, indent=2))
