"""
Flask API that serves the trained model (best_job_match_model.pkl + scaler.pkl)
produced by the updated MLProject.ipynb.

IMPORTANT CHANGE from the previous version of this file:
The old model was trained on (and this file used to send it) the engineered
Skill_Gap_1..5 / Total_Skill_Gap / Experience_Gap columns, which are direct
arithmetic functions of the label definition (data leakage). The retrained
model no longer uses those columns at all -- it is trained only on raw
candidate/job attributes, with One-Hot Encoding (not LabelEncoder) for the
categorical columns. This file has been updated to match: it no longer
builds or sends any *_Gap / Total_* columns to the model.

The skill-gap breakdown shown in the UI (Overall Skill Match %, per-skill
deltas, months-of-experience gap, etc.) is still useful -- it's just plain
arithmetic, not something a model needs to "predict". This file now computes
it separately in `compute_gap_diagnostics()` and returns it alongside the
model's prediction, so the frontend has one source of truth instead of
duplicating this logic in matchingEngine.ts.

Run:
    pip install -r requirements.txt
    python app.py
Server listens on http://localhost:5001
"""

import os
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)  # allow the Vite dev server (different port) to call this API

# ---------------------------------------------------------------------------
# Load the artifacts produced at the end of MLProject.ipynb
# ---------------------------------------------------------------------------
model = joblib.load(os.path.join(BASE_DIR, "best_job_match_model_.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler_.pkl"))

# Exact column order (post one-hot-encoding) the model/scaler were fit on.
# Saved explicitly by the notebook -- do NOT reconstruct this by hand.
FEATURE_ORDER = joblib.load(os.path.join(BASE_DIR, "feature_columns.pkl"))

# The nominal categorical columns that were one-hot encoded during training.
# Any category value not seen during training simply produces an all-zero
# indicator vector for that column (i.e. it doesn't match any known
# category) -- this is the correct, honest way to handle an unseen/
# out-of-vocabulary category with one-hot encoding, unlike the previous
# LabelEncoder fallback which silently mapped unknown values to code 0
# (indistinguishable from a real category).
ONE_HOT_COLUMNS = ["Gender", "Vocational_Program", "Job_Title", "Location"]

NUMERIC_FIELDS = [
    "Age", "Academic_Performance", "Certifications_Count",
    "Internship_Experience", "Skill_1", "Skill_2", "Skill_3", "Skill_4", "Skill_5",
    "Required_Skill_1", "Required_Skill_2", "Required_Skill_3",
    "Required_Skill_4", "Required_Skill_5", "Min_Experience_Months",
]


def build_feature_row(payload: dict) -> pd.DataFrame:
    """
    Builds a single-row DataFrame matching FEATURE_ORDER exactly.
    Only raw candidate/job attributes are used -- no Skill_Gap / Total_*
    columns are computed or sent to the model.
    """
    skills = payload["skills"]          # {Skill_1..Skill_5}
    req_skills = payload["reqSkills"]   # {Required_Skill_1..Required_Skill_5}

    raw = {
        "Age": float(payload["age"]),
        "Academic_Performance": float(payload["academicPerformance"]),
        "Certifications_Count": float(payload["certificationsCount"]),
        "Internship_Experience": abs(float(payload["internshipExperience"])),
        "Min_Experience_Months": abs(float(payload["minExpMonths"])),
        "Skill_1": float(skills["Skill_1"]),
        "Skill_2": float(skills["Skill_2"]),
        "Skill_3": float(skills["Skill_3"]),
        "Skill_4": float(skills["Skill_4"]),
        "Skill_5": float(skills["Skill_5"]),
        "Required_Skill_1": float(req_skills["Required_Skill_1"]),
        "Required_Skill_2": float(req_skills["Required_Skill_2"]),
        "Required_Skill_3": float(req_skills["Required_Skill_3"]),
        "Required_Skill_4": float(req_skills["Required_Skill_4"]),
        "Required_Skill_5": float(req_skills["Required_Skill_5"]),
    }

    categorical_values = {
        "Gender": payload["gender"],
        "Vocational_Program": payload["vocationalProgram"],
        "Job_Title": payload["jobTitle"],
        "Location": payload["location"],
    }

    # Start every column at 0, then fill in what we actually know.
    row = {col: 0.0 for col in FEATURE_ORDER}
    for field, value in raw.items():
        if field in row:
            row[field] = value

    unknown_categories = {}
    for col, value in categorical_values.items():
        one_hot_col = f"{col}_{value}"
        if one_hot_col in row:
            row[one_hot_col] = 1.0
        else:
            # Value wasn't in the training vocabulary for this column.
            # Leave every dummy for this column at 0 (honest "unknown").
            unknown_categories[col] = value

    ordered = pd.DataFrame([[row[col] for col in FEATURE_ORDER]], columns=FEATURE_ORDER)
    return ordered, unknown_categories


def compute_gap_diagnostics(payload: dict) -> dict:
    """
    Plain arithmetic skill/experience gap breakdown for the UI. This is
    intentionally NOT fed into the model -- see module docstring.
    """
    skills = payload["skills"]
    req_skills = payload["reqSkills"]

    skill_vals = [float(skills[f"Skill_{i}"]) for i in range(1, 6)]
    req_vals = [float(req_skills[f"Required_Skill_{i}"]) for i in range(1, 6)]
    per_skill_gap = [skill_vals[i] - req_vals[i] for i in range(5)]

    total_candidate_skill = sum(skill_vals)
    total_required_skill = sum(req_vals)

    internship_experience = abs(float(payload["internshipExperience"]))
    min_experience_months = abs(float(payload["minExpMonths"]))

    return {
        "overallSkillMatchPct": round(
            100 * total_candidate_skill / total_required_skill, 1
        ) if total_required_skill else None,
        "totalCandidateSkill": total_candidate_skill,
        "totalRequiredSkill": total_required_skill,
        "perSkillGap": {f"Skill_{i+1}": per_skill_gap[i] for i in range(5)},
        "experienceGapMonths": internship_experience - min_experience_months,
        "internshipExperience": internship_experience,
        "minExperienceMonths": min_experience_months,
    }


@app.route("/api/match-analysis", methods=["POST"])
def match_analysis():
    payload = request.get_json(force=True)

    required_top_level = [
        "age", "gender", "vocationalProgram", "academicPerformance",
        "certificationsCount", "internshipExperience", "jobTitle",
        "minExpMonths", "location", "skills", "reqSkills",
    ]
    missing = [f for f in required_top_level if f not in payload]
    if missing:
        return jsonify({"error": f"Missing field(s): {missing}"}), 400

    try:
        x, unknown_categories = build_feature_row(payload)
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    # Keep the result as a DataFrame with column names (not a bare ndarray) --
    # both the scaler and the model were fit on named DataFrames, and sklearn
    # warns if you later pass them an unnamed array.
    x_scaled = pd.DataFrame(scaler.transform(x), columns=FEATURE_ORDER)
    prediction = int(model.predict(x_scaled)[0])
    probability = float(model.predict_proba(x_scaled)[0][1])

    response = {
        "isMatch": bool(prediction),
        "matchProbability": round(probability, 4),
        "modelUsed": type(model).__name__,
        "gapDiagnostics": compute_gap_diagnostics(payload),
    }
    if unknown_categories:
        # Non-fatal: just tells the caller these categories fell back to
        # "unknown" (all-zero one-hot) because they weren't in training data.
        response["warnings"] = {
            "unknownCategories": unknown_categories,
        }

    return jsonify(response)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": type(model).__name__,
        "numFeatures": len(FEATURE_ORDER),
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)