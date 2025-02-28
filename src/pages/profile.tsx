import { useEffect, useState } from "react";
import { getProfile, User } from "../api/auth";
import GujaratMap from "../components/map";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for buttons

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

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] = useState<ProjectKey | "">("");
  const [leftBoxVisible, setLeftBoxVisible] = useState<boolean>(false);
  const [rightBoxVisible, setRightBoxVisible] = useState<boolean>(false);

  const projects = Object.keys(projectData) as ProjectKey[];

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        setIsAuthorized(true);
      })
      .catch(() => {
        setIsAuthorized(false);
        alert("Unauthorized! Please log in.");
      });
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {isAuthorized && (
        <div className="absolute inset-0">
          <GujaratMap selectedProject={selectedProject} />
        </div>
      )}

      {/* Top left Project Dropdown and Profile */}
      <div className="absolute top-4 left-4 flex items-center space-x-4 bg-white p-2 rounded shadow-md">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value as ProjectKey)}
          className="border p-2 rounded"
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

      {/* Left Info Box + Toggle */}
      <div
        className={`absolute top-1/4 left-0 h-auto max-w-[300px] bg-black bg-opacity-60 text-white p-4 border-r shadow-md transition-transform ${
          leftBoxVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-1/2 right-[-40px] transform -translate-y-1/2 bg-black bg-opacity-80 text-white p-2 rounded-r-md shadow-md"
          onClick={() => setLeftBoxVisible(!leftBoxVisible)}
        >
          <ChevronRight className={`transition-transform ${leftBoxVisible ? "rotate-180" : ""}`} />
        </button>

        <h3 className="text-lg font-bold">Left Panel Info</h3>
        {selectedProject && projectData[selectedProject] ? (
          Object.entries(projectData[selectedProject]).map(([key, value]) => (
            <p key={key}>
              <b>{key.replace(/([A-Z])/g, " $1")}:</b> {value}
            </p>
          ))
        ) : (
          <p>Select a project to view details.</p>
        )}
      </div>

      {/* Right Info Box + Toggle */}
      <div
        className={`absolute top-1/4 right-0 h-auto max-w-[300px] bg-black bg-opacity-60 text-white p-4 border-l shadow-md transition-transform ${
          rightBoxVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 bg-black bg-opacity-80 text-white p-2 rounded-l-md shadow-md"
          onClick={() => setRightBoxVisible(!rightBoxVisible)}
        >
          <ChevronLeft className={`transition-transform ${rightBoxVisible ? "rotate-180" : ""}`} />
        </button>

        <h3 className="text-lg font-bold">Right Panel Info</h3>
        {selectedProject && projectData[selectedProject] ? (
          Object.entries(projectData[selectedProject]).map(([key, value]) => (
            <p key={key}>
              <b>{key.replace(/([A-Z])/g, " $1")}:</b> {value}
            </p>
          ))
        ) : (
          <p>Select a project to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
