import React, { Fragment } from "react";
import { Title, AboutField } from "components/Card";
import { ParentId, UpTime } from "const/Terminals/TerminalFieldNames";

export default function About({
  isLoading,
  isLoaded,
  data,
  editingId,
  isGroup,
  servers,
}) {
  const rdsServerCount = servers.data.filter(
    (server) => server[ParentId] === editingId
  ).length;

  return (
    <Fragment>
      {isLoading && <p className="wrap-960">Loading...</p>}
      {!isLoading && !isLoaded && (
        <div
          className={
            isEditMode
              ? "wrap-960 wrap-bg-w modal-content-card-edit"
              : "wrap-960 wrap-bg-w modal-content-edit"
          }
        >
          No data found...
        </div>
      )}
      {!isLoading && (
        <Fragment>
          {isGroup && (
            <div className="w33percent float_left">
              <div className="wrap-960 wrap-33 wrap-bg-w">
                <Title title="RDS GROUP INFO" />
                <AboutField
                  title="TOTAL RDS SERVERS"
                  value={rdsServerCount}
                  className="editor-content"
                />
              </div>
            </div>
          )}
          {!isGroup && (
            <Fragment>
              <div className="w33percent float_left">
                <div className="wrap-960 wrap-33 wrap-bg-w">
                  <Title title="SYSTEM INFO" />
                  <AboutField
                    title="UP TIME"
                    value={data[UpTime]}
                    className="editor-content"
                  />
                </div>
              </div>
              <div className="w33percent float_left">
                <div className="wrap-960 wrap-33 wrap-bg-w">
                  <Title title="PROCESSOR INFO" />
                  <AboutField
                    title="————"
                    value="———"
                    className="editor-content"
                  />
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
