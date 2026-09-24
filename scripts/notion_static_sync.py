#!/usr/bin/env python3
"""Validate and export Notion-shaped editorial data to static homepage JS.

The sample commands are intentionally offline and review-only. Live Notion
commands are manual-only, read credentials from environment variables, never
print credential values, and refuse to overwrite the production homepage content
path unless an explicit production-overwrite flag is supplied.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parent.parent
LOCALE_KEYS = (("en", "en"), ("zh-Hans", "zhHans"))
PUBLISHABLE_DATABASES = ("homeSections", "currentFocus", "evidenceTimeline", "secondaryPages")
REQUIRED_DATABASES = PUBLISHABLE_DATABASES + ("translationGlossary", "changeLog")
PRODUCTION_CONTENT_PATH = REPO_ROOT / "content/homepage-content.js"
REVIEW_OUTPUT_DIR = REPO_ROOT / "content/generated"
DEFAULT_GENERATED_PATH = REVIEW_OUTPUT_DIR / "homepage-content.generated.js"
NOTION_API_BASE = "https://api.notion.com/v1"
NOTION_API_VERSION = "2025-09-03"
NOTION_DATABASES = {
    "homeSections": {
        "env": "NOTION_HOME_SECTIONS_DB",
        "label": "Home Sections",
    },
    "currentFocus": {
        "env": "NOTION_CURRENT_FOCUS_DB",
        "label": "Current Focus",
    },
    "evidenceTimeline": {
        "env": "NOTION_EVIDENCE_DB",
        "label": "Selected Evidence / Timeline",
    },
    "secondaryPages": {
        "env": "NOTION_SECONDARY_PAGES_DB",
        "label": "Secondary Pages",
    },
    "translationGlossary": {
        "env": "NOTION_GLOSSARY_DB",
        "label": "Translation Glossary",
    },
    "changeLog": {
        "env": "NOTION_CHANGELOG_DB",
        "label": "Change Log",
    },
}
REQUIRED_NOTION_ENV = ("NOTION_TOKEN",) + tuple(config["env"] for config in NOTION_DATABASES.values())
STATUSES = {"draft", "review", "approved", "archived"}
VISIBILITIES = {"visible", "folded", "secondary", "hidden"}
PRIVACY_STATES = {"public_safe", "needs_review", "private", "blocked"}
OWNER_APPROVAL_STATES = {"approved", "not_required", "needs_owner_review", "blocked"}
OWNER_APPROVED_STATES = {"approved", "not_required"}
HOME_SECTION_KEYS = {
    "site.meta",
    "site.nav",
    "home.hero",
    "home.focus",
    "home.projects",
    "home.work",
    "home.digest",
    "home.about",
    "home.practice",
    "home.timeline",
    "home.capability",
    "home.education",
    "home.language",
    "home.systems",
    "home.contact",
    "site.footer",
}
HOME_RECORD_KINDS = {"meta", "ui", "hero", "section", "footer"}
CURRENT_FOCUS_TYPES = {"current_role", "clinical_focus", "professional_direction"}
CURRENT_FOCUS_MAX_EN_WORDS = 32
CURRENT_FOCUS_MAX_ZH_HANS_CHARS = 65
REQUIRED_FIELDS = (
    "stableKey",
    "status",
    "visibility",
    "privacyState",
    "ownerApprovalState",
    "priority",
    "sort",
    "en",
    "zhHans",
    "maxEnWords",
    "maxZhHansCharacters",
    "sourceEvidenceNote",
    "lastVerifiedDate",
    "publish",
)
REQUIRED_LOCALE_FIELDS = ("title", "summary", "body", "tags")
REQUIRED_SECTIONS = ("focus", "practice", "timeline", "capability", "education", "language", "systems", "contact")
DISCLOSURE_SECTIONS = ("timeline", "capability", "education", "language", "systems")
FORBIDDEN_PUBLIC_PATTERNS = (
    "Main Quest",
    "Side Quest",
    "Codex Is Fun",
    "AI-assisted",
    "magical",
    "魔法",
    "buy you dinner",
    "forever learning",
    "newly obtained",
    "Technical Systems Support",
    "ICU certificate",
    "我构建小系统",
    "主要任务",
    "支线任务",
    "新鲜临床信号",
    "已获得 NSCN",
    "ICU 证书",
    "何少廷",
)
FORBIDDEN_CHINESE_PATTERNS = (
    "信号板",
    "重症判断",
    "老年健康连续性",
    "实用系统工作",
    "实用工作流系统",
    "实用临床系统",
    "机械通气接触",
    "升级汇报",
)
PHONE_RE = re.compile(r"(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}")
PRIVATE_ADDRESS_RE = re.compile(
    r"\b\d{1,6}\s+(?:[A-Za-z0-9.'-]+\s+){1,6}(?:Street|St\.|Avenue|Ave\.|Road|Rd\.|Drive|Dr\.|Court|Ct\.|Boulevard|Blvd\.)\b",
    re.IGNORECASE,
)
IDENTIFIER_RE = re.compile(r"\b(?:license|licence|registration)\b[^\n]{0,30}\d{4,}", re.IGNORECASE)
RAW_FILE_RE = re.compile(r"(?:raw resume|resume\.pdf|certification file|certificate file)", re.IGNORECASE)
HIGH_ENTROPY_RE = re.compile(r"\b[A-Za-z0-9_-]{40,}\b")
NUMBER_RE = re.compile(r"-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?")
IDENTIFIER_RE_JS = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*")
GENERATED_JS_PREFIX = (
    "// REVIEW-ONLY generated candidate from mock editorial data.\n"
    "// Do not import this file from index.html or deploy it directly.\n"
    "// Production remains content/homepage-content.js until manually reviewed and selectively replaced.\n"
    "(function (window) {\n"
    '  "use strict";\n\n'
    "  window.SHAOTING_HOME_CONTENT = "
)
GENERATED_JS_SUFFIX = ";\n})(window);\n"
OWNER_GATED_PATTERNS = (
    ("current full-time ICU role", re.compile(r"\bfull-time\s+ICU\b|全职\s*ICU|全职岗位", re.IGNORECASE)),
    ("Valley Regional / Kentville wording", re.compile(r"Valley Regional|Kentville", re.IGNORECASE)),
    ("NSCN wording", re.compile(r"\bNSCN\b", re.IGNORECASE)),
    ("public email/contact choice", re.compile(r"mailto:|@outlook\.com|public email|contact choice", re.IGNORECASE)),
    ("credential or training expansion", re.compile(r"credential|training|certificate|certification|Coronary Care|BLS|ACLS|证书|培训|资质", re.IGNORECASE)),
    ("new clinical claim", re.compile(r"hemodynamic|rhythm|escalation|critical-care|critical care|血流动力学|心律|重症护理", re.IGNORECASE)),
)


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    counts: dict[str, int] = field(default_factory=dict)

    @property
    def ok(self) -> bool:
        return not self.errors

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("top-level sample must be an object")
    return data


def dump_summary(status: str, **payload: Any) -> None:
    print(json.dumps({"status": status, **payload}, ensure_ascii=False, indent=2))


def resolve_repo_path(path: str | Path) -> Path:
    value = Path(path)
    if value.is_absolute():
        return value
    return REPO_ROOT / value


def path_relative_to_repo(path: Path) -> Path:
    try:
        return path.resolve().relative_to(REPO_ROOT)
    except ValueError:
        return path.resolve()


def is_production_content_path(path: Path) -> bool:
    return path.resolve() == PRODUCTION_CONTENT_PATH.resolve()


def is_review_output_path(path: Path) -> bool:
    try:
        path.resolve().relative_to(REVIEW_OUTPUT_DIR.resolve())
        return True
    except ValueError:
        return False


def output_target_errors(path: Path, allow_production_overwrite: bool, live: bool = False) -> list[str]:
    if is_production_content_path(path):
        if allow_production_overwrite:
            return []
        return [
            "refusing to overwrite production content/homepage-content.js by default",
            ("live export" if live else "export") + " must write to content/generated/ for review unless production overwrite is explicitly approved",
        ]
    if not is_review_output_path(path):
        return [
            "refusing to write outside content/generated/",
            "review exports must stay under content/generated/ unless the exact production path is explicitly approved",
        ]
    return []


def present_missing(value: str | None) -> str:
    return "present" if value else "missing"


def notion_env_status() -> dict[str, str]:
    return {name: present_missing(os.environ.get(name)) for name in REQUIRED_NOTION_ENV}


def missing_notion_env() -> list[str]:
    return [name for name, status in notion_env_status().items() if status == "missing"]


def normalized_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def get_notion_property(properties: dict[str, Any], aliases: tuple[str, ...]) -> Any | None:
    direct = {normalized_key(key): value for key, value in properties.items()}
    for alias in aliases:
        value = direct.get(normalized_key(alias))
        if value is not None:
            return value
    return None


def iter_strings(value: Any) -> list[str]:
    strings: list[str] = []
    if isinstance(value, str):
        strings.append(value)
    elif isinstance(value, list):
        for item in value:
            strings.extend(iter_strings(item))
    elif isinstance(value, dict):
        for item in value.values():
            strings.extend(iter_strings(item))
    return strings


def count_en_words(value: str) -> int:
    return len(re.findall(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?", value or ""))


def count_zh_chars(value: str) -> int:
    return sum(1 for char in value or "" if "\u4e00" <= char <= "\u9fff")


INVISIBLE_CHARS_RE = re.compile("[\u200b\ufeff]")


def strip_invisible(value: Any) -> Any:
    """Recursively remove zero-width spaces / BOMs from string values."""
    if isinstance(value, str):
        return INVISIBLE_CHARS_RE.sub("", value)
    if isinstance(value, list):
        return [strip_invisible(item) for item in value]
    if isinstance(value, dict):
        return {key: strip_invisible(item) for key, item in value.items()}
    return value


def rich_text_plain(items: list[dict[str, Any]]) -> str:
    return strip_invisible("".join(str(item.get("plain_text", "")) for item in items if isinstance(item, dict)))


def notion_plain_text(properties: dict[str, Any], aliases: tuple[str, ...]) -> str:
    prop = get_notion_property(properties, aliases)
    if not isinstance(prop, dict):
        return ""
    prop_type = prop.get("type")
    if prop_type == "title":
        return rich_text_plain(prop.get("title") or [])
    if prop_type == "rich_text":
        return rich_text_plain(prop.get("rich_text") or [])
    if prop_type in {"select", "status"}:
        value = prop.get(prop_type)
        return str(value.get("name", "")) if isinstance(value, dict) else ""
    if prop_type == "number":
        value = prop.get("number")
        return "" if value is None else str(value)
    if prop_type == "date":
        value = prop.get("date")
        return str(value.get("start", "")) if isinstance(value, dict) else ""
    if prop_type == "url":
        return str(prop.get("url") or "")
    if prop_type == "email":
        return str(prop.get("email") or "")
    if prop_type == "phone_number":
        return str(prop.get("phone_number") or "")
    if prop_type == "checkbox":
        return "true" if prop.get("checkbox") is True else "false"
    return ""


def notion_bool(properties: dict[str, Any], aliases: tuple[str, ...]) -> bool:
    prop = get_notion_property(properties, aliases)
    if not isinstance(prop, dict):
        return False
    if prop.get("type") == "checkbox":
        return prop.get("checkbox") is True
    text = notion_plain_text(properties, aliases).strip().lower()
    return text in {"true", "yes", "y", "1", "checked", "publish"}


def notion_number(properties: dict[str, Any], aliases: tuple[str, ...]) -> int | None:
    prop = get_notion_property(properties, aliases)
    if isinstance(prop, dict) and prop.get("type") == "number":
        value = prop.get("number")
        if isinstance(value, (int, float)):
            return int(value)
    text = notion_plain_text(properties, aliases).strip()
    if not text:
        return None
    try:
        return int(float(text))
    except ValueError:
        return None


def parse_list_text(value: str) -> list[str]:
    value = value.strip()
    if not value:
        return []
    if value.startswith("["):
        try:
            parsed = json.loads(value)
        except json.JSONDecodeError:
            parsed = None
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    return [part.strip() for part in re.split(r"[,;\n]", value) if part.strip()]


def notion_list(properties: dict[str, Any], aliases: tuple[str, ...]) -> list[str]:
    prop = get_notion_property(properties, aliases)
    if not isinstance(prop, dict):
        return []
    prop_type = prop.get("type")
    if prop_type == "multi_select":
        return [str(item.get("name", "")).strip() for item in prop.get("multi_select", []) if isinstance(item, dict) and str(item.get("name", "")).strip()]
    if prop_type == "relation":
        return [str(item.get("id", "")).strip() for item in prop.get("relation", []) if isinstance(item, dict) and str(item.get("id", "")).strip()]
    return parse_list_text(notion_plain_text(properties, aliases))


def notion_json(properties: dict[str, Any], aliases: tuple[str, ...]) -> Any | None:
    # Strip BOM / ZWSP prefixes used to smuggle JSON through MCP validators
    # that coerce bare "{...}" property values into objects.
    text = notion_plain_text(properties, aliases).strip().lstrip("﻿​")
    if not text:
        return None
    try:
        return strip_invisible(json.loads(text))
    except json.JSONDecodeError:
        return None


def notion_locale_block(properties: dict[str, Any], locale_prefix: str) -> dict[str, Any]:
    if locale_prefix == "en":
        return {
            "title": notion_plain_text(properties, ("EN Title", "English Title", "Title EN")),
            "summary": notion_plain_text(properties, ("EN Summary", "English Summary", "Summary EN")),
            "body": notion_plain_text(properties, ("EN Body", "English Body", "Body EN", "EN Text", "English Text")),
            "tags": notion_list(properties, ("EN Tags", "EN Chips", "English Tags", "English Chips", "Tags EN")),
        }
    return {
        "title": notion_plain_text(properties, ("ZH Title", "zh-Hans Title", "zhHans Title", "Chinese Title", "Title ZH")),
        "summary": notion_plain_text(properties, ("ZH Summary", "zh-Hans Summary", "zhHans Summary", "Chinese Summary", "Summary ZH")),
        "body": notion_plain_text(properties, ("ZH Body", "zh-Hans Body", "zhHans Body", "Chinese Body", "ZH Text", "Chinese Text", "Body ZH")),
        "tags": notion_list(properties, ("ZH Tags", "ZH Chips", "zh-Hans Tags", "zhHans Tags", "Chinese Tags", "Chinese Chips", "Tags ZH")),
    }


def notion_output_object(properties: dict[str, Any]) -> dict[str, Any] | None:
    combined = notion_json(properties, ("Output JSON", "Output JSON", "Static Output", "Output", "Rendered Output"))
    if isinstance(combined, dict):
        if isinstance(combined.get("en"), dict) and isinstance(combined.get("zhHans"), dict):
            return {"en": combined["en"], "zhHans": combined["zhHans"]}
        if isinstance(combined.get("en"), dict) and isinstance(combined.get("zh-Hans"), dict):
            return {"en": combined["en"], "zhHans": combined["zh-Hans"]}

    en_output = notion_json(properties, ("EN Output JSON", "EN Output", "Output EN"))
    zh_output = notion_json(properties, ("ZH Output JSON", "ZH Output", "zh-Hans Output", "Output ZH"))
    if isinstance(en_output, dict) or isinstance(zh_output, dict):
        return {
            "en": en_output if isinstance(en_output, dict) else {},
            "zhHans": zh_output if isinstance(zh_output, dict) else {},
        }
    return None


def notion_publishable_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    row: dict[str, Any] = {
        "stableKey": notion_plain_text(properties, ("Stable Key", "StableKey", "Key", "stableKey", "Focus Key", "Evidence Key", "Page Key")),
        "status": notion_plain_text(properties, ("Status",)).strip().lower(),
        "visibility": notion_plain_text(properties, ("Visibility",)).strip().lower(),
        "privacyState": (
            lambda _v: {"owner_review": "needs_review", "publicsafe": "public_safe"}.get(_v, _v)
        )(notion_plain_text(properties, ("Privacy State", "PrivacyState", "Privacy")).strip().lower().replace(" ", "_").replace("-", "_")),
        "ownerApprovalState": (
            lambda _v: {"needs_owner": "needs_owner_review"}.get(_v, _v)
        )(notion_plain_text(properties, ("Owner Approval State", "OwnerApprovalState", "Owner Approval")).strip().lower().replace(" ", "_").replace("-", "_")),
        "priority": notion_number(properties, ("Priority",)) or 0,
        "sort": notion_number(properties, ("Sort", "Order")) or 0,
        "en": notion_locale_block(properties, "en"),
        "zhHans": notion_locale_block(properties, "zhHans"),
        "maxEnWords": notion_number(properties, ("Max EN Words", "Max English Words", "MaxEnWords")) or 1,
        "maxZhHansCharacters": notion_number(properties, ("Max ZH Chars", "Max zh-Hans Characters", "Max Chinese Characters", "MaxZhHansCharacters")) or 1,
        "sourceEvidenceNote": notion_plain_text(properties, ("Source / Evidence Note", "Source Evidence Note", "Evidence Note", "Source Note")),
        "lastVerifiedDate": notion_plain_text(properties, ("Last Verified", "Last Verified Date", "Verified Date")),
        "publish": notion_bool(properties, ("Publish", "Published")),
    }
    output = notion_output_object(properties)
    if output is not None:
        row["output"] = output
    return row


def notion_home_section_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    row = notion_publishable_row(page)
    row.update(
        {
            "sectionKey": notion_plain_text(properties, ("Section Key", "SectionKey")),
            "recordKind": notion_plain_text(properties, ("Record Kind", "RecordKind")).strip().lower().replace(" ", "_").replace("-", "_"),
            "parentSection": notion_plain_text(properties, ("Parent Section", "ParentSection")),
            "anchor": notion_plain_text(properties, ("Anchor",)),
            "contentPath": notion_plain_text(properties, ("Content Path", "ContentPath")),
            "renderSlot": notion_plain_text(properties, ("Render Slot", "RenderSlot")).strip().lower().replace(" ", "_").replace("-", "_"),
            "url": notion_plain_text(properties, ("URL", "Url", "Link")),
            "relatedSecondaryPage": notion_list(properties, ("Related Secondary Page", "RelatedSecondaryPage")),
            "relatedGlossaryTerms": notion_list(properties, ("Related Glossary Terms", "RelatedGlossaryTerms")),
            "changeLog": notion_list(properties, ("Change Log", "ChangeLog")),
        }
    )
    return row


def notion_current_focus_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    row = notion_publishable_row(page)
    row.update(
        {
            "focusType": notion_plain_text(properties, ("Focus Type", "FocusType")).strip().lower().replace(" ", "_").replace("-", "_"),
            "homepageSection": notion_plain_text(properties, ("Homepage Section", "HomepageSection")),
            "contentPath": notion_plain_text(properties, ("Content Path", "ContentPath")),
            "relatedGlossaryTerms": notion_list(properties, ("Related Glossary Terms", "RelatedGlossaryTerms")),
            "changeLog": notion_list(properties, ("Change Log", "ChangeLog")),
        }
    )
    return row


def notion_evidence_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    row = notion_publishable_row(page)
    row.update(
        {
            "evidenceType": notion_plain_text(properties, ("Evidence Type", "EvidenceType")).strip().lower().replace(" ", "_").replace("-", "_"),
            "organization": notion_plain_text(properties, ("Organization", "Employer", "Hospital", "School", "Institution")),
            "roleContext": notion_plain_text(properties, ("Role / Context", "Role Context", "RoleContext")),
            "clinicalDomain": notion_list(properties, ("Clinical Domain", "ClinicalDomain")),
            "homepageSection": notion_plain_text(properties, ("Homepage Section", "HomepageSection")),
            "relatedSecondaryPage": notion_list(properties, ("Related Secondary Page", "RelatedSecondaryPage")),
            "contentPath": notion_plain_text(properties, ("Content Path", "ContentPath")),
            "relatedGlossaryTerms": notion_list(properties, ("Related Glossary Terms", "RelatedGlossaryTerms")),
            "changeLog": notion_list(properties, ("Change Log", "ChangeLog")),
        }
    )
    return row


def notion_secondary_page_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    row = notion_publishable_row(page)
    row.update(
        {
            "slug": notion_plain_text(properties, ("Slug", "Route")),
            "legacySlug": notion_plain_text(properties, ("Legacy Slug", "LegacySlug")),
            "canonicalUrl": notion_plain_text(properties, ("Canonical URL", "Canonical Url", "CanonicalUrl")),
            "pageType": notion_plain_text(properties, ("Page Type", "PageType")).strip().lower().replace(" ", "_").replace("-", "_"),
            "template": notion_plain_text(properties, ("Template",)),
            "backLinks": notion_list(properties, ("Back Links", "BackLinks")),
            "contactCTA": notion_plain_text(properties, ("Contact CTA", "ContactCTA")),
            "relatedHomeSections": notion_list(properties, ("Related Home Sections", "RelatedHomeSections")),
            "relatedEvidence": notion_list(properties, ("Related Evidence", "RelatedEvidence")),
            "relatedGlossaryTerms": notion_list(properties, ("Related Glossary Terms", "RelatedGlossaryTerms")),
            "changeLog": notion_list(properties, ("Change Log", "ChangeLog")),
        }
    )
    return row


def notion_glossary_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    return {
        "termKey": notion_plain_text(properties, ("Term Key", "TermKey", "Key", "EN Term")),
        "enSourceTerm": notion_plain_text(properties, ("EN Source Term", "English Source Term", "Source Term", "EN Term")),
        "preferredZhHans": notion_plain_text(properties, ("Preferred zh-Hans", "Preferred ZH", "Preferred Chinese", "Preferred ZH Term")),
        "reviewZhHansVariants": notion_plain_text(properties, ("Banned / Review zh-Hans Variants", "Review zh-Hans Variants", "Review Variants", "Forbidden ZH Term")),
        "clinicalContext": notion_plain_text(properties, ("Clinical Context", "Context")),
        "status": notion_plain_text(properties, ("Status",)).strip().lower(),
        "lastVerifiedDate": notion_plain_text(properties, ("Last Verified", "Last Verified Date", "Verified Date")),
        "relatedRecords": notion_list(properties, ("Related Records", "RelatedRecords")),
        "reviewerNote": notion_plain_text(properties, ("Reviewer Note", "Review Note")),
    }


def notion_change_log_row(page: dict[str, Any]) -> dict[str, Any]:
    properties = page.get("properties") or {}
    return {
        "changeId": notion_plain_text(properties, ("Change ID", "ChangeId", "Key", "Change Key")),
        "status": notion_plain_text(properties, ("Status", "Publish Status")).strip().lower(),
        "releaseScope": notion_list(properties, ("Release Scope", "ReleaseScope")),
        "changedStableKeys": notion_list(properties, ("Changed Stable Keys", "ChangedStableKeys", "Changed Section")),
        "rationale": notion_plain_text(properties, ("Rationale", "Reason")),
        "beforeAfterSummary": notion_plain_text(properties, ("Before / After Summary", "Before After Summary", "BeforeAfterSummary")),
        "sourceEvidenceNote": notion_plain_text(properties, ("Source / Evidence Note", "Source Evidence Note", "Evidence Note")),
        "editor": notion_plain_text(properties, ("Editor",)),
        "reviewer": notion_plain_text(properties, ("Reviewer",)),
        "enZhParityResult": notion_plain_text(properties, ("EN/ZH Parity Result", "EN ZH Parity Result")),
        "glossaryResult": notion_plain_text(properties, ("Glossary Result",)),
        "budgetResult": notion_plain_text(properties, ("Budget Result",)),
        "sensitiveInfoResult": notion_plain_text(properties, ("Sensitive-Info Result", "Sensitive Info Result")),
        "staticSafetyResult": notion_plain_text(properties, ("Static Safety Result",)),
        "exportTarget": notion_plain_text(properties, ("Export Target", "ExportTarget")),
        "exportDate": notion_plain_text(properties, ("Export Date", "ExportDate")),
        "rollbackNote": notion_plain_text(properties, ("Rollback Note", "RollbackNote")),
    }


NOTION_ROW_BUILDERS = {
    "homeSections": notion_home_section_row,
    "currentFocus": notion_current_focus_row,
    "evidenceTimeline": notion_evidence_row,
    "secondaryPages": notion_secondary_page_row,
    "translationGlossary": notion_glossary_row,
    "changeLog": notion_change_log_row,
}


def safe_report_messages(messages: list[str]) -> list[str]:
    safe: list[str] = []
    for message in messages:
        if message.startswith("long token-like string found:"):
            safe.append("long token-like string found in content")
        else:
            safe.append(message)
    return safe


def safe_report_payload(report: Report) -> dict[str, Any]:
    return {
        "counts": report.counts,
        "errors": safe_report_messages(report.errors),
        "warnings": safe_report_messages(report.warnings),
    }


def summarize_database_rows(rows: list[dict[str, Any]]) -> dict[str, Any]:
    statuses: dict[str, int] = {}
    publish: dict[str, int] = {"true": 0, "false": 0}
    visibility: dict[str, int] = {}
    eligible = 0
    for row in rows:
        status = str(row.get("status") or "missing")
        statuses[status] = statuses.get(status, 0) + 1
        publish_key = "true" if row.get("publish") is True else "false"
        publish[publish_key] += 1
        visibility_key = str(row.get("visibility") or "missing")
        visibility[visibility_key] = visibility.get(visibility_key, 0) + 1
        if is_static_export_eligible(row):
            eligible += 1
    return {
        "total": len(rows),
        "status": dict(sorted(statuses.items())),
        "publish": publish,
        "visibility": dict(sorted(visibility.items())),
        "exportEligible": eligible,
    }


def summarize_snapshot(databases: dict[str, list[dict[str, Any]]]) -> dict[str, Any]:
    return {name: summarize_database_rows(rows) for name, rows in databases.items()}


def setup_instruction_names() -> list[str]:
    return list(REQUIRED_NOTION_ENV)


def missing_env_summary() -> dict[str, Any]:
    return {
        "env": notion_env_status(),
        "missing": missing_notion_env(),
        "liveApiCalled": False,
        "secretsPrinted": False,
        "setupRequired": setup_instruction_names(),
    }


def notion_api_post(path: str, token: str, body: dict[str, Any]) -> dict[str, Any]:
    request = urllib.request.Request(
        NOTION_API_BASE + path,
        data=json.dumps(body).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Notion-Version": NOTION_API_VERSION,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            payload = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        code = ""
        try:
            body_text = error.read().decode("utf-8")
            parsed = json.loads(body_text)
            if isinstance(parsed, dict):
                code = str(parsed.get("code") or "")
        except Exception:
            code = ""
        detail = f"Notion API request failed with HTTP {error.code}"
        if code:
            detail += f" ({code})"
        raise RuntimeError(detail) from error
    except urllib.error.URLError as error:
        raise RuntimeError("Notion API request failed before receiving a response") from error

    parsed = json.loads(payload)
    if not isinstance(parsed, dict):
        raise RuntimeError("Notion API returned a non-object response")
    return parsed


def notion_query_pages(token: str, source_id: str) -> list[dict[str, Any]]:
    pages: list[dict[str, Any]] = []
    cursor: str | None = None
    while True:
        body: dict[str, Any] = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        response = notion_api_post(f"/data_sources/{source_id}/query", token, body)
        results = response.get("results") or []
        pages.extend(page for page in results if isinstance(page, dict))
        if response.get("has_more") is not True:
            return pages
        cursor = response.get("next_cursor")
        if not isinstance(cursor, str) or not cursor:
            raise RuntimeError("Notion API pagination response was incomplete")


def fetch_live_notion_snapshot() -> tuple[dict[str, Any], dict[str, int]]:
    token = os.environ["NOTION_TOKEN"]
    databases: dict[str, list[dict[str, Any]]] = {}
    raw_counts: dict[str, int] = {}
    for name, config in NOTION_DATABASES.items():
        source_id = os.environ[config["env"]]
        pages = notion_query_pages(token, source_id)
        raw_counts[name] = len(pages)
        builder = NOTION_ROW_BUILDERS[name]
        databases[name] = [builder(page) for page in pages]
    return {
        "schemaVersion": "v5-live-notion-static-sync-v1",
        "source": "notion-live-redacted",
        "databases": databases,
    }, raw_counts


def locale_text(row: dict[str, Any], locale_key: str) -> str:
    output = row.get("output")
    if isinstance(output, dict) and isinstance(output.get(locale_key), dict):
        return " ".join(iter_strings(output[locale_key]))

    block = row.get(locale_key) or {}
    if not isinstance(block, dict):
        return ""
    pieces: list[str] = []
    for key in ("title", "summary", "body"):
        if block.get(key):
            pieces.append(str(block[key]))
    tags = block.get("tags") or []
    if isinstance(tags, list):
        pieces.extend(str(tag) for tag in tags)
    return " ".join(pieces)


def validate_required_databases(data: dict[str, Any], report: Report) -> dict[str, list[dict[str, Any]]]:
    databases = data.get("databases")
    if not isinstance(databases, dict):
        report.error("missing databases object")
        return {}

    result: dict[str, list[dict[str, Any]]] = {}
    for name in REQUIRED_DATABASES:
        rows = databases.get(name)
        if not isinstance(rows, list):
            report.error(f"database {name} must be a list")
            result[name] = []
            continue
        result[name] = [row for row in rows if isinstance(row, dict)]
        if len(result[name]) != len(rows):
            report.error(f"database {name} contains non-object rows")
    return result


def validate_publishable_rows(databases: dict[str, list[dict[str, Any]]], report: Report) -> None:
    stable_keys: set[str] = set()
    for db_name in PUBLISHABLE_DATABASES:
        for index, row in enumerate(databases.get(db_name, []), start=1):
            row_label = f"{db_name}[{index}]"
            for field_name in REQUIRED_FIELDS:
                if field_name not in row:
                    report.error(f"{row_label} missing {field_name}")

            stable_key = str(row.get("stableKey", "")).strip()
            if not stable_key:
                report.error(f"{row_label} has blank stableKey")
            elif stable_key in stable_keys:
                report.error(f"duplicate stableKey {stable_key}")
            else:
                stable_keys.add(stable_key)

            status = row.get("status")
            if status not in STATUSES:
                report.error(f"{stable_key or row_label} has invalid status {status!r}")
            visibility = row.get("visibility")
            if visibility not in VISIBILITIES:
                report.error(f"{stable_key or row_label} has invalid visibility {visibility!r}")
            privacy_state = row.get("privacyState")
            if privacy_state not in PRIVACY_STATES:
                report.error(f"{stable_key or row_label} has invalid privacyState {privacy_state!r}")
            owner_approval_state = row.get("ownerApprovalState")
            if owner_approval_state not in OWNER_APPROVAL_STATES:
                report.error(f"{stable_key or row_label} has invalid ownerApprovalState {owner_approval_state!r}")
            if row.get("publish") is True and status != "approved":
                report.error(f"{stable_key or row_label} is publishable but not approved")
            if row.get("publish") is True and visibility == "hidden":
                report.error(f"{stable_key or row_label} is publishable but hidden")
            if row.get("publish") is True and privacy_state != "public_safe":
                report.error(f"{stable_key or row_label} is publishable but privacyState is not public_safe")
            if row.get("publish") is True and owner_approval_state not in OWNER_APPROVED_STATES:
                report.error(f"{stable_key or row_label} is publishable but ownerApprovalState is not approved or not_required")
            if is_static_export_eligible(row):
                if not isinstance(row.get("relatedGlossaryTerms"), list) or not row.get("relatedGlossaryTerms"):
                    report.error(f"{stable_key or row_label} is exportable but missing relatedGlossaryTerms")
                if not isinstance(row.get("changeLog"), list) or not row.get("changeLog"):
                    report.error(f"{stable_key or row_label} is exportable but missing changeLog relation")

            for locale_key in ("en", "zhHans"):
                locale = row.get(locale_key)
                if not isinstance(locale, dict):
                    report.error(f"{stable_key or row_label} missing {locale_key} object")
                    continue
                if status in {"review", "approved"} or row.get("publish") is True:
                    for field_name in REQUIRED_LOCALE_FIELDS:
                        if field_name not in locale:
                            report.error(f"{stable_key or row_label} missing {locale_key}.{field_name}")
                        elif field_name != "tags" and not str(locale.get(field_name, "")).strip():
                            report.error(f"{stable_key or row_label} has blank {locale_key}.{field_name}")
                    if not isinstance(locale.get("tags"), list):
                        report.error(f"{stable_key or row_label} {locale_key}.tags must be a list")

            max_en = row.get("maxEnWords")
            max_zh = row.get("maxZhHansCharacters")
            if not isinstance(max_en, int) or max_en <= 0:
                report.error(f"{stable_key or row_label} maxEnWords must be a positive integer")
            elif count_en_words(locale_text(row, "en")) > max_en:
                report.error(f"{stable_key or row_label} exceeds maxEnWords")
            if not isinstance(max_zh, int) or max_zh <= 0:
                report.error(f"{stable_key or row_label} maxZhHansCharacters must be a positive integer")
            elif count_zh_chars(locale_text(row, "zhHans")) > max_zh:
                report.error(f"{stable_key or row_label} exceeds maxZhHansCharacters")
            if db_name == "currentFocus":
                if isinstance(max_en, int) and max_en > CURRENT_FOCUS_MAX_EN_WORDS:
                    report.error(
                        f"{stable_key or row_label} maxEnWords exceeds currentFocus hard ceiling "
                        f"{CURRENT_FOCUS_MAX_EN_WORDS}"
                    )
                if isinstance(max_zh, int) and max_zh > CURRENT_FOCUS_MAX_ZH_HANS_CHARS:
                    report.error(
                        f"{stable_key or row_label} maxZhHansCharacters exceeds currentFocus hard ceiling "
                        f"{CURRENT_FOCUS_MAX_ZH_HANS_CHARS}"
                    )

            if (status == "approved" or row.get("publish") is True) and not str(row.get("sourceEvidenceNote", "")).strip():
                report.error(f"{stable_key or row_label} missing sourceEvidenceNote")
            if (status == "approved" or row.get("publish") is True) and not str(row.get("lastVerifiedDate", "")).strip():
                report.error(f"{stable_key or row_label} missing lastVerifiedDate")
            if (status == "approved" or row.get("publish") is True) and privacy_state != "public_safe":
                report.error(f"{stable_key or row_label} is approved but privacyState is not public_safe")
            gated_labels = owner_gated_claim_labels(row)
            if gated_labels and owner_approval_state != "approved":
                report.error(f"{stable_key or row_label} contains owner-gated claims without approved ownerApprovalState: {', '.join(gated_labels)}")

    report.counts["stableKeys"] = len(stable_keys)


def is_static_export_eligible(row: dict[str, Any]) -> bool:
    return (
        row.get("status") == "approved"
        and row.get("publish") is True
        and row.get("visibility") != "hidden"
        and row.get("privacyState") == "public_safe"
        and row.get("ownerApprovalState") in OWNER_APPROVED_STATES
    )


def owner_gated_claim_labels(row: dict[str, Any]) -> list[str]:
    text = "\n".join(iter_strings(row))
    labels: list[str] = []
    for label, regex in OWNER_GATED_PATTERNS:
        if regex.search(text):
            labels.append(label)
    return labels


def sorted_exportable_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    exportable = [row for row in rows if is_static_export_eligible(row)]
    return sorted(exportable, key=lambda item: (item.get("priority", 0), item.get("sort", 0), item.get("stableKey", "")))


def content_path_index(row: dict[str, Any], prefix: str) -> int | None:
    pattern = re.escape(prefix) + r"\[(\d+)\]$"
    match = re.match(pattern, str(row.get("contentPath", "")))
    if not match:
        return None
    return int(match.group(1))


def rows_by_content_path(rows: list[dict[str, Any]], prefix: str) -> list[dict[str, Any]]:
    return sorted(rows, key=lambda row: (content_path_index(row, prefix) if content_path_index(row, prefix) is not None else 9999, row.get("priority", 0), row.get("sort", 0), row.get("stableKey", "")))


def validate_content_path_sequence(rows: list[dict[str, Any]], prefix: str, label: str, report: Report) -> None:
    indexes: list[int] = []
    for row in rows:
        index = content_path_index(row, prefix)
        stable_key = row.get("stableKey", label)
        if index is None:
            report.error(f"{stable_key} must publish to {prefix}[n]")
            continue
        indexes.append(index)
    expected = list(range(len(rows)))
    if sorted(indexes) != expected:
        report.error(f"{label} contentPath indexes must be contiguous {expected}")


def validate_static_export_semantics(databases: dict[str, list[dict[str, Any]]], root: Path, report: Report) -> None:
    home_rows = sorted_exportable_rows(databases.get("homeSections", []))
    focus_rows = sorted_exportable_rows(databases.get("currentFocus", []))
    evidence_rows = sorted_exportable_rows(databases.get("evidenceTimeline", []))
    secondary_rows = sorted_exportable_rows(databases.get("secondaryPages", []))
    exportable_keys = {str(row.get("stableKey", "")).strip() for row in home_rows + focus_rows + evidence_rows + secondary_rows}
    changed_keys = {
        str(key).strip()
        for row in databases.get("changeLog", [])
        if row.get("status") == "approved"
        for key in (row.get("changedStableKeys") or [])
    }

    for missing_key in sorted(exportable_keys - changed_keys):
        report.error(f"{missing_key} is exportable but not listed in an approved changeLog.changedStableKeys row")

    if len(focus_rows) != 3:
        report.error("currentFocus must include exactly 3 approved publishable rows")
    for row in focus_rows:
        stable_key = row.get("stableKey", "currentFocus row")
        if row.get("focusType") not in CURRENT_FOCUS_TYPES:
            report.error(f"{stable_key} has invalid focusType")
        if row.get("visibility") != "visible":
            report.error(f"{stable_key} must use visibility=visible")
        if row.get("homepageSection") != "home.focus":
            report.error(f"{stable_key} must relate to homepageSection=home.focus")
    validate_content_path_sequence(focus_rows, "sections.focus.items", "currentFocus", report)

    selected_evidence = [row for row in evidence_rows if row.get("evidenceType") == "selected_evidence"]
    folded_timeline = [row for row in evidence_rows if row.get("evidenceType") == "full_timeline"]
    creative_projects = [
        row
        for row in home_rows
        if row.get("sectionKey") == "home.projects" and is_static_export_eligible(row)
    ]
    if creative_projects:
        # Creative homepage mode: clinical evidence archive is optional / unpublished.
        if selected_evidence and not 2 <= len(selected_evidence) <= 4:
            report.error("evidenceTimeline selected_evidence must include 2-4 approved publishable rows when present")
    elif not 2 <= len(selected_evidence) <= 4:
        report.error("evidenceTimeline selected_evidence must include 2-4 approved publishable rows")
    for row in selected_evidence:
        stable_key = row.get("stableKey", "selected_evidence row")
        if row.get("visibility") != "visible":
            report.error(f"{stable_key} must use visibility=visible")
    for row in folded_timeline:
        stable_key = row.get("stableKey", "full_timeline row")
        if row.get("visibility") != "folded":
            report.error(f"{stable_key} must use visibility=folded")
    validate_content_path_sequence(selected_evidence, "sections.timeline.evidence", "selected_evidence", report)
    validate_content_path_sequence(folded_timeline, "sections.timeline.items", "full_timeline", report)
    for row in evidence_rows:
        stable_key = row.get("stableKey", "evidenceTimeline row")
        if row.get("evidenceType") not in {"selected_evidence", "full_timeline"}:
            report.error(f"{stable_key} has invalid evidenceType")
        if row.get("homepageSection") != "home.timeline":
            report.error(f"{stable_key} must relate to homepageSection=home.timeline")
        for field_name in ("organization", "roleContext", "contentPath"):
            if not str(row.get(field_name, "")).strip():
                report.error(f"{stable_key} missing {field_name}")
        if not isinstance(row.get("clinicalDomain"), list) or not row.get("clinicalDomain"):
            report.error(f"{stable_key} clinicalDomain must be a non-empty list")

    expected_home_visibility = {
        "home.capability": "folded",
        "home.education": "folded",
        "home.language": "folded",
        "home.systems": "secondary",
    }
    for row in home_rows:
        stable_key = row.get("stableKey", "homeSections row")
        section_key = row.get("sectionKey")
        if section_key not in HOME_SECTION_KEYS:
            report.error(f"{stable_key} has invalid sectionKey")
        if row.get("recordKind") not in HOME_RECORD_KINDS:
            report.error(f"{stable_key} has invalid recordKind")
        expected = expected_home_visibility.get(section_key)
        if expected and row.get("visibility") != expected:
            report.error(f"{stable_key} must use visibility={expected}")

    for row in secondary_rows:
        stable_key = row.get("stableKey", "secondaryPages row")
        if row.get("visibility") != "secondary":
            report.error(f"{stable_key} must use visibility=secondary")
        for field_name in ("slug", "legacySlug", "pageType", "template", "relatedHomeSections"):
            if row.get(field_name) in ("", [], None):
                report.error(f"{stable_key} missing {field_name}")
        for slug_field in ("slug", "legacySlug"):
            slug = str(row.get(slug_field, "")).split("#", 1)[0]
            if slug and not (root / slug).exists():
                report.error(f"{stable_key} {slug_field} does not exist: {slug}")

    visible_rows = [
        row
        for row in home_rows + focus_rows + selected_evidence
        if row.get("visibility") == "visible" and row.get("recordKind") not in {"meta", "ui"}
    ]
    visible_en = " ".join(locale_text(row, "en") for row in visible_rows)
    visible_zh = " ".join(locale_text(row, "zhHans") for row in visible_rows)
    en_words = count_en_words(visible_en)
    zh_chars = count_zh_chars(visible_zh)
    report.counts["defaultVisibleEnWords"] = en_words
    report.counts["defaultVisibleZhHansCharacters"] = zh_chars
    creative = any(
        row.get("sectionKey") == "home.projects" and is_static_export_eligible(row)
        for row in databases.get("homeSections", [])
    )
    ceiling = 900 if creative else 650
    if en_words > ceiling:
        report.error(f"homepage default-visible English exceeds hard ceiling: {en_words} words")
    if zh_chars > 1300:
        report.error(f"homepage default-visible zh-Hans exceeds hard ceiling: {zh_chars} characters")


def validate_glossary(databases: dict[str, list[dict[str, Any]]], report: Report) -> None:
    rows = databases.get("translationGlossary", [])
    approved_terms = [row for row in rows if row.get("status") == "approved"]
    if not approved_terms:
        report.error("translationGlossary must include approved terms")

    preferred = {str(row.get("preferredZhHans", "")).strip() for row in approved_terms}
    required = {"近期重点", "重症护理判断", "老年健康连续照护", "临床流程与文档支持", "职业方向说明", "临床系统实践"}
    missing = sorted(term for term in required if term not in preferred)
    if missing:
        report.error("translationGlossary missing required preferred terms: " + ", ".join(missing))

    for index, row in enumerate(rows, start=1):
        for key in ("termKey", "enSourceTerm", "preferredZhHans", "status", "lastVerifiedDate"):
            if not str(row.get(key, "")).strip():
                report.error(f"translationGlossary[{index}] missing {key}")


def validate_change_log(databases: dict[str, list[dict[str, Any]]], report: Report) -> None:
    rows = databases.get("changeLog", [])
    if not rows:
        report.error("changeLog must include at least one mock release row")
        return
    for index, row in enumerate(rows, start=1):
        for key in ("changeId", "status", "releaseScope", "changedStableKeys", "rationale", "exportTarget"):
            if key not in row or row.get(key) in ("", [], None):
                report.error(f"changeLog[{index}] missing {key}")


def scan_text_safety(data: dict[str, Any], report: Report) -> None:
    text = "\n".join(iter_strings(data))
    lower_text = text.lower()
    for pattern in FORBIDDEN_PUBLIC_PATTERNS:
        if pattern.lower() in lower_text:
            report.error(f"forbidden public wording found: {pattern}")
    for pattern in FORBIDDEN_CHINESE_PATTERNS:
        if pattern in text:
            report.error(f"forbidden Chinese pattern found: {pattern}")
    for label, regex in (
        ("phone-like number", PHONE_RE),
        ("private address-like pattern", PRIVATE_ADDRESS_RE),
        ("license or registration number-like pattern", IDENTIFIER_RE),
        ("raw resume or certification artifact reference", RAW_FILE_RE),
    ):
        if regex.search(text):
            report.error(f"{label} found")
    for match in HIGH_ENTROPY_RE.findall(text):
        if not match.startswith("goal10-") and not match.endswith(".generated"):
            report.warn(f"long token-like string found: {match[:12]}...")


def validate_links(data: dict[str, Any], root: Path, report: Report) -> None:
    for value in iter_strings(data):
        local_part = value.split("#", 1)[0]
        if local_part.endswith(".html") or local_part.endswith(".png") or local_part.endswith(".jpg"):
            candidate = root / local_part
            if not candidate.exists():
                report.error(f"referenced local path does not exist: {value}")


def validate_sample(data: dict[str, Any], root: Path) -> Report:
    report = Report()
    databases = validate_required_databases(data, report)
    validate_publishable_rows(databases, report)
    validate_glossary(databases, report)
    validate_change_log(databases, report)
    validate_static_export_semantics(databases, root, report)
    scan_text_safety(data, report)
    validate_links(data, root, report)
    for name, rows in databases.items():
        report.counts[name] = len(rows)
    return report


def locale_output(row: dict[str, Any], sample_locale: str) -> dict[str, Any]:
    output = row.get("output")
    if not isinstance(output, dict):
        raise ValueError(f"{row.get('stableKey')} missing output object")
    value = output.get(sample_locale)
    if not isinstance(value, dict):
        raise ValueError(f"{row.get('stableKey')} missing output.{sample_locale}")
    return json.loads(json.dumps(value, ensure_ascii=False))


def ensure_section(content: dict[str, Any], locale: str, section: str) -> dict[str, Any]:
    sections = content[locale].setdefault("sections", {})
    value = sections.setdefault(section, {})
    if not isinstance(value, dict):
        raise ValueError(f"{locale}.sections.{section} must be an object")
    return value


def build_static_content(data: dict[str, Any]) -> dict[str, Any]:
    databases = data["databases"]
    content: dict[str, Any] = {"en": {"sections": {}}, "zh-Hans": {"sections": {}}}

    rows = sorted_exportable_rows(databases["homeSections"])
    for row in rows:
        kind = row.get("recordKind")
        section_key = str(row.get("sectionKey", ""))
        section = section_key.split(".", 1)[1] if section_key.startswith("home.") else section_key
        for output_locale, sample_locale in LOCALE_KEYS:
            payload = locale_output(row, sample_locale)
            if kind == "meta":
                content[output_locale]["meta"] = payload
            elif kind == "ui":
                content[output_locale]["ui"] = payload
            elif kind == "hero":
                content[output_locale]["hero"] = payload
            elif kind == "footer":
                content[output_locale]["footer"] = payload
            elif kind == "section":
                section_obj = ensure_section(content, output_locale, section)
                section_obj.update(payload)
                if section == "focus":
                    section_obj.setdefault("items", [])
                if section == "timeline":
                    section_obj.setdefault("evidence", [])
                    section_obj.setdefault("items", [])
            else:
                raise ValueError(f"unsupported homeSections recordKind: {kind}")

    focus_rows = rows_by_content_path(sorted_exportable_rows(databases["currentFocus"]), "sections.focus.items")
    for row in focus_rows:
        for output_locale, sample_locale in LOCALE_KEYS:
            ensure_section(content, output_locale, "focus").setdefault("items", []).append(locale_output(row, sample_locale))

    evidence_rows = sorted_exportable_rows(databases["evidenceTimeline"])
    selected_evidence = rows_by_content_path([row for row in evidence_rows if row.get("evidenceType") == "selected_evidence"], "sections.timeline.evidence")
    folded_timeline = rows_by_content_path([row for row in evidence_rows if row.get("evidenceType") == "full_timeline"], "sections.timeline.items")
    for row in selected_evidence + folded_timeline:
        bucket = "evidence" if row.get("evidenceType") == "selected_evidence" else "items"
        for output_locale, sample_locale in LOCALE_KEYS:
            ensure_section(content, output_locale, "timeline").setdefault(bucket, []).append(locale_output(row, sample_locale))

    return content


def validate_static_contract(content: dict[str, Any]) -> Report:
    report = Report()
    for locale in ("en", "zh-Hans"):
        locale_data = content.get(locale)
        if not isinstance(locale_data, dict):
            report.error(f"missing locale {locale}")
            continue
        for key in ("meta", "ui", "hero", "sections", "footer"):
            if key not in locale_data:
                report.error(f"{locale} missing {key}")
        sections = locale_data.get("sections", {})
        if not isinstance(sections, dict):
            report.error(f"{locale}.sections must be an object")
            continue
        projects_section = sections.get("projects")
        creative_mode = isinstance(projects_section, dict) and bool(projects_section.get("items"))
        if creative_mode:
            for section in ("focus", "contact"):
                if section not in sections:
                    report.error(f"{locale}.sections missing {section}")
            items = projects_section.get("items") or []
            if len(items) < 2:
                report.error(f"{locale}.sections.projects.items must include UMA and QDigest")
            else:
                names = [str(item.get("name", "")).strip().lower() for item in items if isinstance(item, dict)]
                if "uma" not in names:
                    report.error(f"{locale}.sections.projects missing UMA")
                if "qdigest" not in names and "qdigest" not in names:
                    # accept QDigest casing
                    if not any(n.replace(" ", "") in {"qdigest", "q-digest"} or "qdigest" in n for n in names):
                        if not any("qdigest" in n or n == "qdigest" for n in names):
                            if not any(str(item.get("name", "")).startswith("QDigest") or str(item.get("name", "")).startswith("QDigest") for item in items if isinstance(item, dict)):
                                if not any(str(item.get("name", "")) == "QDigest" for item in items if isinstance(item, dict)):
                                    report.error(f"{locale}.sections.projects missing QDigest")
                # order: UMA before QDigest
                try:
                    uma_i = next(i for i, item in enumerate(items) if isinstance(item, dict) and str(item.get("name", "")).strip().upper() == "UMA")
                    qd_i = next(i for i, item in enumerate(items) if isinstance(item, dict) and str(item.get("name", "")).strip().lower().startswith("qdigest"))
                    if uma_i > qd_i:
                        report.error(f"{locale}.sections.projects must list UMA before QDigest")
                except StopIteration:
                    pass
            if len(sections.get("focus", {}).get("items", [])) not in {2, 3}:
                report.error(f"{locale}.sections.focus.items must have 2-3 rows in creative mode")
            # Clinical-only buckets optional in creative mode; ignore hard counts.
        else:
            for section in REQUIRED_SECTIONS:
                if section not in sections:
                    report.error(f"{locale}.sections missing {section}")
        if not creative_mode:
            for section in DISCLOSURE_SECTIONS:
                section_data = sections.get(section, {})
                if not section_data.get("disclosureTitle") or not section_data.get("disclosureSummary"):
                    report.error(f"{locale}.sections.{section} missing disclosure copy")
            if len(sections.get("focus", {}).get("items", [])) != 3:
                report.error(f"{locale}.sections.focus.items must have 3 rows")
            if len(sections.get("practice", {}).get("items", [])) != 4:
                report.error(f"{locale}.sections.practice.items must have 4 rows")
            if len(sections.get("timeline", {}).get("evidence", [])) != 4:
                report.error(f"{locale}.sections.timeline.evidence must have 4 rows")
            if len(sections.get("timeline", {}).get("items", [])) != 6:
                report.error(f"{locale}.sections.timeline.items must have 6 rows")
            if len(sections.get("capability", {}).get("groups", [])) != 6:
                report.error(f"{locale}.sections.capability.groups must have 6 rows")
            if len(sections.get("education", {}).get("items", [])) != 5:
                report.error(f"{locale}.sections.education.items must have 5 rows")
            if len(sections.get("language", {}).get("items", [])) != 5:
                report.error(f"{locale}.sections.language.items must have 5 rows")
            if len(sections.get("systems", {}).get("links", [])) != 2:
                report.error(f"{locale}.sections.systems.links must have 2 rows")
    scan_text_safety(content, report)
    return report


def contract_shape(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: contract_shape(value[key]) for key in sorted(value)}
    if isinstance(value, list):
        if not value:
            return []
        return [contract_shape(item) for item in value]
    return type(value).__name__


def compare_contract_shape(candidate: dict[str, Any], current: dict[str, Any]) -> list[str]:
    errors: list[str] = []

    def walk(path: str, left: Any, right: Any) -> None:
        if isinstance(left, dict) and isinstance(right, dict):
            left_keys = set(left)
            right_keys = set(right)
            for key in sorted(left_keys - right_keys):
                errors.append(f"{path} has extra key {key}")
            for key in sorted(right_keys - left_keys):
                errors.append(f"{path} missing key {key}")
            for key in sorted(left_keys & right_keys):
                walk(f"{path}.{key}", left[key], right[key])
            return

        if isinstance(left, list) and isinstance(right, list):
            if len(left) != len(right):
                errors.append(f"{path} length {len(left)} does not match current length {len(right)}")
            for index, (left_item, right_item) in enumerate(zip(left, right)):
                walk(f"{path}[{index}]", left_item, right_item)
            return

        if type(left) is not type(right):
            errors.append(f"{path} type {type(left).__name__} does not match current type {type(right).__name__}")

    walk("SHAOTING_HOME_CONTENT", contract_shape(candidate), contract_shape(current))
    return errors


class JsDataParser:
    """Parse the data-only JS object literal subset used by homepage content."""

    def __init__(self, text: str) -> None:
        self.text = text
        self.index = 0

    def skip_ws(self) -> None:
        while self.index < len(self.text):
            char = self.text[self.index]
            if char.isspace():
                self.index += 1
                continue
            if self.text.startswith("//", self.index):
                end = self.text.find("\n", self.index)
                self.index = len(self.text) if end == -1 else end + 1
                continue
            if self.text.startswith("/*", self.index):
                end = self.text.find("*/", self.index + 2)
                if end == -1:
                    raise ValueError("unterminated JS block comment")
                self.index = end + 2
                continue
            break

    def parse(self) -> Any:
        value = self.parse_value()
        self.skip_ws()
        if self.index != len(self.text):
            raise ValueError(f"unexpected trailing JS literal content at offset {self.index}")
        return value

    def parse_value(self) -> Any:
        self.skip_ws()
        if self.index >= len(self.text):
            raise ValueError("unexpected end of JS literal")
        char = self.text[self.index]
        if char == "{":
            return self.parse_object()
        if char == "[":
            return self.parse_array()
        if char in {'"', "'"}:
            return self.parse_string()
        if self.text.startswith("true", self.index):
            self.index += 4
            return True
        if self.text.startswith("false", self.index):
            self.index += 5
            return False
        if self.text.startswith("null", self.index):
            self.index += 4
            return None
        return self.parse_number()

    def parse_object(self) -> dict[str, Any]:
        output: dict[str, Any] = {}
        self.expect("{")
        self.skip_ws()
        if self.accept("}"):
            return output
        while True:
            key = self.parse_key()
            self.skip_ws()
            self.expect(":")
            output[key] = self.parse_value()
            self.skip_ws()
            if self.accept("}"):
                return output
            self.expect(",")
            self.skip_ws()
            if self.accept("}"):
                return output

    def parse_array(self) -> list[Any]:
        output: list[Any] = []
        self.expect("[")
        self.skip_ws()
        if self.accept("]"):
            return output
        while True:
            output.append(self.parse_value())
            self.skip_ws()
            if self.accept("]"):
                return output
            self.expect(",")
            self.skip_ws()
            if self.accept("]"):
                return output

    def parse_key(self) -> str:
        self.skip_ws()
        if self.index < len(self.text) and self.text[self.index] in {'"', "'"}:
            return self.parse_string()
        match = IDENTIFIER_RE_JS.match(self.text, self.index)
        if not match:
            raise ValueError(f"expected JS object key at offset {self.index}")
        self.index = match.end()
        return match.group(0)

    def parse_string(self) -> str:
        quote = self.text[self.index]
        self.index += 1
        output: list[str] = []
        while self.index < len(self.text):
            char = self.text[self.index]
            self.index += 1
            if char == quote:
                return "".join(output)
            if char != "\\":
                output.append(char)
                continue
            if self.index >= len(self.text):
                raise ValueError("unterminated JS string escape")
            escaped = self.text[self.index]
            self.index += 1
            if escaped in {'"', "'", "\\"}:
                output.append(escaped)
            elif escaped == "n":
                output.append("\n")
            elif escaped == "r":
                output.append("\r")
            elif escaped == "t":
                output.append("\t")
            elif escaped == "b":
                output.append("\b")
            elif escaped == "f":
                output.append("\f")
            elif escaped == "u":
                code = self.text[self.index : self.index + 4]
                if len(code) != 4 or not re.fullmatch(r"[0-9A-Fa-f]{4}", code):
                    raise ValueError("invalid JS unicode escape")
                output.append(chr(int(code, 16)))
                self.index += 4
            elif escaped == "\n":
                continue
            else:
                output.append(escaped)
        raise ValueError("unterminated JS string")

    def parse_number(self) -> int | float:
        match = NUMBER_RE.match(self.text, self.index)
        if not match:
            raise ValueError(f"expected JS literal value at offset {self.index}")
        raw = match.group(0)
        self.index = match.end()
        if "." in raw or "e" in raw.lower():
            return float(raw)
        return int(raw)

    def accept(self, token: str) -> bool:
        if self.text.startswith(token, self.index):
            self.index += len(token)
            return True
        return False

    def expect(self, token: str) -> None:
        if not self.accept(token):
            raise ValueError(f"expected {token!r} at offset {self.index}")


def js_payload(content: dict[str, Any]) -> str:
    return GENERATED_JS_PREFIX + json.dumps(content, ensure_ascii=False, indent=2) + GENERATED_JS_SUFFIX


def extract_generated_json(text: str, strict: bool = False) -> dict[str, Any]:
    if strict:
        if not text.startswith(GENERATED_JS_PREFIX) or not text.endswith(GENERATED_JS_SUFFIX):
            raise ValueError("generated JS must match the review-only data wrapper exactly")
        return json.loads(text[len(GENERATED_JS_PREFIX) : -len(GENERATED_JS_SUFFIX)])

    marker = "window.SHAOTING_HOME_CONTENT = "
    start = text.find(marker)
    if start == -1:
        raise ValueError("generated JS missing content assignment")
    start += len(marker)
    end = text.rfind(";\n})(window);")
    if end == -1:
        raise ValueError("generated JS missing wrapper ending")
    return json.loads(text[start:end])


def load_content_js(path: Path, strict_generated: bool = False) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    try:
        return extract_generated_json(text, strict=strict_generated)
    except json.JSONDecodeError:
        if strict_generated:
            raise
        marker = "window.SHAOTING_HOME_CONTENT = "
        start = text.find(marker)
        if start == -1:
            raise ValueError("content JS missing content assignment")
        start += len(marker)
        end = text.rfind(";\n})(window);")
        if end == -1:
            raise ValueError("content JS missing wrapper ending")
        parsed = JsDataParser(text[start:end]).parse()
        if not isinstance(parsed, dict):
            raise ValueError("content assignment must be an object")
        return parsed


def command_validate(args: argparse.Namespace) -> int:
    sample_path = resolve_repo_path(args.sample)
    data = load_json(sample_path)
    report = validate_sample(data, REPO_ROOT)
    status = "PASS" if report.ok else "FAIL"
    dump_summary(
        status,
        sample=str(path_relative_to_repo(sample_path)),
        counts=report.counts,
        errors=report.errors,
        warnings=report.warnings,
    )
    return 0 if report.ok else 1


def command_export(args: argparse.Namespace) -> int:
    sample_path = resolve_repo_path(args.sample)
    output_arg = args.out or args.output
    if not output_arg:
        dump_summary("FAIL", errors=["export requires an output path, preferably --out content/generated/homepage-content.generated.js"])
        return 2
    if args.out and args.output and args.out != args.output:
        dump_summary("FAIL", errors=["provide the output path either positionally or with --out, not both"])
        return 2

    output_path = resolve_repo_path(output_arg)
    target_errors = output_target_errors(output_path, args.allow_production_overwrite)
    if target_errors:
        dump_summary(
            "FAIL",
            output=str(path_relative_to_repo(output_path)),
            errors=target_errors,
        )
        return 2
    data = load_json(sample_path)
    sample_report = validate_sample(data, REPO_ROOT)
    if not sample_report.ok:
        dump_summary("FAIL", sample=str(path_relative_to_repo(sample_path)), errors=sample_report.errors, warnings=sample_report.warnings)
        return 1
    content = build_static_content(data)
    contract_report = validate_static_contract(content)
    if not contract_report.ok:
        dump_summary("FAIL", output=str(path_relative_to_repo(output_path)), errors=contract_report.errors, warnings=contract_report.warnings)
        return 1
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = js_payload(content)
    output_path.write_text(payload, encoding="utf-8")
    dump_summary(
        "PASS",
        sample=str(path_relative_to_repo(sample_path)),
        output=str(path_relative_to_repo(output_path)),
        bytes=len(payload.encode("utf-8")),
        reviewOnly=not is_production_content_path(output_path),
        productionOverwrite=is_production_content_path(output_path),
        outputLocation="review-generated" if is_review_output_path(output_path) else "custom",
        networkAccess=False,
        credentialRequired=False,
        counts={**sample_report.counts, **contract_report.counts},
        warnings=sample_report.warnings + contract_report.warnings,
    )
    return 0


def command_check_output(args: argparse.Namespace) -> int:
    output_path = resolve_repo_path(args.output)
    content = load_content_js(output_path, strict_generated=True)
    report = validate_static_contract(content)
    status = "PASS" if report.ok else "FAIL"
    dump_summary(status, output=str(path_relative_to_repo(output_path)), errors=report.errors, warnings=report.warnings)
    return 0 if report.ok else 1


def command_compare_contract(args: argparse.Namespace) -> int:
    candidate_path = resolve_repo_path(args.candidate)
    current_path = resolve_repo_path(args.current)
    candidate = load_content_js(candidate_path, strict_generated=True)
    current = load_content_js(current_path)

    candidate_report = validate_static_contract(candidate)
    current_report = validate_static_contract(current)
    shape_errors = compare_contract_shape(candidate, current)
    errors = candidate_report.errors + [f"current: {error}" for error in current_report.errors] + shape_errors
    warnings = candidate_report.warnings + [f"current: {warning}" for warning in current_report.warnings]
    status = "PASS" if not errors else "FAIL"
    dump_summary(
        status,
        candidate=str(path_relative_to_repo(candidate_path)),
        current=str(path_relative_to_repo(current_path)),
        errors=errors,
        warnings=warnings,
    )
    return 0 if not errors else 1


def command_env_status(args: argparse.Namespace) -> int:
    dump_summary("PASS", env=notion_env_status(), secretsPrinted=False)
    return 0


def live_snapshot_or_skip() -> tuple[dict[str, Any] | None, dict[str, int]]:
    missing = missing_notion_env()
    if missing:
        return None, {}
    return fetch_live_notion_snapshot()


def command_live_dry_run(args: argparse.Namespace) -> int:
    try:
        snapshot, raw_counts = live_snapshot_or_skip()
    except RuntimeError as error:
        dump_summary(
            "FAIL",
            env=notion_env_status(),
            liveApiCalled=True,
            secretsPrinted=False,
            errors=[str(error)],
            warnings=[],
        )
        return 1
    if snapshot is None:
        dump_summary("SKIP", **missing_env_summary())
        return 0

    databases = snapshot.get("databases", {})
    report = validate_sample(snapshot, REPO_ROOT)
    status = "PASS" if report.ok else "FAIL"
    dump_summary(
        status,
        env=notion_env_status(),
        liveApiCalled=True,
        secretsPrinted=False,
        rawCounts=raw_counts,
        recordSummary=summarize_snapshot(databases if isinstance(databases, dict) else {}),
        **safe_report_payload(report),
    )
    return 0 if report.ok else 1


def command_live_export(args: argparse.Namespace) -> int:
    output_path = resolve_repo_path(args.out or str(DEFAULT_GENERATED_PATH))
    target_errors = output_target_errors(output_path, args.allow_production_overwrite, live=True)
    if target_errors:
        dump_summary(
            "FAIL",
            output=str(path_relative_to_repo(output_path)),
            errors=target_errors,
        )
        return 2

    try:
        snapshot, raw_counts = live_snapshot_or_skip()
    except RuntimeError as error:
        dump_summary(
            "FAIL",
            output=str(path_relative_to_repo(output_path)),
            env=notion_env_status(),
            liveApiCalled=True,
            secretsPrinted=False,
            errors=[str(error)],
            warnings=[],
        )
        return 1
    if snapshot is None:
        dump_summary("SKIP", output=str(path_relative_to_repo(output_path)), **missing_env_summary())
        return 0

    databases = snapshot.get("databases", {})
    sample_report = validate_sample(snapshot, REPO_ROOT)
    if not sample_report.ok:
        dump_summary(
            "FAIL",
            output=str(path_relative_to_repo(output_path)),
            env=notion_env_status(),
            liveApiCalled=True,
            secretsPrinted=False,
            rawCounts=raw_counts,
            recordSummary=summarize_snapshot(databases if isinstance(databases, dict) else {}),
            **safe_report_payload(sample_report),
        )
        return 1

    content = build_static_content(snapshot)
    contract_report = validate_static_contract(content)
    if not contract_report.ok:
        dump_summary(
            "FAIL",
            output=str(path_relative_to_repo(output_path)),
            env=notion_env_status(),
            liveApiCalled=True,
            secretsPrinted=False,
            rawCounts=raw_counts,
            recordSummary=summarize_snapshot(databases if isinstance(databases, dict) else {}),
            **safe_report_payload(contract_report),
        )
        return 1

    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = js_payload(content)
    output_path.write_text(payload, encoding="utf-8")
    dump_summary(
        "PASS",
        output=str(path_relative_to_repo(output_path)),
        bytes=len(payload.encode("utf-8")),
        reviewOnly=not is_production_content_path(output_path),
        productionOverwrite=is_production_content_path(output_path),
        outputLocation="review-generated" if is_review_output_path(output_path) else "custom",
        env=notion_env_status(),
        liveApiCalled=True,
        secretsPrinted=False,
        rawCounts=raw_counts,
        recordSummary=summarize_snapshot(databases if isinstance(databases, dict) else {}),
        counts={**sample_report.counts, **contract_report.counts},
        warnings=safe_report_messages(sample_report.warnings + contract_report.warnings),
        errors=[],
    )
    return 0


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Validate and export Notion-shaped editorial data. Sample mode is offline; live mode is manual and credential-safe."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    validate_parser = subparsers.add_parser("validate", help="validate a sample editorial export")
    validate_parser.add_argument("sample")
    validate_parser.set_defaults(func=command_validate)

    export_parser = subparsers.add_parser("export", help="validate and export a review-only static homepage candidate")
    export_parser.add_argument("sample")
    export_parser.add_argument("output", nargs="?")
    export_parser.add_argument("--out", help="review output path, normally content/generated/homepage-content.generated.js")
    export_parser.add_argument(
        "--allow-production-overwrite",
        action="store_true",
        help="explicitly allow writing content/homepage-content.js; use only after manual approval and diff review",
    )
    export_parser.set_defaults(func=command_export)

    check_parser = subparsers.add_parser("check-output", help="validate a generated static homepage candidate")
    check_parser.add_argument("output")
    check_parser.set_defaults(func=command_check_output)

    compare_parser = subparsers.add_parser("compare-contract", help="compare generated output structure with current production content")
    compare_parser.add_argument("candidate")
    compare_parser.add_argument("current")
    compare_parser.set_defaults(func=command_compare_contract)

    env_parser = subparsers.add_parser("env-status", help="show Notion environment variable presence without printing values")
    env_parser.set_defaults(func=command_env_status)

    live_dry_run_parser = subparsers.add_parser("live-dry-run", help="fetch live Notion records, validate them, and print redacted counts only")
    live_dry_run_parser.set_defaults(func=command_live_dry_run)

    live_export_parser = subparsers.add_parser("live-export", help="fetch live Notion records and export a review-only static candidate")
    live_export_parser.add_argument("--out", default=str(DEFAULT_GENERATED_PATH), help="review output path, normally content/generated/homepage-content.generated.js")
    live_export_parser.add_argument(
        "--allow-production-overwrite",
        action="store_true",
        help="explicitly allow writing content/homepage-content.js; use only after manual approval and diff review",
    )
    live_export_parser.set_defaults(func=command_live_export)

    args = parser.parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
