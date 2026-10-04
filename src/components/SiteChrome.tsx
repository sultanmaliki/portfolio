import DesignSwitcher from "./DesignSwitcher";
import LinkViewer from "./LinkViewer";
import ResumeViewer from "./ResumeViewer";
import SmoothAnchors from "./SmoothAnchors";

/**
 * Behaviour and overlays shared by every design: animated in-page links, the resume reader, the
 * link viewer and the design switcher. Mounted once in the root layout, so a design only has to
 * link to "#section", "/resume.pdf" or an external URL (see "@/lib/links" and "@/lib/resume").
 */
export default function SiteChrome() {
  return (
    <>
      <SmoothAnchors />
      <ResumeViewer />
      <LinkViewer />
      <DesignSwitcher />
    </>
  );
}
