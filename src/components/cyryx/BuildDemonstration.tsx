import { ArrowDown, ArrowRight, Check, FileText, Search } from "lucide-react";

type BuildView = "application" | "workflow" | "agent";

/** Original, explicitly illustrative UI. HTML keeps every label legible at phone sizes. */
export function BuildDemonstration({
  view = "application",
  opening = false,
}: {
  view?: BuildView;
  opening?: boolean;
}) {
  if (opening)
    return (
      <figure className="cinema-composition cinema-build-opening" data-opening>
        <figcaption className="cinema-demo-label">
          Illustrative build / from brief to software
        </figcaption>
        <div className="studio-input cinema-work-input">
          <span>THE BRIEF</span>
          <p>Requests. Tools. Tasks.</p>
          <div>
            <span>Documents</span>
            <span>Systems</span>
            <span>People</span>
          </div>
        </div>
        <div className="cinema-work-connection" aria-hidden>
          <span data-signal />
          <ArrowDown size={20} />
        </div>
        <div className="studio-screen cinema-workspace">
          <div className="cinema-workspace-bar">
            <span>DESIGNED AROUND YOUR WORK</span>
            <span aria-hidden>↗</span>
          </div>
          <p className="cinema-workspace-title">
            Your work.
            <br /> <strong>In software.</strong>
          </p>
          <div className="cinema-workspace-row">
            <FileText size={18} aria-hidden />
            <span>A useful application</span>
            <Check size={17} aria-hidden />
          </div>
          <div className="cinema-workspace-row">
            <ArrowRight size={18} aria-hidden />
            <span>Information, connected</span>
            <Check size={17} aria-hidden />
          </div>
          <p className="cinema-workspace-review">Built for the people using it.</p>
        </div>
      </figure>
    );

  return (
    <div className="cinema-composition cinema-service-demo" data-view={view}>
      <div
        key={view}
        className="cinema-plane-interface cinema-demo-result"
        aria-live="polite"
        aria-atomic="true"
      >
        {view === "application" && (
          <>
            <p className="cinema-demo-label">Illustrative application / sample tasks</p>
            <h3>Your work. In software.</h3>
            <div className="cinema-demo-app">
              <div className="cinema-demo-app-bar">
                <span>Project workspace</span>
                <span>Tasks</span>
              </div>
              <div>
                <span>Update the website</span>
                <span>In progress</span>
              </div>
              <div>
                <span>Review the catalog</span>
                <span>For review</span>
              </div>
              <div>
                <span>Share project files</span>
                <Check size={17} aria-label="Prepared" />
              </div>
            </div>
            <p className="cinema-demo-outcome">One place to manage the work.</p>
          </>
        )}
        {view === "workflow" && (
          <>
            <p className="cinema-demo-label">Illustrative integration / sample workflow</p>
            <h3>Connected work.</h3>
            <div className="cinema-demo-flow">
              <div>
                <FileText size={22} aria-hidden />
                <span>A new request</span>
              </div>
              <ArrowDown size={19} aria-hidden />
              <div>
                <span>Validate fields</span>
                <span>Connect systems</span>
              </div>
              <ArrowDown size={19} aria-hidden />
              <div>
                <Check size={20} aria-hidden />
                <strong>Queued for review</strong>
              </div>
            </div>
            <p className="cinema-demo-outcome">Less repetitive work between tools.</p>
          </>
        )}
        {view === "agent" && (
          <>
            <p className="cinema-demo-label">Illustrative AI assistant / sample task</p>
            <h3>A task, with boundaries.</h3>
            <div className="cinema-demo-agent">
              <p>Find the relevant project notes.</p>
              <div>
                <Search size={18} aria-hidden />
                <span>Approved documents · search only</span>
              </div>
              <div>
                <FileText size={20} aria-hidden />
                <strong>Answer with source references</strong>
              </div>
            </div>
            <p className="cinema-demo-outcome">A person checks the result.</p>
          </>
        )}
      </div>
    </div>
  );
}
