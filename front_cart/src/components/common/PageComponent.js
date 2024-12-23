import "../../styles/PageComponent.scss";

const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="page-container">
      {serverData.prev && (
        <div
          className="prev-next"
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          Prev
        </div>
      )}

      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`page-item ${
            serverData.current === pageNum ? "active" : ""
          }`}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}

      {serverData.next && (
        <div
          className="prev-next"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          Next
        </div>
      )}
    </div>
  );
};

export default PageComponent;
