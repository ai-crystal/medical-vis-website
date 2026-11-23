"""Build the site's portable dataset catalog from Crystal INFORAW headers."""
import argparse
from datetime import date
import json
from pathlib import Path
import re
import sys
from urllib.parse import parse_qsl, urlsplit


FRIENDLY_NAMES = {
    "Pandalina_brevirostris_Sylon_1b_whole_CT": "Pandalina brevirostris · specimen 1b",
    "Pandalina_brevirostris_Sylon_2b_whole_CT": "Pandalina brevirostris · specimen 2b",
    "Harmonia_axyridis_PP5_sample01_whole_prepupa_CT": "Harlequin ladybird prepupa",
    "Nemadus_microtomographicus_CT": "Nemadus microtomographicus",
    "Cretaciella_sorianoae_CT": "Cretaciella sorianoae",
    "Nicrophorus_americanus_whole_CT": "American burying beetle",
    "Electrohemiphlebia_barucheli_partial_fossil_grayscale_CT": "Cretaceous damselfly fossil",
    "Palaeopolycheles_nantosueltae_whole_CT_preview": "Egg-bearing Jurassic lobster · preview",
    "Palaemon_adspersus_whole_CT_preview": "Baltic prawn · preview",
    "TC18_Modern_Lobster_reference_low_resolution": "TC18 lobster · reference scan",
}
OLDER_RECORDS = {
    "OkinawaCrab.inforaw": {
        "description": "Okinawa crab thorax with some legs attached.",
        "source": "https://qim.compute.dtu.dk/pages/crab.html",
    },
}
URL = re.compile(r"https?://[^\s;<>\x22]+", re.I)
PRIVATE_QUERY = re.compile(r"token|secret|session|signature|credential|^auth", re.I)


def public_link(text):
    match = URL.search(text)
    if not match:
        return ""
    value = match.group().rstrip(".,;")
    parsed = urlsplit(value)
    if (not parsed.hostname or "." not in parsed.hostname or parsed.username or
            any(PRIVATE_QUERY.search(key) for key, _ in parse_qsl(parsed.query))):
        return ""
    return value


def note_with(notes, prefix):
    return next((note[len(prefix):].strip() for note in notes
                 if note.casefold().startswith(prefix.casefold())), "")


def category(path):
    group = path.parent.name.split("_", 1)[0]
    name = path.stem.casefold()
    if name.startswith("tc18_"):
        return "references"
    if (re.search(r"fossil|amber|secretanella|palaeopolycheles|cretaciella|nemadus", name)
            or name.startswith("electrohemiphlebia")):
        return "fossils"
    if group in {"02", "09"}:
        return "plants"
    if (group in {"05", "06", "08", "12"} or
            re.search(r"pandalina|palaemon|woodlouse|woodlice", name)):
        return "crustaceans"
    if group in {"01", "03", "04", "07", "13", "14"}:
        return "insects"
    return "animals"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--collection", type=Path, required=True)
    parser.add_argument("--crystal-source", type=Path, required=True)
    parser.add_argument("--snapshot", type=date.fromisoformat, required=True)
    args = parser.parse_args()

    converter = args.crystal_source / "Support" / "PyScripts"
    if not (converter / "convert_volume_to_inforaw.py").is_file():
        parser.error("--crystal-source must be the CrystalVis checkout")
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(converter.resolve()))
    from convert_volume_to_inforaw import read_header

    volumes = sorted(args.collection.glob("*/*.inforaw"))
    if not volumes:
        parser.error("No INFORAW files in this collection")
    if len({path.name for path in volumes}) != len(volumes):
        parser.error("Duplicate filenames in the collection")

    entries = []
    for path in volumes:
        with path.open("rb") as stream:
            metadata, _, notes = read_header(stream)
        older = OLDER_RECORDS.get(path.name, {})
        description = note_with(notes, "Specimen:") or older.get("description", "")
        preservation = note_with(notes, "Preservation scope:")
        if preservation:
            description = " ".join(filter(None, (description, preservation)))
        source = public_link(note_with(notes, "Source:")) or older.get("source", "")
        download = public_link(note_with(notes, "Original download:"))
        entries.append({
            "file": path.name,
            "name": FRIENDLY_NAMES.get(path.stem, path.stem.replace("_", " ")),
            "category": category(path),
            "description": description,
            "resolution": metadata.resolution,
            "spacing": metadata.spacing,
            "spacingUnit": metadata.spacing_unit,
            "type": metadata.dataformat,
            "bytes": path.stat().st_size,
            "source": source or download,
            "download": download,
            "license": note_with(notes, "License:"),
        })
    output = Path(__file__).resolve().parents[1] / "docs/.vuepress/theme/data/volume-catalog.json"
    output.parent.mkdir(exist_ok=True, parents=True)
    output.write_text(json.dumps({"snapshot": args.snapshot.isoformat(), "entries": entries},
                                 ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(entries)} volumes written to {output}")


if __name__ == "__main__":
    main()
