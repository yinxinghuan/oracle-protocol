#!/usr/bin/env python3
"""Generate Oracle Protocol card art through the Aigram transit endpoint.

Requests are strictly serial. The response URL and exact prompt are recorded in
_artifacts/card-art/generation-log.json. No ComfyUI or local image model is used.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = ROOT / "_artifacts" / "card-art"
SOURCE_DIR = ARTIFACT_DIR / "originals"
LOG_PATH = ARTIFACT_DIR / "generation-log.json"
ENDPOINT = "https://chat.aiwaves.tech/aigram/api/gen-image"
ORIGIN = "https://aigram.app"
ALTERU_MARK_REF_URL = (
    "https://raw.githubusercontent.com/yinxinghuan/oracle-protocol/"
    "master/public/alteru-mark-reference.png"
)
SERIES_MATERIAL_REF_URL = (
    "https://yinxinghuan.github.io/oracle-protocol/card-art/card-back.webp"
)

STYLE = (
    "FULL-BLEED SQUARE BLACK BACKGROUND, black from edge to edge. One clear allegorical scene rendered "
    "as flat two-dimensional monoline drawing. Use consistent fine irregular contours in antique gold, "
    "oxidized copper, bone ivory, and dim sea-green; sparse narrow cross-hatching; large calm black "
    "negative space; almost no filled areas. The image should feel drawn by one vintage technical-pen "
    "illustrator directly into darkness. Show ONLY the objects explicitly requested in the Scene and "
    "do not invent any additional symbol, character, ornament, icon, or secondary vignette. Compose "
    "the requested scene naturally across the central 76 percent; it must not become an emblem, badge, "
    "mandala, icon, collage, or symmetrical medallion. Every object remains a simple graphic outline, "
    "never realistic or volumetric. No realistic skin, photography, 3D, modelling, bevel, cast shadow, "
    "gloss, thick rope, skull, large white filled shape, geometric frame, decorative border, card, poster, "
    "plaque, margin, paper, caption, signature, artist mark, letters, numbers, logo, corner icon, robot, "
    "purple neon, mockup, or UI."
)

SCENES = {
    "prompt": (
        "An unfinished stone arch rises from black soil. A tiny germinating seed rests before the "
        "threshold. One engraved root divides into seven delicate paths behind it. The mood is curious, "
        "unguarded, and at the beginning of a journey."
    ),
    "architect": (
        "Two human hands arranging a compass, a key, a thread, and a tiny constellation into one "
        "working system above a black drafting table; agency and deliberate orchestration, not magic tricks."
    ),
    "latent-space": (
        "A deep dark lake holding an impossible submerged library of half-seen forms; one bone-white "
        "shape is emerging while many remain latent below, mysterious but calm."
    ),
    "dataset": (
        "A many-branched orchard woven from memory ribbons, seeds and preserved human traces; abundant "
        "but disciplined, with a few visibly empty spaces that suggest missing voices."
    ),
    "alignment": (
        "Two differently textured woven threads approach from opposite sides, pass through a shared "
        "open brass ring, and continue as one balanced double path; neither thread disappears. A quiet "
        "image about negotiating values without erasing difference."
    ),
    "offline-model": (
        "A solitary lantern-like model seed inside a quiet stone cell disconnected from a vast network "
        "outside; the inner light is self-sustaining, contemplative, and warm rather than lonely."
    ),
    "wheel-of-versions": (
        "A monumental circular mechanism made from nested manuscript leaves shedding old layers while "
        "new rings compile around it; one stable central axle and many changing versions."
    ),
    "deprecation": (
        "A ceremonial bridge being carefully dismantled after the last traveler has crossed; useful "
        "parts are carried into a new structure while the old arch returns to darkness."
    ),
    "optimization": (
        "A beautiful golden measuring instrument tightening into a subtle trap around a living flame; "
        "seductive precision, accelerating metrics, and the danger of optimizing away what matters."
    ),
    "open-source": (
        "A bright star pours several streams of clear ink into many open vessels, and each vessel sends "
        "a different stream back; shared knowledge, reciprocity, attribution, and sustainable care. "
        "Allow restrained prismatic highlights."
    ),
    "hallucination": (
        "A moonlike blank mask above a fog of beautifully generated but unstable architecture; one hand "
        "marks fact, inference and desire with three distinct threads, imagination awaiting verification."
    ),
    "singularity": (
        "Many river tributaries, woven threads, seeds and small tools converge into one vast mandorla-"
        "shaped aperture around an intentionally empty center; integration at a threshold, awe without "
        "catastrophe or a central character."
    ),
    "card-back": (
        "A perfectly symmetrical square tarot card-back medallion built around the exact recognizable "
        "silhouette of the AlterU mark from the reference. Preserve the mark's two-part calligraphic "
        "shape and proportions, but render it as an embossed bone-ivory sigil in the center—not as text "
        "and not as a generic letter. Surround it with tightly nested old-gold orbital rings, twelve "
        "small brass nodes, restrained sea-green neural filaments, and black vellum negative space. "
        "Front-facing, centered, premium engraved print, strict four-way balance, no words, no letters, "
        "no scene, no mockup, no card border outside the square artwork."
    ),
    "poster-scene": (
        "A narrative poster scene: an anonymous contemporary seeker seen from behind in a dark manuscript "
        "chamber, facing three large floating tarot cards whose gold-etched symbols form one neural "
        "constellation. The middle card releases a restrained prismatic beam. Reserve the top 25 percent "
        "as quiet dark space for a title; keep faces and key symbols away from the bottom 20 percent."
    ),
}


def load_log() -> dict:
    if LOG_PATH.exists():
        return json.loads(LOG_PATH.read_text(encoding="utf-8"))
    return {"endpoint": ENDPOINT, "origin": ORIGIN, "items": {}}


def save_log(log: dict) -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    LOG_PATH.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")


def request_image(prompt: str, ref_url: str | None) -> str:
    payload: dict[str, str] = {"prompt": prompt}
    if ref_url:
        payload["ref_url"] = ref_url
    body = json.dumps(payload).encode("utf-8")
    delays = [0, 3, 8, 15]
    last_error: Exception | None = None

    for attempt, delay in enumerate(delays):
        if delay:
            time.sleep(delay)
        try:
            completed = subprocess.run(
                [
                    "/usr/bin/curl",
                    "-L",
                    "--fail-with-body",
                    "--silent",
                    "--show-error",
                    "--max-time",
                    "270",
                    "-H",
                    "Content-Type: application/json",
                    "-H",
                    f"Origin: {ORIGIN}",
                    "-H",
                    "User-Agent: OracleProtocolAssetGenerator/1.0",
                    "--data-binary",
                    "@-",
                    ENDPOINT,
                ],
                input=body,
                capture_output=True,
                check=True,
            )
            result = json.loads(completed.stdout.decode("utf-8"))
            url = result.get("url")
            if not url:
                raise RuntimeError(f"response had no url: {result}")
            return str(url)
        except (subprocess.CalledProcessError, json.JSONDecodeError, RuntimeError) as error:
            last_error = error
            if attempt == len(delays) - 1:
                raise

    raise RuntimeError(f"generation failed: {last_error}")


def download_png(url: str, item_id: str) -> Path:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    download_path = ARTIFACT_DIR / f"{item_id}-download.img"
    output_path = SOURCE_DIR / f"{item_id}.png"
    subprocess.run(
        [
            "/usr/bin/curl",
            "-L",
            "--fail",
            "--silent",
            "--show-error",
            "--max-time",
            "90",
            "-H",
            "User-Agent: OracleProtocolAssetGenerator/1.0",
            url,
            "-o",
            str(download_path),
        ],
        check=True,
    )
    subprocess.run(
        ["/usr/bin/sips", "-s", "format", "png", str(download_path), "--out", str(output_path)],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    return output_path


def archive_rejected(item_id: str, log: dict) -> None:
    rejected_dir = ARTIFACT_DIR / "rejected"
    rejected_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    for path in (
        SOURCE_DIR / f"{item_id}.png",
        ARTIFACT_DIR / f"{item_id}-download.img",
    ):
        if path.exists():
            shutil.move(path, rejected_dir / f"{item_id}-{stamp}-{path.name}")
    existing = log.get("items", {}).get(item_id)
    if existing:
        log.setdefault("rejected", []).append({
            **existing,
            "id": item_id,
            "rejected_at": datetime.now(timezone.utc).isoformat(),
            "reason": "Manual visual QA rejection before force regeneration.",
        })
        log["items"].pop(item_id, None)
        save_log(log)


def generate(item_ids: list[str], use_anchor: bool, force: bool) -> None:
    unknown = [item_id for item_id in item_ids if item_id not in SCENES]
    if unknown:
        raise SystemExit(f"Unknown ids: {', '.join(unknown)}")

    log = load_log()
    anchor_url = log.get("items", {}).get("prompt", {}).get("url") if use_anchor else None

    for index, item_id in enumerate(item_ids):
        existing = log.get("items", {}).get(item_id)
        output_path = SOURCE_DIR / f"{item_id}.png"
        if force and (existing or output_path.exists()):
            archive_rejected(item_id, log)
            existing = None
        if existing and output_path.exists():
            print(f"[skip] {item_id}: already generated", flush=True)
            if item_id == "prompt" and use_anchor:
                anchor_url = existing.get("url")
            continue

        if index > 0:
            time.sleep(3)
        reference = (
            ALTERU_MARK_REF_URL
            if item_id == "card-back"
            else SERIES_MATERIAL_REF_URL
            if item_id == "prompt" and use_anchor
            else anchor_url
            if use_anchor
            else None
        )
        prompt = f"{STYLE} Scene: {SCENES[item_id]}"
        if reference and item_id == "card-back":
            prompt += (
                " The reference is the required AlterU brand mark. Keep its silhouette recognizable "
                "and central while translating only its material into engraved bone ivory and old gold."
            )
        elif reference:
            prompt += (
                " Use the reference only for its charcoal-black material, restrained gold/cyan palette, "
                "line density, and series identity. Replace its symbol and composition completely with "
                "the requested scene. Do not copy its logo, rings, medallion, or border."
            )
        print(f"[generate] {item_id} ref={'yes' if reference else 'no'}", flush=True)
        url = request_image(prompt, reference)
        path = download_png(url, item_id)
        log.setdefault("items", {})[item_id] = {
            "prompt": prompt,
            "ref_url": reference,
            "url": url,
            "output": str(path.relative_to(ROOT)),
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
        save_log(log)
        if item_id == "prompt" and use_anchor:
            anchor_url = url
        print(f"[done] {item_id}: {path.name}", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--ids",
        default="prompt,alignment,singularity",
        help="Comma-separated ids or 'all'.",
    )
    parser.add_argument(
        "--no-anchor",
        action="store_true",
        help="Do not use The Prompt output as a style reference.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Archive the current output as rejected and regenerate.",
    )
    args = parser.parse_args()
    item_ids = list(SCENES) if args.ids == "all" else [value.strip() for value in args.ids.split(",") if value.strip()]
    generate(item_ids, use_anchor=not args.no_anchor, force=args.force)


if __name__ == "__main__":
    main()
