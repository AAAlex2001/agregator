import { getCriteriaSections } from "@/entities/lining";
import type { LiningCatalog, LiningExpertScores } from "@/entities/lining";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Справочник критериев, выставленные баллы и выбор нового балла. */
interface ExpertAssessmentProps {
  catalog: LiningCatalog;
  scores: LiningExpertScores;
  onSelect: (criterionId: number, score: number) => void;
}

/** Экспертная оценка условий надёжности баллами от 1 до 5 по разделам. */
export function ExpertAssessment({ catalog, scores, onSelect }: ExpertAssessmentProps) {
  const sections = getCriteriaSections(catalog.expert_criteria);
  const scoreValues = Object.keys(catalog.expert_score_labels).map(Number);

  return (
    <div className={styles.section}>
      <p className={styles.hint}>
        Оцените каждое условие надёжности баллом от 1 (неприемлемо) до 5 (отлично). Сумма
        удельных весов условий равна 1.
      </p>
      {sections.map((section) => (
        <div
          key={section.title}
          className={styles.group}
        >
          <h4 className={styles.title}>{section.title}</h4>
          <div className={styles.criteria}>
            {section.criteria.map((criterion) => (
              <div
                key={criterion.id}
                className={styles.criterion}
              >
                <span className={styles.name}>
                  {criterion.name}
                  <span className={styles.weight}>
                    удельный вес {criterion.weight.toFixed(2)}
                  </span>
                </span>
                <div className={styles.scores}>
                  {scoreValues.map((score) => (
                    <Checkbox
                      key={score}
                      id={`crit-${criterion.id}-${score}`}
                      checked={scores[criterion.id] === score}
                      onChange={() => onSelect(criterion.id, score)}
                    >
                      {score}
                    </Checkbox>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
