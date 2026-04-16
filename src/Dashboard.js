import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deployMessage, setDeployMessage] = useState("");

  const accessToken = localStorage.getItem("access_token");
  const instanceUrl = localStorage.getItem("instance_url");

  const fetchValidationRules = async () => {
    try {
      setLoading(true);
      setError("");
      setDeployMessage("");

      if (!accessToken || !instanceUrl) {
        throw new Error("Missing access token or instance URL.");
      }

      const query =
        "SELECT Id, ValidationName, Active, EntityDefinition.QualifiedApiName FROM ValidationRule";

      const response = await fetch(
        `${instanceUrl}/services/data/v59.0/tooling/query/?q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.[0]?.message ||
            data?.message ||
            "Failed to fetch validation rules."
        );
      }

      setRules(data.records || []);
    } catch (err) {
      setError(err.message || "Failed to fetch validation rules.");
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && instanceUrl) {
      fetchValidationRules();
    } else {
      setError("Missing access token or instance URL.");
    }
  }, [accessToken, instanceUrl]);

  const updateRuleStatus = async (rule, newStatus) => {
    const singleRuleQuery = `SELECT Id, Metadata FROM ValidationRule WHERE Id = '${rule.Id}'`;

    const getResponse = await fetch(
      `${instanceUrl}/services/data/v59.0/tooling/query/?q=${encodeURIComponent(
        singleRuleQuery
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const getData = await getResponse.json();

    if (!getResponse.ok) {
      throw new Error(
        getData?.[0]?.message ||
          getData?.message ||
          "Failed to fetch rule metadata."
      );
    }

    const fullRule = getData.records?.[0];

    if (!fullRule || !fullRule.Metadata) {
      throw new Error("Rule metadata not found.");
    }

    const updateResponse = await fetch(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${rule.Id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Metadata: {
            ...fullRule.Metadata,
            active: newStatus,
          },
        }),
      }
    );

    if (!updateResponse.ok) {
      const errText = await updateResponse.text();
      throw new Error(errText || "Failed to update rule.");
    }
  };

  const toggleRule = async (rule) => {
    try {
      setLoading(true);
      setError("");
      setDeployMessage("");

      await updateRuleStatus(rule, !rule.Active);

      setRules((prev) =>
        prev.map((r) =>
          r.Id === rule.Id ? { ...r, Active: !r.Active } : r
        )
      );
    } catch (err) {
      setError("Error updating rule: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const enableAllRules = async () => {
    if (rules.length === 0) {
      setError("No validation rules found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to enable all validation rules?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setDeployMessage("");

      for (const rule of rules) {
        if (!rule.Active) {
          await updateRuleStatus(rule, true);
        }
      }

      setRules((prev) => prev.map((rule) => ({ ...rule, Active: true })));
    } catch (err) {
      setError("Enable All failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const disableAllRules = async () => {
    if (rules.length === 0) {
      setError("No validation rules found.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to disable all validation rules?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      setDeployMessage("");

      for (const rule of rules) {
        if (rule.Active) {
          await updateRuleStatus(rule, false);
        }
      }

      setRules((prev) => prev.map((rule) => ({ ...rule, Active: false })));
    } catch (err) {
      setError("Disable All failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deployChanges = () => {
    setDeployMessage(
      "Changes are already deployed to Salesforce successfully."
    );
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("instance_url");
    window.location.href = "/";
  };

  const filteredRules = rules.filter(
    (rule) =>
      rule.ValidationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.EntityDefinition?.QualifiedApiName?.toLowerCase().includes(
        searchTerm.toLowerCase()
      )
  );

  const activeCount = rules.filter((rule) => rule.Active).length;
  const inactiveCount = rules.length - activeCount;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="hero-card">
          <div>
            <h1 className="hero-title">Salesforce Validation Rule Manager</h1>
            <p className="hero-subtitle">
              Manage Salesforce validation rules with OAuth, Tooling API, and
              real-time updates.
            </p>
          </div>

          <button
            className="btn btn-outline"
            onClick={handleLogout}
            disabled={loading}
          >
            Logout
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Total Rules</p>
            <h3 className="stat-value">{rules.length}</h3>
          </div>
          <div className="stat-card">
            <p className="stat-label">Active</p>
            <h3 className="stat-value active-text">{activeCount}</h3>
          </div>
          <div className="stat-card">
            <p className="stat-label">Inactive</p>
            <h3 className="stat-value inactive-text">{inactiveCount}</h3>
          </div>
        </div>

        <div className="toolbar-card">
          <div className="toolbar-actions">
            <button
              className="btn btn-primary"
              onClick={fetchValidationRules}
              disabled={loading}
            >
              Get Validation Rules
            </button>

            <button
              className="btn btn-success"
              onClick={enableAllRules}
              disabled={loading || rules.length === 0}
            >
              Enable All
            </button>

            <button
              className="btn btn-danger"
              onClick={disableAllRules}
              disabled={loading || rules.length === 0}
            >
              Disable All
            </button>

            <button
              className="btn btn-secondary"
              onClick={deployChanges}
              disabled={loading}
            >
              Deploy Changes
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by rule name or object..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {deployMessage && (
          <div className="alert alert-success">{deployMessage}</div>
        )}
        {error && <div className="alert alert-error">{error}</div>}
        {loading && (
          <div className="alert alert-info loading-box">
            <div className="spinner"></div>
            <span>Processing request...</span>
          </div>
        )}

        <div className="table-card">
          <div className="table-header">
            <h2>Validation Rules</h2>
            <p>{filteredRules.length} rule(s) shown</p>
          </div>

          {!loading && !error && rules.length === 0 ? (
            <div className="empty-state">
              No validation rules found in this Salesforce org.
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="empty-state">No matching validation rules found.</div>
          ) : (
            <div className="table-wrapper">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>Rule Name</th>
                    <th>Object</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.map((rule) => (
                    <tr key={rule.Id}>
                      <td className="rule-name">{rule.ValidationName}</td>
                      <td>{rule.EntityDefinition?.QualifiedApiName || "N/A"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            rule.Active ? "status-active" : "status-inactive"
                          }`}
                        >
                          {rule.Active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn action-btn ${
                            rule.Active ? "btn-danger" : "btn-success"
                          }`}
                          onClick={() => toggleRule(rule)}
                          disabled={loading}
                        >
                          {rule.Active ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="dashboard-footer">
          Built by Shubham • Salesforce Tooling API Project
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;