
import re


def check_compliance(document_text, guidelines):

    issues = []

    # 1. Check restricted terminology
    restricted_words = guidelines.get("restricted_terminology") or ""

    restricted_list = [
        word.strip()
        for word in restricted_words.split(",")
        if word.strip()
    ]

    for word in restricted_list:

        pattern = r"\b" + re.escape(word) + r"\b"

        matches = list(
            re.finditer(pattern, document_text, re.IGNORECASE)
        )

        for match in matches:
            issues.append({
                "type": "Restricted Terminology",
                "severity": "High",
                "word": word,
                "message": f"Restricted word '{word}' found in document.",
                "position": match.start(),
                "suggestion": f"Remove or replace '{word}' with approved terminology."
            })

    # 2. Check approved terminology
    approved_words = guidelines.get("approved_terminology") or ""

    approved_list = [
        word.strip()
        for word in approved_words.split(",")
        if word.strip()
    ]

    for word in approved_list:

        pattern = r"\b" + re.escape(word) + r"\b"

        if not re.search(pattern, document_text, re.IGNORECASE):
            issues.append({
                "type": "Missing Approved Terminology",
                "severity": "Medium",
                "word": word,
                "message": f"Approved term '{word}' was not found.",
                "suggestion": f"Consider including '{word}' where relevant."
            })

    # 3. Check brand tone consistency
    brand_tone = (guidelines.get("brand_tone") or "").strip().lower()

    tone_rules = {
        "professional": [
            ("gonna", "going to"),
            ("wanna", "want to"),
            ("lol", "remove this expression"),
            ("yeah", "yes"),
            ("awesome", "excellent")
        ],
        "formal": [
            ("gonna", "going to"),
            ("wanna", "want to"),
            ("yeah", "yes"),
            ("lol", "remove this expression"),
            ("hey", "hello")
        ],
        "friendly": [
            ("hereby", "we are"),
            ("pursuant to", "according to"),
            ("aforementioned", "mentioned earlier"),
            ("therefore", "so")
        ],
        "casual": [
            ("hereby", "we are"),
            ("pursuant to", "according to"),
            ("aforementioned", "mentioned earlier")
        ]
    }

    selected_tone = None

    for tone in tone_rules:
        if tone in brand_tone:
            selected_tone = tone
            break

    if selected_tone:

        for expression, suggestion in tone_rules[selected_tone]:

            pattern = r"\b" + re.escape(expression) + r"\b"

            matches = list(
                re.finditer(pattern, document_text, re.IGNORECASE)
            )

            for match in matches:
                issues.append({
                    "type": "Tone Inconsistency",
                    "severity": "Low",
                    "word": expression,
                    "message": (
                        f"Expression '{expression}' may not match "
                        f"the selected {selected_tone} brand tone."
                    ),
                    "position": match.start(),
                    "suggestion": f"Consider using '{suggestion}' instead."
                })


    # 4. Check unsupported promotional claims
    
    promotional_claims = [
        "100% guaranteed",
        "number one",
        "no. 1",
        "best in the market",
        "world's best",
        "world's number one",
        "100% success rate",
        "guaranteed results"
    ]

    for claim in promotional_claims:

        pattern = re.escape(claim)

        matches = list(
            re.finditer(pattern, document_text, re.IGNORECASE)
        )

        for match in matches:
            issues.append({
                "type": "Unsupported Promotional Claim",
                "severity": "Medium",
                "word": claim,
                "message": (
                    f"Promotional claim '{claim}' may require "
                    "supporting evidence."
                ),
                "position": match.start(),
                "suggestion": (
                    "Provide reliable evidence to support this claim "
                    "or use more balanced wording."
                )
            })

    # 4. Calculate compliance score
    total_issues = len(issues)

    compliance_score = max(
        0,
        100 - (total_issues * 10)
    )

    return {
        "compliance_score": compliance_score,
        "total_issues": total_issues,
        "issues": issues
    }
