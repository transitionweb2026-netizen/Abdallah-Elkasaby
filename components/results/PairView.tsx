import { ResultVisual, type VisualData } from "./ResultVisual";
import styles from "./Results.module.css";

type PairViewProps = {
  before: VisualData;
  after: VisualData;
  labels: { before: string; after: string };
  aspect: number;
};

/** Side-by-side presentation of a before/after pair with a glass seam between. */
export function PairView({ before, after, labels, aspect }: PairViewProps) {
  return (
    <div className={styles.pair}>
      <figure className={styles.pairSide} style={{ aspectRatio: aspect }}>
        <ResultVisual visual={before} />
        <figcaption className={`${styles.stateLabel} ${styles.stateBefore}`}>{labels.before}</figcaption>
      </figure>
      <span className={styles.pairSeam} aria-hidden="true" />
      <figure className={styles.pairSide} style={{ aspectRatio: aspect }}>
        <ResultVisual visual={after} />
        <figcaption className={`${styles.stateLabel} ${styles.stateBefore}`}>{labels.after}</figcaption>
      </figure>
    </div>
  );
}
