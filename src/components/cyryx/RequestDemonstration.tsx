import { useState } from "react";
import { ArrowRight, Check, FileText } from "lucide-react";

/** A self-contained illustration. Preparing the sample never sends a request. */
export function RequestDemonstration() {
  const [prepared, setPrepared] = useState(false);
  return (
    <figure className="cinema-request-demo" data-request-demo>
      <figcaption>Illustrative client application / sample data</figcaption>
      <div className="cinema-request-stage">
        <div className="cinema-request-source">
          <div>
            <FileText size={18} aria-hidden />
            <span>THE ORIGINAL REQUEST</span>
          </div>
          <p>
            Please arrange an <strong>equipment inspection</strong> at{" "}
            <strong data-demo-source>Building B</strong>.
          </p>
          <span className="cinema-request-source-note">One message. A concrete job to do.</span>
        </div>
        <div className="cinema-request-connection" aria-hidden>
          <span data-request-line />
          <ArrowRight size={20} />
        </div>
        <div className="cinema-request-app">
          <div className="cinema-request-appbar">
            <span>Service desk</span>
            <span>Sample workspace</span>
          </div>
          <div className="cinema-request-content">
            <div className="cinema-request-title">
              <h3>New service request</h3>
              <span>{prepared ? "Draft prepared" : "Needs preparation"}</span>
            </div>
            <dl>
              <div>
                <dt>Work</dt>
                <dd>Equipment inspection</dd>
              </div>
              <div data-demo-target>
                <dt>Place</dt>
                <dd>Building B</dd>
              </div>
            </dl>
            <button type="button" aria-pressed={prepared} onClick={() => setPrepared(!prepared)}>
              {prepared ? "Reset example" : "Prepare visit"}
              <ArrowRight size={18} aria-hidden />
            </button>
            <div
              className="cinema-request-result"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <strong>
                {prepared ? "Visit draft prepared." : "A request, ready to work with."}
              </strong>
              <p>
                {prepared
                  ? "Equipment inspection · Building B · Ready for review"
                  : "Prepare the sample visit to see its next step."}
              </p>
            </div>
          </div>
          <div className="cinema-request-evidence" aria-label="Illustrative record">
            <span>
              <Check size={15} aria-hidden />
              Source linked
            </span>
            <span>
              <Check size={15} aria-hidden />
              Fields checked
            </span>
            <span>
              {prepared && <Check size={15} aria-hidden />}
              {prepared ? "Review next" : "Visit not prepared"}
            </span>
          </div>
        </div>
      </div>
      <span className="cinema-request-transfer" data-demo-transfer aria-hidden>
        Building B
      </span>
    </figure>
  );
}
