export default function VoiceResultCard({
  report,
}) {
  if (!report) return null;

  return (
    <div
      style={{
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        marginTop: 20,
      }}
    >
      <h3>Transcript</h3>

      <p>{report.transcript}</p>

      <h3>Scores</h3>

      <p>
        Technical:
        {report.technical_score}%
      </p>

      <p>
        Communication:
        {report.communication_score}%
      </p>

      <p>
        Problem Solving:
        {report.problem_solving_score}%
      </p>

      <p>
        Overall:
        {report.overall_score}%
      </p>

      <h3>Strengths</h3>

      <ul>
        {report.overall_strengths?.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>

      <h3>Areas For Improvement</h3>

      <ul>
        {report.areas_for_improvement?.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>

      <h3>Recommendations</h3>

      <ul>
        {report.recommendations?.map(
          (item, index) => (
            <li key={index}>{item}</li>
          )
        )}
      </ul>
    </div>
  );
}