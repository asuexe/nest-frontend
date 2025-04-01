import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, User } from "../api/auth";
import GujaratMap from "../components/map";
import { ChevronLeft, ChevronRight } from "lucide-react";

const projectData = {
  "Project A": {
    siteName: "GHALA",
    phase: "Phase 1",
    villageName: "Thoradi",
    ownerCurrent: "Owner 1",
    ownerPrevious: "GMDC",
    khataNumber: "110011",
    surveyNumber: "13",
    landType: "Private",
    subLandType: "Irrigated",
    area: "1300.00 Ha.",
    ownershipType: "Govt. Land",
    document712: "View",
    hakkPatrak: "View",
    legalIssue: "--",
    existingLoan: "Yes",
    remarks: "Can be acquired",
    landAwardConsent: "View",
    amountOffered: "--",
    amountPaid: "--",
    landReferenceCase: "Yes",
    status: "NA",
    rr: "ongoing",
  },
  "Project B": null,
  "Project C": null,
} as const;

type ProjectKey = keyof typeof projectData;

const InfoPanel = ({
  position,
  visible,
  toggle,
  title,
  children,
}: {
  position: "left" | "right";
  visible: boolean;
  toggle: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <div
    className={`absolute top-1/4 ${position}-0 h-auto max-w-[300px] bg-black bg-opacity-60 text-white p-4 border-${
      position === "left" ? "r" : "l"
    } shadow-md transition-transform duration-300 ${
      visible
        ? "translate-x-0"
        : position === "left"
        ? "-translate-x-full"
        : "translate-x-full"
    }`}
  >
    <button
      className={`absolute top-1/2 ${
        position === "left" ? "right-[-40px]" : "left-[-40px]"
      } transform -translate-y-1/2 bg-black bg-opacity-80 text-white p-2 rounded-${
        position === "left" ? "r" : "l"
      }-md shadow-md`}
      onClick={toggle}
      aria-label={`Toggle ${position} panel`}
    >
      {position === "left" ? (
        <ChevronRight
          className={`transition-transform ${visible ? "rotate-180" : ""}`}
        />
      ) : (
        <ChevronLeft
          className={`transition-transform ${visible ? "rotate-180" : ""}`}
        />
      )}
    </button>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Ha\./g, "Hectares");

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<ProjectKey | "">("");
  const [leftBoxVisible, setLeftBoxVisible] = useState<boolean>(false);
  const [rightBoxVisible, setRightBoxVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const projects = Object.keys(projectData) as ProjectKey[];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const data = await getProfile(token);
        setUser(data.user);
        setIsAuthorized(true);
      } catch (err: any) {
        console.error("Profile fetch error:", err.response?.data || err);
        setIsAuthorized(false);
        alert("Unauthorized! Please log in.");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!isAuthorized) return null;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="absolute inset-0">
        <GujaratMap selectedProject={selectedProject} />
      </div>

      <div className="absolute top-4 left-4 flex items-center space-x-4 bg-white p-2 rounded shadow-md z-10">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value as ProjectKey)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select project"
        >
          <option value="">Select Project</option>
          {projects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
        <div className="font-semibold">
          {user ? `Welcome, ${user.username}` : "Loading..."}
        </div>
      </div>

      {/* Swap the panels here */}
      <InfoPanel
        position="left"
        visible={leftBoxVisible}
        toggle={() => setLeftBoxVisible(!leftBoxVisible)}
        title="Land Details 2"
      >
        {selectedProject && projectData[selectedProject] ? (
          <>
            {Object.entries(projectData[selectedProject])
              .filter(([key]) =>
                [
                  "siteName",
                  "villageName",
                  "khataNumber",
                  "surveyNumber",
                  "landType",
                  "area",
                ].includes(key)
              )
              .map(([key, value]) => (
                <p key={key} className="mb-1">
                  <span className="font-semibold">{formatKey(key)}:</span>{" "}
                  {value || "--"}
                </p>
              ))}
          </>
        ) : (
          <p>Select a project to view details</p>
        )}
      </InfoPanel>

      <InfoPanel
        position="right"
        visible={rightBoxVisible}
        toggle={() => setRightBoxVisible(!rightBoxVisible)}
        title="Legal Details 1"
      >
        {selectedProject && projectData[selectedProject] ? (
          <>
            {Object.entries(projectData[selectedProject])
              .filter(([key]) =>
                [
                  "ownershipType",
                  "legalIssue",
                  "existingLoan",
                  "landReferenceCase",
                  "status",
                ].includes(key)
              )
              .map(([key, value]) => (
                <p key={key} className="mb-1">
                  <span className="font-semibold">{formatKey(key)}:</span>{" "}
                  {value || "--"}
                </p>
              ))}
          </>
        ) : (
          <p>Select a project to view details</p>
        )}
      </InfoPanel>
    </div>
  );
};

export default Profile;
