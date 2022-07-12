import React, { Fragment } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

export function LogTable(props) {
  const data = props.data;
  const headers =
    data[0] ?? props.type === "terminal"
      ? { ["Date"] : "2020-08-04T02:10:17Z",
          ["Level"] : "Info",
          ["Class"] : "SETTINGS",
          ["Content"] : "Login success",
        }
      : { ["Date"] : "2020-08-04T02:10:17Z",
          ["Level"] : "Info",
          ["Class"] : "SETTINGS",
          ["Content"] : "Login success",
        };

  let headerMaps = Object.keys(headers).reduce((headers, title) => {
    let header = {
      Header: title,
      accessor: title, // accessor is the "key" in the data
    };
    headers.push(header);
    return headers;
  }, []);
  let columns = React.useMemo(() => headerMaps, []);

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useSortBy,
    usePagination
  );

  return (
    <Fragment>
      <div
        className="log-table"
        style={props.type === "terminal" ? { maxHeight: "600px" } : {}}
      >
        <pre style={{ display: "none" }}>
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
              },
              null,
              2
            )}
          </code>
        </pre>
        <table id="log_table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx, all) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    align="left"
                    className={
                      all.length > 3 && idx === 2 ? "log-title-md" : ""
                    }
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="fas fa-caret-down"></i>
                        ) : (
                          <i className="fas fa-caret-up"></i>
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} width="fit-content">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <div
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          style={{ cursor: "pointer" }}
        >
          <i className="arrow-left mt-6 mr-16"></i>
        </div>
        <div style={{ marginTop: "2px" }}>
          {pageOptions.length < 9 && (
            <Fragment>
              <div
                className={
                  pageIndex + 1 === 1 ? "log-page page-selected" : "log-page"
                }
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {1}
              </div>
              {pageOptions.length > 1 ? (
                <div
                  className={
                    pageIndex + 1 === 2 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(1)}
                >
                  {2}
                </div>
              ) : null}
              {pageOptions.length > 2 ? (
                <div
                  className={
                    pageIndex + 1 === 3 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(2)}
                >
                  {3}
                </div>
              ) : null}
              {pageOptions.length > 3 ? (
                <div
                  className={
                    pageIndex + 1 === 4 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(3)}
                >
                  {4}
                </div>
              ) : null}
              {pageOptions.length > 4 ? (
                <div
                  className={
                    pageIndex + 1 === 5 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(4)}
                  disabled={!canPreviousPage}
                >
                  {5}
                </div>
              ) : null}
              {pageOptions.length > 7 ? (
                <div
                  className={
                    pageIndex + 1 === 6 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(5)}
                >
                  {6}
                </div>
              ) : null}
              {pageOptions.length > 6 ? (
                <div
                  className={
                    pageIndex + 1 === 7 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(6)}
                >
                  {7}
                </div>
              ) : null}
              {pageOptions.length > 7 ? (
                <div
                  className={
                    pageIndex + 1 === 8 ? "log-page page-selected" : "log-page"
                  }
                  onClick={() => gotoPage(7)}
                >
                  {8}
                </div>
              ) : null}
            </Fragment>
          )}
          {pageOptions.length - 8 > 0 &&
            (pageIndex < pageOptions.length - 6 ? (
              pageIndex - 2 < 0 ? (
                <Fragment>
                  <div
                    className={
                      pageIndex + 1 === 1
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    {1}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === 2
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(1)}
                  >
                    {2}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === 3
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(2)}
                  >
                    {3}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === 4
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(3)}
                  >
                    {4}
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div
                    className={
                      pageIndex + 1 === pageIndex - 1
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(pageIndex - 2)}
                    disabled={!canPreviousPage}
                  >
                    {pageIndex - 1}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === pageIndex
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(pageIndex - 1)}
                  >
                    {pageIndex}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === pageIndex + 1
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    // onChange={(e) => onChangePage(e)}
                    onClick={() => gotoPage(pageIndex)}
                  >
                    {pageIndex + 1}
                  </div>
                  <div
                    className={
                      pageIndex + 1 === pageIndex + 2
                        ? "log-page page-selected"
                        : "log-page"
                    }
                    onClick={() => gotoPage(pageIndex + 1)}
                  >
                    {pageIndex + 2}
                  </div>
                </Fragment>
              )
            ) : (
              <Fragment>
                <div
                  className={
                    pageIndex + 1 === pageOptions.length - 7
                      ? "log-page page-selected"
                      : "log-page"
                  }
                  onClick={() => gotoPage(pageCount - 8)}
                >
                  {pageOptions.length - 7}
                </div>
                <div
                  className={
                    pageIndex + 1 === pageOptions.length - 6
                      ? "log-page page-selected"
                      : "log-page"
                  }
                  onClick={() => gotoPage(pageCount - 7)}
                >
                  {pageOptions.length - 6}
                </div>
                <div
                  className={
                    pageIndex + 1 === pageOptions.length - 5
                      ? "log-page page-selected"
                      : "log-page"
                  }
                  onClick={() => gotoPage(pageCount - 6)}
                >
                  {pageOptions.length - 5}
                </div>
                <div
                  className={
                    pageIndex + 1 === pageOptions.length - 4
                      ? "log-page page-selected"
                      : "log-page"
                  }
                  onClick={() => gotoPage(pageCount - 5)}
                >
                  {pageOptions.length - 4}
                </div>
              </Fragment>
            ))}
          {pageOptions.length - 8 > 0 && (
            <Fragment>
              <div className="log-page" style={{ cursor: "default" }}>
                ...
              </div>
              <div
                className={
                  pageIndex + 1 === pageOptions.length - 3
                    ? "log-page page-selected"
                    : "log-page"
                }
                onClick={() => gotoPage(pageCount - 4)}
              >
                {pageOptions.length - 3}
              </div>
              <div
                className={
                  pageIndex + 1 === pageOptions.length - 2
                    ? "log-page page-selected"
                    : "log-page"
                }
                onClick={() => gotoPage(pageCount - 3)}
              >
                {pageOptions.length - 2}
              </div>
              <div
                className={
                  pageIndex + 1 === pageOptions.length - 1
                    ? "log-page page-selected"
                    : "log-page"
                }
                onClick={() => gotoPage(pageCount - 2)}
              >
                {pageOptions.length - 1}
              </div>
              <div
                className={
                  pageIndex + 1 === pageOptions.length - 0
                    ? "log-page page-selected"
                    : "log-page"
                }
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {pageOptions.length}
              </div>
            </Fragment>
          )}
        </div>
        <div
          onClick={() => nextPage()}
          disabled={!canNextPage}
          style={{ cursor: "pointer" }}
        >
          <i className="arrow-right mt-6"></i>
        </div>
        <select
          value={pageIndex}
          onChange={(e) => {
            gotoPage(Number(e.target.value));
          }}
          style={{ width: "100px", margin: "2px 12px" }}
        >
          {Array.from(Array(pageCount).keys()).map((pageIdx) => (
            <option key={pageIdx} value={pageIdx}>
              Page {pageIdx + 1}
            </option>
          ))}
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ margin: "4px 12px", width: "100px" }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize} rows
            </option>
          ))}
        </select>
      </div>
    </Fragment>
  );
}
