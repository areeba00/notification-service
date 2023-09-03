import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";

interface Applications {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  isActive: boolean;
}

interface ApiResponse {
  TotalCount: string;
  applications: Applications[];
}
function Applications() {
  const [applications, setApplications] = useState<Applications[]>([]);

  useEffect(() => {
    axios
      .get<ApiResponse>("http://localhost:5000/api/applications")
      .then((res) => setApplications(res.data.applications));
  }, []);
  return (
    <div className="container">
      <div className="row">
        {applications.map((app) => (
          <div key={app.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{app.name}</h5>
                <hr /> {/* Line below heading */}
                <p className="card-text text-center">{app.description}</p>
                <div className="text-center">
                  <button className="btn btn-link">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="btn btn-link">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="btn btn-link">
                    <FontAwesomeIcon
                      icon={app.isActive ? faToggleOn : faToggleOff}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applications;
